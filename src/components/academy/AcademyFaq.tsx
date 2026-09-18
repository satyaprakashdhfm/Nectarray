import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { academy } from "@/lib/content";

/**
 * Native <details>, so it works keyboard-only and without JavaScript.
 *
 * Two columns from `lg`, as two independent lists rather than one grid. In a
 * grid the eight share rows, so opening a long answer in the left column
 * stretches the card beside it to match and leaves it half empty. Split into
 * halves, each column flows on its own and only the items under the one you
 * opened move. It also means the order reads down a column and then across,
 * which is the way a two-up FAQ is read.
 */
export function AcademyFaq() {
  const { faqs } = academy.course;
  const half = Math.ceil(faqs.length / 2);
  const columns = [faqs.slice(0, half), faqs.slice(half)];

  return (
    <section
      id="faqs"
      className="border-line bg-mist relative overflow-hidden border-y py-16 sm:py-20"
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

        <div className="mx-auto mt-12 grid max-w-6xl gap-3 lg:mt-14 lg:grid-cols-2 lg:gap-x-5">
          {columns.map((column, c) => (
            <ul key={c} className="space-y-3">
              {column.map((faq, i) => (
                <Reveal as="li" key={faq.q} delay={(c * half + i) * 60}>
                  <details className="group card overflow-hidden">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-5 p-6 [&::-webkit-details-marker]:hidden">
                      <span className="text-ink text-[1.0625rem] font-semibold">
                        {faq.q}
                      </span>
                      <Plus
                        className="text-ink-faint group-open:text-brand-deep mt-1 size-5 shrink-0 transition-transform duration-300 group-open:rotate-45"
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
          ))}
        </div>
      </div>
    </section>
  );
}
