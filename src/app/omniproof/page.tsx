import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProofGraph } from "@/components/omniproof/ProofGraph";
import { OMNI_ARTICLES, fieldById } from "@/lib/content/omniproof";
import { postDate, readingMinutes } from "@/lib/blog";
import { readOmni } from "@/lib/omniproof";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Omniproof — the proofline of everything",
  description:
    "Five-minute reads on what LLMs and people, working together, are changing in mathematics, physics, chemistry, biotechnology, economics and computer science, and who it pays.",
  path: "/omniproof",
});

/**
 * The Omniproof index: the name, the theme line, then the root graph straight
 * away (no scroll reveal), then every article, newest first.
 */
export default async function OmniproofIndex() {
  const minutes = Object.fromEntries(
    await Promise.all(
      OMNI_ARTICLES.map(
        async (a) => [a.slug, readingMinutes(await readOmni(a.slug))] as const,
      ),
    ),
  );

  return (
    <>
      <Header />
      <main id="main" className="pt-[calc(3rem+var(--header-room))] pb-20">
        <div className="shell">
          <p className="eyebrow">NectArray · Omniproof</p>
          <h1 className="display text-ink mt-3 text-[2.75rem] leading-none sm:text-[4rem]">
            Omniproof
          </h1>
          <p className="text-ink mt-4 text-[1.375rem] font-medium sm:text-[1.625rem]">
            The proofline of everything.
          </p>
          <p className="text-ink-soft mt-3 max-w-2xl text-[1.0625rem] leading-relaxed">
            Where curiosity meets impact. Every piece is a five-minute read on
            something LLMs and people solved together, what it is worth to
            business and to society, and which fields it lands in. Pick a field
            on the map to follow its links.
          </p>

          <div className="mt-10">
            <ProofGraph />
          </div>

          <h2 className="text-ink mt-16 text-[1.25rem] font-semibold">
            All pieces
          </h2>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {OMNI_ARTICLES.map((a) => {
              const field = fieldById(a.field);
              return (
                <li key={a.slug}>
                  <Link
                    href={`/omniproof/${a.slug}`}
                    className="group border-line bg-surface hover:border-brand flex h-full flex-col rounded-2xl border p-5 transition-colors"
                  >
                    <p
                      className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase"
                      style={{ color: field.color }}
                    >
                      {field.label}
                    </p>
                    <p className="text-ink group-hover:text-brand-deep mt-1.5 text-[1.0625rem] leading-snug font-semibold transition-colors">
                      {a.title}
                    </p>
                    <p className="text-ink-soft mt-2 flex-1 text-[0.9375rem] leading-relaxed">
                      {a.description}
                    </p>
                    <p className="text-ink-faint mt-4 flex items-center justify-between text-[0.8125rem]">
                      {postDate(a.date)} · {minutes[a.slug]} min read
                      <ArrowRight
                        className="text-brand-deep size-4"
                        aria-hidden
                      />
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
