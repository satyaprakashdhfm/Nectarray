"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "motion/react";

const stats = [
  { value: 2400, suffix: "+", label: "learners placed" },
  { value: 94, suffix: "%", label: "finish the course" },
  { value: 180, suffix: "", label: "hiring partners" },
];

const badges = [
  { text: "Live doubt-clearing", className: "top-6 -left-4", delay: 0 },
  { text: "New batch on Monday", className: "top-1/2 -right-4", delay: 0.8 },
  { text: "Mentor reviewed", className: "bottom-8 left-6", delay: 1.6 },
];

/**
 * Stats that count up the first time the hero is on screen, beside a photo
 * with small badges bobbing around it on staggered loops.
 */
export function EducationCountUp() {
  return (
    <section className="@container overflow-hidden bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 @3xl:grid-cols-2 @3xl:py-20">
        <div>
          <motion.span
            className="inline-block rounded-full bg-(--s-light) px-3 py-1 text-xs font-semibold text-(--s-dark)"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Admissions open
          </motion.span>
          <motion.h1
            className="mt-5 text-4xl leading-[1.05] font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Learn to code with people who hire coders
          </motion.h1>
          <motion.p
            className="mt-5 max-w-[44ch] text-base leading-relaxed text-zinc-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Twelve weeks of live classes, weekly projects reviewed line by line,
            and interview practice until you are ready.
          </motion.p>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-zinc-200 pt-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-4xl">
                  <Counter to={s.value} />
                  <span className="text-(--p)">{s.suffix}</span>
                </dd>
                <dd className="mt-1 text-xs text-zinc-500 @3xl:text-sm">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <motion.div
          className="relative mx-auto w-full max-w-md"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute -inset-3 -z-0 rotate-3 rounded-3xl bg-(--p-light)" />
          {/* eslint-disable-next-line @next/next/no-img-element -- copied into other projects, which may not use next/image */}
          <img
            src="https://picsum.photos/seed/classroom-laptops/800/900"
            alt="Students working on laptops in a class"
            className="relative aspect-[8/9] w-full rounded-2xl object-cover"
          />
          {badges.map((b) => (
            <motion.div
              key={b.text}
              className={`absolute rounded-xl bg-white px-3 py-2 text-xs font-semibold text-zinc-800 shadow-lg ring-1 ring-zinc-100 ${b.className}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
              transition={{
                opacity: { delay: 0.6 + b.delay / 2 },
                scale: { delay: 0.6 + b.delay / 2, type: "spring" },
                y: {
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: b.delay,
                },
              }}
            >
              <span className="mr-1.5 inline-block size-1.5 rounded-full bg-(--s) align-middle" />
              {b.text}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const value = useMotionValue(0);
  const text = useTransform(value, (v) =>
    Math.round(v).toLocaleString("en-IN"),
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, to, value]);

  return <motion.span ref={ref}>{text}</motion.span>;
}
