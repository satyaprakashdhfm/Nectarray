import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageCta } from "@/components/layout/PageCta";
import { Work } from "@/components/sections/Work";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Selected work",
  description:
    "The engagements NectArray currently has in flight across software, agentic AI, growth marketing and the Academy.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <Header />
      <main id="main" className="pt-[72px]">
        <Work asPage />
      </main>
      <PageCta />
      <Footer />
    </>
  );
}
