"use client";

import { motion } from "motion/react";

// Where each photo flies in from, and its place in the mosaic.
const photos = [
  {
    seed: "goa-villa",
    alt: "A villa with a pool",
    from: { x: -80, y: -40, rotate: -8 },
    className: "col-span-2 row-span-2",
  },
  {
    seed: "hampi-ruins",
    alt: "Stone temples at sunset",
    from: { x: 60, y: -60, rotate: 6 },
    className: "",
  },
  {
    seed: "munnar-tea",
    alt: "Tea gardens in the hills",
    from: { x: 90, y: 0, rotate: 10 },
    className: "",
  },
  {
    seed: "jaipur-haveli",
    alt: "A courtyard in a haveli",
    from: { x: -40, y: 70, rotate: -6 },
    className: "",
  },
  {
    seed: "andaman-beach",
    alt: "A white sand beach",
    from: { x: 70, y: 80, rotate: 8 },
    className: "",
  },
];

/**
 * Photos fly in from different sides and land in a mosaic, staggered, while
 * the search bar opens out from a small pill beneath the headline.
 */
export function TravelGalleryLanding() {
  return (
    <section className="@container overflow-hidden bg-(--p-light)">
      <div className="mx-auto max-w-6xl px-5 py-14 @3xl:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h1
            className="text-4xl leading-[1.05] font-semibold tracking-tight text-zinc-900 @3xl:text-6xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Homes for the long weekend
          </motion.h1>
          <motion.p
            className="mx-auto mt-4 max-w-[44ch] text-base leading-relaxed text-zinc-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            1,200 verified villas, cottages and heritage stays, all within a
            day&rsquo;s drive of a metro.
          </motion.p>

          <motion.form
            className="mx-auto mt-8 flex items-center gap-2 overflow-hidden rounded-full bg-white p-1.5 shadow-lg ring-1 ring-zinc-200"
            initial={{ width: "3.5rem" }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            onSubmit={(e) => e.preventDefault()}
          >
            <motion.input
              type="search"
              placeholder="Where to? Try Coorg or Pondicherry"
              aria-label="Destination"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-(--p) px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-(--p-on)"
            >
              Search
            </button>
          </motion.form>
        </div>

        <div className="mt-12 grid auto-rows-[7.5rem] grid-cols-3 gap-3 @3xl:auto-rows-[10rem] @3xl:grid-cols-4">
          {photos.map((p, i) => (
            <motion.div
              key={p.seed}
              className={`overflow-hidden rounded-2xl shadow-md ${p.className} ${i >= 3 ? "hidden @3xl:block" : ""}`}
              initial={{ opacity: 0, ...p.from, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
              transition={{
                delay: 0.3 + i * 0.1,
                type: "spring",
                stiffness: 120,
                damping: 16,
              }}
              whileHover={{ scale: 1.03 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- copied into other projects, which may not use next/image */}
              <img
                src={`https://picsum.photos/seed/${p.seed}/800/600`}
                alt={p.alt}
                className="size-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
