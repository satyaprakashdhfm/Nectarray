import { cookies } from "next/headers";
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
 * Returns nulls rather than throwing when auth is not configured, so pages
 * can render a signed-out state instead of erroring during setup.
 */
export async function getViewer() {
  if (!authEnabled) return { user: null, profile: null, enrolment: null };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null, enrolment: null };

  const [{ data: profile }, { data: enrolment }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase
      .from("enrolments")
      .select("*, cohorts(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return { user, profile, enrolment };
}
