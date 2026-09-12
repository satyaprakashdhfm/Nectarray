import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { pillars } from "@/lib/content";

/**
 * The four practices, each behind its own picture.
 *
 * One accent across all four, deliberately. Each card used to carry its own
 * colour — amber, blue, green, teal — on a bar, an icon chip and four tag
 * pills, which meant four palettes competing in one grid before a reader
 * had read a word. The cover image is what tells the cards apart now, and
 * everything under it is the same on all four.
 */
export function Practices() {
  return (
    <section
      id="services"
      className="bg-mist relative overflow-hidden py-20 sm:py-24"
    >
      {/* A recessed ground, so the cards read as lifted rather than as more
          of the same white the section is drawn on. */}
      <div
        className="grid-paper pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(95%_65%_at_50%_0%,#000_20%,transparent_78%)] opacity-50"
        aria-hidden
      />

      <div className="shell-wide">
        <SectionHead
          eyebrow="What we do"
          title={
            <>
              Four practices, <em>end to end.</em>
            </>
          }
          lede="Most projects need more than one of these at once. A new site needs people arriving at it. A chatbot needs wiring into the systems you already run. We do all four, so the work carries through instead of stopping at a handover."
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {pillars.map((pillar, i) => (
            <Reveal as="li" key={pillar.id} delay={i * 80}>
              <a
                href={pillar.href}
                className="card card-hover group bg-surface relative flex h-full flex-col overflow-hidden"
              >
                <span className="relative block aspect-[2/1] overflow-hidden">
                  <Image
                    src={pillar.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 34rem, (min-width: 640px) 45vw, 92vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  {/* The pictures are dark and busy at the bottom edge, where
                      the title meets them; this settles that seam. */}
                  <span
                    className="from-surface absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t to-transparent"
                    aria-hidden
                  />
                  <span className="text-cta-fg bg-brand-solid absolute top-4 left-4 grid size-11 place-items-center rounded-2xl shadow-lg">
                    <Icon name={pillar.icon} className="size-[1.25rem]" />
                  </span>
                </span>

                <div className="flex flex-1 flex-col p-7 pt-5 sm:p-8 sm:pt-6">
                  <h3 className="display text-[1.5rem] sm:text-[1.625rem]">
                    {pillar.title}
                  </h3>
                  <p className="text-ink-soft mt-3 text-[0.9375rem] leading-relaxed">
                    {pillar.summary}
                  </p>

                  <ul className="mt-6 flex flex-wrap gap-1.5">
                    {pillar.points.map((point) => (
                      <li
                        key={point}
                        className="border-line bg-mist text-ink-soft rounded-full border px-3 py-1.5 text-[0.8125rem] font-medium"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>

                  <span className="text-ink group-hover:text-brand-deep mt-auto inline-flex items-center gap-1.5 pt-7 text-[0.9375rem] font-semibold transition-colors">
                    Explore
                    <Icon
                      name="arrow"
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
