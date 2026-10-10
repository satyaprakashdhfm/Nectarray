"use client";

import { OfficeStory } from "./LawOfficeScrollSite";
import {
  About,
  Approach,
  CtaBand,
  DEEDS_SHELL,
  DeedsFooter,
  DeedsHeader,
  DisclaimerGate,
  HEADER_HEIGHT,
  Locations,
  Practices,
  Tagline,
  Team,
  WhatsAppFloat,
  container,
} from "./DeedsParts";

/**
 * The Deeds & Co. home page told by its office seen from above: the
 * "office from above" template's story (the client hands his file in at
 * reception, it is searched against the records, held against the plans,
 * signed and stamped by a senior advocate in the cabin, and handed back at
 * the meeting table, the view pulling out to the whole office with the
 * seal) in the firm's maroon and its own words, under the firm's header.
 * After it, the live site's sections from DeedsParts.tsx on their
 * alternating bands: the standard, about, the team, practices, approach,
 * locations and careers, the call to action and the footer.
 *
 * The office reads its colours from the palette variables, set here to
 * the firm's. With `full` (the page at /showcase/deeds-and-co/office) it
 * opens with the Bar Council disclaimer and keeps the WhatsApp button in
 * the corner.
 */

const OFFICE_COLOURS = {
  "--p": "#7a0204",
  "--p-on": "#ffffff",
  "--p-dark": "#5e0103",
  "--p-light": "#faf1f0",
  "--s": "#b08968",
  "--s-light": "#f4ebe4",
  "--t": "#45100f",
} as React.CSSProperties;

const STEPS = [
  {
    title: "Walk in with your papers.",
    text: "Bring what the seller gave you. We take it from the front desk, and one advocate holds your file from here.",
  },
  {
    title: "Your file goes to the right desk.",
    text: "One associate owns your matter from the first day and walks it through every check.",
    points: ["A written status at each stage", "One point of contact, always"],
  },
  {
    title: "We search the records.",
    text: "Thirty years of title, read against Kaveri's registered instruments and the encumbrance certificates.",
    points: [
      "Every owner and every transfer",
      "No mortgages, attachments or disputes",
    ],
  },
  {
    title: "Khata, plans and approvals, checked.",
    text: "Bhoomi RTCs, the e-Khata and the BBMP or BDA sanction, held against the building on the ground.",
    points: ["Approved plan and occupancy", "Tax and dues paid up"],
  },
  {
    title: "Signed by a senior advocate.",
    text: "Every finding is reviewed in the cabin, and the title opinion is signed and stamped.",
  },
  {
    title: "Back in your hands, clear.",
    text: "We sit with you, explain the opinion line by line, and hand over a file your bank will accept.",
  },
];

const COPY = {
  title: "Property lawyers for Bengaluru.",
  body: "Title checks, sale deeds, registration and khata, handled by one team from the first document to the keys.",
  primary: "Book a title check",
  secondary: "Our practices",
  hint: "Scroll to follow a file through our office.",
  sealTitle: "Every title clear.",
  sealBody: "Records read, plans checked, opinion signed and stamped.",
};

const band = (tinted: boolean) =>
  `py-12 @xl:py-16 ${tinted ? "bg-[#faf1f0]" : "bg-white"}`;

export function DeedsOfficeSite({ full = false }: { full?: boolean }) {
  return (
    <div className={DEEDS_SHELL}>
      <div
        className={`${HEADER_HEIGHT} [&_:is(h1,h2)]:font-[family-name:var(--font-outfit,ui-sans-serif)]`}
        style={OFFICE_COLOURS}
      >
        {full && <DisclaimerGate />}
        <DeedsHeader />
        <main id="top" className="overflow-x-clip">
          <OfficeStory steps={STEPS} copy={COPY} split />

          <section aria-label="Our standard" className={band(false)}>
            <div className={`${container} text-center`}>
              <Tagline className="@xl:py-4" />
            </div>
          </section>
          <section id="about" className={band(true)}>
            <div className={container}>
              <About />
            </div>
          </section>
          <section id="team" className={band(false)}>
            <div className={container}>
              <Team />
            </div>
          </section>
          <section id="practices" className={band(true)}>
            <div className={container}>
              <Practices />
            </div>
          </section>
          <section className={band(false)}>
            <div className={container}>
              <Approach />
            </div>
          </section>
          <section id="careers" className={band(true)}>
            <div className={container}>
              <Locations />
            </div>
          </section>
          <section className={band(false)}>
            <div className={container}>
              <CtaBand />
            </div>
          </section>
        </main>
        <DeedsFooter />
        {full && <WhatsAppFloat />}
      </div>
    </div>
  );
}
