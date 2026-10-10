"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Pause, Play } from "lucide-react";
import {
  ASSET,
  About,
  Approach,
  CtaBand,
  DEEDS_SHELL,
  DeedsFooter,
  DeedsHeader,
  DisclaimerGate,
  Locations,
  Practices,
  Tagline,
  Team,
  WhatsAppFloat,
  container,
  display,
} from "./DeedsParts";

/**
 * The Deeds & Co. home page as it is live at deeds-and-co.vercel.app,
 * rebuilt from its repo: the film full width under the header with four
 * messages taking turns over it (each line rising in, a bar under the
 * current one filling over its seven seconds, pause and play in the
 * corner), then the firm's standard word by word, about, the team,
 * practices, approach, locations and careers on alternating maroon-tinted
 * bands, the call to action and the maroon footer.
 *
 * The film is the firm's own (an animated law office, slowed and looped),
 * WebM first with an MP4 fallback and a smaller cut for phones, where it
 * sits as a band above the words. The page parts are in DeedsParts.tsx.
 * With `full` (the page at /showcase/deeds-and-co/original) it also opens
 * with the Bar Council disclaimer and keeps the WhatsApp button in the
 * corner, as the live site does.
 */

const SLIDES = [
  {
    title: "Property lawyers for Bengaluru",
    body: "Title checks, sale deeds, registration and khata, handled by one team from the first document to the keys.",
    primary: "Book a title check",
    secondary: "Our practices",
  },
  {
    title: "The title, the deal and the dispute, under one roof",
    body: "Due diligence, drafting and registration, and the partition, injunction and RERA cases that follow when paperwork fails.",
    primary: "Book a title check",
    secondary: "Explore our services",
  },
  {
    title: "Plain answers, and a file you can follow",
    body: "A written report on what the records show, cost and time before we start, and a status at every stage.",
    primary: "Book a title check",
    secondary: "How we work",
  },
  {
    title: "Build your property practice with us",
    body: "Openings for advocates, associates and interns who want early responsibility on real files.",
    primary: "View openings",
    secondary: "About the firm",
  },
];

const SLIDE_MS = 7000;

/* A line of a message: rises in after the last one has gone. */
const part = (on: boolean, delay: string) =>
  on
    ? `opacity-100 translate-y-0 transition-[opacity,transform] duration-[700ms,900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${delay}`
    : "opacity-0 translate-y-3.5 transition-[opacity,transform] duration-[320ms] ease-[cubic-bezier(0.4,0,1,1)]";

function HeroFilm() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const autoplay = useReducedMotion() === false;

  // Plays only while on screen.
  useEffect(() => {
    const el = video.current;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!el || reduce) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) el.play().catch(() => undefined);
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!autoplay || held) return;
    const timer = window.setTimeout(() => {
      if (document.visibilityState === "visible")
        setActive((i) => (i + 1) % SLIDES.length);
    }, SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [active, autoplay, held]);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => undefined);
    else el.pause();
  };

  return (
    <section
      id="top"
      aria-roledescription="carousel"
      aria-label="Introduction"
      className="relative isolate flex overflow-hidden bg-[#180506] text-white @3xl:min-h-[clamp(28rem,calc(100dvh-15.5rem),38rem)] @3xl:items-center"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
    >
      <video
        ref={video}
        className="absolute inset-x-0 top-0 -z-20 aspect-video w-full object-cover @3xl:inset-0 @3xl:aspect-auto @3xl:h-full"
        muted
        loop
        playsInline
        preload="auto"
        poster={`${ASSET}/hero-poster.webp`}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-hidden
      >
        <source
          src={`${ASSET}/hero-mobile.webm`}
          type="video/webm"
          media="(max-width: 640px)"
        />
        <source
          src={`${ASSET}/hero-mobile.mp4`}
          type="video/mp4"
          media="(max-width: 640px)"
        />
        <source src={`${ASSET}/hero.webm`} type="video/webm" />
        <source src={`${ASSET}/hero.mp4`} type="video/mp4" />
      </video>

      {/* A dark fade from the left (from below on a phone) so the words read. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 aspect-video bg-[linear-gradient(to_top,#180506_0%,rgb(24_5_6/0)_45%)] @3xl:inset-0 @3xl:aspect-auto @3xl:bg-[linear-gradient(to_right,rgb(24_5_6/0.86)_0%,rgb(24_5_6/0.55)_42%,rgb(24_5_6/0)_72%)]"
      />

      <div
        className={`${container} pt-[calc(56.25cqw+0.5rem)] pb-10 @3xl:py-12`}
      >
        <motion.div
          className="grid max-w-xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {SLIDES.map((slide, i) => {
            const on = i === active;
            const Heading = i === 0 ? "h1" : "h2";
            return (
              <div
                key={slide.title}
                aria-hidden={!on}
                inert={!on}
                className="col-start-1 row-start-1"
              >
                <Heading
                  className={`${display} text-4xl leading-[1.08] font-semibold tracking-tight text-balance @3xl:text-[2.6rem] @5xl:text-5xl ${part(on, "delay-300")}`}
                >
                  {slide.title}
                </Heading>
                <p
                  className={`mt-4 max-w-md text-base leading-relaxed text-white/85 @3xl:text-lg ${part(on, "delay-[380ms]")}`}
                >
                  {slide.body}
                </p>
                <div
                  className={`mt-7 flex flex-col gap-3 @xl:flex-row ${part(on, "delay-[460ms]")}`}
                >
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#5e0103] transition hover:bg-[#f3cfc6] active:scale-[0.98]"
                  >
                    {slide.primary} <ArrowRight className="size-4" />
                  </a>
                  <a
                    href="#practices"
                    className="inline-flex items-center justify-center rounded-full border border-white/50 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/10 active:scale-[0.98]"
                  >
                    {slide.secondary}
                  </a>
                </div>
              </div>
            );
          })}
        </motion.div>

        <div
          className="mt-8 flex items-center gap-2"
          role="group"
          aria-label="Choose a message"
        >
          {SLIDES.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show message ${i + 1}: ${slide.title}`}
              aria-current={i === active}
              className="relative h-6 w-10 cursor-pointer"
            >
              <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/25">
                {i === active && (
                  <motion.span
                    key={`${active}-${held}`}
                    className="absolute inset-0 origin-left rounded-full bg-white"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: autoplay && !held ? SLIDE_MS / 1000 : 0,
                      ease: "linear",
                    }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={toggle}
        className="absolute top-5 left-5 flex size-11 items-center justify-center rounded-full bg-white/90 text-[#5e0103] shadow-lg shadow-black/20 backdrop-blur transition hover:bg-white active:scale-95 motion-reduce:hidden @3xl:right-5 @3xl:left-auto"
        aria-label={playing ? "Pause the film" : "Play the film"}
      >
        {playing ? (
          <Pause className="size-[18px] fill-current" />
        ) : (
          <Play className="size-[18px] fill-current" />
        )}
      </button>
    </section>
  );
}

/* Every other band on the soft maroon tint, as on the live site. */
const band = (tinted: boolean) =>
  `py-12 @xl:py-16 ${tinted ? "bg-[#faf1f0]" : "bg-white"}`;

export function DeedsOriginalSite({ full = false }: { full?: boolean }) {
  return (
    <div className={DEEDS_SHELL}>
      {full && <DisclaimerGate />}
      <DeedsHeader />
      <main>
        <HeroFilm />

        <section aria-label="Our standard" className={band(false)}>
          <div className={`${container} text-center`}>
            <Tagline className="@xl:py-4" />
          </div>
        </section>

        <section id="about" className={band(true)}>
          <div className={container}>
            <About />
          </div>
        </section>

        <section id="team" className={band(false)}>
          <div className={container}>
            <Team />
          </div>
        </section>

        <section id="practices" className={band(true)}>
          <div className={container}>
            <Practices />
          </div>
        </section>

        <section className={band(false)}>
          <div className={container}>
            <Approach />
          </div>
        </section>

        <section id="careers" className={band(true)}>
          <div className={container}>
            <Locations />
          </div>
        </section>

        <section className={band(false)}>
          <div className={container}>
            <CtaBand />
          </div>
        </section>
      </main>
      <DeedsFooter />
      {full && <WhatsAppFloat />}
    </div>
  );
}
