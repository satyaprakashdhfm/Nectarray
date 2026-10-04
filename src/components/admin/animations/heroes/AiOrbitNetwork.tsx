"use client";

import { motion } from "motion/react";

const outer = ["CRM", "Invoices", "Calendar", "Inbox", "Sheets", "Tickets"];
const inner = ["Search", "SQL", "Docs"];

/**
 * Tools circling an agent's core on two rings turning opposite ways, with
 * pulses running in along the spokes — the agent calling them.
 *
 * Each label sits on a spoke rotated to its angle and spins backwards at the
 * ring's speed, so the words stay upright while the ring turns.
 */
export function AiOrbitNetwork() {
  return (
    <section className="@container relative overflow-hidden bg-zinc-950 text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 @3xl:grid-cols-2 @3xl:py-20">
        <div>
          <motion.p
            className="text-xs font-semibold tracking-[0.2em] text-(--s) uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Agents for operations
          </motion.p>
          <motion.h1
            className="mt-4 text-4xl leading-[1.05] font-semibold tracking-tight @3xl:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            One agent. Every tool your team already uses.
          </motion.h1>
          <motion.p
            className="mt-5 max-w-[44ch] text-base leading-relaxed text-white/65"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            It reads the ticket, checks the invoice, books the call and writes
            back to your CRM — and shows you each step before it acts.
          </motion.p>
          <motion.a
            href="#"
            className="mt-8 inline-block rounded-lg bg-(--p) px-5 py-3 text-sm font-semibold text-(--p-on)"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            See it run a workflow
          </motion.a>
        </div>

        <motion.div
          className="relative mx-auto aspect-square w-full max-w-[26rem]"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
        >
          <Ring labels={outer} inset="6%" seconds={40} />
          <Ring labels={inner} inset="26%" seconds={28} reverse />

          {/* Pulses running in from the outer ring to the core. */}
          {[30, 150, 270].map((angle, i) => (
            <div
              key={angle}
              className="absolute inset-[6%]"
              style={{ rotate: `${angle}deg` }}
            >
              <motion.span
                className="absolute left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-(--s) shadow-[0_0_12px_var(--s)]"
                animate={{ top: ["0%", "48%"], opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeIn",
                }}
              />
            </div>
          ))}

          <div className="absolute inset-[40%] grid place-items-center">
            <motion.div
              className="absolute inset-0 rounded-full bg-(--p) blur-xl"
              animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative grid size-full place-items-center rounded-full bg-(--p) text-sm font-bold text-(--p-on) ring-4 ring-white/10">
              Agent
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Ring({
  labels,
  inset,
  seconds,
  reverse = false,
}: {
  labels: string[];
  inset: string;
  seconds: number;
  reverse?: boolean;
}) {
  const turn = reverse ? -360 : 360;
  return (
    <motion.div
      className="absolute rounded-full border border-dashed border-white/15"
      style={{ inset }}
      animate={{ rotate: turn }}
      transition={{ duration: seconds, repeat: Infinity, ease: "linear" }}
    >
      {labels.map((label, i) => {
        const angle = (360 / labels.length) * i;
        return (
          <div
            key={label}
            className="absolute inset-0"
            style={{ rotate: `${angle}deg` }}
          >
            <motion.span
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-zinc-900 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-white/85"
              initial={{ rotate: -angle }}
              animate={{ rotate: -angle - turn }}
              transition={{
                duration: seconds,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {label}
            </motion.span>
          </div>
        );
      })}
    </motion.div>
  );
}
