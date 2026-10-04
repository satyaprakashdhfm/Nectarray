"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const words = ["brands", "websites", "apps", "campaigns"];

/**
 * A headline whose last word rolls through what the studio makes. The word's
 * box is a layout animation, so the underline and the full stop slide to
 * fit each new word instead of jumping.
 */
export function AgencyRollingWords() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = window.setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      2200,
    );
    return () => window.clearInterval(t);
  }, []);

  return (
    <section className="@container overflow-hidden bg-(--p-light)">
      <div className="mx-auto max-w-6xl px-5 py-20 @3xl:py-28">
        <motion.div
          className="flex items-center gap-3 text-sm font-medium text-zinc-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.span
            className="size-2 rounded-full bg-(--s)"
            animate={{ scale: [1, 1.6, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          Booking projects for January
        </motion.div>

        <h1 className="mt-6 text-5xl leading-[1.02] font-semibold tracking-tight text-zinc-900 @3xl:text-7xl @5xl:text-8xl">
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            We make
          </motion.span>
          <span className="flex items-baseline">
            <motion.span
              layout
              className="relative inline-flex overflow-hidden pb-2"
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={words[index]}
                  className="inline-block text-(--p-dark) italic"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>
              <motion.span
                layout
                className="absolute inset-x-0 bottom-0 h-1.5 rounded-full bg-(--s)"
              />
            </motion.span>
            <motion.span layout>.</motion.span>
          </span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.12,
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            people remember.
          </motion.span>
        </h1>

        <motion.div
          className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-zinc-900/10 pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="max-w-[44ch] text-base leading-relaxed text-zinc-700">
            A six-person studio in Hyderabad. Strategy, identity and build,
            under one roof and one invoice.
          </p>
          <motion.a
            href="#"
            className="group inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white"
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
          >
            Start a project
            <motion.span
              variants={{ hover: { x: 4 } }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
