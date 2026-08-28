"use client";

import { useEffect, useRef } from "react";
import { useActiveSection, useHasScrolled } from "@/hooks";
import { sectionRail } from "@/lib/content";
import { cn } from "@/lib/utils";

const ids = sectionRail.map((section) => section.href);

/**
 * Horizontally scrolling section index, pinned under the header.
 *
 * The counterpart to <SectionRail /> for every viewport below 1536px, where
 * there is no gutter to put a vertical rail in. It stays out of the way until
 * the visitor has scrolled past the hero, then tracks the current section and
 * keeps the active chip scrolled into view.
 */
export function SectionBar() {
  const active = useActiveSection(ids);
  const shown = useHasScrolled(320);
  const trackRef = useRef<HTMLUListElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);

  // Follow the active chip, but scroll only this strip — never the page.
  useEffect(() => {
    const chip = activeRef.current;
    const track = trackRef.current;
    if (!chip || !track || !shown) return;

    const target =
      chip.offsetLeft - track.clientWidth / 2 + chip.clientWidth / 2;

    track.scrollTo({
      left: Math.max(0, target),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [active, shown]);

  return (
    <nav
      aria-label="Page sections"
      className={cn(
        "border-line bg-canvas/90 fixed inset-x-0 top-[72px] z-40 border-b backdrop-blur-xl",
        "transition-all duration-300 min-[1536px]:hidden",
        shown
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0",
      )}
    >
      <ul
        ref={trackRef}
        className="flex [scrollbar-width:none] gap-1.5 overflow-x-auto px-4 py-2.5 [-ms-overflow-style:none] md:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {sectionRail.map((section) => {
          const isActive = active === section.href;

          return (
            <li key={section.href} className="shrink-0">
              <a
                ref={isActive ? activeRef : undefined}
                href={`#${section.href}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "block rounded-full px-3.5 py-2 text-[0.8125rem] font-medium whitespace-nowrap transition-colors duration-200",
                  isActive
                    ? "bg-ink text-white"
                    : "bg-mist text-ink-soft active:bg-line",
                )}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
