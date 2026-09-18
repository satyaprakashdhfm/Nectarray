import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { academy } from "@/lib/content";

/**
 * What the programme is and how it runs, in one section under the hero.
 *
 * The argument on the left, and on the right the two things a reader is
 * actually weighing while they read it: what they walk away with, and whether
 * it is meant for them.
 *
 * Both of those used to sit in a band across the foot, under a right-hand
 * column that named the four modules a second time. That column is gone — the
 * syllabus directly below lists the modules properly, and naming them twice
 * on one screen only made the page feel longer than it is.
 */
export function AboutCourse() {
  const { about, outcomes, forWho } = academy.course;

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
              <a
                href="#curriculum"
                className="text-brand-deep hover:text-brand mt-8 inline-flex text-[0.9375rem] font-semibold transition-colors"
              >
                The full syllabus, week by week ↓
              </a>
            </Reveal>
          </div>

          {/* The two questions being weighed while the prose opposite is
              read: what you get out of it, and whether it is aimed at you. */}
          <div className="space-y-5">
            <Reveal delay={120}>
              <div className="border-leaf-wash bg-leaf-wash/50 rounded-2xl border p-7">
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
              <div className="border-line bg-mist rounded-2xl border p-7">
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
      </div>
    </section>
  );
}
