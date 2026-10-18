"use client";

import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Select } from "@/components/admin/Select";
import { cn } from "@/lib/utils";

/** One thing that happened to the company's money, for the graph. */
export type ChartEvent = {
  /** "2026-10-05", or "2026-10" for a cost with only its month. */
  on: string;
  /**
   * revenue: a client payment or a course fee. cost: a bill the company
   * paid. back: a cost a client paid us back. spend: anything else spent.
   * commission: a share of what came in, given to someone.
   */
  type: "revenue" | "cost" | "back" | "spend" | "commission";
  amount: number;
  /**
   * For revenue: the service line, and the client who paid; none for a
   * course fee or a payment on our own companies, which are not clients.
   */
  line?: string;
  who?: string;
};

type Metric = "revenue" | "profit" | "costs" | "clients";
type Period = "6" | "12" | "year";

const METRICS: { id: Metric; label: string; lede: string }[] = [
  {
    id: "revenue",
    label: "Revenue",
    lede: "Client payments and course fees received",
  },
  {
    id: "profit",
    label: "Profit",
    lede: "Revenue, less company expenses, commission and other spends (personal use and temporary costs aside)",
  },
  {
    id: "costs",
    label: "Costs",
    lede: "Company expenses, commission and other spends (personal use and temporary costs aside)",
  },
  {
    id: "clients",
    label: "Paying clients",
    lede: "Different clients who paid in the period (students and our own companies aside)",
  },
];

const LINES = [
  { id: "marketing", label: "Marketing", bar: "bg-amber" },
  { id: "software", label: "Software", bar: "bg-brand" },
  { id: "ai", label: "Agentic AI", bar: "bg-leaf" },
  { id: "academy", label: "Academy", bar: "bg-teal" },
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** ₹84k, ₹1.2L, ₹2.5Cr: short enough to sit on a bar. */
function short(n: number, money: boolean) {
  if (!money) return String(n);
  const a = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  const fix = (v: number) =>
    v >= 10 ? Math.round(v) : Math.round(v * 10) / 10;
  if (a >= 1e7) return `${sign}₹${fix(a / 1e7)}Cr`;
  if (a >= 1e5) return `${sign}₹${fix(a / 1e5)}L`;
  if (a >= 1e3) return `${sign}₹${fix(a / 1e3)}k`;
  return `${sign}₹${Math.round(a)}`;
}

const full = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function addMonth(key: string, n: number) {
  const [y, m] = key.split("-").map(Number);
  const i = y * 12 + (m - 1) + n;
  return `${Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, "0")}`;
}

/**
 * The money over time as bars: revenue (split by service), profit, costs or
 * paying clients, month by month or year by year, each bar with its change
 * from the one before.
 */
export function MoneyChart({
  events,
  thisMonth,
}: {
  events: ChartEvent[];
  /** "2026-10", in India time. */
  thisMonth: string;
}) {
  const [metric, setMetric] = useState<Metric>("revenue");
  const [period, setPeriod] = useState<Period>("6");
  const [line, setLine] = useState("all");
  const [hover, setHover] = useState<number | null>(null);

  const money = metric !== "clients";
  const lined = metric === "revenue" || metric === "clients";

  const buckets = useMemo(() => {
    let keys: string[];
    if (period === "year") {
      const first = Math.min(
        Number(thisMonth.slice(0, 4)),
        ...events.map((e) => Number(e.on.slice(0, 4))).filter(Boolean),
      );
      const last = Number(thisMonth.slice(0, 4));
      keys = Array.from({ length: last - first + 1 }, (_, i) =>
        String(first + i),
      );
    } else {
      const n = Number(period);
      keys = Array.from({ length: n }, (_, i) =>
        addMonth(thisMonth, i - n + 1),
      );
    }

    return keys.map((key) => {
      const mine = events.filter((e) => e.on.startsWith(key));
      const revenue = mine.filter(
        (e) => e.type === "revenue" && (line === "all" || e.line === line),
      );
      const sum = (type: ChartEvent["type"]) =>
        mine.filter((e) => e.type === type).reduce((n, e) => n + e.amount, 0);
      const byLine = LINES.map((l) => ({
        ...l,
        amount: revenue
          .filter((e) => e.line === l.id)
          .reduce((n, e) => n + e.amount, 0),
      }));
      const income = revenue.reduce((n, e) => n + e.amount, 0);
      const value =
        metric === "revenue"
          ? income
          : metric === "profit"
            ? sum("revenue") +
              sum("back") -
              sum("cost") -
              sum("spend") -
              sum("commission")
            : metric === "costs"
              ? sum("cost") + sum("spend") + sum("commission") - sum("back")
              : new Set(revenue.flatMap((e) => (e.who ? [e.who] : []))).size;
      const label =
        period === "year"
          ? key
          : `${MONTHS[Number(key.slice(5)) - 1]}${
              key.endsWith("-01") || key === keys[0]
                ? ` ’${key.slice(2, 4)}`
                : ""
            }`;
      return { key, label, value, byLine, income };
    });
  }, [events, metric, period, line, thisMonth]);

  const values = buckets.map((b) => b.value);
  const max = Math.max(0, ...values);
  const min = Math.min(0, ...values);
  const range = max - min || 1;
  const total =
    metric === "clients"
      ? new Set(
          events
            .filter(
              (e) =>
                e.type === "revenue" &&
                (line === "all" || e.line === line) &&
                buckets.some((b) => e.on.startsWith(b.key)),
            )
            .flatMap((e) => (e.who ? [e.who] : [])),
        ).size
      : values.reduce((n, v) => n + v, 0);
  const ticks = [max, max - range / 3, max - (2 * range) / 3, min].map((v) =>
    Math.round(v),
  );
  const shown = hover == null ? null : buckets[hover];
  const about = METRICS.find((m) => m.id === metric)!;

  return (
    <section className="card mt-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow">{about.label}</p>
          <p
            className={cn(
              "display mt-1 text-[1.75rem] leading-none sm:text-[2.25rem]",
              total < 0 ? "text-danger" : "text-ink",
            )}
          >
            {money ? full.format(total) : total}
          </p>
          <p className="text-ink-faint mt-1.5 text-[0.75rem]">
            {about.lede},{" "}
            {period === "year" ? "year by year" : `last ${period} months`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={metric}
            onChange={(e) => setMetric(e.target.value as Metric)}
            aria-label="What to show"
            className="border-line bg-surface text-ink focus:border-brand h-9 w-40 rounded-lg border px-3 text-[0.8125rem] font-semibold"
          >
            {METRICS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </Select>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            aria-label="Period"
            className="border-line bg-surface text-ink focus:border-brand h-9 w-40 rounded-lg border px-3 text-[0.8125rem]"
          >
            <option value="6">Last 6 months</option>
            <option value="12">Last 12 months</option>
            <option value="year">Year by year</option>
          </Select>
          {lined && (
            <Select
              value={line}
              onChange={(e) => setLine(e.target.value)}
              aria-label="Service"
              className="border-line bg-surface text-ink focus:border-brand h-9 w-40 rounded-lg border px-3 text-[0.8125rem]"
            >
              <option value="all">Every service</option>
              {LINES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </Select>
          )}
        </div>
      </div>

      {/* The bars, redrawn (and grown again) when what is shown changes. */}
      <div
        key={`${metric}-${period}-${line}`}
        className="relative mt-6 flex gap-2 pl-12 sm:gap-4"
        onMouseLeave={() => setHover(null)}
      >
        <div className="pointer-events-none absolute inset-0 left-12">
          {ticks.map((t, i) => (
            <div
              key={i}
              className="border-line-soft absolute right-0 left-0 border-t border-dashed"
              style={{ top: `${(i / 3) * 18}rem` }}
            />
          ))}
          {min < 0 && (
            <div
              className="border-ink-faint absolute right-0 left-0 border-t"
              style={{ top: `${(max / range) * 18}rem` }}
            />
          )}
        </div>
        <div className="text-ink-faint pointer-events-none absolute top-0 left-0 h-72 w-11 text-right text-[0.625rem] tabular-nums">
          {ticks.map((t, i) => (
            <span
              key={i}
              className="absolute right-1 -translate-y-1/2"
              style={{ top: `${(i / 3) * 100}%` }}
            >
              {short(t, money)}
            </span>
          ))}
        </div>

        {buckets.map((b, i) => {
          const prev = buckets[i - 1];
          const up = prev ? b.value > prev.value : false;
          const same = prev ? b.value === prev.value : true;
          const pct =
            prev && prev.value !== 0
              ? Math.round(
                  (Math.abs(b.value - prev.value) / Math.abs(prev.value)) * 100,
                )
              : null;
          const positive = b.value >= 0;
          const height = (Math.abs(b.value) / range) * 100;
          const top = positive
            ? ((max - b.value) / range) * 100
            : (max / range) * 100;
          const stacked =
            metric === "revenue" && line === "all" && b.income > 0;
          return (
            <div
              key={b.key}
              className="flex min-w-0 flex-1 flex-col items-center"
              onMouseEnter={() => setHover(i)}
            >
              <div className="relative h-72 w-full">
                <div
                  className={cn(
                    "bar-grow absolute right-[12%] left-[12%] flex flex-col-reverse overflow-hidden transition-[filter,opacity] duration-200",
                    positive ? "rounded-t-lg" : "rounded-b-lg",
                    hover != null && hover !== i && "opacity-55",
                    hover === i && "brightness-110",
                  )}
                  style={{
                    top: `${top}%`,
                    height: `${Math.max(height, b.value ? 0.8 : 0)}%`,
                    transformOrigin: positive ? "bottom" : "top",
                    animationDelay: `${i * 45}ms`,
                  }}
                >
                  {stacked ? (
                    b.byLine.map((l) =>
                      l.amount ? (
                        <div
                          key={l.id}
                          className={l.bar}
                          style={{ height: `${(l.amount / b.income) * 100}%` }}
                        />
                      ) : null,
                    )
                  ) : (
                    <div
                      className={cn(
                        "h-full w-full",
                        !positive
                          ? "bg-danger/80"
                          : metric === "costs"
                            ? "bg-amber"
                            : metric === "profit"
                              ? "bg-leaf"
                              : metric === "clients"
                                ? "bg-brand-solid"
                                : (LINES.find((l) => l.id === line)?.bar ??
                                  "bg-brand"),
                      )}
                    />
                  )}
                </div>
                {b.value !== 0 && (
                  <span
                    className="text-ink-soft absolute right-0 left-0 -translate-y-full pb-1 text-center text-[0.6875rem] font-semibold tabular-nums"
                    style={{ top: `${positive ? top : top + height}%` }}
                  >
                    {short(b.value, money)}
                  </span>
                )}
              </div>
              <p className="text-ink mt-2 text-[0.75rem] font-semibold whitespace-nowrap">
                {b.label}
              </p>
              <p
                className={cn(
                  "inline-flex h-4 items-center text-[0.625rem] font-semibold tabular-nums",
                  !prev || same
                    ? "text-ink-faint"
                    : up === (metric !== "costs")
                      ? "text-leaf-deep"
                      : "text-danger",
                )}
              >
                {prev && !same ? (
                  <>
                    {up ? (
                      <ArrowUpRight className="size-3" aria-hidden />
                    ) : (
                      <ArrowDownRight className="size-3" aria-hidden />
                    )}
                    {pct == null ? "new" : `${pct}%`}
                  </>
                ) : prev ? (
                  "—"
                ) : (
                  ""
                )}
              </p>
            </div>
          );
        })}
      </div>

      <div className="border-line-soft mt-4 flex min-h-[2.5rem] flex-wrap items-center gap-x-5 gap-y-1 border-t pt-3 text-[0.75rem]">
        {shown ? (
          <>
            <span className="text-ink font-semibold">
              {period === "year"
                ? shown.key
                : `${MONTHS[Number(shown.key.slice(5)) - 1]} ${shown.key.slice(0, 4)}`}
            </span>
            <span className="text-ink tabular-nums">
              {about.label}:{" "}
              <strong>{money ? full.format(shown.value) : shown.value}</strong>
            </span>
            {metric === "revenue" &&
              line === "all" &&
              shown.byLine
                .filter((l) => l.amount)
                .map((l) => (
                  <span
                    key={l.id}
                    className="text-ink-soft inline-flex items-center gap-1.5 tabular-nums"
                  >
                    <span className={`size-2 rounded-full ${l.bar}`} />
                    {l.label} {full.format(l.amount)}
                  </span>
                ))}
          </>
        ) : metric === "revenue" && line === "all" ? (
          LINES.map((l) => (
            <span
              key={l.id}
              className="text-ink-soft inline-flex items-center gap-1.5"
            >
              <span className={`size-2 rounded-full ${l.bar}`} />
              {l.label}
            </span>
          ))
        ) : (
          <span className="text-ink-faint">
            Point at a bar for its figures.
          </span>
        )}
      </div>
    </section>
  );
}
