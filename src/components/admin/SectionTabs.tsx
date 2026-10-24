"use client";
import { ADMIN } from "@/lib/admin-path";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartLine, Megaphone, Search, type LucideIcon } from "lucide-react";

type Tab = { href: string; label: string; icon: LucideIcon };

/**
 * Pages that share one sidebar entry, as tabs across the top: our own
 * website (what the ads cost and bring, who visits, how it does in search).
 */
const SECTIONS: Record<string, { label: string; tabs: Tab[] }> = {
  website: {
    label: "Our website",
    tabs: [
      { href: `${ADMIN}/ads`, label: "Ads", icon: Megaphone },
      { href: `${ADMIN}/analytics`, label: "Analytics", icon: ChartLine },
      { href: `${ADMIN}/seo`, label: "SEO", icon: Search },
    ],
  },
};

export function SectionTabs({ section }: { section: "website" }) {
  const pathname = usePathname();
  const { label, tabs } = SECTIONS[section];
  return (
    <nav aria-label={label} className="mb-6">
      <ul className="tab-bar">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className="tab"
              >
                <tab.icon className="size-4" strokeWidth={1.9} aria-hidden />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
