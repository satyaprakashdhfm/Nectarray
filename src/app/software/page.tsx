import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Software } from "@/components/sections/Software";
import { Integrations } from "@/components/software/Integrations";
import { QuoteSection } from "@/components/software/QuoteCta";
import { StackGrid } from "@/components/software/StackGrid";
import { WhyUs } from "@/components/software/WhyUs";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title:
    "Software & web development — websites, e-commerce, dashboards and apps",
  description:
    "Portfolio and business sites, e-commerce in any category, dashboards and internal tools, agentic AI and mobile apps. Integrated with Shiprocket, Petpooja, WhatsApp, Razorpay, Tally and anything else with an API — built by a small senior team for a fraction of agency cost.",
  path: "/software",
});

/**
 * The practice page, read top to bottom as one argument:
 *
 *   what we build      → find your own trade in the list
 *   what it plugs into → the software you already run is on there
 *   what it is built on → and we know your platform down to the service
 *   why us             → and it costs a fraction of the alternative
 *
 * The quote block appears twice — compact above the catalogue and in full
 * closing the page. Someone who arrived already knowing what they want
 * should not have to read four sections of chips to find the button, and
 * someone who read all of it should not have to scroll back up.
 *
 * It replaces the shared PageCta here rather than sitting above it: the two
 * were asking for the same thing in different words, one after the other,
 * which reads as neither being the real one. PageCta is untouched and still
 * closes every other route.
 */
export default function SoftwarePage() {
  return (
    <>
      <Header />
      <main id="main" className="pt-[72px]">
        <Software asPage />
        <Integrations />
        <StackGrid />
        <WhyUs />
      </main>
      <QuoteSection />
      <Footer />
    </>
  );
}
