import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { practiceQuestions } from "@/lib/db/schema";
import { AccessError, requireEnrolled } from "@/lib/auth/access";
import { getProblem } from "@/lib/python-tests";
import { readClock } from "@/lib/practice-clock";

/**
 * The reference solution for one question — if it has been earned.
 *
 * Both tracks come through here, and the answer is not in the page for
 * either. It used to be: the SQL workspace shipped `solution_sql` with every
 * question in the initial payload, so "locked" would have meant a disabled
 * button over an answer already sitting in the markup. Now the button asks,
 * and this decides.
 *
 * Fifteen minutes with the problem, or having already solved it. Anything
 * else gets the clock back and nothing to read.
 */
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const user = await requireEnrolled();
    const questionId =
      new URL(request.url).searchParams.get("questionId") ?? "";
    if (!questionId) {
      return NextResponse.json({ error: "Which question?" }, { status: 400 });
    }

    const clock = await readClock(user.id, questionId);
    if (!clock.unlocked) {
      return NextResponse.json(
        { ...clock, error: "Not yet." },
        { status: 403 },
      );
    }

    const [question] = await db
      .select({
        track: practiceQuestions.track,
        slug: practiceQuestions.slug,
        solutionSql: practiceQuestions.solutionSql,
        mysqlNote: practiceQuestions.mysqlNote,
      })
      .from(practiceQuestions)
      .where(eq(practiceQuestions.id, questionId))
      .limit(1);

    if (!question) {
      return NextResponse.json({ error: "Unknown question." }, { status: 404 });
    }

    if (question.track === "python") {
      const problem = question.slug ? await getProblem(question.slug) : null;
      if (!problem) {
        return NextResponse.json(
          { error: "No worked solution for this one." },
          { status: 404 },
        );
      }
      return NextResponse.json({
        ...clock,
        language: "python",
        solution: problem.solution_py,
      });
    }

    return NextResponse.json({
      ...clock,
      language: "sql",
      solution: question.solutionSql ?? "",
      note: question.mysqlNote,
    });
  } catch (error) {
    if (error instanceof AccessError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { error: "Could not read that." },
      { status: 400 },
    );
  }
}
