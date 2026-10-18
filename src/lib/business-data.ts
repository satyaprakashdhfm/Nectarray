import "server-only";
import { desc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  adCampaigns,
  clientPayments,
  clientProjects,
  enrolments,
  projectDetails,
  users,
} from "@/lib/db/schema";
import { REVENUE_LINES, lineOf, num } from "@/lib/business";
import {
  cleanCommissions,
  commissionAmount,
  realCommissions,
} from "@/lib/commissions";

/**
 * Every rupee received, from every service, as one list.
 *
 * Client payments carry their project's service; academy fees come off
 * `enrolments`, where the students page records them. Nothing is copied
 * between the two, so a fee edited on the students page is the same fee here.
 */
export type Receipt = {
  service: string;
  amount: number;
  on: string;
  from: string;
  what: string;
  /** The client project it was paid on; none for an academy fee. */
  projectId?: string;
  /** A note kept with the payment ("advance", a UPI ref). */
  ref?: string;
};

/**
 * Every course fee paid, with who paid it. A fee entered without its date
 * counts from the day the student was enrolled, so it always has one.
 */
export async function loadFees() {
  const rows = await db
    .select({
      id: enrolments.id,
      amount: enrolments.amountPaid,
      on: enrolments.paidOn,
      enrolled: enrolments.createdAt,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
    })
    .from(enrolments)
    .innerJoin(users, eq(enrolments.userId, users.id))
    .where(isNotNull(enrolments.amountPaid));
  return rows
    .filter((f) => num(f.amount) > 0)
    .map((f) => ({
      id: f.id,
      amount: num(f.amount),
      // In India time, so a late-evening enrolment keeps its own day.
      on: f.on ?? istDay(f.enrolled),
      name:
        [f.firstName, f.lastName].filter(Boolean).join(" ") ||
        f.email ||
        "Student",
    }));
}

/** One commission given, worked out from what has been received. */
export type CommissionRow = {
  key: string;
  name: string;
  percent: number;
  amount: number;
  /** What it is a share of. */
  base: number;
  /** The day it was paid, or "" while still to pay. */
  paidOn: string;
  /**
   * When it counts against the profit: the day it was paid, else the day
   * the money it is a share of last came in.
   */
  on: string;
  /** The project or student it was given on. */
  what: string;
  line: string;
  /** The project, for a link; none for a student. */
  projectId?: string;
  /** The enrolment, for a student. */
  enrolmentId?: string;
};

/**
 * Every commission given, on projects (a share of the development
 * payments) and on students (a share of the fee), worked out from what
 * has been received now, so a changed fee changes its commission too.
 */
export async function loadCommissions(): Promise<CommissionRow[]> {
  const [projects, payments, students] = await Promise.all([
    db
      .select({
        id: clientProjects.id,
        title: clientProjects.title,
        client: clientProjects.client,
        service: clientProjects.service,
        commissions: projectDetails.commissions,
      })
      .from(projectDetails)
      .innerJoin(
        clientProjects,
        eq(projectDetails.projectId, clientProjects.id),
      )
      .catch(() => []),
    db
      .select({
        projectId: clientPayments.projectId,
        amount: clientPayments.amount,
        on: clientPayments.receivedOn,
      })
      .from(clientPayments),
    db
      .select({
        id: enrolments.id,
        commissions: enrolments.commissions,
        amount: enrolments.amountPaid,
        on: enrolments.paidOn,
        enrolled: enrolments.createdAt,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
      })
      .from(enrolments)
      .innerJoin(users, eq(enrolments.userId, users.id))
      .catch(() => []),
  ]);

  const rows: CommissionRow[] = [];
  for (const p of projects) {
    const list = realCommissions(cleanCommissions(p.commissions));
    if (!list.length) continue;
    const mine = payments.filter((x) => x.projectId === p.id);
    const base = mine.reduce((n, x) => n + num(x.amount), 0);
    const last = mine
      .map((x) => x.on)
      .sort()
      .at(-1);
    for (const c of list) {
      rows.push({
        key: `p-${p.id}-${c.id}`,
        name: c.name || "Someone",
        percent: c.percent,
        amount: commissionAmount(c, base),
        base,
        paidOn: c.paidOn,
        on: c.paidOn || last || istDay(new Date()),
        what: `${p.client} · ${p.title}`,
        line: lineOf(p.service),
        projectId: p.id,
      });
    }
  }
  for (const s of students) {
    const list = realCommissions(cleanCommissions(s.commissions));
    if (!list.length) continue;
    const base = num(s.amount);
    const name =
      [s.firstName, s.lastName].filter(Boolean).join(" ") ||
      s.email ||
      "Student";
    for (const c of list) {
      rows.push({
        key: `s-${s.id}-${c.id}`,
        name: c.name || "Someone",
        percent: c.percent,
        amount: commissionAmount(c, base),
        base,
        paidOn: c.paidOn,
        on: c.paidOn || s.on || istDay(s.enrolled),
        what: `Course fee · ${name}`,
        line: "academy",
        enrolmentId: s.id,
      });
    }
  }
  return rows
    .filter((r) => r.amount > 0)
    .sort((a, b) => b.on.localeCompare(a.on));
}

/** The date in India time, so a late-evening entry keeps its own day. */
const istDay = (d: Date) =>
  new Date(d.getTime() + 5.5 * 3_600_000).toISOString().slice(0, 10);

export async function loadMoney() {
  const [payments, fees, projects, campaigns] = await Promise.all([
    db
      .select({
        projectId: clientPayments.projectId,
        amount: clientPayments.amount,
        ref: clientPayments.ref,
        on: clientPayments.receivedOn,
        service: clientProjects.service,
        client: clientProjects.client,
        title: clientProjects.title,
      })
      .from(clientPayments)
      .innerJoin(
        clientProjects,
        eq(clientPayments.projectId, clientProjects.id),
      )
      .orderBy(desc(clientPayments.receivedOn)),
    loadFees(),
    db.select().from(clientProjects).orderBy(desc(clientProjects.createdAt)),
    db
      .select({ service: adCampaigns.service, spend: adCampaigns.spend })
      .from(adCampaigns),
  ]);

  const receipts: Receipt[] = [
    ...payments.map((p) => ({
      service: p.service,
      amount: num(p.amount),
      on: p.on,
      from: p.client,
      what: p.title,
      projectId: p.projectId,
      ref: p.ref ?? undefined,
    })),
    ...fees.map((f) => ({
      service: "academy" as const,
      amount: f.amount,
      on: f.on,
      from: f.name,
      what: "Course fee",
    })),
  ].sort((a, b) => b.on.localeCompare(a.on));

  const paidByProject = new Map<string, number>();
  for (const p of payments) {
    paidByProject.set(
      p.projectId,
      (paidByProject.get(p.projectId) ?? 0) + num(p.amount),
    );
  }

  return { receipts, projects, campaigns, paidByProject };
}

export type Money = Awaited<ReturnType<typeof loadMoney>>;

/**
 * Totals for a set of recorded services — ["software", "software_ai"] for
 * the Software tab — or for everything when `services` is null.
 */
export function totals(money: Money, services: readonly string[] | null) {
  const today = new Date().toISOString();
  const month = today.slice(0, 7);
  const year = today.slice(0, 4);
  const mine = <T extends { service: string }>(rows: T[]) =>
    services ? rows.filter((r) => services.includes(r.service)) : rows;

  const receipts = mine(money.receipts);
  const projects = mine(money.projects);
  const sum = (rows: Receipt[]) => rows.reduce((t, r) => t + r.amount, 0);

  // Owed: agreed work still running or handed over, less what has come in.
  const outstanding = projects
    .filter((p) => ["active", "on_hold", "delivered"].includes(p.status))
    .reduce(
      (t, p) =>
        t + Math.max(0, num(p.value) - (money.paidByProject.get(p.id) ?? 0)),
      0,
    );
  const pipeline = projects
    .filter((p) => ["lead", "proposal"].includes(p.status))
    .reduce((t, p) => t + num(p.value), 0);

  return {
    all: sum(receipts),
    month: sum(receipts.filter((r) => r.on.startsWith(month))),
    year: sum(receipts.filter((r) => r.on.startsWith(year))),
    outstanding,
    pipeline,
    active: projects.filter((p) => p.status === "active").length,
    adSpend: mine(money.campaigns).reduce((t, c) => t + num(c.spend), 0),
    receipts,
    projects,
  };
}

/**
 * The last `count` calendar months, oldest first, with what came in each,
 * split by revenue line.
 */
export function lastMonths(receipts: Receipt[], count = 6) {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (count - 1) + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const byService = REVENUE_LINES.map((s) => ({
      service: s.id as string,
      amount: receipts
        .filter((r) => lineOf(r.service) === s.id && r.on.startsWith(key))
        .reduce((t, r) => t + r.amount, 0),
    }));
    return {
      key,
      label: d.toLocaleDateString("en-IN", { month: "short" }),
      longLabel: d.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      }),
      byService,
      total: byService.reduce((t, s) => t + s.amount, 0),
    };
  });
}
