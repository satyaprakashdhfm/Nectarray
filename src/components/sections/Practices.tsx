import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { pillars } from "@/lib/content";

/**
 * The four practices, each fronted by a picture of the work.
 *
 * Built as the panel on /agentic-ai is: the artwork fills the head of the
 * card, a scrim carries the badge and the title over it, and the detail sits
 * on the dark ground below. The cards used to split down the middle, picture
 * above and white card beneath, which read as two things stuck together
 * rather than one.
 *
 * One accent across all four. Each card used to carry its own colour on a
 * bar, an icon chip and four tag pills, so the grid put four palettes in
 * front of a reader before they had read a word; the pictures are what tell
 * them apart now.
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
                className="group border-night-line bg-night hover:border-brand/40 flex h-full flex-col overflow-hidden rounded-[1.75rem] border text-white shadow-[0_30px_70px_-30px_rgba(11,23,32,0.55)] transition-colors duration-300"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={pillar.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 34rem, (min-width: 640px) 45vw, 92vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  {/* Scrim, so the badge and the title hold their contrast
                      whatever the artwork is doing underneath. */}
                  <div
                    className="from-night/95 via-night/40 absolute inset-0 bg-gradient-to-t to-transparent"
                    aria-hidden
                  />

                  <span className="bg-night/70 text-brand ring-brand/30 absolute top-5 left-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase ring-1 backdrop-blur">
                    <Icon name={pillar.icon} className="size-3.5" />
                    {pillar.index}
                  </span>

                  <h3 className="display absolute right-5 bottom-5 left-5 text-[1.5rem] leading-tight sm:text-[1.75rem]">
                    {pillar.title}
                  </h3>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <p className="text-[0.9375rem] leading-relaxed text-white/65">
                    {pillar.summary}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {pillar.points.map((point) => (
                      <li
                        key={point}
                        className="border-night-line rounded-full border bg-white/[0.04] px-3 py-1.5 text-[0.8125rem] font-medium text-white/75"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>

                  <span className="group-hover:text-brand mt-auto inline-flex items-center gap-1.5 pt-6 text-[0.9375rem] font-semibold text-white transition-colors">
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
