"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * A company's logo, fetched by domain.
 *
 * Resolved from the domain rather than from a slug in an icon set, because
 * the software our customers actually run is not in one. Simple Icons has
 * React and AWS; it does not have Petpooja, Vyapar, Marg, Shiprocket or
 * Ecom Express, and those are exactly the names that make this page
 * convincing to someone running a restaurant or a warehouse. Every company
 * has a domain, so one rule covers all of them.
 *
 * This is the only function that knows how a logo becomes a URL, for every
 * page that shows one. Moving to self-hosted logos later — or to a
 * different provider — is a change here and nowhere else.
 *
 * Plain <img>, not next/image, on purpose: an external host has to be
 * declared in `images.remotePatterns` before next/image will touch it, and
 * adding a wildcard there to optimise 16px favicons would be a global config
 * change to save nothing. These are already the smallest form of themselves.
 */
function logoUrl(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
}

/**
 * Falls back to the first letter when a logo cannot be fetched.
 *
 * A missing logo must never leave a broken-image glyph or a hole in the grid:
 * the row is a claim about what we integrate with, and a gap in it reads as
 * the claim failing. The monogram keeps the tile the same size and the name
 * beside it is doing the real work anyway.
 */
export function BrandLogo({
  name,
  domain,
  className,
}: {
  name: string;
  domain: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={cn(
          "bg-mist text-ink-faint grid shrink-0 place-items-center rounded-md text-[0.6875rem] font-bold",
          className,
        )}
        aria-hidden
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoUrl(domain)}
      alt=""
      width={20}
      height={20}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={cn("shrink-0 rounded-md object-contain", className)}
    />
  );
}
