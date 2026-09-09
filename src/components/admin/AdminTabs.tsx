"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  Inbox,
  LockOpen,
  NotebookPen,
  Users,
} from "lucide-react";

const TABS = [
  { href: "/admin", label: "Students", icon: Users },
  { href: "/admin/cohort", label: "Class", icon: CalendarDays },
  { href: "/admin/lessons", label: "Student Notes", icon: NotebookPen },
  { href: "/admin/unlocking", label: "Unlocking", icon: LockOpen },
  { href: "/admin/teaching", label: "Teacher Notes", icon: BookOpen },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
];

/**
 * The panel's tab strip.
 *
 * A client component only because the selected tab has to be worked out from
 * the path, and the layout that holds it is a server component. It was a
 * server component before, which is why nothing was ever lit: the markup had
 * no way of knowing which page it was sitting above, so all six tabs looked
 * identical on all six pages.
 */
export function AdminTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="mb-8">
      <ul className="tab-bar">
        {TABS.map((tab) => {
          // /admin owns only itself; the rest own their subtree, so a lesson
          // being edited still lights the tab it was opened from.
          const active =
            tab.href === "/admin"
              ? pathname === "/admin"
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
