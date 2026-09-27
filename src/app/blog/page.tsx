import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageCta } from "@/components/layout/PageCta";
import { BLOG_POSTS, BLOG_SERVICES, type BlogPost } from "@/lib/content/blog";
import { postDate, readPost, readingMinutes } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog — software, AI agents, marketing and data careers",
  description:
    "Plain guides from the NectArray team on custom software, AI agents, small-business marketing, and getting hired in data science.",
  path: "/blog",
});

/**
 * Every article, newest first. The newest one gets the wide card; the rest
 * sit in a grid, each tagged with the practice it belongs to.
 */
export default async function BlogIndex() {
  const minutes = Object.fromEntries(
    await Promise.all(
      BLOG_POSTS.map(
        async (p) => [p.slug, readingMinutes(await readPost(p.slug))] as const,
      ),
    ),
  );
  const [lead, ...rest] = BLOG_POSTS;

  return (
    <>
      <Header />
      <main id="main" className="pt-[calc(3rem+var(--header-room))] pb-20">
        <div className="shell">
          <p className="eyebrow">NectArray blog</p>
          <h1 className="display text-ink mt-3 max-w-3xl text-[2.25rem] leading-tight sm:text-[3rem]">
            Notes from the work
          </h1>
          <p className="text-ink-soft mt-4 max-w-2xl text-[1.0625rem] leading-relaxed">
            What we have learned building software and AI agents for clients,
            running their marketing, and teaching people to get hired in data.
          </p>

          <Card post={lead} minutes={minutes[lead.slug]} wide />

          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <li key={post.slug}>
                <Card post={post} minutes={minutes[post.slug]} />
              </li>
            ))}
          </ul>
        </div>
      </main>
      <PageCta />
      <Footer />
    </>
  );
}

function Card({
  post,
  minutes,
  wide = false,
}: {
  post: BlogPost;
  minutes: number;
  wide?: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group border-line bg-surface hover:border-brand flex h-full overflow-hidden rounded-2xl border transition-colors ${
        wide ? "mt-10 flex-col md:flex-row" : "flex-col"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- an SVG illustration; next/image adds nothing for vectors */}
      <img
        src={`/blog/${post.slug}/cover.svg`}
        alt=""
        width={1200}
        height={630}
        loading={wide ? "eager" : "lazy"}
        className={`bg-mist aspect-[1200/630] w-full object-cover ${
          wide ? "md:w-[55%]" : ""
        }`}
      />
      <div className={`flex flex-1 flex-col p-5 ${wide ? "md:p-8" : ""}`}>
        <p className="text-brand-deep text-[0.75rem] font-semibold tracking-[0.08em] uppercase">
          {BLOG_SERVICES[post.service].label}
        </p>
        <h2
          className={`text-ink group-hover:text-brand-deep mt-2 font-semibold transition-colors ${
            wide
              ? "text-[1.5rem] leading-snug sm:text-[1.75rem]"
              : "text-[1.125rem] leading-snug"
          }`}
        >
          {post.title}
        </h2>
        <p className="text-ink-soft mt-2 line-clamp-3 text-[0.9375rem] leading-relaxed">
          {post.description}
        </p>
        <p className="text-ink-faint mt-auto flex items-center justify-between gap-3 pt-4 text-[0.8125rem]">
          <span>
            {postDate(post.date)} · {minutes} min read
          </span>
          <ArrowRight
            className="text-brand-deep size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </p>
      </div>
    </Link>
  );
}
