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
  {
    slug: "ai-agent-development-company",
    title: "What an AI agent development company builds, and how to hire one",
    description:
      "An AI agent is a model that can call your tools. What a development partner should deliver, what a first agent costs, and the questions that separate real builders from demo makers.",
    date: "2026-09-26",
    service: "ai",
    keyword: "ai agent development company",
    coverAlt:
      "An agent at the centre connected to a CRM, a database, email and a calendar.",
  },
  {
    slug: "ai-agent-vs-chatbot-vs-automation",
    title: "AI agent, chatbot or automation: which one your business needs",
    description:
      "Three tools that get sold under the same name. How to tell them apart, what each is good at, and a quick test for picking the cheapest one that does the job.",
    date: "2026-09-25",
    service: "ai",
    keyword: "ai agent development company",
    coverAlt:
      "Three columns labelled automation, chatbot and agent, each more capable than the last.",
  },
  {
    slug: "custom-software-development-cost-india",
    title: "How much custom software development costs in India in 2026",
    description:
      "Rough price bands for websites, internal tools, apps and AI features, what pushes a quote up, and how to read one line by line before you sign.",
    date: "2026-09-24",
    service: "software",
    keyword: "custom software development services",
    coverAlt:
      "A quote broken into bars for design, build, integrations, testing and support.",
  },
  {
    slug: "choose-custom-software-development-company",
    title: "How to choose a custom software development company: 12 questions",
    description:
      "The questions to ask before you hire a software development company, what a good answer sounds like, and the red flags that should end the call.",
    date: "2026-09-23",
    service: "software",
    keyword: "custom software development company",
    coverAlt:
      "A checklist with most items ticked beside a shortlist of three companies.",
  },
  {
    slug: "custom-software-vs-off-the-shelf",
    title: "Custom software or off the shelf: when bespoke is worth paying for",
    description:
      "Most businesses should start with a SaaS tool. Here is how to spot the point where custom or bespoke software starts saving more than it costs.",
    date: "2026-09-22",
    service: "software",
    keyword: "bespoke software development",
    coverAlt:
      "Two cost lines over three years, the SaaS line rising past the custom build.",
  },
  {
    slug: "data-science-course-with-placement",
    title: "Data science course with placement: how to check the promise",
    description:
      "Placement guarantees are the most searched and least explained part of data science courses. What the terms usually mean and the eight things to check before you pay.",
    date: "2026-09-21",
    service: "academy",
    keyword: "data science course with placement",
    coverAlt:
      "A magnifying glass over the fine print of a placement guarantee.",
  },
  {
    slug: "data-analytics-vs-data-science-course",
    title: "Data analytics or data science: which course gets you hired first",
    description:
      "The two roles overlap less than the course brochures suggest. What each job does all day, what it asks for, and which one to aim at first.",
    date: "2026-09-20",
    service: "academy",
    keyword: "data analytics course with placement",
    coverAlt:
      "Two paths from the same start, one to a dashboard and one to a model.",
  },
  {
    slug: "python-sql-roadmap-first-data-job",
    title: "A 12-week Python and SQL roadmap for your first data job",
    description:
      "Week by week: what to learn, what to build, and what to skip so that you reach an interview with work you can defend.",
    date: "2026-09-19",
    service: "academy",
    keyword: "python and sql course online",
    coverAlt: "A twelve-week timeline split into Python, SQL and job prep.",
  },
  {
    slug: "digital-marketing-for-small-business",
    title: "Digital marketing for a small business: where the first budget goes",
    description:
      "A plain plan for spending a small monthly budget: Google Business Profile, search, one social channel and paid ads, in the order they usually pay back.",
    date: "2026-09-18",
    service: "marketing",
    keyword: "digital marketing agency for small business",
    coverAlt:
      "A monthly budget split between local search, ads, content and social.",
  },
  {
    slug: "social-media-marketing-agency-small-business",
    title: "Hiring a social media marketing agency for a small business",
    description:
      "What a social media agency should do for a small business, what it should report every month, and the contract terms worth pushing back on.",
    date: "2026-09-17",
    service: "marketing",
    keyword: "social media marketing agency for small business",
    coverAlt:
      "A monthly report card with reach, leads and cost per lead filled in.",
  },
];

export const postBySlug = (slug: string) =>
  BLOG_POSTS.find((post) => post.slug === slug);
