import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { webNotes } from "@/lib/db/schema";
import {
  WEB_NOTE_DEFAULTS,
  type WebNote,
  type WebNoteKind,
} from "@/lib/content/web-building";

/**
 * One list from the Website tab: the admin's saved version once there is
 * one, and the built-in list until then.
 */
export async function getWebNotes(
  kind: WebNoteKind,
): Promise<{ notes: WebNote[]; customised: boolean }> {
  let rows;
  try {
    rows = await db
      .select()
      .from(webNotes)
      .where(eq(webNotes.kind, kind))
      .orderBy(asc(webNotes.position));
  } catch (error) {
    // A database the migration has not reached yet: no table is no edits.
    const code =
      (error as { code?: string }).code ??
      (error as { cause?: { code?: string } }).cause?.code;
    if (code === "42P01") {
      return { notes: WEB_NOTE_DEFAULTS[kind], customised: false };
    }
    throw error;
  }
  if (rows.length === 0) {
    return { notes: WEB_NOTE_DEFAULTS[kind], customised: false };
  }
  return {
    notes: rows.map((row) => ({
      id: row.id,
      title: row.title,
      body: row.body,
      url: row.url ?? undefined,
    })),
    customised: true,
  };
}
