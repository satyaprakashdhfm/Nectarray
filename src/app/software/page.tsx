import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageCta } from "@/components/layout/PageCta";
import { Software } from "@/components/sections/Software";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Software and web development — sites, web apps and internal tools",
  description:
    "Websites, web applications, e-commerce, dashboards and APIs. Typed, tested, fast and handed over as code you own outright.",
  path: "/software",
});

export default function SoftwarePage() {
  return (
    <>
      <Header />
      <main id="main" className="pt-[72px]">
        <Software asPage />
      </main>
      <PageCta />
      <Footer />
    </>
  );
}
