import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { assetEntries, clientProjects, projectDetails } from "@/lib/db/schema";
import { num } from "@/lib/business";
import { cleanSheets, isCompany } from "@/lib/project-details";

/**
 * The company's money on the Assets page: what was put in, less what went
 * out.
 *
 * Two kinds of going out. Bills come straight off each project's Amounts
 * paid: a payment the company made counts at once, and one a person made out
 * of pocket counts once it is marked "Paid back", because that is when the
 * company's money moves. Until then it is listed as still owed. Everything
 * else (rent, a laptop, a salary) is typed in on the page with its reason.
 */

export type Movement = {
  key: string;
  /** "2026-10-05" for an entry typed in; "2026-10" for a bill's month. */
  on: string;
  kind: "in" | "out";
  amount: number;
  reason: string;
  /** Typed in on the Assets page (can be removed there), or off a bill. */
  source: "entry" | "bill";
  /** The entry's id, or the bill's project. */
  id: string;
  /** For a bill: the project, and who was paid back. */
  project?: string;
  repaidTo?: string;
};

export type Owed = {
  name: string;
  total: number;
  bills: { project: string; projectId: string; item: string; amount: number }[];
};

export async function loadAssets() {
  const [entries, sheets] = await Promise.all([
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

  const owed = new Map<string, Owed>();
  // Costs the clients have not paid us back for yet.
  let clientsOwe = 0;
  for (const s of sheets) {
    const project = `${s.client} · ${s.title}`;
    for (const row of cleanSheets({ paid: s.paid }).paid) {
      if (row.amount <= 0) continue;
      if (!row.clientPaid) clientsOwe += row.amount;
      const reason =
        [row.item, row.vendor].filter(Boolean).join(" · ") || "Bill";
      const company = isCompany(row.paidBy);
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
      });
      owed.set(key, person);
    }
  }

  // Newest first. A bill with only its month sits under that month's
  // dated entries.
  movements.sort((a, b) => b.on.localeCompare(a.on));

  const sum = (pick: (m: Movement) => boolean) =>
    movements.filter(pick).reduce((n, m) => n + m.amount, 0);
  const added = sum((m) => m.kind === "in");
  const bills = sum((m) => m.kind === "out" && m.source === "bill");
  const spent = sum((m) => m.kind === "out" && m.source === "entry");
  const people = [...owed.values()].sort((a, b) => b.total - a.total);
  const stillOwed = people.reduce((n, p) => n + p.total, 0);
  const balance = added - bills - spent;

  return {
    movements,
    owed: people,
    totals: {
      added,
      bills,
      spent,
      balance,
      stillOwed,
      clientsOwe,
      afterOwed: balance - stillOwed,
    },
  };
}
