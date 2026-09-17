"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Briefcase,
  LayoutDashboard,
  LifeBuoy,
  PenSquare,
} from "lucide-react";

/*
 * Projects used to have its own tab here. It is a track inside Assignments
 * now — Python problems, SQL questions and Projects are one kind of thing,
 * "work a student does and gets marked on", and having two top-level entries
 * for one kind of thing was the actual problem, not how many builds happened
 * to be in the third one.
 */
const TABS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/notes", label: "Notes", icon: BookOpen },
  { href: "/dashboard/assignments", label: "Assignments", icon: PenSquare },
  { href: "/dashboard/placement", label: "Placement", icon: Briefcase },
  { href: "/dashboard/support", label: "Support", icon: LifeBuoy },
];

/**
 * Top-level tabs, sitting under the header rather than down the left.
 *
 * The notes section needs the left edge for its own document rail, and two
 * stacked rails is how you lose a reader. Product navigation across the top,
 * content navigation down the side — which is what every documentation site
 * settles on eventually.
 */
export function DashboardNav() {
  const pathname = usePathname();
  const strip = useRef<HTMLUListElement>(null);

  /*
   * Bring the current tab into view.
   *
   * On a phone the strip is scrolled and the tab you are on can be off the
   * right edge — so Placement showed a Placement page under a strip that
   * appeared to say you were on Dashboard. Nearest, so an already-visible tab
   * does not drag the strip around under the reader for no reason.
   */
  useEffect(() => {
    strip.current
      ?.querySelector("[data-active]")
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [pathname]);

  return (
    <nav
      aria-label="Sections"
      className="border-line bg-canvas sticky top-[var(--app-header)] z-40 border-b"
    >
      <div className="shell flex h-[var(--app-nav)] items-center">
        {/* min-w-0 so the strip inside may shrink and scroll, and a fade at
            each end so it is visible that it does. Five tabs need about 630px
            and a phone has 350 of them, so Placement and Support were simply
            off the edge with nothing to suggest they existed. */}
        <div className="relative min-w-0 flex-1">
          {/* from-surface, not from-canvas: canvas is #fbfcfc and the pill's
              interior is #ffffff, so a fade between them is a 1.5% difference
              and reads as nothing at all. Inset by the pill's border and
              rounded to its corner, so the last tab dissolves into the pill
              rather than being chopped off at it. */}
          <span
            className="from-surface pointer-events-none absolute inset-y-px left-px z-10 w-8 rounded-l-full bg-gradient-to-r to-transparent"
            aria-hidden
          />
          <span
            className="from-surface pointer-events-none absolute inset-y-px right-px z-10 w-8 rounded-r-full bg-gradient-to-l to-transparent"
            aria-hidden
          />
          <ul ref={strip} className="tab-bar">
            {TABS.map((tab) => {
              // Only the index tab needs an exact match; the rest own a subtree.
              // /dashboard/projects is folded into Assignments but still a
              // real, bookmarkable route — the Assignments tab claims it too,
              // rather than leaving a visitor on an old link with nothing lit.
              const active =
                tab.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(tab.href) ||
                    (tab.href === "/dashboard/assignments" &&
                      pathname.startsWith("/dashboard/projects"));

              return (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    aria-current={active ? "page" : undefined}
                    data-active={active ? "" : undefined}
                    className="tab"
                  >
                    <tab.icon
                      className="size-[1.0625rem] shrink-0"
                      strokeWidth={1.9}
                      aria-hidden
                    />
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
