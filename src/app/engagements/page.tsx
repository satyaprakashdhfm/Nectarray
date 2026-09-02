import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageCta } from "@/components/layout/PageCta";
import { Pricing } from "@/components/sections/Pricing";
import { Process } from "@/components/sections/Process";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "How we work — engagements and process",
  description:
    "Three ways to work with NectArray — a fixed-scope project, an ongoing retainer, or a seat in the Academy — and the four steps every engagement runs through.",
  path: "/engagements",
});

export default function EngagementsPage() {
  return (
    <>
      <Header />
      <main id="main" className="pt-[72px]">
        <Pricing asPage />
        <Process />
      </main>
      <PageCta />
      <Footer />
    </>
  );
}
