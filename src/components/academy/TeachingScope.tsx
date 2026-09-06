import { Reveal } from "@/components/ui/Reveal";
import { academy } from "@/lib/content";

const { curriculum } = academy.course;

/**
 * What the programme actually teaches, at the top of the page.
 *
 * The scope was only discoverable by opening the curriculum accordion
 * further down, so a visitor deciding whether this is for them had to go
 * looking for the one thing they came to find out.
 *
 * Built from `curriculum` rather than from its own list of subjects. A
 * hand-written scope strip is a second copy of the syllabus that starts
 * agreeing with it and stops later, quietly, once a module is renamed — and
 * the place that drifts is the one a buyer reads first. Rename a module and
 * this follows.
 *
 * No day counts here. The order and the substance are what a reader is
 * deciding on; the schedule is in the curriculum for anyone who wants it.
 */
export function TeachingScope() {
  return (
    <section
      id="scope"
      className="border-line bg-mist scroll-mt-[125px] border-b py-14 sm:py-16"
    >
      <div className="shell-wide">
        <Reveal>
          <p className="eyebrow flex items-center gap-2.5">
            <span className="bg-brand h-px w-6" aria-hidden />
            What you will learn
          </p>
        </Reveal>

        <ol className="mt-7 grid gap-4 md:grid-cols-3">
          {curriculum.map((module, i) => (
            <Reveal as="li" key={module.n} delay={i * 80}>
              <article className="card h-full p-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-brand-deep font-mono text-[0.8125rem] font-semibold">
                    {module.n}
                  </span>
                  <h3 className="text-ink text-[1.0625rem] font-semibold tracking-tight">
                    {module.title}
                  </h3>
                </div>
                <p className="text-ink-soft mt-2.5 text-[0.875rem] leading-[1.6]">
                  {module.summary}
                </p>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
