import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/**
 * Checks a student's proof that they solved a Python problem.
 *
 * There is no way to check a LeetCode solution from here. LeetCode publishes
 * no API, and the hidden test cases a verdict depends on are not served by
 * the unofficial GraphQL endpoint either — they are the product. So the
 * evidence is the student's own accepted submission, and the grader reads the
 * screenshot the way a human marker would: is this the right problem, and
 * does it actually say Accepted?
 *
 * The verdict is written here rather than by the browser. A student can lodge
 * an attempt but cannot judge one — row-level security closes the verdict
 * columns and the Python progress rows to them, so a tick means a grader put
 * it there.
 */

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.6-flash";

const Verdict = z.object({
  isSubmissionScreenshot: z
    .boolean()
    .describe(
      "True only if this is a screenshot of a coding judge's submission result page.",
    ),
  problemMatches: z
    .boolean()
    .describe("True if the problem shown is the one that was set."),
  accepted: z
    .boolean()
    .describe(
      "True only if the judge's verdict visible in the image is Accepted or an equivalent pass.",
    ),
  problemSeen: z
    .string()
    .describe("The problem title visible in the image, or an empty string."),
  verdictSeen: z
    .string()
    .describe("The verdict text visible in the image, or an empty string."),
  reason: z
    .string()
    .describe("One or two sentences the student will read. Address them."),
});

const PROMPT = `You are marking a student's proof that they solved a programming problem.

They were set this problem:
  Title: {title}
  Description: {prompt}
  Link: {url}

The image is what they submitted as evidence. Decide, from the image alone:

1. Is it a screenshot of a coding judge's submission result (LeetCode, HackerRank, Codeforces or similar)? A photo of a screen counts. An editor with code but no verdict does not, and neither does a picture of the problem statement on its own.
2. Does the problem in the image match the problem that was set? Titles are often worded slightly differently, and the same problem appears under different names on different sites — judge it on what the problem actually asks, not on an exact string match.
3. Does the image show a passing verdict? "Accepted", "All test cases passed", a green tick with a runtime and memory figure. "Wrong Answer", "Time Limit Exceeded", "Runtime Error", a partial score, or a submission still running are all failures.

Be strict about 3 and fair about 2. If the image is cropped, blurred or unreadable, do not guess — say it cannot be read and fail it.

Write "reason" to the student in the second person, plainly, saying what you saw and what to do next if it did not pass.`;

export async function POST(request: Request) {
  // Who is asking, from the session cookie — never from the body.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      {
        error:
          "Checking is not configured yet. Set SUPABASE_SERVICE_ROLE_KEY on the deployment.",
      },
      { status: 503 },
    );
  }

  let attemptId: string;
  try {
    const body = (await request.json()) as { attemptId?: unknown };
    if (typeof body.attemptId !== "string" || !body.attemptId) throw new Error();
    attemptId = body.attemptId;
  } catch {
    return NextResponse.json({ error: "Missing attempt." }, { status: 400 });
  }

  // Read the attempt as the *admin*, then check it belongs to the caller.
  // Trusting the id alone would let anyone grade anyone else's upload.
  const { data: attempt } = await admin
    .from("practice_attempts")
    .select("id, user_id, question_id, image_path, status")
    .eq("id", attemptId)
    .maybeSingle();

  if (!attempt || attempt.user_id !== user.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  if (attempt.status !== "pending") {
    return NextResponse.json(
      { error: "That attempt has already been checked." },
      { status: 409 },
    );
  }

  const { data: question } = await admin
    .from("practice_questions")
    .select("id, title, prompt_md, leetcode_url, track")
    .eq("id", attempt.question_id)
    .maybeSingle();

  if (!question) {
    return NextResponse.json({ error: "Unknown question." }, { status: 404 });
  }

  const { data: file, error: downloadError } = await admin.storage
    .from("submissions")
    .download(attempt.image_path);

  if (downloadError || !file) {
    await fail(admin, attemptId, "The uploaded image could not be read.");
    return NextResponse.json(
      { error: "The uploaded image could not be read." },
      { status: 400 },
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());

  try {
    const { object } = await generateObject({
      model: google(MODEL),
      schema: Verdict,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: PROMPT.replace("{title}", question.title)
                .replace("{prompt}", question.prompt_md ?? "(none given)")
                .replace("{url}", question.leetcode_url ?? "(none given)"),
            },
            { type: "image", image: bytes, mediaType: file.type || "image/png" },
          ],
        },
      ],
    });

    const passed =
      object.isSubmissionScreenshot && object.problemMatches && object.accepted;

    await admin
      .from("practice_attempts")
      .update({
        status: passed ? "accepted" : "rejected",
        feedback: object.reason,
        model: MODEL,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", attemptId);

    if (passed) {
      // Idempotent: re-proving a solved problem must not error.
      await admin
        .from("practice_progress")
        .upsert(
          { user_id: user.id, question_id: question.id },
          { onConflict: "user_id,question_id" },
        );
    }

    return NextResponse.json({
      accepted: passed,
      reason: object.reason,
      problemSeen: object.problemSeen,
      verdictSeen: object.verdictSeen,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The checker did not respond.";
    await fail(admin, attemptId, message);
    return NextResponse.json(
      { error: "The checker could not be reached. Try again in a moment." },
      { status: 502 },
    );
  }
}

type Admin = NonNullable<ReturnType<typeof createAdminClient>>;

/** Records that a check could not be completed, so it is not left pending. */
async function fail(admin: Admin, attemptId: string, message: string) {
  await admin
    .from("practice_attempts")
    .update({
      status: "error",
      feedback: message.slice(0, 500),
      model: MODEL,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", attemptId);
}
