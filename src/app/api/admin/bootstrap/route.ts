import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { SCHEMA_STATEMENTS } from "@/lib/db/schema-sql";
import {
  academyEnquiries,
  cohorts,
  enrolmentCodes,
  lessons,
  modules,
  practiceQuestions,
  projects,
} from "@/lib/db/schema";
import { createAdminClient } from "@/lib/supabase/admin";
import { sameSecret } from "@/lib/auth/session";

/**
 * Creates the schema in Railway and copies the content out of Supabase.
 *
 * This runs here rather than from a laptop or a CI job because this process
 * is the only one that can reach both databases at once. It is meant to be
 * called two or three times in total and then deleted along with the Supabase
 * keys it depends on.
 *
 * Everything is idempotent — the DDL is guarded, the inserts ignore conflicts
 * on the primary key — so running it again after a half-finished attempt
 * finishes the job rather than doubling it.
 *
 * Ids are carried across unchanged. A lesson's id is in the URL a student has
 * open in another tab, and in the answers file the SQL practice reads, so
 * generating new ones would break both for nothing.
 *
 *     curl -X POST https://…/api/admin/bootstrap -H "x-bootstrap-secret: $AUTH_SECRET"
 */

export const runtime = "nodejs";
export const maxDuration = 300;

/** Rows belonging to people are deliberately not copied. See the reply. */
const CONTENT = [
  "cohorts",
  "modules",
  "lessons",
  "projects",
  "practice_questions",
  "enrolment_codes",
  "academy_enquiries",
] as const;

export async function POST(request: Request) {
  const secret = process.env.AUTH_SECRET ?? "";
  const offered = request.headers.get("x-bootstrap-secret") ?? "";
  if (!secret || !sameSecret(offered, secret)) {
    return NextResponse.json({ error: "No." }, { status: 401 });
  }

  const report: Record<string, unknown> = {};

  // 1. The schema.
  let created = 0;
  for (const statement of SCHEMA_STATEMENTS) {
    try {
      await db.execute(sql.raw(statement));
      created += 1;
    } catch (error) {
      return NextResponse.json(
        {
          step: "schema",
          failedOn: statement.slice(0, 120),
          error: error instanceof Error ? error.message : String(error),
          applied: created,
        },
        { status: 500 },
      );
    }
  }
  report.schemaStatements = created;

  // 2. The content.
  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { ...report, copied: "skipped — SUPABASE_SERVICE_ROLE_KEY is not set" },
      { status: 200 },
    );
  }

  const target = {
    cohorts,
    modules,
    lessons,
    projects,
    practice_questions: practiceQuestions,
    enrolment_codes: enrolmentCodes,
    academy_enquiries: academyEnquiries,
  } as const;

  for (const name of CONTENT) {
    const { data, error } = await supabase.from(name).select("*");
    if (error) {
      report[name] = `read failed: ${error.message}`;
      continue;
    }
    const rows = (data ?? []) as Record<string, unknown>[];
    if (rows.length === 0) {
      report[name] = 0;
      continue;
    }

    /*
     * `created_by` and `redeemed_by` point at Supabase's auth.users, whose
     * ids mean nothing in the new users table. Blanking them loses only who
     * generated a code, which is not worth carrying a dangling reference for.
     */
    const cleaned = rows.map((row) => {
      const copy = { ...row };
      if (name === "enrolment_codes") {
        copy.created_by = null;
        copy.redeemed_by = null;
      }
      return copy;
    });

    try {
      // In batches, because a lesson body is 40 KB and a single statement
      // carrying all of them at once is a megabyte of parameters.
      for (let i = 0; i < cleaned.length; i += 20) {
        await db
          .insert(target[name])
          .values(cleaned.slice(i, i + 20) as never)
          .onConflictDoNothing();
      }
      report[name] = cleaned.length;
    } catch (error) {
      report[name] =
        `write failed: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  return NextResponse.json({ ok: true, ...report });
}

/** A quick read, to see whether it worked without writing anything. */
export async function GET() {
  try {
    const counts = await db.execute(
      sql`select
            (select count(*) from modules)            as modules,
            (select count(*) from lessons)            as lessons,
            (select count(*) from projects)           as projects,
            (select count(*) from practice_questions) as questions,
            (select count(*) from cohorts)            as cohorts,
            (select count(*) from users)              as users`,
    );
    return NextResponse.json({ ok: true, counts: counts[0] ?? null });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
