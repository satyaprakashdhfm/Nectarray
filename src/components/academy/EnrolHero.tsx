import Link from "next/link";
import { Download } from "lucide-react";
import { EnrolButton } from "@/components/auth/EnrolButton";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { academy } from "@/lib/content";

/**
 * The top of the course page: breadcrumb, title, what it is, and the two
 * things a visitor can do — apply, or take the curriculum away and read it.
 *
 * No price is shown. The programme is quoted after the conversation, so a
 * number here would be one more thing to keep in sync with reality.
 */
export function EnrolHero() {
  const { course } = academy;

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="from-brand-wash via-canvas to-leaf-wash absolute inset-0 bg-gradient-to-br" />
        <div className="grid-paper absolute inset-0 [mask-image:radial-gradient(120%_80%_at_50%_10%,#000_35%,transparent_80%)]" />
        <div className="bg-brand/22 absolute -top-32 -left-32 size-[30rem] rounded-full blur-[120px]" />
        <div className="bg-leaf/25 absolute -right-24 bottom-0 size-[26rem] rounded-full blur-[120px]" />
      </div>

      <div className="shell py-12 sm:py-16 lg:py-20">
        {/* Breadcrumb ---------------------------------------------------- */}
        <nav aria-label="Breadcrumb">
          <ol className="text-ink-faint flex flex-wrap items-center gap-2 text-[0.8125rem]">
            {course.breadcrumb.map((crumb, i) => {
              const last = i === course.breadcrumb.length - 1;
              return (
                <li key={crumb.label} className="flex items-center gap-2">
                  {last ? (
                    <span
                      className="text-ink font-semibold"
                      aria-current="page"
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <>
                      <Link
                        href={crumb.href}
                        className="hover:text-brand-deep transition-colors"
                      >
                        {crumb.label}
                      </Link>
                      <span aria-hidden>›</span>
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          {/* Left ------------------------------------------------------- */}
          <div>
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
              <h1 className="display mt-6 text-[2.4rem] leading-[1.03] sm:text-[3rem] lg:text-[3.5rem]">
                Python, SQL &{" "}
                <span className="ink-gradient">Data Science.</span>
              </h1>
            </Reveal>

            <Reveal delay={130}>
              <p className="lede mt-6 max-w-xl">{course.summary}</p>
            </Reveal>

            <Reveal delay={190}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <EnrolButton
                  label={course.cta.label}
                  className="group bg-ink hover:bg-brand-deep inline-flex items-center gap-2 rounded-full px-7 py-4 text-[0.9375rem] font-semibold text-white transition-colors"
                />

                <a
                  href={course.curriculumPdf}
                  download
                  className="border-line bg-surface text-ink hover:border-brand hover:text-brand-deep inline-flex items-center gap-2.5 rounded-full border px-6 py-4 text-[0.9375rem] font-semibold transition-colors"
                >
                  <Download className="size-4" strokeWidth={2} aria-hidden />
                  Download curriculum
                </a>
              </div>
            </Reveal>

            <Reveal delay={250}>
              <p className="text-ink-faint mt-5 text-[0.875rem]">
                Five seats per cohort. Applications are read in the order they
                arrive.
              </p>
            </Reveal>
          </div>

          {/* Right — the course card ------------------------------------ */}
          <Reveal delay={150}>
            <article className="border-night-line bg-night relative overflow-hidden rounded-[1.5rem] border p-8 text-white shadow-[0_30px_70px_-30px_rgba(11,23,32,0.6)] sm:p-10">
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                <div className="bg-leaf/20 absolute -top-24 -right-16 size-72 rounded-full blur-[90px]" />
                <div className="bg-brand/25 absolute -bottom-28 -left-16 size-72 rounded-full blur-[90px]" />
              </div>

              <div className="relative">
                <span className="bg-leaf/15 text-leaf inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
                  <Icon name="graduation" className="size-3.5" />
                  {course.badge}
                </span>

                <p className="display mt-6 text-[1.75rem] leading-tight">
                  45 days.
                  <br />
                  <span className="text-leaf">Three modules.</span>
                  <br />
                  Five people.
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
          </Reveal>
        </div>
      </div>
    </section>
  );
}
