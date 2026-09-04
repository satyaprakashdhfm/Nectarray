import { Quote } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { testimonials } from "@/lib/content";

/**
 * NOTE: the quotes in lib/content.ts are written as placeholders with
 * "Client name" / "Student name" attributions. Replace them with real,
 * attributable quotes before launch — or delete this section from
 * app/page.tsx until you have them.
 */
const tilts = ["lg:-rotate-1", "", "lg:rotate-1"];

export function Testimonials() {
  return (
    <section className="py-24 sm:py-28 lg:py-32">
      <div className="shell-wide">
        <SectionHead
          align="center"
          eyebrow="In their words"
          title={
            <>
              What working with us <em>feels like.</em>
            </>
          }
        />

        <ul className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <Reveal as="li" key={testimonial.quote} delay={i * 90}>
              <figure
                className={`card card-hover flex h-full flex-col p-7 sm:p-8 ${tilts[i]} hover:rotate-0`}
              >
                <Quote
                  className="fill-brand-wash text-brand-wash size-7 shrink-0"
                  aria-hidden
                />
                <blockquote className="display-serif text-ink mt-5 flex-1 text-[1.0625rem] leading-relaxed sm:text-[1.125rem]">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="border-line-soft mt-7 flex items-center gap-3 border-t pt-5">
                  <span
                    className="from-leaf/25 to-brand/25 text-brand-deep grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br text-[0.8125rem] font-bold"
                    aria-hidden
                  >
                    {testimonial.name.charAt(0)}
                  </span>
                  <span>
                    <span className="text-ink block text-[0.9375rem] font-semibold">
                      {testimonial.name}
                    </span>
                    <span className="text-ink-faint block text-[0.8125rem]">
                      {testimonial.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
