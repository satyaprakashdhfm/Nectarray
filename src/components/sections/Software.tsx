import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { headGap, wideShell } from "@/components/software/layout";
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
 * The six cards sit on their own dark band rather than on the page's light
 * ground. Dark cards on a light page read as holes punched in it, and with
 * the white integrations section directly underneath, the eye crossed six
 * separate dark-to-light edges on the way down. On a dark band they are
 * cards on a surface, and there is one deliberate edge instead.
 *
 * The heading and the quote strip stay above it on the light ground, so the
 * page still opens light under a dark header rather than merging into it.
 *
 * The photographs are backgrounds, not thumbnails: a 16:9 band across the
 * top of each card, under a scrim, adding no height. They are duotoned to
 * one navy by scripts/prepare-card-art.cjs — the sources disagreed on colour
 * temperature badly enough that the grid read as six unrelated pictures.
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
    <section id="software">
      {/* Heading and the ask, on the light ground -------------------- */}
      <div className={`${wideShell} pt-14 sm:pt-16 lg:pt-20`}>
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
      </div>

      {/* The showcase, on its own band ------------------------------- */}
      <div className="border-night-line bg-night mt-12 border-y sm:mt-14">
        <div className={`${wideShell} py-12 sm:py-14`}>
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {software.services.map((service, i) => (
              <Reveal as="li" key={service.title} delay={(i % 3) * 70}>
                {/*
                 * A shade lighter than the band it sits on, which is what
                 * separates the two — on the same `night` the cards had only
                 * their hairline to say where they started.
                 */}
                <article className="border-night-line bg-night-soft card-hover relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border p-5 text-white">
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
                    <div className="bg-night-soft/45 absolute inset-0" />
                    <div className="via-night-soft/70 to-night-soft absolute inset-0 bg-gradient-to-b from-transparent" />
                  </div>

                  <div className="relative">
                    <h3 className="text-[1.0625rem] font-semibold tracking-tight text-white">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-[0.875rem] leading-[1.6] text-white/70">
                      {service.body}
                    </p>
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
      </div>
    </section>
  );
}
