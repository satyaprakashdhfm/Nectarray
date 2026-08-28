import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { work } from "@/lib/content";

const statusTone: Record<string, string> = {
  Live: "bg-leaf-wash text-leaf-deep",
  "In build": "bg-brand-wash text-brand-deep",
  Enrolling: "bg-amber-wash text-amber-deep",
};

export function Work() {
  return (
    <section
      id="work"
      className="border-line bg-mist relative scroll-mt-24 overflow-hidden border-y py-24 sm:py-28 lg:py-32"
    >
      <div
        className="grid-paper pointer-events-none absolute inset-0 -z-10 opacity-60"
        aria-hidden
      />

      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHead
            eyebrow={work.eyebrow}
            title={
              <>
                What we are <em>building.</em>
              </>
            }
            lede={work.lede}
          />
          <Reveal delay={150}>
            <div className="hidden lg:block">
              <Button href={work.cta.href} variant="secondary">
                {work.cta.label}
              </Button>
            </div>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16">
          {work.items.map((item, i) => (
            <Reveal as="li" key={item.title} delay={(i % 2) * 90}>
              <article className="card card-hover flex h-full flex-col p-7 sm:p-8">
                <div className="flex items-center justify-between gap-3">
                  <span className="eyebrow">{item.tag}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[0.75rem] font-semibold ${
                      statusTone[item.status] ?? "bg-mist text-ink-soft"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="display mt-5 text-[1.375rem] sm:text-[1.5rem]">
                  {item.title}
                </h3>
                <p className="text-ink-soft mt-3 text-[0.9375rem] leading-relaxed">
                  {item.body}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>

        <div className="mt-10 lg:hidden">
          <Button href={work.cta.href} variant="secondary" className="w-full">
            {work.cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
