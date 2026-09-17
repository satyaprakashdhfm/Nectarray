"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useCarousel } from "@/hooks";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Icon } from "@/components/ui/Icon";

export type ShowcaseItem = {
  icon: string;
  title: string;
  body: string;
  /** The real marks where the thing is a product; the glyph stands in otherwise. */
  logos?: { name: string; domain: string }[];
  /**
   * Evidence, where a picture of the thing beats another paragraph about it.
   * A slide with one gives the whole panel over to it: no glyph, no heading,
   * just the screenshot across the full width with the explanation beneath.
   * The tab below is already labelled, so a heading would only repeat it.
   */
  shot?: { src: string; alt: string; width: number; height: number };
};

/** How long each service holds before the panel moves on. */
const DWELL = 4000;

/**
 * One stage's services, shown one at a time and advancing on its own.
 *
 * These used to be a nine- or ten-card grid, which is a wall a reader skims
 * and takes nothing from. One at a time in a framed panel gives the content
 * somewhere to sit, and moving by itself means a reader who never touches it
 * still sees everything the stage covers.
 *
 * The tab strip sits under the slide rather than beside it, and is the only
 * progress indicator: a title bar above the panel repeated the stage name the
 * section heading already gives, and put the countdown somewhere separate
 * from the thing it was counting down. The run now draws along the bottom of
 * the live tab, where the movement is about to happen.
 *
It no longer pauses under the cursor, and picking a tab holds it for ten
 * seconds rather than stopping it for good — see useCarousel for why.
 */
export function StageShowcase({
  label,
  items,
}: {
  label: string;
  items: ShowcaseItem[];
}) {
  const { i, running, engaged, mayAnimate, pick, holdProps, hoverProps } =
    useCarousel(items.length, DWELL);
  const rail = useRef<HTMLUListElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // The live tab is pulled to the left edge of the strip, so a service that
  // has had its turn slides away and the ones still to come arrive from the
  // right. Centring it instead left half the strip showing tabs already seen.
  //
  // The container's own scrollLeft is moved rather than scrollIntoView, which
  // would drag the whole page along with it. `relative` on the list makes it
  // the offsetParent, so offsetLeft is already the scrollLeft we want.
  useEffect(() => {
    // Never while someone is working the strip. This is what made a tab hard
    // to hit: the rotation advanced mid-reach, the rail scrolled the new tab
    // to the left edge, and the one being aimed at slid a hundred pixels
    // sideways, so the click landed on its neighbour.
    if (engaged) return;
    const box = rail.current;
    const tab = tabs.current[i];
    if (!box || !tab) return;
    box.scrollTo({
      left: Math.max(0, tab.offsetLeft - 8),
      behavior: mayAnimate ? "smooth" : "auto",
    });
  }, [i, mayAnimate, engaged]);

  const item = items[i];

  /**
   * One window shape for the whole stage, taken from the first slide that has
   * a picture. Every shot in a stage is cut to the same ratio, so the panel
   * keeps its height as the rotation moves through it — a panel that grows
   * and shrinks moves the tab strip under whoever is reaching for it.
   */
  const box = items.find((entry) => entry.shot)?.shot;
  const window = box ? `${box.width} / ${box.height}` : undefined;

  return (
    <div className="card overflow-hidden p-2 sm:p-2.5 lg:p-3" {...holdProps}>
      <div className="border-line bg-canvas overflow-hidden rounded-xl border">
        <div
          role="tabpanel"
          aria-live="polite"
          className="p-5 sm:p-8 lg:min-h-[19rem] lg:p-10"
        >
          {item.shot ? (
            <>
              {/*
               * Bled to the panel's edges: the negative margins cancel the
               * padding, and the rounded, clipped box around this does the
               * corners. A real answer at full width makes the point that a
               * paragraph about assistants cannot.
               */}
              {/*
               * The pictures are cut to the window rather than fitted inside
               * it. Letting each keep its own shape left a black band under
               * the shorter ones, which read as the screenshot being broken.
               * Cover crops instead: the captures lose a little of the bottom
               * chrome or the empty ground at the right, which is what was
               * trimmed out of the files themselves anyway.
               */}
              <div
                className="border-line -mx-5 -mt-5 overflow-hidden border-b bg-[#0e0f11] sm:-mx-8 sm:-mt-8 lg:-mx-10 lg:-mt-10"
                style={{ aspectRatio: window }}
              >
                <Image
                  src={item.shot.src}
                  alt={item.shot.alt}
                  width={item.shot.width}
                  height={item.shot.height}
                  sizes="(min-width: 1024px) 50rem, 94vw"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              {/*
               * Every description in the stage sits in the one grid cell, and
               * all but the live one are hidden rather than unmounted. The
               * cell is therefore as tall as the longest of them and never
               * changes as the panel advances, which is what keeps the strip
               * below from moving under a cursor reaching for a tab.
               *
               * This replaced a flat three-line minimum. Three lines is right
               * for the assistant answers in 01 and a line too many for the
               * ad consoles in 03, where it left a band of empty panel above
               * the strip. Measuring the stage's own copy costs nothing and
               * is never wrong. `invisible` is visibility, not display, so
               * the hidden ones hold the space without being read out.
               */}
              <div className="mt-5 grid sm:mt-7">
                {items.map((entry, n) => (
                  <p
                    key={entry.title}
                    className={`text-ink-soft col-start-1 row-start-1 text-[0.9375rem] leading-relaxed sm:text-[1rem] ${
                      n === i ? "" : "invisible"
                    }`}
                  >
                    {entry.body}
                  </p>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2.5">
                {item.logos?.length ? (
                  item.logos.map((brand) => (
                    <span
                      key={brand.name}
                      className="border-line bg-surface grid size-12 place-items-center rounded-xl border"
                      title={brand.name}
                    >
                      <BrandLogo
                        name={brand.name}
                        domain={brand.domain}
                        className="size-6"
                      />
                    </span>
                  ))
                ) : (
                  <span className="bg-brand-deep grid size-12 place-items-center rounded-xl text-white">
                    <Icon name={item.icon} className="size-6" />
                  </span>
                )}
              </div>

              <h3 className="display text-ink mt-6 text-[1.5rem] sm:text-[1.875rem]">
                {item.title}
              </h3>
              {/* Stacked the same way, so a stage with no pictures holds its
                  height too. */}
              <div className="mt-4 grid max-w-xl">
                {items.map((entry, n) => (
                  <p
                    key={entry.title}
                    className={`text-ink-soft col-start-1 row-start-1 text-[0.9375rem] leading-relaxed sm:text-[1rem] ${
                      n === i ? "" : "invisible"
                    }`}
                  >
                    {entry.body}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>

        {/* The strip, along the bottom in the style of the reference: one
            segment per service, the live one filled, scrolling sideways
            because ten of these will never fit across a column. */}
        <div
          className="border-line bg-mist flex items-center gap-2 border-t p-2"
          {...hoverProps}
        >
          {/* A fade at each end rather than a scrollbar: it says there is more
              of the strip without spending a row on saying it, and the tabs
              slide under it as the panel advances. */}
          <div className="relative min-w-0 flex-1">
            <span
              className="from-mist pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r to-transparent"
              aria-hidden
            />
            <span
              className="from-mist pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l to-transparent"
              aria-hidden
            />
            <ul
              ref={rail}
              role="tablist"
              aria-label={`${label} services`}
              className="relative flex [scrollbar-width:none] gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden"
            >
              {items.map((entry, n) => (
                <li key={entry.title} className="shrink-0">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={n === i}
                    ref={(el) => {
                      tabs.current[n] = el;
                    }}
                    onClick={() => pick(n)}
                    className={`relative flex items-center gap-2 overflow-hidden rounded-lg px-3 py-2 text-[0.8125rem] font-medium whitespace-nowrap transition-colors ${
                      n === i
                        ? "bg-brand-deep text-white"
                        : "text-ink-soft hover:bg-surface hover:text-ink"
                    }`}
                  >
                    <span className="grid size-5 shrink-0 place-items-center">
                      {entry.logos?.[0] ? (
                        <BrandLogo
                          name={entry.logos[0].name}
                          domain={entry.logos[0].domain}
                          className="size-4"
                        />
                      ) : (
                        <Icon name={entry.icon} className="size-4" />
                      )}
                    </span>
                    {entry.title}

                    {n === i && running && (
                      <span
                        key={i}
                        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-white/70"
                        style={{
                          animation: `showcase-run ${DWELL}ms linear forwards`,
                        }}
                        aria-hidden
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
