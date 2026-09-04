import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageCta } from "@/components/layout/PageCta";
import { Software } from "@/components/sections/Software";
import { Integrations } from "@/components/software/Integrations";
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
 * The closing CTA stays last, so the price comparison is the final claim
 * before the reader is asked for anything.
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
      <PageCta
        title="Tell us what you are building."
        body="Send a short note and you will get a written scope and a fixed price against it — no retainer, no discovery fee, and a straight answer if we are not the right people for the job."
      />
      <Footer />
    </>
  );
}
