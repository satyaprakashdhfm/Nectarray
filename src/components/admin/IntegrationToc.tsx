"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The provider page's contents, with the section being read marked. The
 * same list on every provider, so the reader always finds Pricing in the
 * same place.
 */
export function IntegrationToc({
  sections,
}: {
  sections: readonly { id: string; label: string }[];
}) {
  const [current, setCurrent] = useState<string | undefined>(sections[0]?.id);
  // Set by a click on the contents: that section is marked, and the scroll
  // it starts must not move the mark on its way there.
  const jumping = useRef(false);

  useEffect(() => {
    /*
     * The section being read is the last one whose top has passed under the
     * header (the page's 6rem scroll padding, plus a little). Checked when a
     * section crosses the band below the header, and once more when a scroll
     * comes to rest, because a smooth jump from the contents makes its last
     * crossing before it stops.
     */
    const READ_LINE = 120;
    const pick = () => {
      if (jumping.current) return;
      // At the very bottom the last sections can never reach the line.
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      const passed = sections.filter(
        (s) =>
          (document.getElementById(s.id)?.getBoundingClientRect().top ??
            Infinity) <= READ_LINE,
      );
      setCurrent(
        (atEnd ? sections.at(-1) : (passed.at(-1) ?? sections[0]))?.id,
      );
    };
    const observer = new IntersectionObserver(pick, {
      rootMargin: "-80px 0px -60% 0px",
    });
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    const settle = () => {
      if (jumping.current) jumping.current = false;
      else pick();
    };
    window.addEventListener("scrollend", settle);
    return () => {
      observer.disconnect();
      window.removeEventListener("scrollend", settle);
    };
  }, [sections]);

  return (
    <nav aria-label="On this page">
      <p className="text-ink-faint text-[0.75rem] font-semibold">
        On this page
      </p>
      <ol className="border-line mt-2 space-y-0.5 border-l">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={s.id === current ? "location" : undefined}
              onClick={() => {
                jumping.current = true;
                setCurrent(s.id);
              }}
              className={cn(
                "-ml-px block border-l-2 py-1 pl-3 text-[0.8125rem] transition-colors",
                s.id === current
                  ? "border-brand text-ink font-semibold"
                  : "text-ink-soft hover:text-ink border-transparent",
              )}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
