/** The four practices, and the detail sections for the first three. */
import type { IconCard, IconCardWithMeta, Practice, TagGroup } from "@/types";

export const pillars: Practice[] = [
  {
    id: "marketing",
    index: "01",
    icon: "megaphone",
    title: "Growth & Marketing",
    summary:
      "Paid media, organic content and the tracking that proves which of them worked.",
    points: [
      "Meta & Google Ads",
      "SEO & content",
      "Social management",
      "Analytics & CRO",
    ],
    href: "#marketing",
  },
  {
    id: "software",
    index: "02",
    icon: "code",
    title: "Software & Web",
    summary:
      "Marketing sites, web apps and internal tools — from a five-page launch site to a multi-tenant platform.",
    points: [
      "Websites & landing pages",
      "Web applications",
      "E-commerce",
      "Dashboards & portals",
    ],
    href: "#software",
  },
  {
    id: "ai",
    index: "03",
    icon: "bot",
    title: "Agentic AI",
    summary:
      "Chatbots, copilots and autonomous agents built on modern harnesses — wired into the systems you already run.",
    points: [
      "Support & sales chatbots",
      "RAG over your docs",
      "Workflow agents",
      "Agents inside your product",
    ],
    href: "/agentic-ai",
  },
  {
    id: "academy",
    index: "04",
    icon: "graduation",
    title: "NectArray Academy",
    summary:
      "Live, project-driven courses taught by the same engineers who ship our client work.",
    points: [
      "Python foundations",
      "SQL & databases",
      "Data science",
      "Portfolio projects",
    ],
    href: "#academy",
  },
];

export const marketing: {
  eyebrow: string;
  title: string;
  lede: string;
  channels: IconCard[];
  note: string;
} = {
  eyebrow: "01 — Growth & Marketing",
  title: "Every channel that can send you a customer, run by one team.",
  lede: "Most agencies sell you one channel and call it strategy. We map where your buyers actually are, run those channels properly, and kill the ones that do not pay for themselves.",
  channels: [
    {
      icon: "target",
      title: "Meta Ads",
      body: "Facebook and Instagram campaigns — full-funnel structure, creative testing at volume, Advantage+ where it earns its place, and Conversions API so iOS traffic stops disappearing.",
    },
    {
      icon: "search",
      title: "Google Ads",
      body: "Search, Performance Max, Shopping, YouTube and Demand Gen. Tight keyword and negative hygiene, landing pages built by our own engineers, bidding tuned to margin rather than clicks.",
    },
    {
      icon: "globe",
      title: "SEO & Content",
      body: "Technical audits, site architecture, programmatic pages, local and Maps optimisation, plus a genuine editorial calendar — not 500-word filler.",
    },
    {
      icon: "share",
      title: "Social & Content Management",
      body: "Instagram, LinkedIn and YouTube handled end to end: monthly calendar, shoots, reels and short-form edits, carousels, captions, scheduling, community replies and reporting.",
    },
    {
      icon: "briefcase",
      title: "LinkedIn & B2B",
      body: "For longer sales cycles: LinkedIn Ads, founder-led content, lead-gen forms and outbound sequences that feed a CRM instead of a spreadsheet.",
    },
    {
      icon: "message",
      title: "WhatsApp & Lifecycle",
      body: "WhatsApp Business API, email and SMS flows — abandoned cart, onboarding, win-back and retention journeys wired to your store or CRM.",
    },
    {
      icon: "chart",
      title: "Analytics & CRO",
      body: "GA4 and GTM done correctly, server-side tracking, offline conversion imports, dashboards you actually read, and A/B tests on the pages that carry the revenue.",
    },
    {
      icon: "cart",
      title: "Marketplace & Commerce",
      body: "Amazon and Flipkart ad management, listing and catalogue optimisation, and feed management for Shopping campaigns.",
    },
  ],
  note: "Not sure which channels fit? The first thing we do is tell you which ones to skip.",
};

export const software: {
  eyebrow: string;
  title: string;
  lede: string;
  services: IconCardWithMeta[];
  stack: { title: string; body: string; groups: TagGroup[] };
} = {
  eyebrow: "02 — Software & Web",
  title: "From a landing page to a platform, built to the same standard.",
  lede: "We take projects at any scale. What does not change is the engineering: typed, tested, fast, accessible, and handed over as code you own outright.",
  services: [
    {
      icon: "layout",
      title: "Websites & Landing Pages",
      body: "Brochure sites, launch pages and campaign microsites — designed, written and shipped in weeks, with a CMS your marketing team can drive without us.",
      meta: "2–4 weeks",
    },
    {
      icon: "layers",
      title: "Web Applications",
      body: "SaaS products, marketplaces, booking systems, member portals. Auth, payments, roles, multi-tenancy and everything else the demo never shows you.",
      meta: "6–16 weeks",
    },
    {
      icon: "cart",
      title: "E-commerce",
      body: "Shopify builds and custom headless storefronts, subscription and payment flows, and the analytics plumbing our marketing side needs to optimise.",
      meta: "4–10 weeks",
    },
    {
      icon: "gauge",
      title: "Dashboards & Internal Tools",
      body: "Admin panels, ops consoles and reporting dashboards that replace the spreadsheet the whole company secretly runs on.",
      meta: "4–8 weeks",
    },
    {
      icon: "smartphone",
      title: "Mobile-First & PWA",
      body: "Responsive down to the smallest device, installable web apps, and offline-tolerant interfaces where the connection is not a given.",
      meta: "Scoped per build",
    },
    {
      icon: "plug",
      title: "APIs & Integrations",
      body: "REST and GraphQL services, third-party integrations, payment gateways, CRMs, ERPs, and migrations off systems you have outgrown.",
      meta: "Scoped per build",
    },
  ],
  stack: {
    title: "The default stack",
    body: "We are not religious about tools, but we are opinionated. Unless a project argues otherwise, this is what we reach for — because it is fast to build in, cheap to run, and easy for the next engineer to pick up.",
    groups: [
      {
        label: "Frontend",
        items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      },
      { label: "Backend", items: ["Node.js", "Python", "PostgreSQL", "Redis"] },
      { label: "Infra", items: ["Vercel", "AWS", "Docker", "GitHub Actions"] },
      {
        label: "Product",
        items: ["Figma", "Sanity / Payload", "Stripe & Razorpay", "Sentry"],
      },
    ],
  },
};

export const ai: {
  eyebrow: string;
  title: string;
  lede: string;
  capabilities: IconCard[];
  harnesses: { title: string; body: string; items: string[] };
} = {
  eyebrow: "03 — Agentic AI",
  title: "Agents that do the work, not demos that describe it.",
  lede: "A chatbot that answers questions is table stakes. We build agents with tools, memory and permissions — systems that read your data, take actions in your software, and hand off to a human when they should.",
  capabilities: [
    {
      icon: "message",
      title: "Support & Sales Chatbots",
      body: "Grounded in your real documentation and catalogue, embedded in your site or WhatsApp, with escalation to a human the moment confidence drops.",
    },
    {
      icon: "database",
      title: "RAG Over Your Knowledge",
      body: "Contracts, SOPs, tickets, product docs — indexed, chunked and retrieved properly, with citations so answers can be checked rather than trusted.",
    },
    {
      icon: "workflow",
      title: "Workflow Agents",
      body: "Multi-step automation with real tool access: triage an inbox, enrich a lead, reconcile invoices, draft the report, update the CRM, ping the channel.",
    },
    {
      icon: "sparkles",
      title: "Agents Inside Your Product",
      body: "In-app copilots and assistants shipped as a feature of your own software — streaming responses, tool calls, and UI that reacts to what the model does.",
    },
    {
      icon: "phone",
      title: "Voice & Multimodal",
      body: "Voice agents for bookings and qualification, plus document, image and screenshot understanding where the input was never going to be plain text.",
    },
    {
      icon: "shield",
      title: "Evals & Guardrails",
      body: "The unglamorous half: test suites for prompts, regression evals, cost and latency budgets, PII handling, and observability so you can see why it did that.",
    },
  ],
  harnesses: {
    title: "Built on harnesses, not from scratch",
    body: "We build on the agent frameworks that already solved the hard parts — streaming, tool calling, state, retries, tracing — and spend our time on the part that is specific to you.",
    items: [
      "Vercel AI SDK",
      "Claude Agent SDK",
      "Model Context Protocol",
      "LangGraph",
      "OpenAI Agents SDK",
      "Pinecone / pgvector",
      "n8n & Temporal",
      "LangSmith",
    ],
  },
};
