import type { Metadata } from "next";
import { Suspense } from "react";
import { AboutCourse } from "@/components/academy/AboutCourse";
import { AuthLauncher } from "@/components/auth/AuthLauncher";
import { AcademyFaq } from "@/components/academy/AcademyFaq";
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
    "A live placement programme in Python, SQL and data science. Assignments reviewed and scored, and a block on getting hired. Built for people moving into data science and AI.",
  path: "/academy",
});

/**
 * The course page. No PageCta at the end — the page already closes on its
 * own enrolment form, and a second "get in touch" band under it would be
 * asking twice for the same thing.
 *
 * No in-page sub-nav either. It sat directly under the site header as a
 * second sticky bar with its own Enrol button, so every scroll happened
 * under two headers and two calls to action stacked on each other.
 *
 * Placement support is not its own section any more; it is one of the
 * offerings, which is where a reader meets it in the course of reading
 * rather than as a second pitch after the syllabus.
 */
export default function AcademyPage() {
  return (
    <>
      <Header />
      <main id="main">
        <AcademyHero />
        <AboutCourse />
        <Curriculum />
        <Offerings />
        <StudentVoices />
        <AcademyFaq />
        <EnrolForm />
      </main>
      <Footer />
      <FloatingActions />
      {/*
       * Suspense because it reads the query string, and without a boundary
       * one useSearchParams drags the whole page out of the static build.
       */}
      <Suspense fallback={null}>
        <AuthLauncher />
      </Suspense>
    </>
  );
}
