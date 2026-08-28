import { Star } from "lucide-react";
import { marqueeItems, trustChips } from "@/lib/content";

/**
 * Two continuously scrolling bands under the hero: promise chips on top,
 * the working stack below. Each track renders its items twice so the
 * -50% keyframe loops seamlessly.
 */
export function Marquee() {
  return (
    <section
      className="border-line bg-surface relative border-y py-7 sm:py-9"
      aria-label="What we promise and what we build with"
    >
      {/* Chips */}
      <div className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)]">
        <ul className="marquee-track flex shrink-0 items-center gap-3 pr-3 group-hover:[animation-play-state:paused]">
          {[...trustChips, ...trustChips].map((chip, i) => (
            <li
              key={`${chip}-${i}`}
              className="border-line bg-canvas flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5"
            >
              <Star
                className="fill-amber text-amber size-3.5 shrink-0"
                strokeWidth={1.5}
                aria-hidden
              />
              <span className="text-ink text-[0.875rem] font-medium whitespace-nowrap">
                {chip}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Stack, scrolling the other way */}
      <div className="mt-5 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)] sm:mt-6">
        <ul
          className="marquee-track marquee-track-fast flex shrink-0 items-center gap-9 pr-9 [animation-direction:reverse]"
          aria-hidden
        >
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <li
              key={`${item}-${i}`}
              className="text-ink-faint text-[0.9375rem] font-medium tracking-tight whitespace-nowrap"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Accessible, non-animated equivalent of the stack list above */}
      <p className="sr-only">We build with {marqueeItems.join(", ")}.</p>
    </section>
  );
}
