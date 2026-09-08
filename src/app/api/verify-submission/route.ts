import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  practiceAttempts,
  practiceProgress,
  practiceQuestions,
} from "@/lib/db/schema";
import { currentUser } from "@/lib/auth/session";

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

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  // Who is asking, from the session cookie — never from the body.
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  /*
   * The image arrives here rather than going to a bucket first.
   *
   * It used to be uploaded to storage, recorded as a path, and read back
   * seconds later by this route — which left a cupboard of other people's
   * screenshots on disk for no purpose anybody could name. It is read once,
   * so it is sent once, and nothing keeps it.
   */
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const questionId = String(form.get("questionId") ?? "");
  const image = form.get("image");

  if (!questionId || !(image instanceof File)) {
    return NextResponse.json({ error: "Missing the image." }, { status: 400 });
  }
  if (image.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "That image is over 5 MB." },
      { status: 413 },
    );
  }
  if (!image.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "That is not an image." },
      { status: 415 },
    );
  }

  const [question] = await db
    .select({
      id: practiceQuestions.id,
      title: practiceQuestions.title,
      prompt_md: practiceQuestions.promptMd,
      leetcode_url: practiceQuestions.leetcodeUrl,
    })
    .from(practiceQuestions)
    .where(eq(practiceQuestions.id, questionId))
    .limit(1);

  if (!question) {
    return NextResponse.json({ error: "Unknown question." }, { status: 404 });
  }

  // Recorded before the grading call, so an attempt that times out is still
  // on file rather than vanishing.
  const [attempt] = await db
    .insert(practiceAttempts)
    .values({ userId: user.id, questionId: question.id })
    .returning({ id: practiceAttempts.id });

  const attemptId = attempt.id;
  const bytes = new Uint8Array(await image.arrayBuffer());

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
            {
              type: "image",
              image: bytes,
              mediaType: image.type || "image/png",
            },
          ],
        },
      ],
    });

    const passed =
      object.isSubmissionScreenshot && object.problemMatches && object.accepted;

    await db
      .update(practiceAttempts)
      .set({
        status: passed ? "accepted" : "rejected",
        feedback: object.reason,
        model: MODEL,
        reviewedAt: new Date(),
      })
      .where(eq(practiceAttempts.id, attemptId));

    if (passed) {
      // Idempotent: re-proving a solved problem must not error.
      await db
        .insert(practiceProgress)
        .values({ userId: user.id, questionId: question.id })
        .onConflictDoNothing();
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
    await fail(attemptId, message);
    return NextResponse.json(
      { error: "The checker could not be reached. Try again in a moment." },
      { status: 502 },
    );
  }
}

/** Records that a check could not be completed, so it is not left pending. */
async function fail(attemptId: string, message: string) {
  await db
    .update(practiceAttempts)
    .set({
      status: "error",
      feedback: message.slice(0, 500),
      model: MODEL,
      reviewedAt: new Date(),
    })
    .where(eq(practiceAttempts.id, attemptId));
}
