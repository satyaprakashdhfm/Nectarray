import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { ADMIN, ADMIN_HIDDEN } from "@/lib/admin-path";
import { validAppReturn, validChallenge } from "@/lib/auth/app-codes";
import { sameSecret } from "@/lib/auth/session";
import {
  authorizeUrl,
  googleConfigured,
  newVerifier,
  siteOrigin,
} from "@/lib/auth/google";

/**
 * Sends the browser to Google.
 *
 * The state and the PKCE verifier are stashed in short-lived cookies so the
 * callback can check them. State is what stops somebody handing a signed-in
 * user a link that logs them into an attacker's account; the verifier is
 * what makes an intercepted authorization code useless on its own.
 *
 * Both are set on the response we are returning rather than through the
 * ambient cookie jar, so there is no question of whether they made it onto
 * the redirect.
 */
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!googleConfigured()) {
    return NextResponse.json(
      { error: "Google sign-in is not configured." },
      { status: 503 },
    );
  }

  const origin = siteOrigin(request);

  /*
   * Get onto the canonical host before setting anything.
   *
   * Cookies set on nectarray.com are not sent back to www.nectarray.com, so
   * a sign-in that starts on one host and comes back on the other loses its
   * state and verifier and fails the check — landing the student back on the
   * home page with no explanation. Bounce first; the round trip costs a
   * redirect and saves the whole flow.
   *
   * Hosts, not origins. The proxy terminates TLS and forwards plain HTTP, so
   * the scheme we are asked on is `http:` while the canonical origin is
   * `https:` — comparing the two in full would redirect every single request
   * to a URL the browser is already on, forever.
   */
  const asked =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    new URL(request.url).host;

  /*
   * Which sign-in this is. The panel and the dashboard hold separate
   * sessions, and a single round trip to Google cannot work out on the way
   * back which one it was for — the callback is the same URL either way — so
   * it travels in a cookie beside the state.
   */
  const realm =
    new URL(request.url).searchParams.get("realm") === "admin"
      ? "admin"
      : "student";

  /*
   * A sign-in started by the Android app. It names where to send the result
   * (nectarray://auth) and the PKCE challenge its code will be bound to; see
   * lib/auth/app-codes.ts. Both are checked here, before Google is involved,
   * so a doctored link fails at the first step rather than after consent.
   */
  const params = new URL(request.url).searchParams;
  const appReturn = params.get("app_return");
  const appChallenge = params.get("app_challenge");
  const fromApp = appReturn !== null || appChallenge !== null;
  if (fromApp && !(validAppReturn(appReturn) && validChallenge(appChallenge))) {
    return NextResponse.json(
      { error: "This sign-in link is not valid. Start again from the app." },
      { status: 400 },
    );
  }

  /*
   * An admin sign-in from the website must carry the panel's address, which
   * only its own sign-in page hands out. Without this, anyone could start
   * one here and be sent back into the panel's address afterwards, which
   * would give away where it is. The app's admin sign-in never lands in the
   * panel (it gets a code back), so it does not need one.
   */
  const gate = params.get("gate") ?? "";
  if (
    realm === "admin" &&
    !fromApp &&
    ADMIN_HIDDEN &&
    !sameSecret(gate, ADMIN.slice(1))
  ) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (asked !== new URL(origin).host) {
    const again = new URL(`${origin}/api/auth/google/start`);
    again.searchParams.set("realm", realm);
    if (gate) again.searchParams.set("gate", gate);
    if (fromApp) {
      again.searchParams.set("app_return", appReturn!);
      again.searchParams.set("app_challenge", appChallenge!);
    }
    return NextResponse.redirect(again.toString());
  }

  const state = randomBytes(16).toString("base64url");
  const verifier = newVerifier();

  const response = NextResponse.redirect(
    authorizeUrl({ origin, state, verifier }),
  );

  const options = {
    httpOnly: true,
    secure: origin.startsWith("https://"),
    sameSite: "lax" as const,
    path: "/",
    maxAge: 600,
  };
  response.cookies.set("na_oauth_state", state, options);
  response.cookies.set("na_oauth_verifier", verifier, options);
  response.cookies.set("na_oauth_realm", realm, options);
  if (fromApp) {
    response.cookies.set("na_oauth_app_return", appReturn!, options);
    response.cookies.set("na_oauth_app_challenge", appChallenge!, options);
  } else {
    // A website sign-in after an abandoned app one must not go to the app.
    response.cookies.set("na_oauth_app_return", "", { path: "/", maxAge: 0 });
    response.cookies.set("na_oauth_app_challenge", "", {
      path: "/",
      maxAge: 0,
    });
  }

  return response;
}
