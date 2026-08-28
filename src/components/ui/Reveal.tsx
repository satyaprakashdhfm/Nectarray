"use client";

import { useInView } from "@/hooks";
import { cn } from "@/lib/utils";

type RevealTag = "div" | "li" | "section" | "article" | "header";

/**
 * Fades and lifts its children the first time they scroll into view.
 *
 * The hidden state is scoped to `[data-reveal="on"]` in globals.css, a flag
 * set by an inline script in the layout — so if scripting is unavailable the
 * content simply renders visible instead of disappearing.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  /** Stagger in milliseconds. */
  delay?: number;
  className?: string;
  as?: RevealTag;
}) {
  const { ref, inView } = useInView<HTMLElement>();
  // widen the tag so the ref type is not the intersection of every variant
  const Element = Tag as React.ElementType;

  return (
    <Element
      ref={ref}
      className={cn("reveal", className)}
      data-shown={inView || undefined}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Element>
  );
}
