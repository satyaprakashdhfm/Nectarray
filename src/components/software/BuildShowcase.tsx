"use client";

import { useEffect, useRef } from "react";
import { useCarousel } from "@/hooks";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SampleCredits, SiteMock } from "@/components/software/SiteMock";
import { software } from "@/lib/content";

const { services } = software;

/**
 * How long a build holds before the panel moves on.
 *
 * Longer than the other showcases on the site because there is more to do
 * here than read: each panel carries two sample sites you can scroll
 * through, so four seconds moved on while people were still looking.
 */
const DWELL = 9000;

/**
 * The five kinds of build, one at a time, with a sample of the finished
 * thing beside each.
 *
 * This was a three-column grid of cards. Six of them side by side meant every
 * card got a third of the width and none got a picture, so the page described
 * six kinds of software without showing what any of them looks like. Given
 * the whole width, each one gets its trades, its 3D mark and a mock-up of the
 * shape it ships in.
 *
 * Same behaviour as the stage panels on /marketing, deliberately: it advances
 * on its own, and a pick holds it for ten seconds before it carries on. See
 * useCarousel.
 */
export function BuildShowcase() {
  const { i, running, mayAnimate, pick, holdProps } = useCarousel(
    services.length,
    DWELL,
  );
  const rail = useRef<HTMLUListElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const box = rail.current;
    const tab = tabs.current[i];
    if (!box || !tab) return;
    box.scrollTo({
      left: Math.max(0, tab.offsetLeft - 8),
      behavior: mayAnimate ? "smooth" : "auto",
    });
  }, [i, mayAnimate]);

  const service = services[i];

  return (
    <>
      <div className="card overflow-hidden p-2.5 sm:p-3" {...holdProps}>
        <div className="border-line bg-canvas overflow-hidden rounded-xl border">
          <div
            role="tabpanel"
            aria-live="polite"
            className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12 lg:p-10"
          >
            <div className="min-w-0">
              <h3 className="display text-ink text-[1.5rem] sm:text-[1.875rem]">
                {service.title}
              </h3>
              <p className="text-ink-soft mt-3 text-[0.9375rem] leading-relaxed">
                {service.body}
              </p>

              {/* The trades. The point of the section: a dentist, a jeweller
                and a warehouse manager should each find their own word here
                rather than decide for themselves whether they count. */}
              <p className="text-ink-faint mt-6 text-[0.625rem] font-semibold tracking-[0.14em] uppercase">
                Built for
              </p>
              <ul className="mt-2 flex flex-wrap gap-1">
                {service.domains.map((domain) => (
                  <li
                    key={domain}
                    className="border-line bg-mist text-ink-soft rounded-md border px-2 py-0.5 text-[0.6875rem] leading-[1.6]"
                  >
                    {domain}
                  </li>
                ))}
              </ul>

              {service.more && (
                <Link
                  href={service.more.href}
                  className="text-brand-deep hover:text-brand group mt-6 inline-flex items-center gap-1.5 text-[0.875rem] font-semibold transition-colors"
                >
                  {service.more.label}
                  <ArrowRight
                    className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                </Link>
              )}
            </div>

            {/* Keyed, so a new category opens on its first sample rather
              than on whichever slide the last one was left at. */}
            <SiteMock key={service.icon} kind={service.icon} />
          </div>

          <div className="border-line bg-mist flex items-center gap-2 border-t p-2">
            <div className="relative min-w-0 flex-1">
              {/* Fades hint that the strip scrolls. From xl up all five tabs
                fit, so they would only wash out the ends of the first and
                last tab. */}
              <span
                className="from-mist pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r to-transparent xl:hidden"
                aria-hidden
              />
              <span
                className="from-mist pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l to-transparent xl:hidden"
                aria-hidden
              />
              <ul
                ref={rail}
                role="tablist"
                aria-label="What we build"
                className="relative flex [scrollbar-width:none] gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden"
              >
                {/* flex-1 shares the row out evenly, so five tabs span the
                  full width instead of bunching left and leaving a gap that
                  reads as a missing sixth. shrink-0 keeps each at least its
                  label's width, so on a narrow screen the strip scrolls
                  rather than squashing them. */}
                {services.map((entry, n) => (
                  <li key={entry.title} className="flex-1 shrink-0">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={n === i}
                      ref={(el) => {
                        tabs.current[n] = el;
                      }}
                      onClick={() => pick(n)}
                      className={`relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg px-3 py-2 text-[0.8125rem] font-medium whitespace-nowrap transition-colors ${
                        n === i
                          ? "bg-brand-deep text-white"
                          : "text-ink-soft hover:bg-surface hover:text-ink"
                      }`}
                    >
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

      {/* The licence notice for the samples inside, kept out of the panel so
          it reads as a footnote to the section rather than as a caption on
          each slide. */}
      <SampleCredits />
    </>
  );
}
