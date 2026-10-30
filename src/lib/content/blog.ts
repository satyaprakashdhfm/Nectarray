/**
 * The blog: one entry per article, newest first.
 *
 * The body of each lives in content/blog/<slug>.md and its pictures in
 * public/blog/<slug>/. `keyword` is the search term the article is written
 * to rank for, taken from the Keyword Planner export; it is not shown on the
 * page, only used for the SEO tab and the page's metadata.
 */

export type BlogService = "software" | "ai" | "academy" | "marketing";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  /** YYYY-MM-DD */
  date: string;
  service: BlogService;
  keyword: string;
  /** Alt text for the cover, which is decorative only in the list. */
  coverAlt: string;
};

export const BLOG_SERVICES: Record<
  BlogService,
  { label: string; href: string; cta: string }
> = {
  software: {
    label: "Software",
    href: "/software",
    cta: "See what we build",
  },
  ai: { label: "Agentic AI", href: "/agentic-ai", cta: "See our agent work" },
  academy: {
    label: "Academy",
    href: "/academy",
    cta: "See the programme",
  },
  marketing: {
    label: "Marketing",
    href: "/marketing",
    cta: "See how we market",
  },
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "jev-langchain-decision-model",
    title: "Jev in LangChain: a decision model for the choices your agent makes",
    description:
      "TypeSafe AI's Jev answers typed questions with probabilities instead of writing text. What it is, where it beats an LLM, and how to use it from LangChain and LangGraph.",
    date: "2026-09-27",
    service: "ai",
    keyword: "ai agent development",
    coverAlt:
      "A stream of messages entering a small decision model that sends each one down one of three labelled paths.",
  },
];

export const postBySlug = (slug: string) =>
  BLOG_POSTS.find((post) => post.slug === slug);
