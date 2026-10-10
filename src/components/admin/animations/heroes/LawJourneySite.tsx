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
import { ArrowRight } from "lucide-react";
import {
  About,
  Approach,
  CtaBand,
  DEEDS_SHELL,
  DeedsFooter,
  DeedsHeader,
  DisclaimerGate,
  HEADER_HEIGHT,
  Locations,
  Practices,
  Tagline,
  Team,
  WhatsAppFloat,
  display,
  pill,
} from "./DeedsParts";

/**
 * The Deeds & Co. home page (Advanced Property Lawyers, Bengaluru) with the
 * client's visit as its story in place of the hero film.
 *
 * The live site's sections (the hero and the firm's standard, about, the
 * team, practices, approach, locations and careers) run down the left on
 * its alternating bands, built from the same parts as the original in
 * DeedsParts.tsx. On the right, half the width and out to the edge, one
 * picture stays pinned under the header and plays the visit as they pass:
 * he walks in, is shown through, talks it over, a partner reviews the
 * file, every page is checked and stamped, and the file is handed back.
 * Inside a scene only the people move, so a shot dissolves into the next
 * like stop-motion while the scene pushes in slowly; between scenes the
 * cut is quick. The picture fades and blurs into the page towards the
 * words, and a curved line swings down its right part through a node per
 * section, drawn in as the page scrolls, with the current step's caption
 * beside it. On a phone the picture is pinned under the header and the
 * words scroll beneath it. Then the call to action and the footer.
 *
 * The pictures were made with Gemini's image editor and live in
 * public/animations/law-journey/. Each section lists its shots in STEPS.
 * With `full` (the page at /showcase/deeds-and-co/story) it opens with the
 * Bar Council disclaimer and keeps the WhatsApp button in the corner.
 */

const DIR = "/animations/law-journey";
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
                  className={`size-2 rounded-full bg-[#7a0204] transition-opacity duration-500 ${
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
                <span className="grid size-6 place-items-center rounded-full bg-[#7a0204] text-[0.6875rem] font-bold text-white tabular-nums">
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
        className="sticky top-(--hh) z-10 h-[38dvh] overflow-hidden @4xl:order-2 @4xl:h-[calc(100dvh-var(--hh))] @4xl:self-start"
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
              <span className="grid size-5 place-items-center rounded-full bg-[#7a0204] text-[0.625rem] font-bold text-white">
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
            className={`flex scroll-mt-(--hh) flex-col justify-center px-6 py-14 @4xl:min-h-[calc(100dvh-var(--hh))] @4xl:py-20 @4xl:pr-12 @5xl:pl-10`}
          >
            <motion.div
              className="w-full max-w-[44rem]"
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

const STEPS: StepData[] = [
  {
    id: "top",
    caption: "Walks into our office",
    shots: ["1-1", "1-2", "1-3"],
    body: (
      <>
        <p className="inline-flex items-center gap-2.5 text-[0.6875rem] font-semibold tracking-[0.18em] text-[#5e0103] uppercase">
          <span aria-hidden className="w-8 border-t border-[#7a0204]/70" />
          Advanced property lawyers · Bengaluru
        </p>
        <h1
          className={`mt-4 ${display} text-4xl leading-[1.08] font-semibold tracking-tight text-balance @3xl:text-5xl @5xl:text-[3.4rem]`}
        >
          Property lawyers for Bengaluru
        </h1>
        <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-[#5c4446]">
          Title checks, sale deeds, registration and khata, handled by one team
          from the first document to the keys.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#7a0204] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5e0103] active:scale-[0.98]"
          >
            Book a title check <ArrowRight className="size-4" />
          </a>
          <a href="#practices" className={pill}>
            Our practices
          </a>
        </div>
        <div className="mt-14 border-t border-[#ece8e8] pt-8">
          <Tagline className="@xl:text-3xl" />
        </div>
      </>
    ),
  },
  {
    id: "about",
    caption: "Shown through by reception",
    shots: ["1-4", "1-5"],
    body: <About stacked />,
  },
  {
    id: "team",
    caption: "Discusses requirements",
    shots: ["2-1", "2-2", "2-3"],
    body: <Team narrow />,
  },
  {
    id: "practices",
    caption: "A partner reviews the file",
    shots: ["2-4", "2-5", "3-1"],
    body: <Practices stacked />,
  },
  {
    id: "approach",
    caption: "Every page checked and stamped",
    shots: ["3-2", "3-3", "3-4"],
    body: <Approach stacked />,
  },
  {
    id: "careers",
    caption: "Documents handed back",
    shots: ["4-1", "4-2", "4-3", "4-4", "4-5"],
    body: <Locations stacked />,
  },
];

const FRAMES = framesOf(STEPS);

/* ---------- The page ---------- */

export function LawJourneySite({ full = false }: { full?: boolean }) {
  return (
    <div className={DEEDS_SHELL}>
      <div className={HEADER_HEIGHT}>
        {full && <DisclaimerGate />}
        <DeedsHeader />
        <main className="overflow-x-clip">
          <Journey />
          <section className="py-12 @xl:py-16">
            <div className="mx-auto w-full max-w-[100rem] px-6 @5xl:px-10">
              <CtaBand />
            </div>
          </section>
        </main>
        <DeedsFooter />
        {full && <WhatsAppFloat />}
      </div>
    </div>
  );
}
