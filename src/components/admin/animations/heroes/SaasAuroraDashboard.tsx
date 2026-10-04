"use client";

import { motion, stagger, type Variants } from "motion/react";

const words = ["Ship", "your", "roadmap", "twice", "as", "fast"];

const line: Variants = {
  hidden: {},
  shown: { transition: { delayChildren: stagger(0.08, { startDelay: 0.15 }) } },
};

const word: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  shown: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

const bars = [42, 68, 51, 84, 63, 92, 75];

/**
 * Aurora glow behind a word-by-word headline, and a dashboard that tilts up
 * into place with its bars growing once it lands.
 */
export function SaasAuroraDashboard() {
  return (
    <section className="@container relative isolate overflow-hidden bg-zinc-950 text-white">
      {/* The aurora: three blurred blobs drifting on long, offset loops. */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <motion.div
          className="absolute -top-32 -left-24 size-[28rem] rounded-full bg-(--p) opacity-40 blur-3xl"
          animate={{ x: [0, 120, 0], y: [0, 60, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-10 -right-20 size-[24rem] rounded-full bg-(--s) opacity-30 blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, 80, 0] }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 left-1/3 size-[26rem] rounded-full bg-(--t) opacity-25 blur-3xl"
          animate={{ x: [0, 80, -60, 0], y: [0, -40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-5 pt-16 text-center @3xl:pt-24">
        <motion.span
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="size-1.5 rounded-full bg-(--s)" />
          Version 3 is live
        </motion.span>

        <motion.h1
          className="mx-auto mt-6 flex max-w-[16ch] flex-wrap justify-center gap-x-[0.25em] text-4xl leading-[1.05] font-semibold tracking-tight @3xl:text-6xl"
          variants={line}
          initial="hidden"
          animate="shown"
        >
          {words.map((w) => (
            <motion.span key={w} variants={word} className="inline-block">
              {w}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="mx-auto mt-5 max-w-[46ch] text-base leading-relaxed text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          Plan sprints, track releases and see what is blocked, in one board
          your whole team actually opens.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.5 }}
        >
          <motion.a
            href="#"
            className="rounded-lg bg-(--p) px-5 py-3 text-sm font-semibold text-(--p-on)"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Start free
          </motion.a>
          <a
            href="#"
            className="rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Book a demo
          </a>
        </motion.div>

        {/* The dashboard: tilted back and low, then rising flat. */}
        <div className="mt-14 [perspective:1200px]">
          <motion.div
            className="mx-auto max-w-4xl rounded-t-2xl border border-b-0 border-white/10 bg-zinc-900/80 p-3 shadow-2xl backdrop-blur"
            initial={{ opacity: 0, rotateX: 28, y: 80 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ delay: 0.6, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex gap-1.5 px-1 pb-3" aria-hidden>
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
            </div>
            <div className="grid gap-3 @2xl:grid-cols-[10rem_1fr]">
              <div className="hidden space-y-2 rounded-xl bg-white/5 p-3 @2xl:block">
                {["Board", "Releases", "Insights", "Team"].map((item, i) => (
                  <div
                    key={item}
                    className={`rounded-md px-2 py-1.5 text-left text-xs ${i === 2 ? "bg-(--p) text-(--p-on)" : "text-white/60"}`}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-white/5 p-4">
                <div className="flex items-baseline justify-between">
                  <p className="text-xs text-white/60">Tickets closed</p>
                  <p className="text-lg font-semibold">1,284</p>
                </div>
                <div className="mt-4 flex h-32 items-end gap-2 @2xl:h-40">
                  {bars.map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-(--p-dark) to-(--p)"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{
                        delay: 1.4 + i * 0.07,
                        type: "spring",
                        stiffness: 120,
                        damping: 16,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
