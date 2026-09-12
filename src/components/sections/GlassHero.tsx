import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { hero } from "@/lib/content";

/**
 * Circuit traces running in from the edges of the frame to the hub tile.
 *
 * Drawn in a 1600x900 box that is sliced to cover the hero, so the point
 * every path ends at — 800,450 — is always the centre of the scene layer,
 * which is where the tile sits. Right-angle and 45° runs only, the same
 * vocabulary as the traces in the logo itself.
 */
const TRACES = [
  "M -10 160 H 250 L 350 260 H 600 L 800 450",
  "M -10 470 H 360 L 400 450 H 800",
  "M -10 760 H 220 L 340 640 H 580 L 800 450",
  "M 300 -10 V 120 L 420 240 H 560 L 800 450",
  "M 330 910 V 800 L 470 660 H 640 L 800 450",
  "M 1610 140 H 1360 L 1260 240 H 1010 L 800 450",
  "M 1610 450 H 1240 L 1200 470 H 800",
  "M 1610 780 H 1400 L 1270 650 H 1020 L 800 450",
  "M 1300 -10 V 110 L 1180 230 H 1040 L 800 450",
  "M 1260 910 V 790 L 1120 650 H 960 L 800 450",
  "M 800 -10 V 450",
];

/** Where a trace turns its first corner — a node, as in the logo. */
const NODES: [number, number][] = [
  [250, 160],
  [360, 470],
  [220, 760],
  [300, 120],
  [330, 800],
  [1360, 140],
  [1240, 450],
  [1400, 780],
  [1300, 110],
  [1260, 790],
];

/**
 * The home page hero: full-bleed scene, glass over it.
 *
 * Laid out for a background video that is being made — the brand mark on a
 * glossy tile dead centre, work flowing into it from every side. Until the
 * video exists the scene is drawn here instead, in the same composition, so
 * the tile, the type and the glass all sit where they will sit over the
 * footage. The tile is the piece that stays when the video lands: AI video
 * cannot draw the mark, so it is laid over the footage rather than baked in.
 *
 * Everything that moves is CSS and switches off under reduced motion.
 */
export function GlassHero() {
  return (
    <section
      id="top"
      data-header-clear
      className="hero-ground relative isolate flex min-h-[max(100svh,40rem)] flex-col overflow-hidden text-white"
    >
      {/* Scene ------------------------------------------------------------ */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="hero-blob hero-blob-a" />
        <div className="hero-blob hero-blob-b" />
        <div className="hero-blob hero-blob-c" />
        <div className="hero-dots absolute inset-0" />
      </div>

      {/*
       * The hub and its traces. Below xl this sits in the flow and takes
       * whatever height the copy leaves, so the tile can never land under
       * the headline however many lines it wraps to. From xl up it covers
       * the whole hero with the tile dead centre, as the video will, and
       * the copy is held left of it by width instead.
       */}
      <div
        className="relative min-h-[18rem] flex-1 xl:absolute xl:inset-0 xl:-z-10 xl:min-h-0"
        aria-hidden
      >
        {/* Below xl the floating header covers the top of this box, so the
            scene centres in what is left under it. */}
        <div className="absolute inset-x-0 top-[calc(var(--header-room)+1rem)] bottom-0 xl:top-0">
          <svg
            className="hero-traces absolute inset-0 size-full"
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
          >
            {TRACES.map((d) => (
              <path key={d} d={d} className="hero-trace" pathLength={1000} />
            ))}
            {TRACES.map((d, i) => (
              <path
                key={`pulse-${d}`}
                d={d}
                className="hero-pulse"
                pathLength={1000}
                style={{
                  animationDelay: `${(i * 0.73) % 4.2}s`,
                  animationDuration: `${3.4 + (i % 4) * 0.55}s`,
                }}
              />
            ))}
            {NODES.map(([cx, cy]) => (
              <circle
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r={6}
                className="hero-node"
              />
            ))}
          </svg>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="hero-tile-halo" />
            <div className="hero-tile grid place-items-center">
              <Image
                src="/logo-mark.png"
                alt=""
                width={329}
                height={293}
                priority
                // 74% of the tile, which is clamp(8.5rem, 13vw, 22rem):
                // about a tenth of the viewport, never under 6.3rem.
                sizes="(max-width: 65rem) 6.5rem, 10vw"
                className="w-[74%] object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/*
       * Legibility: the copy sits low and left, so that is where the scene is
       * darkened — the centre is left to the tile. Its own layer, after the
       * scene, so from xl up (where the traces run behind the copy) it lands
       * on top of them rather than under.
       */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="hero-shade-bottom absolute inset-0" />
        <div className="hero-shade-left absolute inset-0 hidden lg:block" />
      </div>

      {/* Copy --------------------------------------------------------------- */}
      <div className="shell-wide hero-frame grid gap-8 pb-24 sm:pb-28 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12 xl:mt-auto">
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
