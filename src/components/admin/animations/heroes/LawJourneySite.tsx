"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  type MotionValue,
} from "motion/react";

/**
 * A whole one-page site for a property law firm (a sample firm), with a
 * client's visit playing on the right as the page scrolls.
 *
 * Built the way scroll-sequence sites are (Apple's product pages, Kiwi's
 * card): a canvas holds still beside the words and draws one frame of a
 * rendered film for each point of the scroll. The frames are consecutive
 * stills of one continuous shot, so moving between neighbours is motion,
 * not a cut, and nothing is ever laid over anything else. Scrolling back
 * plays it backwards.
 *
 * The film lives in public/ as numbered images (SEQUENCE below). Frames
 * load in the background; until one arrives the nearest loaded one is
 * drawn. The canvas is covered edge to edge (cropped, never stretched),
 * and its edge towards the words fades into the page. Colours come from
 * the palette variables (--p, --p-on).
 */

const FIRM = "Ashlar Chambers";

/** The frames: path/01.webp … path/41.webp. Swap for the rendered film. */
const SEQUENCE = {
  path: "/animations/law-journey",
  count: 41,
  digits: 2,
  ext: "webp",
};
const frameSrc = (n: number) =>
  `${SEQUENCE.path}/${String(n).padStart(SEQUENCE.digits, "0")}.${SEQUENCE.ext}`;

/** Draws frame `index` (0-based), or the nearest one that has loaded. */
function paint(
  canvas: HTMLCanvasElement | null,
  frames: HTMLImageElement[],
  index: number,
) {
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;
  const ready = (i: number) => frames[i]?.complete && frames[i].naturalWidth;
  let img: HTMLImageElement | undefined;
  for (let d = 0; d < frames.length && !img; d += 1) {
    if (ready(index - d)) img = frames[index - d];
    else if (ready(index + d)) img = frames[index + d];
  }
  if (!img) return;
  // Cover: fill the canvas, cropping the longer side evenly.
  const scale = Math.max(
    canvas.width / img.naturalWidth,
    canvas.height / img.naturalHeight,
  );
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
}

function Film({ progress }: { progress: MotionValue<number> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const frames = useRef<HTMLImageElement[]>([]);
  const current = useRef(0);

  const at = (v: number) => Math.round(v * (SEQUENCE.count - 1));
  useMotionValueEvent(progress, "change", (v) => {
    const i = at(v);
    if (i === current.current) return;
    current.current = i;
    paint(canvas.current, frames.current, i);
  });

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    current.current = Math.round(progress.get() * (SEQUENCE.count - 1));
    // Every frame requested now; each one redraws if it is the one wanted
    // or nearer to it than what is showing.
    frames.current = Array.from({ length: SEQUENCE.count }, (_, i) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => paint(el, frames.current, current.current);
      img.src = frameSrc(i + 1);
      return img;
    });
    // Sharp on every screen: the canvas is sized to its box in device pixels.
    const ro = new ResizeObserver(([entry]) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(entry.contentRect.width * dpr);
      el.height = Math.round(entry.contentRect.height * dpr);
      paint(el, frames.current, current.current);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      for (const img of frames.current) img.onload = null;
    };
  }, [progress]);

  return (
    <canvas
      ref={canvas}
      role="img"
      aria-label="A client's visit to the chambers, from arriving to leaving with the verified file"
      className="size-full"
    />
  );
}

/* The film's edge towards the words fades into the page. */
const FADE_WIDE =
  "linear-gradient(to right, transparent 0%, #000 24%, #000 100%)";
const FADE_PHONE =
  "linear-gradient(to bottom, #000 0%, #000 70%, transparent 100%)";

function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const eased = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.3,
  });
  const progress = reduce ? scrollYProgress : eased;
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setStep(Math.round(v * (SECTIONS.length - 1))),
  );

  return (
    <div ref={ref} className="relative">
      <div className="sticky top-16 h-[calc(100dvh-4rem)] overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-0 h-[46%] @4xl:inset-y-0 @4xl:right-0 @4xl:left-auto @4xl:h-auto @4xl:w-[56%]">
          <div
            className="size-full [mask-image:var(--fade-phone)] @4xl:[mask-image:var(--fade-wide)]"
            style={
              {
                "--fade-wide": FADE_WIDE,
                "--fade-phone": FADE_PHONE,
              } as React.CSSProperties
            }
          >
            <Film progress={progress} />
          </div>
          <div className="absolute bottom-[16%] left-4 @4xl:bottom-8 @4xl:left-[26%]">
            <AnimatePresence mode="wait">
              <motion.p
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2 rounded-full bg-white/95 py-1.5 pr-3.5 pl-1.5 text-xs font-semibold text-zinc-800 shadow-lg ring-1 ring-zinc-200 @3xl:text-sm"
              >
                <span className="grid size-6 place-items-center rounded-full bg-(--p) text-[0.6875rem] font-bold text-(--p-on) tabular-nums">
                  {step + 1}
                </span>
                {SECTIONS[step].caption}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        <motion.div
          className="absolute inset-x-0 top-0 h-0.5 origin-left bg-(--p)"
          style={{ scaleX: scrollYProgress }}
        />
      </div>

      {/* The sections, one screen each, beside the film. */}
      <div className="relative z-10 mx-auto -mt-[calc(100dvh-4rem)] max-w-6xl px-5">
        {SECTIONS.map((section) => (
          <motion.section
            key={section.id}
            id={section.id}
            className="flex min-h-[100dvh] flex-col justify-end pb-[5dvh] @4xl:justify-center @4xl:pb-0"
            initial={{ opacity: 0.25 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.5 }}
            transition={{ duration: 0.45 }}
          >
            <motion.div
              className="rounded-2xl bg-white/95 p-5 shadow-sm ring-1 ring-zinc-200/80 @4xl:max-w-[42%] @4xl:bg-transparent @4xl:p-0 @4xl:shadow-none @4xl:ring-0"
              initial={{ y: 24 }}
              whileInView={{ y: 0 }}
              viewport={{ amount: 0.5 }}
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

const eyebrow = "text-xs font-semibold tracking-[0.16em] text-(--p) uppercase";
const h2 =
  "mt-3 text-3xl leading-[1.1] font-semibold tracking-tight text-zinc-900 @3xl:text-4xl";
const lede =
  "mt-4 max-w-[48ch] text-base leading-relaxed text-zinc-600 @3xl:text-[1.0625rem]";
const tile = "rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-zinc-200";

const SECTIONS: { id: string; caption: string; body: React.ReactNode }[] = [
  {
    id: "top",
    caption: "Arriving at the chambers",
    body: (
      <>
        <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-zinc-900 @3xl:text-5xl">
          Property law, from the first search to the final registration
        </h1>
        <p className={lede}>
          {FIRM} advises buyers, owners and developers in Bengaluru on titles,
          transactions and the disputes that follow them.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#contact"
            className="rounded-full bg-(--p) px-5 py-3 text-sm font-semibold text-(--p-on) transition-transform active:scale-[0.98]"
          >
            Book a consultation
          </a>
          <a
            href="#practice"
            className="rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition-transform active:scale-[0.98]"
          >
            Practice areas
          </a>
        </div>
      </>
    ),
  },
  {
    id: "about",
    caption: "Welcomed at reception",
    body: (
      <>
        <p className={eyebrow}>About us</p>
        <h2 className={h2}>A chambers built around property</h2>
        <p className={lede}>
          We began as a title practice and grew with our clients into drafting,
          registration, revenue records and, when it comes to it, the courts.
          One team holds your matter from the first document to the last.
        </p>
        <dl className="mt-6 grid gap-2.5 @lg:grid-cols-3">
          {[
            ["Office", "Bengaluru"],
            ["Forums", "Civil courts, High Court of Karnataka, RERA"],
            ["Languages", "English, Kannada, Hindi, Telugu"],
          ].map(([k, v]) => (
            <div key={k} className={tile}>
              <dt className="text-xs font-semibold text-zinc-500">{k}</dt>
              <dd className="mt-1 text-sm font-medium text-zinc-900">{v}</dd>
            </div>
          ))}
        </dl>
      </>
    ),
  },
  {
    id: "practice",
    caption: "Understanding the matter",
    body: (
      <>
        <h2 className="text-3xl leading-[1.1] font-semibold tracking-tight text-zinc-900 @3xl:text-4xl">
          Practice areas
        </h2>
        <p className={lede}>Everything a property needs, under one roof.</p>
        <ul className="mt-6 grid gap-2.5 @lg:grid-cols-2">
          {[
            [
              "Title due diligence",
              "Thirty-year searches and a written opinion.",
            ],
            ["Sale, gift and lease deeds", "Drafted, stamped and registered."],
            ["Khata, mutation and conversion", "Revenue records set right."],
            ["RERA and builder disputes", "Delays, defects and refunds."],
            ["Partition and succession", "Family property, settled fairly."],
            ["Injunctions and civil suits", "Protecting possession in court."],
          ].map(([name, text]) => (
            <li key={name} className={tile}>
              <p className="text-sm font-semibold text-zinc-900">{name}</p>
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
    id: "partners",
    caption: "Counsel from a partner",
    body: (
      <>
        <p className={eyebrow}>Our partners</p>
        <h2 className={h2}>Senior counsel on every matter</h2>
        <p className={lede}>
          A partner reads your file and signs the opinion. You will know who is
          advising you from the first meeting.
        </p>
        <ul className="mt-6 grid gap-2.5">
          {[
            ["Managing Partner", "Title, transactions and registration"],
            ["Partner", "Real estate litigation and injunctions"],
            ["Partner", "RERA and developer advisory"],
          ].map(([role, work], i) => (
            <li key={i} className={`${tile} flex items-center gap-3`}>
              <span
                aria-hidden
                className="size-10 shrink-0 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300"
              />
              <span>
                <span className="block text-sm font-semibold text-zinc-900">
                  {role}
                </span>
                <span className="block text-xs text-zinc-600">{work}</span>
              </span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "team",
    caption: "Every document verified",
    body: (
      <>
        <h2 className="text-3xl leading-[1.1] font-semibold tracking-tight text-zinc-900 @3xl:text-4xl">
          Our team
        </h2>
        <p className={lede}>
          Associates and paralegals who read every page in the chain, go to the
          sub-registrar and revenue offices themselves, and keep you told at
          each step.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {[
            "Associates",
            "Paralegals",
            "Records and searches",
            "Client desk",
          ].map((t) => (
            <li
              key={t}
              className="rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-zinc-800 shadow-sm ring-1 ring-zinc-200"
            >
              {t}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "approach",
    caption: "Research and records",
    body: (
      <>
        <h2 className="text-3xl leading-[1.1] font-semibold tracking-tight text-zinc-900 @3xl:text-4xl">
          How we work
        </h2>
        <ol className="mt-6 grid gap-2.5 @lg:grid-cols-2">
          {[
            ["Listen", "We hear the whole story and collect the papers."],
            ["Verify", "Searches at the sub-registrar, revenue and courts."],
            ["Advise", "A written opinion in plain words, risks named."],
            ["Act", "Drafting, registration or court, through to the end."],
          ].map(([name, text], i) => (
            <li key={name} className={tile}>
              <p className="text-sm font-semibold text-zinc-900">
                <span className="mr-2 text-(--p) tabular-nums">{i + 1}</span>
                {name}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                {text}
              </p>
            </li>
          ))}
        </ol>
      </>
    ),
  },
  {
    id: "insights",
    caption: "The verified file, handed over",
    body: (
      <>
        <p className={eyebrow}>Insights</p>
        <h2 className={h2}>Notes for property owners</h2>
        <ul className="mt-6 divide-y divide-zinc-200 rounded-xl bg-white shadow-sm ring-1 ring-zinc-200">
          {[
            "What an encumbrance certificate shows, and what it does not",
            "Buying a resale flat: the documents to ask for",
            "When a khata transfer stalls, and what to do next",
          ].map((t) => (
            <li key={t}>
              <a
                href="#insights"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-800 hover:text-zinc-950"
              >
                <span className="flex-1">{t}</span>
                <span aria-hidden className="text-zinc-400">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "contact",
    caption: "Leaving with certainty",
    body: (
      <>
        <h2 className="text-3xl leading-[1.1] font-semibold tracking-tight text-zinc-900 @3xl:text-4xl">
          Talk to us
        </h2>
        <p className={lede}>
          Bring the papers you have. We will tell you what is missing, what it
          costs and how long it takes.
        </p>
        <div className="mt-6 grid gap-2.5 @lg:grid-cols-2">
          <div className={tile}>
            <p className="text-sm font-semibold text-zinc-900">Chambers</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-600">
              2nd Floor, Residency Road
              <br />
              Bengaluru, Karnataka
            </p>
          </div>
          <div className={tile}>
            <p className="text-sm font-semibold text-zinc-900">Hours</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-600">
              Monday to Saturday
              <br />
              10am to 7pm, by appointment
            </p>
          </div>
        </div>
        <a
          href="#contact"
          className="mt-6 inline-block rounded-full bg-(--p) px-5 py-3 text-sm font-semibold text-(--p-on) transition-transform active:scale-[0.98]"
        >
          Book a consultation
        </a>
      </>
    ),
  },
];

const NAV = [
  ["About", "#about"],
  ["Practice areas", "#practice"],
  ["Partners", "#partners"],
  ["Team", "#team"],
  ["Insights", "#insights"],
  ["Contact", "#contact"],
];

export function LawJourneySite() {
  return (
    <div className="@container bg-white">
      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-(--p) text-sm font-bold text-(--p-on)">
              A
            </span>
            <span className="text-base font-semibold tracking-tight text-zinc-900">
              {FIRM}
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 @5xl:flex">
            {NAV.map(([label, href]) => (
              <a key={label} href={href} className="hover:text-zinc-900">
                {label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold whitespace-nowrap text-white"
          >
            Book a consultation
          </a>
        </div>
      </header>

      <Journey />

      <footer className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 @3xl:grid-cols-3">
          <div>
            <p className="text-base font-semibold text-zinc-900">{FIRM}</p>
            <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-zinc-600">
              Property and real estate lawyers in Bengaluru.
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-2 text-sm text-zinc-600">
            {NAV.map(([label, href]) => (
              <a key={label} href={href} className="hover:text-zinc-900">
                {label}
              </a>
            ))}
          </nav>
          <div className="text-sm text-zinc-600">
            <p className="font-semibold text-zinc-900">Contact</p>
            <p className="mt-2">hello@ashlarchambers.example</p>
            <p>Monday to Saturday, 10am to 7pm</p>
          </div>
        </div>
        <p className="mx-auto max-w-6xl px-5 pb-10 text-xs leading-relaxed text-zinc-500">
          As per the rules of the Bar Council of India, this website is for
          information only and is not an advertisement or a solicitation of
          work. {FIRM} is a sample firm.
        </p>
      </footer>
    </div>
  );
}
