import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { academy } from "@/lib/content";

/**
 * One accent per module, so the four are told apart at a glance and the
 * colour carries all the way through — the rule down the edge, the number,
 * the chips, the tint the card takes when it opens, and the marker on every
 * topic inside it.
 *
 * Written out as whole class names rather than built from a token, because
 * Tailwind reads these files as text and never sees a string it has to
 * evaluate first.
 */
const accents = [
  {
    rule: "bg-brand",
    chip: "bg-brand-wash text-brand-deep",
    meta: "bg-brand-wash/60 text-brand-deep",
    open: "group-open:bg-brand-wash/40",
    panel: "bg-brand-wash/25",
    dot: "bg-brand",
  },
  {
    rule: "bg-leaf",
    chip: "bg-leaf-wash text-leaf-deep",
    meta: "bg-leaf-wash/60 text-leaf-deep",
    open: "group-open:bg-leaf-wash/40",
    panel: "bg-leaf-wash/25",
    dot: "bg-leaf",
  },
  {
    rule: "bg-amber",
    chip: "bg-amber-wash text-amber-deep",
    meta: "bg-amber-wash/60 text-amber-deep",
    open: "group-open:bg-amber-wash/40",
    panel: "bg-amber-wash/25",
    dot: "bg-amber",
  },
  {
    rule: "bg-teal",
    chip: "bg-teal-wash text-teal-deep",
    meta: "bg-teal-wash/60 text-teal-deep",
    open: "group-open:bg-teal-wash/40",
    panel: "bg-teal-wash/25",
    dot: "bg-teal",
  },
];

/**
 * The programme, module by module.
 *
 * Built on native <details>, so it opens without JavaScript, is keyboard
 * operable for free, and is searchable by the browser's own find-in-page.
 *
 * Every module starts closed. The first one used to open itself, which put
 * twenty-two rows of Python between the top of the section and the modules
 * underneath it — so the reader scrolled past a list they had not asked for
 * to find out that SQL and placement existed at all. Closed, the four of them
 * fit on one screen and you open the one you came for.
 *
 * The length and the topic count are on the closed card. They were in the
 * data all along and rendered nowhere, so the only way to find out how big a
 * module was, was to open it — which is the one thing the summary line is
 * there to save you.
 *
 * Topics run in two columns from `sm`. In one column the Python module was
 * twenty-two full-width rows of two lines each, which is most of a screen of
 * scrolling to read a list of headings.
 */
export function Curriculum() {
  const { curriculum } = academy.course;

  return (
    <section
      id="curriculum"
      className="border-line bg-mist scroll-mt-24 border-y py-16 sm:py-20"
    >
      <div className="shell-wide">
        <SectionHead
          eyebrow="Curriculum"
          title={
            <>
              The whole programme, <em>in order.</em>
            </>
          }
          lede="Python first because everything assumes it, SQL second because the job is mostly asking data questions, then the part that turns both into an offer."
        />

        <div className="mt-12 space-y-4 lg:mt-14">
          {curriculum.map((module, i) => {
            const accent = accents[i % accents.length];
            return (
              <Reveal key={module.n} delay={i * 90}>
                <details className="group card relative overflow-hidden">
                  <span
                    className={`absolute inset-y-0 left-0 w-1.5 ${accent.rule}`}
                    aria-hidden
                  />

                  <summary
                    className={`flex cursor-pointer list-none items-start gap-5 p-6 pl-8 transition-colors sm:p-8 sm:pl-11 [&::-webkit-details-marker]:hidden ${accent.open}`}
                  >
                    <span
                      className={`grid size-11 shrink-0 place-items-center rounded-xl font-mono text-[0.875rem] font-semibold ${accent.chip}`}
                      aria-hidden
                    >
                      {module.n}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="display text-ink block text-[1.375rem] sm:text-[1.5rem]">
                        {module.title}
                      </span>

                      <span className="mt-2.5 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[0.75rem] font-semibold ${accent.meta}`}
                        >
                          {module.days}
                        </span>
                        <span className="border-line text-ink-faint rounded-full border px-2.5 py-1 text-[0.75rem] font-medium">
                          {module.topics.length} topics
                        </span>
                      </span>

                      <span className="text-ink-soft mt-3 block text-[0.9375rem] leading-relaxed">
                        {module.summary}
                      </span>
                    </span>

                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-full transition-colors ${accent.chip}`}
                      aria-hidden
                    >
                      <ChevronDown
                        className="size-5 transition-transform duration-300 group-open:rotate-180"
                        strokeWidth={2}
                      />
                    </span>
                  </summary>

                  <div
                    className={`mx-6 mb-6 ml-8 rounded-2xl p-6 sm:mx-8 sm:mb-8 sm:ml-11 ${accent.panel}`}
                  >
                    <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
                      {module.topics.map((topic) => (
                        <li key={topic.title} className="flex gap-3">
                          <span
                            className={`mt-[0.5rem] size-1.5 shrink-0 rounded-full ${accent.dot}`}
                            aria-hidden
                          />
                          <div className="min-w-0">
                            <span className="text-ink block text-[0.9375rem] font-semibold">
                              {topic.title}
                            </span>
                            <span className="text-ink-soft mt-1 block text-[0.875rem] leading-relaxed">
                              {topic.body}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
