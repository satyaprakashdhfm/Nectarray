"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTime,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * A law office seen from above, on a loop: a home buyer walks in with the
 * property file, a lawyer takes it to research, the papers are searched and
 * ticked, the senior lawyer stamps the opinion, and the verified file is
 * handed back as the buyer leaves.
 *
 * Everything runs off one clock. Each person and the file follow a list of
 * waypoints (time, x, y, facing), read with useTransform, so the whole scene
 * stays in step without re-rendering React. The file has no path of its own:
 * it is worked out from whoever is holding it, so it never drifts from a
 * hand. With reduced motion the scene holds still on the moment the opinion
 * is signed.
 */

const CYCLE = 20;
const STILL = 13;

/* [seconds, x, y, facing in degrees: 0 up, 90 right, 180 down] */
type Key = [number, number, number, number];

const BUYER: Key[] = [
  [0, -40, 335, 90],
  [3.2, 250, 335, 90],
  [3.5, 250, 335, 0],
  [4.6, 250, 335, 0],
  [4.9, 250, 335, -112],
  [6.3, 110, 392, -112],
  [6.6, 110, 392, 0],
  [14.0, 110, 392, 0],
  [14.3, 110, 392, 68],
  [15.6, 250, 335, 68],
  [15.85, 250, 335, 0],
  [16.8, 250, 335, 0],
  [17.1, 250, 335, -90],
  [19.6, -40, 335, -90],
  [20, -40, 335, -90],
];

const LAWYER: Key[] = [
  [0, 250, 218, 180],
  [4.5, 250, 218, 180],
  [4.75, 250, 218, 71],
  [5.5, 330, 190, 71],
  [5.65, 330, 190, 90],
  [6.8, 520, 190, 90],
  [7.0, 520, 190, 0],
  [10.4, 520, 190, 0],
  [10.7, 520, 190, 180],
  [11.6, 520, 272, 180],
  [13.4, 520, 272, 180],
  [13.6, 520, 272, 291],
  [14.7, 330, 200, 291],
  [14.8, 330, 200, 257],
  [15.3, 250, 218, 257],
  [15.5, 250, 218, 180],
  [20, 250, 218, 180],
];

const RESEARCHER: Key[] = [
  [0, 495, 74, 180],
  [7.6, 495, 74, 180],
  [8.0, 495, 74, 215],
  [9.6, 495, 74, 165],
  [10.2, 495, 74, 180],
  [20, 495, 74, 180],
];

const SENIOR: Key[] = [
  [0, 505, 382, 0],
  [11.9, 505, 382, 0],
  [12.2, 505, 382, 22],
  [13.0, 505, 382, 22],
  [13.3, 505, 382, 0],
  [20, 505, 382, 0],
];

const RECEPTION_DESK: [number, number] = [250, 267];
const RESEARCH_DESK: [number, number] = [520, 138];
const OPINION_DESK: [number, number] = [505, 322];

/** Where a track is at a moment, straight-line between its waypoints. */
function at(track: Key[], time: number): Key {
  const i = track.findIndex((k) => k[0] >= time);
  if (i <= 0) return track[Math.max(i, 0)];
  const [a, b] = [track[i - 1], track[i]];
  const f = (time - a[0]) / (b[0] - a[0] || 1);
  return [
    time,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
    a[3] + (b[3] - a[3]) * f,
  ];
}

/* Who holds the file, and when. Between spans it slides across. */
const HOLDS: [number, number, Key[] | [number, number]][] = [
  [0, 3.75, BUYER],
  [3.95, 4.05, RECEPTION_DESK],
  [4.3, 7.1, LAWYER],
  [7.35, 10.15, RESEARCH_DESK],
  [10.38, 11.6, LAWYER],
  [11.85, 13.15, OPINION_DESK],
  [13.38, 15.5, LAWYER],
  [15.75, 15.85, RECEPTION_DESK],
  [16.1, 20, BUYER],
];

/** The file's own waypoints: just in front of whoever carries it. */
const FILE: Key[] = HOLDS.flatMap(([from, to, who]) => {
  if (who.length === 2) {
    const [x, y] = who as [number, number];
    return [[from, x, y, 0] as Key, [to, x, y, 0] as Key];
  }
  const track = who as Key[];
  const times = [
    from,
    ...track.map((k) => k[0]).filter((t) => t > from && t < to),
    to,
  ];
  return times.map((t): Key => {
    const [, x, y, r] = at(track, t);
    const rad = (r * Math.PI) / 180;
    return [t, x + 14 * Math.sin(rad), y - 14 * Math.cos(rad), r];
  });
});

/* The research: three papers fanned out, searched and ticked. */
const PAPERS = [
  { label: "Title", x: 430, y: 130, r: -10, tick: 8.3 },
  { label: "EC", x: 461, y: 124, r: 5, tick: 8.9 },
  { label: "Plan", x: 489, y: 133, r: -4, tick: 9.5 },
];

const STEPS = [
  { label: "Property file received", at: 4.3 },
  { label: "Title and ownership chain", at: 8.3 },
  { label: "Encumbrances and loans", at: 8.9 },
  { label: "Approvals and building plan", at: 9.5 },
  { label: "Legal opinion signed", at: 12.65 },
];

const VERIFIED = 12.62;

/** On between two moments, with a quick fade either side. */
function useWindow(t: MotionValue<number>, on: number, off: number) {
  return useTransform(t, [on, on + 0.25, off - 0.25, off], [0, 1, 1, 0]);
}

function useTrack(t: MotionValue<number>, track: Key[]) {
  const times = track.map((k) => k[0]);
  return {
    x: useTransform(
      t,
      times,
      track.map((k) => k[1]),
    ),
    y: useTransform(
      t,
      times,
      track.map((k) => k[2]),
    ),
    rotate: useTransform(
      t,
      times,
      track.map((k) => k[3]),
    ),
  };
}

const turn = { transformBox: "fill-box", transformOrigin: "center" } as const;

/** A person from above: shoulders, hands, head, hair at the back. */
function Person({
  t,
  track,
  suit,
  skin,
  hair,
  collar = false,
}: {
  t: MotionValue<number>;
  track: Key[];
  suit: string;
  skin: string;
  hair: string;
  collar?: boolean;
}) {
  const { x, y, rotate } = useTrack(t, track);
  return (
    <motion.g style={{ x, y }}>
      <ellipse cx="2" cy="4" rx="17" ry="12" fill="#18181b" opacity="0.08" />
      <motion.g style={{ rotate, ...turn }}>
        <circle r="20" fill="transparent" />
        <circle cx="-13" cy="-7" r="4" fill={skin} />
        <circle cx="13" cy="-7" r="4" fill={skin} />
        <ellipse rx="16" ry="9" fill={suit} />
        {collar && <path d="M-4 -8 L0 -3 L4 -8 Z" fill="#fafafa" />}
        <circle cy="-1" r="8.5" fill={skin} />
        <circle cy="1.6" r="8" fill={hair} />
      </motion.g>
    </motion.g>
  );
}

function PropertyFile({ t }: { t: MotionValue<number> }) {
  const { x, y, rotate } = useTrack(t, FILE);
  const verified = useWindow(t, VERIFIED, CYCLE - 0.1);
  const seal = useTransform(
    t,
    [VERIFIED, VERIFIED + 0.15, VERIFIED + 0.35],
    [0, 1.5, 1],
  );
  return (
    <motion.g style={{ x, y }}>
      <motion.g style={{ rotate, ...turn }}>
        <rect x="-12" y="-11" width="24" height="22" fill="transparent" />
        <rect x="-11" y="-10" width="9" height="4" rx="1" fill="var(--t)" />
        <rect
          x="-11"
          y="-8"
          width="22"
          height="16"
          rx="2"
          fill="#ffffff"
          stroke="var(--t)"
          strokeWidth="1.5"
        />
        <path
          d="M-7 -3 H6 M-7 1 H4 M-7 5 H2"
          stroke="#a1a1aa"
          strokeWidth="1"
        />
        <motion.g style={{ opacity: verified }}>
          <rect
            x="-11"
            y="-8"
            width="22"
            height="16"
            rx="2"
            fill="#f0fdf4"
            stroke="#16a34a"
            strokeWidth="1.5"
          />
          <motion.g style={{ scale: seal, ...turn }}>
            <circle r="5.5" fill="#16a34a" />
            <path
              d="M-2.5 0 L-0.6 2 L2.8 -1.8"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.g>
        </motion.g>
      </motion.g>
    </motion.g>
  );
}

function Paper({
  t,
  paper,
}: {
  t: MotionValue<number>;
  paper: (typeof PAPERS)[number];
}) {
  const [fx, fy] = RESEARCH_DESK;
  const span = [7.5, 7.95, 9.7, 10.1];
  const x = useTransform(t, span, [fx, paper.x, paper.x, fx]);
  const y = useTransform(t, span, [fy, paper.y, paper.y, fy]);
  const rotate = useTransform(t, span, [0, paper.r, paper.r, 0]);
  const opacity = useWindow(t, 7.45, 10.15);
  const tick = useWindow(t, paper.tick, 10.0);
  return (
    <motion.g style={{ x, y, opacity }}>
      <motion.g style={{ rotate, ...turn }}>
        <rect
          x="-10"
          y="-13"
          width="20"
          height="26"
          rx="1.5"
          fill="#ffffff"
          stroke="#d4d4d8"
        />
        <path
          d="M-6 -7 H6 M-6 -3 H5 M-6 1 H6 M-6 5 H3"
          stroke="#d4d4d8"
          strokeWidth="1"
        />
        <text
          y="11"
          textAnchor="middle"
          fontSize="5"
          fontWeight="700"
          fill="#71717a"
        >
          {paper.label}
        </text>
        <motion.g style={{ opacity: tick }}>
          <circle cx="7" cy="-10" r="4" fill="#16a34a" />
          <path
            d="M5.2 -10 L6.5 -8.7 L8.8 -11.3"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </motion.g>
      </motion.g>
    </motion.g>
  );
}

/** The magnifier that moves from paper to paper during the search. */
function Lens({ t }: { t: MotionValue<number> }) {
  const times = [7.9, 8.0, 8.3, 8.6, 8.9, 9.2, 9.5, 9.7];
  const xs = [430, 430, 430, 461, 461, 489, 489, 489];
  const ys = [130, 130, 130, 124, 124, 133, 133, 133];
  const x = useTransform(t, times, xs);
  const y = useTransform(t, times, ys);
  const opacity = useWindow(t, 7.9, 9.75);
  return (
    <motion.g style={{ x, y, opacity }}>
      <circle r="9" fill="var(--p-light)" fillOpacity="0.35" />
      <circle r="9" fill="none" stroke="var(--p)" strokeWidth="2" />
      <path
        d="M6.5 6.5 L13 13"
        stroke="var(--p-dark)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </motion.g>
  );
}

/** The senior lawyer's stamp: lifted, pressed on the file, put back. */
function Stamp({ t }: { t: MotionValue<number> }) {
  const [px, py] = [556, 318];
  const [fx, fy] = OPINION_DESK;
  const times = [12.2, 12.4, 12.55, 12.62, 12.75, 13.0];
  const x = useTransform(t, times, [px, fx + 1, fx, fx, fx + 1, px]);
  const y = useTransform(t, times, [py, fy - 2, fy, fy, fy - 2, py]);
  const scale = useTransform(t, times, [1, 1.35, 1.1, 0.92, 1.3, 1]);
  return (
    <motion.g style={{ x, y, scale, ...turn }}>
      <circle r="10" fill="transparent" />
      <circle r="7.5" fill="#3f3f46" />
      <circle r="4" fill="#71717a" />
    </motion.g>
  );
}

function Chair({ x, y }: { x: number; y: number }) {
  return (
    <rect
      x={x - 15}
      y={y - 13}
      width="30"
      height="26"
      rx="8"
      fill="#e4e4e7"
      stroke="#d4d4d8"
    />
  );
}

function Plant({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="15" fill="#e4e4e7" />
      <circle cx={x - 5} cy={y - 4} r="8" fill="#4ade80" />
      <circle cx={x + 5} cy={y - 3} r="7" fill="#22c55e" />
      <circle cx={x} cy={y + 5} r="7.5" fill="#16a34a" />
    </g>
  );
}

function Desk({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect
        x={x + 2}
        y={y + 4}
        width={w}
        height={h}
        rx="7"
        fill="#18181b"
        opacity="0.06"
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="7"
        fill="#ffffff"
        stroke="#d4d4d8"
        strokeWidth="1.5"
      />
    </g>
  );
}

function Office({ t }: { t: MotionValue<number> }) {
  const screen = useWindow(t, 7.4, 10.3);
  return (
    <svg
      viewBox="0 0 640 440"
      className="block h-auto w-full"
      role="img"
      aria-label="A law office from above: a home buyer hands over a property file, lawyers research and verify it, and hand it back approved."
    >
      <defs>
        <pattern
          id="law-tiles"
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <path d="M32 0 H0 V32" fill="none" stroke="#e4e4e7" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Floor and walls, with the door on the left. */}
      <rect x="12" y="12" width="616" height="416" fill="#fafafa" />
      <rect x="12" y="12" width="616" height="416" fill="url(#law-tiles)" />
      <path
        d="M12 298 V12 H628 V428 H12 V372"
        fill="none"
        stroke="#a1a1aa"
        strokeWidth="7"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M12 298 A74 74 0 0 1 86 372"
        fill="none"
        stroke="#d4d4d8"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      <path
        d="M12 372 H86"
        stroke="#a1a1aa"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect
        x="18"
        y="310"
        width="30"
        height="50"
        rx="4"
        fill="var(--s-light)"
      />

      {/* Bookshelf along the top wall. */}
      <rect x="240" y="18" width="140" height="22" rx="3" fill="#e4e4e7" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <rect
          key={i}
          x={246 + i * 12}
          y="21"
          width={i % 3 === 0 ? 9 : 7}
          height="16"
          rx="1"
          fill={["var(--p)", "var(--t)", "var(--s)", "#a1a1aa"][i % 4]}
          opacity={i % 2 ? 0.55 : 0.85}
        />
      ))}

      <Plant x={44} y={44} />
      <Plant x={604} y={404} />
      <Plant x={604} y={240} />

      {/* Reception: the lawyer's chair behind, the desk in front. */}
      <Chair x={250} y={214} />
      <Desk x={190} y={244} w={120} h={46} />
      <rect
        x="284"
        y="252"
        width="16"
        height="10"
        rx="2"
        fill="var(--p-light)"
      />
      <circle cx="204" cy="258" r="5" fill="#d4d4d8" />

      {/* Waiting chairs by the door. */}
      <Chair x={110} y={398} />
      <Chair x={150} y={398} />
      <rect x="54" y="386" width="30" height="26" rx="13" fill="#e4e4e7" />

      {/* Research desk, with the laptop. */}
      <Chair x={495} y={70} />
      <Desk x={400} y={100} w={190} h={60} />
      <rect x="548" y="117" width="34" height="24" rx="3" fill="#3f3f46" />
      <motion.rect
        x="551"
        y="120"
        width="28"
        height="15"
        rx="1.5"
        fill="var(--p-light)"
        style={{ opacity: screen }}
      />

      {/* Opinion desk, with the stamp pad. */}
      <Chair x={505} y={386} />
      <Desk x={410} y={298} w={170} h={52} />
      <rect x="546" y="311" width="20" height="14" rx="3" fill="#a1a1aa" />
      <rect
        x="420"
        y="306"
        width="18"
        height="24"
        rx="1.5"
        fill="#ffffff"
        stroke="#d4d4d8"
      />

      <g fontSize="9" fontWeight="600" letterSpacing="0.08em" fill="#a1a1aa">
        <text x="250" y="304" textAnchor="middle">
          RECEPTION
        </text>
        <text x="410" y="176">
          TITLE SEARCH
        </text>
        <text x="410" y="366">
          LEGAL OPINION
        </text>
      </g>

      {PAPERS.map((p) => (
        <Paper key={p.label} t={t} paper={p} />
      ))}

      <Person
        t={t}
        track={RESEARCHER}
        suit="var(--p-dark)"
        skin="#8d5a3b"
        hair="#18181b"
        collar
      />
      <Person
        t={t}
        track={SENIOR}
        suit="var(--p-dark)"
        skin="#f0c9a0"
        hair="#a1a1aa"
        collar
      />
      <Person
        t={t}
        track={LAWYER}
        suit="var(--p)"
        skin="#e2b48c"
        hair="#3f2a1d"
        collar
      />
      <Person
        t={t}
        track={BUYER}
        suit="var(--s)"
        skin="#c68a5e"
        hair="#27272a"
      />

      <PropertyFile t={t} />
      <Lens t={t} />
      <Stamp t={t} />
    </svg>
  );
}

function Step({
  t,
  step,
}: {
  t: MotionValue<number>;
  step: (typeof STEPS)[number];
}) {
  const done = useWindow(t, step.at, CYCLE - 0.15);
  const text = useTransform(done, [0, 1], [0.45, 1]);
  return (
    <li className="flex items-center gap-3">
      <span className="relative grid size-5 shrink-0 place-items-center rounded-full border border-zinc-300 bg-white">
        <motion.span
          className="absolute inset-[-1px] grid place-items-center rounded-full bg-[#16a34a]"
          style={{ opacity: done, scale: done }}
        >
          <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
            <path
              d="M2.5 6.2 L5 8.5 L9.5 3.8"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </span>
      <motion.span
        className="text-sm font-medium text-zinc-900"
        style={{ opacity: text }}
      >
        {step.label}
      </motion.span>
    </li>
  );
}

export function LawPropertyVerification() {
  const reduce = useReducedMotion();
  const time = useTime();
  const live = useTransform(time, (ms) => (ms / 1000) % CYCLE);
  const still = useMotionValue(STILL);
  const t = reduce ? still : live;
  const verified = useWindow(t, VERIFIED, CYCLE - 0.15);

  return (
    <section className="@container overflow-hidden bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 @4xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] @4xl:items-center @4xl:gap-x-14 @4xl:py-20">
        <div>
          <motion.p
            className="text-sm font-semibold text-(--p-dark)"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Property legal verification
          </motion.p>
          <motion.h1
            className="mt-3 text-4xl leading-[1.08] font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            Buying a home? We check every paper before you sign.
          </motion.h1>
          <motion.p
            className="mt-5 max-w-[46ch] text-base leading-relaxed text-zinc-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            Our lawyers verify the title, approvals and encumbrances, then hand
            you a clear legal opinion.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <a
              href="#"
              className="rounded-full bg-(--p) px-6 py-3 text-sm font-semibold whitespace-nowrap text-(--p-on) transition-transform active:scale-[0.98]"
            >
              Verify my property
            </a>
            <a
              href="#"
              className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold whitespace-nowrap text-zinc-900 transition-colors hover:border-zinc-900"
            >
              How it works
            </a>
          </motion.div>
        </div>

        <motion.div
          className="overflow-hidden rounded-3xl bg-white shadow-[0_30px_60px_-30px_rgba(24,24,27,0.3)] ring-1 ring-zinc-200 @4xl:col-start-2 @4xl:row-span-2 @4xl:row-start-1"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <Office t={t} />
        </motion.div>

        <motion.div
          className="rounded-2xl border border-zinc-200 bg-white p-5 @4xl:col-start-1"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          <p className="text-xs font-semibold text-zinc-500">
            Your property file
          </p>
          <ul className="mt-4 space-y-3">
            {STEPS.map((s) => (
              <Step key={s.label} t={t} step={s} />
            ))}
          </ul>
          <motion.p
            className="mt-4 rounded-xl bg-[#f0fdf4] px-3 py-2 text-sm font-semibold text-[#15803d]"
            style={{ opacity: verified }}
          >
            Verified. Safe to proceed with the purchase.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
