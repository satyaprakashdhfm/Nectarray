/**
 * Copy for the /agentic-ai service page.
 *
 * Kept separate from practices.ts because the homepage carries only the
 * summary of this practice — this file is the long form behind it.
 */
import type { IconCard, Step } from "@/types";

export const agenticAiPage = {
  meta: {
    title: "Agentic AI — chatbots, workflow agents and custom MCP servers",
    description:
      "NectArray builds AI agents that do work: support and sales chatbots grounded in your own data, back-office workflow agents, in-product copilots, and custom MCP servers that expose your systems as tools.",
  },

  hero: {
    eyebrow: "Practice 03 · Agentic AI",
    headline: ["Agents that do the work,", "not demos that describe it."],
    lede: "A chatbot that answers questions is table stakes. We build agents with tools, memory and permissions — systems that read your data, take real actions in your software, and hand off to a human at the point they should.",
    stats: [
      { value: "4–8", label: "Weeks to a working agent" },
      { value: "MCP", label: "Native, not bolted on" },
      { value: "100%", label: "Yours to host and own" },
    ],
    /** Overlaid on the hero panel, the way /academy badges its card. */
    panel: {
      badge: "The tooling",
      lines: ["Built on harnesses.", "Not from scratch."] as [string, string],
    },
    primaryCta: { label: "Scope an agent", href: "/contact#enquiry" },
    secondaryCta: { label: "See what we build", href: "#capabilities" },
  },

  /* ---------------------------------------------------------------------
     The five families of work, each with concrete deliverables
  --------------------------------------------------------------------- */
  families: [
    {
      id: "chatbots",
      index: "01",
      icon: "message",
      title: "Conversational agents",
      summary:
        "The agents your customers and staff talk to. Grounded in your real content, so they answer from what you actually published rather than what the model guessed.",
      items: [
        {
          name: "Customer support agent",
          body: "Answers from your documentation, policies and catalogue, cites where it got each answer, and escalates to a human the moment confidence drops or the topic is one you flagged as off-limits.",
        },
        {
          name: "Sales & qualification agent",
          body: "Asks the qualifying questions your team would ask, books a call on a real calendar, and writes the whole conversation into your CRM as a lead with the answers attached.",
        },
        {
          name: "WhatsApp business agent",
          body: "The same agent on WhatsApp Business API, where most Indian customers actually are — order status, bookings, FAQs, with handover to a person in the same thread.",
        },
        {
          name: "Internal knowledge assistant",
          body: "Staff-facing, over SOPs, contracts, past tickets and spreadsheets. Cuts the questions your senior people answer forty times a week.",
        },
        {
          name: "Voice agent",
          body: "Inbound and outbound calls for bookings, reminders and qualification, with a transcript and summary in your inbox afterwards.",
        },
      ],
    },
    {
      id: "mcp",
      index: "02",
      icon: "plug",
      title: "Custom MCP servers",
      summary:
        "Model Context Protocol is how an AI client gets safe, typed access to a system. We build the server that exposes yours — once — and then every AI tool you use can work with your data.",
      items: [
        {
          name: "Your systems as tools",
          body: "Your CRM, database, ticketing, inventory or internal APIs wrapped as MCP tools with proper schemas, so a model calls them correctly instead of guessing at your API.",
        },
        {
          name: "Scoped permissions",
          body: "Per-user and per-role access enforced server-side, not in the prompt. A salesperson's agent sees their pipeline; it cannot see payroll.",
        },
        {
          name: "Safe writes",
          body: "Read tools run freely. Anything that changes state — refund, cancel, send — is separated, confirmed, rate-limited and written to an audit log you can query.",
        },
        {
          name: "Works with any client",
          body: "Because it speaks MCP, the same server serves Claude, your own product, an internal tool or whatever client you adopt next. You build the integration once.",
        },
        {
          name: "Hosted or self-hosted",
          body: "Run it on your own infrastructure if the data cannot leave, or let us host and operate it. Either way the code is yours.",
        },
      ],
    },
    {
      id: "workflows",
      index: "03",
      icon: "workflow",
      title: "Workflow agents",
      summary:
        "Back-office work that is too judgement-heavy for a script and too repetitive for a person. These run on a schedule or a trigger, not in a chat window.",
      items: [
        {
          name: "Inbox triage and routing",
          body: "Reads incoming mail, classifies it, drafts the reply, routes what needs a human to the right person with context attached.",
        },
        {
          name: "Lead enrichment",
          body: "Takes a bare form submission, researches the company, scores it against your criteria and files it in the CRM ready to work.",
        },
        {
          name: "Document extraction",
          body: "Invoices, purchase orders, KYC documents and contracts turned into structured records, with the uncertain fields flagged rather than quietly guessed.",
        },
        {
          name: "Reconciliation",
          body: "Matches invoices to payments to purchase orders, and surfaces only the exceptions that genuinely need a person to look.",
        },
        {
          name: "Scheduled reporting",
          body: "Pulls the numbers, writes the commentary a human would write, and posts it where the team already looks.",
        },
      ],
    },
    {
      id: "in-product",
      index: "04",
      icon: "sparkles",
      title: "AI inside your product",
      summary:
        "Not a bot bolted to the corner of the screen — a feature of your software, built to the same standard as the rest of it.",
      items: [
        {
          name: "Embedded copilot",
          body: "An assistant that understands the screen the user is on and can act on their behalf, with streaming responses and a UI that reacts as tools run.",
        },
        {
          name: "Semantic search",
          body: "Search that finds the right record when the user does not know the exact words, sitting alongside your existing keyword search rather than replacing it.",
        },
        {
          name: "Summaries and drafts",
          body: "Threads, tickets, meetings and documents condensed, or first drafts generated, at the point in the flow where someone would otherwise start from a blank box.",
        },
        {
          name: "Natural-language reporting",
          body: "Users ask a question in plain words; the agent writes the query, runs it against your data and returns the answer with the numbers it used.",
        },
      ],
    },
    {
      id: "crm",
      index: "05",
      icon: "chart",
      title: "Customer management",
      summary:
        "Agents pointed at the relationship rather than the conversation — keeping your CRM honest without anyone having to maintain it.",
      items: [
        {
          name: "Conversations into the CRM",
          body: "Every chat, call and email logged against the right contact with a summary and next action, so the record is current without a person updating it.",
        },
        {
          name: "Follow-up sequences",
          body: "Drafts the follow-up your rep keeps meaning to send, at the moment it should go, for them to approve or send as-is.",
        },
        {
          name: "Intent and churn signals",
          body: "Watches support and usage patterns for the language that precedes a cancellation or a purchase, and flags the account while it still matters.",
        },
        {
          name: "Deflection analytics",
          body: "Shows which questions the agent answered, which it escalated and which it got wrong — which is also your roadmap for what to document next.",
        },
      ],
    },
  ],

  /* ---------------------------------------------------------------------
     The unglamorous half — the reason a demo becomes a system
  --------------------------------------------------------------------- */
  engineering: {
    eyebrow: "The other half",
    title: "The part that turns a demo into something you can run",
    lede: "Anyone can get a convincing answer out of a model once. Everything below is what separates that from something you are willing to put in front of customers.",
    items: [
      {
        icon: "check",
        title: "Evaluation suites",
        body: "A test set of real questions with known-good answers, run on every prompt or model change, so an improvement in one place cannot silently break three others.",
      },
      {
        icon: "shield",
        title: "Guardrails",
        body: "Topic boundaries, refusal behaviour, PII redaction before anything leaves your infrastructure, and hard limits on what any tool is permitted to do.",
      },
      {
        icon: "gauge",
        title: "Cost and latency budgets",
        body: "Per-conversation ceilings, smaller models for the easy steps, caching for the repeated ones. An agent that costs more than the work it saves is not automation.",
      },
      {
        icon: "search",
        title: "Observability",
        body: "Full traces of every run — what the model saw, which tools it called, what came back. When someone asks why it did that, you can answer.",
      },
      {
        icon: "database",
        title: "Retrieval that holds up",
        body: "Chunking, embeddings and re-ranking tuned against your actual corpus, plus a re-index pipeline so the agent knows about the document you published this morning.",
      },
      {
        icon: "arrow",
        title: "Human handover",
        body: "A defined confidence threshold, a clean escalation path, and full context handed to whoever picks it up. The failure mode is a person, not a wrong answer.",
      },
    ] satisfies IconCard[],
  },

  stack: {
    title: "Built on harnesses, not from scratch",
    body: "The frameworks below already solved streaming, tool calling, state, retries and tracing. We build on them and spend the time on the part that is specific to you.",
    groups: [
      {
        label: "Agent frameworks",
        brands: [
          { name: "Vercel AI SDK", domain: "ai-sdk.dev" },
          { name: "Claude Agent SDK", domain: "anthropic.com" },
          { name: "LangGraph", domain: "langchain.com" },
          { name: "OpenAI Agents SDK", domain: "openai.com" },
        ],
      },
      {
        label: "Context & retrieval",
        brands: [
          { name: "Model Context Protocol", domain: "modelcontextprotocol.io" },
          { name: "pgvector", domain: "postgresql.org" },
          { name: "Pinecone", domain: "pinecone.io" },
          { name: "Unstructured", domain: "unstructured.io" },
        ],
      },
      {
        label: "Orchestration",
        brands: [
          { name: "Temporal", domain: "temporal.io" },
          { name: "Inngest", domain: "inngest.com" },
          { name: "n8n", domain: "n8n.io" },
          { name: "Vercel Cron", domain: "vercel.com" },
        ],
      },
      {
        label: "Evals & tracing",
        brands: [
          { name: "LangSmith", domain: "smith.langchain.com" },
          { name: "Braintrust", domain: "braintrust.dev" },
          { name: "OpenTelemetry", domain: "opentelemetry.io" },
          { name: "Sentry", domain: "sentry.io" },
        ],
      },
    ],
  },

  process: {
    eyebrow: "How an engagement runs",
    title: "From idea to something in production",
    steps: [
      {
        n: "01",
        title: "Find the task worth automating",
        body: "A half-day session on where the repetitive judgement actually sits. Some of what people want to automate should not be, and we will say so before you pay for it.",
      },
      {
        n: "02",
        title: "Prototype on your real data",
        body: "Within two weeks you have something you can use against your own content — not a canned demo. This is where you find out whether the idea holds.",
      },
      {
        n: "03",
        title: "Build the evals",
        body: "Before hardening anything, we agree what a good answer looks like and write the test set. Without this there is no way to know whether a change helped.",
      },
      {
        n: "04",
        title: "Ship behind a limit",
        body: "Live to a small share of traffic or one team first, with cost caps and a kill switch, while the traces tell us where it is weak.",
      },
      {
        n: "05",
        title: "Operate or hand over",
        body: "We keep tuning it, or we hand over the repo, the evals and the runbook and show your team how to. Your call — the code is yours from day one.",
      },
    ] satisfies Step[],
  },

  faqs: [
    {
      q: "Is this just a wrapper around ChatGPT?",
      a: "No. The model is one component. The work is retrieval over your data, tools that call your systems with the right permissions, evaluation suites, guardrails and observability. We are happy to walk you through the architecture of anything we build before you commit to it.",
    },
    {
      q: "What is MCP, in plain terms?",
      a: "Model Context Protocol is a standard way to give an AI client typed, permissioned access to a system — think of it as a well-documented API written for models rather than for developers. Build one MCP server for your CRM and any MCP-speaking client can use it, instead of writing a fresh integration for every tool you adopt.",
    },
    {
      q: "Can our data stay on our own infrastructure?",
      a: "Yes. Retrieval, the MCP server and the orchestration can all run in your own environment. The only thing that need leave is the prompt sent to whichever model provider you choose, and where even that is unacceptable we can work with a self-hosted open-weights model instead.",
    },
    {
      q: "What does it cost to run?",
      a: "Model spend depends on volume and how much context each call needs. We set a per-conversation budget during the build, route the easy steps to smaller models and cache the repeated ones, then show you the real number on your own traffic before you scale it up.",
    },
    {
      q: "What if it gives a wrong answer to a customer?",
      a: "That is designed for rather than hoped against. Answers are grounded in your documents with citations, confidence thresholds trigger handover to a person, and every run is traced so a bad answer can be reproduced and fixed rather than argued about.",
    },
    {
      q: "How long before we see something real?",
      a: "A working prototype on your own data inside two weeks. Something in production, with evals and guardrails, typically four to eight weeks depending on how many systems it has to touch.",
    },
  ],

  cta: {
    title: "Tell us the task, not the technology.",
    body: "The best first conversation is about the work that eats your team's week — not about which model to use. Bring that and we will tell you honestly whether an agent is the right answer.",
    primary: { label: "Start the conversation", href: "/contact#enquiry" },
    secondary: { label: "See our other practices", href: "/#services" },
  },
};
