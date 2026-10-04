"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const BREATH = 4; // seconds in, then the same out

/**
 * A soft shape that swells for four seconds and settles for four, changing
 * its outline as it goes, with the cue in the middle following along. Slow
 * on purpose: the motion is the message.
 */
export function HealthBreathing() {
  const [inhale, setInhale] = useState(true);

  useEffect(() => {
    const t = window.setInterval(() => setInhale((v) => !v), BREATH * 1000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <section className="@container overflow-hidden bg-gradient-to-br from-(--s-light) via-white to-(--p-light)">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 @3xl:grid-cols-2 @3xl:py-20">
        <div>
          <motion.h1
            className="text-4xl leading-[1.08] font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Ten quiet minutes a day, with a therapist who checks in
          </motion.h1>
          <motion.p
            className="mt-5 max-w-[44ch] text-base leading-relaxed text-zinc-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            Guided breathing and sleep sessions in Telugu, Hindi and English,
            and a licensed counsellor on chat when a day is harder than most.
          </motion.p>
          <motion.a
            href="#"
            className="mt-8 inline-block rounded-full bg-(--s-dark) px-6 py-3 text-sm font-semibold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            whileHover={{ scale: 1.03 }}
          >
            Start a free week
          </motion.a>
        </div>

        <div className="relative mx-auto grid aspect-square w-full max-w-sm place-items-center">
          {/* Two rings rippling out on each breath in. */}
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-[18%] rounded-full border border-(--s)"
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{
                duration: BREATH * 2,
                repeat: Infinity,
                delay: i * BREATH,
                ease: "easeOut",
              }}
              aria-hidden
            />
          ))}
          <motion.div
            className="absolute inset-[18%] bg-gradient-to-br from-(--s) to-(--p) opacity-80 blur-[2px]"
            animate={{
              scale: [0.85, 1.12, 0.85],
              borderRadius: [
                "42% 58% 60% 40% / 45% 45% 55% 55%",
                "58% 42% 38% 62% / 55% 60% 40% 45%",
                "42% 58% 60% 40% / 45% 45% 55% 55%",
              ],
              rotate: [0, 30, 0],
            }}
            transition={{
              duration: BREATH * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            aria-hidden
          />
          <div className="relative text-center text-white" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.p
                key={inhale ? "in" : "out"}
                className="text-xl font-semibold drop-shadow"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.6 }}
              >
                {inhale ? "Breathe in" : "Breathe out"}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
