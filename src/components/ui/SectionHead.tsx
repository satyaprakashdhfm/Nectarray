import { Reveal } from "./Reveal";

/**
 * Eyebrow → headline → lede, the header used at the top of every section.
 * `title` accepts nodes so callers can wrap accent words in <em> (styled as
 * the gradient, not italic) without a second component.
 */
export function SectionHead({
  eyebrow,
  title,
  lede,
  align = "left",
  onDark = false,
  className = "",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: string;
  align?: "left" | "center";
  onDark?: boolean;
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
        <h2
          className={`display text-[2.125rem] leading-[1.06] sm:text-[2.75rem] lg:text-[3.25rem] ${
            onDark ? "text-white" : "text-ink"
          } [&_em]:ink-gradient [&_em]:not-italic`}
        >
          {title}
        </h2>
      </Reveal>

      {lede && (
        <Reveal delay={120}>
          <p className={`lede mt-6 ${onDark ? "text-white/65" : ""}`}>{lede}</p>
        </Reveal>
      )}
    </header>
  );
}
