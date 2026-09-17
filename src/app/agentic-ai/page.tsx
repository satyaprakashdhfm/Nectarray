import type { Metadata } from "next";
import Image from "next/image";
import { AgentDomains } from "@/components/agentic/AgentDomains";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { agenticAiPage, company } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

const { hero, families, domains, stack, cta, meta } = agenticAiPage;

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
 * `onDark` because the hero sits on the artwork now and the `eyebrow`
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
            <div className="bg-brand/16 absolute top-20 -right-28 size-[30rem] rounded-full blur-[140px]" />
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
                        src="/hero/agentic-hero.jpg"
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

                    <dl className="border-night-line grid grid-cols-3 gap-x-4 gap-y-4 border-t p-5 sm:gap-x-5 sm:p-7">
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

        {/* ── Capability families ──────────────────────────────────── */}
        <section id="capabilities" className="scroll-mt-24 py-20 sm:py-24">
          <div className="shell-wide">
            <Reveal>
              <h2 className="display text-ink max-w-3xl text-[2rem] sm:text-[2.6rem]">
                The agents we build
              </h2>
            </Reveal>

            <Reveal delay={70}>
              <p className="lede mt-5 max-w-2xl">
                Two kinds of build, each with the parts we have already solved.
                Pick the one that matches the work you want taken off
                someone&rsquo;s desk.
              </p>
            </Reveal>

            {/*
             * One build per row, the explanation on the left and the picture
             * on the right — the same way round every time, and the same way
             * round as the stages on /marketing. Alternating them was a
             * decoration that cost a reader the line their eye had settled
             * into.
             *
             * This replaced two dense panels of six paragraphs each. The
             * picture carries what those paragraphs were describing — the
             * channels an agent works across, the clients and systems a
             * server sits between — so each line underneath is now a name
             * and a single clause, which is what a buyer scans anyway.
             *
             * `items-center` rather than a stretched column: the shots are
             * illustrations with content out to their edges, so they are
             * shown whole and centred instead of cropped to fill a box.
             */}
            <div className="mt-12 space-y-6">
              {families.map((family) => (
                <Reveal key={family.id} delay={70}>
                  <article
                    id={family.id}
                    className={`card to-surface relative scroll-mt-24 overflow-hidden bg-gradient-to-br p-5 pt-7 sm:p-8 sm:pt-10 lg:p-10 lg:pt-12 ${BRAND.tint}`}
                  >
                    {/* The accent along the top edge, so each build is a
                        bounded thing on the page rather than a stretch of
                        text that happens to have a picture beside it. */}
                    <span
                      className={`absolute inset-x-0 top-0 h-1 ${BRAND.rule}`}
                      aria-hidden
                    />

                    {/*
                      Placed rather than flowed, because the reading order
                      differs by width. Narrow, it is one column and the
                      picture belongs directly under the summary it
                      illustrates — left to flow it would land after six
                      list items, which on a phone is a screen and a half
                      below the sentence it answers. Wide, the picture takes
                      the right column across both rows and the text keeps
                      the left.
                    */}
                    <div className="grid gap-7 lg:grid-cols-2 lg:gap-x-12">
                      <div className="min-w-0 lg:col-start-1 lg:row-start-1">
                        <div className="flex items-center gap-3">
                          <span
                            className={`grid size-11 place-items-center rounded-xl text-white ${BRAND.chip}`}
                          >
                            <Icon name={family.icon} className="size-5" />
                          </span>
                          <span className="text-ink-faint font-mono text-[0.8125rem] tracking-[0.14em]">
                            {family.index}
                          </span>
                        </div>

                        <h3 className="display text-ink mt-5 text-[1.5rem] sm:text-[1.875rem]">
                          {family.title}
                        </h3>
                        <p className="text-ink-soft mt-4 text-[0.9375rem] leading-relaxed">
                          {family.summary}
                        </p>
                      </div>

                      {/* A window inside the card rather than a second card on
                        top of one: the mat sets the picture off the panel it
                        sits on, and the hairline gives it its own edge. */}
                      <figure className="border-line bg-canvas overflow-hidden rounded-2xl border p-2 shadow-[0_18px_40px_-28px_rgba(14,27,38,0.45)] sm:p-2.5 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
                        <Image
                          src={family.shot.src}
                          alt={family.shot.alt}
                          width={family.shot.width}
                          height={family.shot.height}
                          sizes="(min-width: 1024px) 40rem, 92vw"
                          className="border-line-soft h-auto w-full rounded-xl border"
                        />
                      </figure>

                      {/* Hairlines rather than bullets: six of these read as
                          a list of what you get, and the rules keep them
                          apart without a glyph on every row shouting. */}
                      <ul className="divide-line-soft border-line-soft divide-y border-t lg:col-start-1 lg:row-start-2">
                        {family.items.map((item) => (
                          <li key={item.name} className="flex gap-3 py-3.5">
                            <Icon
                              name="check"
                              className="text-brand-deep mt-[0.3rem] size-3.5 shrink-0"
                              strokeWidth={2.75}
                            />
                            <div className="min-w-0">
                              <h4 className="text-ink text-[0.9375rem] font-semibold">
                                {item.name}
                              </h4>
                              <p className="text-ink-soft mt-1 text-[0.8125rem] leading-[1.6]">
                                {item.body}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Agents by domain ────────────────────────── */}
        <section
          id="domains"
          className="border-line bg-mist relative scroll-mt-24 overflow-hidden border-y py-20 sm:py-24"
        >
          <div
            className="grid-paper pointer-events-none absolute inset-0 -z-10 opacity-60"
            aria-hidden
          />

          <div className="shell-wide">
            <div className="max-w-2xl">
              <Reveal>
                <Eyebrow>{domains.eyebrow}</Eyebrow>
              </Reveal>
              <Reveal delay={70}>
                <h2 className="display text-ink mt-5 text-[2rem] sm:text-[2.5rem]">
                  {domains.title}
                </h2>
              </Reveal>
              <Reveal delay={130}>
                <p className="text-ink-soft mt-5 text-[1.0625rem] leading-relaxed">
                  {domains.lede}
                </p>
              </Reveal>
            </div>

            <Reveal delay={180}>
              <div className="mt-12">
                <AgentDomains />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Stack — every model and framework, named ────────── */}
        {/*
         * On the page's own ground rather than the navy it used to sit in.
         * A full-width dark band in the middle of a light page reads as a
         * different site for as long as it lasts, and this is the section a
         * technical buyer actually stops on — "do you know my tooling" —
         * so it should look like part of the page it is answering for.
         *
         * The marks are larger here than anywhere else on the site on
         * purpose: recognising a logo is the whole job of this section, and
         * at 24px half of them were a smudge.
         */}
        <section
          id="stack"
          className="border-line bg-canvas scroll-mt-24 border-y py-20 sm:py-24"
        >
          <div className="shell-wide">
            <div className="max-w-3xl">
              <Reveal>
                <h2 className="display text-ink text-[2rem] sm:text-[2.6rem]">
                  {stack.title}
                </h2>
              </Reveal>
              <Reveal delay={80}>
                <p className="text-ink-soft mt-5 text-[1.0625rem] leading-relaxed">
                  {stack.body}
                </p>
              </Reveal>
            </div>

            <dl className="mt-12 grid gap-6 lg:grid-cols-2">
              {stack.groups.map((group, i) => (
                <Reveal key={group.label} delay={(i % 2) * 70}>
                  <div className="card h-full p-6 sm:p-7">
                    <dt className="text-brand-deep flex items-center gap-2.5 text-[0.8125rem] font-semibold tracking-[0.14em] uppercase">
                      <span className="bg-brand h-px w-5" aria-hidden />
                      {group.label}
                    </dt>
                    <dd className="mt-5">
                      <ul className="flex flex-wrap gap-2.5">
                        {group.brands.map((brand) => (
                          <li
                            key={brand.name}
                            className="border-line bg-surface hover:border-brand/40 flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors"
                          >
                            <BrandLogo
                              name={brand.name}
                              domain={brand.domain}
                              className="size-8"
                            />
                            <span className="text-ink text-[1rem] font-semibold whitespace-nowrap">
                              {brand.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="border-line bg-surface relative overflow-hidden border-t py-20 sm:py-28">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden
          >
            <div className="grid-paper absolute inset-0 [mask-image:radial-gradient(100%_70%_at_50%_0%,#000_25%,transparent_78%)] opacity-50" />
            <div className="bg-brand/16 absolute -top-24 right-1/4 size-[26rem] rounded-full blur-[120px]" />
            <div className="bg-brand/12 absolute -bottom-32 left-1/4 size-[30rem] rounded-full blur-[120px]" />
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
