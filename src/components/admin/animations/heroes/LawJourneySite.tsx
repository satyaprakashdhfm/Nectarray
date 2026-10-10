"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Globe,
  Mail,
  MessageCircle,
  MessagesSquare,
  Phone,
  Scale,
  Stamp,
} from "lucide-react";

/**
 * The Deeds & Co. home page (Advanced Property Lawyers, Bengaluru), rebuilt
 * with the client's visit as its story instead of the hero film.
 *
 * The page's sections run down the left. On the right, half the width and
 * out to the edge, one picture stays pinned beside them and plays the
 * visit as the page scrolls: he walks in, is shown through, talks it over,
 * a partner reviews the file, every page is examined, checked and stamped,
 * and the file is handed back. Inside a scene only the people move, so a
 * shot dissolves into the next like stop-motion while the scene pushes in
 * slowly; between scenes the cut is quick. The picture fades and blurs
 * into the page towards the words. Over its right part a curved line
 * swings down through a node per section, drawn in as the page scrolls,
 * and the current step's caption sits beside its node. On a phone the
 * picture is pinned under the header and the words scroll beneath it.
 *
 * The pictures were made with Gemini's image editor and live in
 * public/animations/law-journey/; the firm's photographs, portraits and
 * logo are in its deeds/ folder. Each section lists its shots in STEPS.
 * The accent is the palette variable --p (the firm's maroon, #7a0204, on
 * the full page at /showcase/law-firm). Headings use --font-outfit and
 * body --font-figtree when the page provides them.
 */

const FIRM = "Deeds & Co.";
const DIR = "/animations/law-journey";
const ASSET = `${DIR}/deeds`;
const PAGE = "#ffffff";
const INK = "#2a0a0c";

/* ---------- The story ---------- */

const HOLD_IN_SCENE = 0.45;
const HOLD_ACROSS = 0.8;

const ease = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);
const sceneOf = (shot: string) => shot.split("-")[0];

/** Linear interpolation through (xs, ys), clamped at both ends. */
function interp(x: number, xs: number[], ys: number[]) {
  if (x <= xs[0]) return ys[0];
  for (let i = 1; i < xs.length; i++) {
    if (x <= xs[i]) {
      const t = (x - xs[i - 1]) / (xs[i] - xs[i - 1] || 1);
      return ys[i - 1] + t * (ys[i] - ys[i - 1]);
    }
  }
  return ys[ys.length - 1];
}

type StepData = {
  id: string;
  caption: string;
  shots: string[];
  body: React.ReactNode;
};

/** Every shot in order with its scene, and where each step's shots begin. */
function framesOf(steps: StepData[]) {
  const frames = steps.flatMap((s) =>
    s.shots.map((shot) => ({ shot, scene: sceneOf(shot) })),
  );
  const first = steps.map((_, i) =>
    steps.slice(0, i).reduce((n, s) => n + s.shots.length, 0),
  );
  const scenes = [...new Set(frames.map((f) => f.scene))];
  return { frames, first, scenes };
}

type Frames = ReturnType<typeof framesOf>["frames"];

/** How visible frame `i` is when the playhead is at `f`. */
function shotOpacity(frames: Frames, i: number, f: number) {
  const at = Math.floor(f);
  if (i <= at) return frames[i].scene === frames[at].scene ? 1 : 0;
  if (i !== at + 1) return 0;
  const hold =
    frames[i].scene === frames[at].scene ? HOLD_IN_SCENE : HOLD_ACROSS;
  return ease(clamp01((f - at - hold) / (1 - hold)));
}

function Shot({
  frames,
  index,
  playhead,
}: {
  frames: Frames;
  index: number;
  playhead: MotionValue<number>;
}) {
  const opacity = useTransform(playhead, (f) => shotOpacity(frames, index, f));
  return (
    <motion.img
      src={`${DIR}/scene-${frames[index].shot}.webp`}
      alt=""
      draggable={false}
      className="absolute inset-0 size-full object-cover will-change-[opacity] select-none"
      style={{ opacity }}
    />
  );
}

/** A scene's shots, pushing in slowly while the scene plays. */
function Scene({
  frames,
  scene,
  playhead,
  still,
}: {
  frames: Frames;
  scene: string;
  playhead: MotionValue<number>;
  still: boolean;
}) {
  const first = frames.findIndex((f) => f.scene === scene);
  const length = frames.filter((f) => f.scene === scene).length;
  const scale = useTransform(playhead, (f) =>
    still ? 1.02 : 1.02 + 0.07 * clamp01((f - first) / length),
  );
  return (
    <motion.div className="absolute inset-0" style={{ scale }}>
      {frames.map((frame, i) =>
        frame.scene === scene ? (
          <Shot
            key={frame.shot}
            frames={frames}
            index={i}
            playhead={playhead}
          />
        ) : null,
      )}
    </motion.div>
  );
}

function Story({
  playhead,
  blurred = false,
}: {
  playhead: MotionValue<number>;
  blurred?: boolean;
}) {
  const reduce = useReducedMotion();
  const { frames, scenes } = FRAMES;
  return (
    <div
      className="absolute inset-0"
      aria-hidden={blurred || undefined}
      style={
        blurred
          ? {
              filter: "blur(16px) saturate(0.9)",
              maskImage: BLUR_MASK,
              WebkitMaskImage: BLUR_MASK,
            }
          : undefined
      }
    >
      {scenes.map((scene) => (
        <Scene
          key={scene}
          frames={frames}
          scene={scene}
          playhead={playhead}
          still={Boolean(reduce)}
        />
      ))}
    </div>
  );
}

/* The picture fades in from the words on an eased ramp. */
const FADE =
  "linear-gradient(to right, transparent, rgb(0 0 0 / 0.05) 4%, rgb(0 0 0 / 0.16) 9%, rgb(0 0 0 / 0.34) 14%, rgb(0 0 0 / 0.56) 19%, rgb(0 0 0 / 0.77) 24%, rgb(0 0 0 / 0.92) 29%, #000 34%)";
/* And softens into the page along its foot, where the story ends. */
const FOOT = "linear-gradient(to bottom, #000 88%, transparent)";
/* The blurred copy over it shows towards the words and is gone by a third. */
const BLUR_MASK =
  "linear-gradient(to right, #000 10%, rgb(0 0 0 / 0.6) 20%, rgb(0 0 0 / 0.2) 30%, transparent 40%)";

/* ---------- The curved flow over the picture ---------- */

/** Across the picture: the nodes swing within its right part. */
const SWING = [0.7, 0.88];
type Point = { x: number; y: number };

function curve(points: Point[]) {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const k = (b.y - a.y) * 0.55;
    d += ` C ${a.x} ${a.y + k}, ${b.x} ${b.y - k}, ${b.x} ${b.y}`;
  }
  return d;
}

function FlowLine({
  progress,
  starts,
  active,
}: {
  progress: MotionValue<number>;
  starts: React.RefObject<number[]>;
  active: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const lens = useRef<number[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = STEPS.length;
  const nodes: Point[] = STEPS.map((_, i) => ({
    x: size.w * SWING[i % 2],
    y: size.h * (0.12 + (0.76 * i) / (n - 1)),
  }));
  const d = size.w
    ? curve([
        { x: nodes[0].x, y: 0 },
        ...nodes,
        { x: nodes[n - 1].x, y: size.h * 0.93 },
      ])
    : "";

  // The length along the path at each node, so the line reaches a node
  // exactly as its section arrives.
  useEffect(() => {
    const el = path.current;
    if (!el || !d) return;
    const len = el.getTotalLength();
    const ys = STEPS.map((_, i) => size.h * (0.12 + (0.76 * i) / (n - 1)));
    const out: number[] = [];
    let node = 0;
    for (let i = 0; i <= 400 && node < ys.length; i++) {
      const l = (len * i) / 400;
      const y = el.getPointAtLength(l).y;
      while (node < ys.length && y >= ys[node]) out[node++] = l;
    }
    lens.current = out;
    setTotal(len);
  }, [d, size.h, n]);

  const offset = useTransform(progress, (p) => {
    if (!total || lens.current.length < n) return total;
    return total - interp(p, [...starts.current, 1], [...lens.current, total]);
  });

  return (
    <div
      ref={box}
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden @4xl:block"
    >
      {size.w > 0 && (
        <>
          <svg
            width={size.w}
            height={size.h}
            className="absolute inset-0"
            style={{ filter: "drop-shadow(0 1px 2px rgb(0 0 0 / 0.35))" }}
          >
            <path
              d={d}
              fill="none"
              stroke="white"
              strokeOpacity={0.6}
              strokeWidth={1.75}
              strokeDasharray="2 8"
              strokeLinecap="round"
            />
            <motion.path
              ref={path}
              d={d}
              fill="none"
              stroke="white"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeDasharray={total || 1}
              style={{ strokeDashoffset: offset }}
            />
          </svg>
          {nodes.map((p, i) => (
            <div
              key={STEPS[i].id}
              className="absolute flex flex-row-reverse items-center gap-3"
              style={{
                left: p.x,
                top: p.y,
                transform: "translate(calc(-100% + 11px), -50%)",
              }}
            >
              <span
                className={`grid size-[22px] shrink-0 place-items-center rounded-full border-2 border-white shadow-md transition-all duration-500 ${
                  i <= active ? "scale-100 bg-white" : "scale-75 bg-white/25"
                }`}
              >
                <span
                  className={`size-2 rounded-full bg-(--p) transition-opacity duration-500 ${
                    i <= active ? "opacity-100" : "opacity-0"
                  }`}
                />
              </span>
              <span
                className={`flex items-center gap-2 rounded-full bg-white/95 py-1.5 pr-4 pl-1.5 text-xs font-semibold whitespace-nowrap shadow-lg ring-1 ring-black/5 transition-all duration-500 ${
                  i === active
                    ? "translate-x-0 opacity-100"
                    : "translate-x-2 opacity-0"
                }`}
                style={{ color: INK }}
              >
                <span className="grid size-6 place-items-center rounded-full bg-(--p) text-[0.6875rem] font-bold text-(--p-on) tabular-nums">
                  {i + 1}
                </span>
                {STEPS[i].caption}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/* ---------- The words and the pinned picture ---------- */

function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const eased = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.5,
  });
  const progress = reduce ? scrollYProgress : eased;

  // Where each section arrives in the scroll (its top a little below the
  // middle of the screen), measured, whatever the sections' heights.
  const starts = useRef<number[]>(STEPS.map((_, i) => i / STEPS.length));
  useEffect(() => {
    const wrap = ref.current;
    if (!wrap) return;
    const measure = () => {
      const travel = wrap.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      let last = -1;
      starts.current = sectionRefs.current.map((el, i) => {
        const at =
          i === 0 || !el
            ? 0
            : clamp01((el.offsetTop - window.innerHeight * 0.45) / travel);
        last = Math.max(at, last + 0.0001);
        return last;
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const playhead = useTransform(progress, (p) =>
    interp(
      p,
      [...starts.current, 1],
      [...FRAMES.first, FRAMES.frames.length - 1],
    ),
  );

  const [active, setActive] = useState(0);
  useMotionValueEvent(progress, "change", (p) =>
    setActive(
      Math.max(
        0,
        starts.current.findLastIndex((s) => s <= p + 0.002),
      ),
    ),
  );

  // Every shot fetched up front, so scrolling never waits for one.
  useEffect(() => {
    for (const { shot } of FRAMES.frames)
      new Image().src = `${DIR}/scene-${shot}.webp`;
  }, []);

  return (
    <div
      ref={ref}
      className="relative @4xl:grid @4xl:grid-cols-[minmax(0,1fr)_50%]"
    >
      {/* The picture: pinned under the header, beside the words when wide. */}
      <div
        className="sticky top-16 z-10 h-[38dvh] overflow-hidden @4xl:order-2 @4xl:h-[calc(100dvh-4rem)] @4xl:self-start"
        style={{ background: PAGE }}
      >
        <div
          role="img"
          aria-label="A client walks into the chambers, talks his matter over, and his documents are examined, stamped and handed back"
          className="absolute inset-0 @4xl:[mask-image:var(--fade),var(--foot)] @4xl:[mask-composite:intersect] @4xl:[-webkit-mask-composite:source-in] @4xl:[-webkit-mask-image:var(--fade),var(--foot)]"
          style={{ "--fade": FADE, "--foot": FOOT } as React.CSSProperties}
        >
          <Story playhead={playhead} />
          <div className="hidden @4xl:block">
            <Story playhead={playhead} blurred />
          </div>
        </div>
        {/* A soft fade into the page underneath, on a phone. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/4 @4xl:hidden"
          style={{
            background: `linear-gradient(to top, ${PAGE}, transparent)`,
          }}
        />
        <FlowLine progress={progress} starts={starts} active={active} />
        {/* The caption, on a phone. */}
        <div className="absolute bottom-3 left-4 @4xl:hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 rounded-full bg-white/95 py-1 pr-3 pl-1 text-xs font-semibold shadow-md ring-1 ring-black/5"
              style={{ color: INK }}
            >
              <span className="grid size-5 place-items-center rounded-full bg-(--p) text-[0.625rem] font-bold text-(--p-on)">
                {active + 1}
              </span>
              {STEPS[active].caption}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* The words, one section after another. */}
      <div className="@4xl:order-1">
        {STEPS.map((step, i) => (
          <section
            key={step.id}
            id={step.id}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            className="flex scroll-mt-16 flex-col justify-center px-5 py-14 @4xl:min-h-[calc(100dvh-4rem)] @4xl:py-20 @4xl:pr-10 @4xl:pl-[max(1.25rem,calc((100cqw-76rem)/2+1.25rem))]"
          >
            <motion.div
              className="max-w-[40rem]"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.3, once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {step.body}
            </motion.div>
          </section>
        ))}
      </div>
    </div>
  );
}

/* ---------- Content ---------- */

const display = "font-[family-name:var(--font-outfit,ui-sans-serif)]";
const eyebrow =
  "text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-(--p)";
const h2 = `mt-2 ${display} text-3xl leading-[1.1] font-semibold tracking-tight text-balance @3xl:text-[2.4rem]`;
const lead = "mt-3 max-w-[56ch] text-base leading-relaxed text-[#5c4446]";
const pill =
  "mt-8 inline-flex items-center gap-2 self-start rounded-full border border-[#d9d2d2] px-6 py-3 text-sm font-semibold transition hover:border-(--p) hover:text-(--p) active:scale-[0.98]";
const card = "rounded-2xl border border-[#ece8e8] bg-white";

const TAGLINE =
  "Every document checked. Every deed sealed. Every title clear.".split(" ");

const PEOPLE = [
  ["Adv. Raghavendra Murthy", "Founding Partner"],
  ["Adv. Arjun Nair", "Partner, Real Estate"],
  ["Adv. Kavya Hegde", "Senior Associate"],
  ["Adv. Rohan Iyer", "Associate"],
];

const PRACTICES = [
  ["real-estate-infrastructure", "Real Estate & Infrastructure"],
  ["litigation", "Litigation"],
  ["dispute-resolution", "Alternative Dispute Resolution"],
  ["banking-finance", "Banking & Finance"],
  ["corporate-ma", "Corporate Advisory"],
  ["taxation", "Taxation"],
];

const APPROACH = [
  [
    Scale,
    "Title, verified line by line",
    "Thirty-year chain of title, encumbrance certificates, RTCs and mutation records, read and reconciled before you pay.",
  ],
  [
    Stamp,
    "Registration handled",
    "Stamp duty, Kaveri slots, sub-registrar appointments and the post-registration khata transfer.",
  ],
  [
    MessagesSquare,
    "Updates you can follow",
    "One point of contact and a written status at each stage, so you always know what is pending.",
  ],
  [
    Globe,
    "For NRIs, from abroad",
    "Power of attorney drafting and adjudication, embassy attestation, and purchases and sales completed without travel.",
  ],
  [
    Compass,
    "Practical, not theoretical",
    "Advice that fits the deal in front of you: what to ask the seller for, and what to walk away from.",
  ],
] as const;

const ARTICLES = [
  [
    "Guide",
    "12 Sep 2026",
    "Reading an encumbrance certificate before you buy",
    "What the EC shows, the thirty years it should cover, and the entries that mean you should stop and ask.",
  ],
  [
    "Regulatory update",
    "28 Aug 2026",
    "e-Khata in Bengaluru: what owners need to do now",
    "The new digital khata, the documents it asks for, and how it changes a sale or a loan against the property.",
  ],
];

const STEPS: StepData[] = [
  {
    id: "top",
    caption: "Walks into our office",
    shots: ["1-1", "1-2", "1-3"],
    body: (
      <>
        <p className={eyebrow}>Advanced property lawyers · Bengaluru</p>
        <h1
          className={`mt-3 ${display} text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-balance @3xl:text-[3.4rem]`}
        >
          The title, the deal and the dispute, under one roof
        </h1>
        <p className="mt-5 max-w-[50ch] text-lg leading-relaxed text-[#5c4446]">
          Due diligence, drafting and registration, and the partition,
          injunction and RERA cases that follow when paperwork fails.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-(--p) px-6 py-3 text-sm font-semibold text-(--p-on) transition active:scale-[0.98]"
          >
            Book a title check <ArrowRight className="size-4" />
          </a>
          <a
            href="#practice"
            className="inline-flex items-center gap-2 rounded-full border border-[#d9d2d2] px-6 py-3 text-sm font-semibold transition hover:border-(--p) hover:text-(--p)"
          >
            Explore our services
          </a>
        </div>
        <p
          className={`mt-14 border-t border-[#ece8e8] pt-8 ${display} text-2xl leading-[1.25] font-semibold tracking-tight text-balance @3xl:text-[1.75rem]`}
        >
          {TAGLINE.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              className={`inline-block ${i >= TAGLINE.length - 3 ? "text-(--p)" : ""}`}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.06 }}
            >
              {word}
              {i < TAGLINE.length - 1 ? " " : ""}
            </motion.span>
          ))}
        </p>
      </>
    ),
  },
  {
    id: "about",
    caption: "Shown through by reception",
    shots: ["1-4", "1-5"],
    body: (
      <>
        <p className={eyebrow}>About the firm</p>
        <h2 className={h2}>A property practice, start to finish</h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-[#5c4446]">
          <p>
            {FIRM} is a property law practice in Bengaluru. We verify titles,
            draft and register deeds, regularise khata and conversion records,
            and act in the disputes that follow when a property&apos;s paperwork
            does not hold.
          </p>
          <p>
            Property in Karnataka is decided by its documents: the chain of
            title, the revenue records in Bhoomi, the registered instruments in
            Kaveri, and the municipal and development-authority approvals behind
            them. We read each of them before we advise.
          </p>
          <p>
            We work for home buyers, landowners and families, NRIs managing
            property from abroad, developers, and the banks and businesses that
            lend against or occupy land.
          </p>
        </div>
        <a href="#about" className={pill}>
          About the firm <ArrowRight className="size-3.5" />
        </a>
      </>
    ),
  },
  {
    id: "team",
    caption: "Discusses requirements",
    shots: ["2-1", "2-2", "2-3"],
    body: (
      <>
        <h2 className={h2}>Experienced minds, trusted counsel</h2>
        <p className={lead}>
          Advocates who read every document in the chain before they advise, and
          stay with the file until the records are in your name.
        </p>
        <ul className="mt-8 grid grid-cols-2 gap-4 @6xl:grid-cols-4">
          {PEOPLE.map(([name, role], i) => (
            <li key={name} className="group">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#f6f4f4]">
                {/* eslint-disable-next-line @next/next/no-img-element -- copied into other projects, which may not use next/image */}
                <img
                  src={`${ASSET}/person-${i + 1}.webp`}
                  alt={name}
                  className="size-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <p className="mt-3 text-sm font-semibold">{name}</p>
              <p className="text-xs text-[#806a6b]">{role}</p>
            </li>
          ))}
        </ul>
        <a href="#team" className={pill}>
          Meet the team <ArrowRight className="size-3.5" />
        </a>
      </>
    ),
  },
  {
    id: "practice",
    caption: "A partner reviews the file",
    shots: ["2-4", "2-5"],
    body: (
      <>
        <h2 className={h2}>Practice areas</h2>
        <p className={lead}>
          Property law at the centre, with the corporate, finance, dispute and
          regulatory work that property matters lead into.
        </p>
        <ul className="mt-8 grid grid-cols-2 gap-3 @6xl:grid-cols-3">
          {PRACTICES.map(([slug, name]) => (
            <li key={slug}>
              <a
                href="#practice"
                className="group relative block aspect-[4/3] overflow-hidden rounded-xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- copied into other projects, which may not use next/image */}
                <img
                  src={`${ASSET}/practice-${slug}.webp`}
                  alt=""
                  className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-[1.05]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <span className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 text-sm leading-tight font-semibold text-white">
                  {name}
                  <ArrowUpRight className="size-4 shrink-0 opacity-70 transition group-hover:opacity-100" />
                </span>
              </a>
            </li>
          ))}
        </ul>
        <a href="#practice" className={pill}>
          View all practices <ArrowRight className="size-3.5" />
        </a>
      </>
    ),
  },
  {
    id: "insights",
    caption: "Every page examined",
    shots: ["3-1", "3-2"],
    body: (
      <>
        <h2 className={h2}>Articles and publications</h2>
        <p className={lead}>
          Judgments and rule changes that affect buyers, owners and title in
          Karnataka, in plain English.
        </p>
        <ul className="mt-8 grid gap-4 @6xl:grid-cols-2">
          {ARTICLES.map(([tag, date, title, summary]) => (
            <li key={title}>
              <a
                href="#insights"
                className={`${card} group flex h-full flex-col p-6 transition hover:border-(--p)/40 hover:shadow-lg`}
              >
                <p className="flex items-center gap-3 text-xs text-[#806a6b]">
                  <span className="rounded-full bg-[#faf1f0] px-2.5 py-1 font-semibold text-(--p)">
                    {tag}
                  </span>
                  {date}
                </p>
                <p
                  className={`mt-4 ${display} text-lg leading-snug font-semibold`}
                >
                  {title}
                </p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#5c4446]">
                  {summary}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-(--p)">
                  Read the article
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </a>
            </li>
          ))}
        </ul>
        <a href="#insights" className={pill}>
          All articles <ArrowRight className="size-3.5" />
        </a>
      </>
    ),
  },
  {
    id: "approach",
    caption: "Checked and stamped",
    shots: ["3-3", "3-4"],
    body: (
      <>
        <p className={eyebrow}>Why us</p>
        <h2 className={h2}>Our approach</h2>
        <p className={lead}>Five commitments on every property matter.</p>
        <ol className={`${card} mt-8 divide-y divide-[#ece8e8]`}>
          {APPROACH.map(([Icon, title, body], i) => (
            <li key={title} className="flex gap-4 p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#faf1f0] text-(--p)">
                <Icon className="size-5" strokeWidth={1.6} />
              </span>
              <div>
                <p className="text-sm font-semibold">
                  <span className="mr-2 text-(--p) tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[#5c4446]">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </>
    ),
  },
  {
    id: "contact",
    caption: "Documents handed back",
    shots: ["4-1", "4-2", "4-3", "4-4", "4-5"],
    body: (
      <div className="grid gap-4">
        <article className={`${card} p-6 @3xl:p-8`}>
          <p className={eyebrow}>Locations</p>
          <h2
            className={`mt-2 ${display} text-2xl font-semibold tracking-tight @3xl:text-3xl`}
          >
            Our legal presence
          </h2>
          <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-[#5c4446]">
            Local practice matters in property law: sub-registrar offices, BBMP
            and BDA procedures, and Karnataka&apos;s revenue records each have
            their own ways, and we work with them every day.
          </p>
          <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-5">
            {/* The High Court of Karnataka, in the accent through its own alpha. */}
            <div
              aria-hidden
              className="aspect-[697/260] w-full max-w-[12rem] bg-(--p)/85"
              style={{
                mask: `url(${ASSET}/hc-karnataka.webp) center/contain no-repeat`,
                WebkitMask: `url(${ASSET}/hc-karnataka.webp) center/contain no-repeat`,
              }}
            />
            <div>
              <p className={`${display} text-lg font-semibold`}>Bengaluru</p>
              <p className="mt-1 text-sm leading-relaxed text-[#5c4446]">
                Bengaluru
                <br />
                Karnataka, India
              </p>
            </div>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {["Bengaluru Urban", "Bengaluru Rural", "Across Karnataka"].map(
              (place) => (
                <li
                  key={place}
                  className="rounded-full border border-[#d9d2d2] px-3.5 py-1.5 text-sm"
                >
                  {place}
                </li>
              ),
            )}
          </ul>
        </article>
        <article className={`${card} overflow-hidden`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- copied into other projects, which may not use next/image */}
          <img
            src={`${ASSET}/office-desk.webp`}
            alt=""
            className="aspect-[16/5] w-full object-cover object-[78%_50%]"
          />
          <div className="p-6 @3xl:p-8">
            <h2
              className={`${display} text-2xl font-semibold tracking-tight @3xl:text-3xl`}
            >
              Work with us
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5c4446]">
              We look for advocates who want responsibility early and take the
              time to read a file properly.
            </p>
            <a href="#contact" className={pill}>
              View openings <ArrowRight className="size-3.5" />
            </a>
          </div>
        </article>
      </div>
    ),
  },
];

const FRAMES = framesOf(STEPS);

const NAV = [
  ["About", "#about"],
  ["Services", "#practice"],
  ["Insights", "#insights"],
  ["Careers", "#contact"],
  ["Contact", "#contact"],
];

const CONTACTS = [
  [MessageCircle, "WhatsApp"],
  [Phone, "Call"],
  [Mail, "Email"],
] as const;

/* ---------- The page ---------- */

export function LawJourneySite() {
  return (
    <div
      className="@container font-[family-name:var(--font-figtree,ui-sans-serif)]"
      style={{ background: PAGE, color: INK }}
    >
      <header className="sticky top-0 z-30 border-b border-[#ece8e8] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[76rem] items-center justify-between gap-4 px-5">
          <a href="#top" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- copied into other projects, which may not use next/image */}
            <img
              src={`${ASSET}/logo-oval.webp`}
              alt={FIRM}
              className="h-10 w-auto"
            />
            <span className="hidden flex-col text-[0.55rem] leading-[1.5] tracking-[0.22em] text-[#5c4446] uppercase @lg:flex">
              <span>Advanced Property Lawyers</span>
              <span>Bengaluru</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium text-[#5c4446] @4xl:flex">
            {NAV.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="transition hover:text-(--p)"
              >
                {label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 rounded-full bg-(--p) px-4 py-2 text-sm font-semibold whitespace-nowrap text-(--p-on) @lg:px-5"
          >
            Book a title check
            <ArrowRight className="hidden size-4 @lg:block" />
          </a>
        </div>
      </header>

      <main className="overflow-x-clip">
        <Journey />

        {/* The closing call to action. */}
        <section className="mx-auto max-w-[76rem] px-5 py-14 @3xl:py-20">
          <motion.div
            className="grid gap-6 rounded-2xl bg-(--p) px-6 py-8 text-(--p-on) @3xl:px-10 @3xl:py-10 @5xl:grid-cols-[minmax(0,1fr)_auto] @5xl:items-center @5xl:gap-10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <h2
                className={`max-w-lg ${display} text-2xl font-semibold tracking-tight @3xl:text-3xl`}
              >
                Have a property document you want checked?
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed opacity-85 @3xl:text-base">
                Send us what you have. We will tell you what it shows, what is
                missing and what it will take to make the title clear.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-(--p)"
              >
                Book a title check <ArrowRight className="size-3.5" />
              </a>
              {CONTACTS.map(([Icon, label]) => (
                <a
                  key={label}
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold transition hover:border-white"
                >
                  <Icon className="size-4" /> {label}
                </a>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="text-white/75" style={{ background: "#180506" }}>
        <div className="mx-auto grid max-w-[76rem] gap-10 px-5 py-14 @3xl:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element -- copied into other projects, which may not use next/image */}
            <img
              src={`${ASSET}/logo-white.webp`}
              alt={`${FIRM}, Advanced Property Lawyers, Bengaluru`}
              className="h-20 w-auto"
            />
            <p className="mt-4 max-w-[36ch] text-sm leading-relaxed">
              A property law practice in Bengaluru: title verification, sale
              deeds, registration, khata and RERA work, and property disputes.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-white uppercase">
              Practices
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {PRACTICES.slice(0, 4).map(([slug, name]) => (
                <li key={slug}>
                  <a href="#practice" className="hover:text-white">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-white uppercase">
              The firm
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <p className="mx-auto max-w-[76rem] px-5 py-6 text-xs leading-relaxed text-white/55">
            As per the rules of the Bar Council of India, this website is for
            information only and is not an advertisement or a solicitation of
            work. Clear titles. Registered deeds. No loose ends.
          </p>
        </div>
      </footer>
    </div>
  );
}
