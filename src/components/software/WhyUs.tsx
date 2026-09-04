import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { software } from "@/lib/content";

const { why } = software;

/**
 * Why us — the last thing read before the closing CTA.
 *
 * The claim is a price comparison, so the section invites the comparison
 * instead of asserting a number. No percentages, no "50% cheaper", no client
 * counts: a figure nobody can check is worth less than an offer to be checked,
 * and a written scope against a fixed price is something the reader can
 * actually take to a competitor.
 */
export function WhyUs() {
  return (
    <section
      id="why-us"
      className="bg-mist border-line border-t py-24 sm:py-28"
    >
      <div className="shell">
        <SectionHead
          eyebrow={why.eyebrow}
          title={
            <>
              A small team, <em>a fraction of the cost,</em> and no agency layer
              in between.
            </>
          }
          lede={why.lede}
        />

        <ul className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-3">
          {why.points.map((point, i) => (
            <Reveal as="li" key={point.title} delay={(i % 3) * 80}>
              <article className="card h-full p-7">
                <span className="bg-leaf-wash text-leaf-deep grid size-11 place-items-center rounded-xl">
                  <Icon name={point.icon} className="size-5" />
                </span>
                <h3 className="text-ink mt-6 text-[1.0625rem] font-semibold tracking-tight">
                  {point.title}
                </h3>
                <p className="text-ink-soft mt-3 text-[0.9375rem] leading-relaxed">
                  {point.body}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={120}>
          <div className="brand-band mt-5 overflow-hidden rounded-2xl p-8 sm:p-10">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <div>
                <h3 className="display text-[1.625rem] text-white sm:text-[1.875rem]">
                  {why.closer.title}
                </h3>
                <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-white/85">
                  {why.closer.body}
                </p>
              </div>

              <Link
                href="/contact"
                className="text-ink group inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-6 py-3.5 text-[0.9375rem] font-semibold transition-colors hover:bg-white/90 lg:self-auto"
              >
                Get a quote
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2.25}
                  aria-hidden
                />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
