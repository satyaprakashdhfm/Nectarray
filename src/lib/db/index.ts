import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * The connection to Postgres.
 *
 * One connection per function instance, deliberately. On Vercel each
 * concurrent request gets its own instance, so a pool of ten inside each of
 * ten instances would be a hundred connections for ten students — which is
 * how a serverless app exhausts a database that could have served it with a
 * dozen. `max: 1` makes the count equal the concurrency, and at this size the
 * concurrency is single digits.
 *
 * `idle_timeout` closes a connection a function is no longer using, because a
 * frozen serverless instance holds its socket open otherwise and Postgres
 * keeps the backend process alive waiting for a query that never comes.
 */

declare global {
  // Survives the module reload that `next dev` does on every edit; without it
  // a morning's work leaves a hundred abandoned connections behind.
  var __sql: ReturnType<typeof postgres> | undefined;
}

function connect() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy DATABASE_PUBLIC_URL from the Railway Postgres service.",
    );
  }
  return postgres(url, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    // Railway terminates TLS with its own certificate; verifying it against a
    // public root store fails, and the connection is inside their network.
    ssl: url.includes("localhost") ? false : { rejectUnauthorized: false },
  });
}

const client = globalThis.__sql ?? connect();
if (process.env.NODE_ENV !== "production") globalThis.__sql = client;

export const db = drizzle(client, { schema, casing: "snake_case" });
export { schema };
