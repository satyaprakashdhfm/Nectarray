"use client";

import { useEffect, useRef } from "react";
import { useCarousel } from "@/hooks";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Icon } from "@/components/ui/Icon";

export type ShowcaseItem = {
  icon: string;
  title: string;
  body: string;
  /** The real marks where the thing is a product; the glyph stands in otherwise. */
  logos?: { name: string; domain: string }[];
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
  const { i, running, mayAnimate, pick, holdProps } = useCarousel(
    items.length,
    DWELL,
  );
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
    const box = rail.current;
    const tab = tabs.current[i];
    if (!box || !tab) return;
    box.scrollTo({
      left: Math.max(0, tab.offsetLeft - 8),
      behavior: mayAnimate ? "smooth" : "auto",
    });
  }, [i, mayAnimate]);

  const item = items[i];

  return (
    <div className="card overflow-hidden p-2.5 sm:p-3" {...holdProps}>
      <div className="border-line bg-canvas overflow-hidden rounded-xl border">
        <div
          role="tabpanel"
          aria-live="polite"
          className="p-8 sm:p-10 lg:min-h-[19rem]"
        >
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
          <p className="text-ink-soft mt-4 max-w-xl text-[1rem] leading-relaxed">
            {item.body}
          </p>
        </div>

        {/* The strip, along the bottom in the style of the reference: one
            segment per service, the live one filled, scrolling sideways
            because ten of these will never fit across a column. */}
        <div className="border-line bg-mist flex items-center gap-2 border-t p-2">
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
