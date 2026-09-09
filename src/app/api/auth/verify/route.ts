import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { verifyCode } from "@/lib/auth/codes";
import { attachCookies, startSession, sweepExpired } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/access";

/**
 * Trades a code for a session.
 *
 * Tells the caller whether the account still needs a name, so the sign-in
 * box knows whether to ask — a returning student should not be asked twice.
 */
export const runtime = "nodejs";

export async function POST(request: Request) {
  let email = "";
  let code = "";
  try {
    const body = (await request.json()) as { email?: unknown; code?: unknown };
    email = String(body.email ?? "");
    code = String(body.code ?? "");
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const result = await verifyCode(email, code);
  if (!result.ok) {
    return NextResponse.json(
      {
        error:
          result.reason === "expired"
            ? "That code has expired. Ask for a new one."
            : "That code was not accepted.",
      },
      { status: 401 },
    );
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, result.userId))
    .limit(1);

  // The listed addresses are how the first admin exists at all, since there
  // is nobody to promote them.
  if (user && user.role !== "admin" && isAdmin(user)) {
    await db.update(users).set({ role: "admin" }).where(eq(users.id, user.id));
  }

  const session = await startSession(
    result.userId,
    request.headers.get("user-agent"),
  );
  void sweepExpired();

  return attachCookies(
    NextResponse.json({
      ok: true,
      needsProfile: !user?.firstName,
      isAdmin: isAdmin(user ?? null),
    }),
    session,
  );
}
