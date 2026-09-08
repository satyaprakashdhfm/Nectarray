/**
 * Copy for the /agentic-ai service page.
 *
 * Kept separate from practices.ts because the homepage carries only the
 * summary of this practice — this file is the long form behind it.
 */
import type { IconCard, Step } from "@/types";

export const agenticAiPage = {
  meta: {
    title: "Agentic AI — customer care agents and custom MCP servers",
    description:
      "NectArray builds AI agents that do work: support and sales agents grounded in your own data, on chat, WhatsApp and the phone, and custom MCP servers that expose your systems as tools.",
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
     The families of work, each with concrete deliverables
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
  ],

  /* ---------------------------------------------------------------------
     What it looks like in an actual business

     The two families above say what we build. These say what it does on a
     Tuesday, which is the question a buyer is really asking — so each tab
     is one real job of work, the systems it is plugged into, and the view
     the person who owns that job would open afterwards.

     The screens are illustrations of the shape of the output, not
     screenshots of anyone's data.
  --------------------------------------------------------------------- */
  industries: [
    {
      id: "financial-services",
      label: "Financial services",
      icon: "chart",
      title: "Close the books without the Tuesday scramble",
      body: "The agent reads your ledger and your gateway settlements, reconciles one against the other, and tells you what your cash actually is today rather than what the balance says. The exceptions come to you already investigated.",
      points: [
        "Cleared cash separated from money still in transit",
        "Overdue receivables ranked by what they would close",
        "A reminder drafted per invoice, for you to send",
      ],
      prompt:
        "Pull our cash position from the books and reconcile it against gateway settlements. Rank the overdue invoices that would close the gap, and draft a reminder for each.",
      connectors: ["Tally / Zoho Books", "Razorpay"],
      screen: {
        file: "Cash-position.xlsx",
        columns: ["Account", "Balance", "As of", "Note"],
        rows: [
          {
            cells: [
              "Operating current a/c",
              "₹62,34,018",
              "15 Oct",
              "Primary — HDFC",
            ],
          },
          {
            cells: ["Fixed deposit", "₹30,25,000", "15 Oct", "90-day reserve"],
          },
          {
            cells: [
              "Gateway — settled",
              "₹4,12,044",
              "15 Oct",
              "Withdrawable now",
            ],
          },
          {
            cells: [
              "Gateway — in transit",
              "₹18,45,000",
              "15 Oct",
              "T+2 — see Settlements",
            ],
            tone: "muted",
          },
          {
            cells: [
              "Cleared cash today",
              "₹96,71,062",
              "",
              "Excludes in transit",
            ],
            tone: "total",
          },
          {
            cells: [
              "Projected by 22 Oct",
              "₹1,15,16,062",
              "",
              "Includes in transit",
            ],
            tone: "total",
          },
          {
            cells: [
              "Vendor run due 18 Oct",
              "−₹84,50,000",
              "18 Oct",
              "Net of TDS",
            ],
            tone: "bad",
          },
          {
            cells: [
              "Gap vs reserve target",
              "+₹66,062",
              "",
              "Tight — transit must clear",
            ],
            tone: "warn",
          },
          {
            cells: [
              "Gap if transit excluded",
              "−₹17,78,938",
              "",
              "Collect receivables as backstop",
            ],
            tone: "bad",
          },
        ],
        sheets: ["Cash position", "Settlements", "Overdue A/R"],
      },
    },
    {
      id: "small-business",
      label: "Small business",
      icon: "briefcase",
      title: "Answer every enquiry, on the channel it arrived on",
      body: "Most of what a small team answers all week is the same nine questions. The agent takes those on WhatsApp, chat and the phone, from your own catalogue and policies, books what needs booking, and sends you only the ones that want a decision.",
      points: [
        "Order, delivery and pricing questions answered from your data",
        "Slots booked on the calendar your team already uses",
        "Refunds and complaints handed to you with the full thread",
      ],
      prompt:
        "Answer order and delivery questions on WhatsApp from our catalogue, book installation slots on the real calendar, and send me anything about a refund.",
      connectors: ["WhatsApp Business", "Google Calendar"],
      screen: {
        file: "Enquiries — this week",
        columns: ["Customer", "Channel", "Asked for", "Outcome"],
        rows: [
          {
            cells: [
              "Kavya R.",
              "WhatsApp",
              "Delivery date, order #4821",
              "Answered",
            ],
            tone: "good",
          },
          {
            cells: [
              "Sunrise Traders",
              "Web chat",
              "Bulk pricing, 200 units",
              "Quote sent",
            ],
            tone: "good",
          },
          {
            cells: [
              "Imran S.",
              "Phone",
              "Reschedule installation",
              "Booked — Thu 11:00",
            ],
            tone: "good",
          },
          {
            cells: [
              "Deepa M.",
              "WhatsApp",
              "Refund, damaged item",
              "Passed to you",
            ],
            tone: "warn",
          },
          {
            cells: ["Nithin P.", "Web chat", "GST invoice copy", "Sent"],
            tone: "good",
          },
          {
            cells: ["Handled without you", "82 of 91", "", "Last 7 days"],
            tone: "total",
          },
          {
            cells: [
              "Waiting on a person",
              "9",
              "",
              "Each with the thread attached",
            ],
            tone: "total",
          },
        ],
        sheets: ["Enquiries", "Bookings", "Handovers"],
      },
    },
    {
      id: "healthcare",
      label: "Healthcare",
      icon: "shield",
      title: "Run the front desk, not the consultation",
      body: "Scheduling, reminders, and the paperwork around a visit — deliberately nothing clinical. The agent confirms tomorrow's list, offers cancelled slots down the waitlist in order, and flags the patients whose insurance approval has not come back.",
      points: [
        "Confirmations and reminders before every appointment",
        "Cancelled slots refilled from the waitlist automatically",
        "Pre-authorisation chased and escalated when it stalls",
      ],
      prompt:
        "Confirm tomorrow's appointments over WhatsApp, offer cancelled slots to the waitlist in order, and flag anyone whose insurance pre-authorisation is still pending.",
      connectors: ["Practice management system", "WhatsApp Business"],
      screen: {
        file: "Front desk — Monday",
        columns: ["Time", "Patient", "Reason", "Status"],
        rows: [
          {
            cells: ["09:15", "A. Menon", "Follow-up, post-op", "Confirmed"],
            tone: "good",
          },
          {
            cells: ["09:45", "S. Iqbal", "New patient", "Confirmed"],
            tone: "good",
          },
          {
            cells: ["10:30", "R. Pillai", "Report review", "Reminded twice"],
            tone: "muted",
          },
          {
            cells: [
              "11:00",
              "Waitlist",
              "Cancellation offered",
              "Slot refilled",
            ],
            tone: "good",
          },
          {
            cells: [
              "11:30",
              "T. Rao",
              "Pre-auth outstanding",
              "Passed to front desk",
            ],
            tone: "warn",
          },
          {
            cells: ["Reminders sent", "48", "", "24 hours and 2 hours before"],
            tone: "total",
          },
          {
            cells: [
              "No-shows this week",
              "3 of 96",
              "",
              "Was 11 the week before",
            ],
            tone: "total",
          },
        ],
        sheets: ["Schedule", "Waitlist", "Pre-auth"],
      },
    },
    {
      id: "retail",
      label: "Retail & e-commerce",
      icon: "cart",
      title: "Keep the order questions off your inbox",
      body: "Where is it, can I return it, why was I charged that. The agent answers all three from your store and your courier, books the pickup when a return is approved, and escalates the ones where a person has to make a call.",
      points: [
        "Order status and tracking answered from the store itself",
        "Approved returns booked with the courier, end to end",
        "Pricing and goodwill decisions escalated, never guessed",
      ],
      prompt:
        "Answer order status and return questions from the store, book courier pickups for approved returns, and escalate anything about pricing to me.",
      connectors: ["Shopify", "Shiprocket"],
      screen: {
        file: "Orders — last 30 days",
        columns: ["Order", "Question", "What the agent did", "Result"],
        rows: [
          {
            cells: [
              "#4821",
              "Where is my order",
              "Gave live tracking and ETA",
              "Closed",
            ],
            tone: "good",
          },
          {
            cells: [
              "#4790",
              "Delivery running late",
              "Told them, before they asked twice",
              "No ticket",
            ],
            tone: "good",
          },
          {
            cells: [
              "#4744",
              "Return, wrong size",
              "Booked courier pickup",
              "Closed",
            ],
            tone: "good",
          },
          {
            cells: [
              "#4712",
              "Price differs from the ad",
              "Escalated with screenshots",
              "Passed to you",
            ],
            tone: "warn",
          },
          {
            cells: [
              "Tickets deflected",
              "71%",
              "",
              "Of everything that came in",
            ],
            tone: "total",
          },
          {
            cells: [
              "First reply",
              "9 seconds",
              "",
              "Was a little over 4 hours",
            ],
            tone: "total",
          },
        ],
        sheets: ["Orders", "Returns", "Escalations"],
      },
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
