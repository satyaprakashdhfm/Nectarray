import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Markdown } from "@/components/dashboard/Markdown";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { company } from "@/lib/content";
import { OMNI_ARTICLES, fieldById, omniBySlug } from "@/lib/content/omniproof";
import { postDate, readOmni, readingMinutes } from "@/lib/omniproof";
import { siteUrl } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return OMNI_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const article = omniBySlug((await params).slug);
  if (!article) return {};
  const path = `/omniproof/${article.slug}`;
  return {
    title: `${article.title} — Omniproof`,
    description: article.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: `${siteUrl}${path}`,
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
  };
}

/**
 * One Omniproof piece: the markdown body, then "Where this lands" drawn from
 * the article's `lands` (the same data the root graph links with), then the
 * source it was built on.
 */
export default async function OmniArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const article = omniBySlug((await params).slug);
  if (!article) notFound();

  const body = await readOmni(article.slug);
  const field = fieldById(article.field);
  const minutes = readingMinutes(
    [body, ...article.lands.map((l) => l.impact)].join(" "),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    url: `${siteUrl}/omniproof/${article.slug}`,
    mainEntityOfPage: `${siteUrl}/omniproof/${article.slug}`,
    author: { "@type": "Organization", name: company.name, url: siteUrl },
    publisher: {
      "@type": "Organization",
      name: company.name,
      logo: { "@type": "ImageObject", url: `${siteUrl}/logo-square.png` },
    },
  };

  return (
    <>
      <Header />
      <main id="main" className="pt-[calc(2.5rem+var(--header-room))] pb-16">
        <script
          type="application/ld+json"
          // A title holding "</script>" must not end the tag early.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <article className="shell">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/omniproof"
              className="text-ink-soft hover:text-ink inline-flex items-center gap-2 text-[0.875rem] font-medium transition-colors"
            >
              <ArrowLeft className="size-4" strokeWidth={2} aria-hidden />
              Omniproof
            </Link>
            <p
              className="mt-6 text-[0.8125rem] font-semibold tracking-[0.08em] uppercase"
              style={{ color: field.color }}
            >
              {field.label}
            </p>
            <h1 className="display text-ink mt-2 text-[2rem] leading-tight sm:text-[2.625rem]">
              {article.title}
            </h1>
            <p className="text-ink-soft mt-4 text-[1.0625rem] leading-relaxed">
              {article.description}
            </p>
            <p className="text-ink-faint mt-4 text-[0.875rem]">
              {company.name} · {postDate(article.date)} · {minutes} min read
            </p>

            {article.cover && (
              // eslint-disable-next-line @next/next/no-img-element -- an SVG illustration; next/image adds nothing for vectors
              <img
                src={article.cover.src}
                alt={article.cover.alt}
                width={1200}
                height={630}
                className="border-line bg-mist mt-8 aspect-[1200/630] w-full rounded-2xl border object-cover"
              />
            )}

            <div className="mt-10">
              <Markdown>{body}</Markdown>
            </div>

            <section className="mt-12" aria-labelledby="lands">
              <h2 id="lands" className="text-ink text-[1.5rem] font-semibold">
                Where this lands
              </h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {article.lands.map((l) => {
                  const to = fieldById(l.field);
                  return (
                    <li
                      key={l.field}
                      className="border-line bg-surface rounded-2xl border p-5"
                      style={{ borderTopColor: to.color, borderTopWidth: 3 }}
                    >
                      <p className="text-ink text-[1rem] font-semibold">
                        {to.label}
                      </p>
                      <p className="text-ink-soft mt-1.5 text-[0.9375rem] leading-relaxed">
                        {l.impact}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </section>

            <p className="text-ink-faint border-line mt-10 border-t pt-6 text-[0.875rem]">
              Built on{" "}
              <a
                href={article.source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-deep inline-flex items-center gap-1 font-medium hover:underline"
              >
                {article.source.label}
                <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
              . Results are described as the guests reported them; several were
              still being checked by the wider community at the time of writing.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
