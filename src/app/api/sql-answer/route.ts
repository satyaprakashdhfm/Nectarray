import { NextResponse } from "next/server";
import { getAccess } from "@/lib/auth/access";
import { sqlAnswer } from "@/lib/sql-answers";

/**
 * The expected rows for one SQL practice question.
 *
 * These used to travel with the questions themselves: fifty-four answers,
 * 110 KB of JSON, sent on every visit to the practice page so that whichever
 * one the student happened to run could be compared. Now the workspace asks
 * for the one it is checking, the first time it checks it.
 *
 * Behind the enrolment gate, because it is the answer key. Not a secret worth
 * much — the reference solution is a button away in the same panel — but it
 * has no business being readable by anyone who is not taking the course.
 */
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { active } = await getAccess();
  if (!active) {
    return NextResponse.json({ error: "Not enrolled." }, { status: 403 });
  }

  const position = new URL(request.url).searchParams.get("position");
  const answer = position ? await sqlAnswer(position) : null;
  if (!answer) {
    return NextResponse.json({ error: "Unknown question." }, { status: 404 });
  }

  return NextResponse.json(answer);
}
