import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryMark } from "@/components/software/CategoryMark";
import { headGap, sectionPad, wideShell } from "@/components/software/layout";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { software } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * What we build, as a showcase rather than a service list.
 *
 * Each card carries the trades it gets bought for, because "bespoke software
 * for every business" makes a visitor do the work of deciding whether they
 * count. A dentist, a jeweller and a warehouse manager should each find their
 * own word in a list and stop wondering.
 *
 * Each also carries a 3D render of its category in its top corner, which is
 * what the flat lucide chip used to be.
 *
 * No durations anywhere. A timeline printed on a card is a quote given before
 * anyone has described the job, and the number is either wrong or a hedge —
 * scope decides it, and scope is what the call is for.
 *
 * `asPage` is set when this section is the body of its own route rather than
 * one of several on the homepage: it promotes the heading to that page's h1.
 */
export function Software({ asPage = false }: { asPage?: boolean } = {}) {
  return (
    <section id="software" className={sectionPad}>
      <div className={wideShell}>
        <SectionHead
          as={asPage ? "h1" : "h2"}
          eyebrow={software.eyebrow}
          title={
            <>
              Whatever the business is, <em>there is a build here for it.</em>
            </>
          }
          lede={software.lede}
        />

        <ul className={cn("grid gap-4 md:grid-cols-2 xl:grid-cols-3", headGap)}>
          {software.services.map((service, i) => (
            <Reveal as="li" key={service.title} delay={(i % 3) * 70}>
              <article className="card card-hover flex h-full flex-col overflow-hidden p-5">
                {/*
                 * Title and art as a flex row, not art absolutely positioned
                 * over the copy.
                 *
                 * Absolute was the first attempt and it does not survive real
                 * content: the reserved right padding has to be guessed, and
                 * the guess only holds while the heading stays one line. Laid
                 * out as a row, the two can no longer overlap at any card
                 * width — and the picture sits where a corner ornament should
                 * without any number needing to be right.
                 *
                 * One prominent render rather than a large faint watermark
                 * behind the copy: at an opacity low enough to sit under a
                 * heading it stopped reading as 3D at all, and at anything
                 * higher it was texture under eighteen chips of 11px text.
                 */}
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-ink text-[1.0625rem] font-semibold tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-ink-soft mt-2 text-[0.875rem] leading-[1.6]">
                      {service.body}
                    </p>
                  </div>

                  <div
                    className="pointer-events-none relative -mt-2 -mr-2 size-[4.5rem] shrink-0 select-none sm:size-20"
                    aria-hidden
                  >
                    <div className="bg-brand/15 absolute inset-3 rounded-full blur-xl" />
                    <CategoryMark
                      image={service.image}
                      icon={service.icon}
                      className="relative size-full"
                      fallbackClassName="p-3"
                    />
                  </div>
                </div>

                {/* The trades. Pushed to the bottom so cards of unequal
                    copy length still line their chip blocks up. */}
                <div className="mt-4 flex flex-1 flex-col justify-end">
                  <p className="text-ink-faint text-[0.625rem] font-semibold tracking-[0.14em] uppercase">
                    Built for
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-1">
                    {service.domains.map((domain) => (
                      <li
                        key={domain}
                        className="border-line bg-canvas text-ink-soft rounded-md border px-1.5 py-0.5 text-[0.6875rem] leading-[1.5]"
                      >
                        {domain}
                      </li>
                    ))}
                  </ul>

                  {service.more && (
                    <Link
                      href={service.more.href}
                      className="text-brand-deep group mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold"
                    >
                      {service.more.label}
                      <ArrowRight
                        className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        strokeWidth={2.25}
                        aria-hidden
                      />
                    </Link>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
