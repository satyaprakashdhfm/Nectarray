import { NextResponse } from "next/server";
import { attachCookies, endSession } from "@/lib/auth/session";

/**
 * Ends one session: the row goes first, then the cookie.
 *
 * ?realm=admin ends the panel session and leaves the student one alone, and
 * the other way round. They are separate sign-ins, so signing out of one is
 * not signing out of the other.
 */
export const runtime = "nodejs";

export async function POST(request: Request) {
  const realm =
    new URL(request.url).searchParams.get("realm") === "admin"
      ? "admin"
      : "student";

  const cleared = await endSession(realm);
  return attachCookies(NextResponse.json({ ok: true }), cleared);
}
