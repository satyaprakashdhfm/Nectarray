import "server-only";
import { tool } from "ai";
import { z } from "zod";
import {
  and,
  asc,
  desc,
  eq,
  ilike,
  inArray,
  lte,
  ne,
  or,
  sql,
} from "drizzle-orm";
import { db } from "@/lib/db";
import {
  assetEntries,
  clientPayments,
  clientProjects,
  workItems,
} from "@/lib/db/schema";
import { ADMIN } from "@/lib/admin-path";
import { num, PROJECT_SERVICES, PROJECT_STATUSES } from "@/lib/business";
import { loadMoney, totals } from "@/lib/business-data";
import { loadAssets } from "@/lib/assets";
import { getAnalytics, getOwnRecords } from "@/lib/analytics-report";
import { todayIST } from "@/lib/work";

/**
 * What the admin Agent can read and change: client projects, their tasks,
 * the payments received on them, the company's money on Assets, and the
 * numbers (revenue, work, website visits).
 *
 * Every write goes through the same columns and rules as the panel's own
 * forms, and is noted in `actions` so the chat can show what was changed
 * with a link to it. The route has already checked for an admin.
 */

export type AgentAction = { label: string; href?: string };

const day = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .describe("A date as YYYY-MM-DD");
const serviceId = z.enum(
  PROJECT_SERVICES.map((s) => s.id) as [string, ...string[]],
);
const projectStatus = z.enum(
  PROJECT_STATUSES.map((s) => s.id) as [string, ...string[]],
);
const taskStatus = z.enum(["todo", "doing", "done"]);
const priority = z.enum(["low", "normal", "high"]);
const id = z.string().min(1).describe("An id from a find_ tool");

const projectLink = (projectId: string) => `${ADMIN}/projects/${projectId}`;
const name = (p: { client: string; title: string }) =>
  `${p.client} · ${p.title}`;

/** Delivered keeps the day it first became delivered (as the forms do). */
const deliveredOn = (status: string) =>
  status === "delivered"
    ? sql`coalesce(${clientProjects.deliveredOn}, (now() at time zone 'Asia/Kolkata')::date)`
    : null;

async function projectName(projectId: string) {
  const [p] = await db
    .select({ client: clientProjects.client, title: clientProjects.title })
    .from(clientProjects)
    .where(eq(clientProjects.id, projectId));
  return p ? name(p) : null;
}

export function agentTools(actions: AgentAction[]) {
  const did = (label: string, href?: string) => actions.push({ label, href });

  return {
    // Projects ----------------------------------------------------------------

    find_projects: tool({
      description:
        "Search client projects by client or title (partial, any case), service or status. Returns each project's id, dates, agreed value and what has been paid. Call this first to get a project's id before changing it or its tasks.",
      inputSchema: z.object({
        query: z.string().optional(),
        service: serviceId.optional(),
        status: projectStatus.optional(),
      }),
      execute: async ({ query, service, status }) => {
        const where = and(
          query
            ? or(
                ilike(clientProjects.client, `%${query}%`),
                ilike(clientProjects.title, `%${query}%`),
              )
            : undefined,
          service ? eq(clientProjects.service, service) : undefined,
          status ? eq(clientProjects.status, status) : undefined,
        );
        const rows = await db
          .select({
            id: clientProjects.id,
            service: clientProjects.service,
            client: clientProjects.client,
            title: clientProjects.title,
            status: clientProjects.status,
            value: clientProjects.value,
            startsOn: clientProjects.startsOn,
            dueOn: clientProjects.dueOn,
            deliveredOn: clientProjects.deliveredOn,
            note: clientProjects.note,
            paid: sql<string>`coalesce((select sum(${clientPayments.amount}) from ${clientPayments} where ${clientPayments.projectId} = ${clientProjects.id}), 0)`,
            openTasks: sql<number>`(select count(*)::int from ${workItems} where ${workItems.projectId} = ${clientProjects.id} and ${workItems.status} <> 'done')`,
          })
          .from(clientProjects)
          .where(where)
          .orderBy(desc(clientProjects.createdAt))
          .limit(50);
        return rows.map((r) => ({
          ...r,
          value: r.value === null ? null : num(r.value),
          paid: num(r.paid),
        }));
      },
    }),

    create_project: tool({
      description: "Add a client project.",
      inputSchema: z.object({
        service: serviceId,
        client: z.string().min(1).max(200),
        title: z.string().min(1).max(200),
        status: projectStatus.default("lead"),
        value: z
          .number()
          .nonnegative()
          .optional()
          .describe("Agreed price in rupees"),
        startsOn: day.optional(),
        dueOn: day.optional().describe("The end date / deadline"),
        note: z.string().max(4000).optional(),
      }),
      execute: async (p) => {
        const [row] = await db
          .insert(clientProjects)
          .values({
            service: p.service,
            client: p.client,
            title: p.title,
            status: p.status,
            deliveredOn: p.status === "delivered" ? todayIST() : null,
            value: p.value === undefined ? null : String(p.value),
            startsOn: p.startsOn ?? null,
            dueOn: p.dueOn ?? null,
            note: p.note ?? null,
          })
          .returning({ id: clientProjects.id });
        did(`Added project ${name(p)}`, projectLink(row.id));
        return { id: row.id };
      },
    }),

    update_project: tool({
      description:
        "Change fields of a project. Only the fields given are changed; pass null to clear a date, value or note.",
      inputSchema: z.object({
        id,
        service: serviceId.optional(),
        client: z.string().min(1).max(200).optional(),
        title: z.string().min(1).max(200).optional(),
        status: projectStatus.optional(),
        value: z.number().nonnegative().nullable().optional(),
        startsOn: day.nullable().optional(),
        dueOn: day.nullable().optional(),
        note: z.string().max(4000).nullable().optional(),
      }),
      execute: async ({ id, ...p }) => {
        const before = await projectName(id);
        if (!before) return { error: "No project with that id." };
        await db
          .update(clientProjects)
          .set({
            ...(p.service !== undefined && { service: p.service }),
            ...(p.client !== undefined && { client: p.client }),
            ...(p.title !== undefined && { title: p.title }),
            ...(p.status !== undefined && {
              status: p.status,
              deliveredOn: deliveredOn(p.status),
            }),
            ...(p.value !== undefined && {
              value: p.value === null ? null : String(p.value),
            }),
            ...(p.startsOn !== undefined && { startsOn: p.startsOn }),
            ...(p.dueOn !== undefined && { dueOn: p.dueOn }),
            ...(p.note !== undefined && { note: p.note }),
          })
          .where(eq(clientProjects.id, id));
        did(
          `Updated ${before} (${Object.keys(p).join(", ")})`,
          projectLink(id),
        );
        return { ok: true };
      },
    }),

    delete_project: tool({
      description:
        "Delete a project for good, with its payments. Its tasks are kept without a project. Only after the admin has confirmed this exact project.",
      inputSchema: z.object({ id }),
      execute: async ({ id }) => {
        const before = await projectName(id);
        if (!before) return { error: "No project with that id." };
        await db.delete(clientProjects).where(eq(clientProjects.id, id));
        did(`Deleted project ${before}`);
        return { ok: true };
      },
    }),

    // Tasks -------------------------------------------------------------------

    find_tasks: tool({
      description:
        "List tasks, optionally for one project, a status, a person, words in the title, or due on or before a date. Overdue means not done and due before today.",
      inputSchema: z.object({
        projectId: id.optional(),
        status: taskStatus.optional(),
        notDone: z.boolean().optional().describe("Only tasks not yet done"),
        assignee: z.string().optional(),
        query: z.string().optional(),
        dueBy: day.optional(),
      }),
      execute: async (f) => {
        const rows = await db
          .select({
            id: workItems.id,
            title: workItems.title,
            notes: workItems.notes,
            assignee: workItems.assignee,
            status: workItems.status,
            priority: workItems.priority,
            dueOn: workItems.dueOn,
            projectId: workItems.projectId,
            project: sql<
              string | null
            >`${clientProjects.client} || ' · ' || ${clientProjects.title}`,
          })
          .from(workItems)
          .leftJoin(clientProjects, eq(clientProjects.id, workItems.projectId))
          .where(
            and(
              f.projectId ? eq(workItems.projectId, f.projectId) : undefined,
              f.status ? eq(workItems.status, f.status) : undefined,
              f.notDone ? ne(workItems.status, "done") : undefined,
              f.assignee
                ? ilike(workItems.assignee, `%${f.assignee}%`)
                : undefined,
              f.query ? ilike(workItems.title, `%${f.query}%`) : undefined,
              f.dueBy ? lte(workItems.dueOn, f.dueBy) : undefined,
            ),
          )
          .orderBy(asc(workItems.dueOn), desc(workItems.createdAt))
          .limit(100);
        return rows;
      },
    }),

    add_tasks: tool({
      description:
        "Add one or more tasks, all for the same project (or none). Use this once for a whole list the admin gives.",
      inputSchema: z.object({
        projectId: id.optional(),
        tasks: z
          .array(
            z.object({
              title: z.string().min(1).max(300),
              notes: z.string().max(4000).optional(),
              assignee: z.string().max(80).optional(),
              priority: priority.default("normal"),
              status: taskStatus.default("todo"),
              dueOn: day.optional().describe("The end date"),
            }),
          )
          .min(1)
          .max(50),
      }),
      execute: async ({ projectId, tasks }) => {
        const project = projectId ? await projectName(projectId) : null;
        if (projectId && !project) return { error: "No project with that id." };
        const rows = await db
          .insert(workItems)
          .values(
            tasks.map((t) => ({
              projectId: projectId ?? null,
              title: t.title,
              notes: t.notes ?? null,
              assignee: t.assignee ?? null,
              priority: t.priority,
              status: t.status,
              dueOn: t.dueOn ?? null,
              doneAt: t.status === "done" ? new Date() : null,
            })),
          )
          .returning({ id: workItems.id });
        did(
          `Added ${tasks.length} task${tasks.length === 1 ? "" : "s"}${project ? ` to ${project}` : ""}`,
          `${ADMIN}/tasks`,
        );
        return { ids: rows.map((r) => r.id) };
      },
    }),

    update_task: tool({
      description:
        "Change one task. Only the fields given change; null clears notes, assignee, due date or project.",
      inputSchema: z.object({
        id,
        title: z.string().min(1).max(300).optional(),
        notes: z.string().max(4000).nullable().optional(),
        assignee: z.string().max(80).nullable().optional(),
        priority: priority.optional(),
        status: taskStatus.optional(),
        dueOn: day.nullable().optional(),
        projectId: id.nullable().optional(),
      }),
      execute: async ({ id, ...p }) => {
        const [before] = await db
          .select({ title: workItems.title, doneAt: workItems.doneAt })
          .from(workItems)
          .where(eq(workItems.id, id));
        if (!before) return { error: "No task with that id." };
        await db
          .update(workItems)
          .set({
            ...p,
            ...(p.status !== undefined && {
              doneAt:
                p.status === "done" ? (before.doneAt ?? new Date()) : null,
            }),
            updatedAt: new Date(),
          })
          .where(eq(workItems.id, id));
        did(`Updated task "${before.title}"`, `${ADMIN}/tasks`);
        return { ok: true };
      },
    }),

    delete_tasks: tool({
      description: "Delete tasks by id, after the admin has asked for it.",
      inputSchema: z.object({ ids: z.array(id).min(1).max(50) }),
      execute: async ({ ids }) => {
        const gone = await db
          .delete(workItems)
          .where(inArray(workItems.id, ids))
          .returning({ title: workItems.title });
        did(
          gone.length === 1
            ? `Deleted task "${gone[0].title}"`
            : `Deleted ${gone.length} tasks`,
          `${ADMIN}/tasks`,
        );
        return { deleted: gone.length };
      },
    }),

    // Money -------------------------------------------------------------------

    find_payments: tool({
      description:
        "Payments received from clients, newest first, optionally for one project.",
      inputSchema: z.object({ projectId: id.optional() }),
      execute: async ({ projectId }) =>
        (
          await db
            .select({
              id: clientPayments.id,
              projectId: clientPayments.projectId,
              project: sql<string>`${clientProjects.client} || ' · ' || ${clientProjects.title}`,
              amount: clientPayments.amount,
              receivedOn: clientPayments.receivedOn,
              ref: clientPayments.ref,
            })
            .from(clientPayments)
            .innerJoin(
              clientProjects,
              eq(clientProjects.id, clientPayments.projectId),
            )
            .where(
              projectId ? eq(clientPayments.projectId, projectId) : undefined,
            )
            .orderBy(desc(clientPayments.receivedOn))
            .limit(100)
        ).map((p) => ({ ...p, amount: num(p.amount) })),
    }),

    record_payment: tool({
      description:
        "Record money received from a client against a project (Revenue).",
      inputSchema: z.object({
        projectId: id,
        amount: z.number().positive().describe("Rupees"),
        receivedOn: day,
        ref: z.string().max(200).optional().describe("UTR, invoice no., note"),
      }),
      execute: async (p) => {
        const project = await projectName(p.projectId);
        if (!project) return { error: "No project with that id." };
        const [row] = await db
          .insert(clientPayments)
          .values({
            projectId: p.projectId,
            amount: String(p.amount),
            receivedOn: p.receivedOn,
            ref: p.ref ?? null,
          })
          .returning({ id: clientPayments.id });
        did(
          `Recorded ₹${p.amount.toLocaleString("en-IN")} from ${project}`,
          projectLink(p.projectId),
        );
        return { id: row.id };
      },
    }),

    delete_payment: tool({
      description:
        "Delete a recorded client payment, after the admin confirms.",
      inputSchema: z.object({ id }),
      execute: async ({ id }) => {
        const [gone] = await db
          .delete(clientPayments)
          .where(eq(clientPayments.id, id))
          .returning({ amount: clientPayments.amount });
        if (!gone) return { error: "No payment with that id." };
        did(
          `Deleted a payment of ₹${num(gone.amount).toLocaleString("en-IN")}`,
          ADMIN,
        );
        return { ok: true };
      },
    }),

    assets: tool({
      description:
        "The company's money on the Assets page: balance, money in, bills paid, other spends, who is still to be paid back, and the latest movements (manual entries have source 'entry' and an id).",
      inputSchema: z.object({}),
      execute: async () => {
        const { movements, owed, totals } = await loadAssets();
        return { totals, owed, latest: movements.slice(0, 40) };
      },
    }),

    add_asset_entry: tool({
      description:
        "Add money put into the company ('in') or money spent that is not a project bill ('out'), with its reason.",
      inputSchema: z.object({
        kind: z.enum(["in", "out"]),
        amount: z.number().positive().describe("Rupees"),
        on: day,
        reason: z.string().min(1).max(300),
      }),
      execute: async (e) => {
        const [row] = await db
          .insert(assetEntries)
          .values({ ...e, amount: String(e.amount), addedBy: "Agent" })
          .returning({ id: assetEntries.id });
        did(
          `${e.kind === "in" ? "Money in" : "Spent"} ₹${e.amount.toLocaleString("en-IN")}: ${e.reason}`,
          `${ADMIN}/assets`,
        );
        return { id: row.id };
      },
    }),

    delete_asset_entry: tool({
      description:
        "Remove a manual entry from Assets, after the admin confirms.",
      inputSchema: z.object({ id }),
      execute: async ({ id }) => {
        const [gone] = await db
          .delete(assetEntries)
          .where(eq(assetEntries.id, id))
          .returning({ reason: assetEntries.reason });
        if (!gone) return { error: "No entry with that id." };
        did(`Removed "${gone.reason}" from Assets`, `${ADMIN}/assets`);
        return { ok: true };
      },
    }),

    // Numbers -----------------------------------------------------------------

    business_summary: tool({
      description:
        "Analytics for the business: revenue (all time, this month, this year, owed by clients, pipeline) overall and per service, projects by status, projects due soon or late, and tasks by status, overdue and per person.",
      inputSchema: z.object({}),
      execute: async () => {
        const today = todayIST();
        const money = await loadMoney();
        const revenue = (services: string[] | null) => {
          const { receipts, projects, ...t } = totals(money, services);
          void receipts;
          void projects;
          return t;
        };
        const tasks = await db
          .select({
            status: workItems.status,
            assignee: workItems.assignee,
            dueOn: workItems.dueOn,
          })
          .from(workItems);
        const open = tasks.filter((t) => t.status !== "done");
        const perPerson: Record<string, { open: number; overdue: number }> = {};
        for (const t of open) {
          const who = t.assignee || "Anyone";
          perPerson[who] ??= { open: 0, overdue: 0 };
          perPerson[who].open++;
          if (t.dueOn && t.dueOn < today) perPerson[who].overdue++;
        }
        const live = money.projects.filter((p) =>
          ["lead", "proposal", "active", "on_hold"].includes(p.status),
        );
        return {
          today,
          revenue: {
            all: revenue(null),
            byService: Object.fromEntries(
              [...PROJECT_SERVICES.map((s) => s.id), "academy"].map((id) => [
                id,
                revenue([id]),
              ]),
            ),
          },
          projectsByStatus: Object.fromEntries(
            PROJECT_STATUSES.map((s) => [
              s.id,
              money.projects.filter((p) => p.status === s.id).length,
            ]),
          ),
          projectsLate: live
            .filter((p) => p.dueOn && p.dueOn < today)
            .map((p) => ({ id: p.id, project: name(p), dueOn: p.dueOn })),
          projectsDueIn14Days: live
            .filter(
              (p) =>
                p.dueOn &&
                p.dueOn >= today &&
                p.dueOn <=
                  new Date(Date.parse(today) + 14 * 86_400_000)
                    .toISOString()
                    .slice(0, 10),
            )
            .map((p) => ({ id: p.id, project: name(p), dueOn: p.dueOn })),
          tasks: {
            todo: tasks.filter((t) => t.status === "todo").length,
            doing: tasks.filter((t) => t.status === "doing").length,
            done: tasks.filter((t) => t.status === "done").length,
            overdue: open.filter((t) => t.dueOn && t.dueOn < today).length,
            perPerson,
          },
        };
      },
    }),

    website_analytics: tool({
      description:
        "Website visits from Google Analytics over the last 28 days (visitors, visits, sources, top pages, devices, cities, enquiry funnel), for the whole site or one service, plus sign-ups and academy enquiries from our own records.",
      inputSchema: z.object({
        service: z.enum(["marketing", "software", "ai", "academy"]).optional(),
      }),
      execute: async ({ service }) => {
        const [ga, own] = await Promise.all([
          getAnalytics(service ?? null),
          getOwnRecords(),
        ]);
        return {
          googleAnalytics: ga.error ? { error: ga.error } : ga.data,
          own,
        };
      },
    }),
  };
}
