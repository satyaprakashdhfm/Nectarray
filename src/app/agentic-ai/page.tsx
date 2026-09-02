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

export default function AgenticAiPage() {
  return (
    <>
      <StructuredData />
      <Header onDark />

      {/*
        This page commits to the dark treatment the practice already uses on
        the homepage, rather than the site's light ground — it is the one
        section with its own visual identity, and a service page is where
        that identity gets room to work.
      */}
      <main id="main" className="bg-night text-white">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-[72px]">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden
          >
            <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [mask-image:radial-gradient(120%_80%_at_50%_0%,#000_30%,transparent_78%)] [background-size:46px_46px] opacity-60" />
            <div className="bg-brand/22 absolute -top-24 -left-32 size-[34rem] rounded-full blur-[140px]" />
            <div className="bg-leaf/16 absolute top-20 -right-28 size-[30rem] rounded-full blur-[140px]" />
          </div>

          <div className="shell py-20 sm:py-24 lg:py-32">
            <Reveal>
              <p className="text-leaf font-mono text-[0.72rem] tracking-[0.16em] uppercase">
                {hero.eyebrow}
              </p>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="display mt-7 max-w-4xl text-[2.5rem] leading-[1.02] sm:text-[3.4rem] lg:text-[4.25rem]">
                {hero.headline[0]}
                <br />
                <span className="ink-gradient">{hero.headline[1]}</span>
              </h1>
            </Reveal>

            <Reveal delay={150}>
              <p className="mt-7 max-w-2xl text-[1.0625rem] leading-relaxed text-white/65 sm:text-[1.1875rem]">
                {hero.lede}
              </p>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href={hero.primaryCta.href}
                  className="text-night hover:bg-leaf rounded-full bg-white px-6 py-3.5 text-[0.9375rem] font-semibold transition-colors"
                >
                  {hero.primaryCta.label}
                </a>
                <a
                  href={hero.secondaryCta.href}
                  className="border-night-line rounded-full border px-6 py-3.5 text-[0.9375rem] font-semibold text-white/80 transition-colors hover:border-white/30 hover:text-white"
                >
                  {hero.secondaryCta.label}
                </a>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <dl className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
                {hero.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="display ink-gradient block text-[1.9rem] leading-none sm:text-[2.25rem]">
                        {stat.value}
                      </span>
                      <span className="mt-2.5 block text-[0.8125rem] leading-snug text-white/45">
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
          className="border-night-line scroll-mt-24 border-t py-20 sm:py-24"
        >
          <div className="shell">
            <Reveal>
              <h2 className="display max-w-3xl text-[2rem] sm:text-[2.6rem]">
                Five kinds of work we build agents for
              </h2>
            </Reveal>

            <div className="mt-14 space-y-4">
              {families.map((family, i) => (
                <Reveal key={family.id} delay={(i % 3) * 70}>
                  <article
                    id={family.id}
                    className="border-night-line bg-night-soft/60 scroll-mt-24 rounded-2xl border p-7 sm:p-9"
                  >
                    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
                      <header>
                        <div className="flex items-center gap-3">
                          <span className="bg-leaf/12 text-leaf grid size-11 place-items-center rounded-xl">
                            <Icon name={family.icon} className="size-5" />
                          </span>
                          <span className="font-mono text-[0.72rem] text-white/35">
                            {family.index}
                          </span>
                        </div>
                        <h3 className="display mt-5 text-[1.6rem] sm:text-[1.9rem]">
                          {family.title}
                        </h3>
                        <p className="mt-3.5 text-[0.9375rem] leading-relaxed text-white/60">
                          {family.summary}
                        </p>
                      </header>

                      <ul className="divide-y divide-white/8">
                        {family.items.map((item, index) => (
                          <li
                            key={item.name}
                            className={index === 0 ? "pb-4" : "py-4 last:pb-0"}
                          >
                            <h4 className="text-[0.9375rem] font-semibold text-white">
                              {item.name}
                            </h4>
                            <p className="mt-1.5 text-[0.875rem] leading-relaxed text-white/55">
                              {item.body}
                            </p>
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

        {/* ── The engineering half ─────────────────────────────────── */}
        <section className="border-night-line bg-night-soft/40 border-t py-20 sm:py-24">
          <div className="shell">
            <Reveal>
              <p className="text-leaf font-mono text-[0.72rem] tracking-[0.16em] uppercase">
                {engineering.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="display mt-5 max-w-3xl text-[2rem] sm:text-[2.6rem]">
                {engineering.title}
              </h2>
            </Reveal>
            <Reveal delay={130}>
              <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-white/60">
                {engineering.lede}
              </p>
            </Reveal>

            <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {engineering.items.map((item, i) => (
                <Reveal as="li" key={item.title} delay={(i % 3) * 70}>
                  <article className="border-night-line h-full rounded-2xl border bg-white/[0.02] p-6">
                    <span className="text-leaf grid size-10 place-items-center rounded-lg bg-white/6">
                      <Icon name={item.icon} className="size-[1.125rem]" />
                    </span>
                    <h3 className="mt-5 text-[1rem] font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-[0.875rem] leading-relaxed text-white/55">
                      {item.body}
                    </p>
                  </article>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Stack ────────────────────────────────────────────────── */}
        <section className="border-night-line border-t py-20 sm:py-24">
          <div className="shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal>
              <div>
                <h2 className="display text-[1.9rem] sm:text-[2.25rem]">
                  {stack.title}
                </h2>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-white/60">
                  {stack.body}
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <dl className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                {stack.groups.map((group) => (
                  <div key={group.label}>
                    <dt className="mb-3 font-mono text-[0.7rem] tracking-[0.14em] text-white/35 uppercase">
                      {group.label}
                    </dt>
                    <dd>
                      <ul className="flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="border-night-line rounded-lg border bg-white/[0.03] px-2.5 py-1.5 font-mono text-[0.75rem] text-white/70"
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

        {/* ── Process ──────────────────────────────────────────────── */}
        <section className="border-night-line bg-night-soft/40 border-t py-20 sm:py-24">
          <div className="shell">
            <Reveal>
              <p className="text-leaf font-mono text-[0.72rem] tracking-[0.16em] uppercase">
                {process.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="display mt-5 text-[2rem] sm:text-[2.6rem]">
                {process.title}
              </h2>
            </Reveal>

            <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {process.steps.map((step, i) => (
                <Reveal as="li" key={step.n} delay={i * 70}>
                  <div className="border-night-line h-full rounded-2xl border bg-white/[0.02] p-6">
                    <span className="text-night grid size-8 place-items-center rounded-full bg-white font-mono text-[0.72rem] font-semibold">
                      {step.n}
                    </span>
                    <h3 className="mt-5 text-[0.9875rem] font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2.5 text-[0.85rem] leading-relaxed text-white/55">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section className="border-night-line border-t py-20 sm:py-24">
          <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <h2 className="display text-[2rem] sm:text-[2.5rem] lg:sticky lg:top-28">
                Questions we get
                <br />
                <span className="ink-gradient">before we start.</span>
              </h2>
            </Reveal>

            <div>
              {faqs.map((faq, i) => (
                <Reveal key={faq.q} delay={i * 50}>
                  <details
                    name="ai-faq"
                    open={i === 0}
                    className="group border-night-line border-b py-1 first:border-t"
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                      <h3 className="group-hover:text-leaf text-[1.0625rem] font-semibold tracking-tight text-white transition-colors">
                        {faq.q}
                      </h3>
                      <span
                        className="border-night-line group-open:border-leaf group-open:bg-leaf group-open:text-night mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border text-white/50 transition-all duration-300 group-open:rotate-45"
                        aria-hidden
                      >
                        <Plus className="size-4" strokeWidth={2.25} />
                      </span>
                    </summary>
                    <p className="max-w-2xl pr-12 pb-6 text-[0.9375rem] leading-relaxed text-white/60">
                      {faq.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="border-night-line relative overflow-hidden border-t py-20 sm:py-28">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden
          >
            <div className="bg-leaf/14 absolute -bottom-32 left-1/4 size-[30rem] rounded-full blur-[140px]" />
            <div className="bg-brand/18 absolute -top-24 right-1/4 size-[26rem] rounded-full blur-[140px]" />
          </div>

          <div className="shell text-center">
            <Reveal>
              <h2 className="display mx-auto max-w-3xl text-[2.1rem] sm:text-[2.9rem]">
                {cta.title}
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="mx-auto mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-white/60">
                {cta.body}
              </p>
            </Reveal>
            <Reveal delay={150}>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <a
                  href={cta.primary.href}
                  className="text-night hover:bg-leaf rounded-full bg-white px-6 py-3.5 text-[0.9375rem] font-semibold transition-colors"
                >
                  {cta.primary.label}
                </a>
                <a
                  href={cta.secondary.href}
                  className="border-night-line rounded-full border px-6 py-3.5 text-[0.9375rem] font-semibold text-white/80 transition-colors hover:border-white/30 hover:text-white"
                >
                  {cta.secondary.label}
                </a>
              </div>
            </Reveal>
            <Reveal delay={210}>
              <p className="mt-8 text-[0.875rem] text-white/40">
                Or write to{" "}
                <a
                  href={`mailto:${company.email}`}
                  className="text-leaf underline underline-offset-2"
                >
                  {company.email}
                </a>
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer onDark />
    </>
  );
}
