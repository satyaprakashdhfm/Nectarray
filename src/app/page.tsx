import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SectionBar } from "@/components/layout/SectionBar";
import { SectionRail } from "@/components/layout/SectionRail";
import { Academy } from "@/components/sections/Academy";
import { AgenticAI } from "@/components/sections/AgenticAI";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Marketing } from "@/components/sections/Marketing";
import { Marquee } from "@/components/sections/Marquee";
import { Practices } from "@/components/sections/Practices";
import { Pricing } from "@/components/sections/Pricing";
import { Process } from "@/components/sections/Process";
import { Software } from "@/components/sections/Software";
import { Testimonials } from "@/components/sections/Testimonials";
import { Work } from "@/components/sections/Work";
import { buildStructuredData } from "@/lib/seo";

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

      {/* Section index: vertical rail from 1440px, horizontal bar below it */}
      <SectionRail />
      <SectionBar />

      <main id="main">
        <Hero />
        <Marquee />
        <Practices />
        <Marketing />
        <Software />
        <AgenticAI />
        <Academy />
        <Process />
        <Work />
        <Testimonials />
        <Pricing />
        <Faq />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
