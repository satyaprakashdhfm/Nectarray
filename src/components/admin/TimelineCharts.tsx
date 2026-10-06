"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CheckCircle2, CircleCheck, FolderCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The Timeline tab's charts: completions by month, a day-by-day map, and
 * the projects laid across the quarters, with what was finished most
 * recently beside them.
 *
 * Colour follows the dataviz method: one categorical order for the
 * services (validated for light and dark against the card surface), one
 * sequential hue for the day map, and red kept for late work only, always
 * with a word beside it. Every mark has a hover note, and the feed doubles
 * as the plain list of what the charts show.
 */

export type MonthBar = {
  key: string;
  label: string;
  long: string;
  projects: number;
  tasks: number;
  projectNames: string[];
};

export type HeatDay = {
  date: string;
  label: string;
  future: boolean;
  count: number;
  names: string[];
};

export type GanttRow = {
  id: string;
  title: string;
  client: string;
  service: string;
  serviceLabel: string;
  status: string;
  start: string;
  end: string;
  due: string | null;
  done: boolean;
  late: boolean;
  days: number;
  startLabel: string;
  endLabel: string;
  dueLabel: string | null;
};

export type FeedEvent = {
  kind: "project" | "task";
  date: string;
  label: string;
  title: string;
  meta: string;
};

type Gantt = {
  from: string;
  to: string;
  today: string;
  todayLabel: string;
  span: number;
  quarters: { label: string; start: string; end: string }[];
  rows: GanttRow[];
};

/* Categorical slots, in fixed order (reference palette, validated). */
const SERVICE_ORDER = ["software", "marketing", "ai", "training"] as const;
const SERVICE_NAMES: Record<string, string> = {
  software: "Software",
  marketing: "Marketing",
  ai: "Agentic AI",
  training: "Academy training",
};

const VIZ_CSS = `
.viz-root {
  --viz-1: #2a78d6; --viz-2: #eb6834; --viz-3: #1baf7a; --viz-4: #eda100;
  --viz-late: #c0392b;
}
[data-ui-theme="dark"] .viz-root {
  --viz-1: #3987e5; --viz-2: #d95926; --viz-3: #199e70; --viz-4: #c98500;
  --viz-late: #ff8f80;
}
.viz-root .viz-hatch {
  background-image: repeating-linear-gradient(135deg, currentColor 0 2px, transparent 2px 6px);
}
`;

const serviceVar = (service: string) => {
  const i = SERVICE_ORDER.indexOf(service as (typeof SERVICE_ORDER)[number]);
  return `var(--viz-${i < 0 ? 1 : i + 1})`;
};

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const toTime = (iso: string) => Date.parse(`${iso}T00:00:00Z`);

export function TimelineCharts({
  quarterLabel,
  summary,
  months,
  days,
  gantt,
  feed,
}: {
  quarterLabel: string;
  summary: {
    projects: number;
    tasks: number;
    onTime: number | null;
    avgDays: number | null;
  };
  months: MonthBar[];
  days: HeatDay[];
  gantt: Gantt;
  feed: FeedEvent[];
}) {
  return (
    <div className="viz-root">
      <style>{VIZ_CSS}</style>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Figure
          label={`Projects delivered, ${quarterLabel}`}
          value={summary.projects}
        />
        <Figure
          label={`Tasks done, ${quarterLabel}`}
          value={summary.tasks}
          delay={0.05}
        />
        <Figure
          label="Tasks done on time"
          value={summary.onTime === null ? "–" : `${summary.onTime}%`}
          hint="Of this quarter's done tasks that had a due date"
          delay={0.1}
        />
        <Figure
          label="Days to deliver"
          value={summary.avgDays === null ? "–" : summary.avgDays}
          hint="Average, start to delivered, this quarter"
          delay={0.15}
        />
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <MonthChart
          title="Projects delivered by month"
          months={months}
          value={(m) => m.projects}
          colour="var(--viz-1)"
          unit="project"
          extra={(m) => m.projectNames.join(", ")}
        />
        <MonthChart
          title="Tasks done by month"
          months={months}
          value={(m) => m.tasks}
          colour="var(--viz-3)"
          unit="task"
          delay={0.1}
        />
      </section>

      <Heatmap days={days} />

      <section className="mt-8 grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <ProjectTimeline gantt={gantt} />
        <Feed feed={feed} />
      </section>
    </div>
  );
}

function Figure({
  label,
  value,
  hint,
  delay = 0,
}: {
  label: string;
  value: number | string;
  hint?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="card min-w-0 p-4 sm:p-5"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      <p className="eyebrow">{label}</p>
      <p className="display text-ink mt-1.5 text-[1.5rem] tabular-nums sm:text-[1.75rem]">
        {value}
      </p>
      {hint && <p className="text-ink-faint mt-0.5 text-[0.75rem]">{hint}</p>}
    </motion.div>
  );
}

/* ---------------------------------------------------------------- */

function MonthChart({
  title,
  months,
  value,
  colour,
  unit,
  extra,
  delay = 0,
}: {
  title: string;
  months: MonthBar[];
  value: (m: MonthBar) => number;
  colour: string;
  unit: string;
  extra?: (m: MonthBar) => string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const values = months.map(value);
  const max = Math.max(...values);
  const top = Math.max(1, max);
  const peak = values.indexOf(max);
  const last = values.length - 1;
  const total = values.reduce((a, b) => a + b, 0);
  const shown = hover ?? last;
  const plural = (n: number) => `${n} ${unit}${n === 1 ? "" : "s"}`;

  return (
    <div className="card min-w-0 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-ink text-[0.9375rem] font-semibold">{title}</h2>
        <p className="text-ink-faint text-[0.75rem]">
          {plural(total)} in 12 months
        </p>
      </div>
      {/* What the pointer is on, or this month. */}
      <p
        className="text-ink-soft mt-1 min-h-[2.5rem] text-[0.75rem]"
        aria-live="polite"
      >
        <span className="text-ink font-semibold">{months[shown].long}:</span>{" "}
        {plural(values[shown])}
        {extra && extra(months[shown]) && (
          <span className="text-ink-faint"> · {extra(months[shown])}</span>
        )}
      </p>

      <div className="relative mt-3 h-44">
        {/* One recessive gridline at the top value. */}
        <div className="border-line absolute inset-x-0 top-0 border-t" />
        <span className="text-ink-faint bg-surface absolute -top-2 right-0 pl-1 text-[0.625rem] tabular-nums">
          {top}
        </span>
        <div className="border-line absolute inset-x-0 bottom-0 border-t" />
        <ol className="absolute inset-0 flex items-end gap-0.5">
          {months.map((m, i) => {
            const v = values[i];
            const h = (v / top) * 100;
            const labelled = v > 0 && (i === peak || i === last);
            return (
              <li
                key={m.key}
                className="relative flex h-full flex-1 cursor-default flex-col items-center justify-end"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                tabIndex={0}
                aria-label={`${m.long}: ${plural(v)}`}
              >
                {labelled && (
                  <motion.span
                    className="text-ink mb-1 text-[0.6875rem] font-semibold tabular-nums"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + 0.6 + i * 0.04 }}
                  >
                    {v}
                  </motion.span>
                )}
                <motion.span
                  className="block w-full max-w-6 origin-bottom rounded-t-[4px]"
                  style={{
                    height: `${Math.max(v ? 3 : 0, h)}%`,
                    background: colour,
                    opacity: hover === null || hover === i ? 1 : 0.45,
                  }}
                  initial={reduce ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: delay + i * 0.045,
                    ease: EASE,
                  }}
                />
                {v === 0 && (
                  <span className="bg-line absolute bottom-0 h-px w-full max-w-6" />
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <ol className="mt-1.5 flex gap-0.5">
        {months.map((m, i) => (
          <li
            key={m.key}
            className={cn(
              "flex-1 text-center text-[0.625rem]",
              i === last ? "text-ink font-semibold" : "text-ink-faint",
            )}
          >
            {m.label}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------------------------------------------------------------- */

function Heatmap({ days }: { days: HeatDay[] }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<HeatDay | null>(null);
  const max = Math.max(1, ...days.map((d) => d.count));
  const weeks = Array.from({ length: days.length / 7 }, (_, w) =>
    days.slice(w * 7, w * 7 + 7),
  );
  const step = (n: number) =>
    n === 0
      ? 0
      : n <= max * 0.25
        ? 1
        : n <= max * 0.5
          ? 2
          : n <= max * 0.75
            ? 3
            : 4;
  // One hue, light to dark, mixed into the card surface.
  const fill = ["", "28%", "50%", "74%", "100%"];
  const total = days.reduce((a, d) => a + d.count, 0);
  const active = days.filter((d) => d.count > 0).length;

  return (
    <section className="card mt-4 min-w-0 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-ink text-[0.9375rem] font-semibold">
          Finished, day by day
        </h2>
        <p className="text-ink-faint text-[0.75rem]">
          {total} things finished on {active} days in 26 weeks
        </p>
      </div>
      <p
        className="text-ink-soft mt-1 min-h-[2.5rem] text-[0.75rem]"
        aria-live="polite"
      >
        {hover ? (
          <>
            <span className="text-ink font-semibold">{hover.label}:</span>{" "}
            {hover.count === 0 ? "nothing finished" : `${hover.count} finished`}
            {hover.names.length > 0 && (
              <span className="text-ink-faint">
                {" "}
                · {hover.names.join(", ")}
              </span>
            )}
          </>
        ) : (
          <span className="text-ink-faint">
            Point at a day to see what was finished. Tasks done and projects
            delivered both count.
          </span>
        )}
      </p>

      <div className="mt-3 overflow-x-auto pb-1">
        <div className="flex min-w-max gap-[3px]">
          <div className="text-ink-faint mr-1 grid grid-rows-7 gap-[3px] text-[0.5625rem] leading-[13px]">
            {["Mon", "", "Wed", "", "Fri", "", ""].map((d, i) => (
              <span key={i} className="h-[13px]">
                {d}
              </span>
            ))}
          </div>
          {weeks.map((week, w) => (
            <div key={week[0].date} className="grid grid-rows-7 gap-[3px]">
              {week.map((d, r) => {
                const s = step(d.count);
                return (
                  <motion.span
                    key={d.date}
                    role="img"
                    aria-label={`${d.label}: ${d.count} finished`}
                    onMouseEnter={() => setHover(d)}
                    onMouseLeave={() => setHover(null)}
                    className={cn(
                      "block size-[13px] rounded-[3px]",
                      d.future
                        ? "bg-transparent"
                        : s === 0
                          ? "bg-mist-deep"
                          : "",
                      hover?.date === d.date &&
                        "ring-ink ring-2 ring-offset-1 ring-offset-[var(--color-surface)]",
                    )}
                    style={
                      s > 0 && !d.future
                        ? {
                            background: `color-mix(in oklab, var(--viz-1) ${fill[s]}, var(--color-surface))`,
                          }
                        : undefined
                    }
                    initial={reduce ? false : { opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.35,
                      delay: (w + r) * 0.012,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="text-ink-faint mt-2 flex items-center justify-end gap-1.5 text-[0.625rem]">
        Fewer
        {[0, 1, 2, 3, 4].map((s) => (
          <span
            key={s}
            className={cn(
              "size-[11px] rounded-[3px]",
              s === 0 && "bg-mist-deep",
            )}
            style={
              s > 0
                ? {
                    background: `color-mix(in oklab, var(--viz-1) ${fill[s]}, var(--color-surface))`,
                  }
                : undefined
            }
          />
        ))}
        More
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */

function ProjectTimeline({ gantt }: { gantt: Gantt }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<GanttRow | null>(null);
  const at = (iso: string) =>
    Math.min(
      100,
      Math.max(
        0,
        ((toTime(iso) - toTime(gantt.from)) / 86_400_000 / gantt.span) * 100,
      ),
    );
  const end = (iso: string) => at(iso) + 100 / gantt.span; // through the end of that day
  const services = SERVICE_ORDER.filter((s) =>
    gantt.rows.some((r) => r.service === s),
  );
  const todayAt = at(gantt.today);

  return (
    <div className="card min-w-0 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-ink text-[0.9375rem] font-semibold">
          Projects across the quarters
        </h2>
        {/* Legend: always shown for two or more services. */}
        <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem]">
          {services.map((s) => (
            <li key={s} className="text-ink-soft flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-sm"
                style={{ background: serviceVar(s) }}
              />
              {SERVICE_NAMES[s]}
            </li>
          ))}
          <li className="text-ink-soft flex items-center gap-1.5">
            <span className="viz-hatch text-ink-faint h-2.5 w-4 rounded-sm" />
            Still to go
          </li>
        </ul>
      </div>
      <p
        className="text-ink-soft mt-1 min-h-[2.5rem] text-[0.75rem]"
        aria-live="polite"
      >
        {hover ? (
          <>
            <span className="text-ink font-semibold">{hover.title}</span>
            <span className="text-ink-faint">
              {" "}
              · {hover.client} · {hover.serviceLabel}
            </span>
            <br />
            {hover.startLabel} to{" "}
            {hover.done
              ? `${hover.endLabel}, delivered in ${hover.days} days`
              : `today, ${hover.days} days so far`}
            {!hover.done && hover.dueLabel && (
              <span className={hover.late ? "text-danger font-semibold" : ""}>
                {" "}
                ·{" "}
                {hover.late
                  ? `late, was due ${hover.dueLabel}`
                  : `due ${hover.dueLabel}`}
              </span>
            )}
          </>
        ) : (
          <span className="text-ink-faint">
            Each bar runs from the start to the day it was delivered. Point at
            one for its dates.
          </span>
        )}
      </p>

      {gantt.rows.length === 0 ? (
        <p className="text-ink-faint py-10 text-center text-[0.8125rem]">
          No projects in these four quarters yet.
        </p>
      ) : (
        <div className="mt-3 overflow-x-auto pb-1">
          <div className="relative min-w-[40rem]">
            {/* Quarter bands and their names. */}
            <div className="ml-[11rem] flex h-6">
              {gantt.quarters.map((q, i) => (
                <div
                  key={q.label}
                  className="text-ink-faint border-line border-l pl-1.5 text-[0.625rem] font-semibold"
                  style={{ width: `${end(q.end) - at(q.start)}%` }}
                >
                  {q.label}
                  {i === gantt.quarters.length - 1 && (
                    <span className="text-brand-deep"> · now</span>
                  )}
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 right-0 left-[11rem]">
                {gantt.quarters.map((q, i) => (
                  <div
                    key={q.label}
                    className={cn(
                      "border-line absolute inset-y-0 border-l",
                      i % 2 === 1 && "bg-mist/60",
                    )}
                    style={{
                      left: `${at(q.start)}%`,
                      width: `${end(q.end) - at(q.start)}%`,
                    }}
                  />
                ))}
                {/* Today. */}
                <motion.div
                  className="bg-ink absolute inset-y-0 w-px origin-top"
                  style={{ left: `${todayAt}%` }}
                  initial={reduce ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
                >
                  <span className="bg-ink text-cta-fg absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full rounded px-1.5 py-0.5 text-[0.5625rem] font-semibold whitespace-nowrap">
                    Today
                  </span>
                </motion.div>
              </div>

              <ul className="relative space-y-1.5 py-1">
                {gantt.rows.map((r, i) => {
                  const left = at(r.start);
                  const doneTo = r.done ? end(r.end) : todayAt;
                  const plannedTo =
                    !r.done && r.due && r.due > gantt.today ? end(r.due) : null;
                  const colour = serviceVar(r.service);
                  return (
                    <li
                      key={r.id}
                      className="flex h-7 items-center"
                      onMouseEnter={() => setHover(r)}
                      onMouseLeave={() => setHover(null)}
                    >
                      <span className="text-ink-soft w-[11rem] shrink-0 truncate pr-3 text-[0.75rem]">
                        <span className="text-ink font-medium">{r.title}</span>
                      </span>
                      <span className="relative h-full flex-1">
                        {plannedTo !== null && (
                          <motion.span
                            className="viz-hatch absolute top-1.5 bottom-1.5 origin-left rounded-r-[4px] opacity-60"
                            style={{
                              left: `${doneTo}%`,
                              width: `${Math.max(0.6, plannedTo - doneTo)}%`,
                              color: colour,
                            }}
                            initial={reduce ? false : { scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                              duration: 0.6,
                              delay: 0.5 + i * 0.05,
                              ease: EASE,
                            }}
                          />
                        )}
                        <motion.span
                          className={cn(
                            "absolute top-1.5 bottom-1.5 origin-left",
                            r.done || plannedTo === null
                              ? "rounded-[4px]"
                              : "rounded-l-[4px]",
                            hover && hover.id !== r.id && "opacity-40",
                          )}
                          style={{
                            left: `${left}%`,
                            width: `${Math.max(0.8, doneTo - left)}%`,
                            background: colour,
                          }}
                          initial={reduce ? false : { scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            duration: 0.8,
                            delay: 0.1 + i * 0.05,
                            ease: EASE,
                          }}
                        />
                        {r.done && (
                          <motion.span
                            className="bg-surface absolute top-1/2 grid size-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
                            style={{ left: `${doneTo}%`, color: colour }}
                            initial={reduce ? false : { scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 420,
                              damping: 18,
                              delay: 0.8 + i * 0.05,
                            }}
                          >
                            <CheckCircle2
                              className="size-4"
                              strokeWidth={2.4}
                              aria-hidden
                            />
                          </motion.span>
                        )}
                        {r.late && r.due && (
                          <span
                            className="absolute top-0 bottom-0 flex items-center"
                            style={{ left: `${end(r.due)}%` }}
                          >
                            <span className="bg-danger block h-full w-0.5" />
                            <span className="text-danger ml-1 text-[0.5625rem] font-bold uppercase">
                              Late
                            </span>
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */

function Feed({ feed }: { feed: FeedEvent[] }) {
  const reduce = useReducedMotion();
  return (
    <div className="card min-w-0 p-4 sm:p-5">
      <h2 className="text-ink text-[0.9375rem] font-semibold">
        Recently finished
      </h2>
      {feed.length === 0 ? (
        <p className="text-ink-faint py-8 text-center text-[0.8125rem]">
          Nothing finished yet. Mark a task done or a project delivered and it
          shows up here.
        </p>
      ) : (
        <ol className="border-line relative mt-4 ml-2 space-y-4 border-l">
          {feed.map((e, i) => (
            <motion.li
              key={`${e.kind}-${e.date}-${e.title}-${i}`}
              className="relative pl-5"
              initial={reduce ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05, duration: 0.4, ease: EASE }}
            >
              <span
                className={cn(
                  "bg-surface absolute top-0.5 -left-[9px] grid size-[17px] place-items-center rounded-full",
                  e.kind === "project" ? "text-brand-deep" : "text-leaf-deep",
                )}
              >
                {e.kind === "project" ? (
                  <FolderCheck className="size-4" strokeWidth={2} aria-hidden />
                ) : (
                  <CircleCheck className="size-4" strokeWidth={2} aria-hidden />
                )}
              </span>
              <p className="text-ink text-[0.8125rem] leading-snug font-semibold">
                {e.kind === "project" ? "Delivered: " : ""}
                {e.title}
              </p>
              <p className="text-ink-faint text-[0.6875rem]">
                {e.label} · {e.meta}
              </p>
            </motion.li>
          ))}
        </ol>
      )}
    </div>
  );
}
