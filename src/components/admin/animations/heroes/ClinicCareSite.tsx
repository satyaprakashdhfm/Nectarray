"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTime,
  useTransform,
  type MotionValue,
} from "motion/react";
import { SiteNav, SiteSections, reveal } from "./SiteParts";

/**
 * A whole one-page site for a family clinic, in a calm register where
 * every section moves differently:
 *
 * - The hero breathes: soft colour that swells and settles, a live
 *   heartbeat running across a glass card, and small notes floating by.
 *   The colour drifts towards the pointer.
 * - The visit is a dial: scrolling sweeps the hand round registration,
 *   vitals, the doctor, the lab and the pharmacy, minute by minute.
 * - The lab fills its tubes, spins the centrifuge and draws the report.
 * - Booking books itself: the pointer picks a free slot and it confirms.
 * - The pharmacy fills a week's pill box, dose by dose.
 *
 * Built with Motion only. Colours come from the palette variables.
 * Shares SiteParts (nav, services, reviews, questions, footer), which Copy
 * TSX includes below this file.
 */

function useClock(still = 0) {
  const reduce = useReducedMotion();
  const time = useTime();
  return useTransform(time, (ms) => (reduce ? still : ms));
}

/* ------------------------------------------------------------------ */
/* Hero: breathing colour and a live heartbeat.                        */
/* ------------------------------------------------------------------ */

const BEAT = "h30 l6 -4 l5 4 h10 l4 -26 l6 50 l5 -32 l5 8 h16 l7 -8 l8 8 h22";

function Heartbeat({ clock }: { clock: MotionValue<number> }) {
  // Two copies of the trace side by side, sliding left one copy a second.
  const x = useTransform(clock, (ms) => -((ms / 1000) % 1) * 124);
  const bpm = useTransform(
    clock,
    (ms) => 70 + Math.round(Math.sin(ms / 2300) * 3),
  );
  return (
    <div className="rounded-3xl bg-white/80 p-5 shadow-[0_30px_60px_-30px_rgba(24,24,27,0.25)] ring-1 ring-white backdrop-blur">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold text-zinc-700">Heart rate</p>
        <p className="text-3xl font-semibold tracking-tight text-zinc-900 tabular-nums">
          <motion.span>{bpm}</motion.span>
          <span className="ml-1 text-sm font-medium text-zinc-500">bpm</span>
        </p>
      </div>
      <svg
        viewBox="0 0 248 70"
        className="mt-3 block h-auto w-full overflow-hidden"
      >
        <path d="M0 35 H248" stroke="#f4f4f5" strokeWidth="1" />
        <motion.g style={{ x }}>
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M${i * 124} 40 ${BEAT}`}
              fill="none"
              stroke="var(--p)"
              strokeWidth="2.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
        </motion.g>
      </svg>
      <p className="mt-2 text-xs text-zinc-500">
        Resting. Within the normal range.
      </p>
    </div>
  );
}

function CareHero() {
  const clock = useClock(1500);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 40, damping: 18 });
  const sy = useSpring(py, { stiffness: 40, damping: 18 });
  // Breathing: four seconds in, four out.
  const breath = useTransform(
    clock,
    (ms) => 1 + Math.sin((ms / 8000) * Math.PI * 2) * 0.08,
  );
  const breathB = useTransform(
    clock,
    (ms) => 1 + Math.cos((ms / 9000) * Math.PI * 2) * 0.1,
  );
  const float = useTransform(clock, (ms) => Math.sin(ms / 1400) * 6);
  const floatB = useTransform(clock, (ms) => Math.cos(ms / 1700) * 7);

  return (
    <section
      className="relative overflow-hidden bg-white"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width - 0.5) * 60);
        py.set(((e.clientY - r.top) / r.height - 0.5) * 60);
      }}
    >
      <motion.div
        className="pointer-events-none absolute top-[8%] right-[-10%] size-[34rem] rounded-full bg-(--p-light) blur-3xl"
        style={{ x: sx, y: sy, scale: breath }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute right-[18%] bottom-[-20%] size-[26rem] rounded-full bg-(--s-light) opacity-80 blur-3xl"
        style={{ x: sy, y: sx, scale: breathB }}
        aria-hidden
      />
      <div className="relative mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-12 px-5 py-16 @4xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.h1
            className="text-4xl leading-[1.05] font-semibold tracking-tight text-zinc-900 @3xl:text-6xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Care that takes its time with you.
          </motion.h1>
          <motion.p
            className="mt-5 max-w-[42ch] text-base leading-relaxed text-zinc-600 @3xl:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            A family clinic with its own lab and pharmacy, and doctors who know
            your history.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <a
              href="#book"
              className="rounded-full bg-(--p) px-6 py-3 text-sm font-semibold text-(--p-on)"
            >
              Book a visit
            </a>
            <a
              href="#services"
              className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:border-zinc-900"
            >
              Our services
            </a>
          </motion.div>
        </div>
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <Heartbeat clock={clock} />
          </motion.div>
          <motion.div
            className="absolute -top-8 -left-4 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-zinc-200 @3xl:-left-10"
            style={{ y: float }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-xs text-zinc-500">Next free slot</p>
            <p className="text-sm font-semibold text-zinc-900">
              Today, 4:30 pm
            </p>
          </motion.div>
          <motion.div
            className="absolute -right-2 -bottom-10 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-zinc-200"
            style={{ y: floatB }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <span className="grid size-6 place-items-center rounded-full bg-green-600">
              <svg viewBox="0 0 12 12" className="size-3.5" aria-hidden>
                <path
                  d="M2.5 6.2 L5 8.5 L9.5 3.8"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="text-sm font-semibold text-zinc-900">
              Blood report ready
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The visit, as a dial the scroll turns.                              */
/* ------------------------------------------------------------------ */

const STAGES = [
  {
    name: "Registration",
    mins: 2,
    text: "Token on WhatsApp, history on screen.",
  },
  {
    name: "Vitals",
    mins: 5,
    text: "Blood pressure, pulse, oxygen and weight.",
  },
  {
    name: "Doctor",
    mins: 15,
    text: "An unhurried consultation, prescription on your phone.",
  },
  {
    name: "Lab",
    mins: 6,
    text: "Samples taken here, run on our own analyser.",
  },
  {
    name: "Pharmacy",
    mins: 4,
    text: "Medicines handed over, every dose explained.",
  },
];
const TOTAL = STAGES.reduce((a, s) => a + s.mins, 0);
/* Where each stage starts on the dial, as a fraction of the visit. */
const BOUNDS = STAGES.reduce<number[]>(
  (acc, s) => [...acc, (acc[acc.length - 1] ?? 0) + s.mins / TOTAL],
  [0],
);
const R = 150;

function arc(a0: number, a1: number, r: number) {
  const p = (a: number) => [200 + r * Math.sin(a), 200 - r * Math.cos(a)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `M${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1} ${y1}`;
}

function StageArc({
  progress,
  start,
  end,
  i,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  i: number;
}) {
  const a0 = start * Math.PI * 2 + 0.03;
  const a1 = end * Math.PI * 2 - 0.03;
  const fill = useTransform(progress, [start, end], [0, 1]);
  const mid = (a0 + a1) / 2;
  const lit = useTransform(progress, [start, start + 0.02], [0.35, 1]);
  return (
    <g>
      <path
        d={arc(a0, a1, R)}
        fill="none"
        stroke="#f4f4f5"
        strokeWidth="26"
        strokeLinecap="round"
      />
      <motion.path
        d={arc(a0, a1, R)}
        fill="none"
        stroke={i % 2 ? "var(--p-dark)" : "var(--p)"}
        strokeWidth="26"
        strokeLinecap="round"
        style={{ pathLength: fill }}
      />
      <motion.text
        x={200 + (R + 40) * Math.sin(mid)}
        y={204 - (R + 40) * Math.cos(mid)}
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#3f3f46"
        style={{ opacity: lit }}
      >
        {STAGES[i].name}
      </motion.text>
    </g>
  );
}

function VisitDial() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 26,
    mass: 0.4,
  });
  const hand = useTransform(p, [0, 1], [0, 360]);
  const minutes = useTransform(p, (v) => `${Math.round(v * TOTAL)} min`);
  const [stage, setStage] = useState(0);
  useEffect(
    () =>
      p.on("change", (v) => {
        const i = BOUNDS.findIndex((b, k) => k > 0 && v < b - 0.0001);
        setStage(i === -1 ? STAGES.length - 1 : i - 1);
      }),
    [p],
  );

  return (
    <section ref={ref} className="relative h-[300vh] bg-zinc-50">
      <div className="sticky top-16 flex h-[calc(100dvh-4rem)] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-5 @4xl:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl">
              Your whole visit, in about half an hour.
            </h2>
            <AnimatePresence mode="wait">
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <p className="text-sm font-semibold text-(--p-dark)">
                  {stage + 1}. {STAGES[stage].name}, about {STAGES[stage].mins}{" "}
                  min
                </p>
                <p className="mt-2 max-w-[38ch] text-lg leading-relaxed text-zinc-700">
                  {STAGES[stage].text}
                </p>
              </motion.div>
            </AnimatePresence>
            <p className="mt-8 text-sm text-zinc-500">
              Scroll to move through the visit.
            </p>
          </div>
          <div className="mx-auto w-full max-w-[26rem]">
            <svg
              viewBox="0 0 400 400"
              className="block h-auto w-full overflow-visible"
              role="img"
              aria-label="A dial of the visit: registration, vitals, doctor, lab and pharmacy."
            >
              {STAGES.map((s, i) => (
                <StageArc
                  key={s.name}
                  progress={p}
                  start={BOUNDS[i]}
                  end={BOUNDS[i + 1]}
                  i={i}
                />
              ))}
              <circle cx="200" cy="200" r="104" fill="#ffffff" />
              <motion.g
                style={{
                  rotate: hand,
                  transformOrigin: "200px 200px",
                  transformBox: "view-box",
                }}
              >
                <path
                  d="M200 200 V64"
                  stroke="#18181b"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="200" cy="64" r="7" fill="#18181b" />
              </motion.g>
              <circle cx="200" cy="200" r="10" fill="#18181b" />
              <motion.text
                x="200"
                y="250"
                textAnchor="middle"
                fontSize="26"
                fontWeight="700"
                fill="#18181b"
              >
                {minutes}
              </motion.text>
              <text
                x="200"
                y="272"
                textAnchor="middle"
                fontSize="12"
                fill="#71717a"
              >
                since you walked in
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The lab: tubes fill, the centrifuge spins, the report draws.        */
/* ------------------------------------------------------------------ */

const TUBES = [
  { level: 0.72, colour: "#dc2626" },
  { level: 0.55, colour: "#f59e0b" },
  { level: 0.84, colour: "var(--p)" },
  { level: 0.63, colour: "#a855f7" },
  { level: 0.47, colour: "var(--s)" },
];
const RESULTS = [
  { name: "Haemoglobin", value: 0.68 },
  { name: "Blood sugar", value: 0.52 },
  { name: "Cholesterol", value: 0.6 },
  { name: "Thyroid", value: 0.45 },
];

function Lab() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const clock = useClock();
  const spin = useTransform(clock, (ms) => (ms / 3) % 360);
  return (
    <section className="bg-white py-20 @3xl:py-28">
      <div ref={ref} className="mx-auto max-w-6xl px-5">
        <motion.h2
          {...reveal}
          className="max-w-2xl text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
        >
          Tests in the same building, reports the same day.
        </motion.h2>
        <div className="mt-12 grid gap-6 @4xl:grid-cols-3">
          {/* Tubes in a rack. */}
          <div className="rounded-3xl bg-zinc-50 p-6 ring-1 ring-zinc-200">
            <p className="text-sm font-semibold text-zinc-700">Samples</p>
            <svg viewBox="0 0 260 200" className="mt-4 block h-auto w-full">
              <rect
                x="10"
                y="120"
                width="240"
                height="22"
                rx="6"
                fill="#d4d4d8"
              />
              {TUBES.map((tb, i) => {
                const x = 30 + i * 46;
                return (
                  <g key={i}>
                    <rect
                      x={x - 11}
                      y="30"
                      width="22"
                      height="130"
                      rx="11"
                      fill="#ffffff"
                      stroke="#a1a1aa"
                      strokeWidth="1.5"
                    />
                    <motion.rect
                      x={x - 9}
                      width="18"
                      rx="9"
                      fill={tb.colour}
                      opacity="0.8"
                      initial={{ y: 158, height: 0 }}
                      animate={
                        inView
                          ? { y: 158 - 126 * tb.level, height: 126 * tb.level }
                          : undefined
                      }
                      transition={{
                        duration: 1.4,
                        delay: 0.2 + i * 0.18,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                    <rect
                      x={x - 12}
                      y="24"
                      width="24"
                      height="12"
                      rx="3"
                      fill={i % 2 ? "var(--p-dark)" : "var(--p)"}
                    />
                  </g>
                );
              })}
            </svg>
          </div>
          {/* The centrifuge, from above. */}
          <div className="rounded-3xl bg-zinc-50 p-6 ring-1 ring-zinc-200">
            <p className="text-sm font-semibold text-zinc-700">Centrifuge</p>
            <svg viewBox="0 0 260 200" className="mt-4 block h-auto w-full">
              <circle cx="130" cy="100" r="86" fill="#e4e4e7" />
              <circle
                cx="130"
                cy="100"
                r="74"
                fill="#f4f4f5"
                stroke="#d4d4d8"
              />
              <motion.g
                style={{
                  rotate: spin,
                  transformOrigin: "130px 100px",
                  transformBox: "view-box",
                }}
              >
                {Array.from({ length: 8 }).map((_, i) => {
                  const a = (i / 8) * Math.PI * 2;
                  return (
                    <g key={i}>
                      <circle
                        cx={130 + 52 * Math.sin(a)}
                        cy={100 - 52 * Math.cos(a)}
                        r="11"
                        fill="#ffffff"
                        stroke="#a1a1aa"
                      />
                      <circle
                        cx={130 + 52 * Math.sin(a)}
                        cy={100 - 52 * Math.cos(a)}
                        r="6"
                        fill={TUBES[i % TUBES.length].colour}
                        opacity="0.8"
                      />
                    </g>
                  );
                })}
                <circle cx="130" cy="100" r="14" fill="#71717a" />
              </motion.g>
            </svg>
          </div>
          {/* The report. */}
          <div className="rounded-3xl bg-zinc-50 p-6 ring-1 ring-zinc-200">
            <p className="text-sm font-semibold text-zinc-700">Your report</p>
            <ul className="mt-5 space-y-4">
              {RESULTS.map((r, i) => (
                <li key={r.name}>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-700">{r.name}</span>
                    <motion.span
                      className="font-semibold text-green-700"
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : undefined}
                      transition={{ delay: 1.6 + i * 0.2 }}
                    >
                      Normal
                    </motion.span>
                  </div>
                  <div className="relative mt-1.5 h-2 rounded-full bg-zinc-200">
                    <span className="absolute inset-y-0 left-[30%] w-[45%] rounded-full bg-green-100" />
                    <motion.span
                      className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-600 ring-2 ring-white"
                      initial={{ left: "0%" }}
                      animate={
                        inView ? { left: `${r.value * 100}%` } : undefined
                      }
                      transition={{
                        delay: 1.2 + i * 0.2,
                        type: "spring",
                        stiffness: 120,
                        damping: 14,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Booking, booking itself.                                            */
/* ------------------------------------------------------------------ */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIMES = ["10:00", "11:30", "1:00", "3:00", "4:30", "6:00"];
const TAKEN = new Set([
  "0-0",
  "0-3",
  "1-1",
  "2-0",
  "2-4",
  "3-2",
  "4-0",
  "4-5",
  "5-1",
  "5-3",
  "1-4",
]);
const PICKS = ["3-4", "1-2", "4-3"];

function Booking() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<"move" | "picked" | "booked">("move");
  const pick = PICKS[round % PICKS.length];
  const [day, slot] = pick.split("-").map(Number);

  useEffect(() => {
    if (!inView || reduce) return;
    const timers = [
      window.setTimeout(() => setPhase("picked"), 1300),
      window.setTimeout(() => setPhase("booked"), 2000),
      window.setTimeout(() => {
        setPhase("move");
        setRound((r) => r + 1);
      }, 5200),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [inView, reduce, round]);

  return (
    <section id="book" className="bg-(--p-light) py-20 @3xl:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 @4xl:grid-cols-[0.8fr_1.2fr]">
        <motion.div {...reveal}>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl">
            Pick a time. That is it.
          </h2>
          <p className="mt-4 max-w-[40ch] text-base leading-relaxed text-zinc-600">
            Free slots for the week, a reminder the evening before, and your
            token when you arrive.
          </p>
        </motion.div>
        <div
          ref={ref}
          className="relative rounded-3xl bg-white p-4 shadow-xl ring-1 ring-zinc-200 @3xl:p-6"
        >
          <div className="grid grid-cols-6 gap-2 text-center text-xs font-semibold text-zinc-500">
            {DAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="relative mt-3 grid grid-cols-6 gap-2">
            {TIMES.map((tm, s) =>
              DAYS.map((d, dIdx) => {
                const id = `${dIdx}-${s}`;
                const taken = TAKEN.has(id);
                const chosen = id === pick && phase !== "move";
                return (
                  <div key={id} className="relative">
                    <span
                      className={`block rounded-lg py-2 text-center text-[11px] font-semibold transition-colors duration-300 @3xl:text-xs ${
                        taken
                          ? "bg-zinc-100 text-zinc-300 line-through"
                          : chosen
                            ? "bg-(--p) text-(--p-on)"
                            : "bg-white text-zinc-700 ring-1 ring-zinc-200"
                      }`}
                    >
                      {tm}
                    </span>
                    {chosen && phase === "picked" && (
                      <motion.span
                        className="absolute inset-0 rounded-lg ring-4 ring-(--p)"
                        initial={{ opacity: 0.8, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.35 }}
                        transition={{ duration: 0.6 }}
                      />
                    )}
                  </div>
                );
              }),
            )}
            {/* The pointer, travelling to the chosen slot. */}
            {!reduce && (
              <motion.svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute size-6 drop-shadow"
                initial={false}
                animate={{
                  left: `${((day + 0.55) / 6) * 100}%`,
                  top: `${((slot + 0.45) / 6) * 100}%`,
                  scale: phase === "picked" ? 0.85 : 1,
                }}
                transition={{ type: "spring", stiffness: 70, damping: 16 }}
              >
                <path
                  d="M4 3 L19 12 L12 13.5 L9 20 Z"
                  fill="#18181b"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </motion.svg>
            )}
          </div>
          <AnimatePresence>
            {phase === "booked" && (
              <motion.div
                key={round}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute inset-x-4 -bottom-6 flex items-center gap-3 rounded-2xl bg-zinc-900 px-4 py-3 text-white shadow-lg @3xl:inset-x-auto @3xl:right-6"
              >
                <span className="grid size-6 place-items-center rounded-full bg-green-500">
                  <svg viewBox="0 0 12 12" className="size-3.5" aria-hidden>
                    <path
                      d="M2.5 6.2 L5 8.5 L9.5 3.8"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span className="text-sm font-semibold">
                  Booked for {DAYS[day]}, {TIMES[slot]}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The pharmacy fills a week's pill box.                               */
/* ------------------------------------------------------------------ */

const WEEK = ["M", "T", "W", "T", "F", "S", "S"];

function PillBox() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const id = window.setInterval(() => setCycle((c) => c + 1), 5600);
    return () => window.clearInterval(id);
  }, [inView, reduce]);

  return (
    <section className="bg-white py-20 @3xl:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 @4xl:grid-cols-2">
        <div ref={ref} className="order-2 @4xl:order-1">
          <div className="relative grid grid-cols-7 gap-2 rounded-3xl bg-zinc-100 p-3 pt-24 ring-1 ring-zinc-200">
            {WEEK.map((d, i) => (
              <div
                key={i}
                className="relative flex h-24 flex-col items-center justify-end rounded-xl bg-white pb-2 ring-1 ring-zinc-200"
              >
                {[0, 1].map((k) => (
                  <motion.span
                    key={`${cycle}-${k}`}
                    className={`absolute h-3 w-6 rounded-full ${k ? "bg-(--s)" : "bg-(--p)"}`}
                    style={{ bottom: 30 + k * 16, rotate: k ? 18 : -14 }}
                    initial={reduce ? false : { y: -150, opacity: 0 }}
                    animate={inView ? { y: 0, opacity: 1 } : undefined}
                    transition={{
                      delay: i * 0.28 + k * 0.14,
                      type: "spring",
                      stiffness: 260,
                      damping: 13,
                    }}
                  />
                ))}
                <span className="text-xs font-semibold text-zinc-500">{d}</span>
              </div>
            ))}
            <p className="absolute top-4 left-4 text-sm font-semibold text-zinc-700">
              Morning and night, every day this week
            </p>
          </div>
        </div>
        <motion.div {...reveal} className="order-1 @4xl:order-2">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl">
            Medicines, sorted by the day.
          </h2>
          <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-zinc-600">
            Our pharmacist fills a weekly box for older patients and explains
            every dose before you leave.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function ClinicCareSite() {
  return (
    <div className="@container bg-white">
      <SiteNav
        brand="Arogya Clinic"
        mark="A"
        links={[
          { label: "Services", href: "#services" },
          { label: "Book", href: "#book" },
        ]}
        cta="Book a visit"
      />
      <CareHero />
      <VisitDial />
      <Lab />
      <Booking />
      <PillBox />
      <SiteSections
        content={{
          servicesTitle: "Care for the whole family, close to home.",
          services: [
            {
              name: "General consultation",
              text: "Fevers, aches, check-ups and everything between, with a doctor who knows your history.",
            },
            {
              name: "Lab tests",
              text: "Blood, urine and thyroid panels, most reported the same day.",
            },
            {
              name: "Pharmacy",
              text: "Prescriptions filled on the spot, doses explained.",
            },
            {
              name: "Child care",
              text: "Vaccinations and growth checks on a schedule we keep.",
            },
            {
              name: "Home visits",
              text: "A doctor or nurse at your door for the elderly.",
            },
          ],
          numbers: [
            { value: "38,000+", label: "Patients seen" },
            { value: "32 min", label: "Average visit, door to door" },
            { value: "Same day", label: "Most lab reports" },
            { value: "7 days", label: "Open every week" },
          ],
          reviewsTitle: "What our patients say.",
          reviews: [
            {
              quote:
                "Token on my phone, tests downstairs, medicines at the counter. Forty minutes, door to door.",
              who: "Patient, Madhapur",
            },
            {
              quote:
                "The doctor actually listened, and called the next day to ask how I was.",
              who: "Patient, Gachibowli",
            },
            {
              quote:
                "They fill my mother's pill box every Sunday. She has not missed a dose since.",
              who: "Family of a patient, Kukatpally",
            },
          ],
          faqTitle: "Before your visit.",
          faqs: [
            {
              q: "Do I need an appointment?",
              a: "Walk-ins are welcome. Booking ahead gets you a time slot and a shorter wait.",
            },
            {
              q: "When will my lab report be ready?",
              a: "Most routine tests are ready the same evening, on WhatsApp and in print.",
            },
            {
              q: "Do you accept health insurance?",
              a: "Yes, for consultations and tests under most cashless plans. Bring your card and an ID.",
            },
          ],
          closing: {
            title: "See a doctor today.",
            text: "Book a slot in a few taps, or simply walk in.",
            cta: "Book a visit",
          },
          footer: {
            brand: "Arogya Clinic",
            about: "A family clinic with its own lab and pharmacy.",
            address: ["Plot 21, Hitech City Road", "Hyderabad 500081"],
            contact: ["care@arogyaclinic.in", "Open 8am to 9pm, all week"],
          },
        }}
      />
    </div>
  );
}
