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
   * A layout cannot see which child route is rendering — that is the one
   * thing App Router does not hand down. Forwarding the path as a header is
   * the supported way to tell it, and the notes shell needs it so the rail
   * can show the open lesson's own contents beside the lesson list.
   */
  // Read fresh each time: `request.cookies.set` writes through to the cookie
  // header, so snapshotting once would drop a refreshed session token.
  const forward = () => {
    const headers = new Headers(request.headers);
    headers.set("x-pathname", request.nextUrl.pathname);
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
