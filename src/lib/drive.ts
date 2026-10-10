import "server-only";
import { and, asc, desc, eq, isNull, lt, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { clientProjects, driveFiles, driveFolders } from "@/lib/db/schema";
import { deleteObject, storedSize, uploadLink } from "@/lib/drive-storage";

/**
 * A project's Drive: folders and files, Google Drive style. Everything is
 * scoped to one project, and every function checks that the folder or file
 * it is handed belongs to that project, so an id from another project's
 * Drive does nothing.
 */

export type DriveFolder = { id: string; name: string; createdAt: Date };
export type DriveFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: Date;
};
export type Crumb = { id: string | null; name: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isId = (v: unknown): v is string =>
  typeof v === "string" && UUID.test(v);

/** A name safe to store and show: no slashes or control characters. */
export function cleanName(name: string) {
  const clean = name
    .replace(/[\\/\u0000-\u001f]/g, "")
    .trim()
    .slice(0, 200);
  if (!clean) throw new Error("A name is needed.");
  return clean;
}

const inFolder = (folderId: string | null) =>
  folderId
    ? eq(driveFolders.parentId, folderId)
    : isNull(driveFolders.parentId);

/** Throws unless the folder is this project's. null is the top level. */
async function ownFolder(projectId: string, folderId: string | null) {
  if (folderId === null) return;
  if (!isId(folderId)) throw new Error("No such folder.");
  const [row] = await db
    .select({ id: driveFolders.id })
    .from(driveFolders)
    .where(
      and(eq(driveFolders.id, folderId), eq(driveFolders.projectId, projectId)),
    );
  if (!row) throw new Error("No such folder.");
}

async function ownFile(projectId: string, fileId: string) {
  if (!isId(fileId)) throw new Error("No such file.");
  const [row] = await db
    .select()
    .from(driveFiles)
    .where(and(eq(driveFiles.id, fileId), eq(driveFiles.projectId, projectId)));
  if (!row) throw new Error("No such file.");
  return row;
}

/**
 * The path from the top of the Drive down to a folder, for the breadcrumbs.
 * Null when the folder is not this project's.
 */
async function pathTo(
  projectId: string,
  folderId: string,
): Promise<Crumb[] | null> {
  const rows = await db.execute<{ id: string; name: string; depth: number }>(
    sql`WITH RECURSIVE up AS (
          SELECT id, name, parent_id, 0 AS depth FROM drive_folders
           WHERE id = ${folderId} AND project_id = ${projectId}
          UNION ALL
          SELECT f.id, f.name, f.parent_id, up.depth + 1 FROM drive_folders f
            JOIN up ON f.id = up.parent_id
        )
        SELECT id, name, depth FROM up ORDER BY depth DESC`,
  );
  if (rows.length === 0) return null;
  return rows.map((r) => ({ id: r.id, name: r.name }));
}

/** One folder's contents (the top level when folderId is null). */
export async function loadFolder(projectId: string, folderId: string | null) {
  const path = folderId ? await pathTo(projectId, folderId) : [];
  if (path === null) return null;
  const [folders, files] = await Promise.all([
    db
      .select({
        id: driveFolders.id,
        name: driveFolders.name,
        createdAt: driveFolders.createdAt,
      })
      .from(driveFolders)
      .where(and(eq(driveFolders.projectId, projectId), inFolder(folderId)))
      .orderBy(asc(sql`lower(${driveFolders.name})`)),
    db
      .select({
        id: driveFiles.id,
        name: driveFiles.name,
        type: driveFiles.type,
        size: driveFiles.size,
        createdAt: driveFiles.createdAt,
      })
      .from(driveFiles)
      .where(
        and(
          eq(driveFiles.projectId, projectId),
          folderId
            ? eq(driveFiles.folderId, folderId)
            : isNull(driveFiles.folderId),
          eq(driveFiles.status, "ready"),
        ),
      )
      .orderBy(desc(driveFiles.createdAt)),
  ]);
  return { path, folders, files };
}

/** Every project, with how much its Drive holds. */
export async function loadDrives() {
  return db
    .select({
      id: clientProjects.id,
      title: clientProjects.title,
      client: clientProjects.client,
      service: clientProjects.service,
      files: sql<number>`count(${driveFiles.id})::int`,
      bytes: sql<number>`coalesce(sum(${driveFiles.size}), 0)::float8`,
    })
    .from(clientProjects)
    .leftJoin(
      driveFiles,
      and(
        eq(driveFiles.projectId, clientProjects.id),
        eq(driveFiles.status, "ready"),
      ),
    )
    .groupBy(clientProjects.id)
    .orderBy(asc(sql`lower(${clientProjects.title})`));
}

export async function createFolder(
  projectId: string,
  parentId: string | null,
  name: string,
) {
  await ownFolder(projectId, parentId);
  await db
    .insert(driveFolders)
    .values({ projectId, parentId, name: cleanName(name) });
}

export async function renameFolder(
  projectId: string,
  folderId: string,
  name: string,
) {
  await ownFolder(projectId, folderId);
  await db
    .update(driveFolders)
    .set({ name: cleanName(name) })
    .where(eq(driveFolders.id, folderId));
}

/**
 * Deletes a folder and everything inside it. The files leave the bucket
 * first; the rows go with the folder (the foreign keys cascade).
 */
export async function deleteFolder(projectId: string, folderId: string) {
  await ownFolder(projectId, folderId);
  const keys = await db.execute<{ key: string }>(
    sql`WITH RECURSIVE down AS (
          SELECT id FROM drive_folders WHERE id = ${folderId}
          UNION ALL
          SELECT f.id FROM drive_folders f JOIN down ON f.parent_id = down.id
        )
        SELECT key FROM drive_files WHERE folder_id IN (SELECT id FROM down)`,
  );
  for (const { key } of keys) await deleteObject(key);
  await db.delete(driveFolders).where(eq(driveFolders.id, folderId));
}

export async function renameFile(
  projectId: string,
  fileId: string,
  name: string,
) {
  await ownFile(projectId, fileId);
  await db
    .update(driveFiles)
    .set({ name: cleanName(name) })
    .where(eq(driveFiles.id, fileId));
}

export async function deleteFile(projectId: string, fileId: string) {
  const file = await ownFile(projectId, fileId);
  await deleteObject(file.key);
  await db.delete(driveFiles).where(eq(driveFiles.id, fileId));
}

/** A file to send to the browser: its row, if ready and this project's. */
export async function readyFile(projectId: string, fileId: string) {
  const file = await ownFile(projectId, fileId).catch(() => null);
  return file?.status === "ready" ? file : null;
}

/**
 * Starts an upload: a pending row and a link the browser PUTs the file to.
 * The object key is the project and a fresh id, never the file's name, so
 * two files called "logo.png" never meet in the bucket.
 */
export async function startUpload(
  projectId: string,
  folderId: string | null,
  file: { name: string; type: string; size: number },
) {
  await ownFolder(projectId, folderId);
  if (!Number.isSafeInteger(file.size) || file.size <= 0)
    throw new Error("That file is empty.");
  const id = crypto.randomUUID();
  const key = `projects/${projectId}/${id}`;
  await db.insert(driveFiles).values({
    id,
    projectId,
    folderId,
    name: cleanName(file.name),
    type: file.type.slice(0, 200) || "application/octet-stream",
    size: file.size,
    key,
  });
  return { id, url: await uploadLink(key) };
}

/**
 * Marks an upload done once the bucket really has it, at the size it
 * arrived as. Also clears this project's uploads abandoned over a day ago.
 */
export async function finishUpload(projectId: string, fileId: string) {
  const file = await ownFile(projectId, fileId);
  const size = await storedSize(file.key);
  if (size === null) throw new Error("The upload did not reach storage.");
  await db
    .update(driveFiles)
    .set({ status: "ready", size })
    .where(eq(driveFiles.id, fileId));

  const dayAgo = new Date(Date.now() - 24 * 60 * 60_000);
  const stale = await db
    .select({ id: driveFiles.id, key: driveFiles.key })
    .from(driveFiles)
    .where(
      and(
        eq(driveFiles.projectId, projectId),
        eq(driveFiles.status, "pending"),
        lt(driveFiles.createdAt, dayAgo),
      ),
    );
  for (const s of stale) {
    await deleteObject(s.key);
    await db.delete(driveFiles).where(eq(driveFiles.id, s.id));
  }
}
