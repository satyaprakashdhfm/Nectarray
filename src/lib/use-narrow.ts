import { useSyncExternalStore } from "react";

const QUERY = "(max-width: 767px)";

function subscribe(listener: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

/**
 * Whether the screen is phone-width (under Tailwind's md breakpoint). False
 * on the server and on the first render, then the real answer.
 */
export function useNarrow(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
