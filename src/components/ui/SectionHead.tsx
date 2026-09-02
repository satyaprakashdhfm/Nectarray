import { Reveal } from "./Reveal";

/**
 * Eyebrow → headline → lede, the header used at the top of every section.
 *
 * `title` accepts nodes so callers can wrap accent words in <em> (styled as
 * the gradient, not italic) without a second component. `as` exists because
 * these sections are used twice: as one of several on a page, where they are
 * an h2, and as the whole body of a dedicated page, where the same block is
 * that page's h1.
 */
export function SectionHead({
  eyebrow,
  title,
  lede,
  align = "left",
  onDark = false,
  as: Heading = "h2",
  className = "",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: string;
  align?: "left" | "center";
  onDark?: boolean;
  as?: "h1" | "h2";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <header
      className={`${centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}
    >
      {eyebrow && (
        <Reveal>
          <p
            className={`eyebrow mb-5 flex items-center gap-2.5 ${centered ? "justify-center" : ""} ${
              onDark ? "text-leaf" : ""
            }`}
          >
            <span
              className={`h-px w-6 ${onDark ? "bg-leaf/50" : "bg-brand/50"}`}
              aria-hidden
            />
            {eyebrow}
          </p>
        </Reveal>
      )}

      <Reveal delay={60}>
        <Heading
          className={`display text-[2.125rem] leading-[1.06] sm:text-[2.75rem] lg:text-[3.25rem] ${
            onDark ? "text-white" : "text-ink"
          } [&_em]:ink-gradient [&_em]:not-italic`}
        >
          {title}
        </Heading>
      </Reveal>

      {lede && (
        <Reveal delay={120}>
          <p className={`lede mt-6 ${onDark ? "text-white/65" : ""}`}>{lede}</p>
        </Reveal>
      )}
    </header>
  );
}
