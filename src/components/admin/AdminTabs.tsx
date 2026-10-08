"use client";
import { ADMIN } from "@/lib/admin-path";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Briefcase,
  CalendarDays,
  ChartGantt,
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
  ListChecks,
  LockOpen,
  Megaphone,
  NotebookPen,
  Palette,
  Search,
  Sparkles,
  SquareTerminal,
  Users,
  type LucideIcon,
} from "lucide-react";

type Tab = { href: string; label: string; icon: LucideIcon };
type Group = Tab & { children: Tab[]; owns: string[] };

const TOP: Tab[] = [
  { href: `${ADMIN}`, label: "Revenue", icon: IndianRupee },
  { href: `${ADMIN}/seo`, label: "SEO", icon: Search },
  { href: `${ADMIN}/analytics`, label: "Analytics", icon: ChartLine },
  { href: `${ADMIN}/ads`, label: "Ads", icon: Megaphone },
  { href: `${ADMIN}/development`, label: "All projects", icon: Layers },
  { href: `${ADMIN}/quotes`, label: "Quotations", icon: FileText },
  { href: `${ADMIN}/tasks`, label: "Tasks", icon: ListChecks },
  { href: `${ADMIN}/timeline`, label: "Timeline", icon: ChartGantt },
  { href: `${ADMIN}/workspace`, label: "Workspace", icon: SquareTerminal },
];

/**
 * Each service is its own group, holding its projects and the tools and
 * notes for doing that work: Marketing has the notes on Search Console, GA4,
 * ads and WhatsApp; Software has the website-building tabs. Then the
 * academy.
 */
const GROUPS: Group[] = [
  {
    href: `${ADMIN}/services/marketing`,
    label: "Marketing",
    icon: Megaphone,
    owns: [`${ADMIN}/services/marketing`, `${ADMIN}/marketing`],
    children: [
      {
        href: `${ADMIN}/services/marketing`,
        label: "Projects",
        icon: FolderKanban,
      },
      { href: `${ADMIN}/marketing/notes`, label: "Notes", icon: NotebookPen },
    ],
  },
  {
    href: `${ADMIN}/services/software`,
    label: "Software",
    icon: Code,
    owns: [`${ADMIN}/services/software`, `${ADMIN}/web`],
    children: [
      {
        href: `${ADMIN}/services/software`,
        label: "Projects",
        icon: FolderKanban,
      },
      { href: `${ADMIN}/web`, label: "Learnings", icon: Lightbulb },
      { href: `${ADMIN}/web/colours`, label: "Colours", icon: Palette },
      { href: `${ADMIN}/web/elements`, label: "Elements", icon: Component },
      { href: `${ADMIN}/web/animations`, label: "Animations", icon: Sparkles },
      { href: `${ADMIN}/web/references`, label: "References", icon: Link2 },
    ],
  },
  {
    href: `${ADMIN}/services/ai`,
    label: "Agentic AI",
    icon: Bot,
    owns: [`${ADMIN}/services/ai`],
    children: [
      { href: `${ADMIN}/services/ai`, label: "Projects", icon: FolderKanban },
    ],
  },
  {
    href: `${ADMIN}/students`,
    label: "Academy",
    icon: GraduationCap,
    owns: [
      `${ADMIN}/students`,
      `${ADMIN}/cohort`,
      `${ADMIN}/lessons`,
      `${ADMIN}/unlocking`,
      `${ADMIN}/placement`,
      `${ADMIN}/enquiries`,
      `${ADMIN}/services/training`,
    ],
    children: [
      { href: `${ADMIN}/students`, label: "Students", icon: Users },
      { href: `${ADMIN}/cohort`, label: "Class", icon: CalendarDays },
      { href: `${ADMIN}/lessons`, label: "Notes", icon: NotebookPen },
      { href: `${ADMIN}/unlocking`, label: "Unlocking", icon: LockOpen },
      { href: `${ADMIN}/placement`, label: "Placement", icon: Briefcase },
      { href: `${ADMIN}/enquiries`, label: "Enquiries", icon: Inbox },
      {
        href: `${ADMIN}/services/training`,
        label: "Client training",
        icon: FolderKanban,
      },
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
    tab.href === `${ADMIN}`
      ? pathname === `${ADMIN}`
      : // All projects and Learnings own only their own page, not the
        // tabs beside them.
        tab.href === `${ADMIN}/development` || tab.href === `${ADMIN}/web`
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
