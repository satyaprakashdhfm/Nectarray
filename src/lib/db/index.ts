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
 * One connection per instance, deliberately. Each concurrent request may be
 * its own process, so a pool of ten inside ten of them is a hundred
 * connections for ten students — which is how an app exhausts a database that
 * could have served it with a dozen. `idle_timeout` then closes what a
 * request has finished with, rather than leaving a backend process alive
 * waiting for a query that never comes.
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
    max: 1,
    idle_timeout: 20,
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
