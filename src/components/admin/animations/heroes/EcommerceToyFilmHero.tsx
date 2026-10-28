"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const FILM = "/animations/toy-film/hero-film.mp4";
const POSTER = "/animations/toy-film/hero-film.jpg";

const toys = [
  { name: "Moo the Cow", price: "₹149", tag: "Bestseller", img: "cow-toy" },
  { name: "Quack the Duck", price: "₹149", tag: "New", img: "white-bird-toy" },
  { name: "Daisy the Sheep", price: "₹149", tag: "Bestseller", img: "daisy-the-sheep" },
  { name: "Pinky the Pig", price: "₹149", tag: "Bestseller", img: "piglets" },
  { name: "Goldey the Chick", price: "₹99", tag: "New", img: "yellow-chick" },
  { name: "Carrots the Rabbit", price: "₹149", tag: "New", img: "rabbit-farm" },
];

const headline = ["Little animals,", "big stories."];
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * A short film fills the whole hero: the story picture comes alive (corn
 * popping, a flask bubbling, a pot on the flame, bricks of plant plastic),
 * then a 3D printer prints the toys one by one and each walks across a
 * sunny meadow. The headline sits on the film's calm sky, and one stack of
 * bestseller and new cards shuffles in the top corner, clear of the action.
 * On a narrow hero the film comes first and the words and cards follow.
 */
export function EcommerceToyFilmHero() {
  const reduce = useReducedMotion();
  const film = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [top, setTop] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const v = film.current;
    if (!v) return;
    if (reduce) v.pause();
    else v.play().catch(() => {});
  }, [reduce]);

  useEffect(() => {
    if (reduce || paused) return;
    const id = setTimeout(() => setTop((t) => (t + 1) % toys.length), 3500);
    return () => clearTimeout(id);
  }, [top, reduce, paused]);

  const toggle = () => {
    const v = film.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  const pile = [0, 1, 2].map((k) => toys[(top + k) % toys.length]);

  return (
    <section className="@container relative overflow-hidden bg-(--s-light)">
      <div className="relative @3xl:aspect-[16/9] @3xl:max-h-[820px] @3xl:min-h-[560px]">
        {/* The film */}
        <div className="relative aspect-[16/9] @3xl:absolute @3xl:inset-0 @3xl:aspect-auto">
          <video
            ref={film}
            src={FILM}
            poster={POSTER}
            muted
            loop
            playsInline
            autoPlay={!reduce}
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            aria-label="Plants turn into plastic, then the farm friends are 3D-printed and walk across a meadow"
            className="h-full w-full object-cover object-[50%_80%]"
          />
          {/* A soft white glow over the sky so the words stay readable */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 hidden h-1/2 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgb(255_255_255/0.88)_0%,rgb(255_255_255/0.55)_55%,transparent_100%)] @3xl:block"
          />
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause the film" : "Play the film"}
            className="absolute bottom-4 left-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-zinc-900 shadow-md hover:bg-white"
          >
            {playing ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* The words */}
        <div className="relative z-10 px-5 pt-6 text-center @3xl:pt-10">
          <motion.p
            className="text-sm font-bold text-(--p-dark)"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            🌱 3D-printed from plants
          </motion.p>
          <h1 className="mt-2 text-4xl leading-tight font-extrabold tracking-tight text-zinc-900 @3xl:text-6xl">
            {headline.map((line, i) => (
              <motion.span
                key={line}
                className={i === 1 ? "ml-3 inline-block rounded-xl bg-(--t) px-3 text-(--t-on)" : "inline-block"}
                initial={{ opacity: 0, y: 24, rotate: i ? 3 : -2 }}
                animate={{ opacity: 1, y: 0, rotate: i ? -1.5 : 0 }}
                transition={{ delay: 0.3 + i * 0.18, type: "spring", stiffness: 260, damping: 16 }}
              >
                {line}
              </motion.span>
            ))}
          </h1>
          <motion.p
            className="mx-auto mt-3 max-w-[46ch] text-lg font-bold text-zinc-800 [text-shadow:0_0_12px_white]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Chunky, cheerful animal friends for little hands, named by real kids.
          </motion.p>
          <motion.div
            className="mt-5 flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.a
              href="#"
              className="rounded-full bg-(--p) px-7 py-3.5 text-base font-bold text-(--p-on) shadow-[0_4px_0_var(--p-dark)]"
              whileHover={{ y: -2 }}
              whileTap={{ y: 2, boxShadow: "0 1px 0 var(--p-dark)" }}
            >
              Shop Farm Friends
            </motion.a>
            <motion.a
              href="#"
              className="rounded-full bg-white px-7 py-3.5 text-base font-bold text-zinc-900 shadow-[0_4px_0_rgb(0_0_0/0.15)]"
              whileHover={{ y: -2 }}
              whileTap={{ y: 2 }}
            >
              Explore habitats
            </motion.a>
          </motion.div>
        </div>

        {/* One stack of bestseller and new cards */}
        <div
          className="relative z-10 mx-auto mt-6 mb-8 aspect-[4/5] w-[min(62%,230px)] @3xl:absolute @3xl:top-8 @3xl:right-10 @3xl:m-0 @3xl:w-[clamp(150px,14cqw,200px)] @3xl:rotate-3"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          role="region"
          aria-label="Bestsellers and new launches"
        >
          <AnimatePresence initial={false}>
            {pile
              .map((toy, k) => (
                <motion.a
                  key={toy.name}
                  href="#"
                  className="absolute inset-0 flex flex-col rounded-2xl bg-white p-2 pb-3 shadow-lg"
                  style={{ zIndex: 3 - k }}
                  initial={{ opacity: 0, scale: 0.9, rotate: 8, y: 10 }}
                  animate={{ opacity: 1, scale: 1 - k * 0.05, rotate: [0, -5, 5][k], y: k * 8 }}
                  exit={{ x: 160, rotate: 18, opacity: 0, transition: { duration: 0.45 } }}
                  transition={{ type: "spring", stiffness: 220, damping: 22 }}
                  aria-hidden={k > 0 || undefined}
                  tabIndex={k > 0 ? -1 : undefined}
                >
                  <span className="relative flex-1 overflow-hidden rounded-xl bg-(--s-light)">
                    {/* eslint-disable-next-line @next/next/no-img-element -- copied into other projects, which may not use next/image */}
                    <img
                      src={`/animations/toy-film/${toy.img}.webp`}
                      alt={toy.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span
                      className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        toy.tag === "New" ? "bg-(--t) text-(--t-on)" : "bg-(--p) text-(--p-on)"
                      }`}
                    >
                      {toy.tag}
                    </span>
                  </span>
                  <span className="mt-2 flex items-baseline justify-between px-1 text-sm font-bold text-zinc-900">
                    <span>{toy.name}</span>
                    <span className="text-zinc-600">{toy.price}</span>
                  </span>
                </motion.a>
              ))
              .reverse()}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
