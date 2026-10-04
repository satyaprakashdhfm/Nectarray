"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

const text =
  "Your everyday deserves a little more. Daily chai, coffee, cab rides and groceries — everything you already pay for on UPI, now with a credit card behind it.";
// Words picked out in colour as they fill.
const accent = new Set(["chai,", "coffee,", "cab", "rides", "groceries"]);

/**
 * A paragraph that fills in word by word as the reader scrolls, pinned in
 * the middle of the screen until the last word lands — the scroll is the
 * playhead. Clouds drift behind it on their own.
 *
 * The section is three screens tall and the text is sticky inside it, so
 * the fill takes two screens of scrolling. It needs no ancestor with
 * `overflow: hidden`, which would stop the sticky from sticking; use
 * `overflow: clip` instead if something has to be cut off.
 */
export function ScrollWordFill() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const words = text.split(" ");
  const hintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <section
      ref={ref}
      className="@container relative h-[300vh] bg-gradient-to-b from-(--p-light) to-white"
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-clip px-5">
        <Clouds />
        <p className="relative mx-auto max-w-4xl text-center text-3xl leading-[1.25] font-semibold tracking-tight @3xl:text-5xl">
          {words.map((word, i) => (
            <Word
              key={i}
              progress={scrollYProgress}
              range={[i / words.length, (i + 1) / words.length]}
              accent={accent.has(word)}
            >
              {word}
            </Word>
          ))}
        </p>
        <motion.p
          className="absolute bottom-8 text-xs font-medium tracking-[0.25em] text-zinc-500 uppercase"
          style={{ opacity: hintOpacity }}
        >
          Scroll to read ↓
        </motion.p>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  accent,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
}) {
  // Spread over 85% of the scroll so the paragraph is complete before the
  // section unpins, and holds a moment fully filled.
  const opacity = useTransform(
    progress,
    range.map((r) => r * 0.85),
    [0.15, 1],
  );
  const y = useTransform(
    progress,
    range.map((r) => r * 0.85),
    [6, 0],
  );
  return (
    <motion.span
      className={`inline-block ${accent ? "text-(--s-dark)" : "text-zinc-900"}`}
      style={{ opacity, y }}
    >
      {children}&nbsp;
    </motion.span>
  );
}

function Clouds() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {[
        "top-[12%] -left-24 h-28 w-96",
        "top-[60%] -right-32 h-32 w-[28rem]",
        "bottom-[8%] left-[20%] h-24 w-80",
      ].map((cls, i) => (
        <motion.div
          key={cls}
          className={`absolute rounded-full bg-white blur-2xl ${cls}`}
          animate={{ x: [0, i % 2 ? -80 : 80, 0] }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
