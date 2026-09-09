import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
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

  if (asked !== new URL(origin).host) {
    return NextResponse.redirect(`${origin}/api/auth/google/start`);
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

  return response;
}
