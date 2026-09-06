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
    eyebrow: "Agentic AI",
    headline: ["Agents that do the work,", "So your team can do more."],
    lede: "We build agents with tools, memory and permissions — systems that read your data, take real actions in your software, and hand off to a human at the point they should.",
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
    primaryCta: { label: "Start an agent", href: "/contact#enquiry" },
    secondaryCta: { label: "See what we build", href: "#capabilities" },
  },

  /* ---------------------------------------------------------------------
     The five families of work, each with concrete deliverables
  --------------------------------------------------------------------- */
  families: [
    {
      id: "customer-care",
      index: "01",
      icon: "message",
      title: "Customer care agents",
      summary:
        "The agent your customers reach — on chat, on WhatsApp and on the phone. It answers from your own documentation, policies and catalogue, cites the page it took each answer from, opens and works tickets, and hands the conversation to a person the moment one is wanted. One agent, every channel, with the same knowledge behind all of them.",
      items: [
        {
          name: "Support agent on your site",
          body: "Reads your documentation, policies and product catalogue, and answers from them with a link to the source. You mark the topics that always go to a human, and it routes those with the full conversation attached.",
        },
        {
          name: "Voice agent on the phone",
          body: "Takes inbound calls and makes outbound ones — bookings, reminders, order status, qualification. Every call arrives in your inbox afterwards as a recording, a transcript and a short summary of what was agreed.",
        },
        {
          name: "WhatsApp agent",
          body: "The same agent on WhatsApp Business API, where most Indian customers already are. Order status, appointments, delivery updates and FAQs, and your team can take over the same thread mid-conversation.",
        },
        {
          name: "Ticket raising and resolution",
          body: "Opens the ticket itself, with the priority, the category and the customer's details already filled in from the conversation. It resolves what it can end to end, and tracks the rest to closure so nothing sits unanswered.",
        },
        {
          name: "Sales and qualification",
          body: "Asks the questions your team would ask, books the call on a real calendar, and writes the lead into your CRM with every answer attached, ready for someone to pick up.",
        },
        {
          name: "Internal helpdesk",
          body: "The staff-facing version, over your SOPs, contracts, past tickets and spreadsheets. It answers the questions your senior people currently answer forty times a week.",
        },
      ],
    },
    {
      id: "mcp",
      index: "02",
      icon: "plug",
      title: "Custom MCP servers",
      summary:
        "Model Context Protocol is the standard way an AI client gets safe, typed access to a system. We build the server that exposes yours, once, and from then on every AI tool you adopt can work with your data through it — with the permissions and the audit trail enforced on the server where they hold.",
      items: [
        {
          name: "Your systems as tools",
          body: "Your CRM, database, ticketing, inventory and internal APIs wrapped as MCP tools with proper schemas, so a model calls them the way your own engineers would.",
        },
        {
          name: "Permissions on the server",
          body: "Access decided per user and per role in the server itself. A salesperson's agent sees their own pipeline, and that is the whole of what it can reach.",
        },
        {
          name: "Writes that are deliberate",
          body: "Reads run freely. Anything that changes state — a refund, a cancellation, a message going out — is a separate tool, confirmed before it runs, rate-limited, and written to an audit log you can query later.",
        },
        {
          name: "One integration, every client",
          body: "Because it speaks MCP, the same server serves Claude, your own product, an internal tool, and whatever client you adopt next year. You build the integration once and reuse it.",
        },
        {
          name: "Hosted wherever it belongs",
          body: "Runs on your own infrastructure where the data has to stay inside it, or we host and operate it for you. The code is yours in both cases.",
        },
      ],
    },
    {
      id: "workflows",
      index: "03",
      icon: "workflow",
      title: "Workflow agents",
      summary:
        "The back-office work that needs judgement on every item and happens hundreds of times a week. These run on a schedule or a trigger rather than in a chat window: they read what arrived, decide what it is, do the part that is mechanical, and put the rest in front of the right person with the context already gathered.",
      items: [
        {
          name: "Inbox triage and routing",
          body: "Reads what comes in, classifies it, drafts the reply, and routes anything wanting a decision to the person who makes it, with the history attached.",
        },
        {
          name: "Lead enrichment",
          body: "Takes a bare form submission, researches the company behind it, scores it against your own criteria, and files it in the CRM ready to work.",
        },
        {
          name: "Document extraction",
          body: "Invoices, purchase orders, KYC documents and contracts turned into structured records. Fields it is confident about go straight through; the rest are flagged for a person to confirm.",
        },
        {
          name: "Reconciliation",
          body: "Matches invoices to payments to purchase orders across systems, and puts the handful of genuine exceptions in front of your accounts team.",
        },
        {
          name: "Scheduled reporting",
          body: "Pulls the numbers, writes the commentary a human would write about them, and posts it where the team already looks on the morning they need it.",
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
