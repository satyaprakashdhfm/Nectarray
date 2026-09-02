import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { academy } from "@/lib/content";

/**
 * `asPage` is set when this section is the body of its own route rather than
 * one of several on the homepage, and promotes its heading to that page's h1.
 * The offset for the fixed header lives on <main>, so the section keeps its
 * own vertical rhythm either way.
 */
export function Academy({ asPage = false }: { asPage?: boolean } = {}) {
  const { course } = academy;

  return (
    <section
      id="academy"
      className="border-line bg-mist relative overflow-hidden border-b py-24 sm:py-28 lg:py-32"
    >
      <div
        className="grid-paper pointer-events-none absolute inset-0 -z-10 opacity-60"
        aria-hidden
      />

      <div className="shell">
        <SectionHead
          as={asPage ? "h1" : "h2"}
          eyebrow={academy.eyebrow}
          title={
            <>
              We teach the stack <em>we ship with.</em>
            </>
          }
          lede={academy.lede}
        />

        {/* Course card ---------------------------------------------------- */}
        <Reveal delay={100}>
          <article className="card mt-14 overflow-hidden lg:mt-16">
            {/* Header band */}
            <div className="border-line-soft bg-night relative overflow-hidden border-b px-7 py-9 text-white sm:px-10 sm:py-11">
              <div
                className="bg-leaf/20 pointer-events-none absolute -top-20 -right-16 size-72 rounded-full blur-[90px]"
                aria-hidden
              />
              <div
                className="bg-brand/20 pointer-events-none absolute -bottom-24 left-1/4 size-72 rounded-full blur-[90px]"
                aria-hidden
              />

              <div className="relative flex flex-wrap items-start justify-between gap-6">
                <div className="max-w-2xl">
                  <span className="bg-leaf/15 text-leaf inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.75rem] font-semibold tracking-[0.12em] uppercase">
                    <Icon name="graduation" className="size-3.5" />
                    {course.badge}
                  </span>

                  <h3 className="display mt-5 text-[2rem] leading-[1.06] sm:text-[2.5rem]">
                    {course.title}
                  </h3>
                  <p className="display-serif mt-4 text-[1.0625rem] leading-relaxed text-white/70 sm:text-[1.125rem]">
                    {course.summary}
                  </p>
                </div>
              </div>

              <dl className="relative mt-9 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/10 pt-7 sm:grid-cols-4">
                {course.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-[0.6875rem] font-semibold tracking-[0.14em] text-white/45 uppercase">
                      {fact.label}
                    </dt>
                    <dd className="mt-2 text-[1.0625rem] font-semibold text-white">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Body */}
            <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
              {/* Modules */}
              <div>
                <h4 className="eyebrow mb-6">Curriculum</h4>
                <ol className="space-y-0">
                  {course.modules.map((module, i) => (
                    <li
                      key={module.n}
                      className={`flex gap-5 py-5 ${
                        i === 0 ? "pt-0" : "border-line-soft border-t"
                      }`}
                    >
                      <span className="from-leaf/20 to-brand/20 text-brand-deep mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br font-mono text-[0.75rem] font-semibold">
                        {module.n}
                      </span>
                      <div>
                        <h5 className="text-ink text-[1rem] font-semibold tracking-tight">
                          {module.title}
                        </h5>
                        <p className="text-ink-soft mt-1.5 text-[0.9rem] leading-relaxed">
                          {module.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Outcomes + audience */}
              <div className="lg:border-line-soft lg:border-l lg:pl-10">
                <h4 className="eyebrow mb-5">What you leave with</h4>
                <ul className="space-y-3">
                  {course.outcomes.map((outcome) => (
                    <li key={outcome} className="flex gap-3">
                      <Check
                        className="text-leaf-deep mt-0.5 size-4 shrink-0"
                        strokeWidth={2.5}
                        aria-hidden
                      />
                      <span className="text-ink-soft text-[0.9rem] leading-relaxed">
                        {outcome}
                      </span>
                    </li>
                  ))}
                </ul>

                <h4 className="eyebrow mt-9 mb-4">Who it is for</h4>
                <ul className="space-y-2.5">
                  {course.forWho.map((who) => (
                    <li
                      key={who}
                      className="bg-mist text-ink-soft rounded-xl px-4 py-3 text-[0.875rem] leading-snug"
                    >
                      {who}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button href={course.cta.href} className="w-full sm:w-auto">
                    {course.cta.label}
                  </Button>
                </div>
              </div>
            </div>
          </article>
        </Reveal>

        <Reveal delay={140}>
          <p className="text-ink-soft mt-8 flex items-center justify-center gap-2.5 text-center text-[0.9375rem]">
            <Icon name="sparkles" className="text-amber-deep size-4 shrink-0" />
            {academy.moreSoon}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
