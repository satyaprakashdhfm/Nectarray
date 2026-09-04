import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase browser client.
 *
 * Both values are public by design — the anon key is safe in the bundle
 * because row-level security, not key secrecy, is what protects the data.
 * The service_role key must never appear here.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Whether auth is configured at all.
 *
 * Until the project exists these are unset, and every auth entry point
 * falls back to the application form rather than opening a login box with
 * nothing behind it. A door that opens onto a wall is worse than no door.
 */
export const authEnabled = url !== "" && anonKey !== "";

export function createClient() {
  if (!authEnabled) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return createBrowserClient(url, anonKey);
}
