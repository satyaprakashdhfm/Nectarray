import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * The connection to Postgres.
 *
 * Opened on first use rather than on import. `next build` walks every route
 * to collect its configuration, which imports this module — so connecting
 * eagerly meant the build itself failed anywhere DATABASE_URL was not set,
 * including a machine that only wanted to typecheck.
 *
 * A small pool, kept warm. On Railway the app is one long-lived Node process
 * serving every visitor, not a function per request, so this pool is the
 * whole app's connection count. It used to be a single connection, on the
 * serverless reasoning that each request might be its own process — here
 * that queued every student's queries behind one socket, and a lesson page's
 * layout and page, which render side by side, waited on each other too.
 *
 * `idle_timeout` is long for the same reason. At twenty seconds a quiet
 * site closed its connection between almost every page view, and each visit
 * paid for a fresh TCP, TLS and SCRAM handshake before its first query —
 * half a dozen round trips, which while the database sat in another region
 * was over a second on its own.
 */

type Db = ReturnType<typeof make>;

declare global {
  // Survives the module reload `next dev` does on every edit; without it a
  // morning's work leaves a hundred abandoned connections behind.
  var __db: Db | undefined;
}

function make() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. On Railway it is ${{Postgres.DATABASE_URL}}.",
    );
  }

  const client = postgres(url, {
    max: 10,
    idle_timeout: 600,
    connect_timeout: 10,
    // Railway terminates TLS with its own certificate, which no public root
    // store vouches for; the connection never leaves their network.
    ssl: url.includes("localhost") ? false : { rejectUnauthorized: false },
  });

  return drizzle(client, { schema, casing: "snake_case" });
}

function connection(): Db {
  globalThis.__db ??= make();
  return globalThis.__db;
}

/**
 * Looks and behaves exactly like a Drizzle instance, but the first property
 * anybody reads is what opens the socket.
 */
export const db = new Proxy({} as Db, {
  get: (_target, property) => Reflect.get(connection(), property),
}) as Db;

export { schema };
