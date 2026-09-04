import { Download } from "lucide-react";
import { EnrolButton } from "@/components/auth/EnrolButton";
import {
  LoopArrow,
  PlusPair,
  Sparkle,
  Squiggle,
} from "@/components/academy/Doodles";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { academy } from "@/lib/content";

/** Stand-ins for the faces of a cohort we are not going to photograph. */
const initials = ["A", "R", "S", "K"];

/**
 * The top of the academy page.
 *
 * Warm, roomy, and built around one sentence and two buttons — the two
 * things a visitor arriving from an ad is deciding between: read what is in
 * it, or apply. Everything else on the page is downstream of that choice.
 *
 * No price. The programme is quoted after the conversation, so a number here
 * would be one more thing to keep in sync with reality.
 */
export function AcademyHero() {
  const { course } = academy;

  return (
    <section className="relative overflow-hidden">
      {/* Decoration ---------------------------------------------------- */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="bg-amber/12 absolute -top-40 -right-24 size-[34rem] rounded-full blur-[130px]" />
        <div className="bg-brand/10 absolute -bottom-40 -left-32 size-[30rem] rounded-full blur-[130px]" />
      </div>

      <div className="shell relative py-14 sm:py-20 lg:py-24">
        <Sparkle className="text-amber absolute top-10 left-[46%] size-6 sm:size-7" />
        <PlusPair className="text-amber absolute top-24 right-[8%] hidden w-11 lg:block" />
        <PlusPair className="text-brand absolute right-[3%] bottom-24 hidden w-10 lg:block" />
        <Squiggle className="text-amber absolute bottom-10 left-[38%] hidden w-24 lg:block" />

        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          {/* Left ------------------------------------------------------- */}
          <div className="relative">
            <Reveal>
              <span className="bg-leaf-wash text-leaf-deep inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.8125rem] font-semibold">
                <span className="relative flex size-2">
                  <span className="bg-leaf absolute inline-flex size-full animate-ping rounded-full opacity-70" />
                  <span className="bg-leaf-deep relative inline-flex size-2 rounded-full" />
                </span>
                {course.tag}
              </span>
            </Reveal>

            <Reveal delay={70}>
              <h1 className="display mt-6 text-[2.5rem] leading-[1.02] sm:text-[3.25rem] lg:text-[3.75rem]">
                Welcome to
                <br />
                NectArray <span className="text-amber-deep">Academy</span>
              </h1>
            </Reveal>

            <Reveal delay={130}>
              <div className="relative mt-6 max-w-xl">
                <p className="text-amber-deep text-[1.25rem] leading-[1.4] font-semibold sm:text-[1.4375rem]">
                  Python, SQL and data science — taught live, in a group small
                  enough that we read every line you write.
                </p>
                <LoopArrow className="text-amber absolute top-1 -right-40 hidden w-40 xl:block" />
              </div>
            </Reveal>

            <Reveal delay={180}>
              <p className="lede mt-5 max-w-xl">{course.summary}</p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <EnrolButton
                  label={course.cta.label}
                  signedInLabel="Go to your dashboard"
                  className="bg-amber-deep inline-flex items-center gap-2 rounded-full px-7 py-4 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#b96a12]"
                />

                <a
                  href="#curriculum"
                  className="border-line bg-surface text-ink hover:border-ink inline-flex items-center gap-2 rounded-full border px-7 py-4 text-[0.9375rem] font-semibold transition-colors"
                >
                  Explore the course
                </a>

                <a
                  href={course.curriculumPdf}
                  download
                  className="text-ink-soft hover:text-ink inline-flex items-center gap-2 px-2 py-4 text-[0.9375rem] font-semibold transition-colors"
                >
                  <Download className="size-4" strokeWidth={2} aria-hidden />
                  Curriculum PDF
                </a>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-9 flex items-center gap-4">
                <div className="flex -space-x-2.5" aria-hidden>
                  {initials.map((letter, i) => (
                    <span
                      key={letter}
                      className={`border-surface from-brand/30 to-leaf/30 text-ink grid size-10 place-items-center rounded-full border-2 bg-gradient-to-br text-[0.875rem] font-bold ${
                        i % 2 ? "to-amber/35" : ""
                      }`}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                <p className="text-ink-soft text-[0.9375rem]">
                  <span className="text-ink font-semibold">Small batches</span>{" "}
                  — every submission read individually.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right — the facts card ------------------------------------- */}
          <Reveal delay={150}>
            <div className="relative">
              <div
                className="from-amber/25 to-brand/20 absolute -inset-6 -z-10 rounded-full bg-gradient-to-br blur-3xl"
                aria-hidden
              />
              <article className="border-night-line bg-night relative overflow-hidden rounded-[1.75rem] border p-8 text-white shadow-[0_30px_70px_-30px_rgba(11,23,32,0.55)] sm:p-10">
                <div
                  className="pointer-events-none absolute inset-0"
                  aria-hidden
                >
                  <div className="bg-amber/20 absolute -top-24 -right-16 size-72 rounded-full blur-[90px]" />
                  <div className="bg-brand/25 absolute -bottom-28 -left-16 size-72 rounded-full blur-[90px]" />
                </div>

                <div className="relative">
                  <span className="bg-amber/15 text-amber inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
                    <Icon name="graduation" className="size-3.5" />
                    {course.badge}
                  </span>

                  <p className="display mt-6 text-[1.75rem] leading-tight">
                    45 days.
                    <br />
                    <span className="text-amber">Three modules.</span>
                    <br />
                    One small group.
                  </p>

                  <dl className="border-night-line mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t pt-8">
                    {course.facts.map((fact) => (
                      <div key={fact.label}>
                        <dt className="text-[0.6875rem] font-semibold tracking-[0.14em] text-white/40 uppercase">
                          {fact.label}
                        </dt>
                        <dd className="mt-1.5 text-[1.0625rem] font-semibold">
                          {fact.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
