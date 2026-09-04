import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./config";

/**
 * A Supabase client that bypasses row-level security.
 *
 * Exactly one thing needs this: recording the grader's verdict. A student may
 * lodge an attempt but must never be able to judge one, so the columns that
 * hold the verdict — and the progress row a pass earns — are closed to them
 * by policy. Something has to be able to write them, and it has to be
 * something the browser cannot reach.
 *
 * `server-only` makes importing this from a client component a build error,
 * which is the guarantee worth having: the key can never be bundled by
 * accident, only by someone deliberately editing this file.
 *
 * Returns null when the key is absent, so the app runs without it and the one
 * route that needs it can say so plainly instead of crashing at import time.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key || !supabaseUrl) return null;

  return createSupabaseClient(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
