import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { wideShell } from "@/components/software/layout";
import { Reveal } from "@/components/ui/Reveal";
import { company, software } from "@/lib/content";

const { quote } = software;

/**
 * The page's one ask, shown twice.
 *
 * This used to be two separate things stacked at the bottom: a "get a quote"
 * band closing the why-us section, and then the shared PageCta underneath it
 * asking for the same thing again in different words. Two consecutive CTAs
 * read as neither being the real one. They are now a single block, and it
 * also appears above the catalogue — a reader who is already sold should not
 * have to scroll four sections of chips to find the button.
 *
 * Highlighted with `brand-band`, the site's gradient surface, whose stops are
 * dark enough to clear 5.8:1 against white copy (see globals.css).
 */
function Band({ compact }: { compact: boolean }) {
  const Title = compact ? "p" : "h2";

  return (
    <div className="brand-band overflow-hidden rounded-2xl p-6 sm:p-8">
      <div
        className={
          compact
            ? "flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10"
            : "flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-12"
        }
      >
        <div className="min-w-0">
          <p className="text-[0.6875rem] font-semibold tracking-[0.16em] text-white/70 uppercase">
            {quote.eyebrow}
          </p>
          {/*
           * Only the closing band is a real heading. The one at the top sits
           * between the page's h1 and the category h3s, and an h2 there would
           * claim those cards as its own children in the document outline —
           * the same words are already an h2 at the foot of the page.
           */}
          <Title
            className={
              compact
                ? "display mt-2 text-[1.375rem] text-white sm:text-[1.5rem]"
                : "display mt-2 text-[1.5rem] text-white sm:text-[1.875rem]"
            }
          >
            {quote.title}
          </Title>
          <p className="mt-2.5 max-w-2xl text-[0.875rem] leading-relaxed text-white/85">
            {compact ? quote.lead : quote.body}
          </p>
        </div>

        {/* Buttons keep their own column on desktop and stack under the copy
            on mobile, so the primary is never pushed off the first screen. */}
        <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row">
          <Link
            href={quote.cta.href}
            className="text-ink group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-[0.9375rem] font-semibold transition-colors hover:bg-white/90"
          >
            {quote.cta.label}
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2.25}
              aria-hidden
            />
          </Link>
          <a
            href={`mailto:${company.email}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 px-6 py-3.5 text-[0.9375rem] font-semibold text-white transition-colors hover:border-white/70"
          >
            <Mail className="size-4" strokeWidth={2} aria-hidden />
            {company.email}
          </a>
        </div>
      </div>
    </div>
  );
}

/** The band on its own, for dropping inside a section that already exists. */
export function QuoteBand({ compact = false }: { compact?: boolean }) {
  return <Band compact={compact} />;
}

/**
 * The band as the page's closing section.
 *
 * Contained on a light ground rather than run full-bleed: a full-colour band
 * sitting directly on top of the night footer was tried on this site before
 * and the two heavy surfaces fought each other (see the note in README).
 * The light gutter around it is what keeps them apart.
 */
export function QuoteSection() {
  return (
    <section className="border-line bg-surface border-t py-14 sm:py-16">
      <div className={wideShell}>
        <Reveal>
          <Band compact={false} />
        </Reveal>
      </div>
    </section>
  );
}
