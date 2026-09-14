import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { software } from "@/lib/content";

const { hero } = software;

/**
 * The page's opening, built to the pattern /marketing and /agentic-ai use:
 * copy on the left, the artwork in a badged panel on the right with the
 * numbers closing it.
 *
 * This route used to start straight into the catalogue with its heading
 * promoted to h1, which meant the one page selling the thing we build had no
 * opening argument at all — a reader landed in a grid of category cards and
 * had to infer the offer from them.
 *
 * The panel rather than a bare picture, for the reason it was done on
 * /marketing: a 16:9 image is much shorter than the copy beside it and floats
 * in its column with dead air above and below. Badged, captioned and footed
 * with the figures, it fills its side.
 */
export function SoftwareHero() {
  return (
    <section className="relative overflow-hidden pt-[var(--header-room)]">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="from-brand-wash via-canvas to-mist absolute inset-0 bg-gradient-to-br" />
        <div className="grid-paper absolute inset-0 [mask-image:radial-gradient(120%_80%_at_50%_0%,#000_30%,transparent_78%)]" />
        <div className="bg-brand/20 absolute -top-24 -left-32 size-[34rem] rounded-full blur-[140px]" />
        <div className="bg-brand/14 absolute top-20 -right-28 size-[30rem] rounded-full blur-[140px]" />
      </div>

      <div className="shell-wide relative pt-10 pb-16 sm:pt-14 sm:pb-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-14">
          <div>
            <Reveal>
              <p className="eyebrow flex items-center gap-2.5">
                <span className="bg-brand h-px w-6" aria-hidden />
                {hero.eyebrow}
              </p>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="display text-ink mt-6 text-[2.5rem] leading-[1.02] sm:text-[3.4rem] lg:text-[4rem]">
                {hero.headline[0]}
                <br />
                <span className="ink-gradient">{hero.headline[1]}</span>
              </h1>
            </Reveal>

            <Reveal delay={150}>
              <p className="lede mt-6 max-w-xl">{hero.lede}</p>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href={hero.primaryCta.href}
                  className="bg-ink text-cta-fg hover:bg-brand-deep rounded-full px-6 py-3.5 text-[0.9375rem] font-semibold transition-colors"
                >
                  {hero.primaryCta.label}
                </a>
                <a
                  href={hero.secondaryCta.href}
                  className="border-line bg-canvas text-ink hover:border-brand hover:text-brand-deep rounded-full border px-6 py-3.5 text-[0.9375rem] font-semibold transition-colors"
                >
                  {hero.secondaryCta.label}
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={150}>
            <div className="relative">
              <div
                className="from-brand/25 to-teal/20 absolute -inset-6 -z-10 rounded-full bg-gradient-to-br blur-3xl"
                aria-hidden
              />
              <article className="border-night-line bg-night relative overflow-hidden rounded-[1.75rem] border text-white shadow-[0_30px_70px_-30px_rgba(11,23,32,0.55)]">
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src="/hero/software-hero.jpg"
                    alt=""
                    aria-hidden
                    fill
                    sizes="(min-width: 1024px) 46vw, 92vw"
                    loading="eager"
                    className="object-cover"
                  />
                  {/* Scrim, so the badge and the line over it hold their
                      contrast whatever the artwork is doing underneath. */}
                  <div
                    className="from-night/95 via-night/40 absolute inset-0 bg-gradient-to-t to-transparent"
                    aria-hidden
                  />

                  <span className="bg-night/70 text-brand ring-brand/30 absolute top-5 left-5 inline-flex items-center rounded-full px-3 py-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase ring-1 backdrop-blur">
                    {hero.panel.badge}
                  </span>

                  <p className="display absolute bottom-5 left-5 text-[1.375rem] leading-tight sm:text-[1.625rem]">
                    <span className="text-brand">{hero.panel.lines[0]}</span>
                    <br />
                    {hero.panel.lines[1]}
                  </p>
                </div>

                <dl className="border-night-line grid grid-cols-3 gap-x-5 gap-y-4 border-t p-6 sm:p-7">
                  {hero.stats.map((stat) => (
                    <div key={stat.label}>
                      <dt className="sr-only">{stat.label}</dt>
                      <dd>
                        <span className="display block text-[1.5rem] leading-none text-white sm:text-[1.75rem]">
                          {stat.value}
                        </span>
                        <span className="mt-2 block text-[0.75rem] leading-snug text-white/55">
                          {stat.label}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
