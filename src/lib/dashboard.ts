import "server-only";
import { asc, desc, eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  batches,
  clientPayments,
  clientProjects,
  enrolments,
  projectDetails,
  users,
} from "@/lib/db/schema";
import { isOwnCompany, lineOf, num } from "@/lib/business";
import { cleanSheets, isCompany } from "@/lib/project-details";

/** One line of money on a project card: in from the client, or a cost. */
export type CardMove = {
  key: string;
  kind: "in" | "out";
  /** "2026-10-05", or "2026-10" for a cost with only its month. */
  on: string;
  what: string;
  amount: number;
  /** For a cost: who paid it, and where it stands. */
  paidBy?: string;
  repaid?: boolean;
  clientPaid?: boolean;
};

export type ProjectCard = {
  id: string;
  title: string;
  client: string;
  /** The revenue line: marketing, software, ai or academy. */
  line: string;
  status: string;
  value: number | null;
  received: number;
  costs: number;
  /** Costs the client has not paid us back for yet. */
  clientOwes: number;
  /** Costs people paid that the company has not paid back yet. */
  toPayBack: number;
  /** The last time anything on it changed, for the order of the cards. */
  edited: string;
  recent: CardMove[];
};

export type Batch = {
  id: string;
  name: string;
  total: number;
  students: { id: string; name: string; paid: number; on: string | null }[];
};

const iso = (d: Date | string | null | undefined) =>
  d ? new Date(d).toISOString() : "";

/**
 * Every client project as a card for the dashboard, most recently changed
 * first, with its last six payments in and out; and the academy's batches
 * with each student's fee.
 */
export async function loadDashboard(): Promise<{
  cards: ProjectCard[];
  batches: Batch[];
}> {
  const [projects, payments, details, batchRows, students] = await Promise.all([
    db.select().from(clientProjects).orderBy(desc(clientProjects.createdAt)),
    db.select().from(clientPayments).orderBy(desc(clientPayments.receivedOn)),
    db
      .select({
        projectId: projectDetails.projectId,
        paid: projectDetails.paid,
        updatedAt: projectDetails.updatedAt,
      })
      .from(projectDetails)
      .catch(() => []),
    db
      .select({ id: batches.id, name: batches.name })
      .from(batches)
      .orderBy(asc(batches.createdAt)),
    db
      .select({
        id: enrolments.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        batchId: users.batchId,
        amount: enrolments.amountPaid,
        paidOn: enrolments.paidOn,
      })
      .from(enrolments)
      .innerJoin(users, eq(enrolments.userId, users.id))
      .where(ne(users.role, "admin")),
  ]);

  const sheetOf = new Map(details.map((d) => [d.projectId, d]));

  const cards = projects.map((p): ProjectCard => {
    const ins = payments.filter((x) => x.projectId === p.id);
    const sheet = sheetOf.get(p.id);
    const paid = sheet ? cleanSheets({ paid: sheet.paid }).paid : [];
    const own = isOwnCompany(p.client, p.title);
    const recent: CardMove[] = [
      ...ins.map((x) => ({
        key: `p-${x.id}`,
        kind: "in" as const,
        on: x.receivedOn,
        what: x.ref ? `Payment · ${x.ref}` : "Client payment",
        amount: num(x.amount),
      })),
      ...paid
        .filter((r) => r.amount > 0)
        .map((r) => ({
          key: `c-${r.id}`,
          kind: "out" as const,
          on: r.paidOn || r.month,
          what: [r.item, r.vendor].filter(Boolean).join(" · ") || "Cost",
          amount: r.amount,
          paidBy: isCompany(r.paidBy) ? "Company" : r.paidBy,
          repaid: isCompany(r.paidBy) || r.repaid,
          // Our own products have no client to pay anything back.
          clientPaid: own ? undefined : r.clientPaid,
        })),
    ]
      .sort((a, b) => b.on.localeCompare(a.on))
      .slice(0, 6);

    const edited = [
      iso(p.createdAt),
      iso(sheet?.updatedAt),
      ...ins.map((x) => iso(x.createdAt)),
    ]
      .sort()
      .at(-1);

    return {
      id: p.id,
      title: p.title,
      client: p.client,
      line: lineOf(p.service),
      status: p.status,
      value: p.value == null ? null : num(p.value),
      received: ins.reduce((n, x) => n + num(x.amount), 0),
      costs: paid.reduce((n, r) => n + r.amount, 0),
      // Our own products have no client to pay anything back.
      clientOwes: isOwnCompany(p.client, p.title)
        ? 0
        : paid.filter((r) => !r.clientPaid).reduce((n, r) => n + r.amount, 0),
      toPayBack: paid
        .filter((r) => !isCompany(r.paidBy) && !r.repaid)
        .reduce((n, r) => n + r.amount, 0),
      edited: edited ?? "",
      recent,
    };
  });
  cards.sort((a, b) => b.edited.localeCompare(a.edited));

  const name = (s: (typeof students)[number]) =>
    [s.firstName, s.lastName].filter(Boolean).join(" ") || s.email || "Student";
  const groups: Batch[] = [
    ...batchRows.map((b) => ({ id: b.id, name: b.name })),
    { id: "none", name: "No batch" },
  ].map((b) => {
    const mine = students.filter((s) =>
      b.id === "none"
        ? !s.batchId || !batchRows.some((x) => x.id === s.batchId)
        : s.batchId === b.id,
    );
    const list = mine.map((s) => ({
      id: s.id,
      name: name(s),
      paid: num(s.amount),
      on: s.paidOn,
    }));
    return {
      ...b,
      students: list,
      total: list.reduce((n, s) => n + s.paid, 0),
    };
  });

  return {
    cards,
    batches: groups.filter((b) => b.id !== "none" || b.students.length > 0),
  };
}
