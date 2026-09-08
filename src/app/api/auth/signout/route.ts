import { NextResponse } from "next/server";
import { endSession } from "@/lib/auth/session";

/** Ends the session: the row goes first, then the cookie. */
export const runtime = "nodejs";

export async function POST() {
  await endSession();
  return NextResponse.json({ ok: true });
}
