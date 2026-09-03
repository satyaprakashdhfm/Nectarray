import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { pillars } from "@/lib/content";

/**
 * One accent per practice, in wordmark order: amber, blue, green, teal.
 *
 * `chip` and `pill` use the deep tones because they carry text or a glyph;
 * `bar` and `tint` use the display tones, which only ever sit behind
 * nothing. The fourth practice used to fall back to grey, which read as a
 * disabled card rather than a fourth equal.
 */
const accents = [
  {
    bar: "bg-amber",
    chip: "bg-amber-deep",
    tint: "from-amber-wash",
    pill: "bg-amber-wash text-amber-deep",
    link: "group-hover:text-amber-deep",
  },
  {
    bar: "bg-brand",
    chip: "bg-brand-deep",
    tint: "from-brand-wash",
    pill: "bg-brand-wash text-brand-deep",
    link: "group-hover:text-brand-deep",
  },
  {
    bar: "bg-leaf",
    chip: "bg-leaf-deep",
    tint: "from-leaf-wash",
    pill: "bg-leaf-wash text-leaf-deep",
    link: "group-hover:text-leaf-deep",
  },
  {
    bar: "bg-teal",
    chip: "bg-teal-deep",
    tint: "from-teal-wash",
    pill: "bg-teal-wash text-teal-deep",
    link: "group-hover:text-teal-deep",
  },
];

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

      <div className="shell">
        <SectionHead
          eyebrow="What we do"
          title={
            <>
              Four practices. <em>One team.</em>
            </>
          }
          lede="Agencies usually pick a lane. We deliberately did not — because the website, the campaign pointing at it, the agent answering on it and the people who can build the next one are the same problem wearing four hats."
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16">
          {pillars.map((pillar, i) => (
            <Reveal as="li" key={pillar.id} delay={i * 80}>
              <a
                href={pillar.href}
                className={`card card-hover group relative flex h-full flex-col overflow-hidden bg-gradient-to-br p-7 sm:p-8 ${accents[i].tint} to-surface`}
              >
                {/* Accent rule — always on, so the card is identifiable at
                    rest rather than only under a cursor that never lands on
                    a phone. */}
                <span
                  className={`absolute inset-x-0 top-0 h-1.5 ${accents[i].bar}`}
                  aria-hidden
                />

                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`grid size-12 place-items-center rounded-2xl text-white ${accents[i].chip}`}
                  >
                    <Icon name={pillar.icon} className="size-[1.375rem]" />
                  </span>
                  <span className="text-ink-faint font-mono text-xs">
                    {pillar.index}
                  </span>
                </div>

                <h3 className="display mt-6 text-[1.5rem] sm:text-[1.625rem]">
                  {pillar.title}
                </h3>
                <p className="text-ink-soft mt-3 text-[0.9375rem] leading-relaxed">
                  {pillar.summary}
                </p>

                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {pillar.points.map((point) => (
                    <li
                      key={point}
                      className={`rounded-full px-3 py-1.5 text-[0.8125rem] font-medium ${accents[i].pill}`}
                    >
                      {point}
                    </li>
                  ))}
                </ul>

                <span
                  className={`text-ink mt-7 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold transition-colors ${accents[i].link}`}
                >
                  Explore
                  <Icon
                    name="arrow"
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
