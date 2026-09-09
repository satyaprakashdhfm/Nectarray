import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { and, eq, gt, lt } from "drizzle-orm";
import { db } from "@/lib/db";
import { sessions, users, type User } from "@/lib/db/schema";

/**
 * Who is signed in, and how they got that way.
 *
 * A session is a row, not a token with claims baked into it. The cookie holds
 * 32 random bytes and the table holds their sha-256, which buys two things: a
 * stolen database backup cannot be used to sign in as anybody, and signing
 * someone out is a DELETE rather than a wait for an expiry to pass.
 *
 * There is no refresh dance. The cookie is good for thirty days and is
 * extended when it is more than half used, so a student who opens the
 * dashboard once a week never signs in twice.
 */

const COOKIE = "na_session";
/**
 * A second cookie, readable by scripts, holding nothing but the fact that
 * the first one exists.
 *
 * The marketing pages are static and must stay that way — a server-side
 * session lookup there would turn a cached page into a function call per
 * visitor. The header and the enrol button only need to know which label to
 * show, so they read this. It carries no identity and grants nothing: forging
 * it changes a word on a button and gets no further, because everything that
 * matters is checked against the real cookie on the server.
 */
const HINT = "na_signed_in";
const LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

const hash = (token: string) =>
  createHash("sha256").update(token).digest("hex");

/** A constant-time comparison, for anything a caller might guess at. */
export function sameSecret(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/**
 * A cookie a route means to send, described rather than sent.
 *
 * Every sign-in here happens in a route handler that builds its own
 * NextResponse — a redirect to Google, a redirect to the dashboard, a JSON
 * body. Setting a cookie through the ambient `cookies()` jar and then
 * returning a response you constructed yourself relies on Next merging the
 * two, which is one more thing to be wrong about in a flow whose failure
 * mode is a silent bounce back to the home page. So the session functions
 * hand back what should be set and the route puts it on the response it is
 * already returning, where it plainly belongs.
 */
export type CookieWrite = {
  name: string;
  value: string;
  options: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "lax";
    path: string;
    expires: Date;
  };
};

/** Puts a set of cookie writes onto a response that is about to be sent. */
export function attachCookies<T extends NextResponse>(
  response: T,
  writes: CookieWrite[],
): T {
  for (const write of writes) {
    response.cookies.set(write.name, write.value, write.options);
  }
  return response;
}

/** Starts a session. The caller is responsible for sending the cookies. */
export async function startSession(
  userId: string,
  userAgent?: string | null,
): Promise<CookieWrite[]> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + LIFETIME_MS);

  await db.insert(sessions).values({
    tokenHash: hash(token),
    userId,
    expiresAt,
    userAgent: userAgent?.slice(0, 400) ?? null,
  });

  return cookieWrites(token, expiresAt);
}

/** The pair: the session itself, and the hint the client scripts can read. */
function cookieWrites(token: string, expiresAt: Date): CookieWrite[] {
  const shared = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires: expiresAt,
  };
  return [
    { name: COOKIE, value: token, options: { ...shared, httpOnly: true } },
    { name: HINT, value: "1", options: { ...shared, httpOnly: false } },
  ];
}

/**
 * The signed-in user, or null.
 *
 * One query, joining the session to its owner, because every page needs both
 * and asking twice doubles the round trips on the slowest part of a render.
 */
export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  const rows = await db
    .select({ user: users, expiresAt: sessions.expiresAt })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(
      and(
        eq(sessions.tokenHash, hash(token)),
        gt(sessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  // Past halfway, push it out again — a weekly visitor should never be asked
  // to sign in twice, and rewriting on every request would be a write per
  // page view for no benefit.
  if (row.expiresAt.getTime() - Date.now() < LIFETIME_MS / 2) {
    void extend(token);
  }

  return row.user;
}

async function extend(token: string): Promise<void> {
  const expiresAt = new Date(Date.now() + LIFETIME_MS);
  await db
    .update(sessions)
    .set({ expiresAt })
    .where(eq(sessions.tokenHash, hash(token)));

  /*
   * The row is the source of truth and it has been extended. Pushing the
   * browser's copy out to match is a nicety, and it is only allowed from a
   * route handler or a server action — currentUser() is mostly called while
   * rendering a page, where setting a cookie throws. This used to be a bare
   * call inside a floating promise, so the throw surfaced as an unhandled
   * rejection on any visit past the halfway mark.
   */
  try {
    const jar = await cookies();
    for (const write of cookieWrites(token, expiresAt)) {
      jar.set(write.name, write.value, write.options);
    }
  } catch {
    // Rendering a page. The session lives on regardless.
  }
}

/**
 * Ends this session everywhere it counts: the row goes, then the cookie.
 *
 * Returns the cookie writes that clear the browser's copy — an expiry in the
 * past, which is a delete the response can actually carry.
 */
export async function endSession(): Promise<CookieWrite[]> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.tokenHash, hash(token)));
  }
  return cookieWrites("", new Date(0));
}

/**
 * Clears out sessions and codes that have expired.
 *
 * Called opportunistically rather than on a schedule: there is no cron here,
 * and a table of dead rows is a slow leak rather than a fault, so tidying it
 * during a sign-in nobody is timing is enough.
 */
export async function sweepExpired(): Promise<void> {
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
}
