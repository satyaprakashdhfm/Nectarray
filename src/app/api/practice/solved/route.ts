import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { practiceProgress } from "@/lib/db/schema";
import { AccessError, requireEnrolled } from "@/lib/auth/access";

/**
 * Ticks off a practice question.
 *
 * The SQL workspace judges in the browser — the database it queries is
 * SQLite compiled to WASM — so the browser is what knows the answer matched,
 * and this is where that gets recorded. It is worth being clear-eyed that a
 * determined student could call this directly and tick off a question they
 * did not solve. They would be cheating themselves out of the only thing the
 * mark is for, and the alternative is shipping the answer key to no one and
 * running the query on a server, which is a lot of machinery to stop somebody
 * lying to their own progress bar.
 *
 * The Python track does not work this way: it is judged on the server,
 * against hidden tests, and ticks itself off there.
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

    await db
      .insert(practiceProgress)
      .values({ userId: user.id, questionId })
      .onConflictDoNothing();

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AccessError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    throw error;
  }
}
