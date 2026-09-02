import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { faqs } from "@/lib/content";

/**
 * Native <details> accordion — keyboard accessible and works without JS.
 * The first item is open by default so the section never reads as empty.
 */
/**
 * `asPage` is set when this section is the body of its own route rather than
 * one of several on the homepage: it promotes the heading to the page's h1
 * and adds the top offset the fixed header needs.
 */
export function Faq({ asPage = false }: { asPage?: boolean } = {}) {
  return (
    <section id="faq" className="py-24 sm:py-28 lg:py-32">
      <div className="shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <SectionHead
          as={asPage ? "h1" : "h2"}
          eyebrow="Questions"
          title={
            <>
              Before you <em>get in touch.</em>
            </>
          }
          lede="If something here is not covered, ask us directly — we would rather answer than have you guess."
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <div>
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 60}>
              <details
                name="faq"
                open={i === 0}
                className="group border-line border-b py-1 first:border-t"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-ink group-hover:text-brand-deep text-[1.0625rem] font-semibold tracking-tight transition-colors sm:text-[1.125rem]">
                    {faq.q}
                  </h3>
                  <span
                    className="border-line bg-surface text-ink-soft group-open:border-brand group-open:bg-brand mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border transition-all duration-300 group-open:rotate-45 group-open:text-white"
                    aria-hidden
                  >
                    <Plus className="size-4" strokeWidth={2.25} />
                  </span>
                </summary>
                <p className="text-ink-soft max-w-2xl pr-12 pb-6 text-[0.9375rem] leading-relaxed">
                  {faq.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
