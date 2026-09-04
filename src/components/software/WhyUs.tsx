import { Icon } from "@/components/ui/Icon";
import { headGap, sectionPad, wideShell } from "@/components/software/layout";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { software } from "@/lib/content";

const { why } = software;

/**
 * Why us — the last thing read before the closing CTA.
 *
 * The claim is a price comparison, so the section invites the comparison
 * instead of asserting a number. No percentages, no "50% cheaper", no client
 * counts: a figure nobody can check is worth less than an offer to be checked,
 * and a written scope against a fixed price is something the reader can
 * actually take to a competitor.
 */
export function WhyUs() {
  return (
    <section
      id="why-us"
      className={`bg-mist border-line border-t ${sectionPad}`}
    >
      <div className={wideShell}>
        <SectionHead
          eyebrow={why.eyebrow}
          title={
            <>
              Senior engineers, <em>a fraction of the cost,</em> and no agency
              layer in between.
            </>
          }
          lede={why.lede}
        />

        <ul className={`grid gap-4 md:grid-cols-2 xl:grid-cols-3 ${headGap}`}>
          {why.points.map((point, i) => (
            <Reveal as="li" key={point.title} delay={(i % 3) * 80}>
              <article className="card h-full p-5">
                <span className="bg-leaf-wash text-leaf-deep grid size-11 place-items-center rounded-xl">
                  <Icon name={point.icon} className="size-5" />
                </span>
                <h3 className="text-ink mt-4 text-[1rem] font-semibold tracking-tight">
                  {point.title}
                </h3>
                <p className="text-ink-soft mt-2 text-[0.875rem] leading-[1.6]">
                  {point.body}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
