"use client";

import {
  motion,
  stagger,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  type Variants,
} from "motion/react";

const chips = ["REST and GraphQL", "Webhooks", "99.99% uptime", "SOC 2"];

const list: Variants = {
  hidden: {},
  shown: { transition: { delayChildren: stagger(0.07, { startDelay: 0.5 }) } },
};

const chip: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 10 },
  shown: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 18 },
  },
};

/**
 * A dotted grid lit by a soft spotlight that trails the pointer. The light
 * follows through a spring, so it glides rather than sticking to the cursor.
 */
export function SaasSpotlightGrid() {
  const x = useMotionValue(50);
  const y = useMotionValue(40);
  const sx = useSpring(x, { stiffness: 120, damping: 20 });
  const sy = useSpring(y, { stiffness: 120, damping: 20 });
  const light = useMotionTemplate`radial-gradient(420px circle at ${sx}% ${sy}%, color-mix(in srgb, var(--p) 28%, transparent), transparent 70%)`;

  return (
    <section
      className="@container relative isolate overflow-hidden bg-white"
      onPointerMove={(e) => {
        const box = e.currentTarget.getBoundingClientRect();
        x.set(((e.clientX - box.left) / box.width) * 100);
        y.set(((e.clientY - box.top) / box.height) * 100);
      }}
    >
      <div
        className="absolute inset-0 -z-20 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:22px_22px]"
        aria-hidden
      />
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ background: light }}
        aria-hidden
      />

      <div className="mx-auto max-w-4xl px-5 py-20 text-center @3xl:py-28">
        <motion.p
          className="inline-block rounded-full bg-(--p-light) px-3 py-1 font-mono text-xs font-semibold text-(--p-dark)"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          npm i @payline/sdk
        </motion.p>

        <motion.h1
          className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight text-zinc-900 @3xl:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Payments in{" "}
          <span className="bg-gradient-to-r from-(--p) to-(--s) bg-clip-text text-transparent">
            ten lines
          </span>{" "}
          of code
        </motion.h1>

        <motion.p
          className="mx-auto mt-5 max-w-[48ch] text-base leading-relaxed text-zinc-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          UPI, cards and netbanking behind one API, with test keys the moment
          you sign up and no sales call in the way.
        </motion.p>

        <motion.ul
          className="mt-8 flex flex-wrap justify-center gap-2"
          variants={list}
          initial="hidden"
          animate="shown"
        >
          {chips.map((c) => (
            <motion.li
              key={c}
              variants={chip}
              className="rounded-full border border-zinc-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur"
            >
              {c}
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
        >
          <motion.a
            href="#"
            className="rounded-lg bg-zinc-900 px-5 py-3 text-sm font-semibold text-white"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Get API keys
          </motion.a>
          <a
            href="#"
            className="rounded-lg px-5 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
          >
            Read the docs
          </a>
        </motion.div>
      </div>
    </section>
  );
}
