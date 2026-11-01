"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { SITE_THEME_KEY as KEY } from "@/lib/site-theme";
import { cn } from "@/lib/utils";

/**
 * Light or dark for the public site, picked by the visitor and remembered.
 *
 * The signed-in area has its own switch (components/dashboard/Theme.tsx,
 * `data-ui-theme`); this one is `data-site-theme` on <html>, and the CSS
 * only reads it where `data-ui-theme` is absent, so the two never fight over
 * the same page. Dark here is the admin's near-black, not navy.
 *
 * Light is the default. lib/site-theme.ts has the script the root layout
 * runs before first paint, so a dark-theme visitor never sees a white flash.
 */
type Theme = "dark" | "light";

const listeners = new Set<() => void>();
const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
};
const getSnapshot = (): Theme =>
  document.documentElement.dataset.siteTheme === "dark" ? "dark" : "light";
const getServerSnapshot = (): Theme => "light";

/** The visitor's choice, kept in step with the attribute on <html>. */
export function useSiteTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function SiteThemeToggle({ className }: { className?: string }) {
  const theme = useSiteTheme();
  const toggle = useCallback(() => {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    if (next === "dark") document.documentElement.dataset.siteTheme = "dark";
    else delete document.documentElement.dataset.siteTheme;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // Blocked site data: it still switches for this visit.
    }
    listeners.forEach((notify) => notify());
  }, []);

  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-200",
        className,
      )}
    >
      {dark ? (
        <Sun className="size-[1.1rem]" strokeWidth={1.9} aria-hidden />
      ) : (
        <Moon className="size-[1.1rem]" strokeWidth={1.9} aria-hidden />
      )}
    </button>
  );
}
