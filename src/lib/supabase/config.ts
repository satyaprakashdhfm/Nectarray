/**
 * Shared Supabase configuration, importable from both client and server.
 *
 * Both values are public by design — the anon key ships in the browser
 * bundle because row-level security, not key secrecy, is what protects the
 * data. The service_role key must never appear in anything under src/.
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Whether auth is configured at all.
 *
 * Until both variables are set, every auth entry point falls back to the
 * application form rather than opening a login box with nothing behind it.
 */
export const authEnabled = supabaseUrl !== "" && supabaseAnonKey !== "";
