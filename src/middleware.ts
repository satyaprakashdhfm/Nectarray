import { type NextRequest, NextResponse } from "next/server";

/**
 * Keeps signed-out visitors out of the two areas that have doors.
 *
 * It checks for the session cookie and nothing more. Whether that cookie
 * names a real, unexpired session is a database question, and asking it here
 * would put a query in front of every request including the ones that go on
 * to ask it again — so the real check happens where the answer is used, in
 * requireUser and requireEnrolled. A forged cookie gets past this and no
 * further.
 *
 * That is a change from the Supabase version, which had to revalidate a
 * token against the auth server and rewrite the refreshed cookie on the way
 * through. Sessions are rows now; there is nothing to refresh.
 */
export function middleware(request: NextRequest) {
  const signedIn = Boolean(request.cookies.get("na_session")?.value);
  if (signedIn) return NextResponse.next();

  const { pathname } = request.nextUrl;

  // /admin/login is the admin door, so it has to stay reachable while out.
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
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

  return NextResponse.next();
}

export const config = {
  /*
   * Only the two signed-in areas. This used to match every route, which meant
   * a visitor reading the home page paid for a round trip before a byte came
   * back. Marketing pages have nothing to guard.
   */
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
