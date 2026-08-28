"use client";

import { useEffect, useState } from "react";

/**
 * Scroll-spy: returns the id of the section currently under the reading line
 * (about a third of the way down the viewport).
 *
 * Measures with getBoundingClientRect on scroll rather than using
 * IntersectionObserver, because "which section am I in" is a question about
 * ordering, not visibility — several sections are on screen at once, and the
 * observer's callbacks arrive per-element with no ordering guarantee. A rAF
 * throttled pass over ~11 elements is cheap and always deterministic.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  const key = ids.join("|");

  useEffect(() => {
    const sectionIds = key.split("|");
    let frame = 0;

    const measure = () => {
      frame = 0;
      const readingLine = window.innerHeight * 0.32;
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= readingLine) {
          current = id;
        }
      }

      // The last section is usually too short to ever cross the reading line,
      // so claim it explicitly once the page is scrolled to the bottom.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) current = sectionIds[sectionIds.length - 1];

      setActive(current);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    schedule(); // initial read, deferred so it is not a sync setState in an effect
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [key]);

  return active;
}
