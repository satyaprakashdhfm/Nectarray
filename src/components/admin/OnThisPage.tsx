"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type TocItem = { id: string; label: string; children?: TocItem[] };

/** Where a heading counts as being read: just under the sticky header. */
const LINE = 140;

/**
 * "On this page" down the right side, docs style: every part of the page
 * with its sections nested under it, and the one being read marked as the
 * page scrolls. The mark is the last heading that has passed under the
 * header, so it moves the moment a new section takes over the screen.
 */
export function OnThisPage({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const ids = items.flatMap((item) => [
      item.id,
      ...(item.children ?? []).map((c) => c.id),
    ]);
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= LINE) current = id;
      }
      // At the very bottom the last short sections can never reach the
      // line, so the last one is taken as read.
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      )
        current = ids[ids.length - 1];
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  const link = (item: TocItem, nested: boolean) => {
    const on = item.id === active;
    return (
      <a
        href={`#${item.id}`}
        aria-current={on ? "location" : undefined}
        className={cn(
          "-ml-px block border-l-2 py-1 leading-snug transition-colors",
          nested ? "pl-6 text-[0.75rem]" : "pl-3.5 text-[0.8125rem]",
          on
            ? "border-brand text-ink font-semibold"
            : "text-ink-faint hover:text-ink border-transparent",
        )}
      >
        {item.label}
      </a>
    );
  };

  return (
    <nav aria-label="On this page">
      <p className="text-ink text-[0.8125rem] font-semibold">On this page</p>
      <ul className="border-line mt-3 border-l">
        {items.map((item) => (
          <li key={item.id}>
            {link(item, false)}
            {item.children && item.children.length > 0 && (
              <ul className="mb-1">
                {item.children.map((child) => (
                  <li key={child.id}>{link(child, true)}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
