/** NectArray Academy and its flagship cohort. */
import type { Cta, Fact, Step } from "@/types";

export const academy: {
  eyebrow: string;
  title: string;
  lede: string;
  course: {
    badge: string;
    title: string;
    summary: string;
    facts: Fact[];
    modules: Step[];
    outcomes: string[];
    forWho: string[];
    cta: Cta;
  };
  moreSoon: string;
} = {
  eyebrow: "04 — NectArray Academy",
  title: "We teach the stack we ship with.",
  lede: "Our flagship programme takes you from no code at all to building and presenting real data projects — taught live, in small cohorts, by engineers who do this work for clients every week.",
  course: {
    badge: "Flagship cohort",
    title: "Python, SQL & Data Science",
    summary:
      "One programme, three disciplines, built in the order you actually need them: write Python, query data properly, then use both to answer real questions with real datasets.",
    facts: [
      { label: "Duration", value: "16 weeks" },
      { label: "Format", value: "Live online + recordings" },
      { label: "Commitment", value: "6–8 hrs / week" },
      { label: "Cohort size", value: "Capped at 25" },
    ],
    modules: [
      {
        n: "01",
        title: "Python Foundations",
        body: "Syntax, data structures, functions, files, error handling and clean code habits. By the end you are writing scripts, not following along.",
      },
      {
        n: "02",
        title: "SQL & Databases",
        body: "SELECT through window functions: joins, aggregations, CTEs, indexing and schema design on PostgreSQL, using messy real-world data.",
      },
      {
        n: "03",
        title: "Data Analysis",
        body: "NumPy, pandas and the whole cleaning-reshaping-merging grind, then visualisation with Matplotlib and Seaborn that communicates rather than decorates.",
      },
      {
        n: "04",
        title: "Statistics & Machine Learning",
        body: "Distributions, hypothesis testing, regression and classification with scikit-learn — plus how to tell when a model is lying to you.",
      },
      {
        n: "05",
        title: "Working Like an Analyst",
        body: "Git, notebooks to production, APIs and scraping, dashboarding, and framing a business question so the analysis answers something worth asking.",
      },
      {
        n: "06",
        title: "Capstone Project",
        body: "Pick a domain, source the data, build the analysis end to end, and present it. You leave with a portfolio piece and a repo you can defend in an interview.",
      },
    ],
    outcomes: [
      "Write production-quality Python without a tutorial open",
      "Query and model data in SQL with confidence",
      "Build a full analysis from raw data to a defensible conclusion",
      "Ship three portfolio projects and one capstone",
      "Interview prep, résumé review and mock technical rounds",
    ],
    forWho: [
      "Graduates targeting analyst and data roles",
      "Working professionals moving into data",
      "Founders and operators who want to stop asking someone else for numbers",
    ],
    cta: { label: "Request the syllabus", href: "#contact" },
  },
  moreSoon:
    "Cohorts in web development and applied AI engineering are in the works — ask to be told first.",
};
