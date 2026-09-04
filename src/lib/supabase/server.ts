import { cache } from "react";
import { cookies, headers } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { authEnabled } from "./config";

/**
 * Supabase client for server components and route handlers.
 *
 * Reads the session from cookies, so a server component can know who is
 * asking without trusting anything the browser sent in the body.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          try {
            toSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a server component, where cookies are read-only.
            // The middleware refreshes the session, so this is safe to ignore.
          }
        },
      },
    },
  );
}

/**
 * The signed-in user, their profile and their enrolment status in one call.
 *
 * Wrapped in React's `cache` so it runs **once per request** no matter how
 * many components ask. A lesson page asks three times — layout, page, and the
 * rail — and each call was previously a full round trip to Supabase for
 * `getUser()` plus two queries. On a Vercel function that is nine network
 * hops to render one page, which is most of where the wait came from.
 *
 * Returns nulls rather than throwing when auth is not configured, so pages
 * can render a signed-out state instead of erroring during setup.
 */
export const getViewer = cache(async () => {
  if (!authEnabled) return { user: null, profile: null, enrolment: null };

  const supabase = await createClient();

  /*
   * The middleware validated the session moments ago and forwarded the id.
   * Calling getUser() again here would be a second round trip to the auth
   * server for an answer we already have — and on a lesson page, with the
   * layout and the page both asking, it was the largest single cost of a
   * navigation.
   */
  const forwarded = (await headers()).get("x-user-id");
  const id = forwarded ?? (await supabase.auth.getUser()).data.user?.id ?? null;
  if (!id) return { user: null, profile: null, enrolment: null };

  const user = { id };

  const [{ data: profile }, { data: enrolment }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("enrolments")
      .select("*, cohorts(*)")
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return { user, profile, enrolment };
});

/**
 * Whether the viewer can open course material.
 *
 * Every gated page asked this the same way and got it subtly different; one
 * helper keeps "enrolled" meaning one thing.
 */
export async function getAccess() {
  const viewer = await getViewer();
  const status = viewer.enrolment?.status ?? "none";
  return {
    ...viewer,
    status,
    active: status === "enrolled" || status === "completed",
  };
}
