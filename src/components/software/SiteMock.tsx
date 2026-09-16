"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Lock, Phone } from "lucide-react";
import { company } from "@/lib/content";

/**
 * Two real home pages per kind of build, scrolling inside a frame.
 *
 * Each is a licensed template rendered as it ships and captured whole — so
 * what is in the frame is the actual page, down to the pixel, rather than a
 * sketch of one. Captured rather than embedded live: ten other sites'
 * scripts, fonts and trackers running inside ours would be slower, heavier
 * and one broken CDN away from an empty box.
 *
 * Every one is credited under the frame. Several licences require it (CC BY
 * for Furni, Freepik's for the phone screens), and none of these are our
 * client work, so the credit is also what keeps the panel honest.
 */

type Sample = {
  name: string;
  /** What kind of business it is for, in a few words. */
  kind: string;
  image: string;
  width: number;
  height: number;
  device: "desktop" | "mobile";
  credit: { label: string; href: string };
};

const SAMPLES: Record<string, Sample[]> = {
  layout: [
    {
      name: "Folio",
      kind: "Freelance designer portfolio",
      image: "/samples/portfolio-b.webp",
      width: 1440,
      height: 5466,
      device: "desktop",
      credit: { label: "Folio by Laurent Begey · MIT", href: "https://themewagon.com/themes/folio-html/" },
    },
    {
      name: "Grunge",
      kind: "Creative studio portfolio",
      image: "/samples/portfolio-a.webp",
      width: 1440,
      height: 5732,
      device: "desktop",
      credit: { label: "Grunge by Jess Gaspar · MIT", href: "https://themewagon.com/themes/grunge/" },
    },
  ],
  cart: [
    {
      name: "Furni",
      kind: "Furniture & décor store",
      image: "/samples/shop-b.webp",
      width: 1440,
      height: 5325,
      device: "desktop",
      credit: { label: "Furni by Untree.co · CC BY 3.0", href: "https://untree.co/" },
    },
    {
      name: "Sarab",
      kind: "Restaurant & food ordering",
      image: "/samples/shop-a.webp",
      width: 1440,
      height: 9000,
      device: "desktop",
      credit: { label: "Sarab by Bestwpware · MIT", href: "https://themewagon.com/themes/sarab/" },
    },
  ],
  gauge: [
    {
      name: "Orbit",
      kind: "Revenue & analytics dashboard",
      image: "/samples/dash-a.webp",
      width: 1440,
      height: 900,
      device: "desktop",
      credit: { label: "Orbit by Benjamin Njami · MIT", href: "https://themewagon.com/themes/orbit/" },
    },
    {
      name: "DeskApp",
      kind: "Sales & inventory admin",
      image: "/samples/dash-b.webp",
      width: 1440,
      height: 1755,
      device: "desktop",
      credit: { label: "DeskApp by Ankit Hingarajiya · MIT", href: "https://github.com/dropways/deskapp" },
    },
  ],
  layers: [
    {
      name: "NexusAI",
      kind: "AI automation SaaS",
      image: "/samples/webapp-a.webp",
      width: 1440,
      height: 7118,
      device: "desktop",
      credit: { label: "NexusAI by Bestwpware · MIT", href: "https://themewagon.com/themes/nexusai/" },
    },
    {
      name: "DataNova",
      kind: "Analytics platform",
      image: "/samples/webapp-b.webp",
      width: 1440,
      height: 5436,
      device: "desktop",
      credit: { label: "DataNova by Emil Gulamov · MIT", href: "https://themewagon.com/themes/datanova/" },
    },
  ],
  smartphone: [
    {
      name: "Shop online",
      kind: "Furniture shopping app",
      image: "/samples/mobile-b.webp",
      width: 638,
      height: 1281,
      device: "mobile",
      credit: { label: "Designed by Freepik", href: "http://www.freepik.com" },
    },
    {
      name: "Explore",
      kind: "Travel booking app",
      image: "/samples/mobile-a.webp",
      width: 736,
      height: 1447,
      device: "mobile",
      credit: { label: "Designed by Freepik", href: "http://www.freepik.com" },
    },
  ],
};

/** Desktop pages: a browser window whose page you scroll. */
function Desktop({ sample }: { sample: Sample }) {
  return (
    <Image
      src={sample.image}
      alt={`${sample.name} home page`}
      width={sample.width}
      height={sample.height}
      // The frame's real width: just over half the page on desktop, capped
      // where shell-wide stops growing. Under-stating this is what made it
      // blurry — the browser fetched a 640px image for a 750px box.
      sizes="(min-width: 1472px) 44rem, (min-width: 1024px) 55vw, 94vw"
      quality={90}
      className="block h-auto w-full"
    />
  );
}

/** Phone screens: a handset, centred on a soft ground. */
function Mobile({ sample }: { sample: Sample }) {
  return (
    <div className="bg-mist flex min-h-full items-start justify-center px-6 py-6">
      <div className="bg-night w-[15rem] rounded-[2.1rem] p-2 shadow-[0_24px_50px_-24px_rgba(14,27,38,0.55)]">
        <div className="overflow-hidden rounded-[1.65rem] bg-white">
          <Image
            src={sample.image}
            alt={`${sample.name} app home screen`}
            width={sample.width}
            height={sample.height}
            sizes="15rem"
            quality={90}
            className="block h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * The third slide: the rest of the work, behind a call.
 *
 * No count. Any number here would be a claim on a commercial page that
 * somebody has to be able to stand behind, and "more" is the honest
 * version of one nobody is counting.
 */
function Locked() {
  return (
    <div className="bg-night relative flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="grid size-10 place-items-center rounded-full bg-white/10">
        <Lock className="size-4 text-white/80" strokeWidth={2} aria-hidden />
      </span>
      <div>
        <p className="text-[0.8125rem] font-semibold text-white">
          More builds in this category
        </p>
        <p className="mx-auto mt-1.5 max-w-[30ch] text-[0.6875rem] leading-relaxed text-white/55">
          The rest are client work, so they are shown on a call rather than
          posted publicly — along with what each one cost and how long it took.
        </p>
      </div>
      <a
        href={`tel:${company.phone.replace(/\s/g, "")}`}
        className="bg-brand-solid text-cta-fg hover:bg-brand inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.6875rem] font-semibold transition-colors"
      >
        <Phone className="size-3" strokeWidth={2.5} aria-hidden />
        Call to see them
      </a>
    </div>
  );
}

export function SiteMock({ kind }: { kind: string }) {
  const samples = SAMPLES[kind] ?? SAMPLES.layout;
  const slides = samples.length + 1; // the samples, then the locked one
  const [i, setI] = useState(0);
  const page = useRef<HTMLDivElement>(null);

  const sample = i < samples.length ? samples[i] : null;
  const go = (step: number) => setI((n) => (n + step + slides) % slides);

  // A new page starts at its top, not wherever the last one was scrolled to.
  useEffect(() => {
    page.current?.scrollTo({ top: 0 });
  }, [i, kind]);

  return (
    <div className="border-line bg-mist overflow-hidden rounded-xl border shadow-[0_18px_40px_-24px_rgba(14,27,38,0.35)]">
      {/* Browser chrome */}
      <div className="border-line bg-surface flex items-center gap-2 border-b px-3 py-2">
        <span className="flex gap-1.5">
          <span className="bg-ink/15 size-2 rounded-full" />
          <span className="bg-ink/15 size-2 rounded-full" />
          <span className="bg-ink/15 size-2 rounded-full" />
        </span>
        <span className="border-line bg-mist text-ink-faint ml-1 flex-1 truncate rounded-md border px-2.5 py-1 text-[0.6875rem]">
          {sample ? (
            <>
              <span className="text-ink font-semibold">{sample.name}</span>
              <span className="mx-1.5">·</span>
              {sample.kind}
            </>
          ) : (
            "More, on a call"
          )}
        </span>
      </div>

      {/* The page itself, scrollable inside the frame */}
      <div className="relative">
        <div
          ref={page}
          className="bg-surface h-[26rem] overflow-y-auto overscroll-contain"
        >
          {!sample ? (
            <Locked />
          ) : sample.device === "mobile" ? (
            <Mobile key={sample.image} sample={sample} />
          ) : (
            <Desktop key={sample.image} sample={sample} />
          )}
        </div>

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous sample"
          className="text-ink hover:bg-surface absolute top-1/2 left-2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-md backdrop-blur transition-colors"
        >
          <ChevronLeft className="size-4" strokeWidth={2.5} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next sample"
          className="text-ink hover:bg-surface absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-md backdrop-blur transition-colors"
        >
          <ChevronRight className="size-4" strokeWidth={2.5} aria-hidden />
        </button>
      </div>

      {/* Which sample, whose it is, and where we are */}
      <div className="border-line bg-surface flex items-center justify-between gap-3 border-t px-3 py-2">
        {sample ? (
          <a
            href={sample.credit.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-faint hover:text-ink-soft truncate text-[0.6875rem] transition-colors"
          >
            Template: {sample.credit.label}
          </a>
        ) : (
          <span className="text-ink-faint truncate text-[0.6875rem]">
            Client work, shown on a call
          </span>
        )}
        <span className="flex shrink-0 gap-1.5">
          {Array.from({ length: slides }).map((_, n) => (
            <button
              key={n}
              type="button"
              onClick={() => setI(n)}
              aria-label={n < samples.length ? `Sample ${n + 1}` : "More, on a call"}
              aria-current={n === i ? "true" : undefined}
              className={`size-1.5 rounded-full transition-colors ${
                n === i ? "bg-brand-deep" : "bg-ink/20 hover:bg-ink/40"
              }`}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
