"use client";

import { useEffect, useRef, useState } from "react";
import {
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
 * A whole one-page site for a cloud kitchen, warm and close to the food,
 * where every section moves its own way:
 *
 * - The hero builds a thali from above: the plate lands, bowls of dal,
 *   sabzi, curd, rice, pickle and a sweet spring onto it, rotis slide in,
 *   steam curls up, and the plate tilts towards the pointer.
 * - Prep is a knife at work: a carrot pushed under the blade, sliced into
 *   rounds that roll off the board.
 * - The delivery is a road the scroll rides: the scooter follows the bends
 *   from the kitchen to the door while the minutes count up.
 * - The menu spins each dish onto its plate.
 * - The stove sizzles: four pans on the flame, oil spitting.
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

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/* Hero: a thali, assembled from above.                                */
/* ------------------------------------------------------------------ */

const BOWLS = [
  { a: -90, fill: "#f2b632", inner: "#e39b17", name: "Dal" },
  { a: -30, fill: "#4d7c0f", inner: "#65a30d", name: "Sabzi" },
  { a: 30, fill: "#fafafa", inner: "#f4f4f5", name: "Curd" },
  { a: 90, fill: "#c2410c", inner: "#ea580c", name: "Pickle" },
  { a: 150, fill: "#a16207", inner: "#ca8a04", name: "Kheer" },
];

function Steam({
  clock,
  x,
  y,
  delay,
}: {
  clock: MotionValue<number>;
  x: number;
  y: number;
  delay: number;
}) {
  const off = useTransform(clock, (ms) => -((ms / 30 + delay * 40) % 80));
  const fade = useTransform(
    clock,
    (ms) => 0.25 + Math.sin(ms / 900 + delay) * 0.15,
  );
  return (
    <motion.path
      d={`M${x} ${y} c-8 -10 8 -16 0 -26 c-8 -10 8 -16 0 -26`}
      fill="none"
      stroke="#ffffff"
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray="20 20"
      style={{ strokeDashoffset: off, opacity: fade }}
    />
  );
}

function Thali() {
  const clock = useClock(2000);
  const reduce = useReducedMotion();
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rx = useSpring(tiltX, { stiffness: 60, damping: 14 });
  const ry = useSpring(tiltY, { stiffness: 60, damping: 14 });
  const turn = useTransform(clock, (ms) => (ms / 400) % 360);

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[34rem] [perspective:1200px]"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 22);
        tiltX.set(-((e.clientY - r.top) / r.height - 0.5) * 22);
      }}
      onPointerLeave={() => {
        tiltX.set(0);
        tiltY.set(0);
      }}
    >
      <motion.div className="size-full" style={{ rotateX: rx, rotateY: ry }}>
        <svg
          viewBox="0 0 400 400"
          className="block size-full overflow-visible"
          role="img"
          aria-label="A thali seen from above, with dal, sabzi, curd, pickle, kheer, rice and rotis."
        >
          <defs>
            <radialGradient id="thali-steel" cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="55%" stopColor="#e4e4e7" />
              <stop offset="100%" stopColor="#a1a1aa" />
            </radialGradient>
          </defs>
          {/* The plate drops onto the table. */}
          <motion.g
            initial={reduce ? false : { scale: 1.25, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{ transformOrigin: "200px 200px", transformBox: "view-box" }}
          >
            <circle cx="206" cy="212" r="178" fill="#18181b" opacity="0.1" />
            <circle cx="200" cy="200" r="178" fill="url(#thali-steel)" />
            <circle cx="200" cy="200" r="150" fill="#f4f4f5" stroke="#d4d4d8" />
          </motion.g>
          {/* The whole plate turns, slowly. */}
          <motion.g
            style={{
              rotate: turn,
              transformOrigin: "200px 200px",
              transformBox: "view-box",
            }}
          >
            {/* Rice in the middle. */}
            <motion.g
              initial={reduce ? false : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 1.6,
                type: "spring",
                stiffness: 160,
                damping: 12,
              }}
              style={{
                transformOrigin: "236px 236px",
                transformBox: "view-box",
              }}
            >
              <ellipse
                cx="236"
                cy="236"
                rx="56"
                ry="44"
                fill="#ffffff"
                stroke="#e4e4e7"
              />
              {Array.from({ length: 24 }).map((_, i) => (
                <ellipse
                  key={i}
                  cx={206 + ((i * 37) % 60)}
                  cy={214 + ((i * 23) % 44)}
                  rx="3.5"
                  ry="1.4"
                  fill="#e4e4e7"
                  transform={`rotate(${(i * 47) % 180} ${206 + ((i * 37) % 60)} ${214 + ((i * 23) % 44)})`}
                />
              ))}
            </motion.g>
            {/* Rotis, sliding in one after the other. */}
            {[0, 1, 2].map((k) => (
              <motion.g
                key={k}
                initial={reduce ? false : { x: -260, opacity: 0 }}
                animate={{ x: k * 6, opacity: 1 }}
                transition={{
                  delay: 1.9 + k * 0.18,
                  type: "spring",
                  stiffness: 120,
                  damping: 16,
                }}
              >
                <circle
                  cx="146"
                  cy={250 - k * 4}
                  r="44"
                  fill="#e7b877"
                  stroke="#c9944f"
                />
                <circle
                  cx={134}
                  cy={240 - k * 4}
                  r="5"
                  fill="#c9944f"
                  opacity="0.5"
                />
                <circle
                  cx={158}
                  cy={262 - k * 4}
                  r="4"
                  fill="#c9944f"
                  opacity="0.45"
                />
              </motion.g>
            ))}
            {/* Bowls around the rim. */}
            {BOWLS.map((b, i) => {
              const rad = (b.a * Math.PI) / 180;
              const cx = 200 + 112 * Math.cos(rad);
              const cy = 200 + 112 * Math.sin(rad);
              return (
                <motion.g
                  key={b.name}
                  initial={
                    reduce
                      ? false
                      : {
                          x: Math.cos(rad) * 260,
                          y: Math.sin(rad) * 260,
                          opacity: 0,
                        }
                  }
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.6 + i * 0.16,
                    type: "spring",
                    stiffness: 110,
                    damping: 13,
                  }}
                >
                  <circle
                    cx={cx + 3}
                    cy={cy + 4}
                    r="38"
                    fill="#18181b"
                    opacity="0.12"
                  />
                  <circle cx={cx} cy={cy} r="38" fill="url(#thali-steel)" />
                  <circle cx={cx} cy={cy} r="30" fill={b.fill} />
                  <circle
                    cx={cx - 8}
                    cy={cy - 6}
                    r="9"
                    fill={b.inner}
                    opacity="0.7"
                  />
                  <circle
                    cx={cx + 9}
                    cy={cy + 7}
                    r="6"
                    fill={b.inner}
                    opacity="0.6"
                  />
                </motion.g>
              );
            })}
          </motion.g>
          <Steam clock={clock} x={200} y={90} delay={0} />
          <Steam clock={clock} x={236} y={210} delay={1.3} />
          <Steam clock={clock} x={312} y={150} delay={2.1} />
        </svg>
      </motion.div>
    </div>
  );
}

function ThaliHero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute -top-40 -right-40 size-[40rem] rounded-full bg-(--t-light) blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-10 px-5 py-14 @4xl:grid-cols-[0.9fr_1.1fr]">
        <div>
          <motion.h1
            className="text-4xl leading-[1.05] font-semibold tracking-tight text-zinc-900 @3xl:text-6xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            Your thali starts cooking when you tap order.
          </motion.h1>
          <motion.p
            className="mt-5 max-w-[40ch] text-base leading-relaxed text-zinc-600 @3xl:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Home-style meals made fresh for every order, at your door in about
            half an hour.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <a
              href="#start"
              className="rounded-full bg-(--p) px-6 py-3 text-sm font-semibold text-(--p-on)"
            >
              Order now
            </a>
            <a
              href="#menu"
              className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:border-zinc-900"
            >
              See the menu
            </a>
          </motion.div>
        </div>
        <Thali />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Prep: a knife at work.                                              */
/* ------------------------------------------------------------------ */

const CHOP = 700; // ms per cut

function Slice({ clock, k }: { clock: MotionValue<number>; k: number }) {
  // Each round is cut, then rolls off down the board; eight in flight.
  const f = useTransform(clock, (ms) => ((((ms / CHOP - k) % 8) + 8) % 8) / 8);
  const x = useTransform(f, [0, 0.08, 1], [268, 300, 470]);
  const y = useTransform(f, [0, 0.08, 0.6, 1], [176, 186, 196, 196]);
  const rotate = useTransform(f, [0, 1], [0, 540]);
  const opacity = useTransform(f, [0, 0.03, 0.85, 1], [0, 1, 1, 0]);
  return (
    <motion.g style={{ x, y, opacity }}>
      <motion.g
        style={{ rotate, transformBox: "fill-box", transformOrigin: "center" }}
      >
        <ellipse rx="7" ry="14" fill="#f97316" />
        <ellipse rx="3" ry="7" fill="#fdba74" />
      </motion.g>
    </motion.g>
  );
}

function Prep() {
  const clock = useClock(350);
  // The blade drops fast and lifts slowly.
  const knife = useTransform(clock, (ms) => {
    const f = (ms % CHOP) / CHOP;
    return f < 0.25 ? -60 + (f / 0.25) * 60 : -((f - 0.25) / 0.75) * 60;
  });
  // The carrot inches under the blade, one round per cut.
  const push = useTransform(clock, (ms) => -((ms / CHOP) % 8) * 8);
  return (
    <section className="bg-zinc-50 py-20 @3xl:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 @4xl:grid-cols-2">
        <motion.div {...reveal}>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl">
            Chopped for your order, not this morning.
          </h2>
          <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-zinc-600">
            Vegetables come in at dawn and are cut only when an order needs
            them, so nothing sits.
          </p>
        </motion.div>
        <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-zinc-200">
          <svg
            viewBox="0 0 520 280"
            className="block h-auto w-full"
            role="img"
            aria-label="A knife slicing a carrot into rounds on a chopping board."
          >
            <rect
              x="30"
              y="200"
              width="460"
              height="34"
              rx="10"
              fill="#d6b07a"
            />
            <rect x="30" y="200" width="460" height="8" rx="4" fill="#e7c896" />
            {/* The carrot, pushed in towards the blade. */}
            <motion.g style={{ x: push }}>
              <path d="M60 176 L262 166 L262 206 L60 196 Z" fill="#f97316" />
              <path d="M60 176 L262 166" stroke="#ea580c" strokeWidth="2" />
              <path
                d="M40 186 l22 -12 M38 186 l24 0 M40 186 l22 12"
                stroke="#16a34a"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </motion.g>
            {Array.from({ length: 8 }).map((_, k) => (
              <Slice key={k} clock={clock} k={k} />
            ))}
            {/* The knife. */}
            <motion.g style={{ y: knife }}>
              <path
                d="M262 40 L292 40 L292 196 L262 196 Q252 120 262 40 Z"
                fill="#e4e4e7"
                stroke="#a1a1aa"
                strokeWidth="1.5"
              />
              <rect
                x="262"
                y="-60"
                width="30"
                height="104"
                rx="8"
                fill="#27272a"
              />
              <circle cx="277" cy="-30" r="3" fill="#a1a1aa" />
              <circle cx="277" cy="0" r="3" fill="#a1a1aa" />
            </motion.g>
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Delivery: the scroll rides the road.                                */
/* ------------------------------------------------------------------ */

const ROAD =
  "M40 330 C160 330 160 120 300 120 S440 330 580 330 S720 110 860 110 S1000 300 1120 280";
const STOPS = [
  { at: 0, min: 0, label: "Order placed" },
  { at: 0.22, min: 6, label: "On the stove" },
  { at: 0.5, min: 18, label: "Packed and sealed" },
  { at: 0.7, min: 21, label: "With the rider" },
  { at: 1, min: 28, label: "At your door" },
];

function Stop({
  progress,
  stop,
  x,
  y,
}: {
  progress: MotionValue<number>;
  stop: (typeof STOPS)[number];
  x: number;
  y: number;
}) {
  const on = useTransform(progress, [stop.at - 0.02, stop.at + 0.02], [0, 1]);
  const scale = useTransform(on, [0, 1], [0.6, 1]);
  const label = useTransform(on, [0, 1], [0.35, 1]);
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="12" fill="#ffffff" stroke="#d4d4d8" strokeWidth="2" />
      <motion.circle
        r="12"
        fill="var(--p)"
        style={{
          opacity: on,
          scale,
          transformBox: "fill-box",
          transformOrigin: "center",
        }}
      />
      <motion.text
        y="-24"
        textAnchor="middle"
        fontSize="16"
        fontWeight="600"
        fill="#18181b"
        style={{ opacity: label }}
      >
        {stop.label}
      </motion.text>
    </g>
  );
}

function Delivery() {
  const ref = useRef<HTMLDivElement>(null);
  const roadRef = useRef<SVGPathElement>(null);
  // Read by the transforms (a ref, so they always see the measured road)
  // and kept in state so the stops render once it is measured.
  const pointsRef = useRef<{ x: number; y: number; a: number }[]>([]);
  const [points, setPoints] = useState<{ x: number; y: number; a: number }[]>(
    [],
  );
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 26,
    mass: 0.4,
  });

  // Sample the road once, so the scooter can follow it without measuring
  // every frame.
  useEffect(() => {
    const path = roadRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    const n = 200;
    const pts = Array.from({ length: n + 1 }, (_, i) => {
      const a = path.getPointAtLength((i / n) * len);
      const b = path.getPointAtLength(Math.min(len, (i / n) * len + 1));
      return {
        x: a.x,
        y: a.y,
        a: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
      };
    });
    pointsRef.current = pts;
    setPoints(pts);
  }, []);

  const at = (v: number) => {
    const pts = pointsRef.current;
    if (pts.length === 0) return { x: 40, y: 330, a: 0 };
    return pts[Math.round(Math.min(1, Math.max(0, v)) * (pts.length - 1))];
  };
  const x = useTransform(p, (v) => at(v).x);
  const y = useTransform(p, (v) => at(v).y);
  const rotate = useTransform(p, (v) => at(v).a);
  const minutes = useTransform(
    p,
    (v) => `${Math.round(Math.min(1, Math.max(0, v)) * 28)}`,
  );
  const stopAt = (f: number) =>
    points[Math.round(Math.min(1, Math.max(0, f)) * (points.length - 1))];

  return (
    <section ref={ref} className="relative h-[280vh] bg-white">
      <div className="sticky top-16 flex h-[calc(100dvh-4rem)] flex-col justify-center overflow-hidden">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-6 px-5">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl">
            Kitchen to your door, about half an hour.
          </h2>
          <p className="text-zinc-900">
            <motion.span className="text-6xl font-semibold tracking-tight tabular-nums @3xl:text-7xl">
              {minutes}
            </motion.span>
            <span className="ml-2 text-lg text-zinc-500">min</span>
          </p>
        </div>
        <div className="mt-8 w-full overflow-hidden">
          <svg
            viewBox="0 0 1160 420"
            className="block h-auto w-full min-w-[46rem]"
            role="img"
            aria-label="A scooter riding a winding road from the kitchen to the door."
          >
            <path
              d={ROAD}
              fill="none"
              stroke="#e4e4e7"
              strokeWidth="40"
              strokeLinecap="round"
            />
            <path
              ref={roadRef}
              d={ROAD}
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeDasharray="16 14"
            />
            <motion.path
              d={ROAD}
              fill="none"
              stroke="var(--p)"
              strokeWidth="6"
              strokeLinecap="round"
              style={{ pathLength: p }}
            />
            {/* The kitchen at the start, the home at the end. */}
            <g transform="translate(40 330)">
              <rect
                x="-34"
                y="18"
                width="68"
                height="50"
                rx="6"
                fill="#18181b"
              />
              <text
                y="50"
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="#ffffff"
              >
                Kitchen
              </text>
            </g>
            <g transform="translate(1120 280)">
              <rect
                x="-30"
                y="18"
                width="60"
                height="44"
                rx="4"
                fill="var(--s-light)"
                stroke="var(--s)"
                strokeWidth="2"
              />
              <path d="M-38 22 L0 -6 L38 22" fill="var(--s)" />
              <rect
                x="-8"
                y="38"
                width="16"
                height="24"
                rx="2"
                fill="var(--s)"
              />
            </g>
            {points.length > 0 &&
              STOPS.map((s) => {
                const q = stopAt(s.at);
                return (
                  <Stop key={s.label} progress={p} stop={s} x={q.x} y={q.y} />
                );
              })}
            {/* The scooter, from the side, leaning into the road. */}
            <motion.g style={{ x, y }}>
              <motion.g
                style={{
                  rotate,
                  transformBox: "fill-box",
                  transformOrigin: "center",
                }}
              >
                <rect
                  x="-32"
                  y="-44"
                  width="64"
                  height="60"
                  fill="transparent"
                />
                <g transform="translate(0 -18)">
                  <circle cx="-20" cy="14" r="10" fill="#27272a" />
                  <circle cx="20" cy="14" r="10" fill="#27272a" />
                  <circle cx="-20" cy="14" r="4" fill="#a1a1aa" />
                  <circle cx="20" cy="14" r="4" fill="#a1a1aa" />
                  <path
                    d="M-26 6 H14 L24 -8"
                    stroke="var(--s)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <rect
                    x="-30"
                    y="-24"
                    width="22"
                    height="20"
                    rx="3"
                    fill="var(--p)"
                  />
                  <circle cx="2" cy="-22" r="9" fill="var(--s-dark)" />
                </g>
              </motion.g>
            </motion.g>
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The menu: each dish spins onto its plate.                           */
/* ------------------------------------------------------------------ */

const DISHES = [
  {
    name: "Veg thali",
    price: 189,
    colours: ["#f2b632", "#4d7c0f", "#e7b877", "#ffffff"],
  },
  {
    name: "Chicken biryani",
    price: 249,
    colours: ["#ea580c", "#facc15", "#ffffff", "#a16207"],
  },
  {
    name: "Millet bowl",
    price: 219,
    colours: ["#65a30d", "#d6b07a", "#dc2626", "#fde68a"],
  },
  {
    name: "Paneer tikka",
    price: 229,
    colours: ["#ea580c", "#fafafa", "#16a34a", "#f97316"],
  },
];

function Menu() {
  return (
    <section id="menu" className="bg-zinc-50 py-20 @3xl:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <motion.h2
          {...reveal}
          className="max-w-2xl text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
        >
          On the stove today.
        </motion.h2>
        <ul className="mt-12 grid gap-6 @2xl:grid-cols-2 @4xl:grid-cols-4">
          {DISHES.map((d, i) => (
            <li
              key={d.name}
              className="rounded-3xl bg-white p-6 text-center ring-1 ring-zinc-200"
            >
              <motion.svg
                viewBox="0 0 200 200"
                className="mx-auto block size-40"
                initial={{ rotate: -120, scale: 0.6, opacity: 0 }}
                whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
                whileHover={{ rotate: 25, scale: 1.05 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  delay: i * 0.12,
                  type: "spring",
                  stiffness: 90,
                  damping: 14,
                }}
              >
                <circle
                  cx="104"
                  cy="106"
                  r="92"
                  fill="#18181b"
                  opacity="0.08"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="92"
                  fill="#ffffff"
                  stroke="#e4e4e7"
                  strokeWidth="3"
                />
                <circle cx="100" cy="100" r="72" fill="#fafafa" />
                {d.colours.map((c, k) => {
                  const a = (k / d.colours.length) * Math.PI * 2;
                  return (
                    <circle
                      key={k}
                      cx={100 + 34 * Math.cos(a)}
                      cy={100 + 34 * Math.sin(a)}
                      r="24"
                      fill={c}
                      stroke="#e4e4e7"
                    />
                  );
                })}
                <circle cx="100" cy="100" r="14" fill="#16a34a" opacity="0.7" />
              </motion.svg>
              <p className="mt-4 text-lg font-semibold text-zinc-900">
                {d.name}
              </p>
              <p className="text-sm text-zinc-500">₹{d.price}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The stove, sizzling.                                                */
/* ------------------------------------------------------------------ */

function Pan({
  clock,
  x,
  y,
  seed,
}: {
  clock: MotionValue<number>;
  x: number;
  y: number;
  seed: number;
}) {
  const flame = useTransform(
    clock,
    (ms) => 0.85 + Math.sin(ms / 80 + seed) * 0.15,
  );
  const toss = useTransform(clock, (ms) => {
    const f = ((ms + seed * 700) % 2600) / 2600;
    return f < 0.12 ? Math.sin((f / 0.12) * Math.PI) * -10 : 0;
  });
  return (
    <g>
      <motion.circle
        cx={x}
        cy={y}
        r="58"
        fill="none"
        stroke="#f97316"
        strokeWidth="8"
        strokeDasharray="6 5"
        opacity="0.85"
        style={{
          scale: flame,
          transformBox: "fill-box",
          transformOrigin: "center",
        }}
      />
      <circle
        cx={x}
        cy={y}
        r="48"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="3"
        opacity="0.6"
      />
      <motion.g style={{ y: toss }}>
        <rect
          x={x + 44}
          y={y - 6}
          width="62"
          height="12"
          rx="6"
          fill="#27272a"
        />
        <circle cx={x} cy={y} r="46" fill="#3f3f46" />
        <circle cx={x} cy={y} r="38" fill="#52525b" />
        {Array.from({ length: 7 }).map((_, k) => (
          <Sizzle key={k} clock={clock} x={x} y={y} k={k + seed * 7} />
        ))}
      </motion.g>
    </g>
  );
}

function Sizzle({
  clock,
  x,
  y,
  k,
}: {
  clock: MotionValue<number>;
  x: number;
  y: number;
  k: number;
}) {
  const f = useTransform(clock, (ms) => ((ms + k * 311) % 900) / 900);
  const a = (k * 137.5 * Math.PI) / 180;
  const cx = useTransform(
    f,
    [0, 1],
    [x + Math.cos(a) * 12, x + Math.cos(a) * 34],
  );
  const cy = useTransform(
    f,
    [0, 1],
    [y + Math.sin(a) * 12, y + Math.sin(a) * 34],
  );
  const opacity = useTransform(f, [0, 0.2, 1], [0, 0.9, 0]);
  const colour = ["#f59e0b", "#16a34a", "#dc2626", "#fde68a"][k % 4];
  return <motion.circle r="4" fill={colour} style={{ cx, cy, opacity }} />;
}

function Stove() {
  const clock = useClock(500);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [cooking, setCooking] = useState(14);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView || reduce) return;
    const id = window.setInterval(
      () => setCooking((c) => (c >= 19 ? 12 : c + 1)),
      2200,
    );
    return () => window.clearInterval(id);
  }, [inView, reduce]);
  return (
    <section className="bg-zinc-950 py-20 @3xl:py-28">
      <div
        ref={ref}
        className="mx-auto grid max-w-6xl items-center gap-12 px-5 @4xl:grid-cols-[0.8fr_1.2fr]"
      >
        <motion.div {...reveal}>
          <h2 className="text-3xl font-semibold tracking-tight text-white @3xl:text-5xl">
            Cooking right now.
          </h2>
          <p className="mt-4 max-w-[40ch] text-base leading-relaxed text-zinc-400">
            Every pan on our stove is someone&apos;s order. Nothing is kept
            warm, nothing is cooked ahead.
          </p>
          <p className="mt-8 text-7xl font-semibold tracking-tight text-white tabular-nums">
            {cooking}
          </p>
          <p className="text-sm text-zinc-400">orders on the flame</p>
        </motion.div>
        <svg
          viewBox="0 0 520 380"
          className="block h-auto w-full"
          role="img"
          aria-label="Four pans sizzling on a stove, seen from above."
        >
          <rect x="10" y="10" width="500" height="360" rx="24" fill="#27272a" />
          <Pan clock={clock} x={140} y={110} seed={0} />
          <Pan clock={clock} x={340} y={110} seed={1} />
          <Pan clock={clock} x={140} y={270} seed={2} />
          <Pan clock={clock} x={340} y={270} seed={3} />
        </svg>
      </div>
    </section>
  );
}

export function KitchenTasteSite() {
  return (
    <div className="@container bg-white">
      <SiteNav
        brand="Tava Kitchen"
        mark="T"
        links={[
          { label: "Menu", href: "#menu" },
          { label: "Order", href: "#start" },
        ]}
        cta="Order now"
      />
      <ThaliHero />
      <Prep />
      <Delivery />
      <Menu />
      <Stove />
      <SiteSections
        content={{
          servicesTitle: "Home-style food, cooked the moment you order.",
          services: [
            {
              name: "Thalis",
              text: "Dal, two sabzis, rice, rotis and a sweet, changing every day of the week.",
            },
            {
              name: "Biryani",
              text: "Dum-cooked in small batches, never reheated.",
            },
            {
              name: "Office lunches",
              text: "Twenty to two hundred boxes, on time, every weekday.",
            },
            {
              name: "Healthy bowls",
              text: "Millets, greens and protein, counted for you.",
            },
            {
              name: "Party orders",
              text: "Trays for twenty, with servers if you want them.",
            },
          ],
          numbers: [
            { value: "2,300+", label: "Orders a week" },
            { value: "28 min", label: "Average to your door" },
            { value: "4.6", label: "Rating on delivery apps" },
            { value: "0", label: "Food kept overnight" },
          ],
          reviewsTitle: "What our regulars say.",
          reviews: [
            {
              quote:
                "It tastes like it was made at home, because it was made ten minutes ago.",
              who: "Regular, Kondapur",
            },
            {
              quote:
                "Our team's lunch has come at 12:45 every day for a year. Not once late.",
              who: "Office manager, Hitech City",
            },
            {
              quote:
                "The seal on the bag is a small thing, but it is why I trust them.",
              who: "Customer, Manikonda",
            },
          ],
          faqTitle: "Before you order.",
          faqs: [
            {
              q: "Where do you deliver?",
              a: "Within six kilometres of the kitchen, through the delivery apps and our own riders.",
            },
            {
              q: "Can you make it less spicy?",
              a: "Yes. Add a note and the chef sees it on the ticket, printed in red.",
            },
            {
              q: "Do you take bulk orders?",
              a: "Yes, with a day's notice for office lunches and two days for parties.",
            },
          ],
          closing: {
            title: "Hungry? It starts cooking when you tap.",
            text: "Order on the apps or straight from us, and it is at your door in about half an hour.",
            cta: "Order now",
          },
          footer: {
            brand: "Tava Kitchen",
            about: "A delivery-only kitchen cooking home-style meals to order.",
            address: ["Shop 4, Botanical Garden Road", "Hyderabad 500084"],
            contact: ["order@tavakitchen.in", "Open 11am to 11pm"],
          },
        }}
      />
    </div>
  );
}
