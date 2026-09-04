import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  authEnabled,
  supabaseAnonKey,
  supabaseUrl,
} from "@/lib/supabase/config";

/**
 * Refreshes the Supabase session on every request and guards /dashboard.
 *
 * Without this the access token expires and server components start seeing a
 * signed-out user even though the browser thinks it is signed in. The refresh
 * has to happen here because a server component cannot write cookies.
 */
export async function middleware(request: NextRequest) {
  /*
   * The id, once we have validated it. Every dashboard page then skips its own
   * getUser() — which is a network call to the auth server, not a local check,
   * so it was costing a second full round trip on every navigation, and a
   * third on a lesson page where the layout asks as well.
   *
   * It is only a shortcut past re-validation. Row-level security still scopes
   * every query by the real token in the cookie, so a forged id reads nothing;
   * and the header is set, never appended, so a browser cannot supply one.
   */
  let userId: string | null = null;

  // Read fresh each time: `request.cookies.set` writes through to the cookie
  // header, so snapshotting once would drop a refreshed session token.
  const forward = () => {
    const headers = new Headers(request.headers);
    headers.delete("x-user-id");
    if (userId) headers.set("x-user-id", userId);
    return NextResponse.next({ request: { headers } });
  };

  if (!authEnabled) return forward();

  let response = forward();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = forward();
        toSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // getUser() revalidates against Supabase rather than trusting the cookie,
  // which is the difference between a session check and a session claim.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Rebuild the response now that the id is known, so it carries the header.
  if (user) {
    userId = user.id;
    const withId = forward();
    response.cookies.getAll().forEach((cookie) => withId.cookies.set(cookie));
    response = withId;
  }

  const { pathname } = request.nextUrl;

  // The two areas have separate doors. /admin/login is the admin one, so it
  // has to stay reachable while signed out.
  const isAdminArea =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  if (!user) {
    if (isAdminArea) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
    if (pathname.startsWith("/dashboard")) {
      const url = request.nextUrl.clone();
      url.pathname = "/academy";
      url.searchParams.set("signin", "1");
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  /*
   * Only the two signed-in areas.
   *
   * This used to match every route, which meant a visitor reading the home
   * page paid for a round trip to Supabase before a single byte came back —
   * `getUser()` validates against the auth server rather than trusting the
   * cookie, so it is a real network call, not a local check. Marketing pages
   * have nothing to guard and no session to refresh: the browser client
   * refreshes its own token, and the header reads sign-in state client-side.
   *
   * Everything behind a door still gets refreshed on every request, which is
   * the only place it was ever doing any work.
   */
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
