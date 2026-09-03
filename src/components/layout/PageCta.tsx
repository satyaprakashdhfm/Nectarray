import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { company } from "@/lib/content";

/**
 * The closing band every page ends on. Each route is now its own page, so
 * the contact form is no longer a scroll away — this is what carries the
 * reader to /contact from wherever they finished reading.
 *
 * It is the one full-colour surface on the site: the page runs light, the
 * footer runs night, and this sits between them as the moment the brand
 * gradient stops being an accent and becomes the whole ground.
 */
export function PageCta({
  title = "Tell us what you are building.",
  body = "A short note is enough to start. We reply to every enquiry within one business day — usually with questions, sometimes with a straight answer that you do not need us.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="brand-band relative overflow-hidden py-20 text-white sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] [mask-image:radial-gradient(110%_75%_at_50%_0%,#000_25%,transparent_80%)] [background-size:46px_46px]" />
        <div className="absolute -top-32 -right-24 size-[30rem] rounded-full bg-white/10 blur-[120px]" />
      </div>

      <div className="shell text-center">
        <Reveal>
          <h2 className="display mx-auto max-w-3xl text-[2rem] sm:text-[2.6rem]">
            {title}
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <p className="mx-auto mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-white/85 md:text-[1.1875rem]">
            {body}
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="group text-ink hover:bg-night inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[0.9375rem] font-semibold transition-colors hover:text-white"
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
              className="inline-flex items-center rounded-full border border-white/35 px-6 py-3.5 text-[0.9375rem] font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              {company.email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
