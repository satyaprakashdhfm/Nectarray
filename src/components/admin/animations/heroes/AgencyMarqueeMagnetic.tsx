"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const rowOne = ["Identity", "Websites", "Packaging", "Motion"];
const rowTwo = ["Strategy", "Campaigns", "Products", "Naming"];

/**
 * Two rows of giant words scrolling opposite ways behind a round button that
 * follows the pointer while it is over it, and springs home when it leaves.
 */
export function AgencyMarqueeMagnetic() {
  return (
    <section className="@container relative isolate overflow-hidden bg-zinc-950 py-16 text-white @3xl:py-20">
      <div className="space-y-2 select-none" aria-hidden>
        <Marquee words={rowOne} seconds={26} />
        <Marquee words={rowTwo} seconds={30} reverse outline />
      </div>

      <div className="relative mx-auto mt-10 flex max-w-6xl flex-col items-start gap-8 px-5 @3xl:flex-row @3xl:items-center @3xl:justify-between">
        <motion.p
          className="max-w-[40ch] text-lg leading-relaxed text-white/75"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Independent design studio for founders who would rather be remembered
          than be safe.
        </motion.p>
        <Magnetic>
          <span className="grid size-32 place-items-center rounded-full bg-(--p) text-center text-sm font-semibold text-(--p-on) @3xl:size-40">
            Let&rsquo;s talk
          </span>
        </Magnetic>
      </div>
    </section>
  );
}

function Marquee({
  words,
  seconds,
  reverse = false,
  outline = false,
}: {
  words: string[];
  seconds: number;
  reverse?: boolean;
  outline?: boolean;
}) {
  // Two copies side by side; moving by exactly half loops with no seam.
  const strip = [...words, ...words];
  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div
        className="flex shrink-0"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: seconds, repeat: Infinity, ease: "linear" }}
      >
        {strip.map((w, i) => (
          <span
            key={i}
            className={`px-6 text-6xl font-semibold tracking-tight @3xl:text-8xl ${
              outline
                ? "text-transparent [-webkit-text-stroke:1.5px_rgb(255_255_255/0.35)]"
                : "text-white"
            }`}
          >
            {w}
            <span className="ml-12 text-(--s)">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 14, mass: 0.4 });

  return (
    <motion.a
      ref={ref}
      href="#"
      className="block"
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const box = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (box.left + box.width / 2)) * 0.35);
        y.set((e.clientY - (box.top + box.height / 2)) * 0.35);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 18 }}
      whileTap={{ scale: 0.92 }}
    >
      {children}
    </motion.a>
  );
}
