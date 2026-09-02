import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageCta } from "@/components/layout/PageCta";
import { Academy } from "@/components/sections/Academy";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "NectArray Academy — live Python, SQL and data science course",
  description:
    "A sixteen-week live programme taking you from no code at all to building and presenting real data projects, taught by engineers who ship client work every week.",
  path: "/academy",
});

export default function AcademyPage() {
  return (
    <>
      <Header />
      <main id="main" className="pt-[72px]">
        <Academy asPage />
      </main>
      <PageCta />
      <Footer />
    </>
  );
}
