"use client";

import { useActiveSection, useHasScrolled } from "@/hooks";
import { sectionRail } from "@/lib/content";
import { cn } from "@/lib/utils";

const ids = sectionRail.map((section) => section.href);

/**
 * Fixed vertical section index down the left gutter.
 *
 * Only rendered from 1536px up. That is the first width where the gutter beside
 * the centred `shell` clears the labels outright — at 1440px the rail's edge
 * and the first line of text meet at the same pixel. Narrower viewports get
 * <SectionBar /> instead.
 */
export function SectionRail() {
  const active = useActiveSection(ids);
  const scrolled = useHasScrolled(320);

  return (
    <nav
      aria-label="Page sections"
      className={cn(
        "fixed top-1/2 left-6 z-40 hidden -translate-y-1/2 min-[1536px]:block",
        "transition-all duration-500",
        scrolled
          ? "pointer-events-auto translate-x-0 opacity-100"
          : "pointer-events-none -translate-x-3 opacity-0",
      )}
    >
      <ul className="flex flex-col gap-0.5">
        {sectionRail.map((section) => {
          const isActive = active === section.href;

          return (
            <li key={section.href}>
              <a
                href={`#${section.href}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center gap-2.5 py-1.5"
              >
                {/* tick mark: grows and takes the brand colour when active */}
                <span
                  aria-hidden
                  className={cn(
                    "h-px shrink-0 rounded-full transition-all duration-300",
                    isActive
                      ? "bg-brand w-7"
                      : "bg-ink-faint/40 group-hover:bg-ink-faint w-3.5 group-hover:w-5",
                  )}
                />
                <span
                  className={cn(
                    "text-[0.8125rem] leading-none whitespace-nowrap transition-all duration-300",
                    isActive
                      ? "text-ink font-semibold"
                      : "text-ink-faint group-hover:text-ink-soft font-medium",
                  )}
                >
                  {section.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
