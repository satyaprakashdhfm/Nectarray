import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { placements } from "@/lib/content";

/**
 * Placement and career support.
 *
 * Sits directly after the curriculum, which is the order the decision is
 * made in: a career-change buyer reads what is taught, then asks what
 * happens at the end of it. On the navy ground the academy uses for the
 * things it wants read rather than skimmed.
 *
 * No company logos and no placement percentage. Hiring partners are named
 * on a page like this only once there is a signed relationship to point at,
 * and a placement rate is a claim a prospective student is entitled to see
 * evidence for.
 */
export function Placements() {
  return (
    <section
      id="placements"
      className="border-night-line bg-night scroll-mt-[125px] border-y py-20 text-white sm:py-24"
    >
      <div className="shell-wide">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="flex items-center gap-2.5 text-[0.75rem] font-semibold tracking-[0.16em] text-white/55 uppercase">
                <span className="bg-leaf h-px w-6" aria-hidden />
                {placements.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="display mt-5 text-[2rem] text-white sm:text-[2.5rem]">
                {placements.title}
              </h2>
            </Reveal>
            <Reveal delay={130}>
              <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-white/70">
                {placements.lede}
              </p>
            </Reveal>
          </div>

          <div>
            <Reveal delay={100}>
              <p className="text-leaf text-[0.75rem] font-semibold tracking-[0.16em] uppercase">
                Placement support includes
              </p>
            </Reveal>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {placements.includes.map((item, i) => (
                <Reveal as="li" key={item.title} delay={140 + i * 70}>
                  <article className="border-night-line bg-night-soft h-full rounded-2xl border p-5">
                    <span className="bg-leaf/15 text-leaf grid size-9 place-items-center rounded-lg">
                      <Check className="size-4" strokeWidth={2.5} aria-hidden />
                    </span>
                    <h3 className="mt-4 text-[0.9375rem] font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[0.8125rem] leading-[1.55] text-white/70">
                      {item.body}
                    </p>
                  </article>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
