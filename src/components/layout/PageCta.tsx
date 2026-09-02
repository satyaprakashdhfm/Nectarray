import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { company } from "@/lib/content";

/**
 * The closing band every page ends on. Each route is now its own page, so
 * the contact form is no longer a scroll away — this is what carries the
 * reader to /contact from wherever they finished reading.
 */
export function PageCta({
  title = "Tell us what you are building.",
  body = "A short note is enough to start. We reply to every enquiry within one business day — usually with questions, sometimes with a straight answer that you do not need us.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="border-line bg-mist relative overflow-hidden border-t py-20 sm:py-24">
      <div
        className="grid-paper pointer-events-none absolute inset-0 -z-10 opacity-60"
        aria-hidden
      />

      <div className="shell text-center">
        <Reveal>
          <h2 className="display mx-auto max-w-3xl text-[2rem] sm:text-[2.6rem]">
            {title}
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <p className="lede mx-auto mt-5 max-w-2xl">{body}</p>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="group bg-ink hover:bg-brand-deep inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[0.9375rem] font-semibold text-white transition-colors"
            >
              Start a project
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2.25}
                aria-hidden
              />
            </Link>
            <a
              href={`mailto:${company.email}`}
              className="border-line bg-surface text-ink hover:border-brand hover:text-brand-deep inline-flex items-center rounded-full border px-6 py-3.5 text-[0.9375rem] font-semibold transition-colors"
            >
              {company.email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
