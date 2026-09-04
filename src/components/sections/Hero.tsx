import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { hero, pillars } from "@/lib/content";

/**
 * Alternating tilt for the stacked practice cards.
 *
 * The stack is top-aligned rather than centred, and the cards are tighter
 * than they were, so all four sit above the fold on a laptop. That matters
 * for more than tidiness: each card is a `Reveal`, so the staggered rise
 * only plays on first paint if they are already on screen. Centred against
 * the taller copy column they started below it, and the animation was
 * something you had to scroll down to trigger.
 */
const tilts = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

/**
 * One accent per practice, in wordmark order: amber, blue, green, teal.
 *
 * The chips are the *deep* tones because they carry a white glyph — the
 * display tones only reach ~2.5:1 against white. The card tint is the
 * matching wash, so each card has a colour identity at rest rather than
 * only on hover.
 */
const accents = [
  { chip: "bg-amber-deep", tint: "from-amber-wash" },
  { chip: "bg-brand-deep", tint: "from-brand-wash" },
  { chip: "bg-leaf-deep", tint: "from-leaf-wash" },
  { chip: "bg-teal-deep", tint: "from-teal-wash" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-[72px]">
      {/* Ground: a tinted wash, graph paper, and four brand glows ---------- */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="from-brand-wash via-canvas to-leaf-wash absolute inset-0 bg-gradient-to-br" />
        <div className="grid-paper absolute inset-0 [mask-image:radial-gradient(120%_80%_at_50%_20%,#000_35%,transparent_78%)]" />
        <div className="bg-brand/25 absolute -top-24 -left-40 size-[34rem] rounded-full blur-[120px]" />
        <div className="bg-leaf/30 absolute top-32 -right-32 size-[30rem] rounded-full blur-[120px]" />
        <div className="bg-amber/25 absolute -top-16 left-1/3 size-[24rem] rounded-full blur-[110px]" />
        <div className="bg-teal/20 absolute bottom-0 left-1/4 size-[26rem] rounded-full blur-[120px]" />
      </div>

      <div className="shell-wide grid gap-10 pt-8 pb-16 sm:pt-10 sm:pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-12 lg:pt-12 lg:pb-24">
        {/* ---------------------------------------------------------------- */}
        <div>
          <Reveal>
            <h1 className="display text-[2.6rem] leading-[1.02] sm:text-[3.4rem] lg:text-[4rem] xl:text-[4.4rem]">
              {hero.headline[0]}
              <br />
              <span className="ink-gradient">{hero.headline[1]}</span>
            </h1>
          </Reveal>

          <Reveal delay={80}>
            <p className="lede mt-6 max-w-xl">{hero.lede}</p>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href={hero.primaryCta.href}>
                {hero.primaryCta.label}
              </Button>
              <Button href={hero.secondaryCta.href} variant="secondary">
                {hero.secondaryCta.label}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={210}>
            <p className="text-ink-faint mt-6 text-[0.9375rem]">
              {hero.microNote}
            </p>
          </Reveal>

          <Reveal delay={270}>
            <dl className="border-line mt-9 grid max-w-lg grid-cols-3 gap-6 border-t pt-7">
              {hero.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="display ink-gradient block text-[2rem] leading-none sm:text-[2.35rem]">
                      {stat.value}
                    </span>
                    <span className="text-ink-soft mt-2.5 block text-[0.8125rem] leading-snug">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Stacked, slightly tilted cards — one per practice */}
        <div className="relative lg:pl-6">
          <ul className="space-y-2.5 sm:space-y-3">
            {pillars.map((pillar, i) => (
              <Reveal as="li" key={pillar.id} delay={120 + i * 110}>
                <a
                  href={pillar.href}
                  className={`card card-hover group flex items-start gap-3.5 bg-gradient-to-br p-4 sm:gap-4 sm:p-5 ${accents[i].tint} to-surface ${tilts[i]} hover:rotate-0`}
                >
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-xl text-white ${accents[i].chip}`}
                  >
                    <Icon name={pillar.icon} className="size-[1.125rem]" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2.5">
                      <span className="text-ink-faint font-mono text-[0.6875rem]">
                        {pillar.index}
                      </span>
                      <span className="text-ink text-[1.0625rem] font-semibold tracking-tight">
                        {pillar.title}
                      </span>
                    </span>
                    <span className="text-ink-soft mt-1 block text-[0.8125rem] leading-[1.5]">
                      {pillar.summary}
                    </span>
                  </span>

                  <Icon
                    name="arrowUp"
                    className="text-ink-faint group-hover:text-brand mt-1 size-4 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
