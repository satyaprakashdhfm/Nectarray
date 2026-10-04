"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/**
 * A full-bleed photo that creeps in slowly on its own (a Ken Burns zoom),
 * and on scroll the photo sinks while the text rises and fades — two layers
 * at different speeds, which is all parallax is.
 */
export function TravelParallaxZoom() {
  const ref = useRef<HTMLElement>(null);
  // 0 when the hero's top meets the viewport's top, 1 when its bottom does.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const textFade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="@container relative isolate flex min-h-[34rem] items-end overflow-hidden @3xl:min-h-[40rem]"
    >
      <motion.div className="absolute inset-0 -z-10" style={{ y: photoY }}>
        <motion.img
          src="https://picsum.photos/seed/kerala-backwaters/1800/1200"
          alt=""
          className="size-full object-cover"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1.3 }}
          transition={{
            duration: 24,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "linear",
          }}
        />
      </motion.div>
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-zinc-950/85 via-zinc-950/30 to-transparent"
        aria-hidden
      />

      <motion.div
        className="mx-auto w-full max-w-6xl px-5 pb-14 @3xl:pb-20"
        style={{ y: textY, opacity: textFade }}
      >
        <motion.p
          className="text-xs font-semibold tracking-[0.25em] text-white/80 uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Alleppey, Kerala
        </motion.p>
        <motion.h1
          className="mt-4 max-w-[16ch] text-5xl leading-[1.02] font-semibold tracking-tight text-white @3xl:text-7xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          Two nights on the backwaters
        </motion.h1>
        <motion.div
          className="mt-8 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
        >
          <motion.a
            href="#"
            className="rounded-full bg-(--t) px-6 py-3 text-sm font-semibold text-(--t-on)"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Check dates
          </motion.a>
          <p className="text-sm text-white/80">
            Private houseboat, all meals, from{" "}
            <span className="font-semibold text-white">₹14,900</span> for two
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-white/70 @3xl:block"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      >
        ↓
      </motion.div>
    </section>
  );
}
