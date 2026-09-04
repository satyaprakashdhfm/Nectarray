import type { Metadata } from "next";
import { AboutCourse } from "@/components/academy/AboutCourse";
import { AcademyFaq } from "@/components/academy/AcademyFaq";
import { AcademyNav } from "@/components/academy/AcademyNav";
import { Curriculum } from "@/components/academy/Curriculum";
import { EnrolForm } from "@/components/academy/EnrolForm";
import { AcademyHero } from "@/components/academy/AcademyHero";
import { FloatingActions } from "@/components/academy/FloatingActions";
import { StudentVoices } from "@/components/academy/StudentVoices";
import { Offerings } from "@/components/academy/Offerings";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Python, SQL & Data Science — live placement programme | NectArray",
  description:
    "A live placement programme in Python, SQL and data science. A small group, assignments reviewed and scored, and a block on getting hired. Built for people moving into data science and AI.",
  path: "/academy",
});

/**
 * The course page. No PageCta at the end — the page already closes on its
 * own enrolment form, and a second "get in touch" band under it would be
 * asking twice for the same thing.
 */
export default function AcademyPage() {
  return (
    <>
      <Header />
      <main id="main" className="pt-[72px]">
        <AcademyHero />
        <AcademyNav />
        <AboutCourse />
        <Offerings />
        <Curriculum />
        <StudentVoices />
        <AcademyFaq />
        <EnrolForm />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
