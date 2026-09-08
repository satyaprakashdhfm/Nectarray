import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { upsertUser } from "@/lib/auth/codes";
import { exchange } from "@/lib/auth/google";
import { isAdmin } from "@/lib/auth/access";
import { sameSecret, startSession } from "@/lib/auth/session";

/**
 * Where Google sends the browser back.
 *
 * Refuses anything whose state does not match what we set, refuses an
 * address Google will not vouch for, and only then starts a session.
 */
export const runtime = "nodejs";

const fail = (origin: string, why: string) =>
  NextResponse.redirect(`${origin}/academy?signin=1&error=${why}`);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;

  const jar = await cookies();
  const state = jar.get("na_oauth_state")?.value ?? "";
  const verifier = jar.get("na_oauth_verifier")?.value ?? "";
  jar.delete("na_oauth_state");
  jar.delete("na_oauth_verifier");

  const returned = url.searchParams.get("state") ?? "";
  const code = url.searchParams.get("code") ?? "";

  if (!code || !state || !verifier || !sameSecret(returned, state)) {
    return fail(origin, "state");
  }

  const identity = await exchange({ code, origin, verifier });
  if (!identity) return fail(origin, "exchange");

  // Google will tell us when it does not stand behind an address. Taking one
  // it does not vouch for would let somebody claim a student's account.
  if (!identity.emailVerified) return fail(origin, "unverified");

  const { userId } = await upsertUser(identity.email);

  // Fill in a name only where there is not one already — a student who typed
  // theirs into the form should not have Google overwrite it.
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const patch: Partial<typeof users.$inferInsert> = {};
  if (!user?.firstName && identity.firstName)
    patch.firstName = identity.firstName;
  if (!user?.lastName && identity.lastName) patch.lastName = identity.lastName;
  if (user && user.role !== "admin" && isAdmin(user)) patch.role = "admin";
  if (Object.keys(patch).length > 0) {
    await db.update(users).set(patch).where(eq(users.id, userId));
  }

  await startSession(userId, request.headers.get("user-agent"));

  const next = isAdmin(user ?? null) ? "/admin" : "/dashboard";
  return NextResponse.redirect(`${origin}${next}`);
}
