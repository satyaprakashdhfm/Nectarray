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
import { getViewer } from "@/lib/auth/access";

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
  const { user } = await getViewer();

  return (
    <div className="bg-mist min-h-screen">
      <ThemeScript />
      <ThemeCleanup />
      <header className="border-night-line bg-night sticky top-0 z-50 border-b">
        {/* Four controls and a wordmark do not fit across a phone. They were
            not wrapping, either — the account chip simply sat on top of the
            word "NectArray" and "Sign out" broke onto two lines inside its
            own pill. Below sm the mark stands in for the wordmark and the
            sign-out button loses its label, which is enough room for the rest
            to sit properly. */}
        <div className="shell flex h-[72px] items-center justify-between gap-3 sm:gap-6">
          <Logo
            markClassName="size-9"
            wordClassName="hidden text-[1.25rem] sm:inline"
          />
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            {/* The greeting was a dead label. Same spot, same name, but it
                opens the account now — which is where a student looks for
                it. */}
            <AccountMenu
              profile={{
                first_name: user?.firstName ?? null,
                last_name: user?.lastName ?? null,
                phone: user?.phone ?? null,
                email: user?.email ?? null,
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
