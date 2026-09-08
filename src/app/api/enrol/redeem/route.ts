import { NextResponse } from "next/server";
import { and, eq, gt, isNull, ne, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { cohorts, enrolmentCodes, enrolments } from "@/lib/db/schema";
import { AccessError, requireUser } from "@/lib/auth/access";

/**
 * Redeeming the code handed over once payment has cleared.
 *
 * This was a SECURITY DEFINER function in Postgres, and the interesting part
 * of it survives the move: the code is claimed in a single UPDATE with
 * `redeemed_by is null` in the WHERE. Two students racing the same code
 * cannot both win, because the second statement matches no row — the check
 * and the claim are one operation rather than a read followed by a write
 * that some other request can slip between.
 *
 * The seat check has to come after the claim, so the whole thing runs in a
 * transaction: a cohort that turns out to be full hands the code back.
 */
export const runtime = "nodejs";

export async function POST(request: Request) {
  let user;
  try {
    user = await requireUser();
  } catch (error) {
    if (error instanceof AccessError) {
      return NextResponse.json({ ok: false, error: "Sign in first." });
    }
    throw error;
  }

  let raw = "";
  try {
    const body = (await request.json()) as { code?: unknown };
    raw = String(body.code ?? "");
  } catch {
    return NextResponse.json({ ok: false, error: "Enter a code." });
  }

  // Accept what a human actually types: any case, spaces anywhere.
  const code = raw.replace(/\s/g, "").toUpperCase();
  if (!code) return NextResponse.json({ ok: false, error: "Enter a code." });

  const result = await db
    .transaction(async (tx) => {
      const [claimed] = await tx
        .update(enrolmentCodes)
        .set({ redeemedBy: user.id, redeemedAt: new Date() })
        .where(
          and(
            eq(enrolmentCodes.code, code),
            isNull(enrolmentCodes.redeemedBy),
            or(
              isNull(enrolmentCodes.expiresAt),
              gt(enrolmentCodes.expiresAt, new Date()),
            ),
          ),
        )
        .returning({ cohortId: enrolmentCodes.cohortId });

      if (!claimed) {
        return {
          ok: false as const,
          error: "That code is not valid, or has already been used.",
        };
      }

      const [cohort] = await tx
        .select({ seats: cohorts.seats })
        .from(cohorts)
        .where(eq(cohorts.id, claimed.cohortId))
        .limit(1);

      const [{ taken }] = await tx
        .select({ taken: sql<number>`count(*)::int` })
        .from(enrolments)
        .where(
          and(
            eq(enrolments.cohortId, claimed.cohortId),
            ne(enrolments.userId, user.id),
            sql`${enrolments.status} in ('enrolled', 'completed')`,
          ),
        );

      if (taken >= (cohort?.seats ?? 0)) {
        // Hand the code back rather than burning it on a full cohort.
        tx.rollback();
      }

      await tx
        .insert(enrolments)
        .values({
          userId: user.id,
          cohortId: claimed.cohortId,
          status: "enrolled",
        })
        .onConflictDoUpdate({
          target: [enrolments.userId, enrolments.cohortId],
          set: { status: "enrolled" },
        });

      return { ok: true as const };
    })
    .catch(() => ({ ok: false as const, error: "That cohort is full." }));

  return NextResponse.json(result);
}
