import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { agenticAiPage, company } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

const { hero, families, engineering, stack, process, faqs, cta, meta } =
  agenticAiPage;

/**
 * Accents, from the set in sections/Practices.tsx: one per practice, in
 * wordmark order — amber, blue, green, teal.
 *
 * The pages were pale because every chip was a `-wash` behind a `-deep`
 * glyph and every card was flat white, so a ten-tile grid came out as one
 * shade of almost-nothing. This is the treatment the practice cards already
 * use: a tint graded into the card, an accent rule along the top, and the
 * chip solid in the deep tone with a white glyph.
 *
 * `-deep` on anything carrying a glyph or text, never the display tone —
 * those sit near 2.5:1 on white and fail as foregrounds.
 */
type Accent = { tint: string; rule: string; chip: string };

const AMBER: Accent = {
  tint: "from-amber-wash",
  rule: "bg-amber",
  chip: "bg-amber-deep",
};
const BRAND: Accent = {
  tint: "from-brand-wash",
  rule: "bg-brand",
  chip: "bg-brand-deep",
};
const LEAF: Accent = {
  tint: "from-leaf-wash",
  rule: "bg-leaf",
  chip: "bg-leaf-deep",
};
const TEAL: Accent = {
  tint: "from-teal-wash",
  rule: "bg-teal",
  chip: "bg-teal-deep",
};

/** Eyebrow with the accent rule the SectionHead component draws. */
function Eyebrow({ children, rule }: { children: string; rule: string }) {
  return (
    <p className="eyebrow flex items-center gap-2.5">
      <span className={`h-px w-6 ${rule}`} aria-hidden />
      {children}
    </p>
  );
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/agentic-ai" },
  openGraph: {
    type: "website",
    url: `${siteUrl}/agentic-ai`,
    title: meta.title,
    description: meta.description,
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

/** Service + FAQ schema scoped to this page. */
function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Agentic AI development",
        serviceType: "AI agent, chatbot and MCP server development",
        provider: { "@id": `${siteUrl}/#organization` },
        url: `${siteUrl}/agentic-ai`,
        description: meta.description,
        areaServed: "Worldwide",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Agentic AI capabilities",
          itemListElement: families.flatMap((family) =>
            family.items.map((item) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: item.name,
                description: item.body,
                category: family.title,
              },
            })),
          ),
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

/**
 * The agentic AI practice page.
 *
 * On the site's light ground, like every other route. It used to be the one
 * page that ran dark end to end, on the reasoning that the practice has its
 * own identity on the homepage and a service page is where that gets room —
 * but in a set of four practice pages it read as a different website, and a
 * visitor moving between them met a full inversion halfway through. The
 * accents carry the identity instead, which is what they are for.
 *
 * The grounds alternate the way the rest of the site does: tinted hero,
 * white capabilities, recessed engineering, white stack, recessed process,
 * white FAQ, then the closing band.
 *
 * Laid out across the page rather than down it. This was a column of
 * full-width blocks — five capability families each taking a whole screen,
 * so on a wide monitor a short paragraph sat stranded in the middle of a lot
 * of nothing and the scrollbar did the work. The families are now a tile
 * grid on the wider `shell-wide` gutter, short enough to take in at a
 * glance: what the family is, and the names of the things inside it. The
 * sentence explaining each one is still in the page's Service schema, and
 * belongs in the conversation rather than on a card.
 */
export default function AgenticAiPage() {
  return (
    <>
      <StructuredData />
      <Header />

      <main id="main" className="pt-[72px]">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden
          >
            <div className="from-leaf-wash via-canvas to-brand-wash absolute inset-0 bg-gradient-to-br" />
            <div className="grid-paper absolute inset-0 [mask-image:radial-gradient(120%_80%_at_50%_0%,#000_30%,transparent_78%)]" />
            <div className="bg-leaf/22 absolute -top-24 -left-32 size-[34rem] rounded-full blur-[140px]" />
            <div className="bg-brand/18 absolute top-20 -right-28 size-[30rem] rounded-full blur-[140px]" />
          </div>

          <div className="shell-wide py-20 sm:py-24 lg:py-28">
            <Reveal>
              <Eyebrow rule="bg-leaf">{hero.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="display text-ink mt-7 max-w-4xl text-[2.5rem] leading-[1.02] sm:text-[3.4rem] lg:text-[4.25rem]">
                {hero.headline[0]}
                <br />
                <span className="ink-gradient">{hero.headline[1]}</span>
              </h1>
            </Reveal>

            <Reveal delay={150}>
              <p className="lede mt-7 max-w-2xl">{hero.lede}</p>
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
              <dl className="border-line mt-14 grid max-w-xl grid-cols-3 gap-6 border-t pt-8">
                {hero.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="display ink-gradient block text-[1.9rem] leading-none sm:text-[2.25rem]">
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
        </section>

        {/* ── Capability families ──────────────────────────────────── */}
        <section
          id="capabilities"
          className="border-line scroll-mt-24 border-t py-20 sm:py-24"
        >
          <div className="shell-wide">
            <Reveal>
              <h2 className="display text-ink max-w-3xl text-[2rem] sm:text-[2.6rem]">
                Five kinds of work we build agents for
              </h2>
            </Reveal>

            <ul className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {families.map((family, i) => (
                <Reveal as="li" key={family.id} delay={(i % 3) * 60}>
                  <article
                    id={family.id}
                    className={`card card-hover to-surface relative flex h-full scroll-mt-24 flex-col overflow-hidden bg-gradient-to-br p-6 pt-7 ${LEAF.tint}`}
                  >
                    <span
                      className={`absolute inset-x-0 top-0 h-1 ${LEAF.rule}`}
                      aria-hidden
                    />
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid size-10 place-items-center rounded-xl text-white ${LEAF.chip}`}
                      >
                        <Icon name={family.icon} className="size-[1.125rem]" />
                      </span>
                      <span className="text-ink-faint font-mono text-[0.72rem]">
                        {family.index}
                      </span>
                    </div>

                    <h3 className="text-ink mt-4 text-[1.0625rem] font-semibold tracking-tight">
                      {family.title}
                    </h3>
                    <p className="text-ink-soft mt-2 text-[0.875rem] leading-[1.55]">
                      {family.summary}
                    </p>

                    {/* Names only. The sentence on each one is still in the
                        Service schema above, and a card that lists five of
                        them with a paragraph each is the wall this replaced. */}
                    <ul className="border-line-soft mt-4 flex flex-1 flex-col justify-end gap-2 border-t pt-4">
                      {family.items.map((item) => (
                        <li
                          key={item.name}
                          className="text-ink-soft flex items-start gap-2 text-[0.8125rem] leading-snug"
                        >
                          <Icon
                            name="check"
                            className="text-leaf-deep mt-[0.15rem] size-3.5 shrink-0"
                            strokeWidth={2.75}
                          />
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ── The engineering half ─────────────────────────────────── */}
        <section className="border-line bg-mist relative overflow-hidden border-y py-20 sm:py-24">
          <div
            className="grid-paper pointer-events-none absolute inset-0 -z-10 opacity-60"
            aria-hidden
          />

          <div className="shell-wide">
            <Reveal>
              <Eyebrow rule="bg-brand">{engineering.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="display text-ink mt-5 max-w-3xl text-[2rem] sm:text-[2.6rem]">
                {engineering.title}
              </h2>
            </Reveal>
            <Reveal delay={130}>
              <p className="lede mt-5 max-w-2xl">{engineering.lede}</p>
            </Reveal>

            <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {engineering.items.map((item, i) => (
                <Reveal as="li" key={item.title} delay={(i % 3) * 70}>
                  <article
                    className={`card card-hover to-surface relative h-full overflow-hidden bg-gradient-to-br p-6 pt-7 ${BRAND.tint}`}
                  >
                    <span
                      className={`absolute inset-x-0 top-0 h-1 ${BRAND.rule}`}
                      aria-hidden
                    />
                    <span
                      className={`grid size-10 place-items-center rounded-lg text-white ${BRAND.chip}`}
                    >
                      <Icon name={item.icon} className="size-[1.125rem]" />
                    </span>
                    <h3 className="text-ink mt-5 text-[1rem] font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-ink-soft mt-2.5 text-[0.875rem] leading-relaxed">
                      {item.body}
                    </p>
                  </article>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Stack ────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24">
          <div className="shell-wide grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal>
              <div>
                <h2 className="display text-ink text-[1.9rem] sm:text-[2.25rem]">
                  {stack.title}
                </h2>
                <p className="text-ink-soft mt-4 text-[0.9375rem] leading-relaxed">
                  {stack.body}
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <dl className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                {stack.groups.map((group) => (
                  <div key={group.label}>
                    <dt className="eyebrow mb-3">{group.label}</dt>
                    <dd>
                      <ul className="flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="border-line bg-canvas text-ink-soft rounded-lg border px-2.5 py-1.5 font-mono text-[0.75rem]"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* ── Process — the page's one full-colour band ────────────── */}
        <section className="brand-band py-20 sm:py-24">
          <div className="shell-wide">
            <Reveal>
              <p className="flex items-center gap-2.5 text-[0.75rem] font-semibold tracking-[0.16em] text-white/70 uppercase">
                <span className="h-px w-6 bg-white/50" aria-hidden />
                {process.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="display mt-5 text-[2rem] text-white sm:text-[2.6rem]">
                {process.title}
              </h2>
            </Reveal>

            <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {process.steps.map((step, i) => (
                <Reveal as="li" key={step.n} delay={i * 70}>
                  <div className="h-full rounded-2xl border border-white/20 bg-white/10 p-5">
                    <span className="text-ink grid size-8 place-items-center rounded-full bg-white font-mono text-[0.72rem] font-semibold">
                      {step.n}
                    </span>
                    <h3 className="mt-4 text-[0.9375rem] font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[0.8125rem] leading-[1.55] text-white/85">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24">
          <div className="shell-wide grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <h2 className="display text-ink text-[2rem] sm:text-[2.5rem] lg:sticky lg:top-28">
                Questions we get
                <br />
                <span className="ink-gradient">before we start.</span>
              </h2>
            </Reveal>

            {/* Two columns on a wide screen: one tall stack of accordions
                left most of the width empty. `name` is dropped with it —
                an exclusive group that snaps a row shut in the other column
                reads as a bug when both are on screen at once. */}
            <div className="grid gap-x-10 lg:grid-cols-2">
              {faqs.map((faq, i) => (
                <Reveal key={faq.q} delay={i * 50}>
                  <details
                    open={i === 0}
                    className="group border-line border-b py-1 first:border-t lg:first:border-t-0"
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                      <h3 className="text-ink group-hover:text-brand-deep text-[1.0625rem] font-semibold tracking-tight transition-colors">
                        {faq.q}
                      </h3>
                      <span
                        className="border-line bg-surface text-ink-soft group-open:border-brand group-open:bg-brand mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border transition-all duration-300 group-open:rotate-45 group-open:text-white"
                        aria-hidden
                      >
                        <Plus className="size-4" strokeWidth={2.25} />
                      </span>
                    </summary>
                    <p className="text-ink-soft max-w-2xl pr-12 pb-6 text-[0.9375rem] leading-relaxed">
                      {faq.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="border-line bg-surface relative overflow-hidden border-t py-20 sm:py-28">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden
          >
            <div className="grid-paper absolute inset-0 [mask-image:radial-gradient(100%_70%_at_50%_0%,#000_25%,transparent_78%)] opacity-50" />
            <div className="bg-brand/12 absolute -top-24 right-1/4 size-[26rem] rounded-full blur-[120px]" />
            <div className="bg-leaf/14 absolute -bottom-32 left-1/4 size-[30rem] rounded-full blur-[120px]" />
          </div>

          <div className="shell text-center">
            <Reveal>
              <h2 className="display text-ink mx-auto max-w-3xl text-[2.1rem] sm:text-[2.9rem]">
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
