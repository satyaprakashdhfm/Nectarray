/**
 * The Animations tab: animated hero sections, grouped by the kind of website
 * they suit.
 *
 * Unlike the Elements tab these are React components, not HTML strings: the
 * motion needs JavaScript, and the Elements previews run in iframes with
 * scripts switched off. Each one lives in its own file under
 * src/components/admin/animations/heroes/, imports nothing but React and
 * Motion (motion.dev, `npm i motion`), and is coloured only through the
 * palette variables (--p, --s, --t and their -light, -dark, -on shades) — so
 * the file a visitor copies is the whole of it.
 *
 * Layout answers to the hero's own width through container queries (`@3xl:`
 * and friends) rather than the screen's, which is what lets the preview show
 * the real phone layout at phone width inside a laptop window.
 *
 * This file is the catalogue only — names, notes, which file — so the server
 * page can read the sources without importing the components.
 */

export type AnimationCategory = {
  id: string;
  label: string;
  blurb: string;
};

export type AnimationEntry = {
  id: string;
  category: string;
  name: string;
  /** What moves, and when it suits, in a sentence or two. */
  note: string;
  /** The component's file name under animations/heroes/. */
  file: string;
  /** What to install for it, when it needs more than Motion. */
  install?: string;
  /** Other files it imports from heroes/, shown and copied after it. */
  with?: string[];
};

const THREE_STACK =
  "npm i motion three @react-three/fiber @react-three/postprocessing postprocessing";

export const ANIMATION_CATEGORIES: AnimationCategory[] = [
  {
    id: "cinematic",
    label: "Cinematic 3D",
    blurb:
      "Real-time 3D loops that play like a product film: lit scenes, bloom, a slow camera. Built with three.js, so they take your colours and weigh far less than a video.",
  },
  {
    id: "scroll",
    label: "Scroll stories",
    blurb:
      "The scroll is the playhead: text fills, cards fly into phones, a pinned phone changes as features pass. Scroll the page to play them.",
  },
  {
    id: "saas",
    label: "SaaS and software",
    blurb: "Product launches and dashboards: the product rising into view.",
  },
  {
    id: "ai",
    label: "AI and agents",
    blurb: "Show the thing thinking: typing, streaming, tools being called.",
  },
  {
    id: "ecommerce",
    label: "E-commerce and fashion",
    blurb: "The product is the hero: reveals, swatches and rotating picks.",
  },
  {
    id: "agency",
    label: "Agency and portfolio",
    blurb: "Big type that moves, and a cursor that has something to play with.",
  },
  {
    id: "education",
    label: "Education and courses",
    blurb: "Proof that adds up and a path that draws itself.",
  },
  {
    id: "fintech",
    label: "Finance and fintech",
    blurb: "Numbers that tick, charts that draw, cards that fan out.",
  },
  {
    id: "health",
    label: "Health and wellness",
    blurb: "Slow, calm motion: breathing shapes and a steady pulse.",
  },
  {
    id: "travel",
    label: "Real estate and travel",
    blurb: "Let the photo do it: slow zooms, parallax and a gallery that lands.",
  },
  {
    id: "food",
    label: "Food and restaurants",
    blurb:
      "Kitchens and restaurants seen from above: the order, the stove, the pass and the rider, played as the page scrolls.",
  },
  {
    id: "legal",
    label: "Law and legal",
    blurb:
      "Show the work behind the advice: files changing hands, papers checked, an opinion signed. Calm, clear and on white.",
  },
];

export const ANIMATIONS: AnimationEntry[] = [
  {
    id: "clinic-care-site",
    category: "health",
    name: "Full clinic website, calm and alive",
    note: "A whole one-page site in a calm register, each section moving its own way: the hero breathes, with soft colour that drifts to the pointer and a live heartbeat on a glass card; the visit is a dial the scroll turns through registration, vitals, the doctor, the lab and the pharmacy; the lab fills its tubes, spins the centrifuge and draws the report; booking picks a slot by itself; and a week's pill box fills dose by dose.",
    file: "ClinicCareSite.tsx",
    with: ["SiteParts.tsx"],
  },
  {
    id: "commerce-city-site",
    category: "ecommerce",
    name: "Full same-day delivery website, the city alive",
    note: "A whole one-page site where every section moves differently: the hero is the city from above, with orders popping over homes, vans driving the roads from the hub and homes ticking Delivered; orders from every channel stream into a live feed; a conveyor scans parcels and sorts them down chutes by area; a pinned phone tracks one parcel as the scroll drives the van to the door; and the delivery area lights up pincode by pincode.",
    file: "CommerceCitySite.tsx",
    with: ["SiteParts.tsx"],
  },
  {
    id: "kitchen-taste-site",
    category: "food",
    name: "Full cloud kitchen website, close to the food",
    note: "A whole one-page site where every section moves differently: the hero builds a thali from above, bowls springing onto the plate, rotis sliding in, steam curling up and the plate tilting to the pointer; a knife slices a carrot into rounds; the scroll rides a scooter along a winding road while the minutes count to the door; the menu spins each dish onto its plate; and four pans sizzle on the stove.",
    file: "KitchenTasteSite.tsx",
    with: ["SiteParts.tsx"],
  },
  {
    id: "law-journey-site",
    category: "legal",
    name: "Full law firm website, the client's visit plays as you scroll",
    note: "A whole one-page site for a sample firm, laid out like a real one: about us, practice areas, partners, team, how we work, insights and contact, on the left, one after another at their own height. In a narrow column on the right (about a third of the width), with a timeline beside it, the client's visit stays in view and plays with the scroll in illustrated scenes, timed to arrive with their sections and feathered into the page on every edge: he walks in and is sent through by reception, hands his file over in the meeting room as a partner joins, and the documents are examined, ticked and stamped. Inside a scene the camera and room never change and only the people move, so each picture dissolves into the next like stop-motion while the scene slowly pushes in; between scenes the cut is quick. A numbered caption names each step. The pictures were made with Gemini and live in public/animations/law-journey/. Scroll the page to play it.",
    file: "LawJourneySite.tsx",
  },
  {
    id: "law-office-scroll-site",
    category: "legal",
    name: "Full law firm website, the office from above",
    note: "A whole one-page site. The office, seen from above, is the full background, out to the paving and trees around it, and the words scroll over it on the left (below it on a phone) while the scroll plays the story: the client walks in and hands the file over at reception, an associate carries it to the records desk where it is searched on the computer, then to the plan desk, then into the senior advocate's cabin to be stamped, and back to the client at the meeting table. The view zooms into each desk and pulls out to the whole office with the Verified seal. Then services, numbers, reviews, questions and footer. Scroll the page to play it.",
    file: "LawOfficeScrollSite.tsx",
  },
  {
    id: "law-firm-scroll-site",
    category: "legal",
    name: "Full law firm website, the file that flows on scroll",
    note: "A whole one-page site built around a 3D property file, like the card on credit card sites. It floats by the headline; scrolling pins the stage and plays it: the file opens, the sale deed, EC, plan and tax receipts fan out and are scanned and ticked one by one, a stamp seals it Verified, and it flies into a phone as the legal opinion. Then services, process, numbers, reviews, questions and footer. Scroll the page to play it.",
    file: "LawFirmScrollSite.tsx",
    install: "npm i motion three @react-three/fiber",
  },
  {
    id: "law-property-verification",
    category: "legal",
    name: "Law office from above, verifying a home",
    note: "A top view of the office: a home buyer walks in with the property file, a lawyer takes it to research, the title, EC and plan are checked and ticked, the senior lawyer stamps the opinion, and the verified file goes back to the buyer. Property and real estate law firms.",
    file: "LawPropertyVerification.tsx",
  },
];
