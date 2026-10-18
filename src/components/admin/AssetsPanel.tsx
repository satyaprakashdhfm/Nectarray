import { ADMIN } from "@/lib/admin-path";
import Link from "next/link";
import { field } from "@/components/admin/Business";
import { rupees } from "@/lib/business";
import type { loadAssets } from "@/lib/assets";
import { todayIST } from "@/lib/work";
import { addAssetEntry } from "@/app/admin/(panel)/assets/actions";

/**
 * The company's money: the balance, the form for money in and spends, who
 * is still to be paid back, and every movement (folded up). Bills come off
 * each project's Amounts paid by themselves; see lib/assets.ts.
 */
export function AssetsPanel({
  assets,
}: {
  assets: Awaited<ReturnType<typeof loadAssets>>;
}) {
  const { movements, owed, totals } = assets;
  return (
    <section id="assets" className="mt-10 scroll-mt-24">
      <h2 className="text-ink text-[1.25rem] font-semibold">Company assets</h2>
      <p className="text-ink-faint mt-0.5 text-[0.8125rem]">
        Client payments, and costs a client pays back, come in by themselves;
        bills on each project&apos;s Amounts paid come off by themselves (the
        company&apos;s own at once, a person&apos;s once paid back). Nectarray
        and Verona Ads are ours, so their costs only come off. Add anything else
        here with its reason.
      </p>

      <div className="card mt-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
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
          </div>
          <dl className="text-ink-soft grid grid-cols-2 gap-x-6 gap-y-1 text-[0.8125rem] tabular-nums sm:grid-flow-col sm:grid-cols-none sm:grid-rows-2">
            <dt>From clients &amp; students</dt>
            <dd className="text-ink font-semibold">
              {rupees.format(totals.fromClients)}
            </dd>
            <dt>Money added</dt>
            <dd className="text-ink font-semibold">
              {rupees.format(totals.added)}
            </dd>
            <dt>Bills paid</dt>
            <dd className="text-ink font-semibold">
              {rupees.format(totals.bills)}
            </dd>
            <dt>Other spends</dt>
            <dd className="text-ink font-semibold">
              {rupees.format(totals.spent)}
            </dd>
            <dt>Commission paid</dt>
            <dd className="text-ink font-semibold">
              {rupees.format(totals.commissionPaid)}
            </dd>
          </dl>
        </div>

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

      {owed.length > 0 && (
        <div className="mt-4">
          <h3 className="text-ink mb-2 text-[1rem] font-semibold">
            Still to pay back to people
          </h3>
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
                        href={
                          b.projectId
                            ? `${ADMIN}/projects/${b.projectId}`
                            : `${ADMIN}/students`
                        }
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
        </div>
      )}
    </section>
  );
}
