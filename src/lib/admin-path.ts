/**
 * Where the admin panel lives on the web.
 *
 * Not /admin. The routes are still built under src/app/admin, but the address
 * people use is a long random segment kept in NEXT_PUBLIC_ADMIN_PATH (a
 * Railway variable, never committed: this repository is public). The
 * middleware rewrites that address onto the routes and answers /admin itself
 * with a plain 404, so the panel cannot be found by guessing the obvious.
 *
 * NEXT_PUBLIC because the panel's own client components build links with it.
 * It only reaches the browser inside the panel's pages, which a visitor
 * cannot load without already knowing it. It hides the door; the sign-in,
 * the allowlist and the emailed code are what lock it.
 *
 * Unset (local development), the panel stays at /admin.
 */
const segment = (process.env.NEXT_PUBLIC_ADMIN_PATH ?? "").replace(
  /[^A-Za-z0-9_-]/g,
  "",
);

/** The panel's public base path, e.g. "/k3v9…" in production. */
export const ADMIN = segment ? `/${segment}` : "/admin";

/** Whether the panel has been moved off /admin. */
export const ADMIN_HIDDEN = segment.length > 0;

/** The internal route path ("/admin/...") for a public panel path, or null. */
export function adminRoute(pathname: string): string | null {
  if (!ADMIN_HIDDEN) return null;
  if (pathname !== ADMIN && !pathname.startsWith(`${ADMIN}/`)) return null;
  return `/admin${pathname.slice(ADMIN.length)}`;
}

/** Remembers whether the panel's sidebar was put away (components/admin/AdminSidebar). */
export const SIDEBAR_COOKIE = "admin-sidebar";
