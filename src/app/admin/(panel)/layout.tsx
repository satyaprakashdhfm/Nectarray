import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { SignOutButton } from "@/components/dashboard/SignOutButton";
import {
  ThemeCleanup,
  ThemeScript,
  ThemeToggle,
} from "@/components/dashboard/Theme";
import { isAllowedAdminEmail } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin — NectArray Academy",
  robots: { index: false, follow: false, nocache: true },
};

const TABS = [
  { href: "/admin", label: "Students" },
  { href: "/admin/codes", label: "Codes" },
  { href: "/admin/cohort", label: "Class" },
  { href: "/admin/lessons", label: "Lessons" },
];

/**
 * Two gates, and both must pass.
 *
 * `is_admin()` is the real authorisation — it is what every RLS policy in the
 * database checks, so it is what actually protects the data. The email
 * allowlist is a second, independent check that lives in configuration rather
 * than in a table: a row can be edited, a deploy variable is a different
 * thing to get at. Neither alone opens the panel.
 *
 * Anyone who fails either is sent to /admin/login rather than shown a 404, so
 * the usual cause — a browser still holding a student session — is something
 * they can actually fix.
 */
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  if (!isAllowedAdminEmail(user.email)) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/admin/login");

  return (
    <div className="bg-mist min-h-screen">
      <ThemeScript />
      <ThemeCleanup />
      <header className="border-night-line bg-night sticky top-0 z-50 border-b">
        <div className="shell flex h-[72px] items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Logo markClassName="size-9" wordClassName="text-[1.25rem]" />
            <span className="bg-amber/15 text-amber rounded-full px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-[0.875rem] text-white/50 lg:inline">
              {user.email}
            </span>
            <Link
              href="/"
              className="hidden text-[0.875rem] text-white/60 transition-colors hover:text-white sm:inline"
            >
              Main site
            </Link>
            <ThemeToggle />
            <SignOutButton redirectTo="/admin/login" />
          </div>
        </div>
      </header>

      <div className="shell py-8 lg:py-10">
        <nav aria-label="Admin" className="mb-8">
          <ul className="border-line bg-surface inline-flex gap-1 rounded-full border p-1">
            {TABS.map((tab) => (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  className="text-ink-soft hover:bg-mist hover:text-ink inline-flex rounded-full px-4 py-2 text-[0.875rem] font-medium transition-colors"
                >
                  {tab.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main id="main">{children}</main>
      </div>
    </div>
  );
}
