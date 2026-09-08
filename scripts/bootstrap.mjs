/**
 * Creates the schema in Railway Postgres and copies the content out of Supabase.
 *
 * Runs as a Railway pre-deploy command, because the deployment container is
 * the only place that can reach both databases — not a laptop, and not the
 * sandbox this was written in, whose egress proxy stalls a Postgres
 * connection before a byte of protocol is exchanged.
 *
 * Idempotent from end to end: the DDL is guarded and every insert ignores a
 * primary-key conflict, so running it again after a half-finished attempt
 * finishes the job rather than doubling it. It is meant to run two or three
 * times in total; the pre-deploy command comes off afterwards.
 *
 * Ids are carried across unchanged. A lesson's id is in the URL a student has
 * open in another tab and in the answers file the SQL practice reads, so
 * minting new ones would break both for nothing.
 */

import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Content only. Rows belonging to people are deliberately left behind. */
const TABLES = [
  "cohorts",
  "modules",
  "lessons",
  "projects",
  "practice_questions",
  "enrolment_codes",
  "academy_enquiries",
];

if (!DATABASE_URL) {
  console.error("[bootstrap] DATABASE_URL is not set");
  process.exit(1);
}

const sql = postgres(DATABASE_URL, {
  max: 1,
  ssl: DATABASE_URL.includes("localhost")
    ? false
    : { rejectUnauthorized: false },
});

async function applySchema() {
  const dir = "drizzle";
  if (!fs.existsSync(dir)) {
    console.error("[bootstrap] no drizzle/ directory in the container");
    return false;
  }
  const file = fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".sql"))
    .sort()
    .at(-1);
  if (!file) {
    console.error("[bootstrap] no migration in drizzle/");
    return false;
  }

  const statements = fs
    .readFileSync(path.join(dir, file), "utf8")
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) =>
      s
        .replace("CREATE TABLE ", "CREATE TABLE IF NOT EXISTS ")
        .replace("CREATE INDEX ", "CREATE INDEX IF NOT EXISTS ")
        .replace("CREATE UNIQUE INDEX ", "CREATE UNIQUE INDEX IF NOT EXISTS "),
    );

  let applied = 0;
  for (const statement of statements) {
    try {
      await sql.unsafe(statement);
      applied += 1;
    } catch (error) {
      // A foreign key that already exists is the shape a re-run takes.
      if (/already exists/i.test(String(error.message))) continue;
      console.error("[bootstrap] schema failed on:", statement.slice(0, 90));
      console.error("[bootstrap]", error.message);
      return false;
    }
  }
  console.log(`[bootstrap] schema: ${applied}/${statements.length} statements`);
  return true;
}

/** Reads a whole table through Supabase's REST API, in pages. */
async function readTable(table) {
  const rows = [];
  const size = 500;
  for (let from = 0; ; from += size) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        Range: `${from}-${from + size - 1}`,
      },
    });
    if (!response.ok) {
      throw new Error(`${table}: ${response.status} ${await response.text()}`);
    }
    const page = await response.json();
    rows.push(...page);
    if (page.length < size) return rows;
  }
}

async function copyContent() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.log("[bootstrap] no Supabase keys — skipping the copy");
    return;
  }

  for (const table of TABLES) {
    try {
      const rows = await readTable(table);
      if (rows.length === 0) {
        console.log(`[bootstrap] ${table}: nothing to copy`);
        continue;
      }

      /*
       * created_by and redeemed_by point at Supabase's auth.users, whose ids
       * mean nothing in the new users table. Blanking them loses only who
       * generated a code, which is not worth a dangling reference.
       */
      const cleaned = rows.map((row) => {
        const copy = { ...row };
        if (table === "enrolment_codes") {
          copy.created_by = null;
          copy.redeemed_by = null;
        }
        return copy;
      });

      const columns = Object.keys(cleaned[0]);
      let written = 0;
      // In batches, because a lesson body is 40 KB and one statement holding
      // all of them at once is a megabyte of parameters.
      for (let i = 0; i < cleaned.length; i += 20) {
        const batch = cleaned.slice(i, i + 20);
        const result = await sql`
          insert into ${sql(table)} ${sql(batch, columns)}
          on conflict do nothing
        `;
        written += result.count ?? 0;
      }
      console.log(
        `[bootstrap] ${table}: ${written} inserted of ${cleaned.length} read`,
      );
    } catch (error) {
      console.error(`[bootstrap] ${table} failed:`, error.message);
    }
  }
}

async function report() {
  const [counts] = await sql`
    select (select count(*) from modules)            as modules,
           (select count(*) from lessons)            as lessons,
           (select count(*) from projects)           as projects,
           (select count(*) from practice_questions) as questions,
           (select count(*) from cohorts)            as cohorts,
           (select count(*) from enrolment_codes)    as codes,
           (select count(*) from users)              as users
  `;
  console.log("[bootstrap] now holds:", JSON.stringify(counts));
}

const ok = await applySchema();
if (ok) {
  await copyContent();
  await report();
}
await sql.end({ timeout: 5 });
process.exit(ok ? 0 : 1);
