import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
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
 * No durations anywhere. A timeline printed on a card is a quote given before
 * anyone has described the job, and the number is either wrong or a hedge —
 * scope decides it, and scope is what the call is for.
 *
 * `asPage` is set when this section is the body of its own route rather than
 * one of several on the homepage: it promotes the heading to that page's h1.
 */
export function Software({ asPage = false }: { asPage?: boolean } = {}) {
  return (
    <section id="software" className="py-24 sm:py-28 lg:py-32">
      <div className="shell">
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

        <ul className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-2">
          {software.services.map((service, i) => (
            <Reveal as="li" key={service.title} delay={(i % 2) * 80}>
              <article className="card card-hover flex h-full flex-col p-7 sm:p-8">
                <span className="bg-brand-wash text-brand-deep grid size-11 place-items-center rounded-xl">
                  <Icon name={service.icon} className="size-5" />
                </span>

                <h3 className="text-ink mt-6 text-[1.1875rem] font-semibold tracking-tight">
                  {service.title}
                </h3>
                <p className="text-ink-soft mt-3 text-[0.9375rem] leading-relaxed">
                  {service.body}
                </p>

                {/* The trades. Pushed to the bottom so cards of unequal copy
                    length still line their chip blocks up with each other. */}
                <div className="mt-6 flex flex-1 flex-col justify-end">
                  <p className="eyebrow mb-3">Built for</p>
                  <ul className="flex flex-wrap gap-1.5">
                    {service.domains.map((domain) => (
                      <li
                        key={domain}
                        className="border-line bg-canvas text-ink-soft rounded-lg border px-2.5 py-1.5 text-[0.75rem]"
                      >
                        {domain}
                      </li>
                    ))}
                  </ul>

                  {service.more && (
                    <Link
                      href={service.more.href}
                      className="text-brand-deep group mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-semibold"
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
