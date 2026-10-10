"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/access";
import * as drive from "@/lib/drive";

/**
 * The Drive's actions. Each checks for an admin first (a server action is a
 * public endpoint whatever page imports it), then hands the project id to
 * lib/drive, which checks the folder or file belongs to that project.
 *
 * They answer { error } rather than throwing, so the page can show what
 * went wrong next to the thing that failed.
 */

type Result<T = null> = { ok: true; value: T } | { ok: false; error: string };

async function run<T>(
  projectId: string,
  work: () => Promise<T>,
): Promise<Result<T>> {
  await requireAdmin();
  if (!drive.isId(projectId)) return { ok: false, error: "No such project." };
  try {
    const value = await work();
    revalidatePath("/admin/drive", "layout");
    return { ok: true, value };
  } catch (error) {
    console.error("[drive]", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Something went wrong.",
    };
  }
}

const folder = (id: string | null) => (id && drive.isId(id) ? id : null);

export async function createFolder(
  projectId: string,
  parentId: string | null,
  name: string,
) {
  return run(projectId, () =>
    drive.createFolder(projectId, folder(parentId), name),
  );
}

export async function renameFolder(
  projectId: string,
  folderId: string,
  name: string,
) {
  return run(projectId, () => drive.renameFolder(projectId, folderId, name));
}

export async function deleteFolder(projectId: string, folderId: string) {
  return run(projectId, () => drive.deleteFolder(projectId, folderId));
}

export async function renameFile(
  projectId: string,
  fileId: string,
  name: string,
) {
  return run(projectId, () => drive.renameFile(projectId, fileId, name));
}

export async function deleteFile(projectId: string, fileId: string) {
  return run(projectId, () => drive.deleteFile(projectId, fileId));
}

export async function startUpload(
  projectId: string,
  folderId: string | null,
  file: { name: string; type: string; size: number },
) {
  return run(projectId, () =>
    drive.startUpload(projectId, folder(folderId), {
      name: String(file.name),
      type: String(file.type),
      size: Number(file.size),
    }),
  );
}

export async function finishUpload(projectId: string, fileId: string) {
  return run(projectId, () => drive.finishUpload(projectId, fileId));
}
