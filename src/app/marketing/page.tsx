import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageCta } from "@/components/layout/PageCta";
import { Marketing } from "@/components/sections/Marketing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Growth marketing — Meta Ads, Google Ads, SEO and analytics",
  description:
    "Paid media, organic content and the tracking that proves which of them worked. Meta and Google Ads, SEO, social management, WhatsApp and lifecycle, analytics and CRO.",
  path: "/marketing",
});

export default function MarketingPage() {
  return (
    <>
      <Header />
      <main id="main" className="pt-[72px]">
        <Marketing asPage />
      </main>
      <PageCta />
      <Footer />
    </>
  );
}
