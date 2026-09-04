import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { academy } from "@/lib/content";

/** Native <details>, so it works keyboard-only and without JavaScript. */
export function AcademyFaq() {
  return (
    <section
      id="faqs"
      className="border-line bg-mist relative overflow-hidden border-y py-20 sm:py-24 lg:py-28"
    >
      <div
        className="grid-paper pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(95%_65%_at_50%_0%,#000_20%,transparent_78%)] opacity-50"
        aria-hidden
      />

      <div className="shell-wide">
        <SectionHead
          eyebrow="FAQs"
          title={
            <>
              The questions <em>we actually get.</em>
            </>
          }
        />

        <ul className="mx-auto mt-12 max-w-3xl space-y-3 lg:mt-14">
          {academy.course.faqs.map((faq, i) => (
            <Reveal as="li" key={faq.q} delay={i * 60}>
              <details className="group card overflow-hidden">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-5 p-6 [&::-webkit-details-marker]:hidden">
                  <span className="text-ink text-[1.0625rem] font-semibold">
                    {faq.q}
                  </span>
                  <Plus
                    className="text-ink-faint mt-1 size-5 shrink-0 transition-transform duration-300 group-open:rotate-45"
                    strokeWidth={2}
                    aria-hidden
                  />
                </summary>
                <p className="text-ink-soft px-6 pb-6 text-[0.9375rem] leading-relaxed">
                  {faq.a}
                </p>
              </details>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
