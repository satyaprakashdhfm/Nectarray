"use client";

import { motion } from "motion/react";

const lines = ["Handwoven.", "Hand-dyed.", "Yours."];
const ease = [0.76, 0, 0.24, 1] as const;

/**
 * The photo wipes open from the bottom while settling from a slight zoom,
 * the headline rises out of its own lines, and a price tag springs on last.
 */
export function EcommerceMaskReveal() {
  return (
    <section className="@container overflow-hidden bg-(--t-light)">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 @3xl:grid-cols-2 @3xl:py-20">
        <div className="@3xl:order-2">
          <div className="relative">
            <motion.div
              className="overflow-hidden rounded-2xl"
              initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{ duration: 1.1, ease }}
            >
              <motion.img
                src="https://picsum.photos/seed/ikat-saree/900/1100"
                alt="A handwoven ikat saree"
                className="aspect-[4/5] w-full object-cover"
                initial={{ scale: 1.25 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.6, ease }}
              />
            </motion.div>

            <motion.div
              className="absolute -bottom-5 left-5 rounded-xl bg-white px-4 py-3 shadow-lg @3xl:-left-8"
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: -4 }}
              transition={{
                delay: 1.2,
                type: "spring",
                stiffness: 300,
                damping: 14,
              }}
            >
              <p className="text-xs text-zinc-500">Pochampally ikat</p>
              <p className="text-lg font-semibold text-zinc-900">₹8,450</p>
            </motion.div>
          </div>
        </div>

        <div>
          <motion.p
            className="text-xs font-semibold tracking-[0.2em] text-(--t-dark) uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            The monsoon edit
          </motion.p>
          <h1 className="mt-4 text-5xl leading-[1.02] font-semibold tracking-tight text-zinc-900 @3xl:text-7xl">
            {lines.map((text, i) => (
              <span key={text} className="block overflow-hidden pb-1">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.9, ease }}
                >
                  {text}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="mt-6 max-w-[40ch] text-base leading-relaxed text-zinc-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            Thirty-two sarees from weavers in Pochampally, each one a single run
            of the loom. When a design sells out, it is gone.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05 }}
          >
            <motion.a
              href="#"
              className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Shop the edit
            </motion.a>
            <a
              href="#"
              className="rounded-full border border-zinc-900/20 px-6 py-3 text-sm font-semibold text-zinc-900 hover:border-zinc-900"
            >
              Meet the weavers
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
