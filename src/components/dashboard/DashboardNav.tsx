"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, LifeBuoy, PenSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/notes", label: "Notes & curriculum", icon: BookOpen },
  { href: "/dashboard/assignments", label: "Assignments", icon: PenSquare },
  { href: "/dashboard/support", label: "Support", icon: LifeBuoy },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard" className="lg:sticky lg:top-[88px]">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {TABS.map((tab) => {
          // Only the index tab needs an exact match; the rest own their subtree.
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
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-[0.9375rem] font-medium whitespace-nowrap transition-colors",
                  active
                    ? "bg-ink text-white"
                    : "text-ink-soft hover:bg-mist hover:text-ink",
                )}
              >
                <tab.icon
                  className="size-[1.125rem]"
                  strokeWidth={1.9}
                  aria-hidden
                />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
