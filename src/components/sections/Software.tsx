import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryMark } from "@/components/software/CategoryMark";
import { headGap, sectionPad, wideShell } from "@/components/software/layout";
import { QuoteBand } from "@/components/software/QuoteCta";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { software } from "@/lib/content";

/**
 * What we build, as a showcase rather than a service list.
 *
 * Each card carries the trades it gets bought for, because "bespoke software
 * for every business" makes a visitor do the work of deciding whether they
 * count. A dentist, a jeweller and a warehouse manager should each find their
 * own word in a list and stop wondering.
 *
 * Each also carries a photograph of the work behind it and a 3D render of
 * its category in the top corner, which is what the flat lucide chip used
 * to be.
 *
 * The photograph is a background rather than a thumbnail: it sits in a 16:9
 * band across the top, under a scrim, and adds no height to the card. All
 * six sources happen to be dark, which is what makes white copy over them
 * safe — a lighter set would need the scrim raised or the art moved out from
 * under the text entirely.
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

        {/* The ask, up front. Repeated in full at the foot of the page. */}
        <Reveal delay={160} className={headGap}>
          <QuoteBand compact />
        </Reveal>

        <ul className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {software.services.map((service, i) => (
            <Reveal as="li" key={service.title} delay={(i % 3) * 70}>
              <article className="border-night-line bg-night card-hover relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border p-5 text-white">
                {/* Category art -------------------------------------- */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 aspect-[16/9]"
                  aria-hidden
                >
                  <Image
                    src={service.art}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 31vw, (min-width: 768px) 47vw, 92vw"
                    className="object-cover"
                  />
                  {/* Knocked back, then melted into the card's own ground
                      at the foot of the band so there is no visible edge. */}
                  <div className="bg-night/55 absolute inset-0" />
                  <div className="via-night/70 to-night absolute inset-0 bg-gradient-to-b from-transparent" />
                </div>
                {/*
                 * The 3D mark shares a flex row with the heading rather than
                 * being absolutely positioned over it, unlike the photograph
                 * above — which can be, because nothing has to keep clear of
                 * a full-width band.
                 *
                 * Absolute was the first attempt here too, and it does not
                 * survive real content: the right padding reserved for the
                 * mark has to be guessed, and the guess only holds while the
                 * heading stays on one line. As a row they cannot overlap at
                 * any card width.
                 */}
                <div className="relative flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[1.0625rem] font-semibold tracking-tight text-white">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-[0.875rem] leading-[1.6] text-white/70">
                      {service.body}
                    </p>
                  </div>

                  <div
                    className="pointer-events-none relative -mt-2 -mr-2 size-[4.5rem] shrink-0 select-none sm:size-20"
                    aria-hidden
                  >
                    <div className="bg-brand/25 absolute inset-3 rounded-full blur-xl" />
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
                <div className="relative mt-4 flex flex-1 flex-col justify-end">
                  <p className="text-[0.625rem] font-semibold tracking-[0.14em] text-white/45 uppercase">
                    Built for
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-1">
                    {service.domains.map((domain) => (
                      <li
                        key={domain}
                        className="rounded-md border border-white/12 bg-white/6 px-1.5 py-0.5 text-[0.6875rem] leading-[1.5] text-white/75"
                      >
                        {domain}
                      </li>
                    ))}
                  </ul>

                  {service.more && (
                    <Link
                      href={service.more.href}
                      className="text-leaf group mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold"
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
