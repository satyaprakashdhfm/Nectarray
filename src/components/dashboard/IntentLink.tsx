"use client";

import Link from "next/link";
import { useState, type ComponentProps } from "react";

/**
 * A link that fetches its whole page the moment someone shows they mean to
 * open it — a pointer over it, a finger on it, keyboard focus — instead of
 * when it scrolls into view, or not at all.
 *
 * The lesson rails used plain `prefetch={false}`, because prefetching every
 * link in view meant fourteen speculative renders of a long page nobody had
 * asked for. That also meant every click started from nothing: a full
 * server render after the click, with the page frozen until it arrived.
 * Intent sits between the two. A pointer usually rests on a link for a
 * couple of hundred milliseconds before the click, which is most of a
 * render, so the page is often ready by the time it is asked for — and only
 * the links someone actually reaches for are ever fetched.
 */
export function IntentLink({
  onMouseEnter,
  onTouchStart,
  onFocus,
  ...props
}: Omit<ComponentProps<typeof Link>, "prefetch">) {
  const [armed, setArmed] = useState(false);

  return (
    <Link
      {...props}
      prefetch={armed ? true : false}
      onMouseEnter={(event) => {
        setArmed(true);
        onMouseEnter?.(event);
      }}
      onTouchStart={(event) => {
        setArmed(true);
        onTouchStart?.(event);
      }}
      onFocus={(event) => {
        setArmed(true);
        onFocus?.(event);
      }}
    />
  );
}
