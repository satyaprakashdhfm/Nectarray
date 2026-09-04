import type { Metadata } from "next";

/**
 * Deliberately does nothing but set metadata.
 *
 * The guard lives in (panel)/layout.tsx instead, because a parent layout
 * applies to every child — including /admin/login, which has to stay
 * reachable while signed out. Putting the admin check here would make the
 * sign-in page refuse the only people who need it.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
