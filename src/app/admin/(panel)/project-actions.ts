"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { projectDetails } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/access";
import { cleanSheets } from "@/lib/project-details";
import { seal } from "@/lib/vault";

/**
 * Saves a project's working file: status note, deployment links and the
 * three handover sheets. Passwords are encrypted on the way in when
 * PROJECT_VAULT_KEY is set.
 */
export async function saveProjectSheets(projectId: string, input: unknown) {
  await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(projectId)) throw new Error("Missing project.");
  const sheets = cleanSheets(input);

  // A password shown as locked was not readable; keep what is stored.
  const [before] = await db
    .select({ access: projectDetails.access })
    .from(projectDetails)
    .where(eq(projectDetails.projectId, projectId));
  const stored = new Map(
    (Array.isArray(before?.access) ? before.access : []).map((a) => [
      (a as { id: string }).id,
      (a as { password: string }).password,
    ]),
  );
  const access = sheets.access.map((a) => ({
    ...a,
    password: a.password.startsWith("(locked:")
      ? (stored.get(a.id) ?? "")
      : seal(a.password),
  }));

  const values = {
    statusNote: sheets.statusNote,
    links: sheets.links,
    paid: sheets.paid,
    recurring: sheets.recurring,
    access,
    updatedAt: new Date(),
  };
  await db
    .insert(projectDetails)
    .values({ projectId, ...values })
    .onConflictDoUpdate({ target: projectDetails.projectId, set: values });
  revalidatePath(`/admin/projects/${projectId}`);
}
