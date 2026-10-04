"use client";

import { motion } from "motion/react";

const cards = [
  {
    name: "Everyday",
    number: "4821",
    className: "bg-(--s) text-(--s-on)",
    rotate: -14,
    x: -34,
  },
  {
    name: "Travel",
    number: "9034",
    className: "bg-zinc-900 text-white",
    rotate: 0,
    x: 0,
  },
  {
    name: "Business",
    number: "1176",
    className: "bg-(--p) text-(--p-on)",
    rotate: 14,
    x: 34,
  },
];

/**
 * Three cards spring out of a single stack into a fan, and whichever the
 * pointer is over lifts out of it. The fan is in percentages of the card's
 * own width, so it opens the same on a phone and a laptop.
 */
export function FintechCardFan() {
  return (
    <section className="@container overflow-hidden bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-14 @3xl:grid-cols-2 @3xl:py-20">
        <div>
          <motion.span
            className="inline-block rounded-full bg-(--p-light) px-3 py-1 text-xs font-semibold text-(--p-dark)"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Lifetime free, no joining fee
          </motion.span>
          <motion.h1
            className="mt-5 text-4xl leading-[1.05] font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            One account. A card for every kind of spend.
          </motion.h1>
          <motion.p
            className="mt-5 max-w-[44ch] text-base leading-relaxed text-zinc-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Separate cards for groceries, travel and the business, each with its
            own limit and its own cashback, all paid off from one bill.
          </motion.p>
          <motion.a
            href="#"
            className="mt-8 inline-block rounded-lg bg-zinc-900 px-5 py-3 text-sm font-semibold text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Check eligibility in 2 minutes
          </motion.a>
        </div>

        <div className="relative mx-auto grid h-72 w-full max-w-sm place-items-center @3xl:h-80">
          {cards.map((card, i) => (
            <motion.div
              key={card.name}
              className={`absolute aspect-[1.586] w-[56%] origin-bottom rounded-2xl p-4 shadow-2xl @md:w-[64%] @3xl:w-[70%] ${card.className}`}
              style={{ zIndex: i === 1 ? 2 : 1 }}
              initial={{ rotate: 0, x: "0%", y: 40, opacity: 0 }}
              animate={{
                rotate: card.rotate,
                x: `${card.x}%`,
                y: i === 1 ? -10 : 0,
                opacity: 1,
              }}
              whileHover={{ y: -36, zIndex: 3, transition: { duration: 0.2 } }}
              transition={{
                opacity: { duration: 0.3, delay: 0.2 },
                default: {
                  type: "spring",
                  stiffness: 140,
                  damping: 14,
                  delay: 0.6,
                },
              }}
            >
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="text-sm font-semibold">{card.name}</span>
                  <span className="text-xs font-bold tracking-widest opacity-80">
                    PAYLINE
                  </span>
                </div>
                <div className="h-6 w-8 rounded-md bg-gradient-to-br from-amber-200 to-amber-400" />
                <p className="font-mono text-sm tracking-[0.2em] opacity-90">
                  •••• {card.number}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
