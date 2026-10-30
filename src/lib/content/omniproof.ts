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
  /** The second ring of the map: what a field opens into when zoomed. */
  subfields: Subfield[];
};

export type Subfield = { id: string; label: string; blurb: string };

/** Top to bottom, the order the branches leave the root in. */
export const FIELDS: Field[] = [
  {
    id: "mathematics",
    label: "Mathematics",
    blurb: "The tool every other field borrows. Powerless alone, decisive in use.",
    color: "#1fa5de",
    subfields: [
      { id: "number-theory", label: "Number theory", blurb: "Primes, zeros and the patterns under them." },
      { id: "analysis", label: "Analysis and PDEs", blurb: "The equations of change: fluids, waves, heat." },
      { id: "formal-proof", label: "Formal proof", blurb: "Proofs a computer checks down to the axioms." },
      { id: "combinatorics", label: "Combinatorics", blurb: "Counting, graphs and structure." },
    ],
  },
  {
    id: "physics",
    label: "Physics",
    blurb: "Fluids, materials and energy: the equations engineering runs on.",
    color: "#2bb3ad",
    subfields: [
      { id: "fluids", label: "Fluids and turbulence", blurb: "Air, water and everything that flows." },
      { id: "materials", label: "Materials", blurb: "Designing solids atom by atom." },
      { id: "quantum", label: "Quantum", blurb: "Systems too small for intuition." },
      { id: "climate", label: "Weather and climate", blurb: "Forecasting a planet." },
    ],
  },
  {
    id: "chemistry",
    label: "Chemistry",
    blurb: "Molecules, reactions and the search through them.",
    color: "#f5a44a",
    subfields: [
      { id: "molecules", label: "Molecular design", blurb: "Searching chemical space for the right molecule." },
      { id: "catalysis", label: "Catalysis", blurb: "Making reactions faster and cleaner." },
      { id: "batteries", label: "Batteries and energy", blurb: "Storing and moving energy." },
      { id: "synthesis", label: "Synthesis planning", blurb: "Working out how to make it." },
    ],
  },
  {
    id: "biotech",
    label: "Biotechnology",
    blurb: "Proteins, drugs and medical devices.",
    color: "#6cc04a",
    subfields: [
      { id: "proteins", label: "Protein design", blurb: "Folding, binding and new proteins." },
      { id: "drugs", label: "Drug discovery", blurb: "From target to candidate." },
      { id: "genomics", label: "Genomics", blurb: "Reading and editing DNA." },
      { id: "devices", label: "Medical devices", blurb: "Hearts, implants and the flow through them." },
    ],
  },
  {
    id: "economics",
    label: "Economics",
    blurb: "Markets, payments and how firms adopt new tools.",
    color: "#9b7be0",
    subfields: [
      { id: "markets", label: "Markets and pricing", blurb: "How prices form and move." },
      { id: "payments", label: "Payments and security", blurb: "The cryptography commerce rests on." },
      { id: "work", label: "Work and labour", blurb: "What changes for the people doing the job." },
      { id: "adoption", label: "AI adoption", blurb: "How firms put AI to work, and what it costs." },
    ],
  },
  {
    id: "computer-science",
    label: "Computer science",
    blurb: "Algorithms, verification and the software everything else runs on.",
    color: "#e0607e",
    subfields: [
      { id: "algorithms", label: "Algorithms and complexity", blurb: "What can be computed, and how fast." },
      { id: "agents", label: "AI agents", blurb: "Software that decides and acts." },
      { id: "verified-software", label: "Verified software", blurb: "Code proved correct." },
      { id: "systems", label: "Systems", blurb: "Chips, compilers and the cloud." },
    ],
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
  /** One of the field's `subfields` ids: the branch its leaf hangs on. */
  subfield: string;
  /** Short name for the leaf in the graph. */
  short: string;
  /** Cover art in public/omniproof/<slug>/, where the piece has one. */
  cover?: { src: string; alt: string };
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
    subfield: "formal-proof",
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
  {
    slug: "jev-langchain-decision-model",
    title: "Jev in LangChain: a decision model for the choices your agent makes",
    description:
      "TypeSafe AI's Jev answers typed questions with probabilities instead of writing text. What it is, where it beats an LLM, and how to use it from LangChain and LangGraph.",
    date: "2026-09-27",
    field: "computer-science",
    subfield: "agents",
    short: "Jev decision model",
    cover: {
      src: "/omniproof/jev-langchain-decision-model/cover.svg",
      alt: "A stream of messages entering a small decision model that sends each one down one of three labelled paths.",
    },
    source: {
      label: "LangChain's posts on Jev and langchain-typesafe",
      href: "https://blog.langchain.com/",
    },
    lands: [
      {
        field: "economics",
        impact:
          "Cheap by default, frontier on exception: routine routing and guardrail calls move to a model LangChain measured at a fraction of an LLM's cost per call, which changes what an agent costs to run.",
      },
    ],
  },
];

export const omniBySlug = (slug: string) =>
  OMNI_ARTICLES.find((a) => a.slug === slug);
