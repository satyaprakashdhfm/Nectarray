import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  assetEntries,
  clientPayments,
  clientProjects,
  projectDetails,
} from "@/lib/db/schema";
import { isOwnCompany, num } from "@/lib/business";
import { loadCommissions, loadFees } from "@/lib/business-data";
import { cleanSheets, isCompany } from "@/lib/project-details";

/**
 * The company's money on the Assets page: what came in, less what went
 * out.
 *
 * In: every payment a client makes, every course fee a student pays,
 * and every cost a client pays us back
 * for (marked "Client paid" on the project's Amounts paid), plus money
 * typed in on the page.
 *
 * Out: bills off each project's Amounts paid. One the company paid counts
 * at once; one a person paid out of pocket counts once it is marked "Paid
 * back", because that is when the company's money moves (until then it is
 * listed as still owed). Commission given to people, as soon as it is
 * given, paid yet or not. Plus spends typed in with their reason.
 *
 * Our own products (Nectarray, Verona Ads) have no client: their costs
 * come out like any other, and nothing comes back in.
 */

export type Movement = {
  key: string;
  /** "2026-10-05" for an entry typed in; "2026-10" for a bill's month. */
  on: string;
  kind: "in" | "out";
  amount: number;
  reason: string;
  /**
   * Typed in on the Assets page (can be removed there), off a bill, a cost
   * a client paid back, a client's payment, a student's course fee, or a
   * commission given to someone.
   */
  source: "entry" | "bill" | "repaid" | "payment" | "fee" | "commission";
  /** A course fee, or commission on one: it links to the students page. */
  academy?: boolean;
  /** The entry's id, or the project. */
  id: string;
  /** For anything off a project: the project; for a bill, who was paid back. */
  project?: string;
  repaidTo?: string;
};

export type Owed = {
  name: string;
  total: number;
  bills: {
    project: string;
    /** The project; none for commission on a student's fee. */
    projectId?: string;
    item: string;
    amount: number;
    /** When the person paid it, or the month it was billed in. */
    on: string;
  }[];
};

/** A cost on a client's project that the client has not paid us back. */
export type ClientDue = {
  projectId: string;
  project: string;
  item: string;
  amount: number;
  /** The day it was paid, or the month it was billed in. */
  on: string;
};

export async function loadAssets() {
  const [entries, sheets, payments, fees, commissions] = await Promise.all([
    db.select().from(assetEntries).orderBy(desc(assetEntries.on)),
    db
      .select({
        projectId: projectDetails.projectId,
        paid: projectDetails.paid,
        client: clientProjects.client,
        title: clientProjects.title,
      })
      .from(projectDetails)
      .innerJoin(
        clientProjects,
        eq(projectDetails.projectId, clientProjects.id),
      ),
    db
      .select({
        id: clientPayments.id,
        projectId: clientPayments.projectId,
        amount: clientPayments.amount,
        on: clientPayments.receivedOn,
        client: clientProjects.client,
        title: clientProjects.title,
      })
      .from(clientPayments)
      .innerJoin(
        clientProjects,
        eq(clientPayments.projectId, clientProjects.id),
      ),
    loadFees(),
    loadCommissions(),
  ]);

  const movements: Movement[] = entries.map((e) => ({
    key: `e-${e.id}`,
    on: e.on,
    kind: e.kind === "in" ? "in" : "out",
    amount: num(e.amount),
    reason: e.reason,
    source: "entry",
    id: e.id,
  }));

  // Every course fee comes into the company's money too.
  for (const f of fees) {
    movements.push({
      key: `f-${f.id}`,
      on: f.on,
      kind: "in",
      amount: f.amount,
      reason: `Course fee · ${f.name}`,
      source: "fee",
      id: f.id,
      project: "Academy",
      academy: true,
    });
  }

  // Every client payment comes into the company's money.
  for (const p of payments) {
    if (isOwnCompany(p.client, p.title) || num(p.amount) <= 0) continue;
    movements.push({
      key: `p-${p.id}`,
      on: p.on,
      kind: "in",
      amount: num(p.amount),
      reason: "Client payment",
      source: "payment",
      id: p.projectId,
      project: `${p.client} · ${p.title}`,
    });
  }

  const owed = new Map<string, Owed>();
  // Costs the clients have not paid us back for yet.
  let clientsOwe = 0;
  const dues: ClientDue[] = [];
  for (const s of sheets) {
    const project = `${s.client} · ${s.title}`;
    const own = isOwnCompany(s.client, s.title);
    for (const row of cleanSheets({ paid: s.paid }).paid) {
      if (row.amount <= 0) continue;
      const reason =
        [row.item, row.vendor].filter(Boolean).join(" · ") || "Bill";
      if (!own) {
        if (!row.clientPaid) {
          clientsOwe += row.amount;
          dues.push({
            projectId: s.projectId,
            project,
            item: reason,
            amount: row.amount,
            on: row.paidOn || row.month,
          });
        }
        // The client paid this cost back: it comes into the company.
        else
          movements.push({
            key: `r-${s.projectId}-${row.id}`,
            on: row.clientPaidOn || row.paidOn || row.month,
            kind: "in",
            amount: row.amount,
            reason: `Paid back by the client: ${reason}`,
            source: "repaid",
            id: s.projectId,
            project,
          });
      }
      const company = isCompany(row.paidBy);
      // Paid by the company, or by a person the company has paid back.
      if (company || row.repaid) {
        movements.push({
          key: `b-${s.projectId}-${row.id}`,
          // The day the money left: paid back, or paid; else the bill's month.
          on: (company ? "" : row.repaidOn) || row.paidOn || row.month,
          kind: "out",
          amount: row.amount,
          reason,
          source: "bill",
          id: s.projectId,
          project,
          repaidTo: company ? undefined : row.paidBy,
        });
        continue;
      }
      // Paid by a person, not yet paid back: no company money has moved.
      const key = row.paidBy.toLowerCase();
      const person = owed.get(key) ?? { name: row.paidBy, total: 0, bills: [] };
      person.total += row.amount;
      person.bills.push({
        project,
        projectId: s.projectId,
        item: reason,
        amount: row.amount,
        on: row.paidOn || row.month,
      });
      owed.set(key, person);
    }
  }

  // Commission comes off the company's money as soon as it is given: what
  // came in was never all ours. Its paid date only says when it left.
  for (const c of commissions) {
    movements.push({
      key: `c-${c.key}`,
      on: c.on,
      kind: "out",
      amount: c.amount,
      reason: `Commission ${c.percent ? `${c.percent}% ` : ""}to ${c.name}${
        c.paidOn ? "" : " (still to pay)"
      }`,
      source: "commission",
      id: c.projectId ?? c.enrolmentId ?? "",
      project: c.projectId ? c.what : "Academy",
      academy: !c.projectId,
    });
  }

  // Newest first. A bill with only its month sits under that month's
  // dated entries.
  movements.sort((a, b) => b.on.localeCompare(a.on));

  const sum = (pick: (m: Movement) => boolean) =>
    movements.filter(pick).reduce((n, m) => n + m.amount, 0);
  const added = sum((m) => m.kind === "in" && m.source === "entry");
  const fromClients = sum((m) => m.kind === "in" && m.source !== "entry");
  const bills = sum((m) => m.kind === "out" && m.source === "bill");
  const spent = sum((m) => m.kind === "out" && m.source === "entry");
  const commission = sum((m) => m.source === "commission");
  const people = [...owed.values()].sort((a, b) => b.total - a.total);
  const stillOwed = people.reduce((n, p) => n + p.total, 0);
  const balance = added + fromClients - bills - spent - commission;

  dues.sort((a, b) => b.on.localeCompare(a.on));

  return {
    movements,
    commissions,
    owed: people,
    dues,
    totals: {
      added,
      fromClients,
      bills,
      spent,
      commission,
      balance,
      stillOwed,
      clientsOwe,
      afterOwed: balance - stillOwed,
    },
  };
}
