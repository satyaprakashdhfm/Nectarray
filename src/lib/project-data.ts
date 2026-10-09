import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { clientProjects, projectDetails } from "@/lib/db/schema";
import { AccessError, requireAdmin } from "@/lib/auth/access";
import {
  EMPTY_SHEETS,
  STARTER_SHEETS,
  cleanSheets,
  dashboardFor,
  type ProjectSheets,
} from "@/lib/project-details";
import { open } from "@/lib/vault";

/**
 * The project a panel route handler was asked about, for an admin only.
 * Anything else comes back as the Response to send instead.
 */
export async function adminProject(
  id: string,
): Promise<typeof clientProjects.$inferSelect | Response> {
  try {
    await requireAdmin();
  } catch (error) {
    const status = error instanceof AccessError ? error.status : 401;
    return new Response("Not allowed", { status });
  }
  if (!/^[0-9a-f-]{36}$/i.test(id))
    return new Response("Not found", { status: 404 });
  const [project] = await db
    .select()
    .from(clientProjects)
    .where(eq(clientProjects.id, id));
  return project ?? new Response("Not found", { status: 404 });
}

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
  const sheets = row ? cleanSheets(row) : STARTER_SHEETS;
  return {
    ...sheets,
    // A service with no link typed gets its platform's dashboard.
    recurring: sheets.recurring.map((r) => ({
      ...r,
      link: r.link || dashboardFor(r.item),
    })),
    access: sheets.access.map((a) => ({ ...a, password: open(a.password) })),
  };
}
