import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { academy, placements } from "@/lib/content";

/**
 * Answers an academy enquiry, and keeps a record of both halves.
 *
 * The form used to email the answers and say "thanks". Someone had just
 * described their background and what they were aiming at, and got nothing
 * back about whether this programme actually suits them — which is the one
 * question they filled it in to ask.
 *
 * The reply is grounded in the real syllabus, assembled below from the same
 * content the page renders. That is deliberate: a model given no source will
 * happily agree the course covers whatever was asked about, and a student
 * who enrols on a promise the curriculum does not keep is a refund and a bad
 * review. It answers from what is taught, and where that is not what someone
 * needs it says so and points at the nearest thing.
 *
 * Both the enquiry and the reply are written to academy_enquiries, so an
 * admin can see what an applicant was actually told rather than guess.
 */

export const runtime = "nodejs";
export const maxDuration = 30;

const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.6-flash";

const Answer = z.object({
  fit: z
    .enum(["strong", "partial", "elsewhere"])
    .describe(
      "strong when the programme teaches what they are after; partial when it covers some of it; elsewhere when it genuinely does not.",
    ),
  reply: z
    .string()
    .describe(
      "Two or three sentences, addressed to them as 'you'. Plain English, no bullet points, no greeting, no sign-off.",
    ),
});

/** The syllabus, from the same content the page renders. */
function courseBrief() {
  const { course } = academy;
  const modules = course.curriculum
    .map(
      (m) =>
        `${m.n}. ${m.title} — ${m.summary}\n   Covers: ${m.topics
          .map((t) => t.title)
          .join(", ")}`,
    )
    .join("\n");

  return `PROGRAMME: ${course.title}
${course.summary}

WHAT IT TEACHES, IN ORDER:
${modules}

ALSO INCLUDED:
${course.offerings.map((o) => `- ${o.title}: ${o.body}`).join("\n")}

PLACEMENT SUPPORT:
${placements.includes.map((i) => `- ${i.title}: ${i.body}`).join("\n")}`;
}

const PROMPT = `You answer enquiries about a training programme, for the person who just filled in the form.

Here is the programme, and it is the only thing you may claim it teaches:

{brief}

The enquiry:
  Background: {background}
  Current experience: {experience}
  What they want: {goal}
  When they want to start: {timeline}

Write a short, warm, direct reply telling them how this programme fits what they are after.

Rules that matter more than being agreeable:
- Only credit the programme with what the syllabus above actually lists. Never invent a module, a tool or a topic.
- If what they want IS covered, say so specifically — name the part of the programme that does it. Be encouraging; this is someone who wants to learn.
- If it is PARTLY covered, say which part is and which part is not, and what they would still need to do themselves.
- If it genuinely is not what they need, say that plainly and point them at the nearest thing the programme does do. Do not talk them into it.
- Someone starting from no coding experience is a good fit, not a problem — the programme begins there.
- Never promise a job, a salary, or a placement outcome.
- Do not mention prices or dates.

Address them as "you". Two or three sentences.`;

type Body = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  background?: unknown;
  experience?: unknown;
  goal?: unknown;
  timeline?: unknown;
};

const str = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const enquiry = {
    name: str(body.name, 120),
    email: str(body.email, 200),
    phone: str(body.phone, 40),
    background: str(body.background, 200),
    experience: str(body.experience, 200),
    goal: str(body.goal, 200),
    timeline: str(body.timeline, 200),
  };

  if (!enquiry.name || !enquiry.email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 },
    );
  }

  let fit: "strong" | "partial" | "elsewhere" | "unknown" = "unknown";
  let reply = "";

  try {
    const { object } = await generateObject({
      model: google(MODEL),
      schema: Answer,
      prompt: PROMPT.replace("{brief}", courseBrief())
        .replace("{background}", enquiry.background || "not given")
        .replace("{experience}", enquiry.experience || "not given")
        .replace("{goal}", enquiry.goal || "not given")
        .replace("{timeline}", enquiry.timeline || "not given"),
    });
    fit = object.fit;
    reply = object.reply;
  } catch (error) {
    // The enquiry still has to be recorded and the applicant still has to be
    // told something. A missing key or a model timeout is our problem, not
    // theirs, so it degrades to the answer a human would have sent anyway.
    console.error("[academy-fit] model call failed:", error);
  }

  /*
   * Recorded with the service role. The table has no insert policy on
   * purpose: the form is public, so granting `anon` insert would be an open
   * write endpoint on a table of names, emails and phone numbers. Writing it
   * here also means `fit` and `reply` can only be set by the thing that
   * produced them.
   */
  const admin = createAdminClient();
  if (admin) {
    const { error } = await admin.from("academy_enquiries").insert({
      ...enquiry,
      phone: enquiry.phone || null,
      fit,
      reply: reply || null,
      model: reply ? MODEL : null,
      message: [
        `Background: ${enquiry.background}`,
        `Experience: ${enquiry.experience}`,
        `Goal: ${enquiry.goal}`,
        `Wants to start: ${enquiry.timeline}`,
      ].join("\n"),
    });
    // Logged, never surfaced: the applicant's reply must not fail because
    // our record-keeping did.
    if (error) console.error("[academy-fit] could not record enquiry:", error);
  } else {
    console.error(
      "[academy-fit] SUPABASE_SERVICE_ROLE_KEY is not set — enquiry not recorded",
    );
  }

  return NextResponse.json({ fit, reply });
}
