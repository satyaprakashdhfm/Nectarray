"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

/**
 * A scroll-driven sequence: the card starts huge and tilted towards the
 * reader, straightens and shrinks as they scroll, while a phone rises from
 * below to catch it — then the line about it fades in. Pinned for the
 * length of the section, so scrolling scrubs the scene like a video.
 *
 * Every value hangs off one scroll progress through a spring, which keeps
 * the motion smooth on a mouse wheel that moves in steps. Needs no ancestor
 * with `overflow: hidden` (that stops sticky from sticking); `overflow:
 * clip` is fine.
 */
export function ScrollCardToPhone() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.3,
  });

  // The card: big and tilted, then flat and small, landing in the phone.
  const scale = useTransform(p, [0, 0.45, 0.75], [1.6, 1, 0.52]);
  const rotateX = useTransform(p, [0, 0.45, 0.75], [58, 18, 0]);
  const rotateZ = useTransform(p, [0, 0.45, 0.75], [-30, -12, 0]);
  const cardY = useTransform(p, [0, 0.45, 0.75], ["-8%", "0%", "-14%"]);
  // The phone rises into place under it.
  const phoneY = useTransform(p, [0.3, 0.75], ["110%", "0%"]);
  // The words: the opening line out, the landing line in.
  const introOpacity = useTransform(p, [0, 0.2], [1, 0]);
  const outroOpacity = useTransform(p, [0.75, 0.88], [0, 1]);
  const outroY = useTransform(p, [0.75, 0.88], [20, 0]);

  return (
    <section
      ref={ref}
      className="@container relative h-[320vh] bg-gradient-to-b from-(--s-light) via-white to-(--p-light)"
    >
      <div className="sticky top-0 h-screen overflow-clip">
        <motion.h2
          className="absolute inset-x-0 top-[12%] px-5 text-center text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
          style={{ opacity: introOpacity }}
        >
          Meet the card that lives on your phone
        </motion.h2>

        {/* The phone, rising from below. */}
        <motion.div
          className="absolute inset-x-0 bottom-[6%] mx-auto h-[62vh] max-h-[34rem] w-[min(16rem,60vw)] rounded-[2.5rem] border-[10px] border-zinc-900 bg-white shadow-2xl"
          style={{ y: phoneY }}
        >
          <div className="mx-auto mt-2 h-5 w-24 rounded-full bg-zinc-900" />
          <div className="mt-[46%] space-y-2.5 px-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-zinc-500">Cashback this month</span>
              <span className="text-sm font-semibold text-zinc-900">
                ₹1,284
              </span>
            </div>
            {[72, 48, 88].map((w) => (
              <div key={w} className="h-2 rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-(--s)"
                  style={{ width: `${w}%` }}
                />
              </div>
            ))}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {["Scan", "Pay", "Split"].map((a) => (
                <span
                  key={a}
                  className="rounded-lg bg-zinc-100 py-2 text-center text-[11px] font-semibold text-zinc-700"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* The card, over everything. */}
        <div className="absolute inset-0 grid place-items-center [perspective:1200px]">
          <motion.div
            className="relative aspect-[1.586] w-[min(17rem,64vw)] rounded-2xl bg-gradient-to-br from-(--s) to-(--s-dark) p-4 shadow-2xl"
            style={{ scale, rotateX, rotateZ, y: cardY }}
          >
            <div className="flex h-full flex-col justify-between text-white">
              <div className="flex items-start justify-between">
                <span className="grid size-7 place-items-center rounded-md bg-white/25 text-xs font-bold">
                  K
                </span>
                <span className="text-[10px] font-bold tracking-widest opacity-80">
                  RUPAY
                </span>
              </div>
              <div className="h-6 w-8 rounded-md bg-gradient-to-br from-amber-200 to-amber-400" />
              <span className="font-mono text-xs tracking-[0.2em] opacity-90">
                •••• 2048
              </span>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/25 to-transparent" />
          </motion.div>
        </div>

        <motion.div
          className="absolute inset-x-0 top-[10%] px-5 text-center"
          style={{ opacity: outroOpacity, y: outroY }}
        >
          <h3 className="text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl">
            Digital credit card, real cashback
          </h3>
          <p className="mt-3 text-zinc-600">
            Flat 1.5% back on every UPI payment.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
