import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { pricing } from "@/lib/content";

export function Pricing() {
  return (
    <section
      id="pricing"
      className="border-line bg-mist relative overflow-hidden border-y py-24 sm:py-28 lg:py-32"
    >
      <div
        className="grid-paper pointer-events-none absolute inset-0 -z-10 opacity-60"
        aria-hidden
      />

      <div className="shell">
        <SectionHead
          align="center"
          eyebrow={pricing.eyebrow}
          title={
            <>
              Three ways to <em>work with us.</em>
            </>
          }
          lede={pricing.lede}
        />

        <ul className="mt-14 grid items-start gap-5 lg:mt-16 lg:grid-cols-3">
          {pricing.plans.map((plan, i) => (
            <Reveal as="li" key={plan.name} delay={i * 90}>
              <article
                className={`relative flex h-full flex-col overflow-hidden rounded-[1.25rem] p-8 ${
                  plan.featured
                    ? "border-night-line bg-night border text-white shadow-[0_24px_60px_-24px_rgba(11,23,32,0.55)] lg:-mt-4 lg:pt-11 lg:pb-11"
                    : "card"
                }`}
              >
                {plan.featured && (
                  <>
                    <div
                      className="bg-brand/25 pointer-events-none absolute -top-24 -right-20 size-64 rounded-full blur-[90px]"
                      aria-hidden
                    />
                    <span className="bg-leaf/15 text-leaf relative mb-5 inline-flex w-fit items-center rounded-full px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
                      Most chosen
                    </span>
                  </>
                )}

                {/* Carries the top of the card now that no price sits below it */}
                <h3
                  className={`display relative text-[1.75rem] ${
                    plan.featured ? "text-white" : "text-ink"
                  }`}
                >
                  {plan.name}
                </h3>

                <p
                  className={`relative mt-3 text-[1.0625rem] leading-relaxed ${
                    plan.featured ? "text-white/75" : "text-ink-soft"
                  }`}
                >
                  {plan.body}
                </p>

                <ul
                  className={`relative mt-7 flex-1 space-y-3 border-t pt-7 ${
                    plan.featured ? "border-white/10" : "border-line-soft"
                  }`}
                >
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <Check
                        className={`mt-0.5 size-4 shrink-0 ${
                          plan.featured ? "text-leaf" : "text-leaf-deep"
                        }`}
                        strokeWidth={2.5}
                        aria-hidden
                      />
                      <span
                        className={`text-[0.9rem] leading-relaxed ${
                          plan.featured ? "text-white/80" : "text-ink-soft"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="relative mt-8">
                  <Button
                    href="#contact"
                    variant={plan.featured ? "onDark" : "secondary"}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={140}>
          <p className="text-ink-soft mx-auto mt-10 max-w-2xl text-center text-[0.9375rem] leading-relaxed">
            {pricing.footnote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
