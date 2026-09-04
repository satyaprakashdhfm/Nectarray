import type { Metadata } from "next";
import Image from "next/image";
import { Plus, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Marketing } from "@/components/sections/Marketing";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { company, marketingPage } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

const { hero, brand, aiSearch, platforms, process, faqs, cta, meta } =
  marketingPage;

/**
 * One accent: the mark's circuit blue. Weight comes from navy, not from a
 * second hue.
 *
 * Rotating four accents through these grids was tried and it looked cheap —
 * amber and green tiles next to each other read as a template, not as this
 * studio. /academy and /software get their colour a different way: mostly
 * blue, with a panel or a band in the dark navy the header and footer are
 * already drawn in. That is what is copied here.
 *
 * Card treatment is still the one from sections/Practices.tsx — a `-wash`
 * tint graded into the card, an accent rule along the top, and the chip
 * solid in the deep tone with a white glyph. `-deep` on anything carrying a
 * glyph, never the display tone: those sit near 2.5:1 on white.
 */
const BRAND = {
  tint: "from-brand-wash",
  rule: "bg-brand",
  chip: "bg-brand-deep",
};

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

/** Service + FAQ schema scoped to this page. */
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
          itemListElement: [...brand.items, ...aiSearch.items].map((item) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: item.title,
              description: item.body,
            },
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
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

/** A compact service tile. Enough to recognise the work, not to explain it. */
function Tile({
  item,
  accent,
}: {
  item: { icon: string; title: string; body: string; domain?: string };
  accent: typeof BRAND;
}) {
  return (
    <article
      className={`card card-hover to-surface relative h-full overflow-hidden bg-gradient-to-br p-5 pt-6 ${accent.tint}`}
    >
      <span
        className={`absolute inset-x-0 top-0 h-1 ${accent.rule}`}
        aria-hidden
      />
      {/* A real mark where the service is a product — ChatGPT, Gemini,
          Perplexity, YouTube — and the accent chip where it is a discipline
          with no logo to show for it. */}
      {item.domain ? (
        <span className="border-line bg-canvas grid size-9 place-items-center rounded-lg border">
          <BrandLogo
            name={item.title}
            domain={item.domain}
            className="size-[1.125rem]"
          />
        </span>
      ) : (
        <span
          className={`grid size-9 place-items-center rounded-lg text-white ${accent.chip}`}
        >
          <Icon name={item.icon} className="size-[1.0625rem]" />
        </span>
      )}
      <h3 className="text-ink mt-4 text-[0.9375rem] font-semibold tracking-tight">
        {item.title}
      </h3>
      <p className="text-ink-soft mt-1.5 text-[0.8125rem] leading-[1.55]">
        {item.body}
      </p>
    </article>
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
 * The AI search section carries an explicit statement of what the work is
 * not. Visibility inside an assistant cannot be bought or guaranteed, and
 * the honest version of that claim is also the more persuasive one — every
 * competitor promising a spot in ChatGPT is promising something they do not
 * control.
 */
export default function MarketingPage() {
  return (
    <>
      <StructuredData />
      <Header />

      <main id="main" className="pt-[72px]">
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
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden
          >
            <div className="from-brand-wash via-canvas to-mist absolute inset-0 bg-gradient-to-br" />
            <div className="grid-paper absolute inset-0 [mask-image:radial-gradient(120%_80%_at_50%_0%,#000_30%,transparent_78%)]" />
            <div className="bg-brand/20 absolute -top-24 -left-32 size-[34rem] rounded-full blur-[140px]" />
            <div className="bg-brand/14 absolute top-20 -right-28 size-[30rem] rounded-full blur-[140px]" />
          </div>

          <div className="shell-wide relative pt-10 pb-20 sm:pt-14 sm:pb-24 lg:pt-16 lg:pb-28">
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

                <Reveal delay={300}>
                  <dl className="border-line mt-10 grid max-w-lg grid-cols-3 gap-6 border-t pt-7">
                    {hero.stats.map((stat) => (
                      <div key={stat.label}>
                        <dt className="sr-only">{stat.label}</dt>
                        <dd>
                          <span className="display ink-gradient block text-[1.75rem] leading-none sm:text-[2rem]">
                            {stat.value}
                          </span>
                          <span className="text-ink-soft mt-2 block text-[0.8125rem] leading-snug">
                            {stat.label}
                          </span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              </div>

              <Reveal delay={150}>
                <div className="relative">
                  <div
                    className="from-brand/25 to-leaf/20 absolute -inset-6 -z-10 rounded-full bg-gradient-to-br blur-3xl"
                    aria-hidden
                  />
                  <div className="border-night-line bg-night relative aspect-[16/9] overflow-hidden rounded-[1.75rem] border shadow-[0_30px_70px_-30px_rgba(11,23,32,0.55)]">
                    <Image
                      src="/hero/marketing-hero.jpg"
                      alt=""
                      aria-hidden
                      fill
                      sizes="(min-width: 1024px) 46vw, 92vw"
                      loading="eager"
                      className="object-cover"
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Channels — the shared eight, also in the homepage JSON-LD ── */}
        <div id="channels" className="scroll-mt-24">
          <Marketing />
        </div>

        {/* ── Brand, content & creators ────────────────────────────── */}
        <section className="py-20 sm:py-24">
          <div className="shell-wide">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <Reveal>
                  <Eyebrow>{brand.eyebrow}</Eyebrow>
                </Reveal>
                <Reveal delay={70}>
                  <h2 className="display text-ink mt-5 text-[2rem] sm:text-[2.5rem]">
                    {brand.title}
                  </h2>
                </Reveal>
                <Reveal delay={130}>
                  <p className="text-ink-soft mt-5 text-[0.9375rem] leading-relaxed">
                    {brand.lede}
                  </p>
                </Reveal>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {brand.items.map((item, i) => (
                  <Reveal as="li" key={item.title} delay={(i % 3) * 60}>
                    <Tile item={item} accent={BRAND} />
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── AI search visibility ─────────────────────────────────── */}
        <section
          id="ai-search"
          className="border-line bg-mist relative scroll-mt-24 overflow-hidden border-y py-20 sm:py-24"
        >
          <div
            className="grid-paper pointer-events-none absolute inset-0 -z-10 opacity-60"
            aria-hidden
          />

          <div className="shell-wide">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <Reveal>
                  <Eyebrow>{aiSearch.eyebrow}</Eyebrow>
                </Reveal>
                <Reveal delay={70}>
                  <h2 className="display text-ink mt-5 text-[2rem] sm:text-[2.5rem]">
                    {aiSearch.title}
                  </h2>
                </Reveal>
                <Reveal delay={130}>
                  <p className="text-ink-soft mt-5 text-[0.9375rem] leading-relaxed">
                    {aiSearch.lede}
                  </p>
                </Reveal>
              </div>

              <div>
                <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {aiSearch.items.map((item, i) => (
                    <Reveal as="li" key={item.title} delay={(i % 3) * 60}>
                      <Tile item={item} accent={BRAND} />
                    </Reveal>
                  ))}
                </ul>

                {/*
                 * Said plainly and given its own panel, not buried in a
                 * footnote. A promise nobody can keep is the thing every
                 * other agency in this category is selling.
                 */}
                <Reveal delay={140}>
                  <div className="border-night-line bg-night mt-4 rounded-2xl border p-6 text-white sm:p-7">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                      <span className="bg-brand/15 text-brand grid size-11 shrink-0 place-items-center rounded-xl">
                        <ShieldCheck
                          className="size-5"
                          strokeWidth={1.9}
                          aria-hidden
                        />
                      </span>
                      <div>
                        <h3 className="text-[1.0625rem] font-semibold tracking-tight text-white">
                          {aiSearch.honesty.title}
                        </h3>
                        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-white/70">
                          {aiSearch.honesty.body}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── Platforms ────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24">
          <div className="shell-wide">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <Reveal>
                  <Eyebrow>{platforms.eyebrow}</Eyebrow>
                </Reveal>
                <Reveal delay={70}>
                  <h2 className="display text-ink mt-5 text-[2rem] sm:text-[2.5rem]">
                    {platforms.title}
                  </h2>
                </Reveal>
                <Reveal delay={130}>
                  <p className="text-ink-soft mt-5 text-[0.9375rem] leading-relaxed">
                    {platforms.lede}
                  </p>
                </Reveal>
              </div>

              {/* Real marks, the way the integrations grid on /software is
                  drawn. A buyer recognises the Meta or Zomato logo faster
                  than they read the words next to it. */}
              <div className="grid gap-3 sm:grid-cols-2">
                {platforms.groups.map((group, i) => (
                  <Reveal key={group.label} delay={(i % 2) * 60}>
                    <div className="card h-full p-5">
                      <h3 className="text-ink text-[0.9375rem] font-semibold tracking-tight">
                        {group.label}
                      </h3>
                      {group.note && (
                        <p className="text-ink-soft mt-1.5 text-[0.8125rem] leading-[1.55]">
                          {group.note}
                        </p>
                      )}
                      <ul className="mt-4 flex flex-wrap gap-1.5">
                        {group.brands.map((brand) => (
                          <li
                            key={brand.name}
                            className="border-line bg-canvas flex items-center gap-1.5 rounded-md border px-2 py-1"
                          >
                            <BrandLogo
                              name={brand.name}
                              domain={brand.domain}
                              className="size-3.5"
                            />
                            <span className="text-ink-soft text-[0.75rem] font-medium whitespace-nowrap">
                              {brand.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Process — the page's one full-colour band ────────────── */}
        <section className="border-night-line bg-night border-y py-20 sm:py-24">
          <div className="shell-wide">
            <Reveal>
              <p className="flex items-center gap-2.5 text-[0.75rem] font-semibold tracking-[0.16em] text-white/55 uppercase">
                <span className="bg-brand h-px w-6" aria-hidden />
                {process.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="display mt-5 text-[2rem] text-white sm:text-[2.5rem]">
                {process.title}
              </h2>
            </Reveal>

            <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {process.steps.map((step, i) => (
                <Reveal as="li" key={step.n} delay={i * 60}>
                  <div className="border-night-line bg-night-soft h-full rounded-2xl border p-5">
                    <span className="bg-brand-deep grid size-8 place-items-center rounded-full font-mono text-[0.72rem] font-semibold text-white">
                      {step.n}
                    </span>
                    <h3 className="mt-4 text-[0.9375rem] font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[0.8125rem] leading-[1.55] text-white/70">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section className="border-line bg-mist border-y py-20 sm:py-24">
          <div className="shell-wide grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <h2 className="display text-ink text-[2rem] sm:text-[2.5rem] lg:sticky lg:top-28">
                Questions we get
                <br />
                <span className="ink-gradient">before we start.</span>
              </h2>
            </Reveal>

            {/* Two columns of accordions on a wide screen: six rows down one
                side left most of the width empty. */}
            <div className="grid gap-x-10 lg:grid-cols-2">
              {faqs.map((faq, i) => (
                <Reveal key={faq.q} delay={i * 50}>
                  <details
                    open={i === 0}
                    className="group border-line border-b py-1 first:border-t lg:first:border-t-0"
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-5 py-4 [&::-webkit-details-marker]:hidden">
                      <h3 className="text-ink group-hover:text-brand-deep text-[0.9375rem] font-semibold tracking-tight transition-colors">
                        {faq.q}
                      </h3>
                      <span
                        className="border-line bg-surface text-ink-soft group-open:border-brand group-open:bg-brand mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border transition-all duration-300 group-open:rotate-45 group-open:text-white"
                        aria-hidden
                      >
                        <Plus className="size-3.5" strokeWidth={2.25} />
                      </span>
                    </summary>
                    <p className="text-ink-soft pr-10 pb-5 text-[0.875rem] leading-relaxed">
                      {faq.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

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
