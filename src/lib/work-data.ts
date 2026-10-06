import "server-only";
import { asc, desc, eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { clientProjects, workItems } from "@/lib/db/schema";

/**
 * What the Tasks and Timeline tabs read. Admin pages only: the panel's
 * layout has already checked for an admin before either runs.
 *
 * Both fall back to empty lists when the work_items table is not there
 * yet (42P01), so the pages open on a deploy whose migration has not run.
 */

export type WorkRow = {
  id: string;
  title: string;
  notes: string | null;
  assignee: string | null;
  status: string;
  priority: string;
  dueOn: string | null;
  doneAt: Date | null;
  createdAt: Date;
  projectId: string | null;
  projectTitle: string | null;
  projectClient: string | null;
};

export type ProjectOption = {
  id: string;
  title: string;
  client: string;
  status: string;
  service: string;
};

const missing = (e: unknown) =>
  typeof e === "object" &&
  e !== null &&
  "code" in e &&
  (e as { code?: string }).code === "42P01";

export async function loadWorkItems(): Promise<WorkRow[]> {
  try {
    return await db
      .select({
        id: workItems.id,
        title: workItems.title,
        notes: workItems.notes,
        assignee: workItems.assignee,
        status: workItems.status,
        priority: workItems.priority,
        dueOn: workItems.dueOn,
        doneAt: workItems.doneAt,
        createdAt: workItems.createdAt,
        projectId: workItems.projectId,
        projectTitle: clientProjects.title,
        projectClient: clientProjects.client,
      })
      .from(workItems)
      .leftJoin(clientProjects, eq(clientProjects.id, workItems.projectId))
      .orderBy(asc(workItems.dueOn), desc(workItems.createdAt));
  } catch (e) {
    if (missing(e)) return [];
    throw e;
  }
}

/** Every project that is not lost, newest first, for the task form. */
export async function loadProjectOptions(): Promise<ProjectOption[]> {
  return db
    .select({
      id: clientProjects.id,
      title: clientProjects.title,
      client: clientProjects.client,
      status: clientProjects.status,
      service: clientProjects.service,
    })
    .from(clientProjects)
    .where(ne(clientProjects.status, "lost"))
    .orderBy(desc(clientProjects.createdAt));
}

export type TimelineProject = {
  id: string;
  title: string;
  client: string;
  service: string;
  status: string;
  startsOn: string | null;
  dueOn: string | null;
  deliveredOn: string | null;
  createdAt: Date;
};

export async function loadTimelineProjects(): Promise<TimelineProject[]> {
  try {
    return await db
      .select({
        id: clientProjects.id,
        title: clientProjects.title,
        client: clientProjects.client,
        service: clientProjects.service,
        status: clientProjects.status,
        startsOn: clientProjects.startsOn,
        dueOn: clientProjects.dueOn,
        deliveredOn: clientProjects.deliveredOn,
        createdAt: clientProjects.createdAt,
      })
      .from(clientProjects)
      .where(ne(clientProjects.status, "lost"))
      .orderBy(asc(clientProjects.createdAt));
  } catch (e) {
    // The delivered_on column arrives with the same migration.
    if (missing(e) || (e as { code?: string })?.code === "42703") return [];
    throw e;
  }
}
