import type { Metadata } from "next";
import Link from "next/link";
import { AccountMenu } from "@/components/dashboard/AccountMenu";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Logo } from "@/components/layout/Logo";
import { SignOutButton } from "@/components/dashboard/SignOutButton";
import {
  ThemeCleanup,
  ThemeScript,
  ThemeToggle,
} from "@/components/dashboard/Theme";
import { getViewer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard — NectArray Academy",
  robots: { index: false, follow: false },
};

/** Signed-in area. The middleware has already turned away anonymous users. */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await getViewer();

  return (
    <div className="bg-mist min-h-screen">
      <ThemeScript />
      <ThemeCleanup />
      <header className="border-night-line bg-night sticky top-0 z-50 border-b">
        <div className="shell flex h-[72px] items-center justify-between gap-6">
          <Logo markClassName="size-9" wordClassName="text-[1.25rem]" />
          <div className="flex items-center gap-4">
            {/* The greeting was a dead label. Same spot, same name, but it
                opens the account now — which is where a student looks for
                it. */}
            <AccountMenu
              profile={{
                first_name: profile?.first_name ?? null,
                last_name: profile?.last_name ?? null,
                phone: profile?.phone ?? null,
                email: profile?.email ?? null,
              }}
            />
            <Link
              href="/"
              className="hidden text-[0.875rem] text-white/60 transition-colors hover:text-white sm:inline"
            >
              Main site
            </Link>
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>

      <DashboardNav />

      {/* No shell here: the notes section supplies its own full-width docs
          grid, and pages that want the normal gutter apply it themselves. */}
      <main id="main" className="min-w-0">
        {children}
      </main>
    </div>
  );
}
