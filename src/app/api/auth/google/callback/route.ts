import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { upsertUser } from "@/lib/auth/codes";
import { exchange, siteOrigin } from "@/lib/auth/google";
import { isAdmin } from "@/lib/auth/access";
import {
  attachCookies,
  sameSecret,
  startSession,
  type Realm,
} from "@/lib/auth/session";

/**
 * Where Google sends the browser back.
 *
 * Refuses anything whose state does not match what we set, refuses an
 * address Google will not vouch for, and only then starts a session.
 *
 * Every exit from here says why. A failure used to redirect to
 * /academy?signin=1&error=… and nothing on that page read either parameter,
 * so a student whose sign-in failed was returned to the marketing home page
 * with the modal shut and no message — indistinguishable from having clicked
 * the wrong thing. AuthLauncher reads them now.
 */
export const runtime = "nodejs";

/**
 * Back where they started, with the reason.
 *
 * The panel has its own door, so a failed admin sign-in belongs at
 * /admin/login rather than on the marketing home page with a student modal
 * open over it.
 */
const fail = (origin: string, realm: Realm, why: string) =>
  NextResponse.redirect(
    realm === "admin"
      ? `${origin}/admin/login?error=${why}`
      : `${origin}/academy?signin=1&error=${why}`,
  );

/** Clears the three short-lived OAuth cookies, whichever way this goes. */
function spent<T extends NextResponse>(response: T): T {
  for (const name of [
    "na_oauth_state",
    "na_oauth_verifier",
    "na_oauth_realm",
  ]) {
    response.cookies.set(name, "", { path: "/", maxAge: 0 });
  }
  return response;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = siteOrigin(request);

  const jar = await cookies();
  const state = jar.get("na_oauth_state")?.value ?? "";
  const verifier = jar.get("na_oauth_verifier")?.value ?? "";
  const realm: Realm =
    jar.get("na_oauth_realm")?.value === "admin" ? "admin" : "student";

  // Google says so itself when the student closes the consent screen.
  const denied = url.searchParams.get("error");
  if (denied) return spent(fail(origin, realm, "denied"));

  const returned = url.searchParams.get("state") ?? "";
  const code = url.searchParams.get("code") ?? "";

  if (!code || !state || !verifier || !sameSecret(returned, state)) {
    return spent(fail(origin, realm, "state"));
  }

  const identity = await exchange({ code, origin, verifier });
  if (!identity) return spent(fail(origin, realm, "exchange"));

  // Google will tell us when it does not stand behind an address. Taking one
  // it does not vouch for would let somebody claim a student's account.
  if (!identity.emailVerified) return spent(fail(origin, realm, "unverified"));

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

  const session = await startSession(
    userId,
    request.headers.get("user-agent"),
    realm,
  );

  /*
   * Where they were going. An admin sign-in lands in the panel — even when
   * the account turns out not to be an admin, because /admin/login is what
   * says so, and dropping them on the dashboard instead would look like the
   * panel had quietly refused them.
   */
  const next = realm === "admin" ? "/admin" : "/dashboard";
  return spent(
    attachCookies(NextResponse.redirect(`${origin}${next}`), session),
  );
}
