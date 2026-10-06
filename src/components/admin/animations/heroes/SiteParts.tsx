"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * The parts every full-site animation shares below its own sections: the
 * sticky nav, a services grid, figures, reviews, questions, a last call to
 * act and the footer. Plain content in, styled in the palette colours.
 */

export const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: {
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  },
};

export function SiteNav({
  brand,
  mark,
  links,
  cta,
}: {
  brand: string;
  mark: string;
  links: { label: string; href: string }[];
  cta: string;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <a href="#" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-(--p) text-sm font-bold text-(--p-on)">
            {mark}
          </span>
          <span className="text-base font-semibold tracking-tight text-zinc-900">
            {brand}
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-medium text-zinc-600 @3xl:flex">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="hover:text-zinc-900">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#start"
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold whitespace-nowrap text-white"
        >
          {cta}
        </a>
      </div>
    </header>
  );
}

export type SiteContent = {
  servicesTitle: string;
  /** Five: the first is the big tile. */
  services: { name: string; text: string }[];
  /** Sample figures: replace with the business's own. */
  numbers: { value: string; label: string }[];
  reviewsTitle: string;
  reviews: { quote: string; who: string }[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  closing: { title: string; text: string; cta: string };
  footer: {
    brand: string;
    about: string;
    address: string[];
    contact: string[];
    note?: string;
  };
};

const TONES = [
  "bg-(--p) text-(--p-on)",
  "bg-zinc-50 text-zinc-900",
  "bg-(--s-light) text-zinc-900",
  "bg-zinc-50 text-zinc-900",
  "bg-(--p-light) text-zinc-900",
];

export function SiteSections({ content: c }: { content: SiteContent }) {
  const [open, setOpen] = useState(0);
  return (
    <>
      <section id="services" className="bg-white py-20 @3xl:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <motion.h2
            {...reveal}
            className="max-w-2xl text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
          >
            {c.servicesTitle}
          </motion.h2>
          <div className="mt-12 grid gap-4 @3xl:grid-cols-4 @3xl:grid-rows-2">
            {c.services.map((s, i) => (
              <motion.article
                key={s.name}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className={`flex flex-col justify-end rounded-3xl p-6 ${TONES[i % TONES.length]} ${
                  i === 0
                    ? "min-h-72 @3xl:col-span-2 @3xl:row-span-2"
                    : "min-h-44"
                }`}
              >
                <h3
                  className={`font-semibold tracking-tight ${i === 0 ? "text-2xl @3xl:text-3xl" : "text-lg"}`}
                >
                  {s.name}
                </h3>
                <p
                  className={`mt-2 text-sm leading-relaxed ${i === 0 ? "opacity-85" : "text-zinc-600"}`}
                >
                  {s.text}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 @2xl:grid-cols-2 @4xl:grid-cols-4">
          {c.numbers.map((n, i) => (
            <motion.div
              key={n.label}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.08 }}
            >
              <p className="text-5xl font-semibold tracking-tight text-zinc-900 tabular-nums">
                {n.value}
              </p>
              <p className="mt-2 text-sm text-zinc-600">{n.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-(--p-light) py-20 @3xl:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <motion.h2
            {...reveal}
            className="max-w-2xl text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
          >
            {c.reviewsTitle}
          </motion.h2>
          <div className="mt-12 grid gap-5 @3xl:grid-cols-[1.3fr_1fr]">
            {c.reviews.map((r, i) => (
              <motion.figure
                key={r.who}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.08 }}
                className={`rounded-3xl bg-white p-7 ${i === 0 ? "@3xl:row-span-2 @3xl:p-10" : ""}`}
              >
                <blockquote
                  className={`leading-snug font-medium tracking-tight text-zinc-900 ${i === 0 ? "text-2xl @3xl:text-3xl" : "text-lg"}`}
                >
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 text-sm text-zinc-500">
                  {r.who}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 @3xl:py-28">
        <div className="mx-auto max-w-3xl px-5">
          <motion.h2
            {...reveal}
            className="text-3xl font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
          >
            {c.faqTitle}
          </motion.h2>
          <ul className="mt-10 divide-y divide-zinc-200 border-y border-zinc-200">
            {c.faqs.map((f, i) => (
              <li key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? -1 : i)}
                  aria-expanded={open === i}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold text-zinc-900"
                >
                  {f.q}
                  <motion.span
                    className="grid size-7 shrink-0 place-items-center rounded-full bg-zinc-100 text-lg leading-none text-zinc-700"
                    animate={{ rotate: open === i ? 45 : 0 }}
                    aria-hidden
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[60ch] pb-5 text-sm leading-relaxed text-zinc-600">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="start" className="bg-white px-5 pb-20">
        <motion.div
          {...reveal}
          className="mx-auto flex max-w-6xl flex-col items-start gap-6 rounded-[2rem] bg-zinc-900 p-8 @3xl:flex-row @3xl:items-center @3xl:justify-between @3xl:p-14"
        >
          <div>
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-white @3xl:text-4xl">
              {c.closing.title}
            </h2>
            <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-zinc-400">
              {c.closing.text}
            </p>
          </div>
          <motion.a
            href="#start"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full bg-(--p) px-7 py-3.5 text-sm font-semibold whitespace-nowrap text-(--p-on)"
          >
            {c.closing.cta}
          </motion.a>
        </motion.div>
      </section>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 @3xl:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-base font-semibold text-zinc-900">
              {c.footer.brand}
            </p>
            <p className="mt-2 max-w-[40ch] text-sm leading-relaxed text-zinc-600">
              {c.footer.about}
            </p>
          </div>
          <div className="text-sm text-zinc-600">
            <p className="font-semibold text-zinc-900">Visit</p>
            {c.footer.address.map((l, i) => (
              <p key={l} className={i === 0 ? "mt-2" : ""}>
                {l}
              </p>
            ))}
          </div>
          <div className="text-sm text-zinc-600">
            <p className="font-semibold text-zinc-900">Contact</p>
            {c.footer.contact.map((l, i) => (
              <p key={l} className={i === 0 ? "mt-2" : ""}>
                {l}
              </p>
            ))}
          </div>
        </div>
        {c.footer.note && (
          <p className="mx-auto max-w-6xl px-5 pb-10 text-xs leading-relaxed text-zinc-500">
            {c.footer.note}
          </p>
        )}
      </footer>
    </>
  );
}
