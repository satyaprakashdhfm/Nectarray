"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * The quarter and sprint at the top of the Tasks and Timeline tabs: how
 * far through each we are, and the quarter's sprints as a strip with the
 * current one marked. Animated in on load; still with reduced motion.
 */

export type CalendarView = {
  quarterLabel: string;
  quarterRange: string;
  quarterDay: number;
  quarterDays: number;
  sprintLabel: string;
  sprintRange: string;
  sprintDaysLeft: number;
  sprintDay: number;
  sprintDays: number;
  sprints: { n: number; range: string; state: "past" | "now" | "next" }[];
};

function Meter({
  value,
  delay = 0,
  tone = "bg-brand",
}: {
  value: number;
  delay?: number;
  tone?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="bg-mist-deep h-2 overflow-hidden rounded-full">
      <motion.div
        className={cn("h-full origin-left rounded-full", tone)}
        initial={reduce ? false : { scaleX: 0 }}
        animate={{ scaleX: Math.max(0.02, Math.min(1, value)) }}
        transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

export function WorkCalendar({ view }: { view: CalendarView }) {
  const reduce = useReducedMotion();
  return (
    <section className="card mt-6 grid gap-5 p-4 sm:p-5 lg:grid-cols-[1fr_1fr_1.3fr] lg:gap-8">
      <div className="min-w-0">
        <p className="eyebrow">Quarter running now</p>
        <p className="display text-ink mt-1 text-[1.375rem]">
          {view.quarterLabel}
        </p>
        <p className="text-ink-faint text-[0.75rem]">{view.quarterRange}</p>
        <div className="mt-3">
          <Meter value={view.quarterDay / view.quarterDays} />
        </div>
        <p className="text-ink-soft mt-1.5 text-[0.75rem]">
          Day {view.quarterDay} of {view.quarterDays}
        </p>
      </div>

      <div className="min-w-0">
        <p className="eyebrow">Current sprint</p>
        <p className="display text-ink mt-1 text-[1.375rem]">
          {view.sprintLabel}
        </p>
        <p className="text-ink-faint text-[0.75rem]">{view.sprintRange}</p>
        <div className="mt-3">
          <Meter
            value={view.sprintDay / view.sprintDays}
            delay={0.15}
            tone="bg-leaf-deep"
          />
        </div>
        <p className="text-ink-soft mt-1.5 text-[0.75rem]">
          {view.sprintDaysLeft === 0
            ? "Last day of the sprint"
            : `${view.sprintDaysLeft} day${view.sprintDaysLeft === 1 ? "" : "s"} left`}
        </p>
      </div>

      <div className="min-w-0">
        <p className="eyebrow">Sprints this quarter</p>
        <ol className="mt-3 grid grid-cols-7 gap-1.5">
          {view.sprints.map((s, i) => (
            <motion.li
              key={s.n}
              title={`Sprint ${s.n}: ${s.range}`}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className={cn(
                "flex h-14 flex-col justify-between rounded-lg border px-1.5 py-1 text-[0.6875rem] font-semibold",
                s.state === "now" &&
                  "border-brand bg-brand-wash text-brand-deep ring-brand/30 ring-2",
                s.state === "past" && "border-line bg-mist text-ink-faint",
                s.state === "next" && "border-line text-ink-soft",
              )}
            >
              <span>S{s.n}</span>
              <span className="truncate font-medium">
                {s.state === "now" ? "Now" : s.range.split(" to ")[0]}
              </span>
            </motion.li>
          ))}
        </ol>
        <p className="text-ink-faint mt-2 text-[0.6875rem]">
          Two-week sprints from the first day of the quarter. Financial year
          quarters, April to March.
        </p>
      </div>
    </section>
  );
}
