import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { hero, pillars } from "@/lib/content";

/** Alternating tilt for the stacked practice cards. */
const tilts = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];
const accents = [
  { wash: "bg-amber-wash", fg: "text-amber-deep" },
  { wash: "bg-brand-wash", fg: "text-brand-deep" },
  { wash: "bg-leaf-wash", fg: "text-leaf-deep" },
  { wash: "bg-mist", fg: "text-ink" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-[72px]">
      {/* Ground: graph paper, faded out at the edges */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="grid-paper absolute inset-0 [mask-image:radial-gradient(120%_80%_at_50%_20%,#000_35%,transparent_78%)]" />
        <div className="bg-brand/8 absolute top-0 -left-40 size-[34rem] rounded-full blur-[110px]" />
        <div className="bg-leaf/10 absolute top-40 -right-32 size-[30rem] rounded-full blur-[110px]" />
        <div className="bg-amber/8 absolute -top-20 left-1/3 size-[22rem] rounded-full blur-[100px]" />
      </div>

      <div className="shell grid items-center gap-16 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-28">
        {/* ---------------------------------------------------------------- */}
        <div>
          <Reveal>
            <p className="border-line bg-surface/80 text-ink-soft inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-medium backdrop-blur">
              <span className="relative flex size-2">
                <span className="bg-leaf absolute inline-flex size-full animate-ping rounded-full opacity-70" />
                <span className="bg-leaf-deep relative inline-flex size-2 rounded-full" />
              </span>
              {hero.eyebrow}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="display mt-7 text-[2.6rem] leading-[1.02] sm:text-[3.4rem] lg:text-[4rem] xl:text-[4.4rem]">
              {hero.headline[0]}
              <br />
              <span className="ink-gradient">{hero.headline[1]}</span>
            </h1>
          </Reveal>

          <Reveal delay={150}>
            <p className="lede mt-7 max-w-xl">{hero.lede}</p>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href={hero.primaryCta.href}>
                {hero.primaryCta.label}
              </Button>
              <Button href={hero.secondaryCta.href} variant="secondary">
                {hero.secondaryCta.label}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={280}>
            <p className="text-ink-faint mt-6 text-[0.9375rem]">
              {hero.microNote}
            </p>
          </Reveal>

          <Reveal delay={340}>
            <dl className="border-line mt-12 grid max-w-lg grid-cols-3 gap-6 border-t pt-8">
              {hero.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="display ink-gradient block text-[2rem] leading-none sm:text-[2.35rem]">
                      {stat.value}
                    </span>
                    <span className="text-ink-faint mt-2.5 block text-[0.8125rem] leading-snug">
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
          <ul className="space-y-3.5 sm:space-y-4">
            {pillars.map((pillar, i) => (
              <Reveal as="li" key={pillar.id} delay={200 + i * 90}>
                <a
                  href={pillar.href}
                  className={`card card-hover group flex items-start gap-4 p-5 sm:gap-5 sm:p-6 ${tilts[i]} hover:rotate-0`}
                >
                  <span
                    className={`grid size-11 shrink-0 place-items-center rounded-xl ${accents[i].wash} ${accents[i].fg}`}
                  >
                    <Icon name={pillar.icon} className="size-5" />
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
                    <span className="text-ink-soft mt-1.5 block text-[0.9rem] leading-relaxed">
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
