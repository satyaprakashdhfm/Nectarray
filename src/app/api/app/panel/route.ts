import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { ADMIN } from "@/lib/admin-path";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { isAdmin } from "@/lib/auth/access";
import { mintPanelCode, redeemPanelCode } from "@/lib/auth/app-codes";
import { siteOrigin } from "@/lib/auth/google";
import {
  APP_PANEL_AGENT,
  adminSession,
  attachCookies,
  bearerUser,
  startSession,
} from "@/lib/auth/session";

/**
 * The admin panel inside the Android app.
 *
 * POST, with the app's bearer token: a one-minute address that opens the
 * panel. GET, at that address, inside the app's web view: a panel session
 * for the web view's own cookie jar, then the panel. The session still owes
 * the emailed code, so the panel asks for it the way it does after Google
 * on the website, and lasts the same five hours. A web view that already
 * holds a live session for the same admin keeps it and is not asked again.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** A page inside the panel to land on; anything else lands on its home. */
function panelPath(value: string | null): string {
  if (!value || !/^\/[\w\-/]*$/.test(value) || value.includes("//"))
    return ADMIN;
  return value === ADMIN || value.startsWith(`${ADMIN}/`) ? value : ADMIN;
}

export async function POST(request: Request) {
  const user = await bearerUser(request);
  if (!user) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!isAdmin(user)) {
    return Response.json(
      { error: `${user.email} is not an admin account.` },
      { status: 403 },
    );
  }

  let next: string | null = null;
  try {
    const body = (await request.json()) as { next?: unknown };
    if (typeof body.next === "string") next = body.next;
  } catch {
    // No body: the panel's home.
  }

  const url = new URL(`${siteOrigin(request)}/api/app/panel`);
  url.searchParams.set("code", mintPanelCode(user.id));
  url.searchParams.set("next", panelPath(next));
  return Response.json({ url: url.toString() });
}

export async function GET(request: Request) {
  const origin = siteOrigin(request);
  const params = new URL(request.url).searchParams;
  const next = panelPath(params.get("next"));
  const userId = redeemPanelCode(params.get("code") ?? "");
  if (!userId) {
    return new Response(
      "This link to the panel has expired. Go back and open the panel again.",
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user || !isAdmin(user)) {
    return new Response("That account is not an admin account.", {
      status: 403,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const current = await adminSession();
  if (current?.user.id === user.id) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  const session = await startSession(user.id, APP_PANEL_AGENT, "admin");
  return attachCookies(NextResponse.redirect(`${origin}${next}`), session);
}
