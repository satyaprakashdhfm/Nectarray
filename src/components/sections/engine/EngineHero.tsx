"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { hero } from "@/lib/content";
import { cn } from "@/lib/utils";
import { PRACTICES } from "./textures";
import type { Variant } from "./EngineScene";

/*
 * three.js, the post-processing stack and GSAP are most of a megabyte, and
 * none of it can draw on the server — so the scene is its own chunk, fetched
 * once the page has painted its words.
 */
const EngineScene = dynamic(() => import("./EngineScene"), { ssr: false });

const NIGHT = "#04080c";

function useMedia(query: string) {
  const [match, setMatch] = useState<boolean | null>(null);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, [query]);
  return match;
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * The homepage hero, as THE DIGITAL GROWTH ENGINE: the words on the left,
 * and on the right a 3D installation of what the words say — four practice
 * modules wired into one product core, powering up in sequence.
 *
 * On a phone it is a different composition, not a smaller one: the words
 * first, then the engine seen from higher up, in a frame of its own, with
 * label-only panels and a lighter render path.
 */
export function EngineHero() {
  const desktop = useMedia("(min-width: 1280px)");
  const reduced = !!useReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [visible, setVisible] = useState(true);
  const section = useRef<HTMLElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const labels = useRef<(HTMLElement | null)[]>([]);
  const [freezeAt, setFreezeAt] = useState<number | null>(null);

  // Development only: ?engine-t=4.5 holds the sequence at 4.5 s, to inspect
  // one moment of the choreography (or to render the fallback stills).
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const t = new URLSearchParams(window.location.search).get("engine-t");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once from the URL
    if (t !== null && !Number.isNaN(Number(t))) setFreezeAt(Number(t));
  }, []);

  // Decide about WebGL, then load the scene once the browser is idle.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only capability, read once on mount
    setWebgl(hasWebGL());
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setLoad(true), { timeout: 700 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setLoad(true), 200);
    return () => window.clearTimeout(id);
  }, []);

  // Render only while someone can see it.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "80px",
    });
    io.observe(el);
    const vis = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", vis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  // Pointer parallax, as -1..1 across the hero.
  useEffect(() => {
    const el = section.current;
    if (!el || reduced) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.current.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const leave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [reduced]);

  const onReady = useCallback(() => setReady(true), []);

  const scene = (variant: Variant) =>
    webgl === false ? (
      <Poster variant={variant} />
    ) : load && webgl ? (
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-[1400ms] ease-out",
          ready ? "opacity-100" : "opacity-0",
        )}
      >
        <EngineScene
          variant={variant}
          active={inView && visible}
          reduced={reduced}
          freezeAt={freezeAt}
          onReady={onReady}
          pointer={pointer}
          labels={variant === "mobile" ? labels : undefined}
        />
        {variant === "mobile" &&
          PRACTICES.map((p, i) => (
            <span
              key={p.id}
              ref={(el) => {
                labels.current[i] = el;
              }}
              className="pointer-events-none absolute top-0 left-0 inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-[#0b1620]/75 px-2.5 py-1 text-[0.6875rem] font-medium whitespace-nowrap text-white/85 opacity-0 backdrop-blur-sm"
            >
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              {p.short}
            </span>
          ))}
      </div>
    ) : null;

  // The same props on the server and in the browser, so the first render
  // hydrates cleanly; MotionConfig drops the movement (keeping the fade)
  // for anyone who has asked their system for less motion.
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 1.1,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={section}
        id="top"
        aria-labelledby="hero-title"
        className="relative isolate overflow-hidden text-white xl:min-h-[100svh]"
        style={{ backgroundColor: NIGHT }}
      >
        {/* Desktop: the engine fills the stage, framed into the right. ---- */}
        <div className="absolute inset-0 hidden xl:block" aria-hidden>
          {desktop && scene("desktop")}
          {/* Keeps the words legible where the scene runs under them. */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-[62%]"
            style={{
              background: `linear-gradient(90deg, ${NIGHT} 0%, ${NIGHT}e6 38%, ${NIGHT}80 66%, transparent 100%)`,
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
            style={{
              background: `linear-gradient(0deg, ${NIGHT} 0%, transparent 100%)`,
            }}
          />
        </div>

        <div className="shell-wide relative z-10 flex flex-col pt-[var(--header-room)] xl:min-h-[100svh]">
          <div className="flex flex-1 items-center pt-10 pb-6 sm:pt-14 xl:py-10">
            <div className="max-w-[38rem] lg:max-w-[44rem]">
              <motion.p
                {...rise(0.1)}
                className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.625rem] tracking-[0.14em] text-white/55 uppercase sm:gap-x-4 sm:text-[0.75rem] sm:tracking-[0.2em]"
              >
                {PRACTICES.map((p) => (
                  <span key={p.id} className="inline-flex items-center gap-2">
                    <span
                      className="size-1.5 rounded-full"
                      style={{
                        backgroundColor: p.color,
                        boxShadow: `0 0 10px ${p.color}`,
                      }}
                      aria-hidden
                    />
                    {p.short}
                  </span>
                ))}
              </motion.p>

              <motion.h1
                {...rise(0.22)}
                id="hero-title"
                className="display mt-7 text-[2.65rem] leading-[1] sm:text-[3.6rem] lg:text-[3.9rem] xl:text-[4.4rem] 2xl:text-[4.9rem]"
              >
                <span className="lg:whitespace-nowrap">{hero.headline[0]}</span>
                <br />
                <span className="ink-gradient lg:whitespace-nowrap">
                  {hero.headline[1]}
                </span>
              </motion.h1>

              <motion.p
                {...rise(0.42)}
                className="mt-7 max-w-[34rem] text-[1.0625rem] leading-[1.65] text-white/68 lg:text-[1.1875rem]"
              >
                {hero.lede}
              </motion.p>

              <motion.div
                {...rise(0.6)}
                className="mt-10 flex flex-wrap items-center gap-3"
              >
                <a
                  href={hero.primaryCta.href}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-[0.9375rem] font-semibold tracking-tight whitespace-nowrap text-black shadow-[0_10px_32px_-12px_rgba(31,165,222,0.55)] transition-all duration-300 hover:bg-white/90"
                >
                  {hero.primaryCta.label}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                </a>
                <a
                  href={hero.secondaryCta.href}
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/18 px-6 py-3.5 text-[0.9375rem] font-semibold tracking-tight whitespace-nowrap text-white transition-all duration-300 hover:border-white/45 hover:bg-white/[0.06]"
                >
                  {hero.secondaryCta.label}
                </a>
              </motion.div>

              <motion.p
                {...rise(0.75)}
                className="mt-6 max-w-[30rem] text-[0.875rem] leading-relaxed text-white/42"
              >
                {hero.microNote}
              </motion.p>
            </div>
          </div>

          {/* Phone: the engine in a frame of its own, below the words. ---- */}
          <div
            className="relative -mx-4 h-[min(118vw,34rem)] sm:-mx-6 xl:hidden"
            aria-hidden
          >
            {desktop === false && scene("mobile")}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-20"
              style={{
                background: `linear-gradient(180deg, ${NIGHT} 0%, transparent 100%)`,
              }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
              style={{
                background: `linear-gradient(0deg, ${NIGHT} 0%, transparent 100%)`,
              }}
            />
          </div>

          {/* The four practices, named in words as well as in the scene. ---- */}
          <motion.nav
            {...rise(1.2)}
            aria-label="Practices"
            className="grid grid-cols-2 border-t border-white/10 lg:grid-cols-4"
          >
            {PRACTICES.map((p, i) => (
              <a
                key={p.id}
                href={p.href}
                className={cn(
                  "group flex items-center gap-3 py-4 pr-3 transition-colors duration-300 lg:py-6",
                  i % 2 === 1 && "pl-4 lg:pl-0",
                  "lg:border-l lg:border-white/10 lg:pl-6 lg:first:border-l-0 lg:first:pl-0",
                )}
              >
                <span className="font-mono text-[0.6875rem] text-white/40">
                  {p.index}
                </span>
                <span
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: p.color }}
                  aria-hidden
                />
                <span className="text-[0.875rem] font-medium text-white/75 transition-colors group-hover:text-white lg:text-[0.9375rem]">
                  {p.title}
                </span>
                <ArrowRight
                  className="ml-auto hidden size-3.5 text-white/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white sm:block"
                  aria-hidden
                />
              </a>
            ))}
          </motion.nav>
        </div>
      </section>
    </MotionConfig>
  );
}

/** A still of the engine, for browsers that cannot run WebGL. */
function Poster({ variant }: { variant: Variant }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- a full-bleed still with a known file per variant
    <img
      src={`/hero/engine-${variant}.webp`}
      alt=""
      className={cn(
        "absolute inset-0 size-full object-cover",
        variant === "desktop" && "object-[70%_50%]",
      )}
      decoding="async"
    />
  );
}
