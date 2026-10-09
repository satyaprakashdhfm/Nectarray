import "server-only";
import { and, eq, lt, notInArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { projectFiles } from "@/lib/db/schema";

/**
 * The receipts and invoices kept with a project's payments. Admin-only,
 * for our own reference: nothing here reaches the Excel files.
 */

/** Big enough for a scanned invoice; under the 10 MB a request may carry. */
export const MAX_FILE_BYTES = 8 * 1024 * 1024;

/** Shown in the browser as they are. Anything else is downloaded. */
const VIEWABLE = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

/** A file name safe to store and to put back in a download header. */
const cleanName = (name: string) =>
  name
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "")
    .trim()
    .slice(0, 160) || "document";

export async function saveProjectFile(projectId: string, file: File) {
  const type = VIEWABLE.has(file.type) ? file.type : "application/octet-stream";
  const [row] = await db
    .insert(projectFiles)
    .values({
      projectId,
      name: cleanName(file.name),
      type,
      size: file.size,
      data: Buffer.from(await file.arrayBuffer()),
    })
    .returning({ id: projectFiles.id, name: projectFiles.name });
  return row;
}

export async function readProjectFile(projectId: string, fileId: string) {
  const [row] = await db
    .select()
    .from(projectFiles)
    .where(
      and(eq(projectFiles.id, fileId), eq(projectFiles.projectId, projectId)),
    );
  if (!row) return null;
  return { ...row, viewable: VIEWABLE.has(row.type) };
}

/**
 * Removes the files no payment points to any more: a row deleted, or a
 * document replaced. Files from the last hour are kept, since one uploaded
 * a moment ago belongs to a row that has not been saved yet.
 */
export async function pruneProjectFiles(projectId: string, keep: string[]) {
  const hourAgo = new Date(Date.now() - 60 * 60_000);
  await db
    .delete(projectFiles)
    .where(
      and(
        eq(projectFiles.projectId, projectId),
        lt(projectFiles.createdAt, hourAgo),
        keep.length ? notInArray(projectFiles.id, keep) : undefined,
      ),
    );
}
