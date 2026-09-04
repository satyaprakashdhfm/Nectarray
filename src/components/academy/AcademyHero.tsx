import { EnrolButton } from "@/components/auth/EnrolButton";
import { PlusPair, Sparkle, Squiggle } from "@/components/academy/Doodles";
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
        <div className="from-brand-wash via-canvas to-leaf-wash absolute inset-0 bg-gradient-to-br" />
        <div className="grid-paper absolute inset-0 [mask-image:radial-gradient(120%_80%_at_50%_10%,#000_35%,transparent_80%)]" />
        <div className="bg-brand/20 absolute -top-32 -left-32 size-[30rem] rounded-full blur-[120px]" />
        <div className="bg-leaf/22 absolute -right-24 bottom-0 size-[26rem] rounded-full blur-[120px]" />
      </div>

      <div className="shell relative py-14 sm:py-20 lg:py-24">
        <Sparkle className="text-leaf absolute top-10 left-[46%] size-6 sm:size-7" />
        <PlusPair className="text-brand/70 absolute top-24 right-[8%] hidden w-11 lg:block" />
        <PlusPair className="text-leaf/80 absolute right-[3%] bottom-24 hidden w-10 lg:block" />
        <Squiggle className="text-brand/60 absolute bottom-10 left-[38%] hidden w-24 lg:block" />

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
                NectArray <span className="ink-gradient">Academy</span>
              </h1>
            </Reveal>

            <Reveal delay={130}>
              <p className="text-brand-deep mt-6 max-w-xl text-[1.25rem] leading-[1.4] font-semibold sm:text-[1.4375rem]">
                Python, SQL and data science — taught live, in a group small
                enough that we read every line you write.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <p className="lede mt-5 max-w-xl">{course.summary}</p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-9">
                <EnrolButton
                  label={course.cta.label}
                  signedInLabel="Go to your dashboard"
                  className="group bg-ink hover:bg-brand-deep inline-flex items-center gap-2 rounded-full px-8 py-4 text-[1rem] font-semibold text-white transition-colors"
                />
                <p className="text-ink-faint mt-4 text-[0.875rem]">
                  Sign in, and the dashboard opens with your notes, the practice
                  and your progress in it.
                </p>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-9 flex items-center gap-4">
                <div className="flex -space-x-2.5" aria-hidden>
                  {initials.map((letter, i) => (
                    <span
                      key={letter}
                      className={`border-surface from-brand/30 to-leaf/30 text-ink grid size-10 place-items-center rounded-full border-2 bg-gradient-to-br text-[0.875rem] font-bold ${
                        i % 2 ? "to-leaf/40" : ""
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
                  <div className="bg-leaf/20 absolute -top-24 -right-16 size-72 rounded-full blur-[90px]" />
                  <div className="bg-brand/25 absolute -bottom-28 -left-16 size-72 rounded-full blur-[90px]" />
                </div>

                <div className="relative">
                  <span className="bg-leaf/15 text-leaf inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
                    <Icon name="graduation" className="size-3.5" />
                    {course.badge}
                  </span>

                  <p className="display mt-6 text-[1.75rem] leading-tight">
                    <span className="text-leaf">Taught live.</span>
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
