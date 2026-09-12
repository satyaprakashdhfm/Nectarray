import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { hero } from "@/lib/content";

/**
 * The home page hero: the brand film full-bleed, glass over it.
 *
 * The scene used to be drawn here in CSS and SVG, standing in for footage
 * that was being made. This is that footage, and it carries the mark itself,
 * so the tile and the traces that imitated it are gone.
 *
 * The film is pale, and the copy over it is white, so the shading that was
 * always under the copy does the real work now: dark at the foot where the
 * words are, a touch across the top to seat the header, and the middle left
 * alone for the mark. The poster underneath is what shows before the first
 * frame decodes, and what stays instead of it under reduced motion.
 */
export function GlassHero() {
  return (
    <section
      id="top"
      data-header-clear
      className="hero-ground relative isolate flex min-h-[max(100svh,40rem)] flex-col overflow-hidden text-white"
    >
      {/* Film ------------------------------------------------------------- */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <Image
          src="/hero/hero-poster.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <video
          className="hero-video absolute inset-0 size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero/hero-poster.webp"
        >
          <source src="/hero/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/*
       * Legibility. The copy sits low and left, so that is where the film is
       * darkened; the centre is left alone for the mark. Its own layer, after
       * the film, so it lands over the picture rather than under it.
       */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="hero-shade-film absolute inset-0" />
        <div className="hero-shade-top absolute inset-0" />
        <div className="hero-shade-bottom absolute inset-0" />
        <div className="hero-shade-left absolute inset-0" />
      </div>

      {/* Copy --------------------------------------------------------------- */}
      <div className="shell-wide hero-frame mt-auto grid gap-8 pt-[calc(var(--header-room)+2rem)] pb-24 sm:pb-28 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">
        <div className="hero-copy max-w-[36rem]">
          <h1
            className="display hero-rise hero-title text-[2.25rem] leading-[1.04] sm:text-[2.75rem] lg:text-[3rem]"
            style={{ animationDelay: "80ms" }}
          >
            {hero.headline[0]}
            <br />
            <span className="hero-accent">{hero.headline[1]}</span>
          </h1>

          <p
            className="hero-rise hero-lede mt-5 text-[1rem] leading-relaxed text-white/80 sm:text-[1.0625rem]"
            style={{ animationDelay: "180ms" }}
          >
            {hero.lede}
          </p>

          <div
            className="hero-rise hero-action mt-8 flex flex-wrap items-center gap-3 text-[0.9375rem]"
            style={{ animationDelay: "280ms" }}
          >
            <Link
              href={hero.primaryCta.href}
              className="group text-night inline-flex items-center gap-[0.8em] rounded-full bg-white py-[0.55em] pr-[0.55em] pl-[1.6em] font-semibold shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              {hero.primaryCta.label}
              <span className="bg-night grid size-[2.4em] place-items-center rounded-full text-white transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight
                  className="size-[1.05em]"
                  strokeWidth={2.25}
                  aria-hidden
                />
              </span>
            </Link>
            <Link
              href={hero.secondaryCta.href}
              className="glass-card inline-flex items-center rounded-full px-[1.6em] py-[0.95em] font-semibold text-white transition-colors duration-300 hover:bg-white/20"
            >
              {hero.secondaryCta.label}
            </Link>
          </div>

          <p
            className="hero-rise hero-note mt-5 text-[0.875rem] text-white/60"
            style={{ animationDelay: "360ms" }}
          >
            {hero.microNote}
          </p>
        </div>

        {/* Where Kiwi puts the app QR code: the three numbers, on glass. */}
        <dl
          className="glass-card hero-rise hero-stats hidden grid-cols-3 gap-6 rounded-3xl px-7 py-6 sm:grid lg:w-[26rem]"
          style={{ animationDelay: "440ms" }}
        >
          {hero.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="display hero-stat-value block text-[1.875rem] leading-none">
                  {stat.value}
                </span>
                <span className="hero-stat-label mt-2 block text-[0.75rem] leading-snug text-white/70">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <a
        href={hero.secondaryCta.href}
        className="scroll-cue hero-cue absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.18em] text-white/75 uppercase transition-colors hover:text-white"
      >
        Scroll to explore
        <ArrowDown
          className="scroll-cue-arrow size-[1.3em]"
          strokeWidth={2.25}
          aria-hidden
        />
      </a>
    </section>
  );
}
