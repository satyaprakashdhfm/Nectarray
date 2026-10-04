"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

// One beat: flat, a small P wave, the sharp QRS spike, a T wave, flat.
const beat = (x: number) =>
  `L${x + 20} 60 Q${x + 28} 50 ${x + 36} 60 L${x + 44} 60 L${x + 50} 72 L${x + 58} 14 L${x + 66} 84 L${x + 72} 60 L${x + 86} 60 Q${x + 98} 44 ${x + 110} 60 L${x + 125} 60`;
const trace = `M0 60 ${[0, 125, 250, 375].map(beat).join(" ")} L520 60`;

const chips = [
  { label: "Same-day reports", tone: "bg-(--p-light) text-(--p-dark)" },
  { label: "NABL-accredited labs", tone: "bg-(--s-light) text-(--s-dark)" },
  { label: "Free home collection", tone: "bg-(--t-light) text-(--t-dark)" },
];

/**
 * A heart-rate trace with a bright pulse travelling along it, over a faint
 * copy of the whole line, while the reading beside it drifts a beat or two.
 *
 * The pulse is a short dash of the path sliding along it (pathOffset), not
 * a redraw, so it moves at an even speed and loops without a jump.
 */
export function HealthHeartbeat() {
  const [bpm, setBpm] = useState(72);

  useEffect(() => {
    const t = window.setInterval(
      () => setBpm(70 + Math.round(Math.random() * 6)),
      1400,
    );
    return () => window.clearInterval(t);
  }, []);

  return (
    <section className="@container overflow-hidden bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 text-center @3xl:py-20">
        <motion.h1
          className="mx-auto max-w-[20ch] text-4xl leading-[1.05] font-semibold tracking-tight text-zinc-900 @3xl:text-6xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Full-body check-up, results by evening
        </motion.h1>
        <motion.p
          className="mx-auto mt-5 max-w-[48ch] text-base leading-relaxed text-zinc-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          82 tests, a sample collected at home before breakfast, and a doctor on
          the phone to walk you through the report.
        </motion.p>

        <motion.div
          className="relative mx-auto mt-10 max-w-3xl rounded-2xl bg-zinc-950 p-5 @3xl:p-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between text-left">
            <p className="text-xs font-medium tracking-wider text-white/50 uppercase">
              Heart rate
            </p>
            <p className="flex items-baseline gap-1.5 text-white">
              <motion.span
                className="text-(--t)"
                animate={{ scale: [1, 1.35, 1] }}
                transition={{ duration: 0.83, repeat: Infinity }}
              >
                ♥
              </motion.span>
              <span className="text-2xl font-semibold tabular-nums">{bpm}</span>
              <span className="text-xs text-white/50">bpm</span>
            </p>
          </div>
          <svg viewBox="0 0 520 100" className="mt-3 w-full" aria-hidden>
            <path
              d={trace}
              fill="none"
              stroke="var(--s)"
              strokeOpacity="0.2"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <motion.path
              d={trace}
              fill="none"
              stroke="var(--s)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: "drop-shadow(0 0 6px var(--s))" }}
              initial={{ pathLength: 0.18, pathOffset: 0 }}
              animate={{ pathOffset: [0, 1] }}
              transition={{ duration: 3.3, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </motion.div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {chips.map((c, i) => (
            <motion.span
              key={c.label}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${c.tone}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
            >
              {c.label}
            </motion.span>
          ))}
        </div>

        <motion.a
          href="#"
          className="mt-8 inline-block rounded-lg bg-(--p) px-6 py-3 text-sm font-semibold text-(--p-on)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Book for ₹1,499
        </motion.a>
      </div>
    </section>
  );
}
