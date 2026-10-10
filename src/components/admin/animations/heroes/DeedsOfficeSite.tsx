"use client";

import {
  FileJourney,
  type JourneyCopy,
  type JourneyStep,
} from "./DeedsFileJourney";
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
  TAGLINE,
  Team,
  WhatsAppFloat,
  container,
} from "./DeedsParts";

/**
 * The Deeds & Co. home page with the scroll flow of gokiwi.in: the firm's
 * film under a tinted panel that slides up over it, the firm's standard
 * filling in word by word, and then the client's title file, in 3D,
 * carrying the reader down the page. It drops in, rests beside each step
 * and flies across to the next: the front desk, the associate's desk, the
 * records, the khata and plans, the senior advocate's stamp, and the phone
 * the signed opinion arrives on (DeedsFileJourney.tsx). After it, the live
 * site's sections from DeedsParts.tsx on their alternating bands: about,
 * the team, practices, approach, locations and careers, the call to action
 * and the footer.
 *
 * With `full` (the page at /showcase/deeds-and-co/office) it opens with the
 * Bar Council disclaimer and keeps the WhatsApp button in the corner.
 */

const STEPS: JourneyStep[] = [
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

const COPY: JourneyCopy = {
  title: "Property lawyers for Bengaluru.",
  body: "Title checks, sale deeds, registration and khata, handled by one team from the first document to the keys.",
  primary: "Book a title check",
  secondary: "Our practices",
  fill: `${TAGLINE.join(" ")} Property in Karnataka is decided by its documents: the chain of title, the revenue records in Bhoomi, the registered instruments in Kaveri, and the approvals behind them. We read each of them before we advise.`,
  accent:
    "the chain of title, the revenue records in Bhoomi, the registered instruments in Kaveri,",
  last: "Book a title check",
};

const band = (tinted: boolean) =>
  `py-12 @xl:py-16 ${tinted ? "bg-[#faf1f0]" : "bg-white"}`;

export function DeedsOfficeSite({ full = false }: { full?: boolean }) {
  return (
    <div className={DEEDS_SHELL}>
      <div
        className={`${HEADER_HEIGHT} [&_:is(h1,h2)]:font-[family-name:var(--font-outfit,ui-sans-serif)]`}
      >
        {full && <DisclaimerGate />}
        <DeedsHeader />
        <main className="overflow-x-clip">
          <FileJourney steps={STEPS} copy={COPY} />

          <section id="about" className={band(false)}>
            <div className={container}>
              <About />
            </div>
          </section>
          <section id="team" className={band(true)}>
            <div className={container}>
              <Team />
            </div>
          </section>
          <section id="practices" className={band(false)}>
            <div className={container}>
              <Practices />
            </div>
          </section>
          <section className={band(true)}>
            <div className={container}>
              <Approach />
            </div>
          </section>
          <section id="careers" className={band(false)}>
            <div className={container}>
              <Locations />
            </div>
          </section>
          <section className={band(true)}>
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
