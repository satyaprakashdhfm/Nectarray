import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Markdown } from "@/components/dashboard/Markdown";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageCta } from "@/components/layout/PageCta";
import { BLOG_POSTS, BLOG_SERVICES, postBySlug } from "@/lib/content/blog";
import { company } from "@/lib/content";
import { postDate, readPost, readingMinutes } from "@/lib/blog";
import { siteUrl } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = postBySlug((await params).slug);
  if (!post) return {};
  const path = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: [post.keyword],
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: `${siteUrl}${path}`,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
  };
}

/**
 * One article: cover, the markdown body in the same typography as the
 * course notes, then a pointer to the practice it belongs to and two more
 * articles from the same one.
 */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = postBySlug((await params).slug);
  if (!post) notFound();

  const body = await readPost(post.slug);
  const service = BLOG_SERVICES[post.service];
  const more = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.service === post.service,
  )
    .concat(BLOG_POSTS.filter((p) => p.service !== post.service))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    image: `${siteUrl}/og.png`,
    url: `${siteUrl}/blog/${post.slug}`,
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    keywords: post.keyword,
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <article className="shell">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="text-ink-soft hover:text-ink inline-flex items-center gap-2 text-[0.875rem] font-medium transition-colors"
            >
              <ArrowLeft className="size-4" strokeWidth={2} aria-hidden />
              All articles
            </Link>
            <p className="text-brand-deep mt-6 text-[0.8125rem] font-semibold tracking-[0.08em] uppercase">
              <Link href={service.href} className="hover:text-brand">
                {service.label}
              </Link>
            </p>
            <h1 className="display text-ink mt-2 text-[2rem] leading-tight sm:text-[2.625rem]">
              {post.title}
            </h1>
            <p className="text-ink-soft mt-4 text-[1.0625rem] leading-relaxed">
              {post.description}
            </p>
            <p className="text-ink-faint mt-4 text-[0.875rem]">
              {company.name} team · {postDate(post.date)} ·{" "}
              {readingMinutes(body)} min read
            </p>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element -- an SVG illustration; next/image adds nothing for vectors */}
          <img
            src={`/blog/${post.slug}/cover.svg`}
            alt={post.coverAlt}
            width={1200}
            height={630}
            className="border-line bg-mist mx-auto mt-8 aspect-[1200/630] w-full max-w-4xl rounded-2xl border object-cover"
          />

          <div className="mx-auto mt-10 max-w-3xl">
            <Markdown>{body}</Markdown>

            <aside className="border-line bg-brand-wash mt-12 rounded-2xl border p-6 sm:p-7">
              <p className="text-ink text-[1.0625rem] font-semibold">
                This is what our {service.label} team does every week.
              </p>
              <p className="text-ink-soft mt-1.5 text-[0.9375rem] leading-relaxed">
                If you would rather talk it through than read about it, send us
                a note. We reply within one business day.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/contact#enquiry"
                  className="bg-ink text-cta-fg hover:bg-brand-deep inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.9375rem] font-semibold transition-colors"
                >
                  Talk to us
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link
                  href={service.href}
                  className="border-line bg-surface text-ink hover:border-brand inline-flex items-center rounded-full border px-5 py-2.5 text-[0.9375rem] font-semibold transition-colors"
                >
                  {service.cta}
                </Link>
              </div>
            </aside>
          </div>
        </article>

        <section className="shell mt-16">
          <h2 className="text-ink text-[1.25rem] font-semibold">Read next</h2>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="group border-line bg-surface hover:border-brand flex h-full flex-col overflow-hidden rounded-2xl border transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- SVG illustration */}
                  <img
                    src={`/blog/${p.slug}/cover.svg`}
                    alt=""
                    width={1200}
                    height={630}
                    loading="lazy"
                    className="bg-mist aspect-[1200/630] w-full object-cover"
                  />
                  <div className="p-5">
                    <p className="text-brand-deep text-[0.75rem] font-semibold tracking-[0.08em] uppercase">
                      {BLOG_SERVICES[p.service].label}
                    </p>
                    <p className="text-ink group-hover:text-brand-deep mt-1.5 text-[1rem] leading-snug font-semibold transition-colors">
                      {p.title}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <PageCta />
      <Footer />
    </>
  );
}
