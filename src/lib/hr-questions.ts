import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { hrQuestions } from "@/lib/db/schema";
import { HR_QUESTIONS, type HrQuestion } from "@/lib/content/hr-questions";

/**
 * The HR questions students see.
 *
 * The admin's edited list once there is one, and the questions written into
 * the code until then. The table stays empty until the first save, so a
 * fresh database shows the same page it always did.
 */
export async function getHrQuestions(): Promise<HrQuestion[]> {
  let rows;
  try {
    rows = await db
      .select()
      .from(hrQuestions)
      .orderBy(asc(hrQuestions.position));
  } catch (error) {
    // A database the migration has not reached yet: no table is no edits.
    const code = (error as { code?: string; cause?: { code?: string } }).cause
      ?.code;
    if (code === "42P01" || (error as { code?: string }).code === "42P01") {
      return HR_QUESTIONS;
    }
    throw error;
  }
  if (rows.length === 0) return HR_QUESTIONS;

  return rows.map((row) => ({
    id: row.id,
    question: row.question,
    alsoAsked: row.alsoAsked.length > 0 ? row.alsoAsked : undefined,
    note: row.note ?? undefined,
    mode: row.isGuide ? "guide" : undefined,
    answer: row.answer,
  }));
}
