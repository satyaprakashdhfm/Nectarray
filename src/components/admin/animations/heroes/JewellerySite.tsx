"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ACCENT, Crop, JewelleryLookZoom, LOOKS } from "./JewelleryLookZoom";

/**
 * A whole one-page site for a men's silver jewellery label, built around
 * the lookbook hero: five scrolls walk the camera over the model piece by
 * piece, then the page carries on to the shop. Below it, a strip of
 * promises runs by, the four kinds of piece open as tall tiles, the craft
 * section drifts its photo against the scroll, bestsellers go into a bag
 * that counts up in the header, and a newsletter closes it.
 *
 * Every image is a crop of the one lookbook photo until real product shots
 * replace them.
 */

const BRAND = "Noir & Silver";

const PROMISES = [
  "925 sterling silver",
  "Hallmarked",
  "Free shipping over ₹2,999",
  "30-day returns",
  "Lifetime polishing",
];

const BESTSELLERS = LOOKS.flatMap((look) =>
  look.products.slice(0, 2).map((p, k) => ({ ...p, look, zoom: 4 + k * 3 })),
);

export function JewellerySite() {
  const [bag, setBag] = useState(0);
  return (
    <div className="@container bg-[#16100c] text-white">
      <Header bag={bag} />
      <JewelleryLookZoom />
      <Promises />
      <ShopByPiece />
      <Craft />
      <Bestsellers onAdd={() => setBag((n) => n + 1)} />
      <Quote />
      <Footer />
    </div>
  );
}

function Header({ bag }: { bag: number }) {
  return (
    <header className="sticky top-0 z-30 -mb-16 flex h-16 items-center justify-between bg-[#16100c]/60 px-5 backdrop-blur-md @3xl:px-10">
      <a
        href="#"
        className="text-sm font-light tracking-[0.35em] uppercase"
        onClick={(e) => e.preventDefault()}
      >
        {BRAND}
      </a>
      <nav className="hidden gap-8 text-[11px] tracking-[0.25em] text-white/70 uppercase @3xl:flex">
        {LOOKS.map((l) => (
          <a
            key={l.id}
            href="#"
            onClick={(e) => e.preventDefault()}
            className="transition hover:text-white"
          >
            {l.label.split(" ")[0]}
          </a>
        ))}
      </nav>
      <span className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase">
        Bag
        <span className="relative grid size-6 place-items-center overflow-hidden rounded-full border border-white/25 text-[10px] tracking-normal">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={bag}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              style={{ color: bag ? ACCENT : undefined }}
            >
              {bag}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </header>
  );
}

/** The promises, running by on a loop. */
function Promises() {
  const row = [...PROMISES, ...PROMISES];
  return (
    <div className="overflow-clip border-y border-white/10 py-4">
      <motion.div
        className="flex w-max gap-12 pr-12"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {row.map((p, i) => (
          <span
            key={i}
            className="flex items-center gap-12 text-[11px] tracking-[0.3em] whitespace-nowrap text-white/60 uppercase"
          >
            {p}
            <span style={{ color: ACCENT }}>✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
    >
      <p
        className="text-[11px] tracking-[0.35em] uppercase"
        style={{ color: ACCENT }}
      >
        {kicker}
      </p>
      <h2 className="mt-3 text-3xl font-light tracking-tight @3xl:text-5xl">
        {title}
      </h2>
    </motion.div>
  );
}

/** The four kinds of piece as tall tiles that open up on hover. */
function ShopByPiece() {
  return (
    <section className="px-5 py-20 @3xl:px-10 @3xl:py-28">
      <SectionHead
        kicker="Shop by piece"
        title="Start with one. Add the rest."
      />
      <div className="mt-10 grid grid-cols-2 gap-3 @3xl:grid-cols-4 @3xl:gap-5">
        {LOOKS.map((look, i) => (
          <motion.a
            key={look.id}
            href="#"
            onClick={(e) => e.preventDefault()}
            className="group relative block aspect-[3/4] overflow-hidden rounded-2xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <Crop
              look={look}
              zoom={4.5}
              className="absolute inset-0 transition duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute inset-x-4 bottom-4">
              <p className="text-[10px] tracking-[0.3em] text-white/50">
                0{i + 1}
              </p>
              <h3 className="mt-1 text-sm tracking-[0.25em] uppercase @3xl:text-base">
                {look.label}
              </h3>
              <span
                className="mt-3 block h-px w-8 transition-all duration-500 group-hover:w-16"
                style={{ backgroundColor: ACCENT }}
              />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

/** How it is made, with the photo drifting against the scroll. */
function Craft() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return (
    <section
      ref={ref}
      className="grid items-center gap-10 px-5 py-20 @3xl:grid-cols-2 @3xl:gap-16 @3xl:px-10 @3xl:py-28"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
        <motion.div className="absolute inset-x-0 -inset-y-[14%]" style={{ y }}>
          <Crop look={LOOKS[1]} zoom={3.2} className="size-full" />
        </motion.div>
      </div>
      <div>
        <SectionHead
          kicker="The craft"
          title="Cast in 925. Finished by hand."
        />
        <motion.p
          className="mt-6 max-w-md leading-relaxed text-white/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Every piece starts as a wax carving, is cast in solid sterling silver
          and polished by hand in our Jaipur workshop. The onyx is cut to fit
          each setting, not the other way round.
        </motion.p>
        <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
          {[
            ["92.5%", "Pure silver"],
            ["14", "Hands per piece"],
            ["Life", "Free polishing"],
          ].map(([n, label], i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <dt
                className="text-2xl font-light @3xl:text-3xl"
                style={{ color: ACCENT }}
              >
                {n}
              </dt>
              <dd className="mt-1 text-[11px] tracking-[0.2em] text-white/50 uppercase">
                {label}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** Bestsellers in a swipeable row; adding one counts up the bag. */
function Bestsellers({ onAdd }: { onAdd: () => void }) {
  const [added, setAdded] = useState<string | null>(null);
  return (
    <section className="py-20 @3xl:py-28">
      <div className="px-5 @3xl:px-10">
        <SectionHead kicker="Bestsellers" title="What everyone's wearing" />
      </div>
      <div className="mt-10 flex snap-x snap-mandatory scroll-px-5 [scrollbar-width:none] gap-4 overflow-x-auto px-5 pb-2 @3xl:scroll-px-10 @3xl:px-10">
        {BESTSELLERS.map((item, i) => (
          <motion.div
            key={item.name}
            className="group w-56 shrink-0 snap-start @3xl:w-64"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 4) * 0.08, duration: 0.5 }}
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Crop
                look={item.look}
                zoom={item.zoom}
                className="absolute inset-0 transition duration-700 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => {
                  onAdd();
                  setAdded(item.name);
                  window.setTimeout(
                    () => setAdded((a) => (a === item.name ? null : a)),
                    1400,
                  );
                }}
                className="absolute inset-x-3 bottom-3 rounded-full bg-white/90 py-2.5 text-[11px] font-medium tracking-[0.2em] text-black uppercase backdrop-blur transition hover:bg-white @3xl:translate-y-14 @3xl:opacity-0 @3xl:group-hover:translate-y-0 @3xl:group-hover:opacity-100"
              >
                {added === item.name ? "Added ✓" : "Add to bag"}
              </button>
            </div>
            <p className="mt-3 text-sm">{item.name}</p>
            <p className="text-sm" style={{ color: ACCENT }}>
              {item.price}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Quote() {
  const words = "Silver that looks like you've always worn it.".split(" ");
  return (
    <section className="px-5 py-24 text-center @3xl:py-36">
      <p className="mx-auto max-w-3xl text-3xl leading-tight font-light @3xl:text-5xl">
        {words.map((w, i) => (
          <motion.span
            key={i}
            className="inline-block pr-[0.25em]"
            initial={{ opacity: 0.15, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
          >
            {w}
          </motion.span>
        ))}
      </p>
      <p className="mt-6 text-[11px] tracking-[0.3em] text-white/50 uppercase">
        Arjun M., Bengaluru
      </p>
    </section>
  );
}

function Footer() {
  const [done, setDone] = useState(false);
  return (
    <footer className="border-t border-white/10 px-5 pt-16 pb-10 @3xl:px-10">
      <div className="grid gap-12 @3xl:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-sm tracking-[0.35em] uppercase">{BRAND}</p>
          <p className="mt-4 max-w-sm text-sm text-white/50">
            New pieces drop on the first of the month. Hear about them first.
          </p>
          <form
            className="mt-6 flex max-w-sm overflow-hidden rounded-full border border-white/20"
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
          >
            <input
              type="email"
              required
              placeholder="Email address"
              className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm outline-none placeholder:text-white/35"
            />
            <button
              type="submit"
              className="px-5 text-[11px] tracking-[0.2em] uppercase"
              style={{ color: ACCENT }}
            >
              {done ? "Thanks ✓" : "Join"}
            </button>
          </form>
        </div>
        {[
          ["Shop", LOOKS.map((l) => l.label)],
          ["Help", ["Sizing guide", "Shipping", "Returns", "Care for silver"]],
        ].map(([head, links]) => (
          <div key={head as string}>
            <p className="text-[11px] tracking-[0.3em] text-white/40 uppercase">
              {head}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {(links as string[]).map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="transition hover:text-white"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-16 text-xs text-white/35">
        © 2026 {BRAND}. Made in Jaipur.
      </p>
    </footer>
  );
}
