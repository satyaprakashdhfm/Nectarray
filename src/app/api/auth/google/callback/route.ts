import { ADMIN } from "@/lib/admin-path";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { upsertUser } from "@/lib/auth/users";
import { exchange, siteOrigin } from "@/lib/auth/google";
import { isAdmin } from "@/lib/auth/access";
import {
  mintAppCode,
  validAppReturn,
  validChallenge,
} from "@/lib/auth/app-codes";
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
const failOnSite = (origin: string, realm: Realm, why: string) =>
  NextResponse.redirect(
    realm === "admin"
      ? `${origin}${ADMIN}/login?error=${why}`
      : `${origin}/academy?signin=1&error=${why}`,
  );

/**
 * Back to the Android app, with a code or the reason there is none.
 *
 * The app reads `error` with the same words the website uses, plus
 * `not_admin`, so it can say which Google account was refused.
 */
const toApp = (appReturn: string, params: Record<string, string>) => {
  const url = new URL(appReturn);
  for (const [name, value] of Object.entries(params)) {
    url.searchParams.set(name, value);
  }
  return NextResponse.redirect(url.toString());
};

/** Clears the short-lived OAuth cookies, whichever way this goes. */
function spent<T extends NextResponse>(response: T): T {
  for (const name of [
    "na_oauth_state",
    "na_oauth_verifier",
    "na_oauth_realm",
    "na_oauth_app_return",
    "na_oauth_app_challenge",
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

  // Set only when the Android app started this sign-in, and checked again
  // here: a cookie is not proof of anything until it passes the same test.
  const appReturnCookie = jar.get("na_oauth_app_return")?.value ?? null;
  const appChallenge = jar.get("na_oauth_app_challenge")?.value ?? null;
  const app =
    validAppReturn(appReturnCookie) && validChallenge(appChallenge)
      ? { returnTo: appReturnCookie, challenge: appChallenge }
      : null;
  const fail = (o: string, r: Realm, why: string) =>
    app ? toApp(app.returnTo, { error: why, realm: r }) : failOnSite(o, r, why);

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

  /*
   * The app gets a code, not a session. An admin sign-in from the app is
   * refused here when the account is not an admin, with no code at all: the
   * website can let a stranger sit on /admin/login, but the app has nothing
   * to show them, so they are told which account was refused and stopped.
   */
  if (app) {
    const [fresh] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (realm === "admin" && !isAdmin(fresh ?? null)) {
      return spent(
        toApp(app.returnTo, {
          error: "not_admin",
          realm,
          email: identity.email,
        }),
      );
    }
    return spent(
      toApp(app.returnTo, {
        code: mintAppCode({ userId, realm, challenge: app.challenge }),
        realm,
      }),
    );
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
  // An admin owes the emailed code next; that page sends anyone else back
  // to sign-in, which says which account was refused.
  const next = realm === "admin" ? `${ADMIN}/verify` : "/dashboard";
  return spent(
    attachCookies(NextResponse.redirect(`${origin}${next}`), session),
  );
}
