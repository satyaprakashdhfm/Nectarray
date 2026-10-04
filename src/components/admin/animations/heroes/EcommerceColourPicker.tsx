"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const colourways = [
  { name: "Lagoon", hex: "#1f9fb4" },
  { name: "Terracotta", hex: "#c8553d" },
  { name: "Moss", hex: "#5b7f3a" },
  { name: "Charcoal", hex: "#2f3640" },
];

/**
 * A product in four colourways. Picking one swaps the bottle with a spin and
 * slides the selection ring across (a shared layoutId, so Motion animates
 * the ring between swatches). It cycles on its own until someone picks.
 */
export function EcommerceColourPicker() {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const current = colourways[active];

  useEffect(() => {
    if (touched) return;
    const t = window.setTimeout(
      () => setActive((active + 1) % colourways.length),
      2600,
    );
    return () => window.clearTimeout(t);
  }, [active, touched]);

  return (
    <section className="@container relative overflow-hidden bg-white">
      {/* A wash of the chosen colour behind everything. */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{ backgroundColor: current.hex }}
        transition={{ duration: 0.6 }}
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 @3xl:grid-cols-2 @3xl:py-20">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-zinc-500 uppercase">
            Steel bottle, 750 ml
          </p>
          <h1 className="mt-4 text-4xl leading-[1.05] font-semibold tracking-tight text-zinc-900 @3xl:text-6xl">
            Cold for 24 hours. In{" "}
            <span className="relative inline-block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={current.name}
                  className="inline-block"
                  style={{ color: current.hex }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {current.name}
                </motion.span>
              </AnimatePresence>
            </span>
            .
          </h1>
          <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-zinc-600">
            Double-walled, powder-coated and leakproof, with a lifetime
            guarantee on the seal.
          </p>

          <div
            className="mt-8 flex gap-3"
            role="radiogroup"
            aria-label="Colour"
          >
            {colourways.map((c, i) => (
              <button
                key={c.name}
                type="button"
                role="radio"
                aria-checked={i === active}
                aria-label={c.name}
                onClick={() => {
                  setTouched(true);
                  setActive(i);
                }}
                className="relative grid size-11 place-items-center rounded-full"
              >
                {i === active && (
                  <motion.span
                    layoutId="colour-ring"
                    className="absolute inset-0 rounded-full border-2 border-zinc-900"
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  />
                )}
                <span
                  className="size-8 rounded-full ring-1 ring-black/10"
                  style={{ background: c.hex }}
                />
              </button>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-5">
            <motion.a
              href="#"
              className="rounded-full bg-(--p) px-6 py-3 text-sm font-semibold text-(--p-on)"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Add to cart — ₹1,299
            </motion.a>
            <span className="text-sm text-zinc-500">Free delivery</span>
          </div>
        </div>

        <div className="relative grid h-80 place-items-center @3xl:h-[26rem]">
          <motion.div
            className="absolute size-64 rounded-full blur-3xl"
            animate={{ backgroundColor: current.hex, opacity: 0.35 }}
            transition={{ duration: 0.6 }}
            aria-hidden
          />
          {/* A fixed stage with the bottles stacked in it, so the one
              leaving and the one arriving cross over without either
              having to be measured or moved out of the layout. */}
          <div className="relative aspect-[2/5] h-full">
            <AnimatePresence initial={false}>
              <motion.svg
                key={current.name}
                viewBox="0 0 120 300"
                className="absolute inset-0 size-full drop-shadow-2xl"
                initial={{ opacity: 0, rotate: -25, x: 60, scale: 0.9 }}
                animate={{ opacity: 1, rotate: 0, x: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 25, x: -60, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 180, damping: 20 }}
                aria-label={`${current.name} bottle`}
                role="img"
              >
                <rect
                  x="38"
                  y="6"
                  width="44"
                  height="30"
                  rx="8"
                  fill="#1f2328"
                />
                <rect x="44" y="34" width="32" height="14" fill="#9aa1a9" />
                <path
                  d="M30 64 Q30 48 46 48 H74 Q90 48 90 64 V276 Q90 294 72 294 H48 Q30 294 30 276 Z"
                  fill={current.hex}
                />
                <rect
                  x="38"
                  y="70"
                  width="8"
                  height="200"
                  rx="4"
                  fill="#ffffff"
                  opacity="0.18"
                />
              </motion.svg>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
