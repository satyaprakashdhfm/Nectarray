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
 * The panel's navigation: a sticky sidebar on desktop, with the academy's
 * pages nested under Academy, and horizontal strips on a phone, where a
 * sidebar would take half the screen.
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

  const academyActive = (tab: Tab) => pathname.startsWith(tab.href);

  return (
    <nav aria-label="Admin">
      <div className="mb-6 space-y-3 lg:hidden">
        <Strip tabs={TABS} isActive={active} />
        {inAcademy && (
          <Strip tabs={ACADEMY} isActive={academyActive} label="Academy" />
        )}
      </div>

      <ul className="hidden space-y-0.5 lg:block">
        {TABS.map((tab) => (
          <li key={tab.href}>
            <SideLink tab={tab} active={active(tab)} />
            {tab.label === "Academy" && (
              <ul className="border-line mt-0.5 ml-[1.1rem] space-y-0.5 border-l pl-2">
                {ACADEMY.map((sub) => (
                  <li key={sub.href}>
                    <SideLink tab={sub} active={academyActive(sub)} small />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SideLink({
  tab,
  active,
  small = false,
}: {
  tab: Tab;
  active: boolean;
  small?: boolean;
}) {
  return (
    <Link
      href={tab.href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2.5 rounded-lg px-3 font-semibold transition-colors ${
        small ? "py-1.5 text-[0.8125rem]" : "py-2 text-[0.875rem]"
      } ${
        active
          ? "bg-brand-solid text-cta-fg"
          : "text-ink-soft hover:bg-surface hover:text-ink"
      }`}
    >
      <tab.icon
        className={small ? "size-3.5" : "size-4"}
        strokeWidth={1.9}
        aria-hidden
      />
      {tab.label}
    </Link>
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
