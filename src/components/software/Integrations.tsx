import { BrandChip } from "@/components/software/BrandChip";
import { headGap, sectionPad, wideShell } from "@/components/software/layout";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { software } from "@/lib/content";

const { integrations } = software;

/**
 * Everything we plug into, by logo.
 *
 * Recessed onto the mist ground so the white group panels read as tiles on a
 * surface rather than as six more cards in the same stack as the section
 * above — the page alternates ground deliberately (see globals.css).
 *
 * Names sit beside the logos rather than under them. A customer scanning for
 * "Petpooja" is reading, not admiring a logo wall, and a favicon at this size
 * is recognition support rather than the label itself.
 */
export function Integrations() {
  return (
    <section
      id="integrations"
      className={`bg-mist border-line border-y ${sectionPad}`}
    >
      <div className={wideShell}>
        <SectionHead
          eyebrow={integrations.eyebrow}
          title={
            <>
              If it has an API, <em>it can be wired in.</em>
            </>
          }
          lede={integrations.lede}
        />

        <div className={`grid gap-4 lg:grid-cols-3 ${headGap}`}>
          {integrations.groups.map((group, i) => (
            <Reveal key={group.label} delay={(i % 2) * 70}>
              <div className="card h-full p-5">
                <h3 className="text-ink text-[0.9375rem] font-semibold tracking-tight">
                  {group.label}
                </h3>
                {group.note && (
                  <p className="text-ink-soft mt-1.5 text-[0.8125rem] leading-[1.55]">
                    {group.note}
                  </p>
                )}

                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.brands.map((brand) => (
                    <BrandChip key={brand.name} brand={brand} />
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
