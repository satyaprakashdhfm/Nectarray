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

/**
 * A whole one-page site for a property law firm, with the client's visit
 * told in pictures behind it.
 *
 * The words sit on the left, one section a screen. The right holds the
 * story still while the page scrolls past it: 41 illustrated frames, from
 * the client arriving at the office, through the conversations and the
 * document checks, to the verified file handed back and the walk out. The
 * scroll is the playhead: each frame dissolves into the next, the outgoing
 * one easing in a touch as the incoming one settles, so a storyboard reads
 * as one continuous scene. The same frames, enlarged and blurred, fill the
 * whole background, and the picture's edges melt into it; a white wash on
 * the left keeps the words the clearest thing on the page.
 *
 * Frames are WebP files in public/animations/deeds-journey/ (01 to 41);
 * swap them for sharper renders of the same story and nothing else
 * changes. Colours come from the palette variables (--p, --p-on).
 */

const BRAND = "Deeds & Co.";
const FRAMES = Array.from(
  { length: 41 },
  (_, i) => `/animations/deeds-journey/${String(i + 1).padStart(2, "0")}.webp`,
);

/* The story's six steps: the first frame of each, and what it shows. */
const STEPS: { from: number; caption: string }[] = [
  { from: 0, caption: "Walks into our office" },
  { from: 3, caption: "Discusses requirements" },
  { from: 12, caption: "We verify documents" },
  { from: 22, caption: "Legal research and checks" },
  { from: 29, caption: "Case handling and legal solutions" },
  { from: 37, caption: "Documents returned, verified" },
];

/*
 * Which frame shows as each section comes into place: the middle of its
 * step, so the step plays out while its words are read. Six sections,
 * one screen each, give the scroll five screens of travel.
 */
const AT = [0, 0.2, 0.4, 0.6, 0.8, 1];
const FRAME_AT = [0, 7, 17, 25.5, 33, FRAMES.length - 1];

/** Feathers every edge of the picture into the blurred background. */
const FEATHER: React.CSSProperties = {
  maskImage:
    "linear-gradient(to right, transparent, #000 16%, #000 90%, transparent), linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)",
  maskComposite: "intersect",
  WebkitMaskImage:
    "linear-gradient(to right, transparent, #000 16%, #000 90%, transparent), linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)",
  WebkitMaskComposite: "source-in",
};

const stepOf = (frame: number) =>
  STEPS.findLastIndex((s) => s.from <= Math.floor(frame));

/**
 * Two frames on top of each other: the current one, and the next fading in
 * over it. Written straight to the elements, so scrolling never re-renders.
 */
function FramePair({
  frame,
  zoom,
  alt,
}: {
  frame: MotionValue<number>;
  zoom: boolean;
  alt: string;
}) {
  const back = useRef<HTMLImageElement>(null);
  const front = useRef<HTMLImageElement>(null);
  const shown = useRef(0);

  const draw = (value: number) => {
    const i = Math.min(Math.floor(value), FRAMES.length - 1);
    const f = value - i;
    const a = back.current;
    const b = front.current;
    if (!a || !b) return;
    if (shown.current !== i) {
      shown.current = i;
      a.src = FRAMES[i];
      b.src = FRAMES[Math.min(i + 1, FRAMES.length - 1)];
    }
    b.style.opacity = String(f);
    if (zoom) {
      // The outgoing frame eases in as the incoming one settles from a
      // touch closer, so the hand-over has no jump.
      a.style.transform = `scale(${1 + 0.04 * f})`;
      b.style.transform = `scale(${1.04 - 0.04 * f})`;
    }
  };
  useMotionValueEvent(frame, "change", draw);
  // A page opened part-way down starts on the right frame.
  // eslint-disable-next-line react-hooks/exhaustive-deps -- once, on mount
  useEffect(() => draw(frame.get()), []);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- copied into other projects, which may not use next/image */}
      <img
        ref={back}
        src={FRAMES[0]}
        alt={alt}
        className="absolute inset-0 size-full object-cover will-change-transform"
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- as above */}
      <img
        ref={front}
        src={FRAMES[1]}
        alt=""
        className="absolute inset-0 size-full object-cover opacity-0 will-change-transform"
      />
    </>
  );
}

function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const eased = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.35,
  });
  const frame = useTransform(reduce ? scrollYProgress : eased, AT, FRAME_AT);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [step, setStep] = useState(0);
  useMotionValueEvent(frame, "change", (v) => setStep(stepOf(v)));

  // Every frame fetched and decoded up front, so scrubbing never waits.
  useEffect(() => {
    for (const src of FRAMES) {
      const img = new Image();
      img.src = src;
      img.decode().catch(() => {});
    }
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="sticky top-16 h-[calc(100dvh-4rem)] overflow-hidden bg-[#fafafa]">
        {/* The story again, large and soft: the background of the page. */}
        <div className="absolute inset-0 scale-110 opacity-60 blur-2xl">
          <FramePair frame={frame} zoom={false} alt="" />
        </div>

        {/* The words read on white: from the left on a wide screen, from
            the bottom on a phone. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/10 @4xl:bg-gradient-to-r @4xl:from-white @4xl:via-white/85 @4xl:to-white/0" />

        {/* The scene itself, edges melting into the background. */}
        <div className="absolute inset-x-3 top-4 aspect-video @4xl:inset-x-auto @4xl:top-1/2 @4xl:right-[2%] @4xl:w-[56%] @4xl:-translate-y-1/2">
          <div className="absolute inset-0 overflow-hidden" style={FEATHER}>
            <FramePair
              frame={frame}
              zoom={!reduce}
              alt="The client's visit to the firm, step by step"
            />
          </div>
          <div className="absolute bottom-[6%] left-[16%] @4xl:bottom-[10%]">
            <AnimatePresence mode="wait">
              <motion.p
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2 rounded-full bg-white/95 py-1.5 pr-3.5 pl-1.5 text-xs font-semibold text-zinc-800 shadow-lg ring-1 ring-zinc-200 @3xl:text-sm"
              >
                <span className="grid size-6 place-items-center rounded-full bg-(--p) text-[0.6875rem] font-bold text-(--p-on)">
                  {step + 1}
                </span>
                {STEPS[step].caption}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          className="absolute inset-x-0 top-0 h-1 origin-left bg-(--p)"
          style={{ scaleX: bar }}
        />
      </div>

      {/* The sections, one screen each, over the story. */}
      <div className="relative z-10 mx-auto -mt-[calc(100dvh-4rem)] max-w-6xl px-5">
        {SECTIONS.map((section, i) => (
          <motion.section
            key={i}
            id={section.id}
            className="flex min-h-[100dvh] flex-col justify-end pb-[6dvh] @4xl:justify-center @4xl:pb-0"
            initial={{ opacity: 0.3 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.55 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="max-w-xl rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-zinc-200/70 backdrop-blur @4xl:max-w-[44%] @4xl:bg-transparent @4xl:p-0 @4xl:shadow-none @4xl:ring-0 @4xl:backdrop-blur-none"
              initial={{ y: 28 }}
              whileInView={{ y: 0 }}
              viewport={{ amount: 0.55 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {section.body}
            </motion.div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}

const h2 =
  "text-3xl leading-[1.1] font-semibold tracking-tight text-zinc-900 @3xl:text-4xl";
const lede =
  "mt-4 max-w-[46ch] text-base leading-relaxed text-zinc-600 @3xl:text-[1.0625rem]";
const textLink =
  "mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-(--p) hover:underline";

const SECTIONS: { id: string; body: React.ReactNode }[] = [
  {
    id: "top",
    body: (
      <>
        <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-zinc-900 @3xl:text-5xl @5xl:text-6xl">
          The title, the deal and the dispute, under one roof
        </h1>
        <p className={lede}>
          Due diligence, drafting and registration, and the partition,
          injunction and RERA cases that follow when paperwork fails.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#contact"
            className="rounded-full bg-(--p) px-5 py-3 text-sm font-semibold text-(--p-on) transition-transform active:scale-[0.98]"
          >
            Book a title check
          </a>
          <a
            href="#services"
            className="rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition-transform active:scale-[0.98]"
          >
            Explore our services
          </a>
        </div>
      </>
    ),
  },
  {
    id: "about",
    body: (
      <>
        <p className="text-xs font-semibold tracking-[0.16em] text-(--p) uppercase">
          About the firm
        </p>
        <h2 className={`mt-3 ${h2}`}>A property practice, start to finish</h2>
        <p className={lede}>
          {BRAND} is a property law practice in Bengaluru. We verify titles,
          draft and register deeds, regularise khata and conversion records, and
          act in the disputes that follow when a property&apos;s paperwork does
          not hold.
        </p>
        <a href="#about" className={textLink}>
          About the firm
          <span aria-hidden>→</span>
        </a>
      </>
    ),
  },
  {
    id: "team",
    body: (
      <>
        <h2 className={h2}>Experienced minds, trusted counsel</h2>
        <p className={lede}>
          Advocates who read every document in the chain before they advise, and
          stay with the file until the records are in your name.
        </p>
        <ul className="mt-6 grid gap-3 @lg:grid-cols-2">
          {[
            ["Founding Partner", "Title, succession and civil disputes"],
            ["Partner, Real Estate", "RERA, development and registration"],
          ].map(([role, work]) => (
            <li
              key={role}
              className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-zinc-200"
            >
              <p className="text-sm font-semibold text-zinc-900">{role}</p>
              <p className="mt-1 text-sm text-zinc-600">{work}</p>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "services",
    body: (
      <>
        <h2 className={h2}>Our services</h2>
        <p className={lede}>
          From title verification to dispute resolution, we cover the full
          property lifecycle.
        </p>
        <ol className="mt-6 divide-y divide-zinc-200 rounded-xl bg-white shadow-sm ring-1 ring-zinc-200">
          {[
            "Title verification and due diligence",
            "Drafting and registration",
            "Khata and conversion",
            "Property disputes (partition, injunction, RERA)",
            "Advisory for home buyers, NRIs and developers",
          ].map((name, i) => (
            <li key={name}>
              <a
                href="#contact"
                className="group flex items-center gap-3 px-4 py-3 text-sm text-zinc-800 hover:text-zinc-950"
              >
                <span className="grid h-6 min-w-8 place-items-center rounded-md bg-(--p) text-xs font-bold text-(--p-on) tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-medium">{name}</span>
                <span
                  aria-hidden
                  className="text-zinc-400 transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </a>
            </li>
          ))}
        </ol>
      </>
    ),
  },
  {
    id: "approach",
    body: (
      <>
        <h2 className={h2}>Our approach</h2>
        <p className={lede}>Clear advice. Careful work. Fewer surprises.</p>
        <ul className="mt-6 grid grid-cols-2 gap-2.5 @lg:grid-cols-3">
          {[
            ["Verify thoroughly", "Every page in the chain, not a summary."],
            ["Explain clearly", "What we found, in plain words."],
            ["Plan pragmatically", "The quickest safe route to done."],
            ["Act efficiently", "Filed and followed up on time."],
            ["Stay with you", "Until the records are in your name."],
          ].map(([title, text]) => (
            <li
              key={title}
              className="rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-zinc-200"
            >
              <p className="text-sm font-semibold text-zinc-900">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                {text}
              </p>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "contact",
    body: (
      <>
        <h2 className={h2}>Our location and careers</h2>
        <p className={lede}>
          Based in Bengaluru. Working with clients across Karnataka and beyond.
        </p>
        <div className="mt-6 grid gap-3 @lg:grid-cols-2">
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-zinc-200">
            <p className="text-sm font-semibold text-zinc-900">Bengaluru</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-600">
              #301, 1st Floor, Brigade Road
              <br />
              Bengaluru, Karnataka
            </p>
            <a
              href="#contact"
              className="mt-3 inline-block text-sm font-semibold text-(--p)"
            >
              Get directions →
            </a>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-zinc-200">
            <p className="text-sm font-semibold text-zinc-900">Careers</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-600">
              We are always interested in hearing from property law
              professionals.
            </p>
            <a
              href="#contact"
              className="mt-3 inline-block text-sm font-semibold text-(--p)"
            >
              View openings →
            </a>
          </div>
        </div>
      </>
    ),
  },
];

export function DeedsJourneySite() {
  return (
    <div className="@container bg-white">
      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a
            href="#top"
            className="rounded-full bg-(--p) px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap text-(--p-on)"
          >
            {BRAND}
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium text-zinc-600 @3xl:flex">
            {[
              ["Home", "#top"],
              ["Our services", "#services"],
              ["Our team", "#team"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="hover:text-zinc-900">
                {label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold whitespace-nowrap text-white"
          >
            Book a title check
          </a>
        </div>
      </header>

      <Journey />

      <footer className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-(--p) px-3 py-1 text-sm font-semibold text-(--p-on)">
              {BRAND}
            </span>
            <span className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">
              Advanced property lawyers, Bengaluru
            </span>
          </div>
          <nav className="flex flex-wrap gap-5 text-sm text-zinc-600">
            <a href="#top" className="hover:text-zinc-900">
              Home
            </a>
            <a href="#services" className="hover:text-zinc-900">
              Our services
            </a>
            <a href="#team" className="hover:text-zinc-900">
              Our team
            </a>
            <a href="#contact" className="hover:text-zinc-900">
              Contact
            </a>
          </nav>
        </div>
        <p className="mx-auto max-w-6xl px-5 pb-8 text-xs leading-relaxed text-zinc-500">
          As per the rules of the Bar Council of India, this website is for
          information only and is not an advertisement or a solicitation of
          work.
        </p>
      </footer>
    </div>
  );
}
