"use client";

import { useInView } from "@/hooks";

/**
 * A hairline down the left gutter with one node per stage, lighting as you
 * reach it and staying lit behind you.
 *
 * The wheel at the top says the work is a loop, but by the fourth section a
 * reader is a long way from it with nothing to say how far through they are.
 * A menu was tried in the left column of every section and was too loud for
 * what this needs to be — this is the same information as a line you read
 * without looking at.
 *
 * The box is given the shell's own width and centring rather than the
 * section's, so the line lands at the same x in every section and the
 * segments join into one continuous run down the page. Only from xl, which
 * is the first width where the gutter is wide enough to hold it clear of the
 * text.
 */
export function FlowMark() {
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: "0px 0px -35% 0px",
    threshold: 0,
  });

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-full max-w-[92rem] -translate-x-1/2 xl:block"
      aria-hidden
    >
      <span
        className={`absolute inset-y-0 left-3 w-px transition-colors duration-700 ${
          inView ? "bg-brand/35" : "bg-line"
        }`}
      />
      <span
        className={`absolute top-[7.5rem] left-3 size-3 -translate-x-1/2 rounded-full border-2 transition-colors duration-700 ${
          inView ? "border-brand-deep bg-canvas" : "border-line bg-canvas"
        }`}
      />
    </div>
  );
}
