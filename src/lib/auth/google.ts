import "server-only";
import { createHash, randomBytes } from "node:crypto";

/**
 * Sign in with Google, by hand.
 *
 * The authorization-code flow with PKCE, which is four HTTP calls and a
 * couple of hundred lines less than a library that also does eleven other
 * providers we do not use.
 *
 * Two things here are load-bearing. `state` is a random value we set as a
 * cookie and check on the way back, and it is the whole defence against
 * somebody handing a signed-in user a link that logs them into an attacker's
 * account. The `code_verifier` is PKCE: the authorization code is worthless
 * to anybody who intercepts it without the verifier that never left us.
 */

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

export type GoogleIdentity = {
  email: string;
  emailVerified: boolean;
  firstName: string | null;
  lastName: string | null;
};

/**
 * The credentials, as pasted.
 *
 * Whitespace and wrapping quotes get trimmed, because these are copied out of
 * the Google console and pasted into a Railway variable field, and that path
 * picks up a trailing newline or a pair of quotes often enough to be worth
 * handling. Google does not forgive either: a client id with a stray space on
 * the end is a client id it has never seen, and it answers `invalid_client` —
 * "The OAuth client was not found" — which reads like the credential was
 * deleted rather than mistyped.
 */
const clean = (value: string | undefined): string =>
  (value ?? "").trim().replace(/^["']|["']$/g, "");

export const clientId = () => clean(process.env.GOOGLE_CLIENT_ID);
export const clientSecret = () => clean(process.env.GOOGLE_CLIENT_SECRET);

/**
 * Whether a Google sign-in has any chance of working.
 *
 * The shape check is not pedantry. Every web client id Google issues ends in
 * `.apps.googleusercontent.com`; anything else in that variable — an API key,
 * a project number, the client *secret* pasted into the wrong box — cannot
 * work, and it is kinder to grey the button out than to send somebody to
 * Google to be told the app does not exist.
 */
export function googleConfigured(): boolean {
  const id = clientId();
  return id.endsWith(".apps.googleusercontent.com") && clientSecret() !== "";
}

/**
 * The one origin this site answers to.
 *
 * Google matches the redirect_uri against the console entry character for
 * character, so everything about how the origin is worked out matters. Two
 * things make `new URL(request.url).origin` the wrong answer on Railway:
 * the app is behind a proxy that terminates TLS and forwards plain HTTP, so
 * the scheme can come back as `http:`, which Google will not accept for a
 * public host at all; and both `nectarray.com` and `www.nectarray.com`
 * resolve here, so which one the student happened to type decides which URI
 * we send — and only one of them is in the console.
 *
 * SITE_URL settles it. Set it, and every sign-in uses the same redirect URI
 * whatever the visitor typed. The forwarded headers are the fallback for a
 * deployment that has not set it; the request URL is the fallback for local
 * development, where it is right.
 */
export function siteOrigin(request: Request): string {
  const configured = process.env.SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  const headers = request.headers;
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  if (host) {
    const proto = headers.get("x-forwarded-proto")?.split(",")[0].trim();
    return `${proto ?? "https"}://${host}`;
  }

  return new URL(request.url).origin;
}

/** The redirect Google sends the browser back to. Must match the console. */
export function redirectUri(origin: string): string {
  return `${origin}/api/auth/google/callback`;
}

const base64url = (input: Buffer) => input.toString("base64url");

export function newVerifier(): string {
  return base64url(randomBytes(32));
}

export function challengeFor(verifier: string): string {
  return base64url(createHash("sha256").update(verifier).digest());
}

export function authorizeUrl(options: {
  origin: string;
  state: string;
  verifier: string;
}): string {
  const url = new URL(AUTH_URL);
  url.searchParams.set("client_id", clientId());
  url.searchParams.set("redirect_uri", redirectUri(options.origin));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", options.state);
  url.searchParams.set("code_challenge", challengeFor(options.verifier));
  url.searchParams.set("code_challenge_method", "S256");
  // Keeps Google from silently reusing a session on a shared machine.
  url.searchParams.set("prompt", "select_account");
  return url.toString();
}

/**
 * Trades the code for an identity.
 *
 * The id token is read rather than verified against Google's keys, which is
 * sound only because it came back over TLS from Google's own token endpoint
 * in a request we made — not from the browser. An id token arriving any other
 * way would have to be verified properly.
 */
export async function exchange(options: {
  code: string;
  origin: string;
  verifier: string;
}): Promise<GoogleIdentity | null> {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId(),
      client_secret: clientSecret(),
      code: options.code,
      code_verifier: options.verifier,
      grant_type: "authorization_code",
      redirect_uri: redirectUri(options.origin),
    }),
  });

  /*
   * Say what went wrong, in the deploy log.
   *
   * This used to return null and the callback turned that into a one-word
   * error in a query string, which left the actual cause — a mismatched
   * redirect URI, a stale secret, a code already spent — only in a response
   * body nobody kept. Google's error body names it. It carries no credential,
   * so it is safe to write down.
   */
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error(
      `[google] token exchange failed: ${response.status} ${detail.slice(0, 500)}`,
    );
    return null;
  }

  const payload = (await response.json()) as { id_token?: string };
  if (!payload.id_token) {
    console.error("[google] token exchange returned no id_token");
    return null;
  }

  const claims = readIdToken(payload.id_token);
  if (!claims?.email) return null;

  return {
    email: String(claims.email).toLowerCase(),
    emailVerified: claims.email_verified === true,
    firstName: typeof claims.given_name === "string" ? claims.given_name : null,
    lastName:
      typeof claims.family_name === "string" ? claims.family_name : null,
  };
}

type Claims = {
  email?: unknown;
  email_verified?: unknown;
  given_name?: unknown;
  family_name?: unknown;
};

function readIdToken(token: string): Claims | null {
  const body = token.split(".")[1];
  if (!body) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString()) as Claims;
  } catch {
    return null;
  }
}
