/** NectArray Academy and its flagship programme. */
import type { Cta, CurriculumModule, Fact, Faq, IconCard, Link } from "@/types";

/**
 * One card in the offerings carousel: the feature and what it means in
 * practice, in a single paragraph.
 *
 * It used to carry a "course highlights" list under the paragraph as well,
 * which said the same three things again in note form — the paragraph already
 * had them, so a reader met each point twice on the same card.
 */
export type OfferingCard = IconCard;

/**
 * Student quotes for the academy page.
 *
 * Deliberately empty. The section renders nothing while it is, which is the
 * correct thing for it to do — a testimonial nobody said is worse than no
 * testimonials, and it is the one part of a course page a visitor is right
 * to read sceptically. Paste real ones in as students give them.
 */
export type StudentQuote = {
  name: string;
  place: string;
  course: string;
  rating: number;
  quote: string;
};

export const studentQuotes: StudentQuote[] = [];

export const academy: {
  eyebrow: string;
  title: string;
  lede: string;
  course: {
    badge: string;
    tag: string;
    title: string;
    summary: string;
    breadcrumb: Link[];
    facts: Fact[];
    about: { title: string; paragraphs: string[] };
    offerings: OfferingCard[];
    curriculum: CurriculumModule[];
    outcomes: string[];
    forWho: string[];
    faqs: Faq[];
    cta: Cta;
  };
  moreSoon: string;
} = {
  eyebrow: "NectArray Academy",
  title: "We teach the stack we ship with.",
  lede: "Our flagship programme takes you from your first line of code to reading, writing and defending real Python and SQL. It is taught live, in a small group, by engineers who do this work for clients every week.",
  course: {
    badge: "Flagship programme",
    tag: "Applications open",
    title: "Python, SQL & Data Science",
    summary:
      "A placement programme for people moving into data science and AI. Python first, then SQL, then the interview and portfolio work that decides who gets the offer. You practise in every session instead of watching lectures.",
    breadcrumb: [
      { label: "Home", href: "/" },
      { label: "Academy", href: "/academy" },
      { label: "Python, SQL & Data Science", href: "/academy" },
    ],
    facts: [
      { label: "Duration", value: "12 weeks" },
      { label: "Format", value: "Live online, hands-on" },
      { label: "Commitment", value: "6–8 hrs / week" },
      { label: "Group size", value: "Capped by design" },
    ],

    about: {
      title: "About the programme",
      paragraphs: [
        "You write code in every session, someone who ships code for a living reads it, and you are told plainly what to fix. That loop is the whole programme.",
        "The order is deliberate. Python first, because everything downstream assumes it. SQL second, because the job is mostly asking data questions and the people who can do that cleanly are rarer than you would think. Then the part that actually converts skill into an offer — how the industry is structured, what a résumé is scanned for, and what happens in a technical round.",
        "It is built for the two people who keep asking us for it: someone starting out in data science or agentic AI who wants a solid floor to stand on, and someone already working who wants to switch fields and be interview-ready without quitting their job first.",
      ],
    },

    offerings: [
      {
        icon: "graduation",
        title: "Live, interactive sessions",
        body: "Every class is taught live, in a group of five, and you are meant to interrupt it. You ask the moment a question comes up, your code is reviewed on screen while the session is running, and the room sets the pace — that back-and-forth is where the learning actually happens. Every session is recorded, so you can go back over any of it afterwards.",
      },
      {
        icon: "code",
        title: "Assignments read and scored",
        body: "Submit your solution and get it back scored out of ten on correctness, readability and whether it would survive a code review — with the specific lines that cost you the marks named, not a grade and a shrug. Fix them and you can resubmit once.",
      },
      {
        icon: "database",
        title: "A SQL playground in the browser",
        body: "Questions ordered easy to hard against a real database you query in the page. Write it, run it, see the rows, and find out straight away whether it matches — you are checked on what your query actually returns, not on how it is worded. It runs in the browser, so you are querying within a minute of arriving.",
      },
      {
        icon: "target",
        title: "Interview-focused Python practice",
        body: "Arrays, strings and dictionaries — the interview core — ordered easy to hard. Every problem is written out in the portal and judged the way a screen judges: hidden tests, pass or fail. It is built around the patterns screens actually ask for, so every hour you put in is an hour that counts.",
      },
      {
        icon: "notebook",
        title: "Documentation-grade notes",
        body: "Every session has written notes with runnable examples and the real output printed beside them — run before it was written down, so nothing in there is what we assumed the answer would be. They are yours to keep, and they are written to be the reference you still open in your first job.",
      },
      {
        icon: "bot",
        title: "Agentic AI, the part teams hire for",
        body: "The last stretch goes past analysis into what teams are hiring for now. You build a retrieval agent over a real document set, wire one to tools it can actually call, and then judge it against an evaluation set rather than on whether the demo felt right.",
      },
      {
        icon: "briefcase",
        title: "Placement preparation built in",
        body: "Résumé and ATS, a GitHub portfolio worth linking to, LinkedIn and outreach that actually gets replies, and the HR rounds nobody prepares for. It ends on a technical mock interview with structured written feedback.",
      },
    ],

    curriculum: [
      {
        n: "01",
        title: "Python Core & Advanced",
        days: "22 days",
        summary:
          "From what a program even is, through to threads, async and a capstone you can talk through in an interview.",
        topics: [
          {
            title: "Programming Fundamentals",
            body: "Languages, compilation vs interpretation, Python architecture, installation, IDEs.",
          },
          {
            title: "Python Basics",
            body: "Variables, data types, operators, type conversion, input/output.",
          },
          {
            title: "Conditions & Loops",
            body: "if/elif/else, match, for, while, break, continue, pass, patterns.",
          },
          {
            title: "Strings & Lists",
            body: "Indexing, slicing, methods, formatting, comprehensions.",
          },
          {
            title: "Tuples, Sets & Dictionaries",
            body: "Methods, operations, nested collections.",
          },
          {
            title: "Functions",
            body: "Parameters, arguments, scope, lambda, recursion, built-in functions.",
          },
          {
            title: "File & Exception Handling",
            body: "Files, context managers, try/except, custom exceptions.",
          },
          {
            title: "Object-Oriented Programming",
            body: "Classes, objects, inheritance, encapsulation, polymorphism, abstraction.",
          },
          {
            title: "Advanced Python",
            body: "Modules, packages, virtual environments, memory management, threads, multiprocessing, async.",
          },
          {
            title: "Revision, Practice & Capstone",
            body: "Real interview questions, problem-sheet practice and a mini project.",
          },
        ],
      },
      {
        n: "02",
        title: "SQL & Relational Databases",
        days: "18 days",
        summary:
          "Taught in MySQL 8. Every query in the notes was executed before it was written down, and the outputs are the real ones.",
        topics: [
          {
            title: "Database Fundamentals",
            body: "DBMS, RDBMS, SQL, database design, SQL execution flow.",
          },
          {
            title: "Database Objects",
            body: "CREATE, ALTER, DROP, TRUNCATE, constraints, data types.",
          },
          {
            title: "SELECT Queries",
            body: "SELECT, WHERE, ORDER BY, DISTINCT, LIMIT, aliases, expressions.",
          },
          {
            title: "Operators & Clauses",
            body: "Comparison, logical, IN, BETWEEN, LIKE, EXISTS, ANY, ALL.",
          },
          {
            title: "SQL Functions",
            body: "String, numeric, date, aggregate and conditional functions.",
          },
          {
            title: "Grouping",
            body: "GROUP BY, HAVING, aggregations and the real execution order.",
          },
          {
            title: "Joins & Set Operations",
            body: "INNER, LEFT, RIGHT, FULL, SELF joins and UNION.",
          },
          {
            title: "Subqueries & Window Functions",
            body: "Subqueries, ROW_NUMBER(), RANK(), DENSE_RANK().",
          },
          {
            title: "Views, Indexes & Transactions",
            body: "Views, indexes, transactions — COMMIT, ROLLBACK, SAVEPOINT.",
          },
          {
            title: "PL/SQL Fundamentals",
            body: "Blocks, variables, loops, procedures, functions, triggers.",
          },
          {
            title: "Revision & Interview Prep",
            body: "Revision, real-world queries and complex interview questions.",
          },
        ],
      },
      {
        n: "03",
        title: "Data Science & Agentic AI",
        days: "11 days",
        summary:
          "The half teams are hiring for: pandas and models first, then agents that retrieve, remember, call real tools and get judged against an evaluation set.",
        topics: [
          {
            title: "NumPy and pandas",
            body: "Arrays, DataFrames, vectorised thinking, grouping and joining — the two libraries everything else sits on.",
          },
          {
            title: "Cleaning real data",
            body: "Wrong types, ambiguous dates, near-duplicate text, missing values, and the checks that catch each of them.",
          },
          {
            title: "Machine learning in one pass",
            body: "scikit-learn's four methods, honest splits, pipelines that prevent leakage, and choosing a metric you can defend.",
          },
          {
            title: "Deep learning, NLP and embeddings",
            body: "Networks and transformers briefly; tokens and embeddings properly, because everything after this depends on them.",
          },
          {
            title: "What an agent actually is",
            body: "The loop, tool definitions as prompts, and the five ways agents fail in production.",
          },
          {
            title: "Retrieval-augmented generation",
            body: "Chunking, embeddings, pgvector, hybrid search, reranking, citations, and measuring recall rather than eyeballing it.",
          },
          {
            title: "LangChain and LangGraph",
            body: "Chains where a line is enough; state, nodes, edges, checkpointers and human-in-the-loop where it is not.",
          },
          {
            title: "Memory, sessions and users",
            body: "Working, session and long-term memory as three separate problems, with the context budget they have to fit.",
          },
          {
            title: "MCP — the Model Context Protocol",
            body: "Tools, resources and prompts; stdio and Streamable HTTP; writing a server, and the security that goes with one.",
          },
          {
            title: "The framework landscape",
            body: "LangGraph, OpenAI Agents SDK, Vercel AI SDK, AutoGen, Semantic Kernel, Azure AI Foundry — and when each earns its place.",
          },
          {
            title: "Shipping an agent",
            body: "Evaluation sets, guardrails, retries, cost control, observability and streaming — the work that makes a demo a product.",
          },
        ],
      },
      {
        n: "04",
        title: "Placement Readiness & Career Strategy",
        days: "5 days",
        summary:
          "The part that turns everything you have learned into an offer, and the part most people are missing when they start applying.",
        topics: [
          {
            title: "Software Engineering & Systems",
            body: "SDLC, processes, job roles, team structure, system design basics.",
          },
          {
            title: "Profile Building",
            body: "Résumé building, ATS optimisation and GitHub portfolio strategy.",
          },
          {
            title: "Outreach & Strategy",
            body: "LinkedIn optimisation, job portals and strategic job-search workflows.",
          },
          {
            title: "Behavioural Readiness",
            body: "Self introduction, professional communication and HR interview preparation.",
          },
          {
            title: "Evaluation & Roadmap",
            body: "Technical mock interview, structured feedback and a personalised career roadmap.",
          },
        ],
      },
    ],

    outcomes: [
      "Write Python you would be willing to show an interviewer",
      "Query and reason about relational data without reaching for a tutorial",
      "Solve array, string and dictionary problems under time pressure",
      "Walk into a technical round knowing what is actually being assessed",
      "Leave with a project, a portfolio and a written career roadmap",
    ],

    forWho: [
      "Graduates targeting data, analyst and AI-adjacent roles",
      "Working professionals switching domain without quitting first",
      "Anyone planning to move into data science or agentic AI who wants a floor under them",
    ],

    faqs: [
      {
        q: "Do I need to know how to code already?",
        a: "No. It starts at what a programming language is. What you do need is the 6–8 hours a week — the programme is paced for someone doing the practice, and it does not work as something you watch.",
      },
      {
        q: "Are the classes live?",
        a: "Yes — every session is taught in real time, in a group of five, and you are expected to interrupt it. You get your own mistake looked at while you still remember what you were thinking. Sessions are recorded afterwards too, so a class you cannot make is still there to catch up on.",
      },
      {
        q: "Why so few places?",
        a: "Because every assignment is read individually and scored with specific feedback. That does not scale, and we would rather run more groups than dilute one.",
      },
      {
        q: "How are assignments assessed?",
        a: "You submit your solution and get it back scored out of ten — on whether it is correct, whether it is readable, and whether it would survive a review. You see which lines cost you marks, not just a number.",
      },
      {
        q: "What are the notes, exactly?",
        a: "A written reference for every topic we cover, kept in your dashboard rather than handed out as slides. Each one has the explanation, a worked example with its output beside it, and practice questions at the end. They are edited as the course runs — if a session throws up a better way to explain something, the note is updated that week and you see the new one.",
      },
      {
        q: "What is the practice environment?",
        a: "A SQL playground and a Python judge that run in the browser, with no setup on your machine. You write a query or a function, run it against real tables or hidden test cases, and get told what failed and why. Your solved questions are tracked, so you can see what you have actually covered rather than what you have read.",
      },
      {
        q: "Do I keep any of it afterwards?",
        a: "Yes. Your login stays, so the notes and the practice environment stay with you — including the updates made after your cohort finishes. The programme ends with a technical mock interview and a written roadmap specific to where you are and what you are targeting.",
      },
    ],

    cta: { label: "Enrol now", href: "/contact#enquiry" },
  },
  moreSoon:
    "Web development and applied AI engineering are in the works — ask to be told first.",
};

