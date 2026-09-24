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
  FolderKanban,
  GraduationCap,
  Inbox,
  IndianRupee,
  Layers,
  LockOpen,
  Megaphone,
  NotebookPen,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react";

type Tab = { href: string; label: string; icon: LucideIcon };
type Group = Tab & { children: Tab[]; owns: string[] };

const TOP: Tab[] = [
  { href: "/admin", label: "Revenue", icon: IndianRupee },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/analytics", label: "Ads & Analytics", icon: ChartLine },
];

/** Client work, and the academy — each a group that opens and closes. */
const GROUPS: Group[] = [
  {
    href: "/admin/development",
    label: "Development",
    icon: Layers,
    owns: ["/admin/development", "/admin/services"],
    children: [
      { href: "/admin/development", label: "Projects", icon: FolderKanban },
      {
        href: "/admin/services/marketing",
        label: "Marketing",
        icon: Megaphone,
      },
      { href: "/admin/services/software", label: "Software", icon: Code },
      { href: "/admin/services/ai", label: "Agentic AI", icon: Bot },
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
 * The panel's navigation: a sticky sidebar on desktop, where Development
 * and Academy open and close like dropdowns, and horizontal strips on a
 * phone, where a sidebar would take half the screen.
 *
 * A client component because the selected tab is worked out from the path
 * and the groups remember whether they were opened or closed.
 */
export function AdminTabs() {
  const pathname = usePathname();
  /*
   * One group open at a time, like an accordion: opening Development closes
   * Academy. Until the admin clicks one, the group holding the current page
   * is the open one; null means they closed it.
   */
  const [chosen, setChosen] = useState<string | null | undefined>(undefined);

  const tabActive = (tab: Tab) =>
    tab.href === "/admin"
      ? pathname === "/admin"
      : // Projects owns only its own page, not the service tabs beside it.
        tab.href === "/admin/development"
        ? pathname === tab.href
        : pathname.startsWith(tab.href);
  const groupActive = (group: Group) =>
    group.owns.some((path) => pathname.startsWith(path));
  const current = GROUPS.find(groupActive);
  const openGroup = chosen === undefined ? (current?.label ?? null) : chosen;

  return (
    <nav aria-label="Admin">
      <div className="mb-6 space-y-3 lg:hidden">
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

      <ul className="hidden space-y-0.5 lg:block">
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
