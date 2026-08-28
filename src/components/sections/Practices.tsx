import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { pillars } from "@/lib/content";

const accents = [
  { wash: "bg-amber-wash", fg: "text-amber-deep", bar: "bg-amber" },
  { wash: "bg-brand-wash", fg: "text-brand-deep", bar: "bg-brand" },
  { wash: "bg-leaf-wash", fg: "text-leaf-deep", bar: "bg-leaf" },
  { wash: "bg-mist", fg: "text-ink", bar: "bg-ink" },
];

export function Practices() {
  return (
    <section id="services" className="scroll-mt-24 py-24 sm:py-28 lg:py-32">
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
                className="card card-hover group relative flex h-full flex-col overflow-hidden p-7 sm:p-8"
              >
                {/* accent rule that draws in on hover */}
                <span
                  className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ${accents[i].bar}`}
                  aria-hidden
                />

                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`grid size-12 place-items-center rounded-2xl ${accents[i].wash} ${accents[i].fg}`}
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
                      className="bg-mist text-ink-soft rounded-full px-3 py-1.5 text-[0.8125rem] font-medium"
                    >
                      {point}
                    </li>
                  ))}
                </ul>

                <span className="text-ink group-hover:text-brand-deep mt-7 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold transition-colors">
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
