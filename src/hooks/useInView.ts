"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Returns a ref and a flag that flips to true the first time the element
 * scrolls into view, then stops observing.
 *
 * Visibility never depends on this hook: the styles that hide un-revealed
 * content are gated on `[data-reveal="on"]`, a flag the layout only sets when
 * IntersectionObserver exists, and are switched off entirely under
 * `prefers-reduced-motion`. So a browser without the observer, or a visitor
 * who has asked for less motion, simply sees the content.
 */
export function useInView<T extends HTMLElement = HTMLElement>(
  options: IntersectionObserverInit = {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.05,
  },
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
    // options is a literal default; re-observing on identity change is not wanted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}
