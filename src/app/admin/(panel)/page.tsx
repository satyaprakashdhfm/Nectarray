import { ADMIN } from "@/lib/admin-path";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, ChevronRight } from "lucide-react";
import {
  Empty,
  PageHead,
  Section,
  ServiceFilter,
  Stat,
  StatusPill,
  td,
  th,
} from "@/components/admin/Business";
import { AssetsPanel } from "@/components/admin/AssetsPanel";
import { BalanceLog } from "@/components/admin/BalanceLog";
import { REVENUE_LINES, rupees, serviceLabel } from "@/lib/business";
import { lastMonths, loadMoney, totals } from "@/lib/business-data";
import { loadAssets } from "@/lib/assets";
import { loadDashboard, type Batch, type ProjectCard } from "@/lib/dashboard";
import { isMonth, monthLabel } from "@/lib/project-details";
import { cn } from "@/lib/utils";

/* Rendered per request: it is all live figures from the database. */
export const dynamic = "force-dynamic";

const BAR: Record<string, string> = {
  marketing: "bg-amber",
  software: "bg-brand",
  ai: "bg-leaf",
  academy: "bg-teal",
};

const day = (value: string | null) =>
  !value
    ? "—"
    : isMonth(value)
      ? monthLabel(value)
      : new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

/**
 * Revenue and assets as one dashboard: the summary and its graph first,
 * then every project as a card, most recently changed first, filtered by
 * service; the academy's batches; and the company's money at the bottom.
 * Everything on a card opens its project.
 */
export default async function AdminRevenuePage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const line = REVENUE_LINES.some((l) => l.id === service)
    ? (service as string)
    : null;

  const [money, assets, board] = await Promise.all([
    loadMoney(),
    loadAssets(),
    loadDashboard(),
  ]);
  const all = totals(money, null);
  const rows = REVENUE_LINES.map((s) => ({
    ...s,
    ...totals(money, s.takes),
  }));
  const months = lastMonths(money.receipts);
  const peak = Math.max(1, ...months.map((m) => m.total));
  const cards = line ? board.cards.filter((c) => c.line === line) : board.cards;
  const showAcademy = !line || line === "academy";

  return (
    <>
      <PageHead
        title="Revenue & assets"
        lede="Everything the company has earned, spent and holds, then each project with its latest payments. Click any project to open it."
      />

      {/* Summary ------------------------------------------------------- */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat label="This month" value={rupees.format(all.month)} />
        <Stat label="This year" value={rupees.format(all.year)} />
        <Stat label="All time" value={rupees.format(all.all)} />
        <Stat
          label="Clients still owe"
          value={rupees.format(all.outstanding)}
          hint={`Pipeline ${rupees.format(all.pipeline)}`}
        />
        <BalanceLog
          balance={assets.totals.balance}
          movements={assets.movements}
          className="card hover:border-brand group min-w-0 p-4 transition-colors sm:p-5"
        >
          <p className="eyebrow">Company balance</p>
          <p
            className={`display mt-1.5 text-[1.25rem] break-words sm:text-[1.5rem] ${
              assets.totals.balance < 0 ? "text-danger" : "text-ink"
            }`}
          >
            {rupees.format(assets.totals.balance)}
          </p>
          <p className="text-brand-deep mt-1 text-[0.75rem] font-semibold group-hover:underline">
            See the full history
          </p>
        </BalanceLog>
        <Stat
          label="To pay back to people"
          value={rupees.format(assets.totals.stillOwed)}
          hint={
            assets.owed.length
              ? assets.owed.map((p) => p.name).join(", ")
              : "Nobody waiting"
          }
        />
        <Stat
          label="Costs clients owe us"
          value={rupees.format(assets.totals.clientsOwe)}
          hint="Not yet paid back by the client"
        />
        <Stat
          label="Bills paid"
          value={rupees.format(assets.totals.bills)}
          hint="Off every project's Amounts paid"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left">
            <thead>
              <tr className="border-line-soft border-b">
                {["Service", "This month", "All time", "Still owed"].map(
                  (h) => (
                    <th key={h} className={th}>
                      {h}
                    </th>
                  ),
                )}
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
                      href={`${ADMIN}?service=${r.id}#projects`}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card p-5">
          <p className="eyebrow">Last six months</p>
          <div className="mt-3 flex h-40 items-end gap-3 sm:gap-5">
            {months.map((m) => (
              <div
                key={m.key}
                className="flex h-full flex-1 flex-col justify-end"
              >
                <p className="text-ink-faint mb-1 hidden text-center text-[0.6875rem] sm:block">
                  {m.total ? rupees.format(m.total) : ""}
                </p>
                <div
                  className="flex w-full flex-col-reverse overflow-hidden rounded-md"
                  style={{ height: `${(m.total / peak) * 100}%` }}
                  title={`${m.label}: ${rupees.format(m.total)}`}
                >
                  {m.byService.map((s) =>
                    s.amount ? (
                      <div
                        key={s.service}
                        className={BAR[s.service]}
                        style={{ height: `${(s.amount / m.total) * 100}%` }}
                        title={`${serviceLabel(s.service)}: ${rupees.format(s.amount)}`}
                      />
                    ) : null,
                  )}
                </div>
                <p className="text-ink-soft mt-2 text-center text-[0.75rem] font-semibold">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
          <ul className="text-ink-soft mt-4 flex flex-wrap gap-4 text-[0.75rem]">
            {REVENUE_LINES.map((s) => (
              <li key={s.id} className="inline-flex items-center gap-1.5">
                <span className={`size-2 rounded-full ${BAR[s.id]}`} />
                {s.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* By service ---------------------------------------------------- */}
      <section id="projects" className="mt-10 scroll-mt-24">
        <h2 className="text-ink text-[1.25rem] font-semibold">By service</h2>
        <ServiceFilter basePath={ADMIN} current={line} />

        {cards.length > 0 ? (
          <ul className="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {cards.map((c) => (
              <ProjectCardView key={c.id} card={c} />
            ))}
          </ul>
        ) : (
          line !== "academy" && (
            <div className="mt-5">
              <Empty>No projects under this service yet.</Empty>
            </div>
          )
        )}
      </section>

      {showAcademy && (
        <Section title="Academy batches">
          {board.batches.length === 0 ? (
            <Empty>No batches yet.</Empty>
          ) : (
            <div className="space-y-2">
              {board.batches.map((b) => (
                <BatchView key={b.id} batch={b} />
              ))}
            </div>
          )}
        </Section>
      )}

      {!line && <AssetsPanel assets={assets} />}
    </>
  );
}

/** One project: its figures and its last six payments, all opening it. */
function ProjectCardView({ card: c }: { card: ProjectCard }) {
  const href = `${ADMIN}/projects/${c.id}`;
  const owed = c.value == null ? null : Math.max(0, c.value - c.received);
  return (
    <li className="card flex min-w-0 flex-col p-0">
      <Link
        href={href}
        className="group border-line-soft block border-b px-4 pt-4 pb-3"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-ink group-hover:text-brand-deep truncate text-[1rem] font-semibold">
              {c.title}
            </p>
            <p className="text-ink-faint mt-0.5 flex items-center gap-1.5 truncate text-[0.75rem]">
              <span className={`size-2 shrink-0 rounded-full ${BAR[c.line]}`} />
              {c.client} · {serviceLabel(c.line)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <StatusPill status={c.status} />
            <ArrowUpRight
              className="text-ink-faint group-hover:text-brand-deep size-4"
              aria-hidden
            />
          </div>
        </div>
        <dl className="mt-3 grid grid-cols-3 gap-2 text-[0.75rem]">
          <Figure
            label="Expected"
            value={c.value == null ? "—" : rupees.format(c.value)}
          />
          <Figure label="Received" value={rupees.format(c.received)} />
          <Figure
            label="Still owed"
            value={owed == null ? "—" : rupees.format(owed)}
            tone={owed ? "text-amber-deep" : undefined}
          />
        </dl>
        {(c.costs > 0 || c.clientOwes > 0 || c.toPayBack > 0) && (
          <p className="text-ink-soft mt-2 text-[0.75rem]">
            Costs {rupees.format(c.costs)}
            {c.clientOwes > 0 && (
              <span className="text-amber-deep">
                {" "}
                · client to pay back {rupees.format(c.clientOwes)}
              </span>
            )}
            {c.toPayBack > 0 && (
              <span className="text-amber-deep">
                {" "}
                · to pay back to people {rupees.format(c.toPayBack)}
              </span>
            )}
          </p>
        )}
      </Link>

      {c.recent.length === 0 ? (
        <p className="text-ink-faint px-4 py-3 text-[0.75rem]">
          No payments yet.
        </p>
      ) : (
        <ul className="divide-line-soft flex-1 divide-y">
          {c.recent.map((m) => (
            <li key={m.key}>
              <Link
                href={href}
                className="hover:bg-mist/60 flex items-start gap-3 px-4 py-2 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-ink truncate text-[0.8125rem]">{m.what}</p>
                  <p className="text-ink-faint text-[0.6875rem]">
                    {day(m.on)}
                    {m.kind === "out" && (
                      <>
                        {" · "}
                        {m.paidBy}
                        {m.paidBy !== "Company" && (
                          <span
                            className={
                              m.repaid ? "text-leaf-deep" : "text-amber-deep"
                            }
                          >
                            {m.repaid ? " · paid back" : " · to pay back"}
                          </span>
                        )}
                        <span
                          className={
                            m.clientPaid ? "text-leaf-deep" : "text-amber-deep"
                          }
                        >
                          {m.clientPaid ? " · client paid" : " · client to pay"}
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <p
                  className={cn(
                    "shrink-0 text-[0.8125rem] font-semibold tabular-nums",
                    m.kind === "in" ? "text-leaf-deep" : "text-ink",
                  )}
                >
                  {m.kind === "in" ? (
                    <ArrowDownLeft
                      className="mr-0.5 inline size-3.5 align-[-0.2em]"
                      aria-label="In"
                    />
                  ) : (
                    <ArrowUpRight
                      className="text-ink-faint mr-0.5 inline size-3.5 align-[-0.2em]"
                      aria-label="Out"
                    />
                  )}
                  {rupees.format(m.amount)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function Figure({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="bg-mist/70 min-w-0 rounded-lg px-2.5 py-1.5">
      <dt className="text-ink-faint text-[0.6875rem]">{label}</dt>
      <dd
        className={cn(
          "text-ink truncate font-semibold tabular-nums",
          tone ?? "",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

/** A batch, closed until opened: each student and what they paid. */
function BatchView({ batch: b }: { batch: Batch }) {
  return (
    <details className="card group p-0">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
        <ChevronRight
          className="text-ink-faint size-4 transition-transform group-open:rotate-90"
          aria-hidden
        />
        <span className="text-ink font-semibold">{b.name}</span>
        <span className="text-ink-faint text-[0.8125rem]">
          {b.students.length} {b.students.length === 1 ? "student" : "students"}
        </span>
        <span className="text-ink ml-auto text-[0.9375rem] font-semibold tabular-nums">
          {rupees.format(b.total)}
        </span>
      </summary>
      <ul className="divide-line-soft border-line-soft divide-y border-t">
        {b.students.map((s) => (
          <li key={s.id}>
            <Link
              href={`${ADMIN}/students`}
              className="hover:bg-mist/60 flex items-center gap-3 px-4 py-2 text-[0.8125rem] transition-colors"
            >
              <span className="text-ink min-w-0 flex-1 truncate">{s.name}</span>
              <span className="text-ink-faint">{day(s.on)}</span>
              <span className="text-ink w-24 text-right font-semibold tabular-nums">
                {s.paid ? rupees.format(s.paid) : "—"}
              </span>
            </Link>
          </li>
        ))}
        {b.students.length === 0 && (
          <li className="text-ink-faint px-4 py-2 text-[0.8125rem]">
            Nobody in this batch yet.
          </li>
        )}
      </ul>
    </details>
  );
}
