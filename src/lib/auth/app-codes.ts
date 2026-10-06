import "server-only";
import { createHash, createHmac } from "node:crypto";
import { clientSecret } from "@/lib/auth/google";
import { sameSecret, type Realm } from "@/lib/auth/session";

/**
 * Handing a Google sign-in from the browser back to the Android app.
 *
 * The app opens Google in a Chrome custom tab. When the callback has checked
 * everything it would check for the website, it cannot set a cookie the app
 * can read, so it sends the tab to `nectarray://auth?code=...` instead.
 *
 * Any app on a phone can claim the nectarray:// scheme, so the code is
 * worthless on its own. It is PKCE again: the app made a random verifier
 * before it opened the tab and sent only its sha-256 (the challenge). The
 * code is bound to that challenge, and trading it for a session needs the
 * verifier, which never left the app that started the sign-in.
 *
 * The code is signed rather than stored. It lives three minutes, names the
 * user and the realm, and carries the challenge; the HMAC stops anybody
 * writing their own. The key is APP_AUTH_SECRET when it is set, and is
 * otherwise derived from the Google client secret, which the server already
 * keeps and never sends anywhere.
 */

const LIFETIME_MS = 3 * 60 * 1000;

type Claims = { u: string; r: Realm; c: string; e: number };

function key(): string {
  const own = process.env.APP_AUTH_SECRET?.trim();
  if (own) return own;
  return createHmac("sha256", clientSecret())
    .update("nectarray-app-auth-code")
    .digest("base64url");
}

const sign = (body: string) =>
  createHmac("sha256", key()).update(body).digest("base64url");

/** A challenge is a base64url sha-256: 43 characters, nothing else. */
export const validChallenge = (value: string | null): value is string =>
  !!value && /^[A-Za-z0-9_-]{43}$/.test(value);

export function mintAppCode(claims: {
  userId: string;
  realm: Realm;
  challenge: string;
}): string {
  const body = Buffer.from(
    JSON.stringify({
      u: claims.userId,
      r: claims.realm,
      c: claims.challenge,
      e: Date.now() + LIFETIME_MS,
    } satisfies Claims),
  ).toString("base64url");
  return `${body}.${sign(body)}`;
}

/** The user and realm a code stands for, if the code and verifier are good. */
export function redeemAppCode(
  code: string,
  verifier: string,
): { userId: string; realm: Realm } | null {
  const [body, signature] = code.split(".");
  if (!body || !signature || !sameSecret(signature, sign(body))) return null;

  let claims: Claims;
  try {
    claims = JSON.parse(Buffer.from(body, "base64url").toString()) as Claims;
  } catch {
    return null;
  }
  if (typeof claims.e !== "number" || claims.e < Date.now()) return null;

  const challenge = createHash("sha256").update(verifier).digest("base64url");
  if (!sameSecret(challenge, claims.c)) return null;

  return {
    userId: claims.u,
    realm: claims.r === "admin" ? "admin" : "student",
  };
}

/**
 * Where a sign-in may send the code: the installed app, always; Expo Go
 * (exp://) only on a development server. On the live site an exp:// return
 * address would let a phishing link send somebody's code to a stranger's
 * computer, and PKCE does not help when the stranger started the sign-in.
 */
export function validAppReturn(value: string | null): value is string {
  if (!value || value.length > 300) return false;
  if (/^nectarray:\/\/[\w/-]*$/.test(value)) return true;
  return (
    process.env.NODE_ENV !== "production" &&
    /^exps?:\/\/[\w.:-]+\/--\/[\w/-]*$/.test(value)
  );
}
