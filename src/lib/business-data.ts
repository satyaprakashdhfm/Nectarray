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
import { SERVICES, num, type ServiceId } from "@/lib/business";

/**
 * Every rupee received, from every service, as one list.
 *
 * Client payments carry their project's service; academy fees come off
 * `enrolments`, where the students page records them. Nothing is copied
 * between the two, so a fee edited on the students page is the same fee here.
 */
export type Receipt = {
  service: ServiceId;
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
      service: p.service as ServiceId,
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

/** Totals for one service, or for everything when `service` is null. */
export function totals(money: Money, service: ServiceId | null) {
  const today = new Date().toISOString();
  const month = today.slice(0, 7);
  const year = today.slice(0, 4);
  const mine = <T extends { service: string }>(rows: T[]) =>
    service ? rows.filter((r) => r.service === service) : rows;

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

/** The last six calendar months, oldest first, with what came in each. */
export function lastSixMonths(receipts: Receipt[]) {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return {
      key,
      label: d.toLocaleDateString("en-IN", { month: "short" }),
      byService: SERVICES.map((s) => ({
        service: s.id,
        amount: receipts
          .filter((r) => r.service === s.id && r.on.startsWith(key))
          .reduce((t, r) => t + r.amount, 0),
      })),
    };
  });
}
