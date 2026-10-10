"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  ArrowRight,
  Briefcase,
  FileText,
  Handshake,
  MapPin,
  Route,
  ShieldCheck,
  Target,
} from "lucide-react";

/**
 * A whole one-page site for a property law firm (a sample firm), laid out
 * like the "character flow" reference: the sections run down the left, and
 * down the right runs one continuous strip of the client's visit, a picture
 * beside every section, joined by a curved flow with a node and a
 * caption per step. He walks in, talks it through, a partner reviews the
 * file, the documents are checked and stamped, and the file is handed back.
 *
 * Each section's picture plays its own shots as the section scrolls past:
 * inside a scene only the people move, so a shot dissolves into the next
 * like stop-motion; across scenes the cut is quick. The pictures bleed
 * into each other top and bottom, fade into the page on the left, and blur
 * softly towards the words so the eye stays on the text.
 *
 * The pictures were made with Gemini's image editor and live in
 * public/animations/law-journey/ as scene-<scene>-<shot>.webp; the two
 * portraits are cropped from the last scene. A step's shots are listed in
 * STEPS. Colours otherwise come from the palette variables (--p, --p-on).
 */

const FIRM = "Deeds & Co.";
const DIR = "/animations/law-journey";
const PAGE = "#fbf7f1";

const HOLD_IN_SCENE = 0.45;
const HOLD_ACROSS = 0.8;

const ease = (t: number) => t * t * (3 - 2 * t);
const clamp = (t: number) => Math.min(Math.max(t, 0), 1);
const sceneOf = (shot: string) => shot.split("-")[0];

/** How visible shot `i` of `shots` is when the playhead is at `f`. */
function shotOpacity(shots: string[], i: number, f: number) {
  const at = Math.floor(f);
  if (i <= at) return sceneOf(shots[i]) === sceneOf(shots[at]) ? 1 : 0;
  if (i !== at + 1) return 0;
  const hold =
    sceneOf(shots[i]) === sceneOf(shots[at]) ? HOLD_IN_SCENE : HOLD_ACROSS;
  return ease(clamp((f - at - hold) / (1 - hold)));
}

function Shot({
  shots,
  index,
  playhead,
}: {
  shots: string[];
  index: number;
  playhead: MotionValue<number>;
}) {
  const opacity = useTransform(playhead, (f) => shotOpacity(shots, index, f));
  return (
    <motion.img
      src={`${DIR}/scene-${shots[index]}.webp`}
      alt=""
      draggable={false}
      className="absolute inset-0 size-full object-cover object-[62%_50%] will-change-[opacity] select-none"
      style={{ opacity }}
    />
  );
}

function Shots({
  shots,
  playhead,
}: {
  shots: string[];
  playhead: MotionValue<number>;
}) {
  return (
    <>
      {shots.map((shot, i) => (
        <Shot key={shot} shots={shots} index={i} playhead={playhead} />
      ))}
    </>
  );
}

/* Faded out at the top and bottom (into the next picture) and the left. */
const FEATHER_WIDE =
  "linear-gradient(to right, transparent, #000 38%), linear-gradient(to bottom, transparent, #000 16%, #000 84%, transparent)";
const FEATHER_NARROW =
  "linear-gradient(to bottom, transparent, #000 10%, #000 70%, transparent)";
/* The blurred copy shows on the left and is gone by the middle. */
const BLUR_MASK = "linear-gradient(to right, #000 15%, transparent 62%)";

/** One section: the words on the left, its part of the story on the right. */
function Step({
  step,
  index,
  onMount,
}: {
  step: StepData;
  index: number;
  onMount: (el: HTMLElement | null) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const last = step.shots.length - 1;
  const playhead = useTransform(scrollYProgress, [0.3, 0.7], [0, last], {
    clamp: true,
  });
  const scale = useTransform(scrollYProgress, (p) =>
    reduce ? 1.04 : 1.03 + 0.09 * p,
  );
  const y = useTransform(scrollYProgress, (p) =>
    reduce ? "0%" : `${(p - 0.5) * 8}%`,
  );

  return (
    <section
      ref={(el) => {
        ref.current = el;
        onMount(el);
      }}
      id={step.id}
      className="relative grid scroll-mt-16 @4xl:min-h-[88dvh] @4xl:grid-cols-[minmax(0,1fr)_46%]"
    >
      {/* The picture: above the words on a phone, beside them wide. */}
      <div className="relative h-[62vw] max-h-96 @4xl:order-2 @4xl:h-auto @4xl:max-h-none">
        <div
          role="img"
          aria-label={step.caption}
          className="absolute inset-0 overflow-hidden [mask-image:var(--narrow)] [mask-composite:intersect] [-webkit-mask-composite:source-in] [-webkit-mask-image:var(--narrow)] @4xl:-inset-y-[9%] @4xl:[mask-image:var(--wide)] @4xl:[-webkit-mask-image:var(--wide)]"
          style={
            {
              "--wide": FEATHER_WIDE,
              "--narrow": FEATHER_NARROW,
            } as React.CSSProperties
          }
        >
          <motion.div className="absolute inset-0" style={{ scale, y }}>
            <Shots shots={step.shots} playhead={playhead} />
            {/* The same shots, blurred, over the side next to the words. */}
            <div
              aria-hidden
              className="absolute inset-0 hidden @4xl:block"
              style={{
                filter: "blur(9px) saturate(0.9)",
                maskImage: BLUR_MASK,
                WebkitMaskImage: BLUR_MASK,
              }}
            >
              <Shots shots={step.shots} playhead={playhead} />
            </div>
          </motion.div>
        </div>

        {/* The step's caption on the picture (the flow carries it wide). */}
        <motion.p
          className="absolute bottom-4 left-5 flex items-center gap-2 rounded-full bg-white/95 py-1.5 pr-4 pl-1.5 text-xs font-semibold text-zinc-800 shadow-lg ring-1 ring-zinc-200 @4xl:hidden"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="grid size-6 place-items-center rounded-full bg-(--p) text-[0.6875rem] font-bold text-(--p-on) tabular-nums">
            {index + 1}
          </span>
          {step.caption}
        </motion.p>
      </div>

      {/* The words. */}
      <motion.div
        className="relative z-10 flex flex-col justify-center px-5 py-12 @4xl:order-1 @4xl:py-20 @4xl:pr-4 @4xl:pl-[max(1.25rem,calc((100cqw-72rem)/2+1.25rem))]"
        initial={{ opacity: 0.35, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-xl">{step.body}</div>
      </motion.div>
    </section>
  );
}

/** The picture strip's share of the width, wide. */
const STRIP = 0.46;
/** Where each node sits across the strip, swinging from side to side. */
const SWING = [0.16, 0.44];
/** Where each node sits down its section. */
const NODE_AT = 0.56;

type Point = { x: number; y: number };

/** A smooth path through the points, leaving and arriving vertically. */
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

/**
 * The flow over the picture strip: one dashed curve swinging down through
 * a node per section, drawn solid behind the reader as the page scrolls,
 * each node lighting up with its caption as the line reaches it.
 */
function Flow({
  wrap,
  sections,
}: {
  wrap: React.RefObject<HTMLElement | null>;
  sections: React.RefObject<(HTMLElement | null)[]>;
}) {
  const path = useRef<SVGPathElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [nodes, setNodes] = useState<Point[]>([]);
  // y down the path against length along it, to turn scroll into length.
  const table = useRef<{ y: number; l: number }[]>([]);
  const [total, setTotal] = useState(0);
  const [reached, setReached] = useState(-1);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const left = w * (1 - STRIP);
      setSize({ w, h });
      setNodes(
        sections.current.map((s, i) => ({
          x: left + w * STRIP * SWING[i % 2],
          y: s ? s.offsetTop + s.offsetHeight * NODE_AT : 0,
        })),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [wrap, sections]);

  const points =
    nodes.length > 0
      ? [
          { x: nodes[0].x, y: 0 },
          ...nodes,
          { x: nodes[nodes.length - 1].x, y: size.h },
        ]
      : [];
  const d = points.length ? curve(points) : "";

  useEffect(() => {
    const el = path.current;
    if (!el || !d) return;
    const len = el.getTotalLength();
    const rows = [];
    for (let i = 0; i <= 240; i++) {
      const l = (len * i) / 240;
      rows.push({ y: el.getPointAtLength(l).y, l });
    }
    table.current = rows;
    setTotal(len);
  }, [d]);

  // The tip of the line rides a little below the middle of the screen.
  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start 0.68", "end 0.68"],
  });
  const lengthAt = (y: number) => {
    const rows = table.current;
    if (!rows.length) return 0;
    const i = rows.findIndex((r) => r.y >= y);
    if (i <= 0) return i === 0 ? 0 : total;
    const a = rows[i - 1];
    const b = rows[i];
    return a.l + ((y - a.y) / (b.y - a.y || 1)) * (b.l - a.l);
  };
  const offset = useTransform(
    scrollYProgress,
    (p) => total - lengthAt(p * size.h),
  );
  useMotionValueEvent(scrollYProgress, "change", (p) =>
    setReached(nodes.findLastIndex((n) => n.y <= p * size.h + 1)),
  );

  if (!size.w) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 hidden @4xl:block"
    >
      <svg
        width={size.w}
        height={size.h}
        className="absolute inset-0 overflow-visible"
        style={{ filter: "drop-shadow(0 1px 3px rgb(0 0 0 / 0.35))" }}
      >
        <path
          d={d}
          fill="none"
          stroke="white"
          strokeOpacity={0.75}
          strokeWidth={2}
          strokeDasharray="2 9"
          strokeLinecap="round"
        />
        <motion.path
          ref={path}
          d={d}
          fill="none"
          stroke="white"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={total || 1}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      {nodes.map((n, i) => (
        <div
          key={STEPS[i].id}
          className="absolute flex items-center gap-3"
          style={{ left: n.x, top: n.y, transform: "translate(-11px, -50%)" }}
        >
          <span
            className={`grid size-[22px] shrink-0 place-items-center rounded-full border-2 border-white shadow-md transition-all duration-500 ${
              i <= reached ? "scale-100 bg-white" : "scale-75 bg-white/30"
            }`}
          >
            <span
              className={`size-2 rounded-full bg-(--p) transition-opacity duration-500 ${
                i <= reached ? "opacity-100" : "opacity-0"
              }`}
            />
          </span>
          <span
            className={`flex items-center gap-2 rounded-full bg-white/95 py-1.5 pr-4 pl-1.5 text-xs font-semibold whitespace-nowrap text-zinc-800 shadow-lg ring-1 ring-black/5 transition-all duration-500 ${
              i <= reached
                ? "translate-x-0 opacity-100"
                : "-translate-x-2 opacity-0"
            }`}
          >
            <span className="grid size-6 place-items-center rounded-full bg-(--p) text-[0.6875rem] font-bold text-(--p-on) tabular-nums">
              {i + 1}
            </span>
            {STEPS[i].caption}
          </span>
        </div>
      ))}
    </div>
  );
}

const eyebrow =
  "flex items-center gap-3 text-xs font-semibold tracking-[0.16em] text-(--p) uppercase before:h-px before:w-8 before:bg-(--p)";
const serif = "font-serif tracking-tight text-zinc-900";
const h2 = `mt-3 text-3xl leading-[1.1] @3xl:text-4xl ${serif}`;
const lede = "mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-zinc-600";
const card = "rounded-xl bg-white shadow-sm ring-1 ring-zinc-200/80";
const textLink =
  "mt-6 inline-flex items-center gap-1.5 self-start rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:border-(--p) hover:text-(--p)";

type StepData = {
  id: string;
  caption: string;
  shots: string[];
  body: React.ReactNode;
};

const STEPS: StepData[] = [
  {
    id: "top",
    caption: "Walks into our office",
    shots: ["1-1", "1-2", "1-3", "1-4", "1-5"],
    body: (
      <>
        <h1 className={`text-4xl leading-[1.05] @3xl:text-[3.25rem] ${serif}`}>
          The title, the deal and the dispute, under one roof
        </h1>
        <p className={lede}>
          Due diligence, drafting and registration, and the partition,
          injunction and RERA cases that follow when paperwork fails.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-md bg-(--p) px-5 py-3 text-sm font-semibold text-(--p-on) transition-transform active:scale-[0.98]"
          >
            Book a title check <ArrowRight className="size-4" />
          </a>
          <a
            href="#services"
            className="rounded-md border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition-transform active:scale-[0.98]"
          >
            Explore our services
          </a>
        </div>
      </>
    ),
  },
  {
    id: "about",
    caption: "Discusses requirements",
    shots: ["2-1", "2-2", "2-3"],
    body: (
      <>
        <p className={eyebrow}>About the firm</p>
        <h2 className={h2}>A property practice, start to finish</h2>
        <p className={lede}>
          {FIRM} is a property law practice in Bengaluru. We verify titles,
          draft and register deeds, regularise khata and conversion records, and
          act in the disputes that follow when a property&apos;s paperwork does
          not hold.
        </p>
        <dl className="mt-6 grid grid-cols-3 gap-2.5">
          {[
            ["22 yrs", "in practice"],
            ["4,800+", "titles checked"],
            ["3", "forums we appear in"],
          ].map(([k, v]) => (
            <div key={v} className={`${card} p-3.5`}>
              <dt className={`text-xl ${serif}`}>{k}</dt>
              <dd className="mt-0.5 text-xs text-zinc-500">{v}</dd>
            </div>
          ))}
        </dl>
        <a href="#team" className={textLink}>
          About the firm <ArrowRight className="size-4" />
        </a>
      </>
    ),
  },
  {
    id: "team",
    caption: "A partner reviews the file",
    shots: ["2-4", "2-5"],
    body: (
      <>
        <p className={eyebrow}>Our team</p>
        <h2 className={h2}>Experienced minds, trusted counsel</h2>
        <p className={lede}>
          Advocates who read every document in the chain before they advise, and
          stay with the file until the records are in your name.
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-3">
          {[
            ["partner", "Adv. Raghavendra Murthy", "Founding Partner"],
            ["associate", "Adv. Meera Iyer", "Associate, Title & Registration"],
          ].map(([img, name, role]) => (
            <li key={name} className={`${card} overflow-hidden`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- copied into other projects, which may not use next/image */}
              <img
                src={`${DIR}/${img}.webp`}
                alt={name}
                className="aspect-[4/3.4] w-full object-cover"
              />
              <div className="p-3">
                <p className="text-sm font-semibold text-zinc-900">{name}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{role}</p>
              </div>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "services",
    caption: "We verify every document",
    shots: ["3-1", "3-2", "3-3"],
    body: (
      <>
        <p className={eyebrow}>Our services</p>
        <h2 className={h2}>The whole property lifecycle</h2>
        <p className={lede}>
          From title verification to dispute resolution, one team holds your
          matter from the first document to the last.
        </p>
        <ul className={`mt-6 divide-y divide-zinc-200/80 ${card}`}>
          {[
            "Title verification & due diligence",
            "Drafting & registration",
            "Khata & conversion",
            "Property disputes (partition, injunction, RERA)",
            "Advisory for home buyers, NRIs and developers",
          ].map((t, i) => (
            <li key={t}>
              <a
                href="#contact"
                className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-800 hover:text-(--p)"
              >
                <span className="grid h-6 w-8 place-items-center rounded bg-(--p)/10 text-xs font-bold text-(--p) tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">{t}</span>
                <ArrowRight className="size-4 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-(--p)" />
              </a>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "approach",
    caption: "Checked, stamped, signed off",
    shots: ["3-4", "4-1", "4-2"],
    body: (
      <>
        <p className={eyebrow}>Our approach</p>
        <h2 className={h2}>Clear advice. Careful work. Fewer surprises.</h2>
        <ul className="mt-6 grid grid-cols-3 gap-2.5 @lg:grid-cols-5">
          {[
            [ShieldCheck, "Verify thoroughly"],
            [FileText, "Explain clearly"],
            [Route, "Plan pragmatically"],
            [Target, "Act efficiently"],
            [Handshake, "Stay with you"],
          ].map(([Icon, label]) => {
            const I = Icon as typeof ShieldCheck;
            return (
              <li
                key={label as string}
                className={`${card} flex flex-col items-center gap-2 px-2 py-4 text-center`}
              >
                <I className="size-6 text-(--p)" strokeWidth={1.6} />
                <span className="text-xs leading-tight font-medium text-zinc-700">
                  {label as string}
                </span>
              </li>
            );
          })}
        </ul>
      </>
    ),
  },
  {
    id: "contact",
    caption: "Documents returned",
    shots: ["4-3", "4-4", "4-5"],
    body: (
      <>
        <p className={eyebrow}>Location & careers</p>
        <h2 className={h2}>Our location and careers</h2>
        <p className={lede}>
          Based in Bengaluru. Working with clients across Karnataka and beyond.
        </p>
        <div className="mt-6 grid gap-3 @lg:grid-cols-2">
          <div className={`${card} p-4`}>
            <p className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
              <MapPin className="size-4 text-(--p)" /> Bengaluru
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              #301, 1st Floor, Brigade Road
              <br />
              Bengaluru, Karnataka
            </p>
            <a
              href="#contact"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-(--p)"
            >
              Get directions <ArrowRight className="size-3.5" />
            </a>
          </div>
          <div className={`${card} p-4`}>
            <p className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
              <Briefcase className="size-4 text-(--p)" /> Careers
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              We&apos;re always interested in hearing from property law
              professionals.
            </p>
            <a
              href="#contact"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-(--p)"
            >
              View openings <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </>
    ),
  },
];

const NAV = [
  ["Home", "#top"],
  ["Our services", "#services"],
  ["Our team", "#team"],
  ["Approach", "#approach"],
  ["Contact", "#contact"],
];

function Logo() {
  return (
    <span className="rounded-full bg-(--p) px-3.5 py-1.5 font-serif text-sm font-semibold whitespace-nowrap text-(--p-on)">
      {FIRM}
    </span>
  );
}

export function LawJourneySite() {
  const main = useRef<HTMLElement>(null);
  const sections = useRef<(HTMLElement | null)[]>([]);

  // Every shot fetched up front, so scrolling never waits for one.
  useEffect(() => {
    for (const step of STEPS)
      for (const shot of step.shots)
        new Image().src = `${DIR}/scene-${shot}.webp`;
  }, []);

  return (
    <div className="@container" style={{ background: PAGE }}>
      <header
        className="sticky top-0 z-20 border-b border-zinc-200/70 backdrop-blur"
        style={{ background: `${PAGE}e6` }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#top">
            <Logo />
          </a>
          <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 @4xl:flex">
            {NAV.map(([label, href]) => (
              <a key={label} href={href} className="hover:text-(--p)">
                {label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 rounded-md bg-(--p) px-4 py-2 text-sm font-semibold whitespace-nowrap text-(--p-on)"
          >
            Book a title check <ArrowRight className="size-4" />
          </a>
        </div>
      </header>

      <main ref={main} className="relative overflow-x-clip">
        {STEPS.map((step, i) => (
          <Step
            key={step.id}
            step={step}
            index={i}
            onMount={(el) => {
              sections.current[i] = el;
            }}
          />
        ))}
        <Flow wrap={main} sections={sections} />
      </main>

      <footer className="bg-(--p) text-(--p-on)">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-5 py-8">
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-white px-3.5 py-1.5 font-serif text-sm font-semibold text-(--p)">
              {FIRM}
            </span>
            <span className="text-[0.6875rem] leading-snug font-semibold tracking-[0.18em] uppercase opacity-80">
              Advanced property lawyers
              <br />
              Bengaluru
            </span>
          </div>
          <nav className="flex flex-wrap gap-5 text-sm opacity-90">
            {NAV.map(([label, href]) => (
              <a key={label} href={href} className="hover:opacity-100">
                {label}
              </a>
            ))}
          </nav>
        </div>
        <p className="mx-auto max-w-6xl px-5 pb-8 text-xs leading-relaxed opacity-70">
          As per the rules of the Bar Council of India, this website is for
          information only and is not an advertisement or a solicitation of
          work. {FIRM} is a sample firm.
        </p>
      </footer>
    </div>
  );
}
