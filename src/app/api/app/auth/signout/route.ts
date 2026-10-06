import { endBearerSession } from "@/lib/auth/session";

/** Ends the app's session: the row is deleted, so the token is dead at once. */
export const runtime = "nodejs";

export async function POST(request: Request) {
  await endBearerSession(request);
  return Response.json({ ok: true });
}
