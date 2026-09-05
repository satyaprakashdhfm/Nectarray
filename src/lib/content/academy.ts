/** NectArray Academy and its flagship programme. */
import type { Cta, CurriculumModule, Fact, Faq, IconCard, Link } from "@/types";

/**
 * One card in the offerings carousel: the feature, a line saying what it is,
 * and the two or three concrete things it means in practice.
 */
export type OfferingCard = IconCard & { points: string[] };

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
    about: { title: string; paragraphs: string[]; highlights: string[] };
    offerings: OfferingCard[];
    curriculum: CurriculumModule[];
    outcomes: string[];
    forWho: string[];
    faqs: Faq[];
    cta: Cta;
  };
  moreSoon: string;
} = {
  eyebrow: "04 — NectArray Academy",
  title: "We teach the stack we ship with.",
  lede: "Our flagship programme takes you from no code at all to reading, writing and defending real Python and SQL — taught live, in a small group, by engineers who do this work for clients every week.",
  course: {
    badge: "Flagship programme",
    tag: "Applications open",
    title: "Python, SQL & Data Science",
    summary:
      "A placement programme for people moving into data science and AI. Python, then SQL, then the parts of getting hired that nobody teaches — built as practice you do, not lectures you sit through.",
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
        "Most courses hand you twenty hours of video and call it teaching. This is the other thing: you write code every session, you get it read by someone who has shipped code for a living, and you are told plainly what is wrong with it.",
        "The order is deliberate. Python first, because everything downstream assumes it. SQL second, because the job is mostly asking data questions and the people who can do that cleanly are rarer than you would think. Then the part that actually converts skill into an offer — how the industry is structured, what a résumé is scanned for, and what happens in a technical round.",
        "It is built for the two people who keep asking us for it: someone starting out who wants to enter data science or agentic AI and does not know where the floor is, and someone already working who wants to switch domains and needs to be interview-ready without quitting their job first.",
      ],
      highlights: [
        "Every submission read individually, with the lines that cost you marks named",
        "Practice-first — you write more than you watch",
        "Every assignment reviewed and scored, not just marked done",
        "Written notes and worked examples you keep for good",
      ],
    },

    offerings: [
      {
        icon: "graduation",
        title: "Live, interactive sessions",
        body: "Every class is taught live, in a group of five, and you are meant to interrupt it. You ask as you go, your code gets looked at on the spot, and the session moves at the pace of the room — that back-and-forth is where the learning actually happens.",
        points: [
          "Ask a question the moment it comes up",
          "Code reviewed on screen, in the session",
          "Recorded afterwards, so you can revisit any session",
        ],
      },
      {
        icon: "code",
        title: "Assignments read and scored",
        body: "Submit your solution and get it back scored out of ten on correctness, readability and whether it would survive a code review — with the specific lines that cost you marks.",
        points: [
          "Scored on correctness, readability and review-worthiness",
          "The specific lines that cost you marks",
          "Resubmit once you have fixed them",
        ],
      },
      {
        icon: "database",
        title: "A SQL playground in the browser",
        body: "Questions ordered easy to hard against a real database you query in the page. Write it, run it, see the rows, and find out straight away whether the answer matches. It runs in the browser, so you are querying within a minute of arriving.",
        points: [
          "A real database you query in the page",
          "Questions ordered easy to hard",
          "Checked against the rows your query returns",
        ],
      },
      {
        icon: "target",
        title: "Interview-focused Python practice",
        body: "Arrays, strings and dictionaries, easy to hard, each linked to LeetCode and judged the way a screen judges: hidden tests, pass or fail. It is built around the patterns that actually come up, so every hour you put in is an hour that counts.",
        points: [
          "Arrays, strings, dictionaries — the interview core",
          "Judged on hidden tests, LeetCode-style",
          "Built around the patterns screens actually ask for",
        ],
      },
      {
        icon: "notebook",
        title: "Documentation-grade notes",
        body: "Every session has written notes with runnable examples and the real output printed beside them. They are written to be the reference you still open in your first job.",
        points: [
          "Written notes for every session, with runnable examples",
          "Real output printed beside every example",
          "Yours to keep, and to use in your first job",
        ],
      },
      {
        icon: "bot",
        title: "Agentic AI, the part teams hire for",
        body: "The last stretch goes past analysis into what teams are hiring for now: retrieval over your own documents, tool-calling agents, and the evaluation that tells you whether one is working.",
        points: [
          "Build a retrieval agent over a real document set",
          "Wire an agent to tools it can actually call",
          "Judge it with an eval set, not a vibe",
        ],
      },
      {
        icon: "briefcase",
        title: "Placement preparation built in",
        body: "Résumé and ATS, GitHub portfolio, LinkedIn and outreach strategy, HR rounds, and a technical mock interview with structured written feedback.",
        points: [
          "Resume and ATS, GitHub portfolio, LinkedIn",
          "HR rounds and outreach that gets replies",
          "A technical mock interview with written feedback",
        ],
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
            days: "Day 1",
            title: "Programming Fundamentals",
            body: "Languages, compilation vs interpretation, Python architecture, installation, IDEs.",
          },
          {
            days: "Day 2–3",
            title: "Python Basics",
            body: "Variables, data types, operators, type conversion, input/output.",
          },
          {
            days: "Day 4",
            title: "Conditions & Loops",
            body: "if/elif/else, match, for, while, break, continue, pass, patterns.",
          },
          {
            days: "Day 5–6",
            title: "Strings & Lists",
            body: "Indexing, slicing, methods, formatting, comprehensions.",
          },
          {
            days: "Day 7–8",
            title: "Tuples, Sets & Dictionaries",
            body: "Methods, operations, nested collections.",
          },
          {
            days: "Day 9–10",
            title: "Functions",
            body: "Parameters, arguments, scope, lambda, recursion, built-in functions.",
          },
          {
            days: "Day 11–12",
            title: "File & Exception Handling",
            body: "Files, context managers, try/except, custom exceptions.",
          },
          {
            days: "Day 13–16",
            title: "Object-Oriented Programming",
            body: "Classes, objects, inheritance, encapsulation, polymorphism, abstraction.",
          },
          {
            days: "Day 17–20",
            title: "Advanced Python",
            body: "Modules, packages, virtual environments, memory management, threads, multiprocessing, async.",
          },
          {
            days: "Day 21–22",
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
            days: "Day 1",
            title: "Database Fundamentals",
            body: "DBMS, RDBMS, SQL, database design, SQL execution flow.",
          },
          {
            days: "Day 2–3",
            title: "Database Objects",
            body: "CREATE, ALTER, DROP, TRUNCATE, constraints, data types.",
          },
          {
            days: "Day 4–6",
            title: "SELECT Queries",
            body: "SELECT, WHERE, ORDER BY, DISTINCT, LIMIT, aliases, expressions.",
          },
          {
            days: "Day 7–8",
            title: "Operators & Clauses",
            body: "Comparison, logical, IN, BETWEEN, LIKE, EXISTS, ANY, ALL.",
          },
          {
            days: "Day 9–10",
            title: "SQL Functions",
            body: "String, numeric, date, aggregate and conditional functions.",
          },
          {
            days: "Day 11–12",
            title: "Grouping",
            body: "GROUP BY, HAVING, aggregations and the real execution order.",
          },
          {
            days: "Day 13–14",
            title: "Joins & Set Operations",
            body: "INNER, LEFT, RIGHT, FULL, SELF joins and UNION.",
          },
          {
            days: "Day 15",
            title: "Subqueries & Window Functions",
            body: "Subqueries, ROW_NUMBER(), RANK(), DENSE_RANK().",
          },
          {
            days: "Day 16",
            title: "Views, Indexes & Transactions",
            body: "Views, indexes, transactions — COMMIT, ROLLBACK, SAVEPOINT.",
          },
          {
            days: "Day 17",
            title: "PL/SQL Fundamentals",
            body: "Blocks, variables, loops, procedures, functions, triggers.",
          },
          {
            days: "Day 18",
            title: "Revision & Interview Prep",
            body: "Revision, real-world queries and complex interview questions.",
          },
        ],
      },
      {
        n: "03",
        title: "Placement Readiness & Career Strategy",
        days: "5 days",
        summary:
          "The part that turns all of it into an offer. Nobody teaches this and it is usually what is missing.",
        topics: [
          {
            days: "Day 1",
            title: "Software Engineering & Systems",
            body: "SDLC, processes, job roles, team structure, system design basics.",
          },
          {
            days: "Day 2",
            title: "Profile Building",
            body: "Résumé building, ATS optimisation and GitHub portfolio strategy.",
          },
          {
            days: "Day 3",
            title: "Outreach & Strategy",
            body: "LinkedIn optimisation, job portals and strategic job-search workflows.",
          },
          {
            days: "Day 4",
            title: "Behavioural Readiness",
            body: "Self introduction, professional communication and HR interview preparation.",
          },
          {
            days: "Day 5",
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
        q: "What happens when the programme ends?",
        a: "You keep the notes and the practice environment. It ends with a technical mock interview and a written roadmap specific to where you are and what you are targeting.",
      },
    ],

    cta: { label: "Enrol now", href: "#enrol" },
  },
  moreSoon:
    "Web development and applied AI engineering are in the works — ask to be told first.",
};

/** The in-page anchors the academy sub-nav scrolls between. */
/**
 * Placement and career support.
 *
 * Its own block rather than a bullet inside the offerings, because for a
 * career-change buyer it is the reason they are reading the page at all.
 */
export const placements: {
  eyebrow: string;
  title: string;
  lede: string;
  includes: { title: string; body: string }[];
} = {
  eyebrow: "Placements & career assistance",
  title: "The part that turns the course into an offer",
  lede: "Our placement cell is dedicated to helping you secure the job the programme was taken for, and we work with hiring partners to get your profile in front of them.",
  includes: [
    {
      title: "Resume building & LinkedIn optimisation",
      body: "Your CV rewritten for the roles you are actually applying to, and a profile that recruiters searching those roles will find.",
    },
    {
      title: "Mock interviews with industry professionals",
      body: "Technical and HR rounds run by engineers who sit on the other side of real interviews, with the feedback said plainly.",
    },
    {
      title: "Job alerts & referrals",
      body: "Openings that match your profile as they come up, and a referral into them wherever we have the relationship to make one.",
    },
  ],
};

export const academyNav: Link[] = [
  { label: "Overview", href: "#overview" },
  { label: "Offerings", href: "#offerings" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Placements", href: "#placements" },
  { label: "FAQs", href: "#faqs" },
];
