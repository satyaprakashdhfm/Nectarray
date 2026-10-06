"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTime,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * A whole one-page site for a property law firm, told by its own office
 * seen from above.
 *
 * The left column scrolls through the story in words; the right column
 * holds the office still while the scroll plays it: the client walks in
 * and hands the file over at reception, an associate carries it to the
 * records desk where it is searched on the computer, then to the plan desk,
 * then into the senior advocate's cabin to be signed and stamped, and
 * finally to the meeting table, where the verified file goes back to the
 * client and the view pulls out to the whole office with the seal on it.
 * The rest of the site follows: services, numbers, reviews, questions.
 *
 * One playhead drives everything: the story's scroll progress, eased by a
 * spring, read as a time from 0 to 30. People follow waypoints (time, x, y,
 * facing); the file is worked out from whoever holds it. Hands swing while
 * someone walks and type while they work, which runs on the clock so the
 * office keeps breathing when the scroll stops. Colours come from the
 * palette variables (--p, --s, --t).
 */

const BRAND = "Vidhi Legal";
const END = 30;

/* [time, x, y, facing in degrees: 0 up, 90 right, 180 down] */
type Key = [number, number, number, number];

const CLIENT: Key[] = [
  [0, 62, 505, 90],
  [2.4, 205, 505, 90],
  [2.7, 205, 505, 0],
  [3.9, 205, 505, 0],
  [4.1, 205, 505, 112],
  [5.0, 320, 552, 112],
  [5.2, 320, 552, 0],
  [25.8, 320, 552, 0],
  [26.0, 320, 552, -9],
  [27.0, 300, 420, -9],
  [27.6, 300, 300, 0],
  [27.8, 300, 300, 90],
  [END, 300, 300, 90],
];

const ASSOCIATE: Key[] = [
  [0, 205, 395, 180],
  [5.0, 205, 395, 180],
  [5.2, 205, 395, 30],
  [6.2, 260, 300, 30],
  [6.3, 260, 300, 0],
  [7.3, 260, 170, 0],
  [7.5, 260, 170, -90],
  [15.0, 260, 170, -90],
  [15.3, 260, 170, 90],
  [16.6, 540, 170, 90],
  [20.0, 540, 170, 90],
  [20.2, 540, 170, 149],
  [21.0, 595, 260, 149],
  [21.1, 595, 260, 180],
  [21.9, 595, 372, 180],
  [25.0, 595, 372, 180],
  [25.3, 595, 372, 0],
  [26.0, 595, 262, 0],
  [26.1, 595, 262, -112],
  [26.9, 500, 300, -112],
  [27.1, 500, 300, -90],
  [END, 500, 300, -90],
];

const RESEARCHER: Key[] = [
  [0, 140, 165, 0],
  [7.8, 140, 165, 0],
  [8.2, 140, 165, 28],
  [9.0, 140, 165, 0],
  [END, 140, 165, 0],
];

const PLANNER: Key[] = [
  [0, 630, 165, 0],
  [16.8, 630, 165, 0],
  [17.2, 630, 165, -30],
  [17.9, 630, 165, 0],
  [END, 630, 165, 0],
];

const SENIOR: Key[] = [
  [0, 660, 475, 0],
  [22.2, 660, 475, 0],
  [22.5, 660, 475, -18],
  [23.0, 660, 475, 12],
  [24.6, 660, 475, 12],
  [24.9, 660, 475, 0],
  [END, 660, 475, 0],
];

type Spot = [number, number];
const RECEPTION: Spot = [205, 443];
const RECORDS_DESK: Spot = [205, 118];
const PLAN_DESK: Spot = [585, 118];
const CABIN_DESK: Spot = [630, 423];
const TABLE: Spot = [400, 300];

/** Who holds the file, and when. Between spans it slides across. */
const HOLDS: [number, number, Key[] | Spot][] = [
  [0, 2.9, CLIENT],
  [3.1, 3.2, RECEPTION],
  [3.4, 7.6, ASSOCIATE],
  [7.85, 14.8, RECORDS_DESK],
  [15.0, 16.75, ASSOCIATE],
  [17.0, 19.8, PLAN_DESK],
  [20.0, 21.95, ASSOCIATE],
  [22.2, 24.8, CABIN_DESK],
  [25.0, 28.0, ASSOCIATE],
  [28.3, 28.4, TABLE],
  [28.7, END, CLIENT],
];

const STAMP_AT = 23.6;

/* The camera: [time, centre x, centre y, zoom]. */
const CAMERA: [number, number, number, number][] = [
  [0, 400, 300, 1],
  [5.4, 400, 300, 1],
  [7.0, 205, 190, 1.75],
  [14.7, 205, 190, 1.75],
  [15.7, 420, 190, 1.3],
  [16.9, 620, 190, 1.75],
  [19.9, 620, 190, 1.75],
  [21.3, 640, 420, 1.8],
  [24.9, 640, 420, 1.8],
  [26.4, 400, 330, 1.15],
  [28.0, 400, 300, 1.45],
  [28.9, 400, 300, 1.45],
  [29.7, 400, 300, 1],
  [END, 400, 300, 1],
];

/* The checks that appear in the office as they pass. */
const CHIPS = [
  { at: 11.0, x: 150, y: 214, text: "Title chain, 30 years" },
  { at: 13.0, x: 150, y: 242, text: "EC: no loans, no charges" },
  { at: 18.6, x: 630, y: 214, text: "Plan matches the building" },
  { at: 23.8, x: 660, y: 530, text: "Opinion signed" },
];

function at(track: Key[], time: number): Key {
  const i = track.findIndex((k) => k[0] >= time);
  if (i === -1) return track[track.length - 1];
  if (i === 0) return track[0];
  const [a, b] = [track[i - 1], track[i]];
  const f = (time - a[0]) / (b[0] - a[0] || 1);
  return [
    time,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
    a[3] + (b[3] - a[3]) * f,
  ];
}

const FILE: Key[] = HOLDS.flatMap(([from, to, who]) => {
  if (who.length === 2) {
    const [x, y] = who as Spot;
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
    return [t, x + 15 * Math.sin(rad), y - 15 * Math.cos(rad), r];
  });
});

const moving = (track: Key[], t: number) => {
  const [, x1, y1] = at(track, t);
  const [, x2, y2] = at(track, t + 0.06);
  return Math.hypot(x2 - x1, y2 - y1) > 0.3;
};

function useWindow(t: MotionValue<number>, on: number, off: number) {
  return useTransform(t, [on, on + 0.3, off - 0.3, off], [0, 1, 1, 0]);
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

/* ------------------------------------------------------------------ */
/* People and things.                                                  */
/* ------------------------------------------------------------------ */

function Person({
  t,
  clock,
  track,
  suit,
  skin,
  hair,
  collar = false,
  typing = [],
}: {
  t: MotionValue<number>;
  clock: MotionValue<number>;
  track: Key[];
  suit: string;
  skin: string;
  hair: string;
  collar?: boolean;
  typing?: [number, number][];
}) {
  const { x, y, rotate } = useTrack(t, track);
  const busy = (tv: number) => typing.some(([a, b]) => tv >= a && tv <= b);
  // Hands swing as they walk and tap as they type.
  const left = useTransform([t, clock], ([tv, ms]: number[]) =>
    moving(track, tv)
      ? Math.sin(tv * 16) * 3.5
      : busy(tv)
        ? Math.sin(ms / 55) * 1.4 - 3
        : 0,
  );
  const right = useTransform([t, clock], ([tv, ms]: number[]) =>
    moving(track, tv)
      ? -Math.sin(tv * 16) * 3.5
      : busy(tv)
        ? Math.cos(ms / 47) * 1.4 - 3
        : 0,
  );
  return (
    <motion.g style={{ x, y }}>
      <ellipse cx="2" cy="4" rx="18" ry="12" fill="#18181b" opacity="0.08" />
      <motion.g style={{ rotate, ...turn }}>
        <circle r="21" fill="transparent" />
        <motion.circle
          cx="-13"
          cy="-8"
          r="4.2"
          fill={skin}
          style={{ y: left }}
        />
        <motion.circle
          cx="13"
          cy="-8"
          r="4.2"
          fill={skin}
          style={{ y: right }}
        />
        <ellipse rx="16.5" ry="9.5" fill={suit} />
        {collar && <path d="M-4 -9 L0 -3.5 L4 -9 Z" fill="#fafafa" />}
        <circle cy="-1" r="8.6" fill={skin} />
        <circle cy="1.7" r="8.1" fill={hair} />
      </motion.g>
    </motion.g>
  );
}

function PropertyFile({ t }: { t: MotionValue<number> }) {
  const { x, y, rotate } = useTrack(t, FILE);
  const verified = useTransform(t, [STAMP_AT, STAMP_AT + 0.2], [0, 1]);
  const seal = useTransform(
    t,
    [STAMP_AT, STAMP_AT + 0.15, STAMP_AT + 0.4],
    [0, 1.5, 1],
  );
  return (
    <motion.g style={{ x, y }}>
      <motion.g style={{ rotate, ...turn }}>
        <rect x="-13" y="-12" width="26" height="24" fill="transparent" />
        <rect x="-12" y="-11" width="10" height="4" rx="1" fill="var(--t)" />
        <rect
          x="-12"
          y="-9"
          width="24"
          height="18"
          rx="2"
          fill="#ffffff"
          stroke="var(--t)"
          strokeWidth="1.6"
        />
        <path
          d="M-8 -4 H7 M-8 0 H5 M-8 4 H3"
          stroke="#a1a1aa"
          strokeWidth="1"
        />
        <motion.g style={{ opacity: verified }}>
          <rect
            x="-12"
            y="-9"
            width="24"
            height="18"
            rx="2"
            fill="#f0fdf4"
            stroke="#16a34a"
            strokeWidth="1.6"
          />
          <motion.g style={{ scale: seal, ...turn }}>
            <circle r="6" fill="#16a34a" />
            <path
              d="M-2.8 0 L-0.7 2.2 L3 -2"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.g>
        </motion.g>
      </motion.g>
    </motion.g>
  );
}

/** A computer from above, its screen working while its owner does. */
function Computer({
  t,
  clock,
  x,
  y,
  on,
  off,
  kind,
}: {
  t: MotionValue<number>;
  clock: MotionValue<number>;
  x: number;
  y: number;
  on: number;
  off: number;
  kind: "records" | "plan" | "laptop";
}) {
  const glow = useWindow(t, on, END + 1);
  const progress = useTransform(t, [on, off], [0, 1]);
  const blink = useTransform(clock, (ms) => (Math.sin(ms / 260) > 0 ? 1 : 0.2));
  const w = kind === "laptop" ? 40 : 66;
  const h = kind === "laptop" ? 26 : 30;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        x={-w / 2 - 3}
        y={-h / 2 - 3}
        width={w + 6}
        height={h + 6}
        rx="4"
        fill="#27272a"
      />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="2" fill="#3f3f46" />
      <motion.g style={{ opacity: glow }}>
        <rect
          x={-w / 2}
          y={-h / 2}
          width={w}
          height={h}
          rx="2"
          fill="#f8fafc"
        />
        {kind === "plan" ? (
          <g stroke="var(--p)" strokeWidth="1" fill="none">
            <rect
              x={-w / 2 + 6}
              y={-h / 2 + 5}
              width={w / 2 - 6}
              height={h - 10}
            />
            <rect x={2} y={-h / 2 + 5} width={w / 2 - 8} height={h / 2 - 5} />
            <path d={`M${-w / 2 + 6} 2 H${-4} M2 4 H${w / 2 - 6}`} />
          </g>
        ) : (
          [0, 1, 2].map((i) => (
            <g key={i}>
              <rect
                x={-w / 2 + 5}
                y={-h / 2 + 5 + i * 7}
                width={w - 10}
                height="3"
                rx="1.5"
                fill="#e4e4e7"
              />
              <motion.rect
                x={-w / 2 + 5}
                y={-h / 2 + 5 + i * 7}
                width={w - 10}
                height="3"
                rx="1.5"
                fill="var(--p)"
                style={{
                  scaleX: progress,
                  originX: 0,
                  transformBox: "fill-box",
                }}
              />
            </g>
          ))
        )}
        <motion.rect
          x={w / 2 - 8}
          y={h / 2 - 7}
          width="3"
          height="4"
          fill="var(--p)"
          style={{ opacity: blink }}
        />
      </motion.g>
      {kind !== "laptop" && (
        <rect
          x={-w / 2 + 4}
          y={h / 2 + 7}
          width={w - 8}
          height="9"
          rx="2"
          fill="#d4d4d8"
        />
      )}
    </g>
  );
}

function Chip({
  t,
  chip,
}: {
  t: MotionValue<number>;
  chip: (typeof CHIPS)[number];
}) {
  const opacity = useTransform(t, [chip.at, chip.at + 0.3], [0, 1]);
  const scale = useTransform(
    t,
    [chip.at, chip.at + 0.2, chip.at + 0.4],
    [0.6, 1.08, 1],
  );
  const width = chip.text.length * 5.6 + 30;
  return (
    <motion.g style={{ opacity, scale, x: chip.x, y: chip.y, ...turn }}>
      <rect
        x={-width / 2}
        y="-11"
        width={width}
        height="22"
        rx="11"
        fill="#ffffff"
        stroke="#bbf7d0"
      />
      <circle cx={-width / 2 + 12} r="6.5" fill="#16a34a" />
      <path
        d={`M${-width / 2 + 9} 0 L${-width / 2 + 11.2} 2.2 L${-width / 2 + 15} -2`}
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <text
        x={-width / 2 + 23}
        y="3.6"
        fontSize="10"
        fontWeight="600"
        fill="#166534"
      >
        {chip.text}
      </text>
    </motion.g>
  );
}

function Stamp({ t }: { t: MotionValue<number> }) {
  const [px, py] = [697, 420];
  const [fx, fy] = CABIN_DESK;
  const times = [
    STAMP_AT - 0.6,
    STAMP_AT - 0.3,
    STAMP_AT - 0.1,
    STAMP_AT,
    STAMP_AT + 0.15,
    STAMP_AT + 0.5,
  ];
  const x = useTransform(t, times, [px, fx + 2, fx, fx, fx + 2, px]);
  const y = useTransform(t, times, [py, fy - 3, fy, fy, fy - 3, py]);
  const scale = useTransform(t, times, [1, 1.4, 1.12, 0.9, 1.3, 1]);
  const ring = useTransform(t, [STAMP_AT, STAMP_AT + 0.7], [0.4, 2.6]);
  const ringOpacity = useTransform(
    t,
    [STAMP_AT, STAMP_AT + 0.05, STAMP_AT + 0.7],
    [0, 0.9, 0],
  );
  return (
    <>
      <motion.circle
        cx={fx}
        cy={fy}
        r="14"
        fill="none"
        stroke="#16a34a"
        strokeWidth="2"
        style={{ scale: ring, opacity: ringOpacity, ...turn }}
      />
      <motion.g style={{ x, y, scale, ...turn }}>
        <circle r="11" fill="transparent" />
        <circle r="8" fill="#3f3f46" />
        <circle r="4.2" fill="var(--s)" />
      </motion.g>
    </>
  );
}

function Chair({ x, y, r = 0 }: { x: number; y: number; r?: number }) {
  return (
    <rect
      x={x - 15}
      y={y - 13}
      width="30"
      height="26"
      rx="8"
      fill="#e4e4e7"
      stroke="#d4d4d8"
      transform={`rotate(${r} ${x} ${y})`}
    />
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

function Plant({ x, y, r = 15 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#e4e4e7" />
      <circle cx={x - r * 0.33} cy={y - r * 0.27} r={r * 0.55} fill="#4ade80" />
      <circle cx={x + r * 0.33} cy={y - r * 0.2} r={r * 0.48} fill="#22c55e" />
      <circle cx={x} cy={y + r * 0.33} r={r * 0.5} fill="#16a34a" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* The office.                                                         */
/* ------------------------------------------------------------------ */

function Office({ t }: { t: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const time = useTime();
  const clock = useTransform(time, (ms) => (reduce ? 0 : ms));
  const times = CAMERA.map((c) => c[0]);
  const zoom = useTransform(
    t,
    times,
    CAMERA.map((c) => c[3]),
  );
  const cx = useTransform(
    t,
    times,
    CAMERA.map((c) => c[1]),
  );
  const cy = useTransform(
    t,
    times,
    CAMERA.map((c) => c[2]),
  );
  const camX = useTransform([cx, zoom], ([x, z]: number[]) => 400 - x * z);
  const camY = useTransform([cy, zoom], ([y, z]: number[]) => 300 - y * z);

  return (
    <svg
      viewBox="0 0 800 600"
      className="block size-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="A law office from above. A client hands over a property file, the team researches and checks it at their computers, a senior advocate stamps it, and the verified file is handed back."
    >
      <defs>
        <pattern
          id="office-tiles"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path d="M40 0 H0 V40" fill="none" stroke="#ececef" strokeWidth="1" />
        </pattern>
      </defs>
      <motion.g
        style={{
          x: camX,
          y: camY,
          scale: zoom,
          transformBox: "view-box",
          transformOrigin: "0px 0px",
        }}
      >
        {/* Floor, walls and the door on the left. */}
        <rect x="20" y="20" width="760" height="560" fill="#fafafa" />
        <rect
          x="20"
          y="20"
          width="760"
          height="560"
          fill="url(#office-tiles)"
        />
        <path
          d="M20 470 V20 H780 V580 H20 V540"
          fill="none"
          stroke="#a1a1aa"
          strokeWidth="8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M20 470 A70 70 0 0 1 90 540"
          fill="none"
          stroke="#d4d4d8"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d="M20 540 H90"
          stroke="#a1a1aa"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect
          x="26"
          y="478"
          width="34"
          height="56"
          rx="5"
          fill="var(--s-light)"
        />

        {/* The senior advocate's glass cabin. */}
        <path
          d="M560 300 H570 M620 300 H780 M560 300 V580"
          stroke="#cbd5e1"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <rect
          x="562"
          y="302"
          width="216"
          height="276"
          fill="var(--p-light)"
          opacity="0.35"
        />

        {/* Bookshelves along the top wall, and a printer. */}
        <rect x="270" y="28" width="230" height="24" rx="3" fill="#e4e4e7" />
        {Array.from({ length: 18 }).map((_, i) => (
          <rect
            key={i}
            x={276 + i * 12.4}
            y="31"
            width={i % 3 === 0 ? 9 : 7}
            height="18"
            rx="1"
            fill={["var(--p)", "var(--t)", "var(--s)", "#a1a1aa"][i % 4]}
            opacity={i % 2 ? 0.55 : 0.85}
          />
        ))}
        <rect x="520" y="30" width="36" height="26" rx="4" fill="#d4d4d8" />
        <rect x="526" y="36" width="24" height="6" rx="1" fill="#a1a1aa" />

        <Plant x={46} y={46} />
        <Plant x={752} y={46} />
        <Plant x={46} y={410} r={13} />
        <Plant x={752} y={552} r={13} />
        <Plant x={540} y={552} r={12} />

        {/* Reception. */}
        <Chair x={205} y={392} />
        <Desk x={140} y={420} w={130} h={46} />
        <Computer
          t={t}
          clock={clock}
          x={238}
          y={438}
          on={0.5}
          off={3}
          kind="laptop"
        />
        <circle cx="156" cy="436" r="6" fill="#d4d4d8" />

        {/* Waiting chairs and a side table. */}
        <Chair x={320} y={556} r={180} />
        <Chair x={360} y={556} r={180} />
        <Chair x={400} y={556} r={180} />
        <circle cx="440" cy="556" r="12" fill="#e4e4e7" />

        {/* Records desk. */}
        <Chair x={140} y={168} />
        <Desk x={80} y={84} w={160} h={60} />
        <Computer
          t={t}
          clock={clock}
          x={140}
          y={104}
          on={8.6}
          off={14.2}
          kind="records"
        />

        {/* Plan desk. */}
        <Chair x={630} y={168} />
        <Desk x={560} y={84} w={160} h={60} />
        <Computer
          t={t}
          clock={clock}
          x={630}
          y={104}
          on={17.4}
          off={19.6}
          kind="plan"
        />

        {/* Meeting table. */}
        <rect
          x="332"
          y="262"
          width="138"
          height="78"
          rx="20"
          fill="#ffffff"
          stroke="#d4d4d8"
          strokeWidth="1.5"
        />
        <Chair x={372} y={244} />
        <Chair x={430} y={244} />
        <Chair x={372} y={358} r={180} />
        <Chair x={430} y={358} r={180} />

        {/* The senior advocate's desk, with the stamp pad. */}
        <Chair x={660} y={478} />
        <Desk x={600} y={400} w={124} h={46} />
        <Computer
          t={t}
          clock={clock}
          x={660}
          y={412}
          on={22.3}
          off={24.6}
          kind="laptop"
        />
        <rect x="688" y="413" width="20" height="14" rx="3" fill="#a1a1aa" />

        <g
          fontSize="9.5"
          fontWeight="600"
          letterSpacing="0.08em"
          fill="#a1a1aa"
        >
          <text x="140" y="480">
            RECEPTION
          </text>
          <text x="80" y="76">
            RECORDS
          </text>
          <text x="560" y="76">
            PLANS AND APPROVALS
          </text>
          <text x="580" y="322">
            SENIOR ADVOCATE
          </text>
        </g>

        <Person
          t={t}
          clock={clock}
          track={RESEARCHER}
          suit="var(--p-dark)"
          skin="#8d5a3b"
          hair="#18181b"
          collar
          typing={[[8.6, 14.4]]}
        />
        <Person
          t={t}
          clock={clock}
          track={PLANNER}
          suit="var(--p-dark)"
          skin="#f1c7a1"
          hair="#4a3426"
          collar
          typing={[[17.4, 19.7]]}
        />
        <Person
          t={t}
          clock={clock}
          track={SENIOR}
          suit="var(--p-dark)"
          skin="#e8b48f"
          hair="#a1a1aa"
          collar
          typing={[[22.4, 23.0]]}
        />
        <Person
          t={t}
          clock={clock}
          track={ASSOCIATE}
          suit="var(--p)"
          skin="#c68a5e"
          hair="#2b1d14"
          collar
          typing={[[0.5, 2.6]]}
        />
        <Person
          t={t}
          clock={clock}
          track={CLIENT}
          suit="var(--s)"
          skin="#d9a27a"
          hair="#27272a"
        />

        <PropertyFile t={t} />
        <Stamp t={t} />
        {CHIPS.map((c) => (
          <Chip key={c.text} t={t} chip={c} />
        ))}
      </motion.g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* The story: words on the left, the office on the right.              */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    title: "Walk in with your papers.",
    text: "Bring what the seller gave you. We take it from the front desk.",
  },
  {
    title: "Your file goes to the right desk.",
    text: "One associate owns your file from the first day and walks it through every check.",
    points: ["A tracking number on WhatsApp", "Updates as each check is done"],
  },
  {
    title: "We search the records.",
    text: "Thirty years of the title, and the encumbrance certificate, matched with the sub-registrar's own books.",
    points: [
      "Every owner and transfer",
      "No mortgages, attachments or disputes",
    ],
  },
  {
    title: "Plans and approvals, checked.",
    text: "The building is held against the sanctioned plan: floors, setbacks and permitted use.",
    points: ["Approved plan and occupancy", "Tax and dues paid up"],
  },
  {
    title: "Signed by a senior advocate.",
    text: "Every finding is reviewed in the cabin, and the legal opinion is signed and stamped.",
  },
  {
    title: "Back in your hands, verified.",
    text: "We sit with you, explain the opinion line by line, and hand over a file your bank will accept.",
  },
];

function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const eased = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });
  const t = useTransform(eased, [0, 1], [0, END]);
  const [step, setStep] = useState(0);
  const finale = useTransform(t, [29.2, 29.8], [0, 1]);
  const finaleScale = useTransform(t, [29.2, 29.6, 29.9], [0.6, 1.08, 1]);
  const bar = useTransform(t, [0, END], [0, 1]);

  return (
    <div
      ref={ref}
      className="relative grid @4xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] @4xl:gap-10"
    >
      {/* The office, held still while the words scroll past. */}
      <div className="pointer-events-none col-start-1 row-start-1 @4xl:col-start-2">
        <div className="pointer-events-auto sticky top-16 z-10 h-[46dvh] bg-white pt-3 @4xl:top-20 @4xl:h-[calc(100dvh-6rem)] @4xl:pt-0">
          <div className="relative h-full overflow-hidden rounded-3xl bg-white shadow-[0_30px_60px_-30px_rgba(24,24,27,0.3)] ring-1 ring-zinc-200">
            <Office t={t} />
            <motion.div
              className="absolute inset-x-0 top-0 h-1 origin-left bg-(--p)"
              style={{ scaleX: bar }}
            />
            <div className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-700 shadow-sm ring-1 ring-zinc-200">
              Step {step + 1} of {STEPS.length}
            </div>
            {/* The whole office again, with the seal on it. */}
            <motion.div
              className="pointer-events-none absolute inset-0 grid place-items-center"
              style={{ opacity: finale }}
            >
              <motion.div
                className="flex flex-col items-center rounded-3xl bg-white/90 px-8 py-6 text-center shadow-xl ring-1 ring-green-200 backdrop-blur"
                style={{ scale: finaleScale }}
              >
                <span className="grid size-16 place-items-center rounded-full bg-green-600 ring-8 ring-green-100">
                  <svg viewBox="0 0 24 24" className="size-8" aria-hidden>
                    <path
                      d="M5 12.5 L10 17 L19 7.5"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <p className="mt-3 text-xl font-semibold tracking-tight text-zinc-900">
                  Verified. Safe to buy.
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Title clear, no loans, plan approved, opinion signed.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* The words, one screen each. */}
      <ol className="col-start-1 row-start-1 pt-[48dvh] @4xl:pt-0">
        {STEPS.map((s, i) => (
          <motion.li
            key={s.title}
            className="flex min-h-[100dvh] flex-col justify-center py-10"
            onViewportEnter={() => setStep(i)}
            viewport={{ amount: 0.55 }}
          >
            <motion.div
              initial={{ opacity: 0.25, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.55 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {i === 0 ? (
                <>
                  <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-zinc-900 @3xl:text-6xl">
                    Walk in with your papers. Walk out sure.
                  </h1>
                  <p className="mt-5 max-w-[40ch] text-base leading-relaxed text-zinc-600 @3xl:text-lg">
                    Property lawyers who check the title, loans and approvals
                    before you pay a rupee.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href="#start"
                      className="rounded-full bg-(--p) px-6 py-3 text-sm font-semibold whitespace-nowrap text-(--p-on) transition-transform active:scale-[0.98]"
                    >
                      Verify my property
                    </a>
                    <a
                      href="#services"
                      className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold whitespace-nowrap text-zinc-900 transition-colors hover:border-zinc-900"
                    >
                      Our services
                    </a>
                  </div>
                  <p className="mt-10 text-sm text-zinc-500">
                    Scroll to follow a file through our office.
                  </p>
                </>
              ) : (
                <>
                  <span className="grid size-10 place-items-center rounded-full bg-(--p-light) text-sm font-bold text-(--p-dark)">
                    {i + 1}
                  </span>
                  <h2 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl">
                    {s.title}
                  </h2>
                  <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-zinc-600 @3xl:text-lg">
                    {s.text}
                  </p>
                  {s.points && (
                    <ul className="mt-6 space-y-2.5">
                      {s.points.map((p) => (
                        <li
                          key={p}
                          className="flex items-center gap-3 text-sm font-medium text-zinc-800"
                        >
                          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-green-600">
                            <svg
                              viewBox="0 0 12 12"
                              className="size-3"
                              aria-hidden
                            >
                              <path
                                d="M2.5 6.2 L5 8.5 L9.5 3.8"
                                fill="none"
                                stroke="#ffffff"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                  {i === STEPS.length - 1 && (
                    <a
                      href="#start"
                      className="mt-8 inline-flex rounded-full bg-(--p) px-6 py-3 text-sm font-semibold text-(--p-on)"
                    >
                      Verify my property
                    </a>
                  )}
                </>
              )}
            </motion.div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The rest of the page.                                               */
/* ------------------------------------------------------------------ */

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: {
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  },
};

const SERVICES = [
  {
    name: "Title verification",
    text: "Thirty years of ownership traced, every document cross-checked at the registrar.",
    span: "@3xl:col-span-2 @3xl:row-span-2",
    tone: "bg-(--p) text-(--p-on)",
    big: true,
  },
  {
    name: "Sale agreement drafting",
    text: "Clauses that protect your advance, your dates and your exit.",
    span: "",
    tone: "bg-zinc-50 text-zinc-900",
  },
  {
    name: "Registration support",
    text: "Stamp duty worked out, slot booked, and a lawyer beside you on the day.",
    span: "",
    tone: "bg-(--s-light) text-zinc-900",
  },
  {
    name: "Home loan legal opinion",
    text: "The report banks ask for, in the format they accept.",
    span: "",
    tone: "bg-zinc-50 text-zinc-900",
  },
  {
    name: "NRI property help",
    text: "Power of attorney, video calls and updates in your time zone.",
    span: "",
    tone: "bg-(--p-light) text-zinc-900",
  },
];

/* Sample figures for the template: replace with the firm's own. */
const NUMBERS = [
  { value: "4,860+", label: "Properties verified" },
  { value: "27", label: "Years in property law" },
  { value: "7", label: "Working days to an opinion" },
  { value: "0", label: "Hidden fees" },
];

const REVIEWS = [
  {
    quote:
      "They found a bank charge the seller never mentioned. It was cleared before we paid a rupee.",
    who: "Home buyer, Kondapur",
  },
  {
    quote:
      "I was abroad for all of it. Every update came on WhatsApp and the opinion was ready in a week.",
    who: "NRI buyer, Dubai",
  },
  {
    quote:
      "The plan showed four floors, the building had five. That one check saved our savings.",
    who: "First-time buyer, Whitefield",
  },
];

const FAQS = [
  {
    q: "What do I need to bring?",
    a: "Whatever the seller has shared: the sale deed, previous deeds, tax receipts and the approved plan. Photos are fine to start; we tell you what is missing.",
  },
  {
    q: "How long does verification take?",
    a: "Seven working days for most flats and plots. Older or inherited properties can take longer, and we tell you on day one if yours will.",
  },
  {
    q: "Will my bank accept your legal opinion?",
    a: "Yes. We write it in the format banks and housing finance companies ask for, and answer their lawyers' questions directly.",
  },
  {
    q: "What if you find a problem?",
    a: "We explain it plainly, tell you whether it can be fixed, and what to ask the seller for. Many issues are cleared before the sale.",
  },
];

function Rest() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <section id="services" className="bg-white py-20 @3xl:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <motion.h2
            {...reveal}
            className="max-w-2xl text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
          >
            Everything a property purchase needs from a lawyer.
          </motion.h2>
          <div className="mt-12 grid gap-4 @3xl:grid-cols-4 @3xl:grid-rows-2">
            {SERVICES.map((s, i) => (
              <motion.article
                key={s.name}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className={`flex flex-col justify-end rounded-3xl p-6 ${s.span} ${s.tone} ${s.big ? "min-h-72" : "min-h-44"}`}
              >
                <h3
                  className={`font-semibold tracking-tight ${s.big ? "text-2xl @3xl:text-3xl" : "text-lg"}`}
                >
                  {s.name}
                </h3>
                <p
                  className={`mt-2 text-sm leading-relaxed ${s.big ? "opacity-85" : "text-zinc-600"}`}
                >
                  {s.text}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 @2xl:grid-cols-2 @4xl:grid-cols-4">
          {NUMBERS.map((n, i) => (
            <motion.div
              key={n.label}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.08 }}
            >
              <p className="text-5xl font-semibold tracking-tight text-zinc-900 tabular-nums">
                {n.value}
              </p>
              <p className="mt-2 text-sm text-zinc-600">{n.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-(--p-light) py-20 @3xl:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <motion.h2
            {...reveal}
            className="max-w-2xl text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
          >
            Buyers who checked first.
          </motion.h2>
          <div className="mt-12 grid gap-5 @3xl:grid-cols-[1.3fr_1fr]">
            {REVIEWS.map((r, i) => (
              <motion.figure
                key={r.who}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.08 }}
                className={`rounded-3xl bg-white p-7 ${i === 0 ? "@3xl:row-span-2 @3xl:p-10" : ""}`}
              >
                <blockquote
                  className={`leading-snug font-medium tracking-tight text-zinc-900 ${i === 0 ? "text-2xl @3xl:text-3xl" : "text-lg"}`}
                >
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 text-sm text-zinc-500">
                  {r.who}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 @3xl:py-28">
        <div className="mx-auto max-w-3xl px-5">
          <motion.h2
            {...reveal}
            className="text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
          >
            Questions buyers ask us.
          </motion.h2>
          <ul className="mt-10 divide-y divide-zinc-200 border-y border-zinc-200">
            {FAQS.map((f, i) => (
              <li key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? -1 : i)}
                  aria-expanded={open === i}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold text-zinc-900"
                >
                  {f.q}
                  <motion.span
                    className="grid size-7 shrink-0 place-items-center rounded-full bg-zinc-100 text-lg leading-none text-zinc-700"
                    animate={{ rotate: open === i ? 45 : 0 }}
                    aria-hidden
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[60ch] pb-5 text-sm leading-relaxed text-zinc-600">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="start" className="bg-white px-5 pb-20">
        <motion.div
          {...reveal}
          className="mx-auto flex max-w-6xl flex-col items-start gap-6 rounded-[2rem] bg-zinc-900 p-8 @3xl:flex-row @3xl:items-center @3xl:justify-between @3xl:p-14"
        >
          <div>
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-white @3xl:text-4xl">
              Send us the papers before you pay the advance.
            </h2>
            <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-zinc-400">
              A first look at your documents is free, and we reply within one
              working day.
            </p>
          </div>
          <motion.a
            href="#start"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full bg-(--p) px-7 py-3.5 text-sm font-semibold whitespace-nowrap text-(--p-on)"
          >
            Verify my property
          </motion.a>
        </motion.div>
      </section>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 @3xl:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-base font-semibold text-zinc-900">{BRAND}</p>
            <p className="mt-2 max-w-[40ch] text-sm leading-relaxed text-zinc-600">
              Advocates for property purchase, title and registration.
            </p>
          </div>
          <div className="text-sm text-zinc-600">
            <p className="font-semibold text-zinc-900">Office</p>
            <p className="mt-2">Road No. 12, Banjara Hills</p>
            <p>Hyderabad 500034</p>
          </div>
          <div className="text-sm text-zinc-600">
            <p className="font-semibold text-zinc-900">Contact</p>
            <p className="mt-2">hello@vidhilegal.in</p>
            <p>Mon to Sat, 10am to 7pm</p>
          </div>
        </div>
        <p className="mx-auto max-w-6xl px-5 pb-10 text-xs leading-relaxed text-zinc-500">
          As per the rules of the Bar Council of India, this website is for
          information only and is not an advertisement or a solicitation of
          work.
        </p>
      </footer>
    </>
  );
}

export function LawOfficeScrollSite() {
  return (
    <div className="@container bg-white">
      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-(--p) text-sm font-bold text-(--p-on)">
              V
            </span>
            <span className="text-base font-semibold tracking-tight text-zinc-900">
              {BRAND}
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium text-zinc-600 @3xl:flex">
            <a href="#services" className="hover:text-zinc-900">
              Services
            </a>
            <a href="#start" className="hover:text-zinc-900">
              Contact
            </a>
          </nav>
          <a
            href="#start"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold whitespace-nowrap text-white"
          >
            Verify my property
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5">
        <Story />
      </section>

      <Rest />
    </div>
  );
}
