"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, LifeBuoy, PenSquare } from "lucide-react";

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
      <div className="shell py-2.5">
        <ul className="tab-bar">
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
                  className="tab"
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
