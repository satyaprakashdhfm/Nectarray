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

import { createHash } from "node:crypto";
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
  /*
   * Every migration, oldest first — not just the newest one.
   *
   * This used to take `.at(-1)`, which was right while drizzle/ held exactly
   * one file and quietly wrong the moment it held two: the second generated
   * migration would have shipped alone, and a fresh database would have come
   * up with only the tables that changed in it. They are all idempotent, so
   * replaying the lot costs a handful of skipped NOTICEs.
   */
  const files = fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".sql"))
    .sort();
  if (files.length === 0) {
    console.error("[migrate] no migration in drizzle/");
    return false;
  }

  const statements = files
    .flatMap((file) =>
      fs
        .readFileSync(path.join(dir, file), "utf8")
        .split("--> statement-breakpoint"),
    )
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) =>
      s
        .replace("CREATE TABLE ", "CREATE TABLE IF NOT EXISTS ")
        .replace("CREATE INDEX ", "CREATE INDEX IF NOT EXISTS ")
        .replace("CREATE UNIQUE INDEX ", "CREATE UNIQUE INDEX IF NOT EXISTS ")
        /*
         * `ADD COLUMN` and `ADD CONSTRAINT` have no IF NOT EXISTS between
         * them in Postgres — the column form does, the constraint form does
         * not — so the column is made safe here and the constraint is left to
         * fail into the "already exists" branch below.
         */
        .replace(/ ADD COLUMN (?!IF NOT EXISTS)/, " ADD COLUMN IF NOT EXISTS "),
    );

  /*
   * Changes to an existing table, written to be safe to re-run. Drizzle
   * generates ALTERs that assume they run exactly once; these do not.
   */
  const FIXUPS = [
    /*
     * The course does not number its lessons by day any more.
     *
     * A day label was a second ordering next to `position`, and the two fell
     * out of step the moment a topic moved — object-oriented programming
     * going before file handling left three lessons labelled with the day of
     * the lesson that used to be there. Order is `position` alone now, and
     * the notes name the lesson they cross-reference rather than its day.
     */
    "ALTER TABLE lessons DROP COLUMN IF EXISTS day_label",

    // The screenshot is handed straight to the grader now and never stored,
    // so the path to a file in a bucket that no longer exists went with it.
    "ALTER TABLE practice_attempts DROP COLUMN IF EXISTS image_path",

    /*
     * Backfill the slug from the link it used to be parsed out of.
     *
     * The Python workspace matched a question to its tests by pulling the
     * slug out of leetcode_url with a regular expression at render time,
     * which meant the link had to stay in the page for the judge to work.
     * The statements are ours now and the link is gone, so this moves the
     * slug into a column of its own, once.
     */
    `UPDATE practice_questions
        SET slug = regexp_replace(leetcode_url, '.*/problems/([^/]+)/?.*', '\\1')
      WHERE slug IS NULL AND leetcode_url LIKE '%/problems/%'`,

    /*
     * Five problems retired from the Python sheet.
     *
     * Two stack problems, two design problems and one on bit tricks — each
     * the only member of its topic, and each a technique the course does not
     * teach. A sheet is a syllabus rather than a collection, and a problem
     * whose method appears nowhere in the notes is one a student can only
     * look up.
     *
     * Their judge definitions and statements are already gone from the
     * content files; this removes the rows that pointed at them. Progress,
     * opens and drafts reference the question with ON DELETE CASCADE, so a
     * student's history for these goes with them, which is what we want —
     * nothing should be left pointing at a problem that cannot be opened.
     */
    `DELETE FROM practice_questions
      WHERE track = 'python'
        AND slug IN (
          'largest-rectangle-in-histogram',
          'trapping-rain-water',
          'insert-delete-getrandom-o1',
          'lru-cache',
          'single-number'
        )`,

    /*
     * Four hard array problems, appended to the Python sheet.
     *
     * ON CONFLICT is not available here — slug carries no unique constraint —
     * so the insert selects from a values list and excludes what is already
     * there, which is what makes a re-run a no-op. Positions are taken from
     * the current end of the track rather than hard-coded, so this does not
     * collide with whatever the sheet has grown to.
     *
     * prompt_md is the fallback the workspace shows when a slug has no entry
     * in python-statements.json; the JSON is the real source and wins.
     */
    `INSERT INTO practice_questions
        (track, difficulty, topic, title, slug, has_judge, is_published, position, prompt_md)
     SELECT 'python', 'hard', v.topic, v.title, v.slug, true, true,
            (SELECT COALESCE(MAX(position), 0) FROM practice_questions WHERE track = 'python') + v.seq,
            v.prompt
       FROM (VALUES
         (1, '4sum', '4 Sum Problem', 'Array',
          'Return every unique quadruplet in nums that sums to target. Sort first, fix two with nested loops, then close the remaining two with a pair of pointers.'),
         (2, 'count-subarrays-with-xor-k', 'Count Subarrays with Given XOR K', 'Array',
          'Count the contiguous subarrays whose bitwise XOR equals k. A running prefix XOR plus a tally of the prefixes seen so far answers each position in constant time.'),
         (3, 'find-the-repeating-and-missing-number', 'Find the Repeating and Missing Number', 'Array',
          'One value in 1..n appears twice and one is missing. Return [repeating, missing]. XOR the list against the range, then split on any bit where the two differ.'),
         (4, 'count-inversions', 'Count Inversions', 'Array',
          'Count the pairs i < j where nums[i] > nums[j]. Count them during a merge sort: taking from the right half closes one inversion per element still unused on the left.')
       ) AS v(seq, slug, title, topic, prompt)
      WHERE NOT EXISTS (
        SELECT 1 FROM practice_questions q
         WHERE q.track = 'python' AND q.slug = v.slug
      )`,
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

/**
 * Copies the lesson text in content/lessons/ into the lessons table.
 *
 * The notes are written as markdown in the repository and this table is a
 * copy of them — which is what the original seeding migration said it was
 * doing, before the text drifted into being editable in two places at once.
 *
 * The admin panel can still edit a lesson, and that edit is not thrown away.
 * Every sync records the hash of what it wrote; on the next deploy a body
 * that still hashes to it has not been touched by anybody and may be
 * replaced, and a body that does not is somebody's edit, so the file is
 * skipped and the deploy log says which. The way to take a lesson back under
 * the repository's control is to copy the panel's version into the file.
 */
async function syncLessons() {
  const dir = path.join("content", "lessons");
  const indexFile = path.join(dir, "index.json");
  if (!fs.existsSync(indexFile)) {
    console.log("[migrate] lessons: no content/lessons/index.json, skipping");
    return;
  }

  const entries = JSON.parse(fs.readFileSync(indexFile, "utf8"));
  let written = 0;
  let kept = 0;
  let missing = 0;

  for (const entry of entries) {
    const file = path.join(dir, entry.file);
    if (!fs.existsSync(file)) {
      console.error(`[migrate] lessons: ${entry.file} is listed but absent`);
      missing += 1;
      continue;
    }

    const body = fs.readFileSync(file, "utf8");
    const hash = createHash("sha256").update(body).digest("hex");

    /*
     * Matched on module and position rather than on title, so that renaming a
     * lesson in the index updates the row instead of silently writing
     * nothing. The insert covers a lesson added to the repo that the database
     * has never seen.
     */
    const [row] = await sql`
      select id, body_md, source_hash
        from lessons
       where position = ${entry.position}
         and module_id = (select id from modules where slug = ${entry.module})
       limit 1
    `;

    if (!row) {
      await sql`
        insert into lessons
          (module_id, title, summary, position, is_published,
           body_md, source_hash)
        select id, ${entry.title}, ${entry.summary},
               ${entry.position}, ${entry.published}, ${body}, ${hash}
          from modules where slug = ${entry.module}
      `;
      written += 1;
      continue;
    }

    if (row.source_hash === hash) continue; // Already in step.

    const stored = createHash("sha256")
      .update(row.body_md ?? "")
      .digest("hex");

    /*
     * A row that has never been synced has no hash to compare against, and
     * the safe reading of that is the pessimistic one.
     *
     * These files were extracted from the migration that seeded the table, so
     * for a lesson nobody has touched the two are identical and adopting it
     * changes nothing — the hash is recorded and it comes under this scheme
     * from then on. But a lesson that was edited in the panel before any of
     * this existed looks exactly the same from here: no hash, and a body that
     * differs. Overwriting that on the strength of an assumption would be
     * destroying somebody's work to tidy up bookkeeping.
     *
     * So an unsynced lesson is only adopted when it already matches, and
     * `repo_owned` in the index is how a file says it is meant to differ —
     * set it on a lesson you have deliberately rewritten here.
     */
    const first = row.source_hash === null;
    const edited = first ? stored !== hash : row.source_hash !== stored;

    if (edited && !entry.repo_owned) {
      console.log(
        `[migrate] lessons: ${entry.file} skipped — ` +
          (first
            ? "differs from the seeded text; set repo_owned to publish it"
            : "edited in the panel"),
      );
      kept += 1;
      continue;
    }

    await sql`
      update lessons
         set title = ${entry.title},
             summary = ${entry.summary},
             body_md = ${body},
             source_hash = ${hash},
             updated_at = now()
       where id = ${row.id}
    `;
    written += 1;
  }

  console.log(
    `[migrate] lessons: ${written} written, ${kept} left to the panel` +
      (missing ? `, ${missing} missing` : ""),
  );
}

async function report() {
  const [counts] = await sql`
    select (select count(*) from modules)            as modules,
           (select count(*) from lessons)            as lessons,
           (select count(*) from projects)           as projects,
           (select count(*) from practice_questions) as questions,
           (select count(*) from cohorts)            as cohorts,
           (select count(*) from enrolment_codes)    as codes,
           (select count(*) from users)              as users,
           /*
            * The Python workspace matches a question to its tests and its
            * statement by this column. A null one is a problem the judge
            * cannot find, so the backfill either worked or every Python
            * question is broken — worth a number in the log rather than an
            * assumption.
            */
           (select count(*) from practice_questions
             where track = 'python' and slug is not null) as python_slugs
  `;
  console.log("[migrate] now holds:", JSON.stringify(counts));
}

const ok = await applySchema();
if (ok) {
  await copyContent();
  await syncLessons();
  await report();
}
await sql.end({ timeout: 5 });
process.exit(ok ? 0 : 1);
