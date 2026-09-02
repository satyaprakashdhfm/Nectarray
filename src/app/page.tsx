import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageCta } from "@/components/layout/PageCta";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Practices } from "@/components/sections/Practices";
import { buildStructuredData } from "@/lib/seo";

/**
 * The homepage is deliberately short: it says who we are, what the four
 * practices are, and sends the reader to the practice page they came for.
 * Every practice now has its own route, so nothing here needs to repeat it.
 */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildStructuredData()),
        }}
      />

      <Header />

      <main id="main">
        <Hero />
        <Marquee />
        <Practices />
      </main>

      <PageCta />
      <Footer />
    </>
  );
}
