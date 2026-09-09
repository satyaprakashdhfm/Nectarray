import { type NextRequest, NextResponse } from "next/server";

/**
 * Two jobs, in order: get everyone onto one hostname, then keep signed-out
 * visitors out of the two areas that have doors.
 *
 * ## One hostname
 *
 * Both nectarray.com and www.nectarray.com resolve here, and a cookie set on
 * one is not sent back on the other. A student who signed in on the apex and
 * then followed a www link looked signed out; worse, an OAuth round trip that
 * left on one and came back on the other lost its state cookie and failed the
 * check with no explanation. seo.ts has always called the apex canonical, so
 * that is the one, and SITE_URL says so to the parts of the app that cannot
 * see a request.
 *
 * ## The doors
 *
 * It checks for the session cookie and nothing more. Whether that cookie
 * names a real, unexpired session is a database question, and asking it here
 * would put a query in front of every request including the ones that go on
 * to ask it again — so the real check happens where the answer is used, in
 * requireUser and requireEnrolled. A forged cookie gets past this and no
 * further.
 */
export function middleware(request: NextRequest) {
  const canonical = canonicalHost();
  if (canonical) {
    /*
     * The forwarded header, not nextUrl.host: Railway terminates TLS and
     * forwards plain HTTP, and the scheme has to be forced back to https or
     * the redirect sends the browser to a URL the proxy will hand straight
     * back here — a loop.
     */
    const host =
      request.headers.get("x-forwarded-host") ??
      request.headers.get("host") ??
      "";

    if (host && host !== canonical && !isLocal(host)) {
      const to = new URL(
        request.nextUrl.pathname + request.nextUrl.search,
        `https://${canonical}`,
      );
      return NextResponse.redirect(to, 308);
    }
  }

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

function canonicalHost(): string | null {
  const configured = process.env.SITE_URL?.trim();
  if (!configured) return null;
  try {
    return new URL(configured).host;
  } catch {
    return null;
  }
}

/*
 * Left alone: localhost, and the Railway-issued domain. The generated domain
 * is how you reach a deploy before DNS is pointed at it, and redirecting it
 * to the custom domain would make it useless for exactly the case it exists
 * for — checking a deploy that is not live yet.
 */
const isLocal = (host: string) =>
  host.startsWith("localhost") ||
  host.startsWith("127.0.0.1") ||
  host.endsWith(".up.railway.app");

export const config = {
  /*
   * Everything but the static assets.
   *
   * This used to match only /dashboard and /admin, because the Supabase
   * version revalidated the session token against the auth server on every
   * pass — a network round trip in front of the home page. Sessions are rows
   * now and this reads a cookie, so the cost of running everywhere is a
   * string comparison, and running everywhere is what makes the canonical
   * host redirect work at all.
   */
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
