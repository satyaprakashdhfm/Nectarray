import type { Metadata } from "next";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { GrowthLoop } from "@/components/marketing/GrowthLoop";
import { StageSection } from "@/components/marketing/StageSection";
import type { ShowcaseItem } from "@/components/marketing/StageShowcase";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { company, marketing, marketingPage } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

const { hero, loop, find, content, measure, cta, meta } = marketingPage;

/**
 * Eyebrow with the accent rule the SectionHead component draws.
 *
 * `onDark` because the hero sits on the artwork now, and the `eyebrow`
 * utility hard-codes ink-faint, which disappears against it.
 */
function Eyebrow({
  children,
  onDark = false,
}: {
  children: string;
  onDark?: boolean;
}) {
  return (
    <p
      className={`eyebrow flex items-center gap-2.5 ${onDark ? "text-white/60" : ""}`}
    >
      <span className="bg-brand h-px w-6" aria-hidden />
      {children}
    </p>
  );
}

/**
 * A service as the showcase panel wants it: one shape, whether the copy came
 * from a `domain` on a tile or a `logos` list on a channel.
 */
const toItem = (t: {
  icon: string;
  title: string;
  body: string;
  domain?: string;
  shot?: { src: string; alt: string; width: number; height: number };
}): ShowcaseItem => ({
  icon: t.icon,
  title: t.title,
  body: t.body,
  logos: t.domain ? [{ name: t.title, domain: t.domain }] : undefined,
  shot: t.shot,
});

/** Which content object each stage draws its heading from. */
const STAGE_COPY: Record<string, { title: string; lede: string }> = {
  "01": { title: find.title, lede: find.lede },
  "02": { title: content.title, lede: content.lede },
  "03": {
    title: "Every console that can send you a customer",
    lede: marketing.lede,
  },
  "04": { title: measure.title, lede: measure.lede },
};

/** And the services it shows. */
const STAGE_ITEMS: Record<string, ShowcaseItem[]> = {
  "01": find.items.map(toItem),
  "02": content.items.map(toItem),
  "03": marketing.channels.map((c) => ({
    icon: c.icon,
    title: c.title,
    body: c.body,
    logos: c.logos,
  })),
  "04": measure.items.map(toItem),
};

/** Service schema scoped to this page. */
function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Growth marketing",
        serviceType:
          "Paid media, content and creator marketing, and AI search visibility",
        provider: { "@id": `${siteUrl}/#organization` },
        url: `${siteUrl}/marketing`,
        description: meta.description,
        areaServed: "Worldwide",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Marketing services",
          itemListElement: [...content.items, ...find.items].map((item) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: item.title,
              description: item.body,
            },
          })),
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

/**
 * The growth & marketing practice page.
 *
 * Laid out across the page rather than down it. Both this and the agentic AI
 * page were columns of full-width blocks, which on a wide screen meant a
 * short paragraph stranded in the middle of a lot of nothing and a scrollbar
 * doing the work instead. The service families are tile grids on the wider
 * `shell-wide` gutter, so a reader takes a section in at a glance.
 *
 * Stage 01 carries an explicit statement of what the work is not. Visibility
 * inside an assistant cannot be bought or guaranteed, and the honest version
 * of that claim is also the more persuasive one — every competitor promising
 * a spot in ChatGPT is promising something they do not control.
 */
export default function MarketingPage() {
  return (
    <>
      <StructuredData />
      <Header />

      <main id="main">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        {/*
         * The artwork sits in a panel beside the copy, the way /academy's
         * hero holds its facts card — not as a full-bleed background behind
         * white text, which is what this was.
         *
         * That version had two problems and this fixes both. It put a dark
         * section directly above a white one with nothing to soften the
         * seam, and the only way to make a 4rem headline readable over a
         * wall of small bright logos was a scrim at 80%, which is to say
         * showing a fifth of the picture. In a panel it renders at full
         * strength and the page stays light throughout, so there is no
         * transition left to solve.
         */}
        <section className="relative overflow-hidden pt-[var(--header-room)]">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden
          >
            <div className="from-brand-wash via-canvas to-mist absolute inset-0 bg-gradient-to-br" />
            <div className="grid-paper absolute inset-0 [mask-image:radial-gradient(120%_80%_at_50%_0%,#000_30%,transparent_78%)]" />
            <div className="bg-brand/20 absolute -top-24 -left-32 size-[34rem] rounded-full blur-[140px]" />
            <div className="bg-brand/14 absolute top-20 -right-28 size-[30rem] rounded-full blur-[140px]" />
          </div>

          <div className="shell-wide relative pt-10 pb-16 sm:pt-14 sm:pb-20">
            <div className="grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-14">
              <div>
                <Reveal>
                  <Eyebrow>{hero.eyebrow}</Eyebrow>
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

              {/*
               * Composed the way /academy's hero card is, rather than being a picture
               * in a border. A bare 16:9 image is much shorter than the copy beside
               * it, so it floated mid-column with dead air above and below. Badged,
               * captioned, and closed with the numbers, the panel fills its side and
               * reads as designed.
               *
               * The numbers moved in here out of the copy column for the same reason:
               * they were what made that side the taller of the two.
               */}
              <Reveal delay={150}>
                <div className="relative">
                  <div
                    className="from-brand/25 to-leaf/20 absolute -inset-6 -z-10 rounded-full bg-gradient-to-br blur-3xl"
                    aria-hidden
                  />
                  <article className="border-night-line bg-night relative overflow-hidden rounded-[1.75rem] border text-white shadow-[0_30px_70px_-30px_rgba(11,23,32,0.55)]">
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <Image
                        src="/hero/marketing-hero.jpg"
                        alt=""
                        aria-hidden
                        fill
                        sizes="(min-width: 1024px) 46vw, 92vw"
                        loading="eager"
                        className="object-cover"
                      />
                      {/* Scrim, so the badge and the line over it hold their contrast
                          whatever the artwork is doing underneath. */}
                      <div
                        className="from-night/95 via-night/40 absolute inset-0 bg-gradient-to-t to-transparent"
                        aria-hidden
                      />

                      <span className="bg-night/70 text-brand ring-brand/30 absolute top-5 left-5 inline-flex items-center rounded-full px-3 py-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase ring-1 backdrop-blur">
                        {hero.panel.badge}
                      </span>

                      <p className="display absolute bottom-5 left-5 text-[1.375rem] leading-tight sm:text-[1.625rem]">
                        <span className="text-brand">
                          {hero.panel.lines[0]}
                        </span>
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

        {/* ── The loop ───────────────────────────────────────── */}
        <section
          id="loop"
          className="border-line bg-mist-deep scroll-mt-24 border-b py-20 sm:py-24"
        >
          <div className="shell-wide">
            <GrowthLoop>
              <Reveal>
                <Eyebrow>{loop.eyebrow}</Eyebrow>
              </Reveal>
              <Reveal delay={70}>
                <h2 className="display text-ink mt-5 text-[2rem] sm:text-[2.5rem]">
                  {loop.title}
                </h2>
              </Reveal>
              <Reveal delay={130}>
                <p className="text-ink-soft mt-5 text-[0.9375rem] leading-relaxed">
                  {loop.lede}
                </p>
              </Reveal>
            </GrowthLoop>

            <p className="text-ink-faint mt-10 text-center text-[0.8125rem]">
              {loop.caption}
            </p>
          </div>
        </section>

        {/* ── The four stages ────────────────────────────── */}
        {/*
         * Driven off the same list the wheel is drawn from, so a stage cannot
         * exist in one and not the other. `items` is the only per-stage part
         * left in this file, because the copy lives in four different content
         * objects that predate the loop.
         */}
        {loop.stages.map((stage, i) => (
          <StageSection
            key={stage.n}
            id={stage.anchor.slice(1)}
            n={stage.n}
            name={stage.title}
            title={STAGE_COPY[stage.n].title}
            lede={STAGE_COPY[stage.n].lede}
            items={STAGE_ITEMS[stage.n]}
            ground={i % 2 === 0 ? "bg-canvas" : "bg-mist-deep"}
            texture={i % 2 === 0}
          />
        ))}

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="border-line bg-surface relative overflow-hidden border-t py-20 sm:py-24">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden
          >
            <div className="grid-paper absolute inset-0 [mask-image:radial-gradient(100%_70%_at_50%_0%,#000_25%,transparent_78%)] opacity-50" />
            <div className="bg-brand/14 absolute -top-24 right-1/4 size-[26rem] rounded-full blur-[120px]" />
            <div className="bg-brand/14 absolute -bottom-32 left-1/4 size-[30rem] rounded-full blur-[120px]" />
          </div>

          <div className="shell text-center">
            <Reveal>
              <h2 className="display text-ink mx-auto max-w-3xl text-[2.1rem] sm:text-[2.75rem]">
                {cta.title}
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="lede mx-auto mt-6 max-w-2xl">{cta.body}</p>
            </Reveal>
            <Reveal delay={150}>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <a
                  href={cta.primary.href}
                  className="bg-ink text-cta-fg hover:bg-brand-deep rounded-full px-6 py-3.5 text-[0.9375rem] font-semibold transition-colors"
                >
                  {cta.primary.label}
                </a>
                <a
                  href={cta.secondary.href}
                  className="border-line bg-canvas text-ink hover:border-brand hover:text-brand-deep rounded-full border px-6 py-3.5 text-[0.9375rem] font-semibold transition-colors"
                >
                  {cta.secondary.label}
                </a>
              </div>
            </Reveal>
            <Reveal delay={210}>
              <p className="text-ink-faint mt-8 text-[0.875rem]">
                Or write to{" "}
                <a
                  href={`mailto:${company.email}`}
                  className="text-brand-deep font-medium underline underline-offset-2"
                >
                  {company.email}
                </a>
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
