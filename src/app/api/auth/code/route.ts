import { NextResponse } from "next/server";
import { issueCode, normaliseEmail } from "@/lib/auth/codes";
import { sendCode } from "@/lib/auth/email";

/**
 * Asks for a sign-in code.
 *
 * The reply is the same whether the address has an account or not. Telling
 * the difference would turn this into a way of asking whether somebody is a
 * student here, which is nobody's business but theirs.
 */
export const runtime = "nodejs";

const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email: string;
  try {
    const body = (await request.json()) as { email?: unknown };
    email = normaliseEmail(String(body.email ?? ""));
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  if (!LOOKS_LIKE_EMAIL.test(email)) {
    return NextResponse.json(
      { error: "That does not look like an email address." },
      { status: 400 },
    );
  }

  const issued = await issueCode(email);
  if (!issued.ok) {
    return NextResponse.json(
      { error: "Too many codes for that address. Try again in an hour." },
      { status: 429 },
    );
  }

  const sent = await sendCode(email, issued.code);
  if (!sent) {
    return NextResponse.json(
      { error: "The code could not be sent. Try again in a moment." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
