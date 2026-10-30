import type { ServiceId } from "@/lib/business";
import { OMNI_ARTICLES } from "@/lib/content/omniproof";

/**
 * Every page meant to be found on Google, with the one search it is written
 * for and a few close ones it should also pick up. The SEO tab lists these
 * and fills in what Google says about each.
 *
 * Main searches come from the Keyword Planner file where there was a good
 * match. Keep each page's main search distinct from every other page's, or
 * two pages end up competing for the same result.
 */

export type SeoPage = {
  path: string;
  title: string;
  kind: "Home" | "Service page" | "Omniproof piece";
  service: ServiceId | null;
  /** YYYY-MM-DD, where known. */
  liveSince?: string;
  main: string;
  also: string[];
};

const SERVICE_PAGES: SeoPage[] = [
  {
    path: "/",
    title: "Home",
    kind: "Home",
    service: null,
    main: "software development company",
    also: ["development company software", "custom software development agency"],
  },
  {
    path: "/software",
    title: "Software",
    kind: "Service page",
    service: "software",
    main: "custom software development services",
    also: [
      "custom application development services",
      "custom software development firms",
      "bespoke software",
    ],
  },
  {
    path: "/agentic-ai",
    title: "Agentic AI",
    kind: "Service page",
    service: "ai",
    main: "ai agent development company",
    also: ["ai agent development", "agentic ai development", "ai chatbot development"],
  },
  {
    path: "/academy",
    title: "Academy",
    kind: "Service page",
    service: "academy",
    main: "data science course with placement",
    also: [
      "data science course online with placement",
      "python and sql and agentic ai course online",
      "data science training and placement",
    ],
  },
  {
    path: "/marketing",
    title: "Marketing",
    kind: "Service page",
    service: "marketing",
    main: "digital marketing agency for small business",
    also: [
      "digital marketing services for small business",
      "small business digital marketing services",
      "marketing agency for small business",
    ],
  },
];

/** Per Omniproof piece: its main search, its close ones, and the practice it serves. */
const OMNI_TARGETS: Record<
  string,
  { main: string; also: string[]; service: ServiceId | null }
> = {
  "jev-langchain-decision-model": {
    main: "jev langchain",
    also: ["jev model", "typesafe ai jev", "langchain decision model"],
    service: "ai",
  },
  "mathematics-gets-a-flashlight": {
    main: "ai solves math problems",
    also: ["quasi riemann hypothesis ai", "navier stokes ai proof", "lean proof ai"],
    service: null,
  },
};

export const SEO_PAGES: SeoPage[] = [
  ...SERVICE_PAGES,
  ...OMNI_ARTICLES.map((a) => {
    const target = OMNI_TARGETS[a.slug];
    return {
      path: `/omniproof/${a.slug}`,
      title: a.title,
      kind: "Omniproof piece" as const,
      service: target?.service ?? null,
      liveSince: a.date,
      main: target?.main ?? a.title.toLowerCase(),
      also: target?.also ?? [],
    };
  }),
];
