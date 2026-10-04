"use client";

import { useEffect, useId } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

const line =
  "M0 130 C30 125 45 110 70 112 S110 128 135 100 S175 70 200 82 S240 96 265 60 S305 40 330 48 S366 30 390 18";
const area = `${line} L390 160 L0 160 Z`;

/**
 * A portfolio card: the line draws, the area fills in beneath it, and the
 * balance counts up to its value. The card tilts towards the pointer.
 */
export function FintechLiveChart() {
  // Unique per instance, so two charts on a page do not share a gradient.
  const gradient = `area-${useId().replace(/[^\w-]/g, "")}`;
  const balance = useMotionValue(0);
  const shown = useTransform(
    balance,
    (v) => `₹${Math.round(v).toLocaleString("en-IN")}`,
  );

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 150, damping: 18 });
  const rotateY = useSpring(tiltY, { stiffness: 150, damping: 18 });

  useEffect(() => {
    const controls = animate(balance, 1248630, {
      delay: 0.5,
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [balance]);

  return (
    <section className="@container overflow-hidden bg-zinc-50">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 @3xl:grid-cols-2 @3xl:py-20">
        <div>
          <motion.h1
            className="text-4xl leading-[1.05] font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Your money, growing where you can see it
          </motion.h1>
          <motion.p
            className="mt-5 max-w-[44ch] text-base leading-relaxed text-zinc-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Mutual funds, stocks and fixed deposits in one place, with zero
            commission on direct plans and tax reports ready in March.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <motion.a
              href="#"
              className="rounded-lg bg-(--p) px-5 py-3 text-sm font-semibold text-(--p-on)"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Open a free account
            </motion.a>
            <span className="self-center text-xs text-zinc-500">
              Investments are subject to market risk.
            </span>
          </motion.div>
        </div>

        <div className="[perspective:1000px]">
          <motion.div
            className="rounded-2xl bg-white p-5 shadow-xl ring-1 ring-zinc-200 @3xl:p-6"
            style={{ rotateX, rotateY }}
            onPointerMove={(e) => {
              const box = e.currentTarget.getBoundingClientRect();
              const px = (e.clientX - box.left) / box.width - 0.5;
              const py = (e.clientY - box.top) / box.height - 0.5;
              tiltX.set(-py * 10);
              tiltY.set(px * 10);
            }}
            onPointerLeave={() => {
              tiltX.set(0);
              tiltY.set(0);
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-zinc-500">Portfolio value</p>
                <motion.p className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 tabular-nums">
                  {shown}
                </motion.p>
              </div>
              <motion.span
                className="rounded-full bg-(--s-light) px-2.5 py-1 text-xs font-semibold text-(--s-dark)"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.2, type: "spring" }}
              >
                ▲ 14.2% this year
              </motion.span>
            </div>

            <svg viewBox="0 0 400 160" className="mt-6 w-full" aria-hidden>
              <defs>
                <linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--p)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--p)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[40, 80, 120].map((y) => (
                <line
                  key={y}
                  x1="0"
                  x2="400"
                  y1={y}
                  y2={y}
                  stroke="#e4e4e7"
                  strokeDasharray="3 5"
                />
              ))}
              <motion.path
                d={area}
                fill={`url(#${gradient})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.8 }}
              />
              <motion.path
                d={line}
                fill="none"
                stroke="var(--p)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.3, duration: 1.8, ease: "easeInOut" }}
              />
              <motion.circle
                cx="390"
                cy="18"
                r="5"
                fill="var(--p)"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.8, 1] }}
                transition={{
                  delay: 2.1,
                  duration: 1.6,
                  repeat: Infinity,
                }}
              />
            </svg>

            <div className="mt-4 flex gap-1 text-xs font-medium">
              {["1M", "6M", "1Y", "5Y"].map((r) => (
                <span
                  key={r}
                  className={`rounded-md px-2.5 py-1 ${r === "1Y" ? "bg-zinc-900 text-white" : "text-zinc-500"}`}
                >
                  {r}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
