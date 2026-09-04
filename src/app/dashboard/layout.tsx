import type { Metadata } from "next";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Logo } from "@/components/layout/Logo";
import { SignOutButton } from "@/components/dashboard/SignOutButton";
import {
  ThemeCleanup,
  ThemeScript,
  ThemeToggle,
} from "@/components/dashboard/Theme";
import { getViewer } from "@/lib/supabase/server";
import { displayName } from "@/lib/utils";

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
  const name = displayName(profile?.first_name) || "there";

  return (
    <div className="bg-mist min-h-screen">
      <ThemeScript />
      <ThemeCleanup />
      <header className="border-night-line bg-night sticky top-0 z-50 border-b">
        <div className="shell flex h-[72px] items-center justify-between gap-6">
          <Logo markClassName="size-9" wordClassName="text-[1.25rem]" />
          <div className="flex items-center gap-4">
            <span className="hidden text-[0.875rem] text-white/60 sm:inline">
              Hi, {name}
            </span>
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
