"use client";
import { ADMIN } from "@/lib/admin-path";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Boxes,
  ChartLine,
  FolderKanban,
  Megaphone,
  Network,
  Search,
  type LucideIcon,
} from "lucide-react";

type Tab = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Current only on its own page and these, not on every page below it. */
  exact?: string[];
};

/**
 * Pages that share one sidebar entry, as tabs across the top: our own
 * website (what the ads cost and bring, who visits, how it does in search),
 * and DevOps under Software (our projects, their stack, how they are built,
 * what we are learning).
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
  devops: {
    label: "DevOps",
    tabs: [
      {
        href: `${ADMIN}/devops`,
        label: "Projects",
        icon: FolderKanban,
        exact: [`${ADMIN}/devops/projects`],
      },
      { href: `${ADMIN}/devops/stack`, label: "Stack", icon: Boxes },
      { href: `${ADMIN}/devops/design`, label: "System design", icon: Network },
      {
        href: `${ADMIN}/devops/knowledge`,
        label: "General knowledge",
        icon: BookOpen,
      },
    ],
  },
};

export function SectionTabs({ section }: { section: "website" | "devops" }) {
  const pathname = usePathname();
  const { label, tabs } = SECTIONS[section];
  return (
    <nav aria-label={label} className="mb-6">
      <ul className="tab-bar">
        {tabs.map((tab) => {
          const active = tab.exact
            ? pathname === tab.href ||
              tab.exact.some((path) => pathname.startsWith(path))
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
