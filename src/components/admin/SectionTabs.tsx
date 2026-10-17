"use client";
import { ADMIN } from "@/lib/admin-path";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartLine,
  IndianRupee,
  Megaphone,
  Search,
  Wallet,
  type LucideIcon,
} from "lucide-react";

type Tab = { href: string; label: string; icon: LucideIcon };

/**
 * Pages that share one sidebar entry, as tabs across the top: the money
 * (what came in, and what the company holds), and our own website (what
 * the ads cost and bring, who visits, how it does in search).
 */
const SECTIONS: Record<string, { label: string; tabs: Tab[] }> = {
  money: {
    label: "Revenue and assets",
    tabs: [
      { href: `${ADMIN}`, label: "Revenue", icon: IndianRupee },
      { href: `${ADMIN}/assets`, label: "Assets", icon: Wallet },
    ],
  },
  website: {
    label: "Our website",
    tabs: [
      { href: `${ADMIN}/ads`, label: "Ads", icon: Megaphone },
      { href: `${ADMIN}/analytics`, label: "Analytics", icon: ChartLine },
      { href: `${ADMIN}/seo`, label: "SEO", icon: Search },
    ],
  },
};

export function SectionTabs({ section }: { section: "money" | "website" }) {
  const pathname = usePathname();
  const { label, tabs } = SECTIONS[section];
  return (
    <nav aria-label={label} className="mb-6">
      <ul className="tab-bar">
        {tabs.map((tab) => {
          // Revenue is the panel's home, so only its own address counts.
          const active =
            tab.href === `${ADMIN}`
              ? pathname === tab.href
              : pathname.startsWith(tab.href);
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
