import "server-only";
import { createHash, randomInt } from "node:crypto";
import { and, eq, gt, lt, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { authCodes, users } from "@/lib/db/schema";

/**
 * The six-digit code that signs a student in.
 *
 * Six digits is a million possibilities, which is plenty for a person typing
 * one and nothing at all for a script, so the security is in the limits
 * rather than the length: a code lives ten minutes, survives five wrong
 * guesses, and asking for a new one invalidates every code already out for
 * that address.
 *
 * The code is stored hashed for the same reason a password would be. Nobody,
 * including us, can read a code out of the table and use it.
 */

const TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
/** Codes requested per address per hour, before we stop sending them. */
const MAX_PER_HOUR = 6;

const hash = (email: string, code: string) =>
  createHash("sha256").update(`${email}:${code}`).digest("hex");

export const normaliseEmail = (email: string) => email.trim().toLowerCase();

export type IssueResult =
  { ok: true; code: string } | { ok: false; reason: "too-many" };

/**
 * Issues a code, replacing any already outstanding for that address.
 *
 * Returns the code for the caller to email. It is never returned to a
 * browser, and never logged.
 */
export async function issueCode(rawEmail: string): Promise<IssueResult> {
  const email = normaliseEmail(rawEmail);
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(authCodes)
    .where(and(eq(authCodes.email, email), gt(authCodes.createdAt, hourAgo)));

  if (count >= MAX_PER_HOUR) return { ok: false, reason: "too-many" };

  // A new code retires the old ones. Two live codes for one address doubles
  // the guessing surface for no benefit to anybody.
  await db.delete(authCodes).where(eq(authCodes.email, email));

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await db.insert(authCodes).values({
    email,
    codeHash: hash(email, code),
    expiresAt: new Date(Date.now() + TTL_MS),
  });

  return { ok: true, code };
}

export type VerifyResult =
  | { ok: true; userId: string; isNew: boolean }
  | { ok: false; reason: "wrong" | "expired" };

/**
 * Checks a code and, if it holds up, makes sure there is a user behind it.
 *
 * Accepting a code is also what proves the address is real, so this is where
 * a user row is created — asking for a code does not create one, or anybody
 * could fill the table by typing addresses into the form.
 */
export async function verifyCode(
  rawEmail: string,
  rawCode: string,
): Promise<VerifyResult> {
  const email = normaliseEmail(rawEmail);
  const code = rawCode.trim();

  const [row] = await db
    .select()
    .from(authCodes)
    .where(eq(authCodes.email, email))
    .limit(1);

  if (!row || row.expiresAt < new Date())
    return { ok: false, reason: "expired" };

  if (row.attempts >= MAX_ATTEMPTS) {
    await db.delete(authCodes).where(eq(authCodes.id, row.id));
    return { ok: false, reason: "expired" };
  }

  if (row.codeHash !== hash(email, code)) {
    await db
      .update(authCodes)
      .set({ attempts: row.attempts + 1 })
      .where(eq(authCodes.id, row.id));
    return { ok: false, reason: "wrong" };
  }

  // Spent, whatever happens next.
  await db.delete(authCodes).where(eq(authCodes.id, row.id));

  return { ...(await upsertUser(email)), ok: true };
}

/**
 * Finds or creates the user for a verified address.
 *
 * Shared with the Google flow, which arrives with an address Google has
 * already vouched for.
 */
export async function upsertUser(
  rawEmail: string,
): Promise<{ userId: string; isNew: boolean }> {
  const email = normaliseEmail(rawEmail);

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    await db
      .update(users)
      .set({ emailVerifiedAt: new Date() })
      .where(eq(users.id, existing.id));
    return { userId: existing.id, isNew: false };
  }

  const [created] = await db
    .insert(users)
    .values({ email, emailVerifiedAt: new Date() })
    .returning({ id: users.id });

  return { userId: created.id, isNew: true };
}

/** Drops codes that nobody is going to type in. */
export async function sweepCodes(): Promise<void> {
  await db.delete(authCodes).where(lt(authCodes.expiresAt, new Date()));
}
