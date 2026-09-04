"use client";

import { useSyncExternalStore } from "react";
import { authEnabled } from "./config";
import { createClient } from "./client";

/**
 * Whether *this browser* is signed in, for components that render on public
 * pages.
 *
 * The marketing site is deliberately static — no middleware, no server-side
 * session lookup, nothing that would turn a cached page into a function call
 * per visitor. So sign-in state is read here instead, from the session the
 * Supabase client already keeps in local storage. It is a local read, not a
 * network one, and it is only ever used to change a label: anything that
 * matters is still checked on the server, where a forged local value would
 * get nowhere.
 *
 * Written as an external store rather than state-in-an-effect so the value
 * is read during render and stays in step with `onAuthStateChange`.
 */

type State = "unknown" | "in" | "out";

let state: State = "unknown";
const listeners = new Set<() => void>();
let started = false;

function set(next: State) {
  if (next === state) return;
  state = next;
  listeners.forEach((listener) => listener());
}

function start() {
  if (started || !authEnabled) return;
  started = true;

  const supabase = createClient();
  void supabase.auth
    .getSession()
    .then(({ data }) => set(data.session ? "in" : "out"));
  supabase.auth.onAuthStateChange((_event, session) =>
    set(session ? "in" : "out"),
  );
}

function subscribe(listener: () => void) {
  start();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * "unknown" until the first read resolves — callers render the signed-out
 * label meanwhile, so nothing flashes a dashboard link at a stranger.
 */
export function useSignedIn(): State {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => "unknown" as const,
  );
}
