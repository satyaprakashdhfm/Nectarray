"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * A row of cards that scrolls one screenful at a time.
 *
 * The track is a real scroll container with snap points rather than a
 * transformed strip, so how many cards are visible is decided entirely in
 * CSS by the slide width — one on a phone, two on a tablet, three on a
 * desktop — and this component never has to know. It only measures the
 * container to work out how many pages that adds up to.
 *
 * Which means it still works with JavaScript disabled or before hydration:
 * the cards are there and the track swipes. The arrows and the numbers are
 * the enhancement.
 */
export function Carousel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el || el.clientWidth === 0) return;
    setPages(Math.max(1, Math.round(el.scrollWidth / el.clientWidth)));
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  useEffect(() => {
    measure();
    const el = track.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  const goto = (next: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({
      left: Math.min(Math.max(next, 0), pages - 1) * el.clientWidth,
      behavior: "smooth",
    });
  };

  const arrow =
    "border-line bg-surface text-ink hover:bg-ink hover:text-cta-fg hover:border-ink grid size-11 shrink-0 place-items-center rounded-full border shadow-sm transition-colors disabled:pointer-events-none disabled:opacity-30";

  return (
    <div className="relative">
      <div className="flex items-center gap-3 lg:gap-5">
        <button
          type="button"
          onClick={() => goto(page - 1)}
          disabled={page === 0}
          aria-label={`Previous ${label}`}
          className={`${arrow} hidden sm:grid`}
        >
          <ArrowLeft className="size-4.5" strokeWidth={2.2} aria-hidden />
        </button>

        <ul
          ref={track}
          onScroll={() => {
            const el = track.current;
            if (el) setPage(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="no-scrollbar -mx-2.5 flex flex-1 snap-x snap-mandatory overflow-x-auto scroll-smooth py-1"
        >
          {children}
        </ul>

        <button
          type="button"
          onClick={() => goto(page + 1)}
          disabled={page >= pages - 1}
          aria-label={`Next ${label}`}
          className={`${arrow} hidden sm:grid`}
        >
          <ArrowRight className="size-4.5" strokeWidth={2.2} aria-hidden />
        </button>
      </div>

      {pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goto(i)}
              aria-label={`${label}, page ${i + 1}`}
              aria-current={i === page ? "true" : undefined}
              className={`grid size-7 place-items-center rounded-md text-[0.8125rem] font-semibold transition-colors ${
                i === page
                  ? "bg-ink text-cta-fg"
                  : "bg-mist text-ink-faint hover:text-ink border-line border"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** One card in the track. Width here is what decides how many are on screen. */
export function Slide({ children }: { children: React.ReactNode }) {
  return (
    <li className="w-full shrink-0 snap-start px-2.5 sm:w-1/2 lg:w-1/3">
      {children}
    </li>
  );
}
