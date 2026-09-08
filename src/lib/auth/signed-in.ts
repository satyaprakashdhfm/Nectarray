"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether *this browser* is signed in, for components on public pages.
 *
 * The marketing site is static and has to stay that way — a server-side
 * session lookup would turn a cached page into a function call per visitor.
 * So this reads the hint cookie the server sets beside the real one: a local
 * read, no network, and it only ever decides which label a button shows.
 *
 * It carries no identity. Anything that matters is checked against the real
 * httpOnly cookie on the server, where a forged hint gets nowhere.
 */

type State = "unknown" | "in" | "out";

const read = (): State => {
  if (typeof document === "undefined") return "unknown";
  return document.cookie.includes("na_signed_in=1") ? "in" : "out";
};

/*
 * A cookie change fires no event, so the store is polled — but only while
 * something is subscribed, and only every two seconds. It exists to catch
 * signing out in another tab, which is rare enough that a couple of seconds
 * of staleness costs nothing.
 */
let state: State = "unknown";
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function poll() {
  const next = read();
  if (next === state) return;
  state = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    poll();
    timer = setInterval(poll, 2000);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

/**
 * "unknown" until the first read — callers show the signed-out label
 * meanwhile, so nothing flashes a dashboard link at a stranger.
 */
export function useSignedIn(): State {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => "unknown" as const,
  );
}
