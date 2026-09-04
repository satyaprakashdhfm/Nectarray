import { ChevronDown, Download } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { academy } from "@/lib/content";

const accents = [
  { rule: "bg-brand", chip: "bg-brand-wash text-brand-deep" },
  { rule: "bg-leaf", chip: "bg-leaf-wash text-leaf-deep" },
  { rule: "bg-amber", chip: "bg-amber-wash text-amber-deep" },
];

/**
 * The programme, module by module.
 *
 * Built on native <details>, so it opens without JavaScript, is keyboard
 * operable for free, and is searchable by the browser's own find-in-page.
 *
 * Every module starts closed. The first one used to open itself, which put
 * twenty-two rows of Python between the top of the section and the two
 * modules underneath it — so the reader scrolled past a list they had not
 * asked for to find out that SQL and placement existed at all. Closed, the
 * three of them fit on one screen and you open the one you came for; the
 * summary and the topic count say what is behind each.
 */
export function Curriculum() {
  const { curriculum, curriculumPdf } = academy.course;

  return (
    <section id="curriculum" className="bg-surface py-20 sm:py-24 lg:py-28">
      <div className="shell">
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
                    className={`absolute inset-y-0 left-0 w-1 ${accent.rule}`}
                    aria-hidden
                  />

                  <summary className="flex cursor-pointer list-none items-start gap-5 p-6 pl-8 sm:p-8 sm:pl-10 [&::-webkit-details-marker]:hidden">
                    <span className="text-ink-faint mt-1 font-mono text-[0.75rem]">
                      {module.n}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-3">
                        <span className="display text-ink text-[1.375rem] sm:text-[1.5rem]">
                          {module.title}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-[0.75rem] font-semibold ${accent.chip}`}
                        >
                          {module.topics.length} topics
                        </span>
                      </span>
                      <span className="text-ink-soft mt-2 block text-[0.9375rem] leading-relaxed">
                        {module.summary}
                      </span>
                    </span>

                    <ChevronDown
                      className="text-ink-faint mt-1.5 size-5 shrink-0 transition-transform duration-300 group-open:rotate-180"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </summary>

                  <div className="border-line-soft mx-6 mb-6 ml-8 border-t sm:mx-8 sm:mb-8 sm:ml-10">
                    <ul>
                      {module.topics.map((topic) => (
                        <li
                          key={topic.title}
                          className="border-line-soft border-b py-4 last:border-0"
                        >
                          <span className="text-ink block text-[0.9375rem] font-semibold">
                            {topic.title}
                          </span>
                          <span className="text-ink-soft mt-1 block text-[0.9rem] leading-relaxed">
                            {topic.body}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={140}>
          <a
            href={curriculumPdf}
            download
            className="border-line bg-canvas text-ink hover:border-brand hover:text-brand-deep mt-10 inline-flex items-center gap-2.5 rounded-full border px-6 py-3.5 text-[0.9375rem] font-semibold transition-colors"
          >
            <Download className="size-4" strokeWidth={2} aria-hidden />
            Download the full curriculum
          </a>
        </Reveal>
      </div>
    </section>
  );
}
