import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { practiceOpens, practiceProgress } from "@/lib/db/schema";

/**
 * The wait before a student can read the answer.
 *
 * Fifteen minutes with the problem, or having already solved it. The point of
 * a practice sheet is the quarter of an hour spent stuck, and a reveal button
 * sitting next to the editor makes that quarter of an hour optional in a way
 * almost nobody resists at eleven at night.
 *
 * The clock is a row rather than something in the browser on purpose. A lock
 * that lifts when you clear local storage is not a lock, it is a suggestion;
 * and since the answer has to come from the server anyway for it to be
 * withheld at all, the check belongs at the same door.
 */
export const WAIT_MS = 15 * 60 * 1000;

export type Clock = {
  /** When the fifteen minutes started, as epoch milliseconds. */
  openedAt: number;
  /** When the solution becomes readable. Equal to openedAt once solved. */
  unlocksAt: number;
  unlocked: boolean;
  solved: boolean;
};

/**
 * Starts the clock for a student on a question, or reads the one already
 * running. Reopening a problem tomorrow does not restart the wait — the
 * insert does nothing when a row is already there.
 */
export async function openQuestion(
  userId: string,
  questionId: string,
): Promise<Clock> {
  await db
    .insert(practiceOpens)
    .values({ userId, questionId })
    .onConflictDoNothing();

  return readClock(userId, questionId);
}

/** The clock as it stands, without starting one. */
export async function readClock(
  userId: string,
  questionId: string,
): Promise<Clock> {
  const [[open], [done]] = await Promise.all([
    db
      .select({ openedAt: practiceOpens.openedAt })
      .from(practiceOpens)
      .where(
        and(
          eq(practiceOpens.userId, userId),
          eq(practiceOpens.questionId, questionId),
        ),
      )
      .limit(1),
    db
      .select({ solvedAt: practiceProgress.solvedAt })
      .from(practiceProgress)
      .where(
        and(
          eq(practiceProgress.userId, userId),
          eq(practiceProgress.questionId, questionId),
        ),
      )
      .limit(1),
  ]);

  const solved = Boolean(done);

  /*
   * No row means they have not opened it — which is not the same as having
   * just opened it. Report the full wait from now rather than treating an
   * unopened question as unlocked, so calling this endpoint directly buys
   * nothing.
   */
  const openedAt = open ? open.openedAt.getTime() : Date.now();
  const unlocksAt = solved ? openedAt : openedAt + WAIT_MS;

  return {
    openedAt,
    unlocksAt,
    solved,
    unlocked: solved || Date.now() >= unlocksAt,
  };
}
