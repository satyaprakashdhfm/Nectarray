import {
  academy,
  company,
  faqs,
  liveSocials,
  nav,
  marketing,
  pillars,
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
  "NectArray is a software studio in Bengaluru: web and product engineering, AI agents and chatbots, growth marketing across Meta and Google Ads, and live courses in Python, SQL and data science.";

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
        /*
         * Spellings a person might reasonably type for a coined name.
         * Google currently spell-corrects "nectarray" to "nextarray" because
         * it has no record of the word; listing the real variants helps it
         * map them all to this one entity rather than guessing.
         */
        alternateName: ["Nectarray", "Nect Array", "NectArray Studio"],
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
          addressLocality: "Bengaluru",
          addressRegion: "Karnataka",
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
        // Only profiles that actually exist — see the note in content/site.ts.
        ...(liveSocials.length
          ? { sameAs: liveSocials.map((social) => social.href) }
          : {}),
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
        // The site's real routes, so a crawler has a map of the pages.
        "@type": "ItemList",
        name: `${company.name} pages`,
        itemListElement: nav.map((item, index) => ({
          "@type": "SiteNavigationElement",
          position: index + 1,
          name: item.label,
          url: `${siteUrl}${item.href}`,
        })),
      },
      {
        "@type": "Course",
        name: academy.course.title,
        description: academy.course.summary,
        url: `${siteUrl}/academy`,
        provider: { "@id": orgId },
        inLanguage: "en",
        teaches: academy.course.outcomes,
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "Online",
          // Effort per week, not elapsed time — P7D claimed seven days of
          // work a week. The cohort runs 6–8 hrs/week over 12 weeks.
          courseWorkload: "PT7H",
          instructor: { "@id": orgId },
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/contact#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };
}

/**
 * Metadata for a sub-page. Titles run through the template in the root
 * layout, so pass the page's own name only — not the brand.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website" as const,
      url: `${siteUrl}${path}`,
      title,
      description,
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
  };
}
