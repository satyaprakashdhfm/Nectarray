"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, LifeBuoy, PenSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/notes", label: "Notes", icon: BookOpen },
  { href: "/dashboard/assignments", label: "Assignments", icon: PenSquare },
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

  return (
    <nav
      aria-label="Sections"
      className="border-line bg-canvas sticky top-[72px] z-40 border-b"
    >
      <div className="shell">
        <ul className="-mb-px flex gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            // Only the index tab needs an exact match; the rest own a subtree.
            const active =
              tab.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(tab.href);

            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-2.5 border-b-2 px-4 py-3.5 text-[0.9375rem] font-medium whitespace-nowrap transition-colors",
                    active
                      ? "border-brand text-ink"
                      : "text-ink-soft hover:text-ink border-transparent",
                  )}
                >
                  <tab.icon
                    className="size-[1.0625rem]"
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
    </nav>
  );
}
