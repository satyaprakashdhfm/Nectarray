import { ADMIN, SIDEBAR_COOKIE } from "@/lib/admin-path";
import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { AdminTabs } from "@/components/admin/AdminTabs";
import {
  SidebarFrame,
  SidebarProvider,
  SidebarToggle,
} from "@/components/admin/AdminSidebar";
import { SignOutButton } from "@/components/dashboard/SignOutButton";
import {
  ThemeCleanup,
  ThemeScript,
  ThemeToggle,
} from "@/components/dashboard/Theme";
import { adminGate } from "@/lib/auth/access";

/*
 * Rendered per request, never at build time.
 *
 * Without this Next tries each of these during "Generating static pages" to
 * find out whether it can prerender them — which means running the query,
 * against a database the build container cannot reach on the private
 * network. It does not fail; it hangs for sixty seconds and then retries,
 * and the build went from twenty seconds to nearly two minutes. Nothing here
 * could ever be static: it is all somebody's admin panel.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — NectArray Academy",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Three steps, all required: a Google sign-in on the panel's own page, an
 * address Google has verified that is on ADMIN_EMAILS (a deploy variable, not
 * a table row anyone could edit), and the code emailed for this session. The
 * session lasts five hours, then all three again.
 *
 * Someone short of the first two is sent to the sign-in page, where the usual
 * cause (the wrong Google account) can be fixed; an admin owing the code is
 * sent to enter it. The panel's address itself is unguessable and /admin is
 * a 404 (lib/admin-path.ts), so nobody lands here by accident.
 */
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gate = await adminGate();
  if (!gate.user || !gate.admin) redirect(`${ADMIN}/login`);
  // Google said yes; the emailed code for this session is still owed.
  if (!gate.verified) redirect(`${ADMIN}/verify`);
  const user = gate.user;
  const sidebarOpen = (await cookies()).get(SIDEBAR_COOKIE)?.value !== "closed";

  return (
    <SidebarProvider initialOpen={sidebarOpen}>
      <div className="bg-mist min-h-screen">
        <ThemeScript />
        <ThemeCleanup />
        <header className="border-night-line bg-night sticky top-0 z-50 border-b">
          <div className="shell flex h-[72px] items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <SidebarToggle />
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
              <SignOutButton realm="admin" redirectTo={`${ADMIN}/login`} />
            </div>
          </div>
        </header>

        {/*
         * Wider than the site's shell: these pages are tables and figures, and
         * at 80rem a wide screen left a third of itself empty. From 1280px the
         * sidebar sticks under the 72px header, scrolls on its own if it must,
         * and can be hidden from the header for the full width.
         */}
        <SidebarFrame nav={<AdminTabs />}>{children}</SidebarFrame>
      </div>
    </SidebarProvider>
  );
}
