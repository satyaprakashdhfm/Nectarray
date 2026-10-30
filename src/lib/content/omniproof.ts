/**
 * Omniproof: five-minute reads on what LLMs and people, working together,
 * are changing in the sciences.
 *
 * Every article belongs to one field and "lands" in others: the industries
 * its result reaches. Those landings are what the root graph on /omniproof
 * draws as the cross links between fields, so they live here as data rather
 * than in the markdown. The body of each article is in
 * content/omniproof/<slug>.md and ends before the "Where this lands" part,
 * which the article page renders from `lands`.
 */

export type FieldId =
  | "mathematics"
  | "physics"
  | "chemistry"
  | "biotech"
  | "economics"
  | "computer-science";

export type Field = {
  id: FieldId;
  label: string;
  /** One line on what the field gives the others. */
  blurb: string;
  /** Branch colour in the graph; reads on both the light and dark ground. */
  color: string;
};

/** Top to bottom, the order the branches leave the root in. */
export const FIELDS: Field[] = [
  {
    id: "mathematics",
    label: "Mathematics",
    blurb: "The tool every other field borrows. Powerless alone, decisive in use.",
    color: "#1fa5de",
  },
  {
    id: "physics",
    label: "Physics",
    blurb: "Fluids, materials and energy: the equations engineering runs on.",
    color: "#2bb3ad",
  },
  {
    id: "chemistry",
    label: "Chemistry",
    blurb: "Molecules, reactions and the search through them.",
    color: "#f5a44a",
  },
  {
    id: "biotech",
    label: "Biotechnology",
    blurb: "Proteins, drugs and medical devices.",
    color: "#6cc04a",
  },
  {
    id: "economics",
    label: "Economics",
    blurb: "Markets, payments and how firms adopt new tools.",
    color: "#9b7be0",
  },
  {
    id: "computer-science",
    label: "Computer science",
    blurb: "Algorithms, verification and the software everything else runs on.",
    color: "#e0607e",
  },
];

export const fieldById = (id: FieldId) =>
  FIELDS.find((f) => f.id === id) as Field;

export type Landing = {
  field: FieldId;
  /** What the result changes there, in a sentence or two. */
  impact: string;
};

export type OmniArticle = {
  slug: string;
  title: string;
  description: string;
  /** YYYY-MM-DD */
  date: string;
  field: FieldId;
  /** Short name for the leaf in the graph. */
  short: string;
  /** What the article is built on, linked at the foot. */
  source: { label: string; href: string };
  lands: Landing[];
};

/** Newest first. */
export const OMNI_ARTICLES: OmniArticle[] = [
  {
    slug: "mathematics-gets-a-flashlight",
    title: "Mathematics just got a flashlight",
    description:
      "AI systems claim proofs of the quasi-Riemann hypothesis, a Navier-Stokes blow-up and the Unique Games Conjecture, checked line by line in Lean. What happened, who it pays, and where it lands.",
    date: "2026-10-30",
    field: "mathematics",
    short: "Math gets a flashlight",
    source: {
      label: "Lex Fridman Podcast #503 — AI Crisis in Math",
      href: "https://youtu.be/ZAzWPE9CItg",
    },
    lands: [
      {
        field: "computer-science",
        impact:
          "Unique Games, a faster 3SUM and tighter FFT constants change which algorithms get built and which problems people stop trying to beat. AI-written, machine-checked code follows the same Lean pattern.",
      },
      {
        field: "physics",
        impact:
          "Navier-Stokes is the mathematics of air and water. The blow-up proof is a first step; the payoff is faster, cheaper simulation of turbulence for wings, turbines and weather.",
      },
      {
        field: "economics",
        impact:
          "Every online payment rests on unproved assumptions about which problems are hard. And \"check cheaply, deploy safely\" is the template for how a firm should adopt AI.",
      },
      {
        field: "biotech",
        impact:
          "Blood flow in an artificial heart is a fluid problem, and generate-then-verify is the loop protein and drug design already run on.",
      },
    ],
  },
];

export const omniBySlug = (slug: string) =>
  OMNI_ARTICLES.find((a) => a.slug === slug);
