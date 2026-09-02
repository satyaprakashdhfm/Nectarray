/** How we work, what we are building, and what it costs. */
import type { Cta, Faq, Plan, Step, Testimonial, WorkItem } from "@/types";

export const process: {
  eyebrow: string;
  title: string;
  lede: string;
  steps: Step[];
} = {
  eyebrow: "How we work",
  title: "Four steps, no mystery.",
  lede: "You always know what is being built, what it costs, and when it lands.",
  steps: [
    {
      n: "01",
      title: "Discovery call",
      body: "Thirty minutes on what you are trying to achieve and what is currently in the way. Free, and you leave with an honest read on whether we are the right fit.",
    },
    {
      n: "02",
      title: "Proposal & scope",
      body: "A written plan: what we will build or run, in what order, at what price, on what timeline. Fixed scope, fixed cost, no hourly surprises.",
    },
    {
      n: "03",
      title: "Build in the open",
      body: "Weekly demos on a live staging link and a shared channel for questions. You see progress every week, not at the end.",
    },
    {
      n: "04",
      title: "Launch & compound",
      body: "We ship, hand over the code and the credentials, and then either step back or stay on to keep improving it. Your call, not a lock-in.",
    },
  ],
};

export const work: {
  eyebrow: string;
  title: string;
  lede: string;
  items: WorkItem[];
  cta: Cta;
} = {
  eyebrow: "Selected work",
  title: "What we are building.",
  lede: "NectArray is a new studio and we would rather show you real work than stock screenshots. These are the engagements currently in flight — case studies land here as they go live.",
  items: [
    {
      tag: "Software",
      title: "Multi-tenant booking platform",
      body: "Scheduling, payments and a client portal for a services business replacing three disconnected tools.",
      status: "In build",
    },
    {
      tag: "Agentic AI",
      title: "Support agent over 1,200 product SKUs",
      body: "Retrieval-grounded WhatsApp and web assistant with human escalation and full conversation analytics.",
      status: "In build",
    },
    {
      tag: "Marketing",
      title: "D2C paid media rebuild",
      body: "Meta and Google accounts restructured, server-side tracking installed, creative testing loop running weekly.",
      status: "Live",
    },
    {
      tag: "Academy",
      title: "Python, SQL & Data Science — Cohort 01",
      body: "Sixteen-week live programme with capstone projects and placement support.",
      status: "Enrolling",
    },
  ],
  cta: { label: "Discuss your project", href: "#contact" },
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "They rebuilt the site and took over our ad accounts in the same month. Having one team on both meant nothing got lost between the landing page and the campaign pointing at it.",
    name: "Client name",
    role: "Founder, D2C brand",
  },
  {
    quote:
      "The agent handles the questions our team used to answer forty times a day, and it hands over cleanly when it should not be answering at all.",
    name: "Client name",
    role: "Head of Operations",
  },
  {
    quote:
      "I came in having never written a line of code. Sixteen weeks later I had a capstone project I could actually talk through in interviews.",
    name: "Student name",
    role: "Academy, Cohort 01",
  },
];

export const pricing: {
  eyebrow: string;
  title: string;
  lede: string;
  plans: Plan[];
  footnote: string;
} = {
  eyebrow: "Engagements",
  title: "Three ways to work with us.",
  lede: "Every engagement is quoted for the work in front of it. You get a fixed figure in writing after the discovery call — no rate card, no surprises later.",
  plans: [
    {
      name: "Project",
      body: "A defined build with a start and an end — a website, an app, an agent, a rebuild.",
      features: [
        "Fixed scope, quoted up front",
        "Design, build and launch",
        "Weekly demos on staging",
        "Full code and asset handover",
        "30 days of post-launch support",
      ],
      cta: "Scope a project",
      featured: false,
    },
    {
      name: "Retainer",
      body: "An ongoing team for marketing, product iteration or both. Most clients end up here.",
      features: [
        "Paid media and content management",
        "Continuous development and releases",
        "Monthly reporting and strategy call",
        "Priority response window",
        "Cancel with 30 days' notice",
      ],
      cta: "Talk retainers",
      featured: true,
    },
    {
      name: "Academy",
      body: "A seat in the live Python, SQL & Data Science programme. Instalments available.",
      features: [
        "16 weeks of live instruction",
        "Lifetime access to recordings",
        "Capstone project and review",
        "Interview and résumé support",
        "Certificate on completion",
      ],
      cta: "Request the syllabus",
      featured: false,
    },
  ],
  footnote:
    "Bundled engagements — a build plus the marketing to launch it — are quoted together and come out lower than the two separately.",
};

export const faqs: Faq[] = [
  {
    q: "Can we hire you for just one thing?",
    a: "Yes. Plenty of clients take only the build or only the marketing. The four practices are designed to compound when combined, but none of them depends on the others.",
  },
  {
    q: "How small a project will you take?",
    a: "A single well-built landing page is a perfectly good first project, and it is often the right one. We would rather start small and earn the larger engagement than oversell the first conversation.",
  },
  {
    q: "Who owns the code and the accounts?",
    a: "You do, completely. Repositories, ad accounts, analytics, domains and hosting are all created under your ownership or transferred to you at launch. Leaving us should cost you nothing but notice.",
  },
  {
    q: "How fast can you start?",
    a: "Usually within a week or two of the proposal being signed. Small builds go live in two to four weeks; larger platforms run six to sixteen. Marketing retainers typically show meaningful signal inside the first month.",
  },
  {
    q: "Is the AI work real, or a wrapper on ChatGPT?",
    a: "It is real engineering: retrieval over your own data, tool calls into your own systems, evaluation suites, guardrails and observability. We are happy to walk you through the architecture of anything we build before you commit.",
  },
  {
    q: "Do I need to know anything before joining the Academy course?",
    a: "No programming background is required — module one starts from zero. You need a computer, a stable connection, and six to eight hours a week you can genuinely protect.",
  },
  {
    q: "Do you work with clients outside India?",
    a: "Yes. We work remotely across time zones and keep overlapping hours with our clients for calls and demos. Billing is available in INR or USD.",
  },
];

export const contact = {
  eyebrow: "Get in touch",
  title: "Tell us what you are building.",
  lede: "A short note is enough to start. We reply to every enquiry within one business day — usually with questions, sometimes with a straight answer that you do not need us.",
  interests: [
    "Marketing & growth",
    "Website or web app",
    "AI agent or chatbot",
    "Academy enrolment",
    "Something else",
  ],
};
