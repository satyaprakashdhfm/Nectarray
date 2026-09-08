/**
 * Brings the database up to what src/lib/db/schema.ts describes.
 *
 * Runs as a Railway pre-deploy command, so a schema change ships with the
 * code that needs it and no deploy can come up against a database that has
 * not caught up. If it fails the deploy fails, which is the behaviour you
 * want: the old container keeps serving.
 *
 * Idempotent by construction rather than by a ledger of what has run. The
 * generated CREATEs are rewritten to IF NOT EXISTS, and anything that cannot
 * be expressed that way is written out by hand in FIXUPS below. That is the
 * honest shape for a schema this size — a migration table would be a second
 * source of truth to keep in step with the first.
 *
 * On the first run it also copies content out of Supabase, which is a
 * one-time job: once SUPABASE_SERVICE_ROLE_KEY is gone from the environment
 * it skips silently, and that is the signal the migration is finished.
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
  console.error("[migrate] DATABASE_URL is not set");
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
    console.error("[migrate] no drizzle/ directory in the container");
    return false;
  }
  const file = fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".sql"))
    .sort()
    .at(-1);
  if (!file) {
    console.error("[migrate] no migration in drizzle/");
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

  /*
   * Changes to an existing table, written to be safe to re-run. Drizzle
   * generates ALTERs that assume they run exactly once; these do not.
   */
  const FIXUPS = [
    // The screenshot is handed straight to the grader now and never stored,
    // so the path to a file in a bucket that no longer exists went with it.
    "ALTER TABLE practice_attempts DROP COLUMN IF EXISTS image_path",
  ];

  let applied = 0;
  for (const statement of [...statements, ...FIXUPS]) {
    try {
      await sql.unsafe(statement);
      applied += 1;
    } catch (error) {
      // A foreign key that already exists is the shape a re-run takes.
      if (/already exists/i.test(String(error.message))) continue;
      console.error("[migrate] schema failed on:", statement.slice(0, 90));
      console.error("[migrate]", error.message);
      return false;
    }
  }
  console.log(`[migrate] schema: ${applied} statements applied`);
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
    console.log("[migrate] no Supabase keys — content copy already done");
    return;
  }

  for (const table of TABLES) {
    try {
      const rows = await readTable(table);
      if (rows.length === 0) {
        console.log(`[migrate] ${table}: nothing to copy`);
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
        `[migrate] ${table}: ${written} inserted of ${cleaned.length} read`,
      );
    } catch (error) {
      console.error(`[migrate] ${table} failed:`, error.message);
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
  console.log("[migrate] now holds:", JSON.stringify(counts));
}

const ok = await applySchema();
if (ok) {
  await copyContent();
  await report();
}
await sql.end({ timeout: 5 });
process.exit(ok ? 0 : 1);
