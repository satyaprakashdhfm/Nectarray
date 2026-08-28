import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { process } from "@/lib/content";

export function Process() {
  return (
    <section id="process" className="scroll-mt-24 py-24 sm:py-28 lg:py-32">
      <div className="shell">
        <SectionHead
          eyebrow={process.eyebrow}
          title={
            <>
              Four steps, <em>no mystery.</em>
            </>
          }
          lede={process.lede}
        />

        <ol className="relative mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {/* connector rail on wide screens */}
          <span
            className="from-leaf/40 via-brand/40 pointer-events-none absolute inset-x-0 top-[3.25rem] hidden h-px bg-gradient-to-r to-transparent lg:block"
            aria-hidden
          />

          {process.steps.map((step, i) => (
            <Reveal as="li" key={step.n} delay={i * 90}>
              <div className="card card-hover relative h-full p-7">
                <span className="bg-ink relative z-10 grid size-9 place-items-center rounded-full font-mono text-[0.75rem] font-semibold text-white">
                  {step.n}
                </span>
                <h3 className="text-ink mt-6 text-[1.125rem] font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="text-ink-soft mt-3 text-[0.9rem] leading-relaxed">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
