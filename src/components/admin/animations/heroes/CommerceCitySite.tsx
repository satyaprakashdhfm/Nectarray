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
 * A whole one-page site for a same-day e-commerce delivery service, where
 * every section moves in its own way:
 *
 * - The hero is the city from above, alive: orders pop up over homes, vans
 *   drive the roads from the hub, and homes tick Delivered as they pass.
 * - Orders from every channel stream into one live feed.
 * - A conveyor carries boxes under the scanner and sorts them down chutes
 *   by area.
 * - A pinned phone tracks one parcel: scrolling drives the van along the
 *   route while the steps light up and the time to arrival counts down.
 * - The delivery area lights up pincode by pincode, out from the hub.
 *
 * Built with Motion only. Colours come from the palette variables.
 * Shares SiteParts (nav, services, reviews, questions, footer), which Copy
 * TSX includes below this file.
 */

type P = [number, number];

/** Walks a closed loop of points: where you are after d units, and facing. */
function along(points: P[], d: number) {
  const segs = points.map((p, i) => {
    const q = points[(i + 1) % points.length];
    return { p, q, len: Math.hypot(q[0] - p[0], q[1] - p[1]) };
  });
  const total = segs.reduce((a, s) => a + s.len, 0);
  let left = ((d % total) + total) % total;
  for (const s of segs) {
    if (left <= s.len) {
      const f = left / s.len;
      return {
        x: s.p[0] + (s.q[0] - s.p[0]) * f,
        y: s.p[1] + (s.q[1] - s.p[1]) * f,
        a: (Math.atan2(s.q[1] - s.p[1], s.q[0] - s.p[0]) * 180) / Math.PI,
      };
    }
    left -= s.len;
  }
  return { x: points[0][0], y: points[0][1], a: 0 };
}

/* ------------------------------------------------------------------ */
/* The city.                                                           */
/* ------------------------------------------------------------------ */

const ROADS_H = [150, 350, 550];
const ROADS_V = [200, 450, 700, 950];

/* Van routes, as loops along the roads (a lane to the left of centre). */
const ROUTES: { pts: P[]; speed: number; offset: number }[] = [
  {
    pts: [
      [200, 150],
      [700, 150],
      [700, 350],
      [200, 350],
    ],
    speed: 0.07,
    offset: 0,
  },
  {
    pts: [
      [450, 350],
      [950, 350],
      [950, 550],
      [450, 550],
    ],
    speed: 0.06,
    offset: 300,
  },
  {
    pts: [
      [200, 150],
      [950, 150],
      [950, 550],
      [200, 550],
    ],
    speed: 0.05,
    offset: 900,
  },
  {
    pts: [
      [700, 350],
      [950, 350],
      [950, 150],
      [700, 150],
    ],
    speed: 0.08,
    offset: 120,
  },
];

/* Homes, inside the blocks between roads. */
const HOMES: P[] = [];
for (const [x0, x1] of [
  [40, 180],
  [220, 430],
  [470, 680],
  [720, 930],
]) {
  for (const [y0, y1] of [
    [20, 130],
    [170, 330],
    [370, 530],
    [570, 690],
  ]) {
    for (let x = x0 + 24; x < x1 - 10; x += 52) {
      for (let y = y0 + 24; y < y1 - 10; y += 48) HOMES.push([x, y]);
    }
  }
}

const ROOFS = ["var(--p-light)", "#e4e4e7", "var(--s-light)", "#f4f4f5"];

function Van({
  clock,
  route,
}: {
  clock: MotionValue<number>;
  route: (typeof ROUTES)[number];
}) {
  const pos = useTransform(clock, (ms) =>
    along(route.pts, ms * route.speed + route.offset),
  );
  const x = useTransform(pos, (p) => p.x);
  const y = useTransform(pos, (p) => p.y);
  const rotate = useTransform(pos, (p) => p.a);
  return (
    <motion.g style={{ x, y }}>
      <motion.g
        style={{ rotate, transformBox: "fill-box", transformOrigin: "center" }}
      >
        <rect x="-18" y="-11" width="36" height="22" fill="transparent" />
        <g transform="translate(0 -7)">
          <rect
            x="-15"
            y="-7"
            width="30"
            height="14"
            rx="3"
            fill="#ffffff"
            stroke="#a1a1aa"
          />
          <rect
            x="-13"
            y="-5"
            width="18"
            height="10"
            rx="1.5"
            fill="var(--p)"
          />
          <rect x="8" y="-6" width="6" height="12" rx="2" fill="#94a3b8" />
        </g>
      </motion.g>
    </motion.g>
  );
}

/** A home: a roof, and every few seconds an order pin, then a delivered tick. */
function Home({
  clock,
  at,
  i,
}: {
  clock: MotionValue<number>;
  at: P;
  i: number;
}) {
  const phase = (i * 1373) % 9000;
  const cycle = useTransform(clock, (ms) => ((ms + phase) % 9000) / 9000);
  const pin = useTransform(cycle, [0, 0.05, 0.3, 0.36], [0, 1, 1, 0]);
  const pinY = useTransform(cycle, [0, 0.06], [6, 0]);
  const tick = useTransform(cycle, [0.55, 0.6, 0.85, 0.9], [0, 1, 1, 0]);
  const active = i % 3 !== 1; // not every home orders
  const [x, y] = at;
  return (
    <g>
      <rect
        x={x - 14}
        y={y - 12}
        width="28"
        height="24"
        rx="3"
        fill={ROOFS[i % ROOFS.length]}
        stroke="#d4d4d8"
      />
      <path d={`M${x - 14} ${y} H${x + 14}`} stroke="#d4d4d8" />
      {active && (
        <>
          <motion.g style={{ opacity: pin, y: pinY }}>
            <path
              d={`M${x} ${y - 4} c-7 -9 -9 -12 -9 -16 a9 9 0 0 1 18 0 c0 4 -2 7 -9 16 z`}
              fill="var(--s)"
            />
            <text
              x={x}
              y={y - 17}
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="#ffffff"
            >
              ₹
            </text>
          </motion.g>
          <motion.g style={{ opacity: tick }}>
            <circle
              cx={x + 10}
              cy={y - 10}
              r="8"
              fill="#16a34a"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <path
              d={`M${x + 6.5} ${y - 10} l2.4 2.4 l4.4 -4.6`}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </motion.g>
        </>
      )}
    </g>
  );
}

function CityHero() {
  const reduce = useReducedMotion();
  const time = useTime();
  const clock = useTransform(time, (ms) => (reduce ? 4000 : ms));
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 20 });
  const sy = useSpring(py, { stiffness: 60, damping: 20 });
  const hubPulse = useTransform(clock, (ms) => 1 + ((ms / 1800) % 1) * 1.4);
  const hubFade = useTransform(clock, (ms) => 0.6 - ((ms / 1800) % 1) * 0.6);

  return (
    <section
      className="relative h-[calc(100dvh-4rem)] min-h-[34rem] overflow-hidden bg-[#fafafa]"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width - 0.5) * -24);
        py.set(((e.clientY - r.top) / r.height - 0.5) * -24);
      }}
    >
      <motion.svg
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
        style={{ x: sx, y: sy, scale: 1.06 }}
        role="img"
        aria-label="A city from above: orders appear over homes and delivery vans drive the roads from the hub."
      >
        <rect x="-200" y="-200" width="1600" height="1100" fill="#fafafa" />
        {/* Roads, with their centre lines. */}
        {ROADS_H.map((y) => (
          <g key={`h${y}`}>
            <rect x="-200" y={y - 17} width="1600" height="34" fill="#e4e4e7" />
            <path
              d={`M-200 ${y} H1400`}
              stroke="#ffffff"
              strokeWidth="2"
              strokeDasharray="14 12"
            />
          </g>
        ))}
        {ROADS_V.map((x) => (
          <g key={`v${x}`}>
            <rect x={x - 17} y="-200" width="34" height="1100" fill="#e4e4e7" />
            <path
              d={`M${x} -200 V900`}
              stroke="#ffffff"
              strokeWidth="2"
              strokeDasharray="14 12"
            />
          </g>
        ))}
        {/* The hub, with its loading bays. */}
        <rect
          x="985"
          y="380"
          width="200"
          height="140"
          rx="10"
          fill="#ffffff"
          stroke="#d4d4d8"
          strokeWidth="2"
        />
        <rect x="985" y="380" width="200" height="34" rx="10" fill="var(--p)" />
        <text
          x="1085"
          y="402"
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill="var(--p-on)"
        >
          HUB
        </text>
        {[0, 1, 2, 3].map((b) => (
          <rect
            key={b}
            x="985"
            y={426 + b * 22}
            width="14"
            height="16"
            rx="2"
            fill="#a1a1aa"
          />
        ))}
        <motion.circle
          cx="1085"
          cy="460"
          r="40"
          fill="none"
          stroke="var(--p)"
          strokeWidth="2"
          style={{
            scale: hubPulse,
            opacity: hubFade,
            transformBox: "fill-box",
            transformOrigin: "center",
          }}
        />
        {HOMES.map((h, i) => (
          <Home key={i} clock={clock} at={h} i={i} />
        ))}
        {ROUTES.map((r, i) => (
          <Van key={i} clock={clock} route={r} />
        ))}
      </motion.svg>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[68%] bg-gradient-to-b from-[#fafafa] via-[#fafafa]/90 to-transparent @4xl:hidden" />
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[58%] bg-gradient-to-r from-[#fafafa] via-[#fafafa]/90 to-transparent @4xl:block" />
      <div className="relative mx-auto flex h-full max-w-6xl items-start px-5 pt-[9vh] @4xl:items-center @4xl:pt-0">
        <div className="max-w-xl">
          <motion.h1
            className="text-4xl leading-[1.05] font-semibold tracking-tight text-zinc-900 @3xl:text-6xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Ordered at noon. At their door by evening.
          </motion.h1>
          <motion.p
            className="mt-5 max-w-[42ch] text-base leading-relaxed text-zinc-600 @3xl:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            Same-day delivery for online stores, across the city, from one hub.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <a
              href="#start"
              className="rounded-full bg-(--p) px-6 py-3 text-sm font-semibold whitespace-nowrap text-(--p-on)"
            >
              Start shipping
            </a>
            <a
              href="#track"
              className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold whitespace-nowrap text-zinc-900 hover:border-zinc-900"
            >
              Track a parcel
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Orders from every channel, into one feed.                           */
/* ------------------------------------------------------------------ */

const CHANNELS = [
  { name: "Website", tone: "bg-(--p) text-(--p-on)" },
  { name: "Amazon", tone: "bg-zinc-900 text-white" },
  { name: "Flipkart", tone: "bg-(--s) text-white" },
  { name: "Instagram", tone: "bg-(--t) text-white" },
];
const ITEMS = [
  ["Cotton kurta, M", "Kondapur", 1290],
  ["Steel bottle, 1 l", "Madhapur", 549],
  ["Face serum", "Banjara Hills", 799],
  ["Running shoes, 9", "Gachibowli", 2499],
  ["Bedsheet set", "Kukatpally", 1150],
  ["Phone cover", "Ameerpet", 299],
  ["Saree, silk blend", "Jubilee Hills", 3400],
  ["Desk lamp", "Manikonda", 899],
] as const;

type Order = { id: number; channel: number; item: number };

function OrderFeed() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const [orders, setOrders] = useState<Order[]>(() =>
    [0, 1, 2, 3].map((i) => ({ id: i, channel: i % 4, item: i })),
  );
  const [count, setCount] = useState(1284);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = window.setInterval(() => {
      setOrders((list) => {
        const next = (list[0]?.id ?? 0) + 1;
        return [
          {
            id: next,
            channel: (next * 3) % 4,
            item: (next * 5) % ITEMS.length,
          },
          ...list,
        ].slice(0, 5);
      });
      setCount((c) => c + 1);
    }, 1500);
    return () => window.clearInterval(id);
  }, [inView, reduce]);

  return (
    <section className="bg-white py-20 @3xl:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 @4xl:grid-cols-2">
        <motion.div {...reveal}>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl">
            Every channel, one queue.
          </h2>
          <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-zinc-600">
            Your website and every marketplace feed the same queue, and stock
            updates everywhere the moment one sells.
          </p>
          <p className="mt-8 text-sm text-zinc-500">Orders handled today</p>
          <p className="text-5xl font-semibold tracking-tight text-zinc-900 tabular-nums">
            {count.toLocaleString("en-IN")}
          </p>
        </motion.div>
        <div
          ref={ref}
          className="rounded-3xl bg-zinc-50 p-3 ring-1 ring-zinc-200 @3xl:p-4"
        >
          <div className="flex items-center justify-between px-2 pb-3 text-xs font-semibold text-zinc-500">
            <span>Live orders</span>
            <span className="flex items-center gap-1.5 text-green-700">
              <motion.span
                className="size-2 rounded-full bg-green-600"
                animate={reduce ? undefined : { opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              Receiving
            </span>
          </div>
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {orders.map((o) => {
                const [item, area, price] = ITEMS[o.item];
                const ch = CHANNELS[o.channel];
                return (
                  <motion.li
                    key={o.id}
                    layout
                    initial={{ opacity: 0, y: -16, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-zinc-200"
                  >
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${ch.tone}`}
                    >
                      {ch.name}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-zinc-900">
                        {item}
                      </span>
                      <span className="block text-xs text-zinc-500">
                        To {area}
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-zinc-900 tabular-nums">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The conveyor: scanned and sorted by area.                           */
/* ------------------------------------------------------------------ */

const LANES = [
  { name: "West", colour: "var(--p)", y: 250 },
  { name: "Central", colour: "var(--s)", y: 320 },
  { name: "East", colour: "var(--t)", y: 390 },
];
const BOXES = 7;
const LOOP = 8400; // ms for one box to ride the whole way

function SortBox({ clock, i }: { clock: MotionValue<number>; i: number }) {
  const lane = LANES[i % LANES.length];
  const f = useTransform(
    clock,
    (ms) => ((ms + (i * LOOP) / BOXES) % LOOP) / LOOP,
  );
  // Along the belt to x 640, then down its chute to the bin.
  const x = useTransform(f, [0, 0.62, 1], [-40, 640, 900]);
  const y = useTransform(f, [0, 0.62, 1], [150, 150, lane.y]);
  const opacity = useTransform(f, [0, 0.03, 0.95, 1], [0, 1, 1, 0]);
  const scanned = useTransform(f, [0.36, 0.4], [0, 1]);
  return (
    <motion.g style={{ x, y, opacity }}>
      <rect
        x="-22"
        y="-36"
        width="44"
        height="36"
        rx="4"
        fill="#d6b07a"
        stroke="#b08a55"
      />
      <path d="M-22 -24 H22" stroke="#b08a55" />
      <motion.rect
        x="-10"
        y="-16"
        width="20"
        height="10"
        rx="2"
        fill={lane.colour}
        style={{ opacity: scanned }}
      />
    </motion.g>
  );
}

function Conveyor() {
  const reduce = useReducedMotion();
  const time = useTime();
  const clock = useTransform(time, (ms) => (reduce ? 2000 : ms));
  const roller = useTransform(clock, (ms) => (ms / 4) % 360);
  // The scanner flashes as each box passes under it.
  const beam = useTransform(clock, (ms) => {
    const period = LOOP / BOXES;
    const f = ((((ms - 700) % period) + period) % period) / period;
    return f < 0.2 ? 0.9 : 0.15;
  });

  return (
    <section className="bg-zinc-50 py-20 @3xl:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <motion.h2
          {...reveal}
          className="max-w-2xl text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
        >
          Scanned, sorted, on the right van.
        </motion.h2>
        <motion.p
          {...reveal}
          className="mt-4 max-w-[52ch] text-base leading-relaxed text-zinc-600"
        >
          Every parcel is weighed and scanned on the belt, then sorted down the
          chute for its part of the city.
        </motion.p>
        <div className="mt-10 overflow-hidden rounded-3xl bg-white ring-1 ring-zinc-200">
          <svg
            viewBox="0 0 1000 440"
            className="block h-auto w-full"
            role="img"
            aria-label="Parcels on a conveyor pass a scanner and slide down chutes sorted by area."
          >
            {/* Chutes to the bins. */}
            {LANES.map((l) => (
              <g key={l.name}>
                <path
                  d={`M640 160 L900 ${l.y + 10}`}
                  stroke="#e4e4e7"
                  strokeWidth="46"
                  strokeLinecap="round"
                />
                <rect
                  x="900"
                  y={l.y - 30}
                  width="90"
                  height="56"
                  rx="8"
                  fill="#ffffff"
                  stroke={l.colour}
                  strokeWidth="2"
                />
                <text
                  x="945"
                  y={l.y + 4}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="600"
                  fill="#3f3f46"
                >
                  {l.name}
                </text>
              </g>
            ))}
            {/* The belt and its rollers. */}
            <rect
              x="-10"
              y="150"
              width="660"
              height="18"
              rx="9"
              fill="#3f3f46"
            />
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.g
                key={i}
                style={{
                  rotate: roller,
                  transformBox: "fill-box",
                  transformOrigin: "center",
                }}
              >
                <circle cx={20 + i * 46} cy="159" r="7" fill="#71717a" />
                <path
                  d={`M${13 + i * 46} 159 H${27 + i * 46}`}
                  stroke="#3f3f46"
                  strokeWidth="2"
                />
              </motion.g>
            ))}
            <rect x="30" y="168" width="10" height="70" fill="#d4d4d8" />
            <rect x="600" y="168" width="10" height="70" fill="#d4d4d8" />
            {/* The scanner arch, its beam flashing on each parcel. */}
            <rect x="330" y="60" width="16" height="96" rx="3" fill="#52525b" />
            <rect x="430" y="60" width="16" height="96" rx="3" fill="#52525b" />
            <rect
              x="330"
              y="52"
              width="116"
              height="20"
              rx="5"
              fill="#27272a"
            />
            <motion.rect
              x="346"
              y="72"
              width="84"
              height="78"
              fill="#22c55e"
              style={{ opacity: beam }}
            />
            <text
              x="388"
              y="44"
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill="#71717a"
            >
              Weigh and scan
            </text>
            {Array.from({ length: BOXES }).map((_, i) => (
              <SortBox key={i} clock={clock} i={i} />
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Tracking: the scroll drives the van to the door.                    */
/* ------------------------------------------------------------------ */

const ROUTE: P[] = [
  [40, 380],
  [40, 300],
  [120, 300],
  [120, 200],
  [60, 200],
  [60, 110],
  [160, 110],
  [160, 40],
];
const STEPS = [
  { at: 0.0, label: "Packed at the hub", time: "12:10" },
  { at: 0.25, label: "Out for delivery", time: "15:40" },
  { at: 0.6, label: "Two stops away", time: "17:55" },
  { at: 0.92, label: "Delivered, photo taken", time: "18:20" },
];
const routeLength = ROUTE.slice(1).reduce(
  (a, p, i) => a + Math.hypot(p[0] - ROUTE[i][0], p[1] - ROUTE[i][1]),
  0,
);
const routePath = ROUTE.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(
  " ",
);

function pointOnRoute(f: number) {
  let left = f * routeLength;
  for (let i = 1; i < ROUTE.length; i++) {
    const [a, b] = [ROUTE[i - 1], ROUTE[i]];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (left <= len) {
      const k = left / len;
      return {
        x: a[0] + (b[0] - a[0]) * k,
        y: a[1] + (b[1] - a[1]) * k,
        a: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI,
      };
    }
    left -= len;
  }
  const last = ROUTE[ROUTE.length - 1];
  return { x: last[0], y: last[1], a: -90 };
}

function TrackStep({
  progress,
  step,
}: {
  progress: MotionValue<number>;
  step: (typeof STEPS)[number];
}) {
  const done = useTransform(progress, [step.at, step.at + 0.04], [0, 1]);
  const text = useTransform(done, [0, 1], [0.4, 1]);
  return (
    <li className="flex items-center gap-4">
      <span className="relative grid size-7 shrink-0 place-items-center rounded-full border-2 border-zinc-300 bg-white">
        <motion.span
          className="absolute inset-[-2px] rounded-full bg-(--p)"
          style={{ scale: done, opacity: done }}
        />
      </span>
      <motion.span style={{ opacity: text }}>
        <span className="block text-base font-semibold text-zinc-900">
          {step.label}
        </span>
        <span className="block text-sm text-zinc-500 tabular-nums">
          {step.time}
        </span>
      </motion.span>
    </li>
  );
}

function Tracking() {
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
  const pos = useTransform(p, (v) => pointOnRoute(Math.min(1, v * 1.05)));
  const vx = useTransform(pos, (q) => q.x);
  const vy = useTransform(pos, (q) => q.y);
  const va = useTransform(pos, (q) => q.a);
  const drawn = useTransform(p, (v) => Math.min(1, v * 1.05));
  const eta = useTransform(p, (v) => {
    const mins = Math.max(0, Math.round(140 * (1 - Math.min(1, v * 1.05))));
    return mins === 0
      ? "Delivered"
      : `Arriving in ${Math.floor(mins / 60) ? `${Math.floor(mins / 60)} h ` : ""}${mins % 60} min`;
  });
  const home = useTransform(p, [0.9, 0.97], [0, 1]);

  return (
    <section id="track" ref={ref} className="relative h-[260vh] bg-white">
      <div className="sticky top-16 flex h-[calc(100dvh-4rem)] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 @4xl:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl">
              Your customer watches it come.
            </h2>
            <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-zinc-600">
              A live link on WhatsApp, a call before the door, and a photo when
              it is handed over.
            </p>
            <ol className="mt-8 space-y-5">
              {STEPS.map((s) => (
                <TrackStep key={s.label} progress={p} step={s} />
              ))}
            </ol>
          </div>
          <div className="mx-auto w-[min(19rem,78vw)] rounded-[2.6rem] border-[10px] border-zinc-900 bg-white shadow-2xl">
            <div className="mx-auto mt-2 h-5 w-24 rounded-full bg-zinc-900" />
            <div className="px-4 pt-3">
              <p className="text-xs font-semibold text-zinc-500">
                Order #48213
              </p>
              <motion.p className="text-lg font-semibold text-zinc-900 tabular-nums">
                {eta}
              </motion.p>
            </div>
            <svg
              viewBox="0 0 200 420"
              className="mt-2 block h-auto w-full rounded-b-[2rem] bg-zinc-50"
            >
              {[60, 140, 220, 300, 380].map((y) => (
                <path
                  key={y}
                  d={`M0 ${y} H200`}
                  stroke="#e4e4e7"
                  strokeWidth="14"
                />
              ))}
              {[40, 120, 160].map((x) => (
                <path
                  key={x}
                  d={`M${x} 0 V420`}
                  stroke="#e4e4e7"
                  strokeWidth="14"
                />
              ))}
              <path
                d={routePath}
                fill="none"
                stroke="#d4d4d8"
                strokeWidth="4"
                strokeDasharray="6 6"
                strokeLinejoin="round"
              />
              <motion.path
                d={routePath}
                fill="none"
                stroke="var(--p)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ pathLength: drawn }}
              />
              <circle cx="40" cy="380" r="7" fill="var(--p-dark)" />
              <g transform="translate(160 40)">
                <motion.circle
                  r="16"
                  fill="#16a34a"
                  opacity="0.18"
                  style={{
                    scale: home,
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }}
                />
                <rect
                  x="-9"
                  y="-6"
                  width="18"
                  height="14"
                  rx="2"
                  fill="var(--s)"
                />
                <path d="M-11 -5 L0 -14 L11 -5" fill="var(--s)" />
              </g>
              <motion.g style={{ x: vx, y: vy }}>
                <motion.g
                  style={{
                    rotate: va,
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }}
                >
                  <rect
                    x="-13"
                    y="-8"
                    width="26"
                    height="16"
                    fill="transparent"
                  />
                  <rect
                    x="-11"
                    y="-6"
                    width="22"
                    height="12"
                    rx="2.5"
                    fill="#ffffff"
                    stroke="#3f3f46"
                    strokeWidth="1.2"
                  />
                  <rect
                    x="-9"
                    y="-4"
                    width="12"
                    height="8"
                    rx="1"
                    fill="var(--p)"
                  />
                </motion.g>
              </motion.g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Coverage: pincodes light up from the hub outwards.                  */
/* ------------------------------------------------------------------ */

function Coverage() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();
  const cols = 22;
  const rows = 12;
  const hub = [14, 6];
  const cells = Array.from({ length: cols * rows }, (_, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const d = Math.hypot(c - hub[0], (r - hub[1]) * 1.15);
    // A rough city outline: the far corners are outside it.
    const inside = Math.hypot((c - 11) / 11, (r - 5.5) / 6.4) < 1.02;
    return { i, c, r, d, inside };
  });
  return (
    <section className="bg-white py-20 @3xl:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 @4xl:grid-cols-[0.8fr_1.2fr]">
        <motion.div {...reveal}>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl">
            Same day, across 140 pincodes.
          </h2>
          <p className="mt-4 max-w-[40ch] text-base leading-relaxed text-zinc-600">
            Order before 2pm anywhere in the shaded city and it is delivered the
            same evening.
          </p>
        </motion.div>
        <div
          ref={ref}
          className="rounded-3xl bg-zinc-50 p-4 ring-1 ring-zinc-200 @3xl:p-6"
        >
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {cells.map((cell) =>
              cell.inside ? (
                <motion.span
                  key={cell.i}
                  className={`aspect-square rounded-[4px] ${
                    cell.c === hub[0] && cell.r === hub[1]
                      ? "bg-(--p-dark)"
                      : "bg-(--p)"
                  }`}
                  initial={reduce ? false : { opacity: 0.12, scale: 0.6 }}
                  animate={
                    inView
                      ? { opacity: cell.d < 9 ? 1 : 0.45, scale: 1 }
                      : undefined
                  }
                  transition={{
                    delay: cell.d * 0.07,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                />
              ) : (
                <span key={cell.i} className="aspect-square" />
              ),
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-600">
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-[3px] bg-(--p)" /> Same day
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-[3px] bg-(--p) opacity-45" /> Next
              morning
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-[3px] bg-(--p-dark)" /> Hub
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CommerceCitySite() {
  return (
    <div className="@container bg-white">
      <SiteNav
        brand="Shipkart"
        mark="S"
        links={[
          { label: "How it works", href: "#track" },
          { label: "Services", href: "#services" },
        ]}
        cta="Start shipping"
      />
      <CityHero />
      <OrderFeed />
      <Conveyor />
      <Tracking />
      <Coverage />
      <SiteSections
        content={{
          servicesTitle: "Everything after the customer clicks buy.",
          services: [
            {
              name: "Same-day delivery",
              text: "Order by 2pm, at the door by evening, with a photo at handover.",
            },
            {
              name: "Storage",
              text: "Your stock racked at our hub, counted and ready.",
            },
            {
              name: "Cash on delivery",
              text: "Collected at the door, in your account in two days.",
            },
            {
              name: "Returns pickup",
              text: "Picked up from the customer, checked and restocked.",
            },
            {
              name: "Marketplace links",
              text: "Website, Amazon, Flipkart and Instagram in one queue.",
            },
          ],
          numbers: [
            { value: "18,400", label: "Parcels a week" },
            { value: "140", label: "Pincodes, same day" },
            { value: "96%", label: "Delivered on the first try" },
            { value: "2 days", label: "Cash on delivery settled" },
          ],
          reviewsTitle: "Stores that ship with us.",
          reviews: [
            {
              quote:
                "Our customers started expecting same-day, and now we can promise it.",
              who: "Founder, apparel brand",
            },
            {
              quote:
                "The tracking link cut our where-is-my-order calls to almost nothing.",
              who: "Support lead, home goods store",
            },
            {
              quote:
                "COD money lands in two days, not two weeks. That changed our cash flow.",
              who: "Owner, electronics accessories",
            },
          ],
          faqTitle: "Before your first pickup.",
          faqs: [
            {
              q: "What is the cut-off for same-day?",
              a: "2pm at the hub. Orders after that go out first thing the next morning.",
            },
            {
              q: "Do you pick up from my warehouse?",
              a: "Yes, daily at a fixed time, or keep your stock with us and skip pickups.",
            },
            {
              q: "What if the customer is not home?",
              a: "We call, try again the same evening, and the next day, before it returns.",
            },
          ],
          closing: {
            title: "Ship your first hundred orders with us.",
            text: "We will connect your store and run the first pickup this week.",
            cta: "Start shipping",
          },
          footer: {
            brand: "Shipkart",
            about: "Same-day delivery and storage for online stores.",
            address: ["Hub: Survey No. 44, Shamshabad", "Hyderabad 501218"],
            contact: ["hello@shipkart.in", "Mon to Sat, 8am to 9pm"],
          },
        }}
      />
    </div>
  );
}
