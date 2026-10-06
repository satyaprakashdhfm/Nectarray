import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { isAdmin } from "@/lib/auth/access";
import { redeemAppCode } from "@/lib/auth/app-codes";
import { appProfile } from "@/lib/auth/app-profile";
import { startAppSession } from "@/lib/auth/session";

/**
 * The Android app trades its sign-in code, and the verifier only it holds,
 * for a session token.
 *
 * The admin check runs again here rather than trusting the callback's: the
 * code lives three minutes, and an address taken off ADMIN_EMAILS in that
 * window should not still come out of this with a panel session.
 */
export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { code?: unknown; verifier?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  const code = typeof body.code === "string" ? body.code : "";
  const verifier = typeof body.verifier === "string" ? body.verifier : "";
  if (!code || verifier.length < 43 || verifier.length > 128) {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  const claims = redeemAppCode(code, verifier);
  if (!claims) {
    return Response.json(
      { error: "That sign-in has expired. Please try again." },
      { status: 401 },
    );
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, claims.userId))
    .limit(1);
  if (!user) {
    return Response.json({ error: "No such account." }, { status: 401 });
  }
  if (claims.realm === "admin" && !isAdmin(user)) {
    return Response.json(
      { error: `${user.email} is not an admin account.` },
      { status: 403 },
    );
  }

  const token = await startAppSession(user.id);
  return Response.json({
    token,
    profile: await appProfile(user, claims.realm),
  });
}
