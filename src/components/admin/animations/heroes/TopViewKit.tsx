"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
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
 * The kit behind the top-view scroll websites: a place seen from above,
 * filling the background, with people who walk, carry things and work,
 * played by the reader's scroll while the story's words pass over it.
 *
 * - One playhead, `t`, from 0 to `end`: the story's scroll progress eased by
 *   a spring. Everything that moves is a function of it.
 * - People and objects follow waypoints: [time, x, y, facing in degrees,
 *   0 up, 90 right]. Something carried has no path of its own; `carried`
 *   works it out from whoever holds it, so it never leaves a hand.
 * - A second clock, real time, keeps hands typing and screens blinking
 *   while the scroll rests, so the place never freezes.
 * - The camera shows a box of the world (centre and width) and fits it into
 *   the part of the screen the words leave free: the right of a wide
 *   screen, the top of a phone.
 *
 * World units: the place is drawn in about 800 by 600, and the floor runs
 * on past every edge. Colours come from the palette variables
 * (--p, --s, --t and their -light, -dark, -on shades).
 */

export type Key = [number, number, number, number];
export type Spot = [number, number];
/** [from, to, who or where]: who holds a carried thing, and when. */
export type Hold = [number, number, Key[] | Spot];
/** [time, centre x, centre y, width of the world to show]. */
export type Shot = [number, number, number, number];

export function at(track: Key[], time: number): Key {
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

/** The path of something carried: just in front of whoever holds it. */
export function carried(holds: Hold[], reach = 15): Key[] {
  return holds.flatMap(([from, to, who]) => {
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
      return [t, x + reach * Math.sin(rad), y - reach * Math.cos(rad), r];
    });
  });
}

export const moving = (track: Key[], t: number) => {
  const [, x1, y1] = at(track, t);
  const [, x2, y2] = at(track, t + 0.06);
  return Math.hypot(x2 - x1, y2 - y1) > 0.3;
};

/** 0 before `on`, 1 between, 0 after `off`, with short fades. */
export function useWindow(t: MotionValue<number>, on: number, off: number) {
  return useTransform(t, [on, on + 0.3, off - 0.3, off], [0, 1, 1, 0]);
}

/** 0 until `on`, then 1 from there on. */
export function useFrom(t: MotionValue<number>, on: number, fade = 0.3) {
  return useTransform(t, [on, on + fade], [0, 1]);
}

export function useTrack(t: MotionValue<number>, track: Key[]) {
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

export const turn = {
  transformBox: "fill-box",
  transformOrigin: "center",
} as const;

/* ------------------------------------------------------------------ */
/* People and things.                                                  */
/* ------------------------------------------------------------------ */

export type Look = {
  /** Shoulders: a suit, scrubs, an apron. */
  outfit: string;
  skin: string;
  hair: string;
  /** A white collar at the neck. */
  collar?: boolean;
  /** Something on the head instead of hair: a cap, a helmet. */
  hat?: string;
};

/**
 * Someone seen from above: shoulders, hands, head. Hands swing while they
 * walk and tap during their `busy` spans.
 */
export function Person({
  t,
  clock,
  track,
  look,
  busy = [],
}: {
  t: MotionValue<number>;
  clock: MotionValue<number>;
  track: Key[];
  look: Look;
  busy?: [number, number][];
}) {
  const { x, y, rotate } = useTrack(t, track);
  const working = (tv: number) => busy.some(([a, b]) => tv >= a && tv <= b);
  const left = useTransform([t, clock], ([tv, ms]: number[]) =>
    moving(track, tv)
      ? Math.sin(tv * 16) * 3.5
      : working(tv)
        ? Math.sin(ms / 55) * 1.6 - 3
        : 0,
  );
  const right = useTransform([t, clock], ([tv, ms]: number[]) =>
    moving(track, tv)
      ? -Math.sin(tv * 16) * 3.5
      : working(tv)
        ? Math.cos(ms / 47) * 1.6 - 3
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
          fill={look.skin}
          style={{ y: left }}
        />
        <motion.circle
          cx="13"
          cy="-8"
          r="4.2"
          fill={look.skin}
          style={{ y: right }}
        />
        <ellipse rx="16.5" ry="9.5" fill={look.outfit} />
        {look.collar && <path d="M-4 -9 L0 -3.5 L4 -9 Z" fill="#fafafa" />}
        <circle cy="-1" r="8.6" fill={look.skin} />
        {look.hat ? (
          <>
            <circle cy="0.8" r="9.4" fill={look.hat} />
            <circle
              cy="0.8"
              r="9.4"
              fill="none"
              stroke="#18181b"
              strokeOpacity="0.12"
            />
          </>
        ) : (
          <circle cy="1.7" r="8.1" fill={look.hair} />
        )}
      </motion.g>
    </motion.g>
  );
}

/** Draws its children wherever, and facing however, its track says. */
export function Carried({
  t,
  track,
  children,
}: {
  t: MotionValue<number>;
  track: Key[];
  children: ReactNode;
}) {
  const { x, y, rotate } = useTrack(t, track);
  return (
    <motion.g style={{ x, y }}>
      <motion.g style={{ rotate, ...turn }}>{children}</motion.g>
    </motion.g>
  );
}

export function Desk({
  x,
  y,
  w,
  h,
  fill = "#ffffff",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
}) {
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
        fill={fill}
        stroke="#d4d4d8"
        strokeWidth="1.5"
      />
    </g>
  );
}

export function Chair({ x, y, r = 0 }: { x: number; y: number; r?: number }) {
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

/**
 * A screen seen from above, lit from `on`. `kind` decides what it shows:
 * bars that fill while the work runs, a heartbeat, or a plan.
 */
export function Screen({
  t,
  clock,
  x,
  y,
  on,
  off,
  w = 66,
  h = 30,
  kind = "bars",
  stand = true,
}: {
  t: MotionValue<number>;
  clock: MotionValue<number>;
  x: number;
  y: number;
  on: number;
  off: number;
  w?: number;
  h?: number;
  kind?: "bars" | "pulse" | "plan";
  stand?: boolean;
}) {
  const glow = useFrom(t, on);
  const progress = useTransform(t, [on, off], [0, 1]);
  const blink = useTransform(clock, (ms) => (Math.sin(ms / 260) > 0 ? 1 : 0.2));
  const sweep = useTransform(
    clock,
    (ms) => -w / 2 + 4 + ((ms / 1400) % 1) * (w - 10),
  );
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
        {kind === "plan" && (
          <g stroke="var(--p)" strokeWidth="1" fill="none">
            <rect
              x={-w / 2 + 6}
              y={-h / 2 + 5}
              width={w / 2 - 6}
              height={h - 10}
            />
            <rect x={2} y={-h / 2 + 5} width={w / 2 - 8} height={h / 2 - 5} />
          </g>
        )}
        {kind === "pulse" && (
          <>
            <path
              d={`M${-w / 2 + 4} 2 h${w * 0.2} l4 -9 l5 16 l4 -7 h${w * 0.45}`}
              fill="none"
              stroke="#16a34a"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <motion.rect
              y={-h / 2 + 2}
              width="6"
              height={h - 4}
              fill="#f8fafc"
              opacity="0.85"
              style={{ x: sweep }}
            />
          </>
        )}
        {kind === "bars" &&
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
          ))}
        <motion.rect
          x={w / 2 - 8}
          y={h / 2 - 7}
          width="3"
          height="4"
          fill="var(--p)"
          style={{ opacity: blink }}
        />
      </motion.g>
      {stand && (
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

/** A green tick and a few words that pop up where something got done. */
export function Chip({
  t,
  at: on,
  x,
  y,
  text,
}: {
  t: MotionValue<number>;
  at: number;
  x: number;
  y: number;
  text: string;
}) {
  const opacity = useTransform(t, [on, on + 0.3], [0, 1]);
  const scale = useTransform(t, [on, on + 0.2, on + 0.4], [0.6, 1.08, 1]);
  const width = text.length * 5.6 + 30;
  return (
    <motion.g style={{ opacity, scale, x, y, ...turn }}>
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
        {text}
      </text>
    </motion.g>
  );
}

/** A small grey floor label: RECEPTION, LAB. */
export function Label({
  x,
  y,
  children,
}: {
  x: number;
  y: number;
  children: string;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize="9.5"
      fontWeight="600"
      letterSpacing="0.08em"
      fill="#a1a1aa"
    >
      {children}
    </text>
  );
}

/** A floor zone: a soft rug in the palette's light tint. */
export function Zone({
  x,
  y,
  w,
  h,
  r = 24,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={r}
      fill="var(--p-light)"
      opacity="0.28"
    />
  );
}

/** A glass entrance on the left edge, slid open, with its mat. */
export function Entrance({ y = 505 }: { y?: number }) {
  return (
    <g>
      <path
        d={`M20 ${y - 49} V${y - 31} M20 ${y + 31} V${y + 49}`}
        stroke="#cbd5e1"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect
        x="26"
        y={y - 27}
        width="34"
        height="56"
        rx="5"
        fill="var(--s-light)"
      />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* The stage: the place behind everything, the words over it.          */
/* ------------------------------------------------------------------ */

type Frame = {
  vw: number;
  vh: number;
  stage: { x: number; y: number; w: number; h: number };
  wide: boolean;
};

function frameFor(width: number, height: number): Frame {
  const vh = 600;
  const vw = height > 0 ? (600 * width) / height : 800;
  const wide = width >= 896;
  return {
    vw,
    vh,
    wide,
    stage: wide
      ? { x: vw * 0.42, y: 20, w: vw * 0.58 - 20, h: vh - 40 }
      : { x: 0, y: 30, w: vw, h: vh * 0.5 },
  };
}

export const FLOOR = "#fafafa";

function Scene({
  t,
  frame,
  shots,
  world,
  label,
  floor,
}: {
  t: MotionValue<number>;
  frame: Frame;
  shots: Shot[];
  world: (t: MotionValue<number>, clock: MotionValue<number>) => ReactNode;
  label: string;
  floor: "tiles" | "plank" | "concrete";
}) {
  const reduce = useReducedMotion();
  const time = useTime();
  const clock = useTransform(time, (ms) => (reduce ? 0 : ms));
  const id = useId().replace(/:/g, "");
  const times = shots.map((c) => c[0]);
  const fx = useTransform(
    t,
    times,
    shots.map((c) => c[1]),
  );
  const fy = useTransform(
    t,
    times,
    shots.map((c) => c[2]),
  );
  const fw = useTransform(
    t,
    times,
    shots.map((c) => c[3]),
  );
  const { stage } = frame;
  const zoom = useTransform(fw, (w) =>
    Math.min(stage.w / w, stage.h / (w * 0.75)),
  );
  const camX = useTransform(
    [fx, zoom],
    ([x, z]: number[]) => stage.x + stage.w / 2 - x * z,
  );
  const camY = useTransform(
    [fy, zoom],
    ([y, z]: number[]) => stage.y + stage.h / 2 - y * z,
  );

  return (
    <svg
      viewBox={`0 0 ${frame.vw} ${frame.vh}`}
      className="block size-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label}
    >
      <defs>
        <pattern
          id={`floor-${id}`}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          {floor === "tiles" && (
            <path
              d="M40 0 H0 V40"
              fill="none"
              stroke="#ececef"
              strokeWidth="1"
            />
          )}
          {floor === "plank" && (
            <path
              d="M0 0 H40 M0 20 H40 M14 0 V20 M32 20 V40"
              fill="none"
              stroke="#ececef"
              strokeWidth="1"
            />
          )}
          {floor === "concrete" && (
            <>
              <circle cx="9" cy="12" r="0.9" fill="#e4e4e7" />
              <circle cx="29" cy="31" r="0.9" fill="#e4e4e7" />
              <path
                d="M40 0 H0 V40"
                fill="none"
                stroke="#f0f0f2"
                strokeWidth="1"
              />
            </>
          )}
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
        <rect x="-3000" y="-3000" width="6800" height="6600" fill={FLOOR} />
        <rect
          x="-3000"
          y="-3000"
          width="6800"
          height="6600"
          fill={`url(#floor-${id})`}
        />
        {world(t, clock)}
      </motion.g>
    </svg>
  );
}

export type StoryStep = { title: string; text: string; points?: string[] };

function Tick() {
  return (
    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-green-600">
      <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
        <path
          d="M2.5 6.2 L5 8.5 L9.5 3.8"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

/**
 * The pinned story. The first step is the hero; each step is a screen of
 * scrolling, so the playhead reaches about end / steps for each one.
 */
export function ScrollStory({
  end,
  shots,
  world,
  label,
  floor = "tiles",
  hero,
  steps,
  finale,
  cta,
}: {
  end: number;
  shots: Shot[];
  world: (t: MotionValue<number>, clock: MotionValue<number>) => ReactNode;
  label: string;
  floor?: "tiles" | "plank" | "concrete";
  hero: {
    title: string;
    text: string;
    primary: string;
    secondary: string;
    hint: string;
  };
  steps: StoryStep[];
  finale: { title: string; text: string };
  cta: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState<Frame>(() => frameFor(1280, 720));
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const eased = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });
  const t = useTransform(eased, [0, 1], [0, end]);
  const [step, setStep] = useState(0);
  const finaleOpacity = useTransform(t, [end - 0.8, end - 0.2], [0, 1]);
  const finaleScale = useTransform(
    t,
    [end - 0.8, end - 0.4, end - 0.1],
    [0.6, 1.08, 1],
  );
  const bar = useTransform(t, [0, end], [0, 1]);
  const all = [{ title: hero.title, text: hero.text }, ...steps];

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setFrame(frameFor(width, height));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative">
      <div
        ref={stageRef}
        className="sticky top-16 h-[calc(100dvh-4rem)] overflow-hidden"
        style={{ background: FLOOR }}
      >
        <Scene
          key={`${Math.round(frame.vw)}-${frame.wide}`}
          t={t}
          frame={frame}
          shots={shots}
          world={world}
          label={label}
          floor={floor}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-[#fafafa] via-[#fafafa]/90 to-transparent @4xl:hidden" />
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[50%] bg-gradient-to-r from-[#fafafa] via-[#fafafa]/85 to-transparent @4xl:block" />
        <motion.div
          className="absolute inset-x-0 top-0 h-1 origin-left bg-(--p)"
          style={{ scaleX: bar }}
        />
        <div className="absolute top-3 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-700 shadow-sm ring-1 ring-zinc-200">
          Step {step + 1} of {all.length}
        </div>
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 grid h-[50%] place-items-center @4xl:inset-y-0 @4xl:right-0 @4xl:left-[42%] @4xl:h-auto"
          style={{ opacity: finaleOpacity }}
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
              {finale.title}
            </p>
            <p className="mt-1 text-sm text-zinc-600">{finale.text}</p>
          </motion.div>
        </motion.div>
      </div>

      <ol className="relative z-10 mx-auto -mt-[calc(100dvh-4rem)] max-w-6xl px-5">
        {all.map((s, i) => (
          <motion.li
            key={s.title}
            className="flex min-h-[100dvh] flex-col justify-end pb-[7dvh] @4xl:justify-center @4xl:pb-0"
            onViewportEnter={() => setStep(i)}
            viewport={{ amount: 0.55 }}
          >
            <motion.div
              className="max-w-md"
              initial={{ opacity: 0.25, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.55 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {i === 0 ? (
                <>
                  <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-zinc-900 @3xl:text-6xl">
                    {hero.title}
                  </h1>
                  <p className="mt-5 max-w-[40ch] text-base leading-relaxed text-zinc-600 @3xl:text-lg">
                    {hero.text}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href="#start"
                      className="rounded-full bg-(--p) px-6 py-3 text-sm font-semibold whitespace-nowrap text-(--p-on) transition-transform active:scale-[0.98]"
                    >
                      {hero.primary}
                    </a>
                    <a
                      href="#services"
                      className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold whitespace-nowrap text-zinc-900 transition-colors hover:border-zinc-900"
                    >
                      {hero.secondary}
                    </a>
                  </div>
                  <p className="mt-10 text-sm text-zinc-500">{hero.hint}</p>
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
                  {"points" in s && s.points && (
                    <ul className="mt-6 space-y-2.5">
                      {s.points.map((p) => (
                        <li
                          key={p}
                          className="flex items-center gap-3 text-sm font-medium text-zinc-800"
                        >
                          <Tick />
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                  {i === all.length - 1 && (
                    <a
                      href="#start"
                      className="mt-8 inline-flex rounded-full bg-(--p) px-6 py-3 text-sm font-semibold text-(--p-on)"
                    >
                      {cta}
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
/* The rest of the site: nav, services, numbers, reviews, questions.   */
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

export function SiteNav({
  brand,
  mark,
  links,
  cta,
}: {
  brand: string;
  mark: string;
  links: { label: string; href: string }[];
  cta: string;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <a href="#" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-(--p) text-sm font-bold text-(--p-on)">
            {mark}
          </span>
          <span className="text-base font-semibold tracking-tight text-zinc-900">
            {brand}
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-medium text-zinc-600 @3xl:flex">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="hover:text-zinc-900">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#start"
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold whitespace-nowrap text-white"
        >
          {cta}
        </a>
      </div>
    </header>
  );
}

export type SiteContent = {
  servicesTitle: string;
  /** Five: the first is the big tile. */
  services: { name: string; text: string }[];
  /** Sample figures: replace with the business's own. */
  numbers: { value: string; label: string }[];
  reviewsTitle: string;
  reviews: { quote: string; who: string }[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  closing: { title: string; text: string; cta: string };
  footer: {
    brand: string;
    about: string;
    address: string[];
    contact: string[];
    note?: string;
  };
};

const TONES = [
  "bg-(--p) text-(--p-on)",
  "bg-zinc-50 text-zinc-900",
  "bg-(--s-light) text-zinc-900",
  "bg-zinc-50 text-zinc-900",
  "bg-(--p-light) text-zinc-900",
];

export function SiteSections({ content: c }: { content: SiteContent }) {
  const [open, setOpen] = useState(0);
  return (
    <>
      <section id="services" className="bg-white py-20 @3xl:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <motion.h2
            {...reveal}
            className="max-w-2xl text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
          >
            {c.servicesTitle}
          </motion.h2>
          <div className="mt-12 grid gap-4 @3xl:grid-cols-4 @3xl:grid-rows-2">
            {c.services.map((s, i) => (
              <motion.article
                key={s.name}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className={`flex flex-col justify-end rounded-3xl p-6 ${TONES[i % TONES.length]} ${
                  i === 0
                    ? "min-h-72 @3xl:col-span-2 @3xl:row-span-2"
                    : "min-h-44"
                }`}
              >
                <h3
                  className={`font-semibold tracking-tight ${i === 0 ? "text-2xl @3xl:text-3xl" : "text-lg"}`}
                >
                  {s.name}
                </h3>
                <p
                  className={`mt-2 text-sm leading-relaxed ${i === 0 ? "opacity-85" : "text-zinc-600"}`}
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
          {c.numbers.map((n, i) => (
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
            {c.reviewsTitle}
          </motion.h2>
          <div className="mt-12 grid gap-5 @3xl:grid-cols-[1.3fr_1fr]">
            {c.reviews.map((r, i) => (
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
            {c.faqTitle}
          </motion.h2>
          <ul className="mt-10 divide-y divide-zinc-200 border-y border-zinc-200">
            {c.faqs.map((f, i) => (
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
              {c.closing.title}
            </h2>
            <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-zinc-400">
              {c.closing.text}
            </p>
          </div>
          <motion.a
            href="#start"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full bg-(--p) px-7 py-3.5 text-sm font-semibold whitespace-nowrap text-(--p-on)"
          >
            {c.closing.cta}
          </motion.a>
        </motion.div>
      </section>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 @3xl:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-base font-semibold text-zinc-900">
              {c.footer.brand}
            </p>
            <p className="mt-2 max-w-[40ch] text-sm leading-relaxed text-zinc-600">
              {c.footer.about}
            </p>
          </div>
          <div className="text-sm text-zinc-600">
            <p className="font-semibold text-zinc-900">Visit</p>
            {c.footer.address.map((l, i) => (
              <p key={l} className={i === 0 ? "mt-2" : ""}>
                {l}
              </p>
            ))}
          </div>
          <div className="text-sm text-zinc-600">
            <p className="font-semibold text-zinc-900">Contact</p>
            {c.footer.contact.map((l, i) => (
              <p key={l} className={i === 0 ? "mt-2" : ""}>
                {l}
              </p>
            ))}
          </div>
        </div>
        {c.footer.note && (
          <p className="mx-auto max-w-6xl px-5 pb-10 text-xs leading-relaxed text-zinc-500">
            {c.footer.note}
          </p>
        )}
      </footer>
    </>
  );
}
