import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { academy } from "@/lib/content";

/**
 * What the programme is and how it runs, in one section under the hero.
 *
 * These were two: a strip of module cards headed "what you will learn", then
 * this. They were both claiming id="overview", which is a bug on its own, and
 * they were making the same argument twice — the strip listed the three
 * blocks and said nothing about how any of it is taught, while the prose here
 * explained the order of those same three blocks without naming them.
 *
 * Together: the argument on the left, the blocks it is about on the right,
 * and a link down to the syllabus that lists them properly. The block names
 * come from `curriculum` rather than a second list, so renaming a module
 * cannot leave this quietly disagreeing with the syllabus below it.
 */
export function AboutCourse() {
  const { about, outcomes, forWho, curriculum } = academy.course;

  return (
    <section id="overview" className="bg-surface scroll-mt-24 py-16 sm:py-20">
      <div className="shell-wide">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div>
            <SectionHead
              eyebrow="About the course"
              title={
                <>
                  You write the code.{" "}
                  <em>Someone who does it for a living reads it.</em>
                </>
              }
            />

            <div className="mt-8 space-y-5">
              {about.paragraphs.map((paragraph, i) => (
                <Reveal key={paragraph} delay={i * 70}>
                  <p className="text-ink-soft text-[1.0625rem] leading-relaxed">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={220}>
              <ul className="border-line mt-10 grid gap-3 border-t pt-8 sm:grid-cols-2">
                {about.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3">
                    <Check
                      className="text-leaf-deep mt-0.5 size-4 shrink-0"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                    <span className="text-ink-soft text-[0.9375rem] leading-relaxed">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* The three blocks the prose opposite is describing. Named only —
              the syllabus further down is where they are broken out. */}
          <div>
            <Reveal delay={100}>
              <p className="text-ink-faint text-[0.75rem] font-semibold tracking-[0.16em] uppercase">
                The three blocks
              </p>
            </Reveal>
            <ol className="mt-4 space-y-3">
              {curriculum.map((module, i) => (
                <Reveal as="li" key={module.n} delay={140 + i * 70}>
                  <article className="border-line bg-mist flex gap-4 rounded-2xl border p-5">
                    <span className="bg-brand-wash text-brand-deep grid size-9 shrink-0 place-items-center rounded-xl font-mono text-[0.8125rem] font-semibold">
                      {module.n}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-ink text-[1.0625rem] font-semibold tracking-tight">
                        {module.title}
                      </h3>
                      <p className="text-ink-soft mt-1.5 text-[0.875rem] leading-[1.6]">
                        {module.summary}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={360}>
              <a
                href="#curriculum"
                className="text-brand-deep hover:text-brand mt-4 inline-flex text-[0.875rem] font-semibold transition-colors"
              >
                The full syllabus, week by week ↓
              </a>
            </Reveal>
          </div>
        </div>

        {/* Who it suits and what they walk away with, across the foot rather
            than stacked in the right column — three things down one side left
            it twice the height of the argument it was meant to sit beside. */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          <Reveal delay={120}>
            <div className="border-leaf-wash bg-leaf-wash/50 h-full rounded-2xl border p-7">
              <h3 className="eyebrow text-leaf-deep">What you leave with</h3>
              <ul className="mt-5 space-y-3.5">
                {outcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-3">
                    <Check
                      className="text-leaf-deep mt-0.5 size-4 shrink-0"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                    <span className="text-ink-soft text-[0.9375rem] leading-relaxed">
                      {outcome}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div className="border-line bg-mist h-full rounded-2xl border p-7">
              <h3 className="eyebrow">Who it is for</h3>
              <ul className="mt-5 space-y-3.5">
                {forWho.map((who) => (
                  <li
                    key={who}
                    className="text-ink-soft border-line-soft border-b pb-3.5 text-[0.9375rem] leading-relaxed last:border-0 last:pb-0"
                  >
                    {who}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
