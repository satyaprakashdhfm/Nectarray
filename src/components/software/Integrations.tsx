import { Plug } from "lucide-react";
import { BrandLogo } from "@/components/software/BrandLogo";
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
      className="bg-mist border-line border-y py-24 sm:py-28"
    >
      <div className="shell">
        <SectionHead
          eyebrow={integrations.eyebrow}
          title={
            <>
              If it has an API, <em>it can be wired in.</em>
            </>
          }
          lede={integrations.lede}
        />

        <div className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-2">
          {integrations.groups.map((group, i) => (
            <Reveal key={group.label} delay={(i % 2) * 70}>
              <div className="card h-full p-6 sm:p-7">
                <h3 className="text-ink text-[1.0625rem] font-semibold tracking-tight">
                  {group.label}
                </h3>
                {group.note && (
                  <p className="text-ink-soft mt-2 text-[0.875rem] leading-relaxed">
                    {group.note}
                  </p>
                )}

                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.brands.map((brand) => (
                    <li
                      key={brand.name}
                      className="border-line bg-canvas flex items-center gap-2 rounded-lg border px-2.5 py-1.5"
                    >
                      <BrandLogo
                        name={brand.name}
                        domain={brand.domain}
                        className="size-4"
                      />
                      <span className="text-ink-soft text-[0.8125rem] font-medium whitespace-nowrap">
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
          <div className="border-line bg-canvas mt-5 rounded-2xl border p-8 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              <span className="bg-teal-wash text-teal-deep grid size-12 shrink-0 place-items-center rounded-xl">
                <Plug className="size-5" strokeWidth={1.9} aria-hidden />
              </span>
              <div>
                <h3 className="display text-ink text-[1.5rem] sm:text-[1.75rem]">
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
