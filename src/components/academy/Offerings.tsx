import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { academy } from "@/lib/content";

/** The four brand accents, cycled so no two adjacent cards share one. */
const accents = [
  { bar: "bg-amber", chip: "bg-amber-deep", tint: "from-amber-wash" },
  { bar: "bg-brand", chip: "bg-brand-deep", tint: "from-brand-wash" },
  { bar: "bg-leaf", chip: "bg-leaf-deep", tint: "from-leaf-wash" },
  { bar: "bg-teal", chip: "bg-teal-deep", tint: "from-teal-wash" },
];

export function Offerings() {
  return (
    <section
      id="offerings"
      className="border-line bg-mist relative overflow-hidden border-y py-20 sm:py-24 lg:py-28"
    >
      <div
        className="grid-paper pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(95%_65%_at_50%_0%,#000_20%,transparent_78%)] opacity-50"
        aria-hidden
      />

      <div className="shell">
        <SectionHead
          align="center"
          eyebrow="Exclusive course offerings"
          title={
            <>
              What you actually <em>get.</em>
            </>
          }
          lede="Six things this programme does that a recorded course cannot, and that a class of two hundred cannot either."
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {academy.course.offerings.map((offering, i) => {
            const accent = accents[i % accents.length];
            return (
              <Reveal as="li" key={offering.title} delay={(i % 3) * 80}>
                <article
                  className={`card card-hover relative flex h-full flex-col overflow-hidden bg-gradient-to-br p-7 ${accent.tint} to-surface`}
                >
                  <span
                    className={`absolute inset-x-0 top-0 h-1.5 ${accent.bar}`}
                    aria-hidden
                  />

                  <span
                    className={`grid size-11 place-items-center rounded-xl text-white ${accent.chip}`}
                  >
                    <Icon name={offering.icon} className="size-5" />
                  </span>

                  <h3 className="text-ink mt-6 text-[1.125rem] font-semibold tracking-tight">
                    {offering.title}
                  </h3>
                  <p className="text-ink-soft mt-3 text-[0.9375rem] leading-relaxed">
                    {offering.body}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
