import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { authorizeUrl, googleConfigured, newVerifier } from "@/lib/auth/google";

/**
 * Sends the browser to Google.
 *
 * The state and the PKCE verifier are stashed in short-lived cookies so the
 * callback can check them. State is what stops somebody handing a signed-in
 * user a link that logs them into an attacker's account; the verifier is
 * what makes an intercepted authorization code useless on its own.
 */
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!googleConfigured()) {
    return NextResponse.json(
      { error: "Google sign-in is not configured." },
      { status: 503 },
    );
  }

  const origin = new URL(request.url).origin;
  const state = randomBytes(16).toString("base64url");
  const verifier = newVerifier();

  const jar = await cookies();
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 600,
  };
  jar.set("na_oauth_state", state, options);
  jar.set("na_oauth_verifier", verifier, options);

  return NextResponse.redirect(authorizeUrl({ origin, state, verifier }));
}
