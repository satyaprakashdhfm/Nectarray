import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { SignOutButton } from "@/components/dashboard/SignOutButton";
import { createClient, getViewer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin — NectArray Academy",
  robots: { index: false, follow: false, nocache: true },
};

const TABS = [
  { href: "/admin", label: "Students" },
  { href: "/admin/codes", label: "Codes" },
  { href: "/admin/cohort", label: "Cohort" },
  { href: "/admin/lessons", label: "Lessons" },
];

/**
 * Unlisted admin area.
 *
 * The middleware only checks that *someone* is signed in, so the actual
 * authorisation is here: anything but an admin gets a 404, not a redirect
 * and not a "forbidden". There is no reason to confirm the route exists to
 * someone who may not use it.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getViewer();
  if (!user) notFound();

  const supabase = await createClient();
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) notFound();

  return (
    <div className="bg-mist min-h-screen">
      <header className="border-night-line bg-night sticky top-0 z-50 border-b">
        <div className="shell flex h-[72px] items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Logo markClassName="size-9" wordClassName="text-[1.25rem]" />
            <span className="bg-amber/15 text-amber rounded-full px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="hidden text-[0.875rem] text-white/60 transition-colors hover:text-white sm:inline"
            >
              Student view
            </Link>
            <SignOutButton />
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
