"use server";

import { createHmac } from "node:crypto";
import { requireAdmin } from "@/lib/auth/access";

/**
 * A one-minute pass to the Workspace runner, for an admin who is all the way
 * in (Google, the allowlist and this session's emailed code: requireAdmin).
 *
 * The runner on Railway is reachable from the internet, and this pass is the
 * only thing it accepts: `<payload>.<signature>`, base64url JSON { sub, exp }
 * signed with WORKSPACE_SECRET, which the website and the runner share and
 * nothing else knows. Each socket asks for a fresh one.
 *
 * Without WORKSPACE_URL in development, it points at a runner on this PC
 * (`npm run workspace`), which needs no pass.
 */
export async function workspaceAccess(): Promise<
  { url: string; pass: string } | { error: "unset" }
> {
  const user = await requireAdmin();
  const base = process.env.WORKSPACE_URL?.trim();
  const secret = process.env.WORKSPACE_SECRET?.trim();

  if (!base || !secret) {
    if (process.env.NODE_ENV === "development")
      return { url: "ws://127.0.0.1:4100", pass: "" };
    return { error: "unset" };
  }

  const payload = Buffer.from(
    JSON.stringify({ sub: user.email, exp: Date.now() + 60_000 }),
  ).toString("base64url");
  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  const host = base.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  return { url: `wss://${host}`, pass: `${payload}.${signature}` };
}
