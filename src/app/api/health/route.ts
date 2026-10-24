import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

/**
 * What Railway's healthcheck and the uptime checkers ask.
 *
 * It asks the database, not just the process: `/` answers from the static
 * cache even when Postgres is down, so a check on it says "fine" while every
 * signed-in page fails. One `select 1`, with a timeout, and nothing about the
 * failure in the body, because anyone can call it.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await Promise.race([
      db.execute(sql`select 1`),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 5_000),
      ),
    ]);
    return Response.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[health] database check failed:", error);
    return Response.json(
      { ok: false },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
