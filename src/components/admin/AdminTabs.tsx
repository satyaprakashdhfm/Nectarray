"use client";
import { ADMIN } from "@/lib/admin-path";

import { useEffect, useState } from "react";
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
  ListChecks,
  LockOpen,
  Megaphone,
  Menu,
  NotebookPen,
  Palette,
  Plug,
  Search,
  Sparkles,
  SquareTerminal,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";

type Tab = { href: string; label: string; icon: LucideIcon };
type Group = Tab & { children: Tab[]; owns: string[] };

const TOP: Tab[] = [
  { href: `${ADMIN}`, label: "Revenue", icon: IndianRupee },
  { href: `${ADMIN}/assets`, label: "Assets", icon: Wallet },
  { href: `${ADMIN}/seo`, label: "SEO", icon: Search },
  { href: `${ADMIN}/analytics`, label: "Analytics", icon: ChartLine },
  { href: `${ADMIN}/ads`, label: "Ads", icon: Megaphone },
  { href: `${ADMIN}/development`, label: "All projects", icon: Layers },
  { href: `${ADMIN}/quotes`, label: "Quotations", icon: FileText },
  { href: `${ADMIN}/integrations`, label: "Integrations", icon: Plug },
  { href: `${ADMIN}/tasks`, label: "Tasks & timeline", icon: ListChecks },
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
 * and the Academy open and close like dropdowns. On a phone the menu button
 * in the header (AdminMenu) holds every page, and a strip above the page
 * holds the pages of the section you are in.
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
      {current && (
        <div className="mb-6 xl:hidden">
          <Strip
            tabs={current.children}
            isActive={tabActive}
            label={current.label}
          />
        </div>
      )}

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

/**
 * Every page of the panel behind one button, for screens without the
 * sidebar: a phone, a tablet, the panel inside the app. It slides over the
 * page from the left and closes on a choice, on the backdrop, or on Escape.
 */
export function AdminMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // A link was followed: the new page shows without the menu over it.
  const [at, setAt] = useState(pathname);
  if (at !== pathname) {
    setAt(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  const active = (tab: Tab) =>
    tab.href === `${ADMIN}` ||
    tab.href === `${ADMIN}/development` ||
    tab.href === `${ADMIN}/web`
      ? pathname === tab.href
      : pathname.startsWith(tab.href);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="admin-menu"
        aria-label="Menu"
        className="-ml-1.5 inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-white/75 transition-colors hover:bg-white/10 hover:text-white active:scale-[0.96] xl:hidden"
      >
        <Menu className="size-5" strokeWidth={1.9} aria-hidden />
      </button>
      {open && (
        <div className="fixed inset-0 z-[60] xl:hidden">
          <button
            type="button"
            aria-label="Close the menu"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/45"
          />
          <nav
            id="admin-menu"
            aria-label="Admin"
            className="bg-mist border-line absolute inset-y-0 left-0 flex w-[min(19rem,86vw)] flex-col border-r shadow-2xl"
          >
            <div className="border-line flex h-14 shrink-0 items-center justify-between border-b px-4">
              <span className="text-ink text-[0.9375rem] font-semibold">
                Admin
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close the menu"
                className="text-ink-soft hover:bg-surface hover:text-ink grid size-9 place-items-center rounded-lg"
              >
                <X className="size-5" strokeWidth={1.9} aria-hidden />
              </button>
            </div>
            <ul className="flex-1 space-y-0.5 overflow-y-auto overscroll-contain p-3 pb-8">
              {TOP.map((tab) => (
                <li key={tab.href}>
                  <SideLink tab={tab} active={active(tab)} />
                </li>
              ))}
              {GROUPS.map((group) => (
                <li key={group.label} className="pt-3">
                  <p className="text-ink-faint flex items-center gap-2.5 px-3 pb-1 text-[0.6875rem] font-semibold tracking-[0.08em] uppercase">
                    <group.icon
                      className="size-3.5"
                      strokeWidth={1.9}
                      aria-hidden
                    />
                    {group.label}
                  </p>
                  <ul className="space-y-0.5">
                    {group.children.map((tab) => (
                      <li key={tab.href}>
                        <SideLink tab={tab} active={active(tab)} />
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
