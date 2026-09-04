"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * The 3D render that identifies a category.
 *
 * Microsoft's Fluent Emoji set, which ships proper Blender-rendered PNGs
 * under an MIT licence — real 3D objects rather than a flat glyph pretending,
 * and usable commercially without attribution. Served from jsDelivr, already
 * the allowed CDN for this project.
 *
 * As with BrandLogo, this is the only function that knows how an asset
 * becomes a URL. `encodeURI` rather than `encodeURIComponent`: the asset
 * paths contain spaces that must be escaped and slashes that must not.
 */
function assetUrl(path: string) {
  return `https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/${encodeURI(path)}`;
}

/**
 * Always decorative: the card's heading already names the category, so an
 * alt text here would just be the same words read twice. Falls back to the
 * flat lucide icon the category already carries, so a CDN that is slow or
 * blocked costs the card its polish and nothing else.
 */
export function CategoryMark({
  image,
  icon,
  className,
  fallbackClassName,
}: {
  image: string;
  /** Icon key used if the render cannot be fetched. */
  icon: string;
  className?: string;
  fallbackClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={cn(
          "bg-brand-wash text-brand-deep grid place-items-center rounded-2xl",
          className,
          fallbackClassName,
        )}
        aria-hidden
      >
        <Icon name={icon} className="size-6" />
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={assetUrl(image)}
      alt=""
      aria-hidden
      /*
       * Eager, unlike the logo chips further down the page. There are only
       * six of these and the first row of them is on screen immediately, so
       * lazy-loading bought nothing and cost a visible pop-in. Low priority
       * so they still queue behind the fonts and the text that matter first.
       */
      fetchPriority="low"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn("object-contain", className)}
    />
  );
}
