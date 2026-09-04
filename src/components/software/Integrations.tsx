import { Plug } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
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

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {group.brands.map((brand) => (
                    <li
                      key={brand.name}
                      className="border-line bg-canvas flex items-center gap-1.5 rounded-md border px-2 py-1"
                    >
                      <BrandLogo
                        name={brand.name}
                        domain={brand.domain}
                        className="size-3.5"
                      />
                      <span className="text-ink-soft text-[0.75rem] font-medium whitespace-nowrap">
                        {brand.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* The point of the section, said plainly ----------------------- */}
        <Reveal delay={100}>
          <div className="border-line bg-canvas mt-4 rounded-2xl border p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              <span className="bg-teal-wash text-teal-deep grid size-12 shrink-0 place-items-center rounded-xl">
                <Plug className="size-5" strokeWidth={1.9} aria-hidden />
              </span>
              <div>
                <h3 className="display text-ink text-[1.375rem] sm:text-[1.5rem]">
                  {integrations.closer.title}
                </h3>
                <p className="text-ink-soft mt-3 max-w-3xl text-[0.9375rem] leading-relaxed">
                  {integrations.closer.body}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
