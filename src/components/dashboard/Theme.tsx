"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "nectarray-ui-theme";
type Theme = "dark" | "light";

/**
 * Runs before first paint, so the signed-in area never flashes white on its
 * way to dark. Inline on purpose: anything imported would arrive after the
 * browser has already painted, which is the flash we are avoiding.
 *
 * Dark is the default; light is opt-in and remembered.
 */
export function ThemeScript() {
  const js = `(function(){try{var t=localStorage.getItem(${JSON.stringify(KEY)});document.documentElement.dataset.uiTheme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.uiTheme="dark"}})()`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}

/**
 * Removes the attribute on unmount, so navigating back to the marketing
 * site — which is light by design — does not inherit the dashboard's dark
 * tokens through a client-side transition.
 */
export function ThemeCleanup() {
  useEffect(() => {
    return () => {
      delete document.documentElement.dataset.uiTheme;
    };
  }, []);
  return null;
}

/*
 * The <html> attribute is the single source of truth, not React state: the
 * inline script above sets it before React exists, so any state initialised
 * in a component would be a second, later, possibly disagreeing copy.
 * useSyncExternalStore subscribes to it instead.
 */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.uiTheme === "light"
    ? "light"
    : "dark";
}

/** The server cannot read localStorage, and dark is what it renders. */
function getServerSnapshot(): Theme {
  return "dark";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next: Theme = getSnapshot() === "light" ? "dark" : "light";
    document.documentElement.dataset.uiTheme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // Private windows and blocked site data — the toggle still works for
      // this visit, it just will not be remembered.
    }
    listeners.forEach((notify) => notify());
  }, []);

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className="border-night-line grid size-9 place-items-center rounded-full border text-white/70 transition-colors hover:border-white/30 hover:text-white"
    >
      {isLight ? (
        <Moon className="size-4" strokeWidth={1.9} aria-hidden />
      ) : (
        <Sun className="size-4" strokeWidth={1.9} aria-hidden />
      )}
    </button>
  );
}
