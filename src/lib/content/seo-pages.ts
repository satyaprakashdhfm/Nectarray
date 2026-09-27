import type { ServiceId } from "@/lib/business";
import { BLOG_POSTS, type BlogService } from "@/lib/content/blog";

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
  kind: "Home" | "Service page" | "Blog post";
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

/** Per article: its main search, where it differs from the post's keyword, and its close ones. */
const BLOG_TARGETS: Record<string, { main?: string; also: string[] }> = {
  "jev-langchain-decision-model": {
    main: "jev langchain",
    also: ["jev model", "typesafe ai jev", "langchain decision model"],
  },
  "ai-agent-development-company": {
    main: "hire ai agent development company",
    also: ["ai agent development cost", "ai agent developers india"],
  },
  "ai-agent-vs-chatbot-vs-automation": {
    main: "ai agent vs chatbot",
    also: ["ai agent vs automation", "chatbot vs ai agent for business"],
  },
  "custom-software-development-cost-india": {
    main: "custom software development cost in india",
    also: ["custom software development services", "custom software application"],
  },
  "choose-custom-software-development-company": {
    main: "custom software development company",
    also: [
      "top custom software development companies",
      "custom software development agency",
      "custom application development company",
    ],
  },
  "custom-software-vs-off-the-shelf": {
    main: "bespoke software development",
    also: ["bespoke software development company", "custom software vs off the shelf"],
  },
  "data-science-course-with-placement": {
    main: "data science course with placement guarantee",
    also: [
      "best data science course with placement guarantee",
      "data science job guarantee program",
      "data science course job guarantee",
    ],
  },
  "data-analytics-vs-data-science-course": {
    main: "data analytics course with placement",
    also: [
      "best data analytics courses with placement",
      "data analytics courses online with placement",
    ],
  },
  "python-sql-roadmap-first-data-job": {
    main: "python and sql roadmap",
    also: ["python and sql and agentic ai course online", "python sql for data jobs"],
  },
  "digital-marketing-for-small-business": {
    main: "digital marketing for small business",
    also: [
      "digital marketing companies for small business",
      "small business digital marketing firm",
    ],
  },
  "social-media-marketing-agency-small-business": {
    main: "social media marketing agency for small business",
    also: [
      "social media marketing companies for small business",
      "social media agency for small businesses",
    ],
  },
};

const serviceOf = (s: BlogService): ServiceId => s;

export const SEO_PAGES: SeoPage[] = [
  ...SERVICE_PAGES,
  ...BLOG_POSTS.map((post) => {
    const target = BLOG_TARGETS[post.slug];
    return {
      path: `/blog/${post.slug}`,
      title: post.title,
      kind: "Blog post" as const,
      service: serviceOf(post.service),
      liveSince: post.date,
      main: target?.main ?? post.keyword,
      also: target?.also ?? [],
    };
  }),
];
