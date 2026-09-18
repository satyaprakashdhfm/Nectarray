"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCarousel } from "@/hooks";

/** How long a page holds before the track moves on, when `auto` is set. */
const DWELL = 5000;

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
 *
 * `auto` turns on the rotation the rest of the site uses — a page every five
 * seconds, held for ten by anything that means somebody is working it, and
 * never running at all for a reader who has asked for reduced motion. It is
 * opt-in rather than the default because this component is shared, and a wall
 * of testimonials that moves on its own is a different decision from a row of
 * offerings that does.
 */
export function Carousel({
  label,
  auto = false,
  children,
}: {
  label: string;
  auto?: boolean;
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

  /*
   * The hook is used for whether the rotation should be running — reduced
   * motion, the ten-second hold after someone touches it, keyboard focus —
   * and not for which page is live. The track already knows that: it is a
   * real scroll container, and `page` is read back from its scrollLeft, so a
   * swipe is already reflected there. Driving the position from the hook as
   * well would mean two answers to one question, and every manual swipe would
   * need syncing back into it.
   *
   * `pages` is passed as the count because the hook stops running when there
   * is nothing to rotate, which is exactly right when everything fits on one
   * screen.
   */
  const { running, snooze, holdProps } = useCarousel(auto ? pages : 1, DWELL);

  const goto = useCallback(
    (next: number) => {
      const el = track.current;
      if (!el) return;
      el.scrollTo({
        left: Math.min(Math.max(next, 0), pages - 1) * el.clientWidth,
        behavior: "smooth",
      });
    },
    [pages],
  );

  /** Move, and hold the rotation — what every control here should do. */
  const drive = (next: number) => {
    if (auto) snooze();
    goto(next);
  };

  /*
   * Advance by a screenful from wherever the track actually is, and wrap once
   * it has reached the end.
   *
   * By scroll position rather than by page number, because the two do not
   * divide evenly: seven cards three-up is 2.33 screens, which `measure`
   * rounds to two pages. Stepping 0 → 1 → back to 0 would mean the last card
   * was never once shown, and stepping to a page index past the end would
   * scroll to a position the browser clamps — leaving `page` unchanged, so
   * nothing below would re-run and the rotation would simply stop there.
   *
   * `tick` is what re-arms it. It cannot depend on the position changing,
   * for the same reason: the final advance is clamped, and an advance that
   * moves the track by less than a full screen still has to schedule the
   * next one.
   */
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!auto || !running || pages <= 1) return;
    const t = setTimeout(() => {
      const el = track.current;
      if (!el) return;
      const end = el.scrollWidth - el.clientWidth;
      el.scrollTo({
        left: end - el.scrollLeft < 2 ? 0 : el.scrollLeft + el.clientWidth,
        behavior: "smooth",
      });
      setTick((n) => n + 1);
    }, DWELL);
    return () => clearTimeout(t);
  }, [auto, running, pages, page, tick]);

  /*
   * Every hold except the one on scrolling.
   *
   * `onScrollCapture` cannot tell whose scroll it heard, and the effect above
   * scrolls the track every time the rotation advances — so left on, the
   * rotation would snooze itself the instant it moved and never run again.
   * A reader's own swipe is caught by the touch and wheel captures and their
   * click by the pointer one, which is the whole of how this track is
   * actually driven by hand.
   */
  const hold = auto ? { ...holdProps, onScrollCapture: undefined } : undefined;

  const arrow =
    "border-line bg-surface text-ink hover:bg-ink hover:text-cta-fg hover:border-ink grid size-11 shrink-0 place-items-center rounded-full border shadow-sm transition-colors disabled:pointer-events-none disabled:opacity-30";

  return (
    <div className="relative" {...hold}>
      <div className="flex items-center gap-3 lg:gap-5">
        <button
          type="button"
          onClick={() => drive(page - 1)}
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
          onClick={() => drive(page + 1)}
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
              onClick={() => drive(i)}
              aria-label={`${label}, page ${i + 1}`}
              aria-current={i === page ? "true" : undefined}
              className={`relative grid size-7 place-items-center overflow-hidden rounded-md text-[0.8125rem] font-semibold transition-colors ${
                i === page
                  ? "bg-ink text-cta-fg"
                  : "bg-mist text-ink-faint hover:text-ink border-line border"
              }`}
            >
              {i + 1}

              {/* The dwell drawn along the bottom of the live number, so the
                  track moving on by itself is announced a moment before it
                  happens rather than being sudden. Keyed on the page, so the
                  line restarts each time rather than carrying on from
                  wherever the last one had got to. */}
              {i === page && auto && running && (
                <span
                  key={`${page}-${tick}`}
                  className="bg-cta-fg/70 absolute inset-x-0 bottom-0 h-0.5 origin-left"
                  style={{
                    animation: `showcase-run ${DWELL}ms linear forwards`,
                  }}
                  aria-hidden
                />
              )}
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
