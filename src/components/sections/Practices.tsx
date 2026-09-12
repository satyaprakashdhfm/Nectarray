import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { pillars } from "@/lib/content";

/**
 * The four practices, each on a picture of the work, read through glass.
 *
 * The section runs dark on purpose. The cards were four light panels with
 * four different accent colours on a near-white ground, which left the page
 * both washed out and busy at once. A dark ground gives the pictures
 * somewhere to sit, the glass panel carries the words at a contrast that
 * holds over any part of an image, and one accent serves all four.
 */
export function Practices() {
  return (
    <section
      id="services"
      className="bg-night relative overflow-hidden py-20 text-white sm:py-24"
    >
      {/* The hero's colours, far away, so the ground is lit rather than flat. */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="bg-brand/18 absolute -top-32 -left-24 size-[34rem] rounded-full blur-[130px]" />
        <div className="bg-teal/14 absolute -right-28 bottom-0 size-[30rem] rounded-full blur-[130px]" />
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [mask-image:radial-gradient(95%_60%_at_50%_0%,#000_20%,transparent_78%)] [background-size:64px_64px]" />
      </div>

      <div className="shell-wide">
        <SectionHead
          onDark
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
                className="group relative flex h-full min-h-[30rem] flex-col justify-end overflow-hidden rounded-[1.6rem] border border-white/12 shadow-[0_30px_70px_-32px_rgba(0,0,0,0.75)] transition-colors duration-300 hover:border-white/25 sm:min-h-[25rem]"
              >
                <Image
                  src={pillar.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 34rem, (min-width: 640px) 45vw, 92vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />

                {/* Dark at the foot, clear at the head: the glass keeps its
                    contrast wherever the picture happens to be bright. */}
                <span
                  className="absolute inset-0 bg-gradient-to-t from-[#03101a] via-[#03101a]/55 to-transparent"
                  aria-hidden
                />

                <span className="absolute top-5 left-5 grid size-11 place-items-center rounded-2xl border border-white/20 bg-white/12 text-white backdrop-blur-md">
                  <Icon name={pillar.icon} className="size-[1.25rem]" />
                </span>

                <div className="relative m-3 rounded-[1.15rem] border border-white/14 bg-white/10 p-6 backdrop-blur-xl transition-colors duration-300 group-hover:bg-white/14 sm:m-3.5 sm:p-7">
                  <h3 className="display text-[1.5rem] text-white sm:text-[1.625rem]">
                    {pillar.title}
                  </h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-white/80">
                    {pillar.summary}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {pillar.points.map((point) => (
                      <li
                        key={point}
                        className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[0.8125rem] font-medium text-white/85"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>

                  <span className="group-hover:text-leaf mt-6 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-white transition-colors">
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
