import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FieldRows } from "@/components/omniproof/FieldRows";
import { OmniMap } from "@/components/omniproof/OmniMap";
import { OMNI_ARTICLES } from "@/lib/content/omniproof";
import { postDate, readOmni, readingMinutes } from "@/lib/omniproof";
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
            on the map to fly into it, then a subfield to reach its pieces.
          </p>
        </div>

        {/* The map runs wider than the text: it is the thing to play with. */}
        <div className="mx-auto mt-10 w-full max-w-[120rem] px-3 sm:px-5 lg:px-8">
          <OmniMap />
        </div>

        <div className="shell mt-8">
          <FieldRows
            dates={Object.fromEntries(
              OMNI_ARTICLES.map((a) => [
                a.slug,
                `${postDate(a.date)} · ${minutes[a.slug]} min`,
              ]),
            )}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
