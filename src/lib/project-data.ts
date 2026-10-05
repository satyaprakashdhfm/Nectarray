import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { projectDetails } from "@/lib/db/schema";
import {
  EMPTY_SHEETS,
  STARTER_SHEETS,
  cleanSheets,
  type ProjectSheets,
} from "@/lib/project-details";
import { open } from "@/lib/vault";

/** A project's working file, passwords readable. */
export async function loadProjectSheets(
  projectId: string,
): Promise<ProjectSheets> {
  let row;
  try {
    [row] = await db
      .select()
      .from(projectDetails)
      .where(eq(projectDetails.projectId, projectId));
  } catch (error) {
    // A database the migration has not reached yet.
    const code =
      (error as { code?: string }).code ??
      (error as { cause?: { code?: string } }).cause?.code;
    if (code === "42P01") return EMPTY_SHEETS;
    throw error;
  }
  // Never saved: start from the usual services, ready to edit.
  if (!row) return STARTER_SHEETS;
  const sheets = cleanSheets(row);
  return {
    ...sheets,
    access: sheets.access.map((a) => ({ ...a, password: open(a.password) })),
  };
}
