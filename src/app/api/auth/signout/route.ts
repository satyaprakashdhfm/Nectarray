import { NextResponse } from "next/server";
import { attachCookies, endSession } from "@/lib/auth/session";

/** Ends the session: the row goes first, then the cookie. */
export const runtime = "nodejs";

export async function POST() {
  const cleared = await endSession();
  return attachCookies(NextResponse.json({ ok: true }), cleared);
}
