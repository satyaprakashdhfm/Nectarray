import {
  bearerUser,
  endAppPanelSessions,
  endBearerSession,
} from "@/lib/auth/session";

/**
 * Ends the app's session: the row is deleted, so the token is dead at once.
 * The panel sessions its web view was given (api/app/panel) go with it.
 */
export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await bearerUser(request);
  await endBearerSession(request);
  if (user) await endAppPanelSessions(user.id);
  return Response.json({ ok: true });
}
