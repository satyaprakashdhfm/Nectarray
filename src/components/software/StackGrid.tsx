import { BrandLogo } from "@/components/software/BrandLogo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { software } from "@/lib/content";

const { stack } = software;

/**
 * The stack, by logo, and then the cloud services underneath it.
 *
 * Two levels on purpose. The logo rows answer "do you know my platform"; the
 * chip lists answer "have you actually run this in production", which is a
 * different question and the one a technical buyer asks second. AWS is a
 * logo; EC2, RDS, SQS and Bedrock are the answer.
 */
export function StackGrid() {
  return (
    <section id="stack" className="py-24 sm:py-28">
      <div className="shell">
        <SectionHead
          eyebrow={stack.eyebrow}
          title={
            <>
              We are not married to a stack. <em>We are fluent across it.</em>
            </>
          }
          lede={stack.lede}
        />

        <div className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-2">
          {stack.groups.map((group, i) => (
            <Reveal key={group.label} delay={(i % 2) * 70}>
              <div className="card h-full p-6 sm:p-7">
                <h3 className="eyebrow">{group.label}</h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.brands.map((brand) => (
                    <li
                      key={brand.name}
                      className="border-line bg-canvas flex items-center gap-2 rounded-lg border px-2.5 py-1.5"
                    >
                      <BrandLogo
                        name={brand.name}
                        domain={brand.domain}
                        className="size-4"
                      />
                      <span className="text-ink-soft text-[0.8125rem] font-medium whitespace-nowrap">
                        {brand.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Cloud, service by service ----------------------------------- */}
        <Reveal delay={100}>
          <div className="border-night-line bg-night relative mt-5 overflow-hidden rounded-2xl border p-8 text-white sm:p-10">
            <div
              className="bg-brand/20 pointer-events-none absolute -top-32 -right-24 size-80 rounded-full blur-[110px]"
              aria-hidden
            />
            <div className="relative">
              <h3 className="display text-[1.625rem] sm:text-[1.875rem]">
                {stack.clouds.title}
              </h3>
              <p className="mt-4 max-w-3xl text-[0.9375rem] leading-relaxed text-white/65">
                {stack.clouds.body}
              </p>

              <dl className="mt-9 grid gap-8 lg:grid-cols-3">
                {stack.clouds.groups.map((group) => (
                  <div key={group.label}>
                    <dt className="text-leaf text-[0.75rem] font-semibold tracking-[0.16em] uppercase">
                      {group.label}
                    </dt>
                    <dd className="mt-4">
                      <ul className="flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="border-night-line bg-night-soft rounded-lg border px-2.5 py-1.5 font-mono text-[0.75rem] text-white/70"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
