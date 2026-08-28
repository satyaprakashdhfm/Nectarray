import {
  academy,
  company,
  faqs,
  marketing,
  pillars,
  sectionRail,
  software,
} from "@/lib/content";

/**
 * The canonical origin — no trailing slash.
 *
 * This must match whichever host Vercel serves as primary. The apex and `www`
 * both resolve, but only one may be canonical: pointing canonical tags at a
 * host that 308-redirects splits ranking signals between the two.
 */
export const siteUrl = "https://nectarray.com";

export const siteDescription =
  "NectArray is a software studio in Hyderabad: web and product engineering, AI agents and chatbots, growth marketing across Meta and Google Ads, and live courses in Python, SQL and data science.";

const orgId = `${siteUrl}/#organization`;
const siteId = `${siteUrl}/#website`;

/**
 * JSON-LD describing the studio, its services, the flagship course and the
 * FAQ.
 *
 * The Organization node carries `logo`, which is what Google reads to show a
 * brand image beside the result — a favicon alone is not enough. The
 * ItemList of sections gives crawlers named, linkable parts of a
 * single-page site, which is the only real lever for sitelinks when there is
 * one URL.
 */
export function buildStructuredData() {
  const services = [
    ...pillars.map((practice) => ({
      name: practice.title,
      description: practice.summary,
    })),
    ...marketing.channels.map((channel) => ({
      name: channel.title,
      description: channel.body,
    })),
    ...software.services.map((service) => ({
      name: service.title,
      description: service.body,
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": orgId,
        name: company.name,
        alternateName: "NectArray Studio",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/logo-square.png`,
          width: 512,
          height: 512,
          caption: company.name,
        },
        image: `${siteUrl}/og.png`,
        description: siteDescription,
        slogan: company.tagline,
        email: company.email,
        telephone: company.phone,
        foundingDate: "2026",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Hyderabad",
          addressRegion: "Telangana",
          addressCountry: "IN",
        },
        areaServed: [
          { "@type": "Country", name: "India" },
          { "@type": "Place", name: "Worldwide" },
        ],
        knowsAbout: [
          "Web development",
          "Next.js",
          "AI agents",
          "Chatbots",
          "Search engine optimisation",
          "Meta Ads",
          "Google Ads",
          "Python",
          "SQL",
          "Data science",
        ],
        sameAs: company.socials.map((social) => social.href),
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: company.email,
          availableLanguage: ["English", "Telugu", "Hindi"],
          areaServed: "Worldwide",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services",
          itemListElement: services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.name,
              description: service.description,
              provider: { "@id": orgId },
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        url: siteUrl,
        name: company.name,
        description: siteDescription,
        publisher: { "@id": orgId },
        inLanguage: "en",
      },
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/#webpage`,
        url: siteUrl,
        name: `${company.name} — ${company.tagline}`,
        description: siteDescription,
        isPartOf: { "@id": siteId },
        about: { "@id": orgId },
        primaryImageOfPage: `${siteUrl}/og.png`,
      },
      {
        // Named anchors on a one-page site — the closest thing to a route map
        // a crawler can use here.
        "@type": "ItemList",
        name: `${company.name} sections`,
        itemListElement: sectionRail.map((section, index) => ({
          "@type": "SiteNavigationElement",
          position: index + 1,
          name: section.label,
          url: `${siteUrl}/#${section.href}`,
        })),
      },
      {
        "@type": "Course",
        name: academy.course.title,
        description: academy.course.summary,
        url: `${siteUrl}/#academy`,
        provider: { "@id": orgId },
        inLanguage: "en",
        teaches: academy.course.outcomes,
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "Online",
          courseWorkload: "P7D",
          instructor: { "@id": orgId },
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };
}
