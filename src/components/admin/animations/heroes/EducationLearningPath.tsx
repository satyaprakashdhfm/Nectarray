"use client";

import { motion } from "motion/react";

const steps = [
  { week: "Weeks 1–3", title: "Python", x: 6, y: 75 },
  { week: "Weeks 4–6", title: "SQL", x: 28, y: 28 },
  { week: "Weeks 7–9", title: "Statistics", x: 50, y: 69 },
  { week: "Weeks 10–12", title: "Machine learning", x: 72, y: 25 },
  { week: "Week 13", title: "Placement", x: 94, y: 62 },
];

const DRAW = 2.4;
const START = 0.5;

/**
 * A winding line that draws itself through the course, each milestone
 * popping in as the line reaches it. On a narrow screen the same story runs
 * down a vertical line instead, where five labels across would collide.
 *
 * The milestones are HTML placed by percentage over a stretched SVG, so the
 * dots stay round however wide the hero is.
 */
export function EducationLearningPath() {
  return (
    <section className="@container overflow-hidden bg-(--p-light)">
      <div className="mx-auto max-w-6xl px-5 py-16 @3xl:py-20">
        <div className="max-w-2xl">
          <motion.h1
            className="text-4xl leading-[1.05] font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            From your first line of code to your first offer, in 13 weeks
          </motion.h1>
          <motion.p
            className="mt-5 max-w-[48ch] text-base leading-relaxed text-zinc-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Every module builds on the last, and every week ends with a project
            a working data scientist reviews.
          </motion.p>
        </div>

        {/* Wide: the winding path. */}
        <div className="relative mt-12 hidden h-72 @2xl:block">
          <svg
            viewBox="0 0 1000 320"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
            aria-hidden
          >
            <path
              d="M60 240 C170 240 170 90 280 90 S390 220 500 220 S610 80 720 80 S830 200 940 200"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6 8"
              className="text-zinc-900/15"
            />
            <motion.path
              d="M60 240 C170 240 170 90 280 90 S390 220 500 220 S610 80 720 80 S830 200 940 200"
              fill="none"
              stroke="var(--p)"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: START, duration: DRAW, ease: "easeInOut" }}
            />
          </svg>
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: START + (DRAW * i) / (steps.length - 1),
                type: "spring",
                stiffness: 420,
                damping: 16,
              }}
            >
              <span className="grid size-10 place-items-center rounded-full bg-(--p) text-sm font-bold text-(--p-on) shadow-lg ring-4 ring-white">
                {i + 1}
              </span>
              <span className="mt-2 rounded-lg bg-white px-2.5 py-1.5 shadow-sm">
                <span className="block text-[11px] text-zinc-500">
                  {s.week}
                </span>
                <span className="block text-sm font-semibold whitespace-nowrap text-zinc-900">
                  {s.title}
                </span>
              </span>
            </motion.div>
          ))}
        </div>

        {/* Narrow: the same steps down a line that grows. */}
        <div className="relative mt-10 @2xl:hidden">
          <motion.div
            className="absolute top-2 bottom-2 left-5 w-1 origin-top rounded-full bg-(--p)"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: START, duration: DRAW, ease: "easeInOut" }}
          />
          <ol className="space-y-5">
            {steps.map((s, i) => (
              <motion.li
                key={s.title}
                className="relative flex items-center gap-4"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: START + (DRAW * i) / (steps.length - 1),
                  type: "spring",
                  stiffness: 300,
                  damping: 22,
                }}
              >
                <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-(--p) text-sm font-bold text-(--p-on) ring-4 ring-(--p-light)">
                  {i + 1}
                </span>
                <span>
                  <span className="block text-xs text-zinc-500">{s.week}</span>
                  <span className="block text-base font-semibold text-zinc-900">
                    {s.title}
                  </span>
                </span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
