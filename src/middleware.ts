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
  if (!authEnabled) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
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
  // Everything except static assets and image optimisation.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf|woff2?)$).*)",
  ],
};
