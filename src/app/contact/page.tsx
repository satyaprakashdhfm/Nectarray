import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Tell NectArray what you are building. We reply to every enquiry within one business day.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Header />
      {/* No PageCta here — this page is the call to action */}
      <main id="main" className="pt-[72px]">
        <Contact asPage />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
