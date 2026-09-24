import Link from "next/link";
import {
  Empty,
  PageHead,
  Section,
  Stat,
  td,
  th,
} from "@/components/admin/Business";
import { SERVICES, rupees, serviceLabel } from "@/lib/business";
import { lastSixMonths, loadMoney, totals } from "@/lib/business-data";

/* Rendered per request: it is all live figures from the database. */
export const dynamic = "force-dynamic";

const SERVICE_HREF: Record<string, string> = {
  marketing: "/admin/services/marketing",
  software: "/admin/services/software",
  ai: "/admin/services/ai",
  academy: "/admin/students",
};

const BAR: Record<string, string> = {
  marketing: "bg-amber",
  software: "bg-brand",
  ai: "bg-leaf",
  academy: "bg-teal",
};

const day = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/**
 * Revenue from every service on one page.
 *
 * Client payments are recorded on each service's tab; academy fees on the
 * students page. This page only adds them up.
 */
export default async function AdminRevenuePage() {
  const money = await loadMoney();
  const all = totals(money, null);
  const rows = SERVICES.map((s) => ({ ...s, ...totals(money, s.id) }));
  const months = lastSixMonths(money.receipts);
  const peak = Math.max(
    1,
    ...months.map((m) => m.byService.reduce((t, s) => t + s.amount, 0)),
  );

  return (
    <>
      <PageHead
        title="Revenue"
        lede="Money received across all four services. Record client payments on each service's tab and academy fees on the Students page."
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="This month" value={rupees.format(all.month)} />
        <Stat label="This year" value={rupees.format(all.year)} />
        <Stat label="All time" value={rupees.format(all.all)} />
        <Stat
          label="Still owed"
          value={rupees.format(all.outstanding)}
          hint={`Pipeline ${rupees.format(all.pipeline)}`}
        />
      </div>

      <Section title="By service">
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left">
            <thead>
              <tr className="border-line-soft border-b">
                {[
                  "Service",
                  "This month",
                  "All time",
                  "Still owed",
                  "Pipeline",
                  "Ad spend",
                  "After ads",
                ].map((h) => (
                  <th key={h} className={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-line-soft border-b last:border-0"
                >
                  <td className={td}>
                    <Link
                      href={SERVICE_HREF[r.id]}
                      className="text-ink hover:text-brand-deep inline-flex items-center gap-2 font-semibold"
                    >
                      <span className={`size-2 rounded-full ${BAR[r.id]}`} />
                      {r.label}
                    </Link>
                  </td>
                  <td className={td}>{rupees.format(r.month)}</td>
                  <td className={`${td} text-ink font-semibold`}>
                    {rupees.format(r.all)}
                  </td>
                  <td className={td}>
                    {r.id === "academy" ? "—" : rupees.format(r.outstanding)}
                  </td>
                  <td className={td}>
                    {r.id === "academy" ? "—" : rupees.format(r.pipeline)}
                  </td>
                  <td className={td}>{rupees.format(r.adSpend)}</td>
                  <td className={td}>{rupees.format(r.all - r.adSpend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <div className="xl:grid xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:gap-6">
        <Section title="Last six months">
          <div className="card p-5">
            <div className="flex h-44 items-end gap-3 sm:gap-6">
              {months.map((m) => {
                const total = m.byService.reduce((t, s) => t + s.amount, 0);
                return (
                  <div
                    key={m.key}
                    className="flex h-full flex-1 flex-col justify-end"
                  >
                    <p className="text-ink-faint mb-1 text-center text-[0.6875rem]">
                      {total ? rupees.format(total) : ""}
                    </p>
                    <div
                      className="flex w-full flex-col-reverse overflow-hidden rounded-md"
                      style={{ height: `${(total / peak) * 100}%` }}
                      title={`${m.label}: ${rupees.format(total)}`}
                    >
                      {m.byService.map((s) =>
                        s.amount ? (
                          <div
                            key={s.service}
                            className={BAR[s.service]}
                            style={{ height: `${(s.amount / total) * 100}%` }}
                            title={`${serviceLabel(s.service)}: ${rupees.format(s.amount)}`}
                          />
                        ) : null,
                      )}
                    </div>
                    <p className="text-ink-soft mt-2 text-center text-[0.75rem] font-semibold">
                      {m.label}
                    </p>
                  </div>
                );
              })}
            </div>
            <ul className="text-ink-soft mt-4 flex flex-wrap gap-4 text-[0.75rem]">
              {SERVICES.map((s) => (
                <li key={s.id} className="inline-flex items-center gap-1.5">
                  <span className={`size-2 rounded-full ${BAR[s.id]}`} />
                  {s.label}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section title="Latest payments">
          {money.receipts.length === 0 ? (
            <Empty>No payments recorded yet.</Empty>
          ) : (
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left">
                <thead>
                  <tr className="border-line-soft border-b">
                    {["Received", "Service", "From", "For", "Amount"].map(
                      (h) => (
                        <th key={h} className={th}>
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {money.receipts.slice(0, 12).map((r, i) => (
                    <tr
                      key={i}
                      className="border-line-soft border-b last:border-0"
                    >
                      <td className={`${td} whitespace-nowrap`}>{day(r.on)}</td>
                      <td className={td}>{serviceLabel(r.service)}</td>
                      <td className={`${td} text-ink`}>{r.from}</td>
                      <td className={td}>{r.what}</td>
                      <td className={`${td} text-ink font-semibold`}>
                        {rupees.format(r.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      </div>
    </>
  );
}
