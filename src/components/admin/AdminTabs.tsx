"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Briefcase,
  CalendarDays,
  ChartLine,
  ChevronDown,
  Code,
  Component,
  FileText,
  FolderKanban,
  GraduationCap,
  Inbox,
  IndianRupee,
  Layers,
  Lightbulb,
  Link2,
  LockOpen,
  Megaphone,
  NotebookPen,
  Palette,
  Search,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

type Tab = { href: string; label: string; icon: LucideIcon };
type Group = Tab & { children: Tab[]; owns: string[] };

const TOP: Tab[] = [
  { href: "/admin", label: "Revenue", icon: IndianRupee },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/analytics", label: "Analytics", icon: ChartLine },
  { href: "/admin/ads", label: "Ads", icon: Megaphone },
  { href: "/admin/development", label: "All projects", icon: Layers },
  { href: "/admin/quotes", label: "Quotations", icon: FileText },
];

/**
 * Each service is its own group, holding its projects and the tools and
 * notes for doing that work: Marketing has the notes on Search Console, GA4,
 * ads and WhatsApp; Software has the website-building tabs. Then the
 * academy.
 */
const GROUPS: Group[] = [
  {
    href: "/admin/services/marketing",
    label: "Marketing",
    icon: Megaphone,
    owns: ["/admin/services/marketing", "/admin/marketing"],
    children: [
      {
        href: "/admin/services/marketing",
        label: "Projects",
        icon: FolderKanban,
      },
      { href: "/admin/marketing/notes", label: "Notes", icon: NotebookPen },
    ],
  },
  {
    href: "/admin/services/software",
    label: "Software",
    icon: Code,
    owns: ["/admin/services/software", "/admin/web"],
    children: [
      {
        href: "/admin/services/software",
        label: "Projects",
        icon: FolderKanban,
      },
      { href: "/admin/web", label: "Learnings", icon: Lightbulb },
      { href: "/admin/web/colours", label: "Colours", icon: Palette },
      { href: "/admin/web/elements", label: "Elements", icon: Component },
      { href: "/admin/web/animations", label: "Animations", icon: Sparkles },
      { href: "/admin/web/references", label: "References", icon: Link2 },
    ],
  },
  {
    href: "/admin/services/ai",
    label: "Agentic AI",
    icon: Bot,
    owns: ["/admin/services/ai"],
    children: [
      { href: "/admin/services/ai", label: "Projects", icon: FolderKanban },
    ],
  },
  {
    href: "/admin/students",
    label: "Academy",
    icon: GraduationCap,
    owns: [
      "/admin/students",
      "/admin/cohort",
      "/admin/lessons",
      "/admin/unlocking",
      "/admin/placement",
      "/admin/enquiries",
    ],
    children: [
      { href: "/admin/students", label: "Students", icon: Users },
      { href: "/admin/cohort", label: "Class", icon: CalendarDays },
      { href: "/admin/lessons", label: "Notes", icon: NotebookPen },
      { href: "/admin/unlocking", label: "Unlocking", icon: LockOpen },
      { href: "/admin/placement", label: "Placement", icon: Briefcase },
      { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
    ],
  },
];

/**
 * The panel's navigation: a sticky sidebar on desktop, where each service
 * and the Academy open and close like dropdowns, and horizontal strips on a
 * phone, where a sidebar would take half the screen.
 *
 * A client component because the selected tab is worked out from the path
 * and the groups remember whether they were opened or closed.
 */
export function AdminTabs() {
  const pathname = usePathname();
  /*
   * One group open at a time, like an accordion: opening Marketing closes
   * Academy. Until the admin clicks one, the group holding the current page
   * is the open one; null means they closed it.
   */
  const [chosen, setChosen] = useState<string | null | undefined>(undefined);

  const tabActive = (tab: Tab) =>
    tab.href === "/admin"
      ? pathname === "/admin"
      : // All projects and Learnings own only their own page, not the
        // tabs beside them.
        tab.href === "/admin/development" || tab.href === "/admin/web"
        ? pathname === tab.href
        : pathname.startsWith(tab.href);
  const groupActive = (group: Group) =>
    group.owns.some((path) => pathname.startsWith(path));
  const current = GROUPS.find(groupActive);
  const openGroup = chosen === undefined ? (current?.label ?? null) : chosen;

  return (
    <nav aria-label="Admin">
      <div className="mb-6 space-y-3 xl:hidden">
        <Strip
          tabs={[...TOP, ...GROUPS]}
          isActive={(tab) =>
            "children" in tab ? groupActive(tab as Group) : tabActive(tab)
          }
        />
        {current && (
          <Strip
            tabs={current.children}
            isActive={tabActive}
            label={current.label}
          />
        )}
      </div>

      <ul className="hidden space-y-0.5 xl:block">
        {TOP.map((tab) => (
          <li key={tab.href}>
            <SideLink tab={tab} active={tabActive(tab)} />
          </li>
        ))}
        {GROUPS.map((group) => {
          const open = openGroup === group.label;
          return (
            <li key={group.label} className="pt-2">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setChosen(open ? null : group.label)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[0.875rem] font-semibold transition-colors ${
                  groupActive(group)
                    ? "text-ink"
                    : "text-ink-soft hover:bg-surface hover:text-ink"
                }`}
              >
                <group.icon className="size-4" strokeWidth={1.9} aria-hidden />
                <span className="flex-1">{group.label}</span>
                <ChevronDown
                  className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
              {open && (
                <ul className="border-line mt-0.5 ml-[1.1rem] space-y-0.5 border-l pl-2">
                  {group.children.map((tab) => (
                    <li key={tab.href}>
                      <SideLink tab={tab} active={tabActive(tab)} small />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
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
          <li key={tab.href + tab.label}>
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
