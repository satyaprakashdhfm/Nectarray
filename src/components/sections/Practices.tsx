import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { pillars } from "@/lib/content";

/**
 * The four practices, on the pattern the panel on /agentic-ai uses: a ringed
 * badge in the top corner, the picture breathing below it, and the words on
 * the near-black floor of the card. One blue throughout — each card used to
 * carry its own colour — amber, blue, green, teal — across a bar, a chip and
 * its tags, which put four palettes in one grid before a reader had read a
 * word. The pictures tell them apart now.
 */
export function Practices() {
  return (
    <section
      id="services"
      className="bg-mist relative overflow-hidden py-24 sm:py-28 lg:py-32"
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

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16">
          {pillars.map((pillar, i) => (
            <Reveal as="li" key={pillar.id} delay={i * 80}>
              <a
                href={pillar.href}
                className="card card-hover group relative isolate flex h-full flex-col overflow-hidden p-7 sm:p-8"
              >
                {/* The practice's picture across the whole card. The wash over
                    it is thinnest at the top, where nothing but the badge
                    sits, and near-solid by the time it reaches the words: the
                    picture and the text get their own band of the card rather
                    than sharing every pixel. It used to run the other way,
                    which put the summary over the brightest part of the
                    artwork and saved the darkest wash for the empty bottom. */}
                <Image
                  src={pillar.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 40rem, (min-width: 640px) 48vw, 94vw"
                  className="-z-20 object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span
                  className="from-night/25 via-night/88 to-night/96 absolute inset-0 -z-10 bg-gradient-to-b via-38%"
                  aria-hidden
                />
                {/* The blue rises from the bottom, so it tints the bed the
                    words sit on instead of the artwork. */}
                <span
                  className="from-brand-deep/30 absolute inset-0 -z-10 bg-gradient-to-t to-transparent"
                  aria-hidden
                />

                <span className="bg-night/70 text-brand ring-brand/30 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase ring-1 backdrop-blur">
                  <Icon name={pillar.icon} className="size-3.5" />
                  {pillar.index}
                </span>

                {/* mt-auto, so the words sit on the floor of the card. Two
                    things come of it: they land on the dark end of the wash,
                    and a card stretched by a taller neighbour takes the slack
                    above the heading rather than below the link — which is
                    what left a hole under Explore on the shortest card. */}
                <div className="mt-auto pt-10">
                  <h3 className="display text-[1.5rem] text-white sm:text-[1.625rem]">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/75">
                    {pillar.summary}
                  </p>

                  <ul className="mt-6 flex flex-wrap gap-1.5">
                    {pillar.points.map((point) => (
                      <li
                        key={point}
                        className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[0.8125rem] font-medium text-white/85"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>

                  <span className="group-hover:text-brand mt-7 flex w-fit items-center gap-1.5 text-[0.9375rem] font-semibold text-white transition-colors">
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
