import { ADMIN } from "@/lib/admin-path";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowDownLeft, ArrowUpRight, ChevronRight } from "lucide-react";
import {
  Empty,
  PageHead,
  Section,
  ServiceFilter,
  StatusPill,
} from "@/components/admin/Business";
import { AssetsPanel } from "@/components/admin/AssetsPanel";
import { FreshOnVisit } from "@/components/admin/FreshOnVisit";
import { BalanceLog } from "@/components/admin/BalanceLog";
import { MoneyChart, type ChartEvent } from "@/components/admin/MoneyChart";
import { StatCard, StatFace, cardButton } from "@/components/admin/StatCard";
import {
  REVENUE_LINES,
  isOwnCompany,
  lineOf,
  num,
  rupees,
  serviceLabel,
} from "@/lib/business";
import { loadMoney, type Receipt } from "@/lib/business-data";
import { loadAssets } from "@/lib/assets";
import { loadDashboard, type Batch, type ProjectCard } from "@/lib/dashboard";
import {
  addMonths,
  currentMonth,
  isMonth,
  monthLabel,
} from "@/lib/project-details";
import { cn } from "@/lib/utils";
import { adminPage } from "@/lib/auth/access";

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

const sum = <T,>(rows: T[], pick: (r: T) => number) =>
  rows.reduce((n, r) => n + pick(r), 0);

/**
 * Revenue and assets as one dashboard: nine cards, each opening what makes
 * up its figure; the graph, by month or year; then every project as a
 * card, most recently changed first, filtered by service; the academy's
 * batches; and the company's money at the bottom.
 */
export default async function AdminRevenuePage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  await adminPage();
  const { service } = await searchParams;
  const line = REVENUE_LINES.some((l) => l.id === service)
    ? (service as string)
    : null;

  const [money, assets, board] = await Promise.all([
    loadMoney(),
    loadAssets(),
    loadDashboard(),
  ]);

  const renderedAt = new Date().getTime();
  const thisMonth = currentMonth();
  const lastMonth = addMonths(thisMonth, -1);
  const thisYear = thisMonth.slice(0, 4);
  const lastYear = String(Number(thisYear) - 1);
  const receipts = money.receipts;
  const inPeriod = (key: string) =>
    receipts.filter((r) => r.on.startsWith(key));
  const monthRev = inPeriod(thisMonth);
  const yearRev = inPeriod(thisYear);
  const total = (rows: Receipt[]) => sum(rows, (r) => r.amount);

  // Development: the agreed one-time price, less what the client has paid.
  const dev = money.projects
    .filter(
      (p) =>
        ["active", "on_hold", "delivered"].includes(p.status) &&
        !isOwnCompany(p.client, p.title) &&
        p.value != null,
    )
    .map((p) => {
      const received = money.paidByProject.get(p.id) ?? 0;
      return {
        id: p.id,
        project: p.title,
        client: p.client,
        expected: num(p.value),
        received,
        owed: Math.max(0, num(p.value) - received),
        last: receipts.find((r) => r.projectId === p.id)?.on ?? null,
      };
    })
    .filter((d) => d.owed > 0)
    .sort((a, b) => b.owed - a.owed);
  const devOwed = sum(dev, (d) => d.owed);

  // Expected: every project not lost, lead to delivered, at its agreed
  // price less what its client has already paid. Our own companies aside.
  const expected = money.projects
    .filter(
      (p) =>
        p.status !== "lost" &&
        !isOwnCompany(p.client, p.title) &&
        num(p.value) > 0,
    )
    .map((p) => {
      const received = money.paidByProject.get(p.id) ?? 0;
      return {
        id: p.id,
        project: p.title,
        client: p.client,
        status: p.status,
        value: num(p.value),
        received,
        toCome: Math.max(0, num(p.value) - received),
      };
    })
    .filter((e) => e.toCome > 0)
    .sort((a, b) => b.toCome - a.toCome);
  const expectedTotal = sum(expected, (e) => e.toCome);

  // Clients: everyone we have agreed work with, our own companies aside.
  const clientMap = new Map<
    string,
    { name: string; projects: number; expected: number; received: number }
  >();
  for (const p of money.projects) {
    if (isOwnCompany(p.client, p.title)) continue;
    if (!["active", "on_hold", "delivered"].includes(p.status)) continue;
    const key = p.client.trim().toLowerCase();
    const c = clientMap.get(key) ?? {
      name: p.client.trim(),
      projects: 0,
      expected: 0,
      received: 0,
    };
    c.projects += 1;
    c.expected += num(p.value);
    c.received += money.paidByProject.get(p.id) ?? 0;
    clientMap.set(key, c);
  }
  const clients = [...clientMap.values()].sort(
    (a, b) => b.received - a.received,
  );

  // Profit: what came in, and costs paid back, less what went out.
  // Only company expenses count: personal use is profit taken out, and a
  // temporary cost comes back, so neither is a profit or a loss.
  const counted = (m: (typeof assets.movements)[number]) =>
    !m.use || m.use === "company";
  const back = sum(
    assets.movements.filter((m) => m.source === "repaid" && counted(m)),
    (m) => m.amount,
  );
  const billsCounted = sum(
    assets.movements.filter((m) => m.source === "bill" && counted(m)),
    (m) => m.amount,
  );
  // Commission stays in the revenue and comes off the profit, paid or not.
  const commissions = assets.commissions;
  const commissionTotal = assets.totals.commission;
  const commissionDue = sum(
    commissions.filter((c) => !c.paidOn),
    (c) => c.amount,
  );
  const profit =
    total(receipts) +
    back -
    billsCounted -
    assets.totals.spent -
    commissionTotal;

  const events: ChartEvent[] = [
    ...receipts.map((r) => ({
      on: r.on,
      type: "revenue" as const,
      amount: r.amount,
      line: lineOf(r.service),
      // Counted as a client: a client's payment, our own companies aside.
      who:
        r.projectId && !isOwnCompany(r.from, r.what)
          ? r.from.trim().toLowerCase()
          : undefined,
    })),
    ...assets.movements.flatMap((m): ChartEvent[] =>
      !counted(m)
        ? []
        : m.source === "bill"
          ? [{ on: m.on, type: "cost", amount: m.amount }]
          : m.source === "repaid"
            ? [{ on: m.on, type: "back", amount: m.amount }]
            : m.source === "entry" && m.kind === "out"
              ? [{ on: m.on, type: "spend", amount: m.amount }]
              : [],
    ),
    ...commissions.map((c) => ({
      on: c.on,
      type: "commission" as const,
      amount: c.amount,
    })),
  ];
  const profitIn = (key: string) =>
    sum(
      events.filter((e) => e.on.startsWith(key)),
      (e) => (e.type === "revenue" || e.type === "back" ? e.amount : -e.amount),
    );
  const monthName = (key: string) => monthLabel(key).split(" ")[0];

  const cards = line ? board.cards.filter((c) => c.line === line) : board.cards;
  const showAcademy = !line || line === "academy";

  return (
    <>
      <FreshOnVisit renderedAt={renderedAt} />
      <PageHead
        title="Revenue & assets"
        lede="Everything the company has earned, spent and holds. Click any card to see what makes it up."
      />

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        <StatCard
          label="This month's revenue"
          value={rupees.format(total(monthRev))}
          change={{
            now: total(monthRev),
            before: total(inPeriod(lastMonth)),
            against: monthName(lastMonth),
          }}
          lede={`Everything received in ${monthLabel(thisMonth)}.`}
        >
          <Receipts rows={monthRev} />
        </StatCard>
        <StatCard
          label="This year's revenue"
          value={rupees.format(total(yearRev))}
          change={{
            now: total(yearRev),
            before: total(inPeriod(lastYear)),
            against: lastYear,
          }}
          lede={`Everything received in ${thisYear}.`}
        >
          <Receipts rows={yearRev} />
        </StatCard>
        <StatCard
          label="Expected revenue"
          value={rupees.format(expectedTotal)}
          hint={
            expected.length
              ? `${expected.length} ${expected.length === 1 ? "project" : "projects"} still to pay`
              : "Nothing expected"
          }
          lede="Money still to come: each project in lead, proposal, active, on hold or delivered, at its agreed price less what the client has already paid. Lost projects and our own companies are left out."
        >
          <Table
            head={["Project", "Stage", "Agreed", "Paid", "Still to come"]}
            empty="Nothing more is expected. Set a project's price to count it."
            rows={expected.map((e) => [
              <ProjectLink key="p" id={e.id} name={e.project} sub={e.client} />,
              <StatusPill key="s" status={e.status} />,
              rupees.format(e.value),
              <span key="r" className="text-leaf-deep">
                {rupees.format(e.received)}
              </span>,
              <strong key="o" className="text-brand-deep">
                {rupees.format(e.toCome)}
              </strong>,
            ])}
          />
        </StatCard>
        <StatCard
          label="All-time revenue"
          value={rupees.format(total(receipts))}
          hint={`${receipts.length} payments`}
          lede="Every client payment and course fee ever received."
        >
          <Receipts rows={receipts} />
        </StatCard>

        <StatCard
          label="Clients owe · development"
          value={rupees.format(devOwed)}
          tone={devOwed ? "warn" : undefined}
          hint={
            dev.length
              ? `${dev.length} ${dev.length === 1 ? "project" : "projects"}`
              : "All paid up"
          }
          lede="The one-time development price of each project, less what its client has paid."
        >
          <Table
            head={[
              "Project",
              "Expected",
              "Received",
              "Still owed",
              "Last paid",
            ]}
            empty="Every project's development is paid up."
            rows={dev.map((d) => [
              <ProjectLink key="p" id={d.id} name={d.project} sub={d.client} />,
              rupees.format(d.expected),
              <span key="r" className="text-leaf-deep">
                {rupees.format(d.received)}
              </span>,
              <strong key="o" className="text-amber-deep">
                {rupees.format(d.owed)}
              </strong>,
              day(d.last),
            ])}
          />
        </StatCard>
        <StatCard
          label="Clients owe · maintenance"
          value={rupees.format(assets.totals.clientsOwe)}
          tone={assets.totals.clientsOwe ? "warn" : undefined}
          hint={`${assets.dues.length} ${assets.dues.length === 1 ? "cost" : "costs"} not paid back`}
          lede="Running costs we paid for clients (hosting, messages, maintenance charges) that they have not paid us back yet. Mark them “Client paid” on the project."
        >
          <Table
            head={["When", "Cost", "Project", "Amount"]}
            empty="Clients have paid back every cost."
            rows={assets.dues.map((d) => [
              day(d.on),
              d.item,
              <ProjectLink key="p" id={d.projectId} name={d.project} />,
              <strong key="a" className="text-amber-deep">
                {rupees.format(d.amount)}
              </strong>,
            ])}
          />
        </StatCard>
        <BalanceLog
          balance={assets.totals.balance}
          movements={assets.movements}
          className={cardButton}
        >
          <StatFace
            label="Company balance"
            value={rupees.format(assets.totals.balance)}
            tone={assets.totals.balance < 0 ? "bad" : undefined}
            hint="Every rupee in and out"
          />
        </BalanceLog>

        <StatCard
          label="To pay back to people"
          value={rupees.format(assets.totals.stillOwed)}
          tone={assets.totals.stillOwed ? "warn" : undefined}
          hint={
            assets.owed.length
              ? assets.owed.map((p) => p.name).join(", ")
              : "Nobody waiting"
          }
          lede="Costs people paid out of their own pocket, not yet paid back by the company. Mark them “Paid back” on the project."
        >
          {assets.owed.length === 0 ? (
            <p className="text-ink-faint px-6 py-12 text-center text-[0.875rem]">
              Nobody is waiting to be paid back.
            </p>
          ) : (
            <div className="space-y-5 px-4 py-4 sm:px-6">
              {assets.owed.map((p) => (
                <div key={p.name}>
                  <p className="text-ink flex items-baseline justify-between gap-3 font-semibold">
                    {p.name}
                    <span className="text-amber-deep tabular-nums">
                      {rupees.format(p.total)}
                    </span>
                  </p>
                  <Table
                    head={["When", "Cost", "Project", "Amount"]}
                    rows={p.bills.map((b) => [
                      day(b.on),
                      b.item,
                      <ProjectLink key="p" id={b.projectId} name={b.project} />,
                      rupees.format(b.amount),
                    ])}
                    flush
                  />
                </div>
              ))}
            </div>
          )}
        </StatCard>
        <StatCard
          label="Clients"
          value={String(clients.length)}
          hint={`${sum(clients, (c) => c.projects)} projects, our own aside`}
          lede="Clients with work running or delivered. Nectarray and Verona Ads are ours, so they are not counted."
        >
          <Table
            head={["Client", "Projects", "Expected", "Received", "Still owed"]}
            empty="No clients yet."
            rows={clients.map((c) => [
              <strong key="n" className="text-ink">
                {c.name}
              </strong>,
              String(c.projects),
              c.expected ? rupees.format(c.expected) : "—",
              <span key="r" className="text-leaf-deep">
                {rupees.format(c.received)}
              </span>,
              c.expected
                ? rupees.format(Math.max(0, c.expected - c.received))
                : "—",
            ])}
          />
        </StatCard>
        <StatCard
          label="Overall profit"
          value={rupees.format(profit)}
          tone={profit < 0 ? "bad" : "good"}
          change={{
            now: profitIn(thisMonth),
            before: profitIn(lastMonth),
            against: monthName(lastMonth),
          }}
          hint={`${rupees.format(profitIn(thisMonth))} this month`}
          lede="All revenue, less every company expense paid, all commission given and every other spend. Costs marked Personal use (profit taken out) or Temporary (money we get back) are not counted, nor is money put into the company."
        >
          <div className="px-4 py-4 sm:px-6">
            <ProfitBreakdown
              profit={profit}
              groups={[
                {
                  label: "Revenue",
                  kind: "in",
                  items: receipts.map((r) => ({
                    key: `${r.on}-${r.from}-${r.amount}-${r.what}`,
                    on: r.on,
                    what: r.projectId ? r.what : `${r.what} · ${r.from}`,
                    sub: r.projectId ? r.from : "Academy",
                    href: r.projectId
                      ? `${ADMIN}/projects/${r.projectId}`
                      : `${ADMIN}/students`,
                    amount: r.amount,
                  })),
                },
                {
                  label: "Costs paid back by clients",
                  kind: "in",
                  items: moveItems(
                    assets.movements.filter(
                      (m) => m.source === "repaid" && counted(m),
                    ),
                  ),
                },
                {
                  label: "Company expenses",
                  kind: "out",
                  items: moveItems(
                    assets.movements.filter(
                      (m) => m.source === "bill" && counted(m),
                    ),
                  ),
                },
                {
                  label: "Commission",
                  kind: "out",
                  items: commissions.map((c) => ({
                    key: c.key,
                    on: c.on,
                    what: `${c.name}${c.percent ? ` · ${c.percent}%` : ""}${c.paidOn ? "" : " · to pay"}`,
                    sub: c.what,
                    href: c.projectId
                      ? `${ADMIN}/projects/${c.projectId}`
                      : `${ADMIN}/students`,
                    amount: c.amount,
                  })),
                },
                {
                  label: "Other spends",
                  kind: "out",
                  items: moveItems(
                    assets.movements.filter(
                      (m) => m.source === "entry" && m.kind === "out",
                    ),
                  ),
                },
              ]}
              aside={[
                {
                  label: "Personal use",
                  lede: "profit taken out",
                  kind: "out",
                  items: moveItems(
                    assets.movements.filter(
                      (m) => m.source === "bill" && m.use === "personal",
                    ),
                  ),
                },
                {
                  label: "Temporary",
                  lede: "comes back",
                  kind: "out",
                  items: moveItems(
                    assets.movements.filter(
                      (m) => m.source === "bill" && m.use === "temporary",
                    ),
                  ),
                },
              ]}
            />
            <p className="text-ink mt-5 mb-2 text-[0.875rem] font-semibold">
              Month by month
            </p>
            <Table
              head={["Month", "Revenue", "Costs", "Profit"]}
              flush
              empty="Nothing in the last twelve months."
              rows={Array.from({ length: 12 }, (_, i) =>
                addMonths(thisMonth, -i),
              )
                // Only months where something happened.
                .filter((m) => events.some((e) => e.on.startsWith(m)))
                .map((m) => {
                  const mine = events.filter((e) => e.on.startsWith(m));
                  const rev = sum(
                    mine.filter((e) => e.type === "revenue"),
                    (e) => e.amount,
                  );
                  const p = profitIn(m);
                  return [
                    monthLabel(m),
                    rupees.format(rev),
                    rupees.format(rev - p),
                    <strong
                      key="p"
                      className={p < 0 ? "text-danger" : "text-leaf-deep"}
                    >
                      {rupees.format(p)}
                    </strong>,
                  ];
                })}
            />
          </div>
        </StatCard>

        <StatCard
          label="Commission"
          value={rupees.format(commissionTotal)}
          hint={
            commissions.length
              ? commissionDue
                ? `${rupees.format(commissionDue)} still to pay`
                : "All paid"
              : "None given"
          }
          tone={commissionDue ? "warn" : undefined}
          lede="Commission given to people on projects and course fees, worked out from what has come in. It is part of the revenue, and comes off the profit and the company balance as soon as it is given, paid yet or not."
        >
          <Table
            head={["When", "Person", "On", "Share", "Amount"]}
            empty="No commission given yet. Add it on a project's Development cost or a student's payment."
            rows={commissions.map((c) => [
              day(c.on),
              <strong key="n" className="text-ink">
                {c.name}
              </strong>,
              <ProjectLink key="p" id={c.projectId} name={c.what} />,
              <span key="s">
                {c.percent ? `${c.percent}%` : "Fixed"}
                <span className="text-ink-faint block text-[0.75rem]">
                  of {rupees.format(c.base)}
                </span>
              </span>,
              <span key="a">
                <strong className="text-ink">{rupees.format(c.amount)}</strong>
                <span
                  className={cn(
                    "block text-[0.75rem]",
                    c.paidOn ? "text-leaf-deep" : "text-amber-deep",
                  )}
                >
                  {c.paidOn ? `paid ${day(c.paidOn)}` : "to pay"}
                </span>
              </span>,
            ])}
          />
        </StatCard>
      </div>

      <MoneyChart events={events} thisMonth={thisMonth} />

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
                        {m.clientPaid !== undefined && (
                          <span
                            className={
                              m.clientPaid
                                ? "text-leaf-deep"
                                : "text-amber-deep"
                            }
                          >
                            {m.clientPaid
                              ? " · client paid"
                              : " · client to pay"}
                          </span>
                        )}
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

type BreakdownItem = {
  key: string;
  on: string;
  what: string;
  sub?: string;
  href?: string;
  amount: number;
};
type BreakdownGroup = {
  label: string;
  lede?: string;
  kind: "in" | "out";
  items: BreakdownItem[];
};

/** Movements off the company's money as lines of a breakdown. */
const moveItems = (
  moves: Awaited<ReturnType<typeof loadAssets>>["movements"],
): BreakdownItem[] =>
  moves.map((m) => ({
    key: m.key,
    on: m.on,
    what: m.reason,
    sub: [m.project, m.repaidTo && `paid back to ${m.repaidTo}`]
      .filter(Boolean)
      .join(" · "),
    href:
      m.source === "entry"
        ? undefined
        : m.academy
          ? `${ADMIN}/students`
          : `${ADMIN}/projects/${m.id}`,
    amount: m.amount,
  }));

/**
 * The profit, line by line. Each line opens to what makes it up, newest
 * first; the costs that are not counted sit below, opening the same way.
 */
function ProfitBreakdown({
  profit,
  groups,
  aside,
}: {
  profit: number;
  groups: BreakdownGroup[];
  aside: BreakdownGroup[];
}) {
  const shown = aside.filter((g) => g.items.length > 0);
  return (
    <>
      <div className="border-line divide-line-soft divide-y overflow-hidden rounded-xl border text-[0.875rem] tabular-nums">
        {groups.map((g) => (
          <BreakdownRow key={g.label} group={g} />
        ))}
        <div className="bg-mist/60 flex items-center justify-between gap-3 px-4 py-3">
          <span className="text-ink font-semibold">Profit</span>
          <span
            className={cn(
              "text-[1.0625rem] font-bold",
              profit < 0 ? "text-danger" : "text-leaf-deep",
            )}
          >
            {rupees.format(profit)}
          </span>
        </div>
      </div>
      {shown.length > 0 && (
        <>
          <p className="text-ink-faint mt-4 mb-1.5 text-[0.75rem]">
            Not counted in the profit, though they still move the company
            balance:
          </p>
          <div className="border-line divide-line-soft divide-y overflow-hidden rounded-xl border border-dashed text-[0.875rem] tabular-nums">
            {shown.map((g) => (
              <BreakdownRow key={g.label} group={g} muted />
            ))}
          </div>
        </>
      )}
    </>
  );
}

/** One line of the profit; opens to its entries, newest first. */
function BreakdownRow({
  group: g,
  muted,
}: {
  group: BreakdownGroup;
  muted?: boolean;
}) {
  const amount = sum(g.items, (i) => i.amount);
  const items = [...g.items].sort((a, b) => b.on.localeCompare(a.on));
  return (
    <details className="group/row">
      <summary
        className={cn(
          "hover:bg-mist/50 flex cursor-pointer list-none items-center gap-2 px-4 py-2.5 transition-colors [&::-webkit-details-marker]:hidden",
          items.length === 0 && "pointer-events-none",
        )}
      >
        <ChevronRight
          className={cn(
            "text-ink-faint size-4 shrink-0 transition-transform group-open/row:rotate-90",
            items.length === 0 && "opacity-0",
          )}
          aria-hidden
        />
        {g.kind === "in" ? (
          <ArrowDownLeft className="text-leaf-deep size-4" aria-hidden />
        ) : (
          <ArrowUpRight className="text-ink-faint size-4" aria-hidden />
        )}
        <span className={muted ? "text-ink-faint" : "text-ink-soft"}>
          {g.label}
          {g.lede && (
            <span className="text-ink-faint text-[0.75rem]"> · {g.lede}</span>
          )}
        </span>
        <span className="text-ink-faint hidden text-[0.75rem] sm:inline">
          {items.length > 0 &&
            `${items.length} ${items.length === 1 ? "entry" : "entries"}`}
        </span>
        <span
          className={cn(
            "ml-auto font-semibold",
            muted
              ? "text-ink-faint"
              : g.kind === "in"
                ? "text-leaf-deep"
                : "text-ink",
          )}
        >
          {g.kind === "in" || muted ? "" : "− "}
          {rupees.format(amount)}
        </span>
      </summary>
      <ul className="bg-mist/30 border-line-soft divide-line-soft max-h-72 divide-y overflow-y-auto border-t">
        {items.map((i) => {
          const body = (
            <>
              <span className="text-ink-faint w-24 shrink-0 text-[0.75rem]">
                {day(i.on)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-ink block truncate text-[0.8125rem]">
                  {i.what}
                </span>
                {i.sub && (
                  <span className="text-ink-faint block truncate text-[0.6875rem]">
                    {i.sub}
                  </span>
                )}
              </span>
              <span className="text-ink shrink-0 text-[0.8125rem] font-semibold">
                {rupees.format(i.amount)}
              </span>
            </>
          );
          const row = "flex items-center gap-3 py-2 pr-4 pl-11";
          return (
            <li key={i.key}>
              {i.href ? (
                <Link
                  href={i.href}
                  className={cn(row, "hover:bg-surface transition-colors")}
                >
                  {body}
                </Link>
              ) : (
                <div className={row}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </details>
  );
}

/** A table for a pop-up: a sticky head, and a line when there is nothing. */
function Table({
  head,
  rows,
  empty = "Nothing here.",
  flush,
}: {
  head: string[];
  rows: ReactNode[][];
  empty?: string;
  /** Inside padding already: no side gutters of its own. */
  flush?: boolean;
}) {
  if (rows.length === 0)
    return (
      <p className="text-ink-faint px-6 py-12 text-center text-[0.875rem]">
        {empty}
      </p>
    );
  const pad = flush
    ? "px-3"
    : "px-4 first:pl-4 last:pr-4 sm:first:pl-6 sm:last:pr-6";
  return (
    <div
      className={cn(flush && "border-line overflow-x-auto rounded-xl border")}
    >
      <table className="w-full min-w-[34rem] text-left text-[0.8125rem]">
        <thead className="bg-surface sticky top-0 z-10 shadow-[0_1px_0_var(--color-line)]">
          <tr className="text-ink-faint text-[0.6875rem] font-semibold tracking-[0.08em] uppercase">
            {head.map((h, i) => (
              <th
                key={h}
                className={cn(
                  pad,
                  "py-2.5",
                  i > 0 && i === head.length - 1 && "text-right",
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-line-soft divide-y">
          {rows.map((cells, r) => (
            <tr key={r} className="hover:bg-mist/50 align-top">
              {cells.map((cell, i) => (
                <td
                  key={i}
                  className={cn(
                    pad,
                    "text-ink-soft py-2.5 tabular-nums",
                    i > 0 && i === cells.length - 1 && "text-right",
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A project, or the students page for something with no project. */
function ProjectLink({
  id,
  name,
  sub,
}: {
  id?: string;
  name: string;
  sub?: string;
}) {
  return (
    <Link
      href={id ? `${ADMIN}/projects/${id}` : `${ADMIN}/students`}
      className="hover:text-brand-deep text-ink font-semibold underline-offset-2 hover:underline"
    >
      {name}
      {sub && (
        <span className="text-ink-faint block text-[0.75rem] font-normal">
          {sub}
        </span>
      )}
    </Link>
  );
}

/** Payments received, newest first, with a total for each service. */
function Receipts({ rows }: { rows: Receipt[] }) {
  const byLine = REVENUE_LINES.map((l) => ({
    ...l,
    amount: sum(
      rows.filter((r) => lineOf(r.service) === l.id),
      (r) => r.amount,
    ),
  })).filter((l) => l.amount);
  return (
    <>
      {byLine.length > 0 && (
        <div className="border-line bg-mist/40 flex flex-wrap gap-2 border-b px-4 py-3 sm:px-6">
          {byLine.map((l) => (
            <span
              key={l.id}
              className="bg-surface border-line inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.75rem] tabular-nums"
            >
              <span className={`size-2 rounded-full ${BAR[l.id]}`} />
              {l.label}
              <strong className="text-ink">{rupees.format(l.amount)}</strong>
            </span>
          ))}
        </div>
      )}
      <Table
        head={["Received", "From", "For", "Amount"]}
        empty="Nothing received in this period."
        rows={rows.map((r) => [
          day(r.on),
          <span key="f" className="text-ink">
            {r.from}
            <span className="text-ink-faint block text-[0.75rem]">
              {serviceLabel(r.service)}
            </span>
          </span>,
          r.projectId ? (
            <ProjectLink key="p" id={r.projectId} name={r.what} sub={r.ref} />
          ) : (
            <Link
              key="s"
              href={`${ADMIN}/students`}
              className="hover:text-brand-deep underline-offset-2 hover:underline"
            >
              {r.what}
            </Link>
          ),
          <strong key="a" className="text-leaf-deep">
            {rupees.format(r.amount)}
          </strong>,
        ])}
      />
    </>
  );
}
