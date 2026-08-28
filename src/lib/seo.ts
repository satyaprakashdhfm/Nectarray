import { academy, company, faqs, pillars } from "@/lib/content";

export const siteUrl = "https://nectarray.com";

export const siteDescription =
  "NectArray is a software studio: web and product engineering, AI agents, growth marketing across Meta and Google, and live courses in Python, SQL and data science.";

const orgId = `${siteUrl}/#org`;

/**
 * JSON-LD describing the studio, its four practices, the flagship course and
 * the FAQ — so search engines can read the page's structure, not just its text.
 */
export function buildStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": orgId,
        name: company.name,
        description: company.tagline,
        email: company.email,
        url: siteUrl,
        areaServed: "Worldwide",
        sameAs: company.socials.map((social) => social.href),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services",
          itemListElement: pillars.map((practice) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: practice.title,
              description: practice.summary,
            },
          })),
        },
      },
      {
        "@type": "Course",
        name: academy.course.title,
        description: academy.course.summary,
        provider: { "@id": orgId },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: "P7D",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };
}
