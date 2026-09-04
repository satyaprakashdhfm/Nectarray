import { createBrowserClient } from "@supabase/ssr";
import { authEnabled, supabaseAnonKey, supabaseUrl } from "./config";

export { authEnabled };

export function createClient() {
  if (!authEnabled) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
