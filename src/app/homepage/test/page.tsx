import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageCta } from "@/components/layout/PageCta";
import { Practices } from "@/components/sections/Practices";
import { EngineHero } from "@/components/sections/engine/EngineHero";

/**
 * A preview of the homepage with the new 3D hero, THE DIGITAL GROWTH
 * ENGINE. Identical to / below the hero; kept out of search until it
 * replaces the live one.
 */
export const metadata: Metadata = {
  title: "Homepage preview",
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

export default function HomepageTest() {
  return (
    <>
      <Header dark />
      <main id="main">
        <EngineHero />
        <Practices />
      </main>
      <PageCta />
      <Footer />
    </>
  );
}
