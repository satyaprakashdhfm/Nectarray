"use client";

import { useEffect, useRef, useState } from "react";
import {
  easeInOut,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTime,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowRight, Landmark, Phone } from "lucide-react";
import {
  APPROACH,
  ASSET,
  DEEDS_SHELL,
  DeedsFooter,
  DeedsHeader,
  DisclaimerGate,
  EMAIL,
  HEADER_HEIGHT,
  OVERVIEW,
  PEOPLE,
  PHONE,
  PRACTICES,
  WhatsAppFloat,
  container,
  display,
} from "./DeedsParts";
import { Chair, Desk, Person, type Key } from "./LawOfficeScrollSite";

/**
 * The Deeds & Co. home page with the firm's office, seen from above, as the
 * background of the whole site. A client walks through it as the page
 * scrolls, room by room, and each section of the site pops up out of the
 * room it belongs to: about the firm at reception, the team at their desks,
 * practice areas in the library, the approach in the senior advocate's
 * cabin, articles and publications in the reading corner, and the banks
 * and institutions the firm works with at the meeting table. Then back to
 * reception to get in touch, and the footer.
 *
 * Scroll position is the playhead: each section's centre is a whole number
 * of the story's time (0 the opening, 7 the last call), measured from the
 * sections themselves, so the walk and the camera keep pace with the words
 * however long they wrap. The camera glides to each room and frames it in
 * the part of the screen the card leaves free: the right on a wide screen,
 * the top on a phone. People type and hands swing on the clock, so the
 * office keeps moving while the reader stops to read.
 */

/* ------------------------------------------------------------------ */
/* The plan: rooms, where the client stands in each, and the walk.     */
/* ------------------------------------------------------------------ */

const W = 900;
const H = 600;
const MAROON = "#7a0204";
const MAROON_DEEP = "#5e0103";
const TAN = "#b08968";
const TINT = "#faf1f0";

type Pt = [number, number];

/** Section by section: where the client is, facing, and what the camera shows. */
const STOPS: { at: Pt; face: number; cam: [number, number, number] }[] = [
  { at: [70, 510], face: 90, cam: [300, 400, 640] }, // the door
  { at: [205, 508], face: 0, cam: [210, 455, 440] }, // reception: about
  { at: [410, 205], face: 0, cam: [320, 145, 560] }, // desks: the team
  { at: [750, 205], face: 0, cam: [760, 160, 420] }, // library: practices
  { at: [765, 440], face: 180, cam: [750, 455, 420] }, // cabin: approach
  { at: [352, 520], face: 90, cam: [420, 512, 380] }, // reading corner: articles
  { at: [410, 352], face: 0, cam: [410, 292, 400] }, // meeting table: partners
  { at: [205, 508], face: 0, cam: [450, 300, 1000] }, // reception again: contact
];

/** The corridors between one stop and the next, so nobody walks through a desk. */
const WALKS: Pt[][] = [
  [],
  [
    [310, 500],
    [310, 205],
  ],
  [],
  [
    [665, 270],
    [665, 360],
  ],
  [
    [665, 360],
    [665, 300],
    [560, 300],
    [560, 430],
    [352, 440],
  ],
  [
    [352, 440],
    [410, 405],
  ],
  [
    [410, 405],
    [310, 470],
    [300, 508],
  ],
];

/** The room each section lights up: x, y, width, height. */
const ROOMS: [number, number, number, number][] = [
  [0, 0, 0, 0],
  [100, 380, 220, 170],
  [50, 50, 540, 140],
  [630, 20, 260, 200],
  [620, 330, 270, 260],
  [300, 440, 240, 150],
  [320, 220, 180, 150],
  [100, 380, 220, 170],
];

/** Trees around the building: x, y, radius. */
const TREES: [number, number, number][] = [
  [-90, 90, 44],
  [-70, 330, 36],
  [-110, 640, 48],
  [990, 110, 46],
  [1000, 420, 38],
  [960, 690, 44],
  [220, -80, 40],
  [620, -90, 46],
  [330, 700, 42],
  [720, 690, 36],
];

/** Walking starts this far after a section is centred and ends here. */
const LEAVE = 0.3;
const ARRIVE = 0.85;

const heading = (from: Pt, to: Pt) =>
  (Math.atan2(to[0] - from[0], -(to[1] - from[1])) * 180) / Math.PI;

/** The client's track, as [time, x, y, facing] keys for Person. */
function clientTrack(): Key[] {
  const keys: Key[] = [];
  let face = STOPS[0].face;
  // Facing is unwrapped so a turn takes the short way round.
  const turnTo = (deg: number) => {
    let d = deg - face;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    face += d;
    return face;
  };
  keys.push([0, ...STOPS[0].at, face]);
  for (let i = 0; i < STOPS.length - 1; i++) {
    const path = [STOPS[i].at, ...(WALKS[i] ?? []), STOPS[i + 1].at];
    const legs = path
      .slice(1)
      .map((p, k) => Math.hypot(p[0] - path[k][0], p[1] - path[k][1]));
    const total = legs.reduce((a, b) => a + b, 0) || 1;
    let time = i + LEAVE;
    keys.push([time, ...path[0], face]);
    path.slice(1).forEach((p, k) => {
      const start = time;
      keys.push([start + 0.02, ...path[k], turnTo(heading(path[k], p))]);
      time = start + ((ARRIVE - LEAVE) * legs[k]) / total;
      keys.push([time, ...p, face]);
    });
    keys.push([time + 0.04, ...STOPS[i + 1].at, turnTo(STOPS[i + 1].face)]);
  }
  keys.push([STOPS.length, ...STOPS[STOPS.length - 1].at, face]);
  return keys;
}

const CLIENT = clientTrack();
const END = STOPS.length;
const still = (x: number, y: number, r: number): Key[] => [
  [0, x, y, r],
  [END, x, y, r],
];

/* ------------------------------------------------------------------ */
/* The office.                                                         */
/* ------------------------------------------------------------------ */

type Frame = {
  vw: number;
  stage: { x: number; y: number; w: number; h: number };
};

/** The office fills the screen; the camera frames rooms beside or above the cards. */
function frameFor(width: number, height: number, wide: boolean): Frame {
  const vw = height > 0 ? (H * width) / height : 800;
  return {
    vw,
    stage: wide
      ? { x: vw * 0.47, y: 30, w: vw * 0.5, h: H - 60 }
      : { x: 12, y: 16, w: vw - 24, h: H * 0.4 },
  };
}

function Monitor({
  x,
  y,
  clock,
}: {
  x: number;
  y: number;
  clock: MotionValue<number>;
}) {
  const blink = useTransform(clock, (ms) =>
    Math.sin(ms / 260) > 0 ? 1 : 0.25,
  );
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-30" y="-14" width="60" height="28" rx="4" fill="#2a0a0c" />
      <rect x="-27" y="-11" width="54" height="22" rx="2" fill="#fbf8f7" />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x="-22"
          y={-7 + i * 6}
          width={i === 2 ? 26 : 40}
          height="2.6"
          rx="1.3"
          fill="#ead9d6"
        />
      ))}
      <motion.rect
        x="18"
        y="4"
        width="3"
        height="4"
        fill={MAROON}
        style={{ opacity: blink }}
      />
      <rect x="-24" y="18" width="48" height="8" rx="2" fill="#e7e1df" />
    </g>
  );
}

function Shelf({
  x,
  y,
  w,
  h,
  vertical = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  vertical?: boolean;
}) {
  const n = Math.floor((vertical ? h : w) / 12);
  const colours = [MAROON, MAROON_DEEP, TAN, "#c9b8b4", "#8a2a2c"];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="3" fill="#ece4e2" />
      {Array.from({ length: n }).map((_, i) => (
        <rect
          key={i}
          x={vertical ? x + 3 : x + 4 + i * 12}
          y={vertical ? y + 4 + i * 12 : y + 3}
          width={vertical ? w - 6 : i % 3 === 0 ? 9 : 7}
          height={vertical ? (i % 3 === 0 ? 9 : 7) : h - 6}
          rx="1"
          fill={colours[i % colours.length]}
          opacity={i % 2 ? 0.65 : 0.92}
        />
      ))}
    </g>
  );
}

function Spotlight({ t, index }: { t: MotionValue<number>; index: number }) {
  const opacity = useTransform(
    t,
    [index - 0.45, index - 0.1, index + 0.3, index + 0.6],
    [0, 1, 1, 0],
  );
  const [x, y, w, h] = ROOMS[index];
  if (!w) return null;
  return (
    <motion.rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx="26"
      fill={MAROON}
      fillOpacity="0.07"
      stroke={MAROON}
      strokeOpacity="0.35"
      strokeWidth="2"
      strokeDasharray="8 7"
      style={{ opacity }}
    />
  );
}

function Office({ t, frame }: { t: MotionValue<number>; frame: Frame }) {
  const reduce = useReducedMotion();
  const time = useTime();
  const clock = useTransform(time, (ms) => (reduce ? 0 : ms));

  // The camera holds on a room while its card is read and glides on as the
  // client walks.
  const camTimes: number[] = [];
  const cams: [number, number, number][] = [];
  STOPS.forEach((s, i) => {
    camTimes.push(i);
    cams.push(s.cam);
    if (i < STOPS.length - 1) {
      camTimes.push(i + LEAVE, i + ARRIVE);
      cams.push(s.cam, STOPS[i + 1].cam);
    }
  });
  const glide = { ease: easeInOut };
  const fx = useTransform(
    t,
    camTimes,
    cams.map((c) => c[0]),
    glide,
  );
  const fy = useTransform(
    t,
    camTimes,
    cams.map((c) => c[1]),
    glide,
  );
  const fw = useTransform(
    t,
    camTimes,
    cams.map((c) => c[2]),
    glide,
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

  const always: [number, number][] = [[0, END]];

  return (
    <svg
      viewBox={`0 0 ${frame.vw} ${H}`}
      className="block size-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="The Deeds & Co. office from above. A client walks from reception to the team's desks, the library, the senior advocate's cabin, the reading corner and the meeting table."
    >
      <defs>
        <pattern
          id="tour-paving"
          width="64"
          height="64"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M64 0 H0 V64 M32 0 V32 H64"
            fill="none"
            stroke="#e0d8cc"
            strokeWidth="2"
          />
        </pattern>
        <pattern
          id="tour-tiles"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path d="M40 0 H0 V40" fill="none" stroke="#efe6e4" strokeWidth="1" />
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
        {/* Outside: paving, a stone path to the door, and trees. */}
        <rect x="-3000" y="-3000" width="7000" height="7000" fill="#ebe5dc" />
        <rect
          x="-3000"
          y="-3000"
          width="7000"
          height="7000"
          fill="url(#tour-paving)"
        />
        <rect x="-3000" y="486" width="3000" height="48" fill="#f4efe8" />
        {TREES.map(([x, y, r]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x + 6} cy={y + 8} r={r} fill="#2a0a0c" opacity="0.07" />
            <circle cx={x} cy={y} r={r} fill="#9fb08c" />
            <circle
              cx={x - r * 0.25}
              cy={y - r * 0.25}
              r={r * 0.55}
              fill="#b7c6a4"
            />
          </g>
        ))}
        <rect x="0" y="0" width={W} height={H} rx="10" fill="#fdfbfa" />
        <rect
          x="0"
          y="0"
          width={W}
          height={H}
          rx="10"
          fill="url(#tour-tiles)"
        />
        <rect
          x="0"
          y="0"
          width={W}
          height={H}
          rx="10"
          fill="none"
          stroke="#d9cfcd"
          strokeWidth="6"
        />
        {/* The door on the left, open, with its mat. */}
        <rect x="-4" y="470" width="12" height="80" fill="#fdfbfa" />
        <rect x="14" y="482" width="34" height="56" rx="5" fill="#ead9d6" />

        {ROOMS.map((_, i) => (
          <Spotlight key={i} t={t} index={i} />
        ))}

        {/* Reception: a long desk, the firm's name on the wall behind. */}
        <rect x="100" y="380" width="220" height="170" rx="24" fill={TINT} />
        <Desk x={120} y={420} w={170} h={46} />
        <Monitor x={170} y={440} clock={clock} />
        <circle cx="262" cy="440" r="9" fill="#e7e1df" />
        <text
          x="206"
          y="461"
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="0.12em"
          fill={MAROON}
        >
          DEEDS &amp; CO.
        </text>
        <Chair x={205} y={395} />

        {/* The team's desks along the top. */}
        {[70, 250, 430].map((x) => (
          <g key={x}>
            <Desk x={x} y={70} w={140} h={56} />
            <Monitor x={x + 70} y={88} clock={clock} />
            <Chair x={x + 70} y={150} />
          </g>
        ))}

        {/* The library, top right: shelves on two walls, a reading table. */}
        <Shelf x={640} y={20} w={244} h={24} />
        <Shelf x={860} y={50} w={24} h={170} vertical />
        <Desk x={690} y={110} w={120} h={60} />
        <rect
          x="706"
          y="122"
          width="40"
          height="30"
          rx="2"
          fill="#fbf8f7"
          stroke="#e0d6d4"
        />
        <rect
          x="748"
          y="122"
          width="40"
          height="30"
          rx="2"
          fill="#fbf8f7"
          stroke="#e0d6d4"
        />
        <path
          d="M711 130 H740 M711 137 H736 M753 130 H782 M753 137 H778"
          stroke="#d6c7c4"
          strokeWidth="2"
        />

        {/* The senior advocate's glass cabin, its door on the top wall. */}
        <rect
          x="620"
          y="330"
          width="270"
          height="260"
          rx="8"
          fill={TINT}
          opacity="0.7"
        />
        <path
          d="M640 330 H628 Q620 330 620 338 V582 Q620 590 628 590 H882 Q890 590 890 582 V338 Q890 330 882 330 H690"
          stroke="#c9bdbb"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <Desk x={700} y={470} w={130} h={46} />
        <Monitor x={745} y={490} clock={clock} />
        <rect x="796" y="482" width="20" height="14" rx="3" fill={TAN} />
        <Chair x={765} y={548} r={180} />
        <Chair x={765} y={440} />
        <Shelf x={860} y={360} w={24} h={130} vertical />
        <text
          x="634"
          y="354"
          fontSize="9.5"
          fontWeight="700"
          letterSpacing="0.1em"
          fill="#a8908d"
        >
          SENIOR ADVOCATE
        </text>

        {/* The reading corner: magazines and the firm's papers. */}
        <Shelf x={320} y={566} w={200} h={20} />
        <rect
          x="390"
          y="500"
          width="80"
          height="40"
          rx="10"
          fill="#ffffff"
          stroke="#e0d6d4"
          strokeWidth="1.5"
        />
        <rect
          x="400"
          y="508"
          width="24"
          height="18"
          rx="2"
          fill={MAROON}
          opacity="0.85"
        />
        <rect
          x="430"
          y="510"
          width="26"
          height="20"
          rx="2"
          fill="#fbf8f7"
          stroke="#e0d6d4"
        />
        <rect x="334" y="500" width="36" height="40" rx="12" fill="#e7d6d3" />
        <rect x="490" y="500" width="36" height="40" rx="12" fill="#e7d6d3" />

        {/* The meeting table in the middle. */}
        <rect
          x="330"
          y="250"
          width="160"
          height="80"
          rx="20"
          fill="#ffffff"
          stroke="#d9cfcd"
          strokeWidth="1.5"
        />
        <rect
          x="350"
          y="276"
          width="34"
          height="24"
          rx="2"
          fill="#fbf8f7"
          stroke="#e0d6d4"
        />
        <rect
          x="436"
          y="276"
          width="34"
          height="24"
          rx="2"
          fill="#fbf8f7"
          stroke="#e0d6d4"
        />
        <Chair x={380} y={234} />
        <Chair x={440} y={234} />
        <Chair x={410} y={348} r={180} />

        <g fontSize="9.5" fontWeight="700" letterSpacing="0.1em" fill="#a8908d">
          <text x="70" y="60">
            THE TEAM
          </text>
          <text x="642" y="62">
            LIBRARY
          </text>
          <text x="324" y="558">
            READING CORNER
          </text>
          <text x="330" y="242">
            MEETING ROOM
          </text>
          <text x="104" y="540">
            RECEPTION
          </text>
        </g>

        {/* The firm's people at their places. */}
        <Person
          t={t}
          clock={clock}
          track={still(205, 392, 180)}
          suit={MAROON}
          skin="#c68a5e"
          hair="#2b1d14"
          collar
          typing={always}
        />
        <Person
          t={t}
          clock={clock}
          track={still(140, 150, 0)}
          suit={MAROON_DEEP}
          skin="#8d5a3b"
          hair="#18181b"
          collar
          typing={always}
        />
        <Person
          t={t}
          clock={clock}
          track={still(320, 150, 0)}
          suit={MAROON_DEEP}
          skin="#f1c7a1"
          hair="#4a3426"
          collar
          typing={always}
        />
        <Person
          t={t}
          clock={clock}
          track={still(500, 150, 0)}
          suit={MAROON_DEEP}
          skin="#d9a27a"
          hair="#27272a"
          collar
          typing={always}
        />
        <Person
          t={t}
          clock={clock}
          track={still(765, 552, 0)}
          suit="#2a0a0c"
          skin="#e8b48f"
          hair="#a1a1aa"
          collar
          typing={always}
        />
        {/* Two visitors from a bank at the meeting table. */}
        <Person
          t={t}
          clock={clock}
          track={still(380, 230, 180)}
          suit="#3f4a5a"
          skin="#d9a27a"
          hair="#18181b"
        />
        <Person
          t={t}
          clock={clock}
          track={still(440, 230, 180)}
          suit="#3f4a5a"
          skin="#f1c7a1"
          hair="#6b4a2f"
        />

        {/* The client, walking through. */}
        <Person
          t={t}
          clock={clock}
          track={CLIENT}
          suit={TAN}
          skin="#d9a27a"
          hair="#27272a"
        />
      </motion.g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* The cards that pop out of each room.                                */
/* ------------------------------------------------------------------ */

const ARTICLES = [
  [
    "e-Khata in Bengaluru: what changes for buyers",
    "Property & Real Estate",
    "6 min read",
  ],
  [
    "Reading an encumbrance certificate, line by line",
    "Title verification",
    "5 min read",
  ],
  [
    "BDA or BBMP: whose approval does your flat need?",
    "Approvals",
    "7 min read",
  ],
  [
    "Buying from abroad: a power of attorney for NRIs",
    "NRI services",
    "6 min read",
  ],
] as const;

const label = `text-[0.6875rem] font-semibold tracking-[0.18em] text-[#7a0204] uppercase`;
const title = `${display} mt-2 text-2xl leading-[1.1] font-semibold tracking-tight text-balance text-[#2a0a0c] @3xl:text-4xl`;
const lead = "mt-3 text-[0.9375rem] leading-relaxed text-[#5c4446]";

function Card({
  id,
  children,
  first = false,
}: {
  id?: string;
  children: React.ReactNode;
  first?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <section
      id={id}
      className="relative flex min-h-[calc(100dvh-var(--hh))] items-end py-6 @5xl:items-center @5xl:py-16"
    >
      <div className={`${container} flex`}>
        <motion.div
          initial={
            reduce
              ? false
              : { opacity: 0, scale: 0.55, y: 70, filter: "blur(10px)" }
          }
          whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ amount: 0.35 }}
          transition={{
            type: "spring",
            stiffness: 140,
            damping: 18,
            mass: 0.8,
          }}
          className={`relative w-full origin-top rounded-3xl bg-white/95 p-6 shadow-[0_30px_80px_-35px_rgb(94_1_3/0.45)] ring-1 ring-[#ece8e8] @lg:p-8 @5xl:max-w-[36rem] @5xl:origin-right ${first ? "@5xl:bg-white/90" : ""}`}
        >
          {/* A tail pointing at the room it came out of. */}
          <span
            aria-hidden
            className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rotate-45 bg-white ring-1 ring-[#ece8e8] [clip-path:polygon(0_0,100%_0,0_100%)] @5xl:top-1/2 @5xl:-right-2 @5xl:left-auto @5xl:translate-x-0 @5xl:-translate-y-1/2 @5xl:[clip-path:polygon(0_0,100%_0,100%_100%)]"
          />
          {children}
        </motion.div>
      </div>
    </section>
  );
}

function Sections({
  cards,
}: {
  cards: (el: HTMLElement | null, i: number) => void;
}) {
  const ref = (i: number) => (el: HTMLElement | null) => cards(el, i);
  return (
    <>
      <div ref={ref(0)}>
        <Card first>
          <h1
            className={`${display} text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-[#2a0a0c] @3xl:text-6xl`}
          >
            Property lawyers for Bengaluru.
          </h1>
          <p className={`${lead} @3xl:text-lg`}>
            Title checks, sale deeds, registration and khata, handled by one
            team from the first document to the keys. Scroll, and walk through
            our office.
          </p>
          <div className="mt-7 flex flex-col gap-3 @xl:flex-row">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7a0204] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5e0103] active:scale-[0.98]"
            >
              Book a title check <ArrowRight className="size-4" />
            </a>
            <a
              href="#practices"
              className="inline-flex items-center justify-center rounded-full border border-[#d9d2d2] px-6 py-3 text-sm font-semibold text-[#2a0a0c] transition hover:border-[#7a0204] active:scale-[0.98]"
            >
              Our practices
            </a>
          </div>
        </Card>
      </div>

      <div ref={ref(1)}>
        <Card id="about">
          <p className={label}>About the firm</p>
          <h2 className={title}>A property practice, start to finish.</h2>
          <p className={lead}>{OVERVIEW[0]}</p>
          <p className={lead}>{OVERVIEW[2]}</p>
        </Card>
      </div>

      <div ref={ref(2)}>
        <Card id="team">
          <p className={label}>Meet the team</p>
          <h2 className={title}>Experienced minds, trusted counsel.</h2>
          <ul className="mt-6 grid grid-cols-3 gap-3">
            {PEOPLE.map((p) => (
              <li key={p.name}>
                {/* eslint-disable-next-line @next/next/no-img-element -- copied into other projects, which may not use next/image */}
                <img
                  src={`${ASSET}/person-${p.photo}.webp`}
                  alt=""
                  className="aspect-[4/5] w-full rounded-2xl bg-[#f6f4f4] object-cover"
                />
                <p className="mt-2 text-[0.8125rem] leading-snug font-semibold text-[#2a0a0c]">
                  {p.name}
                </p>
                <p className="text-xs text-[#806a6b]">{p.role}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div ref={ref(3)}>
        <Card id="practices">
          <p className={label}>Practice areas</p>
          <h2 className={title}>Property law at the centre.</h2>
          <ul className="mt-6 grid grid-cols-3 gap-2.5">
            {PRACTICES.map(([slug, name]) => (
              <li
                key={slug}
                className="group relative overflow-hidden rounded-xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- copied into other projects, which may not use next/image */}
                <img
                  src={`${ASSET}/practice-${slug}.webp`}
                  alt=""
                  className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-[#180506]/85 via-[#180506]/30 to-transparent" />
                <span className="absolute inset-x-2 bottom-1.5 text-[0.6875rem] leading-tight font-semibold text-white @lg:text-xs">
                  {name}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div ref={ref(4)}>
        <Card>
          <p className={label}>Our approach</p>
          <h2 className={title}>Five commitments on every matter.</h2>
          <ul className="mt-5 grid gap-3.5">
            {APPROACH.map(([Icon, name, text]) => (
              <li key={name} className="flex gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#faf1f0] text-[#7a0204]">
                  <Icon className="size-4" />
                </span>
                <span>
                  <span className="block text-[0.9375rem] font-semibold text-[#2a0a0c]">
                    {name}
                  </span>
                  <span className="block text-[0.8125rem] leading-relaxed text-[#5c4446]">
                    {text}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div ref={ref(5)}>
        <Card id="insights">
          <p className={label}>Articles and publications</p>
          <h2 className={title}>Notes on Karnataka property law.</h2>
          {/* Sample titles for the preview, until the firm's own are in. */}
          <p className="mt-2 text-xs text-[#806a6b]">
            Sample articles for this preview; the firm&rsquo;s own go here.
          </p>
          <ul className="mt-5 divide-y divide-[#ece8e8]">
            {ARTICLES.map(([name, topic, length]) => (
              <li key={name}>
                <a
                  href="#insights"
                  className="group flex items-center justify-between gap-4 py-3.5"
                >
                  <span>
                    <span className="block text-xs font-semibold text-[#7a0204]">
                      {topic}
                    </span>
                    <span className="mt-0.5 block text-[0.9375rem] leading-snug font-semibold text-[#2a0a0c] group-hover:text-[#7a0204]">
                      {name}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-[#806a6b]">
                    {length}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div ref={ref(6)}>
        <Card id="partners">
          <p className={label}>Our partners</p>
          <h2 className={title}>Banks and institutions we work with.</h2>
          <p className="mt-2 text-xs text-[#806a6b]">
            The banks and housing finance companies the firm works with go here.
          </p>
          <ul className="mt-5 grid grid-cols-2 gap-2.5 @lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <li
                key={i}
                className="flex h-16 items-center justify-center gap-2 rounded-xl border border-dashed border-[#d9d2d2] bg-[#fbf8f7] text-xs font-semibold text-[#806a6b]"
              >
                <Landmark className="size-4" /> Partner bank
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div ref={ref(7)}>
        <Card id="contact">
          <p className={label}>Get in touch</p>
          <h2 className={title}>Tell us about your property.</h2>
          <p className={lead}>
            Send the documents you have. You will hear back within one working
            day, with what we need and what it will cost.
          </p>
          <div className="mt-6 flex flex-col gap-3 @xl:flex-row">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7a0204] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5e0103] active:scale-[0.98]"
            >
              Request Consultation <ArrowRight className="size-4" />
            </a>
            <a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d9d2d2] px-6 py-3 text-sm font-semibold text-[#2a0a0c] transition hover:border-[#7a0204]"
            >
              <Phone className="size-4" /> {PHONE}
            </a>
          </div>
          <p className="mt-4 text-sm text-[#806a6b]">{EMAIL}</p>
        </Card>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* The page.                                                           */
/* ------------------------------------------------------------------ */

const interp = (v: number, xs: number[], ys: number[]) => {
  if (xs.length === 0) return 0;
  if (v <= xs[0]) return ys[0];
  for (let i = 1; i < xs.length; i++) {
    if (v <= xs[i])
      return (
        ys[i - 1] +
        ((v - xs[i - 1]) / (xs[i] - xs[i - 1] || 1)) * (ys[i] - ys[i - 1])
      );
  }
  return ys[ys.length - 1];
};

function Tour() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const anchors = useRef<number[]>([]);
  const [frame, setFrame] = useState<Frame>(() => frameFor(1280, 720, true));
  const { scrollY } = useScroll();
  // Each section's centre is a whole number of the story's time.
  const raw = useTransform(scrollY, (y) =>
    interp(
      y,
      anchors.current,
      anchors.current.map((_, i) => i),
    ),
  );
  const t = useSpring(raw, { stiffness: 70, damping: 22, mass: 0.5 });

  useEffect(() => {
    const el = root.current;
    const box = stage.current;
    if (!el || !box) return;
    const measure = () => {
      const vh = window.innerHeight;
      const hh =
        parseFloat(getComputedStyle(el).getPropertyValue("--hh")) * 16 || 0;
      anchors.current = cards.current.map((c) => {
        if (!c) return 0;
        const r = c.getBoundingClientRect();
        return Math.max(
          0,
          r.top + window.scrollY + r.height / 2 - hh - (vh - hh) / 2,
        );
      });
      raw.set(
        interp(
          window.scrollY,
          anchors.current,
          anchors.current.map((_, i) => i),
        ),
      );
      const { width, height } = box.getBoundingClientRect();
      if (width > 0 && height > 0)
        setFrame(frameFor(width, height, el.clientWidth >= 1024));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [raw]);

  return (
    <div ref={root} className="relative">
      {/* The office, behind the whole page. */}
      <div
        ref={stage}
        aria-hidden
        className="sticky top-(--hh) mb-[calc(var(--hh)-100dvh)] h-[calc(100dvh-var(--hh))] overflow-hidden bg-[#f3e9e7]"
      >
        <Office key={Math.round(frame.vw)} t={t} frame={frame} />
        {/* Calm the floor under the cards: the left on a wide screen, the foot on a phone. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[#fbf6f5] via-[#fbf6f5]/80 to-transparent @5xl:hidden" />
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[48%] bg-gradient-to-r from-[#fbf6f5]/90 via-[#fbf6f5]/55 to-transparent @5xl:block" />
      </div>
      <div className="relative z-10">
        <Sections
          cards={(el, i) => {
            cards.current[i] = el;
          }}
        />
      </div>
    </div>
  );
}

export function DeedsOfficeTour({ full = false }: { full?: boolean }) {
  return (
    <div className={DEEDS_SHELL}>
      <div
        className={`${HEADER_HEIGHT} [&_:is(h1,h2)]:font-[family-name:var(--font-outfit,ui-sans-serif)]`}
      >
        {full && <DisclaimerGate />}
        <DeedsHeader />
        <main id="top" className="overflow-x-clip">
          <Tour />
        </main>
        <DeedsFooter />
        {full && <WhatsAppFloat />}
      </div>
    </div>
  );
}
