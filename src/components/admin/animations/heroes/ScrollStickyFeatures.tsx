"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";

const features = [
  {
    title: "Real cashback, every payment",
    text: "Flat 1.5% back on UPI, credited the same day. Upgrade for up to 5%.",
    stat: "₹1,284",
    label: "earned this month",
  },
  {
    title: "Pay one third, now",
    text: "Split any payment into three with no-cost EMI and zero interest.",
    stat: "3 × ₹1,999",
    label: "no interest",
  },
  {
    title: "Lifetime free",
    text: "No joining fee, no annual fee, no hidden charges. Just yours, forever.",
    stat: "₹0",
    label: "annual fee",
  },
  {
    title: "Rewards that add up",
    text: "Coins on every spend, swapped for vouchers from 200 brands.",
    stat: "8,450",
    label: "coins to spend",
  },
];

// Toy shapes that pop in around the phone for each feature.
const toys = [
  ["bg-amber-300", "bg-(--s)", "bg-(--p)"],
  ["bg-(--t)", "bg-(--p)", "bg-amber-300"],
  ["bg-(--s)", "bg-(--t)", "bg-(--p)"],
  ["bg-(--p)", "bg-amber-300", "bg-(--s)"],
];
const spots = [
  "-top-6 -left-8 size-14",
  "top-1/3 -right-10 size-10",
  "-bottom-4 left-4 size-12",
];

/**
 * A pinned phone beside a column of features. As each feature scrolls past
 * the middle of the screen, the phone's screen changes to match and a fresh
 * set of toy shapes springs in around it.
 *
 * The phone column is sticky, so this needs no ancestor with `overflow:
 * hidden` (which stops sticky from sticking); `overflow: clip` is fine. On a
 * narrow screen the phone pins to the top half and the features scroll
 * underneath it.
 */
export function ScrollStickyFeatures() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(features.length - 1, Math.floor(v * features.length));
    if (next !== active) setActive(next);
  });
  const f = features[active];

  return (
    <section
      ref={ref}
      className="@container relative bg-gradient-to-b from-white to-(--p-light)"
    >
      <div className="mx-auto grid max-w-6xl px-5 @3xl:grid-cols-2 @3xl:gap-12">
        {/* The pinned phone. */}
        <div className="sticky top-0 z-10 flex h-[55vh] items-center justify-center bg-white/70 backdrop-blur @3xl:h-screen @3xl:bg-transparent @3xl:backdrop-blur-none">
          <div className="relative">
            <AnimatePresence>
              {spots.map((spot, i) => (
                <motion.span
                  key={`${active}-${i}`}
                  className={`absolute rounded-2xl shadow-lg ${spot} ${toys[active][i]} ${i === 1 ? "rounded-full" : ""}`}
                  initial={{ scale: 0, rotate: -40, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1, y: [0, -8, 0] }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    scale: {
                      type: "spring",
                      stiffness: 400,
                      damping: 14,
                      delay: i * 0.06,
                    },
                    rotate: { type: "spring", stiffness: 300, damping: 16 },
                    y: {
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.3,
                    },
                  }}
                  aria-hidden
                />
              ))}
            </AnimatePresence>
            <div className="relative h-[44vh] max-h-[30rem] w-[min(15rem,54vw)] overflow-hidden rounded-[2.4rem] border-[10px] border-zinc-900 bg-white shadow-2xl @3xl:h-[70vh]">
              <div className="mx-auto mt-2 h-5 w-20 rounded-full bg-zinc-900" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="flex h-[80%] flex-col items-center justify-center px-4 text-center"
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -24, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="grid size-16 place-items-center rounded-2xl bg-(--s-light) text-2xl font-bold text-(--s-dark)">
                    {active + 1}
                  </span>
                  <p className="mt-5 text-2xl font-semibold tracking-tight text-zinc-900">
                    {f.stat}
                  </p>
                  <p className="text-xs text-zinc-500">{f.label}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* The features, each a screen tall, scrolling past. */}
        <ol>
          {features.map((feature, i) => (
            <li
              key={feature.title}
              className="flex min-h-[70vh] items-center @3xl:min-h-screen"
            >
              <motion.div
                animate={{
                  opacity: i === active ? 1 : 0.25,
                  x: i === active ? 0 : 12,
                }}
                transition={{ duration: 0.4 }}
              >
                <p className="font-mono text-sm text-(--p-dark)">0{i + 1}</p>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-4xl">
                  {feature.title}
                </h3>
                <p className="mt-3 max-w-[38ch] text-lg leading-relaxed text-zinc-600">
                  {feature.text}
                </p>
              </motion.div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
