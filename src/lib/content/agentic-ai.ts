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
      icon: "bot",
      title: "Agents that do the work",
      summary:
        "An agent given one job somebody currently does by hand, wired into the systems that job already touches. Customer conversations on every channel, yes  + EM +  but equally the reconciliation, the chasing, the triage and the weekly report. It answers from your own documentation and data, cites where each answer came from, and stops for a person the moment a person is wanted.",
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
      title: "Custom MCP servers, for any system",
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

     One card per industry, and inside each one a tab per job of work. The
     two families above say what we build; a buyer reading them is
     translating into their own week, and this does that translation — the
     instruction someone types, the systems it reaches, and the view whoever
     owns that job opens afterwards.

     The screens are illustrations of the shape of the output. They are not
     screenshots, and they are not anybody's data.
  --------------------------------------------------------------------- */
  industries: [
    {
      id: "financial-services",
      label: "Financial services",
      icon: "chart",
      lede: "Finance teams lose their week to reconciling things that should reconcile themselves. These are the three that come up in every engagement.",
      tabs: [
        {
          id: "cash-position",
          label: "Cash position",
          title: "Know what the cash actually is, not what the balance says",
          body: "The agent reads your ledger and your gateway settlements, reconciles one against the other, and separates money you can spend today from money that has not landed yet. The exceptions arrive already investigated.",
          points: [
            "Cleared cash separated from money still in transit",
            "Upcoming outflows netted against the reserve you hold",
            "A written note on anything that looks tight",
          ],
          prompt:
            "Pull our cash position from the books and reconcile it against gateway settlements. Show me what is genuinely available today against what is still in transit.",
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
                cells: [
                  "Fixed deposit",
                  "₹30,25,000",
                  "15 Oct",
                  "90-day reserve",
                ],
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
            ],
            sheets: ["Cash position", "Settlements", "Reserve policy"],
          },
        },
        {
          id: "collections",
          label: "Collections",
          title: "Chase the invoices that would actually close the gap",
          body: "Every overdue invoice is not worth the same phone call. The agent ranks them by what they would recover and how likely they are to land, drafts a reminder in the tone that account is used to, and leaves the sending to you.",
          points: [
            "Ranked by amount, age and how the account has paid before",
            "A reminder drafted per invoice, not one template sent to all",
            "Promised-payment dates tracked and chased when they slip",
          ],
          prompt:
            "Rank our overdue invoices by what they would recover, draft a reminder for each in the tone that account is used to, and queue them for me to review.",
          connectors: ["Zoho Books", "Gmail"],
          screen: {
            file: "Overdue receivables",
            columns: ["Customer", "Amount", "Overdue", "Drafted"],
            rows: [
              {
                cells: [
                  "Meridian Retail",
                  "₹8,40,000",
                  "34 days",
                  "Ready to send",
                ],
                tone: "good",
              },
              {
                cells: [
                  "Sunrise Traders",
                  "₹6,12,500",
                  "21 days",
                  "Ready to send",
                ],
                tone: "good",
              },
              {
                cells: [
                  "Kestrel Logistics",
                  "₹4,88,000",
                  "58 days",
                  "Promised 20 Oct",
                ],
                tone: "warn",
              },
              {
                cells: [
                  "Anvil Foods",
                  "₹2,10,400",
                  "12 days",
                  "Held — dispute open",
                ],
                tone: "muted",
              },
              {
                cells: [
                  "Top five would recover",
                  "₹22,90,900",
                  "",
                  "Closes the reserve gap",
                ],
                tone: "total",
              },
              {
                cells: [
                  "Needs your decision",
                  "1 account",
                  "",
                  "Anvil — credit note?",
                ],
                tone: "total",
              },
            ],
            sheets: ["Ranked", "Drafts", "Promises"],
          },
        },
        {
          id: "month-end",
          label: "Month-end close",
          title: "Match everything, and show only what refuses to match",
          body: "Invoices to payments to purchase orders, across systems that were never designed to agree. The agent does the matching and puts the genuine exceptions in front of your accounts team with both sides of each one already pulled up.",
          points: [
            "Three-way matching across billing, banking and procurement",
            "Duplicates and part-payments identified rather than flagged",
            "Every exception with both records attached, ready to judge",
          ],
          prompt:
            "Match October invoices to payments and purchase orders. Clear whatever matches cleanly and give me the exceptions with both records attached.",
          connectors: ["Tally", "HDFC statements"],
          screen: {
            file: "October close",
            columns: ["Batch", "Items", "Outcome", "Status"],
            rows: [
              {
                cells: [
                  "Vendor invoices",
                  "1,284",
                  "Matched to PO and payment",
                  "Cleared",
                ],
                tone: "good",
              },
              {
                cells: [
                  "Customer receipts",
                  "2,013",
                  "Matched to invoice",
                  "Cleared",
                ],
                tone: "good",
              },
              {
                cells: ["Part payments", "17", "Split and applied", "Cleared"],
                tone: "good",
              },
              {
                cells: [
                  "Duplicate entries",
                  "4",
                  "Same invoice, two vendors",
                  "For review",
                ],
                tone: "warn",
              },
              {
                cells: ["Unmatched", "9", "No PO found", "For review"],
                tone: "warn",
              },
              {
                cells: [
                  "Closed automatically",
                  "3,314 of 3,327",
                  "",
                  "99.6% of the ledger",
                ],
                tone: "total",
              },
              {
                cells: ["On your desk", "13", "", "Was around 400"],
                tone: "total",
              },
            ],
            sheets: ["Summary", "Exceptions", "Audit trail"],
          },
        },
      ],
    },
    {
      id: "small-business",
      label: "Small business",
      icon: "briefcase",
      lede: "A small team answers the same nine questions all week and books everything by hand. Each tab is one of the jobs that keeps a founder off the work they meant to do.",
      tabs: [
        {
          id: "enquiries",
          label: "Enquiries",
          title: "Answer every enquiry, on the channel it arrived on",
          body: "One agent on WhatsApp, web chat and the phone, answering from your own catalogue, pricing and policies. It handles what it can end to end and sends you only what wants a decision, with the whole thread attached.",
          points: [
            "Order, delivery and pricing questions answered from your data",
            "The same answer whichever channel it was asked on",
            "Refunds and complaints passed to you, never guessed at",
          ],
          prompt:
            "Answer order and delivery questions on WhatsApp and web chat from our catalogue, and send me anything about a refund or a complaint.",
          connectors: ["WhatsApp Business", "Your catalogue"],
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
                cells: ["Nithin P.", "Web chat", "GST invoice copy", "Sent"],
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
            sheets: ["Enquiries", "Handovers", "Sources"],
          },
        },
        {
          id: "bookings",
          label: "Bookings",
          title: "Fill the diary without three messages each time",
          body: "The agent offers real slots from the calendar your team already uses, holds one while the customer decides, confirms it, and sends the reminders. Reschedules and cancellations go through the same conversation.",
          points: [
            "Live availability, so nothing is double booked",
            "Confirmations and reminders sent without anyone remembering to",
            "Reschedules handled in the same thread as the booking",
          ],
          prompt:
            "Offer installation slots from our calendar, confirm the booking, and send a reminder the day before. Let people reschedule in the same chat.",
          connectors: ["Google Calendar", "WhatsApp Business"],
          screen: {
            file: "Bookings — next 7 days",
            columns: ["When", "Customer", "Job", "State"],
            rows: [
              {
                cells: ["Thu 11:00", "Imran S.", "Installation", "Confirmed"],
                tone: "good",
              },
              {
                cells: ["Thu 15:30", "Meera K.", "Site visit", "Confirmed"],
                tone: "good",
              },
              {
                cells: [
                  "Fri 10:00",
                  "R. Bhat",
                  "Service call",
                  "Rescheduled by customer",
                ],
                tone: "muted",
              },
              {
                cells: [
                  "Fri 16:00",
                  "Open",
                  "Cancellation",
                  "Offered to waitlist",
                ],
                tone: "good",
              },
              {
                cells: [
                  "Sat 11:00",
                  "Anvil Foods",
                  "Bulk delivery",
                  "Needs your approval",
                ],
                tone: "warn",
              },
              {
                cells: ["Booked this week", "34", "", "None double booked"],
                tone: "total",
              },
              {
                cells: [
                  "Reminders sent",
                  "68",
                  "",
                  "24 hours and 2 hours before",
                ],
                tone: "total",
              },
            ],
            sheets: ["Diary", "Waitlist", "Reminders"],
          },
        },
        {
          id: "quotes",
          label: "Quotes & invoices",
          title: "Quote the same day, and get paid without chasing",
          body: "A quote request turns into a priced quote from your own rate card while the customer is still interested. Once accepted, the invoice is raised, sent, and followed up on the schedule you set.",
          points: [
            "Priced from your rate card, with your discount rules applied",
            "Invoice raised the moment a quote is accepted",
            "Polite follow-ups on a schedule, escalating to you if ignored",
          ],
          prompt:
            "Price quote requests from our rate card, raise the invoice when one is accepted, and follow up on anything unpaid after seven days.",
          connectors: ["Zoho Books", "WhatsApp Business"],
          screen: {
            file: "Quotes & invoices",
            columns: ["Reference", "Customer", "Value", "State"],
            rows: [
              {
                cells: [
                  "Q-1182",
                  "Sunrise Traders",
                  "₹3,40,000",
                  "Accepted — invoiced",
                ],
                tone: "good",
              },
              {
                cells: [
                  "Q-1180",
                  "Meridian Retail",
                  "₹1,15,500",
                  "Sent, awaiting reply",
                ],
                tone: "muted",
              },
              {
                cells: ["INV-0921", "Kestrel Logistics", "₹88,000", "Paid"],
                tone: "good",
              },
              {
                cells: [
                  "INV-0918",
                  "Anvil Foods",
                  "₹42,300",
                  "Follow-up sent, day 7",
                ],
                tone: "warn",
              },
              {
                cells: [
                  "Quoted this month",
                  "₹14,80,200",
                  "",
                  "Average reply in 6 minutes",
                ],
                tone: "total",
              },
              {
                cells: [
                  "Outstanding",
                  "₹42,300",
                  "",
                  "One account, chased twice",
                ],
                tone: "total",
              },
            ],
            sheets: ["Quotes", "Invoices", "Follow-ups"],
          },
        },
      ],
    },
    {
      id: "healthcare",
      label: "Healthcare",
      icon: "shield",
      lede: "Everything here is the front desk and the paperwork around a visit — scheduling, reminders and insurance. Deliberately nothing clinical: the agent never advises a patient about their care.",
      tabs: [
        {
          id: "front-desk",
          label: "Front desk",
          title: "Confirm tomorrow's list before tomorrow arrives",
          body: "The agent confirms each appointment over WhatsApp, sends the reminders, answers where-and-when questions about the clinic, and passes anything a patient asks about their treatment straight to your staff.",
          points: [
            "Confirmations and reminders before every appointment",
            "Directions, timings and documents to bring, answered instantly",
            "Anything clinical routed to a person, always",
          ],
          prompt:
            "Confirm tomorrow's appointments over WhatsApp, remind everyone what to bring, and route any question about treatment to the front desk.",
          connectors: ["Practice management system", "WhatsApp Business"],
          screen: {
            file: "Front desk — Monday",
            columns: ["Time", "Patient", "Reason", "Status"],
            rows: [
              {
                cells: ["09:15", "A. Menon", "Follow-up", "Confirmed"],
                tone: "good",
              },
              {
                cells: ["09:45", "S. Iqbal", "New patient", "Confirmed"],
                tone: "good",
              },
              {
                cells: [
                  "10:30",
                  "R. Pillai",
                  "Report collection",
                  "Reminded twice",
                ],
                tone: "muted",
              },
              {
                cells: [
                  "11:30",
                  "T. Rao",
                  "Asked about medication",
                  "Passed to front desk",
                ],
                tone: "warn",
              },
              {
                cells: [
                  "Reminders sent",
                  "48",
                  "",
                  "24 hours and 2 hours before",
                ],
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
            sheets: ["Schedule", "Messages", "Handovers"],
          },
        },
        {
          id: "waitlist",
          label: "Waitlist",
          title: "Refill a cancelled slot before it goes cold",
          body: "A cancellation at 10:00 is a lost hour by 10:20. The agent offers the slot down the waitlist in order, takes the first yes, and updates the schedule — usually before anyone at the desk has noticed.",
          points: [
            "Offered in waitlist order, with a short window to accept",
            "The schedule updated the moment someone takes it",
            "Nobody offered a slot they said they could not make",
          ],
          prompt:
            "When an appointment is cancelled, offer the slot down the waitlist in order, and update the schedule as soon as someone accepts.",
          connectors: ["Practice management system", "WhatsApp Business"],
          screen: {
            file: "Waitlist — this week",
            columns: ["Slot freed", "Offered to", "Response", "Outcome"],
            rows: [
              {
                cells: [
                  "Mon 11:00",
                  "3 patients, in order",
                  "Second accepted",
                  "Refilled",
                ],
                tone: "good",
              },
              {
                cells: [
                  "Tue 15:30",
                  "2 patients",
                  "First accepted",
                  "Refilled",
                ],
                tone: "good",
              },
              {
                cells: [
                  "Wed 09:00",
                  "4 patients",
                  "None available",
                  "Left open",
                ],
                tone: "muted",
              },
              {
                cells: [
                  "Thu 16:15",
                  "1 patient",
                  "Asked to be removed",
                  "Waitlist updated",
                ],
                tone: "warn",
              },
              { cells: ["Slots freed", "14", "", "This week"], tone: "total" },
              {
                cells: ["Refilled", "11", "", "Average 19 minutes"],
                tone: "total",
              },
            ],
            sheets: ["Waitlist", "Offers", "Schedule"],
          },
        },
        {
          id: "insurance",
          label: "Insurance paperwork",
          title: "Chase the pre-authorisation nobody has time to chase",
          body: "The agent tracks every pre-authorisation from submission to decision, follows up on the ones that have gone quiet, and tells your desk which patients arriving this week still have nothing back.",
          points: [
            "Every request tracked from submission to a written decision",
            "Follow-ups sent on the insurer's own timeline",
            "A daily list of who is arriving without approval in hand",
          ],
          prompt:
            "Track every pre-authorisation, follow up on anything with no reply after three days, and tell me each morning who is arriving this week without approval.",
          connectors: ["Practice management system", "Insurer portals"],
          screen: {
            file: "Pre-authorisation",
            columns: ["Patient", "Insurer", "Submitted", "State"],
            rows: [
              {
                cells: [
                  "T. Rao",
                  "Star Health",
                  "3 Oct",
                  "No reply — chased twice",
                ],
                tone: "warn",
              },
              {
                cells: ["A. Menon", "HDFC Ergo", "6 Oct", "Approved"],
                tone: "good",
              },
              {
                cells: [
                  "S. Iqbal",
                  "Niva Bupa",
                  "8 Oct",
                  "Query raised — documents sent",
                ],
                tone: "muted",
              },
              {
                cells: ["M. Fernandes", "Care Health", "9 Oct", "Approved"],
                tone: "good",
              },
              {
                cells: [
                  "Approved this month",
                  "38 of 44",
                  "",
                  "Average 4 days",
                ],
                tone: "total",
              },
              {
                cells: [
                  "Arriving without approval",
                  "1",
                  "",
                  "Flagged to the desk",
                ],
                tone: "total",
              },
            ],
            sheets: ["Tracker", "Chased", "Approved"],
          },
        },
      ],
    },
  ],

  /* ---------------------------------------------------------------------
     The unglamorous half — the reason a demo becomes a system
  --------------------------------------------------------------------- */
  /* ---------------------------------------------------------------------
     Every kind of work an agent can take on, by the team that owns it.

     `steps` is what the agent actually does, in order, and the panel plays
     them as a task list working itself through. Placeholder for the films of
     real runs that will replace it — the shape of the panel does not change
     when they arrive, only what is inside it.
  --------------------------------------------------------------------- */
  domains: {
    eyebrow: "Where an agent earns its place",
    title: "An agent for the work each team is drowning in",
    lede: "Not one assistant that does a bit of everything. A specific agent, given one job that somebody currently does by hand, wired into the systems that job already touches.",
    items: [
      {
        id: "finance",
        prompt: "Pull our cash position from the books and reconcile it against gateway settlements. Show me what is genuinely available today.",
        connectors: ["Tally / Zoho Books", "Razorpay", "Bank feeds"],
        /** Reuses the worked example already written for this trade. */
        industry: "financial-services",
        label: "Finance & accounts",
        icon: "chart",
        body: "Reconciliation, chasing and the month-end scramble. The agent does the matching and brings you only what refuses to match.",
        steps: [
          "Pull the ledger and the settlement file",
          "Match line by line, flag the gaps",
          "Draft the chasers for what is overdue",
          "Post the exceptions for a human to sign off",
        ],
      },
      {
        id: "sales",
        prompt: "Read the enquiries that came in overnight, score them against what actually closes for us, and draft a reply to each.",
        connectors: ["HubSpot / Zoho CRM", "Gmail", "Calendar"],
        label: "Sales",
        icon: "target",
        body: "Research, follow-up and CRM hygiene — the work that gets skipped when the pipeline is busy, which is exactly when it costs you.",
        steps: [
          "Read the new enquiry and the company behind it",
          "Score it against what actually closes for you",
          "Draft the reply and the follow-up sequence",
          "Log everything to the CRM, properly",
        ],
      },
      {
        id: "support",
        prompt: "Answer the overnight messages from our own docs, do the small fixes yourself, and queue anything you are unsure of.",
        connectors: ["WhatsApp Business", "Freshdesk", "Shopify"],
        /** Reuses the worked example already written for this trade. */
        industry: "small-business",
        label: "Customer support",
        icon: "message",
        body: "Answering on the channel it arrived on, from your real documentation, and knowing when to stop and fetch a person.",
        steps: [
          "Read the message and find the order behind it",
          "Answer from your docs, cite where it came from",
          "Do the small thing — reschedule, refund, resend",
          "Hand over the moment it is out of its depth",
        ],
      },
      {
        id: "marketing",
        prompt: "Pull last week from the ad platforms and GA4, tell me what moved and what did not, and draft the next round of creative.",
        connectors: ["Meta Ads", "Google Ads", "GA4"],
        label: "Marketing",
        icon: "megaphone",
        body: "The repetitive half: briefs, variants, tagging and the weekly report nobody has time to assemble.",
        steps: [
          "Pull last week from the ad platforms and GA4",
          "Write the read: what moved, what did not",
          "Draft the next round of creative variants",
          "Queue them for a human to approve",
        ],
      },
      {
        id: "operations",
        prompt: "Watch today's orders, stock and courier feeds. Tell the right person the moment something is late, short or stuck.",
        connectors: ["Unicommerce", "Shiprocket", "Slack"],
        label: "Operations & logistics",
        icon: "workflow",
        body: "Chasing status across systems that do not talk to each other, and telling somebody before it becomes a problem.",
        steps: [
          "Watch orders, stock and courier feeds",
          "Spot what is late, short or stuck",
          "Notify the person who can act on it",
          "Keep a running note of what was done",
        ],
      },
      {
        id: "people",
        prompt: "Read this week's applications against the brief, summarise each with the evidence, and offer interview slots.",
        connectors: ["Keka / Darwinbox", "Gmail", "Calendar"],
        label: "People & hiring",
        icon: "briefcase",
        body: "Screening, scheduling and the onboarding checklist — the admin around hiring, not the judgement in it.",
        steps: [
          "Read the applications against the real brief",
          "Summarise each one, evidence attached",
          "Offer interview slots that suit both diaries",
          "Open the onboarding tasks on day one",
        ],
      },
      {
        id: "clinics",
        prompt: "Confirm tomorrow's list, refill anything that cancels from the waiting list, and chase the pre-authorisations.",
        connectors: ["Practice management", "WhatsApp Business", "Insurer portal"],
        /** Reuses the worked example already written for this trade. */
        industry: "healthcare",
        label: "Clinics & patient care",
        icon: "shield",
        body: "Confirmations, cancellations and pre-authorisations. The desk work around care, never the care itself.",
        steps: [
          "Confirm tomorrow's list before tomorrow arrives",
          "Refill a cancelled slot from the waiting list",
          "Chase the pre-authorisation nobody has time to",
          "Escalate anything clinical to a person",
        ],
      },
      {
        id: "legal",
        prompt: "Read this contract against our playbook and mark every clause that departs from it, with the precedent for each.",
        connectors: ["Google Drive", "DocuSign", "Clause library"],
        label: "Legal & compliance",
        icon: "notebook",
        body: "Reading the long documents and telling you which three clauses are not standard. A first pass, not an opinion.",
        steps: [
          "Read the contract against your own playbook",
          "Mark every clause that departs from it",
          "Pull the precedent for each one",
          "Send it to counsel with the work done",
        ],
      },
      {
        id: "engineering",
        prompt: "Read the alert and the logs around it, group it with what it resembles, and draft the first diagnosis.",
        connectors: ["Sentry", "GitHub", "PagerDuty"],
        label: "Engineering & IT",
        icon: "code",
        body: "Triage, on-call noise and the tickets that are the same five questions in different words.",
        steps: [
          "Read the alert and the logs around it",
          "Group it with the incidents it resembles",
          "Draft the first diagnosis and the runbook step",
          "Page a human if it is genuinely new",
        ],
      },
      {
        id: "reporting",
        prompt: "Answer the Monday question from the warehouse rather than last week's export, and check it reconciles before sending.",
        connectors: ["PostgreSQL", "Looker Studio", "Slack"],
        label: "Data & reporting",
        icon: "database",
        body: "The recurring question somebody answers by hand every Monday, answered from the source instead of a stale export.",
        steps: [
          "Query the warehouse, not last week's export",
          "Check the numbers reconcile before sending",
          "Write the summary a human would have written",
          "Deliver it where the team already looks",
        ],
      },
    ],
    cta: { label: "Ask about this one", href: "/contact#enquiry" },
  },

  stack: {
    title: "Built on harnesses, not from scratch",
    body: "Every model and framework we would reach for, named. The harnesses below already solved streaming, tool calling, state, retries and tracing, so we build on them and spend the time on the part that is specific to you. Which model runs the job is a decision we make per task and can change later  + EM +  nothing in the build is welded to one vendor.",
    groups: [
      {
        label: "Models",
        brands: [
          { name: "Claude", domain: "anthropic.com" },
          { name: "GPT", domain: "openai.com" },
          { name: "Gemini", domain: "gemini.google.com" },
          { name: "Llama", domain: "llama.com" },
          { name: "Mistral", domain: "mistral.ai" },
          { name: "DeepSeek", domain: "deepseek.com" },
          { name: "Qwen", domain: "qwen.ai" },
          { name: "Ollama", domain: "ollama.com" },
        ],
      },
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
