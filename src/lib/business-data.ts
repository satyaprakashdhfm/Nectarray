import "server-only";
import { desc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  adCampaigns,
  clientPayments,
  clientProjects,
  enrolments,
  users,
} from "@/lib/db/schema";
import { REVENUE_LINES, num } from "@/lib/business";

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
};

export async function loadMoney() {
  const [payments, fees, projects, campaigns] = await Promise.all([
    db
      .select({
        projectId: clientPayments.projectId,
        amount: clientPayments.amount,
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
    db
      .select({
        amount: enrolments.amountPaid,
        on: enrolments.paidOn,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
      })
      .from(enrolments)
      .innerJoin(users, eq(enrolments.userId, users.id))
      .where(isNotNull(enrolments.amountPaid)),
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
    })),
    ...fees
      .filter((f) => num(f.amount) > 0)
      .map((f) => ({
        service: "academy" as const,
        amount: num(f.amount),
        // A fee with no date still counts; it sorts as the day it was entered.
        on: f.on ?? new Date().toISOString().slice(0, 10),
        from:
          [f.firstName, f.lastName].filter(Boolean).join(" ") ||
          f.email ||
          "Student",
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
        .filter((r) => r.service === s.id && r.on.startsWith(key))
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
