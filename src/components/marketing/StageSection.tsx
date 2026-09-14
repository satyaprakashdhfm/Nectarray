import { Reveal } from "@/components/ui/Reveal";
import { FlowMark } from "@/components/marketing/FlowMark";
import {
  StageShowcase,
  type ShowcaseItem,
} from "@/components/marketing/StageShowcase";

/**
 * One stage of the loop, as a section.
 *
 * The explanation down the left, the stage's services in a showcase panel on
 * the right. All five are the same shape on purpose: the page used to change
 * layout every other section, so nothing signalled that these five belong to
 * the sequence the wheel just described.
 *
 * `ground` alternates from the caller so no two neighbours share a colour,
 * and `texture` puts the grid paper on the lighter ones — two points of
 * difference rather than a hairline doing all the work.
 */
export function StageSection({
  id,
  n,
  name,
  title,
  lede,
  items,
  ground,
  texture = false,
}: {
  id: string;
  n: string;
  name: string;
  title: string;
  lede: string;
  items: ShowcaseItem[];
  ground: string;
  texture?: boolean;
}) {
  return (
    <section
      id={id}
      className={`border-line relative scroll-mt-24 overflow-hidden border-b py-20 sm:py-24 ${ground}`}
    >
      <FlowMark />

      {texture && (
        <div
          className="grid-paper pointer-events-none absolute inset-0 -z-10 opacity-60"
          aria-hidden
        />
      )}

      <div className="shell-wide">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="text-ink-faint flex items-center gap-2.5 text-[0.75rem] font-semibold tracking-[0.16em] uppercase">
                <span className="bg-brand-deep grid size-6 place-items-center rounded-full font-mono text-[0.65rem] text-white">
                  {n}
                </span>
                {name}
              </p>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="display text-ink mt-5 text-[2rem] sm:text-[2.5rem]">
                {title}
              </h2>
            </Reveal>
            <Reveal delay={130}>
              <p className="text-ink-soft mt-5 text-[0.9375rem] leading-relaxed">
                {lede}
              </p>
            </Reveal>
          </div>

          {/* min-w-0, or the panel sets the column's width instead of the
              other way round. A grid item's default min-width is auto, so the
              showcase's tab strip — ten segments on one line before it is
              allowed to scroll — pushed this column past its 1.2fr share and
              squeezed the heading opposite into a ladder of single words. */}
          <Reveal delay={120} className="min-w-0">
            <StageShowcase label={name} items={items} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
