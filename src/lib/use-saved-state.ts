"use client";

import { useEffect, useState } from "react";

/**
 * useState that survives a refresh, for the choices made on the price book
 * (ticked rows, chosen models, typed numbers, the currency). It lives in
 * this browser only, like a form someone is still filling in, and stays
 * until it is changed or everything is reset with resetSavedChoices.
 *
 * The saved value is read after the first render, so the server's HTML
 * and the browser's first paint agree.
 */

const PREFIX = "nectarray-pb:";

export function useSavedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only state, read once on mount
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // Storage blocked or a bad value: keep the starting value.
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // Storage blocked: the choice works on this page, it is just not kept.
    }
  }, [key, loaded, value]);

  return [value, setValue] as const;
}

/** Forget every saved choice on the price book, the estimate included. */
export function resetSavedChoices() {
  try {
    const keys = Object.keys(window.localStorage).filter(
      (k) => k.startsWith(PREFIX) || k === "nectarray-estimate",
    );
    for (const k of keys) window.localStorage.removeItem(k);
  } catch {
    // Storage blocked: nothing was saved.
  }
}
