import { ADMIN } from "@/lib/admin-path";
import Link from "next/link";
import {
  Empty,
  PageHead,
  Section,
  Stat,
  deleteButton,
  field,
} from "@/components/admin/Business";
import { rupees } from "@/lib/business";
import { loadAssets } from "@/lib/assets";
import { isMonth, monthLabel } from "@/lib/project-details";
import { todayIST } from "@/lib/work";
import { addAssetEntry, deleteAssetEntry } from "./actions";

/* Rendered per request: live figures from the database. */
export const dynamic = "force-dynamic";

const day = (value: string) =>
  isMonth(value)
    ? monthLabel(value)
    : new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

/**
 * The company's money: what was put in, less the bills paid from it and
 * anything else spent. Bills are read off each project's Amounts paid (see
 * lib/assets.ts); the rest is typed in here with a reason.
 */
export default async function AdminAssetsPage() {
  const { movements, owed, totals } = await loadAssets();

  return (
    <>
      <PageHead
        title="Assets"
        lede="The company's money. Add what comes in, and what is spent with a reason. Bills on each project's Amounts paid come off by themselves: the company's own at once, a person's once they are marked paid back."
      />

      <div className="card mt-6 p-5 sm:p-6">
        <p className="eyebrow">Balance now</p>
        <p
          className={`display mt-1.5 text-[2.25rem] leading-none sm:text-[2.75rem] ${
            totals.balance < 0 ? "text-danger" : "text-ink"
          }`}
        >
          {rupees.format(totals.balance)}
        </p>
        {totals.stillOwed > 0 && (
          <p className="text-ink-soft mt-2 text-[0.8125rem]">
            {rupees.format(totals.afterOwed)} once everyone is paid back
          </p>
        )}

        <form
          action={addAssetEntry}
          className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-[8rem_10rem_1fr_auto_auto]"
        >
          <input
            name="amount"
            inputMode="decimal"
            placeholder="₹ amount"
            aria-label="Amount"
            required
            className={`${field} py-2.5 text-[0.9375rem]`}
          />
          <input
            name="on"
            type="date"
            defaultValue={todayIST()}
            aria-label="Date"
            required
            className={`${field} py-2.5 text-[0.9375rem]`}
          />
          <input
            name="reason"
            placeholder="Reason: client advance, office rent, laptop…"
            aria-label="Reason"
            required
            maxLength={300}
            className={`${field} col-span-2 py-2.5 text-[0.9375rem] sm:col-span-1`}
          />
          <button
            name="kind"
            value="out"
            className="bg-danger/10 text-danger hover:bg-danger/15 rounded-lg px-4 py-2.5 text-[0.875rem] font-semibold transition-colors"
          >
            − Spent
          </button>
          <button
            name="kind"
            value="in"
            className="bg-leaf-wash text-leaf-deep hover:bg-leaf/20 rounded-lg px-4 py-2.5 text-[0.875rem] font-semibold transition-colors"
          >
            + Money in
          </button>
        </form>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat label="Money in" value={rupees.format(totals.added)} />
        <Stat label="Bills paid" value={rupees.format(totals.bills)} />
        <Stat label="Other spends" value={rupees.format(totals.spent)} />
        <Stat
          label="To pay back"
          value={rupees.format(totals.stillOwed)}
          hint={owed.length ? `${owed.length} people` : "Nobody waiting"}
        />
      </div>

      {owed.length > 0 && (
        <Section title="Still to pay back">
          <ul className="grid gap-3 sm:grid-cols-2">
            {owed.map((p) => (
              <li key={p.name} className="card p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-ink font-semibold">{p.name}</p>
                  <p className="text-amber-deep font-semibold">
                    {rupees.format(p.total)}
                  </p>
                </div>
                <ul className="mt-2 space-y-1">
                  {p.bills.map((b, i) => (
                    <li
                      key={i}
                      className="text-ink-soft flex justify-between gap-3 text-[0.8125rem]"
                    >
                      <Link
                        href={`${ADMIN}/projects/${b.projectId}`}
                        className="hover:text-brand-deep min-w-0 truncate"
                      >
                        {b.item}
                        <span className="text-ink-faint"> · {b.project}</span>
                      </Link>
                      <span className="shrink-0">
                        {rupees.format(b.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="text-ink-faint mt-2 text-[0.75rem]">
            Mark a bill &quot;Paid back&quot; on its project and it comes off
            the balance.
          </p>
        </Section>
      )}

      <Section title="Every movement">
        {movements.length === 0 ? (
          <Empty>
            Nothing yet. Add the money the company has with + Money in.
          </Empty>
        ) : (
          <ul className="card divide-line-soft divide-y">
            {movements.map((m) => (
              <li key={m.key} className="flex items-start gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-ink text-[0.875rem] break-words">
                    {m.reason}
                  </p>
                  <p className="text-ink-faint mt-0.5 text-[0.75rem]">
                    {day(m.on)}
                    {m.source === "bill" && (
                      <>
                        {" · "}
                        <Link
                          href={`${ADMIN}/projects/${m.id}`}
                          className="hover:text-brand-deep underline-offset-2 hover:underline"
                        >
                          Bill: {m.project}
                        </Link>
                        {m.repaidTo && ` · paid back to ${m.repaidTo}`}
                      </>
                    )}
                  </p>
                </div>
                <p
                  className={`shrink-0 text-[0.9375rem] font-semibold ${
                    m.kind === "in" ? "text-leaf-deep" : "text-ink"
                  }`}
                >
                  {m.kind === "in" ? "+" : "−"}
                  {rupees.format(m.amount)}
                </p>
                {m.source === "entry" && (
                  <form action={deleteAssetEntry} className="shrink-0">
                    <input type="hidden" name="id" value={m.id} />
                    <button
                      className={`${deleteButton} px-1 text-[1rem]`}
                      aria-label={`Remove ${m.reason}`}
                    >
                      ×
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
