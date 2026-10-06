"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { clientProjects, workItems } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/access";
import { isPriority, isStatus } from "@/lib/work";

/**
 * Work items for the Tasks tab: add, edit, move between To do, In progress
 * and Done, and delete. Each checks for an admin first; a server action is
 * a public endpoint whatever page imports it.
 */

const text = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();

const optional = (form: FormData, key: string, max = 200) =>
  text(form, key).slice(0, max) || null;

function dueOn(form: FormData) {
  const v = text(form, "due_on");
  if (!v) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v))
    throw new Error("The due date is not a date.");
  return v;
}

async function projectId(form: FormData) {
  const id = text(form, "project_id");
  if (!id) return null;
  const [row] = await db
    .select({ id: clientProjects.id })
    .from(clientProjects)
    .where(eq(clientProjects.id, id));
  if (!row) throw new Error("That project no longer exists.");
  return row.id;
}

function priority(form: FormData) {
  const v = text(form, "priority") || "normal";
  if (!isPriority(v)) throw new Error(`Unknown priority: ${v}`);
  return v;
}

function status(form: FormData) {
  const v = text(form, "status") || "todo";
  if (!isStatus(v)) throw new Error(`Unknown status: ${v}`);
  return v;
}

const done = () => {
  revalidatePath("/admin/tasks");
  revalidatePath("/admin/timeline");
};

export async function createWorkItem(form: FormData) {
  await requireAdmin();
  const title = text(form, "title").slice(0, 300);
  if (!title) throw new Error("A task needs a title.");
  const s = status(form);
  await db.insert(workItems).values({
    title,
    projectId: await projectId(form),
    assignee: optional(form, "assignee", 80),
    notes: optional(form, "notes", 4000),
    priority: priority(form),
    status: s,
    dueOn: dueOn(form),
    doneAt: s === "done" ? new Date() : null,
  });
  done();
}

export async function updateWorkItem(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  const title = text(form, "title").slice(0, 300);
  if (!id) throw new Error("Missing task.");
  if (!title) throw new Error("A task needs a title.");
  const s = status(form);
  const [before] = await db
    .select({ status: workItems.status, doneAt: workItems.doneAt })
    .from(workItems)
    .where(eq(workItems.id, id));
  if (!before) throw new Error("That task no longer exists.");
  await db
    .update(workItems)
    .set({
      title,
      projectId: await projectId(form),
      assignee: optional(form, "assignee", 80),
      notes: optional(form, "notes", 4000),
      priority: priority(form),
      status: s,
      dueOn: dueOn(form),
      doneAt: s === "done" ? (before.doneAt ?? new Date()) : null,
      updatedAt: new Date(),
    })
    .where(eq(workItems.id, id));
  done();
}

/** One click: To do, In progress or Done. */
export async function setWorkItemStatus(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  if (!id) throw new Error("Missing task.");
  const s = status(form);
  await db
    .update(workItems)
    .set({
      status: s,
      doneAt: s === "done" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(workItems.id, id));
  done();
}

export async function deleteWorkItem(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  if (!id) throw new Error("Missing task.");
  await db.delete(workItems).where(eq(workItems.id, id));
  done();
}
