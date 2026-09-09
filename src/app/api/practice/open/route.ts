import { NextResponse } from "next/server";
import { AccessError, requireEnrolled } from "@/lib/auth/access";
import { openQuestion } from "@/lib/practice-clock";

/**
 * Starts the fifteen-minute clock on a question, and reports where it stands.
 *
 * Called when a student opens a problem. Writing once and never again is what
 * makes it a clock rather than a stopwatch you can reset: coming back to a
 * question tomorrow does not buy another fifteen minutes of locked solution.
 */
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await requireEnrolled();
    const body = (await request.json()) as { questionId?: unknown };
    const questionId = String(body.questionId ?? "");
    if (!questionId) {
      return NextResponse.json({ error: "Which question?" }, { status: 400 });
    }

    return NextResponse.json(await openQuestion(user.id, questionId));
  } catch (error) {
    if (error instanceof AccessError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    // A question id that is not a uuid, most likely. Not worth a 500.
    return NextResponse.json(
      { error: "Could not open that." },
      { status: 400 },
    );
  }
}
