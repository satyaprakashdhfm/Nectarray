"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Briefcase,
  CalendarDays,
  Code,
  GraduationCap,
  IndianRupee,
  Inbox,
  ChartLine,
  LockOpen,
  Megaphone,
  NotebookPen,
  Search,
  Users,
} from "lucide-react";

/** The business: money, search and ads first, then one tab per service. */
const TABS = [
  { href: "/admin", label: "Revenue", icon: IndianRupee },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/analytics", label: "Ads & Analytics", icon: ChartLine },
  { href: "/admin/services/marketing", label: "Marketing", icon: Megaphone },
  { href: "/admin/services/software", label: "Software", icon: Code },
  { href: "/admin/services/ai", label: "Agentic AI", icon: Bot },
  { href: "/admin/students", label: "Academy", icon: GraduationCap },
];

/** The academy's own tabs, shown under the Academy tab. */
const ACADEMY = [
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/cohort", label: "Class", icon: CalendarDays },
  { href: "/admin/lessons", label: "Notes", icon: NotebookPen },
  { href: "/admin/unlocking", label: "Unlocking", icon: LockOpen },
  { href: "/admin/placement", label: "Placement", icon: Briefcase },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
];

type Tab = (typeof TABS)[number];

/**
 * The panel's tab strips.
 *
 * A client component only because the selected tab has to be worked out from
 * the path, and the layout that holds it is a server component.
 */
export function AdminTabs() {
  const pathname = usePathname();
  const inAcademy = ACADEMY.some((tab) => pathname.startsWith(tab.href));

  // /admin owns only itself; the rest own their subtree, so a lesson being
  // edited still lights the tab it was opened from.
  const active = (tab: Tab) =>
    tab.label === "Academy"
      ? inAcademy
      : tab.href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(tab.href);

  return (
    <nav aria-label="Admin" className="mb-8 space-y-3">
      <Strip tabs={TABS} isActive={active} />
      {inAcademy && (
        <Strip
          tabs={ACADEMY}
          isActive={(tab) => pathname.startsWith(tab.href)}
          label="Academy"
        />
      )}
    </nav>
  );
}

function Strip({
  tabs,
  isActive,
  label,
}: {
  tabs: Tab[];
  isActive: (tab: Tab) => boolean;
  label?: string;
}) {
  return (
    <ul className="tab-bar" aria-label={label}>
      {tabs.map((tab) => {
        const active = isActive(tab);
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
  );
}
