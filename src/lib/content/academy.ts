/** NectArray Academy and its flagship programme. */
import type { Cta, CurriculumModule, Fact, Faq, IconCard, Link } from "@/types";

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
    curriculumPdf: string;
    facts: Fact[];
    about: { title: string; paragraphs: string[]; highlights: string[] };
    offerings: IconCard[];
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
      "A 45-day placement programme for people moving into data science and AI. Python, then SQL, then the parts of getting hired that nobody teaches — built as practice you do, not lectures you sit through.",
    breadcrumb: [
      { label: "Home", href: "/" },
      { label: "Academy", href: "/academy" },
      { label: "Python, SQL & Data Science", href: "/academy" },
    ],
    curriculumPdf: "/nectarray-placement-curriculum.pdf",
    facts: [
      { label: "Duration", value: "45 days · 12 weeks" },
      { label: "Format", value: "Live online, hands-on" },
      { label: "Commitment", value: "6–8 hrs / week" },
      { label: "Group size", value: "Deliberately small" },
    ],

    about: {
      title: "About the programme",
      paragraphs: [
        "Most courses hand you twenty hours of video and call it teaching. This is the other thing: you write code every session, you get it read by someone who has shipped code for a living, and you are told plainly what is wrong with it.",
        "The order is deliberate. Python first, because everything downstream assumes it. SQL second, because the job is mostly asking data questions and the people who can do that cleanly are rarer than you would think. Then five days on the part that actually converts skill into an offer — how the industry is structured, what a résumé is scanned for, and what happens in a technical round.",
        "It is built for the two people who keep asking us for it: someone starting out who wants to enter data science or agentic AI and does not know where the floor is, and someone already working who wants to switch domains and needs to be interview-ready without quitting their job first.",
      ],
      highlights: [
        "A small group, so every submission is read individually",
        "Practice-first — you write more than you watch",
        "Every assignment reviewed and scored, not just marked done",
        "Written notes and worked examples you keep for good",
      ],
    },

    offerings: [
      {
        icon: "graduation",
        title: "Live sessions, not recordings",
        body: "Every class is taught live and you can interrupt it. This is training, not a video library — the value is in the back-and-forth when your code does not do what you expected.",
      },
      {
        icon: "code",
        title: "Assignments read and scored",
        body: "Submit your solution and get it back scored out of ten on correctness, readability and whether it would survive a code review — with the specific lines that cost you marks.",
      },
      {
        icon: "database",
        title: "A SQL playground in the browser",
        body: "Questions ordered easy to hard against a real database you query in the page. Write it, run it, see the rows, get told if the answer matches. No installs before you start.",
      },
      {
        icon: "target",
        title: "A Python problem sheet that stops",
        body: "Arrays, strings and dictionaries, easy to hard, each linked to LeetCode. Deliberately not a full DSA grind — enough pattern fluency to pass a screen, not six months of graph theory.",
      },
      {
        icon: "notebook",
        title: "Documentation-grade notes",
        body: "Every day has written notes with runnable examples and real output, not slides. They are the reference you go back to in your first job, not something you throw away after the exam.",
      },
      {
        icon: "briefcase",
        title: "Placement preparation built in",
        body: "Résumé and ATS, GitHub portfolio, LinkedIn and outreach strategy, HR rounds, and a technical mock interview with structured written feedback.",
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
          "The part that turns the previous 40 days into an offer. Nobody teaches this and it is usually what is missing.",
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
        a: "No. Day 1 starts at what a programming language is. What you do need is the 6–8 hours a week — the programme is paced for someone doing the practice, and it does not work as something you watch.",
      },
      {
        q: "Is this recorded, or live?",
        a: "Live. Every session is taught in real time and you are expected to interrupt it. There is no video library, deliberately: the value is in getting your specific mistake looked at while you still remember what you were thinking.",
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
        q: "Is this a DSA course?",
        a: "No, and on purpose. The problem sheet covers arrays, strings and dictionaries in Python, easy to hard, which is what actually comes up in screens for these roles. If you want six months of graph theory this is the wrong programme.",
      },
      {
        q: "What happens after the 45 days?",
        a: "You keep the notes and the practice environment. Day 45 ends with a technical mock interview and a written roadmap specific to where you are and what you are targeting.",
      },
    ],

    cta: { label: "Enrol now", href: "#enrol" },
  },
  moreSoon:
    "Web development and applied AI engineering are in the works — ask to be told first.",
};

/** The in-page anchors the academy sub-nav scrolls between. */
export const academyNav: Link[] = [
  { label: "Overview", href: "#overview" },
  { label: "Offerings", href: "#offerings" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "FAQs", href: "#faqs" },
];
