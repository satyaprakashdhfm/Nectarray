import {
  CATEGORIES,
  CONFIDENCE_LABEL,
  INTEGRATIONS,
  type Integration,
} from "@/lib/integrations";
import type { PriceTable, Sheet } from "@/lib/price-book";

export const PROVIDERS = "providers";
export const COMMUNICATIONS = "communications";

type CategoryId = Integration["category"];

/**
 * Kinds of provider left off Third-party providers: payments and delivery
 * are on the Payments & delivery sheet, one table each, and SMS, WhatsApp
 * and email on Communications.
 */
const ELSEWHERE = new Set<CategoryId>([
  "payments",
  "delivery",
  "sms",
  "messaging",
]);

/**
 * One table per kind of provider (lib/integrations), each provider once
 * with its prices stacked beside it and a link to its pricing page.
 */
function providerTables(categories: readonly CategoryId[]): PriceTable[] {
  return categories.flatMap((id) => {
    const category = CATEGORIES.find((c) => c.id === id)!;
    const providers = INTEGRATIONS.filter((i) => i.category === id);
    if (providers.length === 0) return [];
    return [
      {
        id: `providers-${id}`,
        title: `${category.label}: ${providers.map((p) => p.name).join(", ")}`,
        compare: true,
        nameColumns: [0, 1],
        groupBy: 0,
        columns: [
          { label: "Provider", kind: "text" as const, facet: true },
          { label: "Item", kind: "text" as const },
          { label: "Price", kind: "text" as const },
          { label: "Basis", kind: "long" as const },
          { label: "Confidence", kind: "confidence" as const, facet: true },
          { label: "Pricing page", kind: "link" as const },
        ],
        rows: providers.flatMap((i) =>
          i.pricing.map((p, n) => ({
            id: `${i.slug}-${n}`,
            cells: [
              i.name,
              p.item,
              p.price,
              p.basis,
              CONFIDENCE_LABEL[p.confidence],
              i.links[0]?.url ?? null,
            ],
          })),
        ),
        ...(id === "sms" ? DLT_NOTES : {}),
      },
      ...(id === "sms" ? [DLT_PORTALS] : []),
    ];
  });
}

/** The providers that have no workbook sheet of their own. */
export function providersSheet(): Sheet {
  const categories = CATEGORIES.map((c) => c.id).filter(
    (id) => !ELSEWHERE.has(id),
  );
  return {
    slug: PROVIDERS,
    title: "Third-party providers",
    lede: "The outside services we connect to for maps, sign-in and analytics, grouped by what they do, with every price and a link to the provider's own pricing page. Messages are on Communications, payment gateways and couriers on Payments & delivery; AI, hosting and storage have their own sheets.",
    tables: providerTables(categories),
    checks: [],
    sources: [],
  };
}

/**
 * Everything a client's app uses to reach people: email (mailboxes on the
 * domain and the service that sends the app's own mail), WhatsApp, and SMS
 * with its DLT registration.
 */
export function communicationsSheet(): Sheet {
  return {
    slug: COMMUNICATIONS,
    title: "Communications",
    lede: "What it costs to reach people: email mailboxes on the client's domain and the SMTP service that sends the app's own mail, WhatsApp messages and template tools, and SMS and OTP with DLT registration. Each provider once, with every price beside it. 18% GST on top unless stated.",
    tables: [EMAIL, WHATSAPP, ...providerTables(["sms"])],
    checks: [
      "ZeptoMail's price per credit is from third-party listings ($2.50 per 10,000 emails); Zoho's page shows it in the buyer's currency at checkout.",
      "AiSensy's plan prices are from its own help pages (from 1 July 2025). Its price per WhatsApp message includes a markup on Meta's rate that sources disagree on; check the current rate card.",
    ],
    sources: [],
  };
}

type Line = [string, string, string, string, string, string];

/** Provider, item, price, basis, confidence, pricing page. */
function communicationsTable(
  id: string,
  title: string,
  note: string,
  lines: Line[],
): PriceTable {
  return {
    id,
    title,
    note,
    compare: true,
    nameColumns: [0, 1],
    groupBy: 0,
    columns: [
      { label: "Provider", kind: "text", facet: true },
      { label: "Item", kind: "text" },
      { label: "Price", kind: "text" },
      { label: "Basis", kind: "long" },
      { label: "Confidence", kind: "confidence", facet: true },
      { label: "Pricing page", kind: "link" },
    ],
    rows: lines.map((cells, n) => ({ id: `${id}-${n}`, cells })),
  };
}

/** A provider's own prices from lib/integrations, as table lines. */
function linesOf(slug: string): Line[] {
  const i = INTEGRATIONS.find((x) => x.slug === slug)!;
  return i.pricing.map((p) => [
    i.name,
    p.item,
    p.price,
    p.basis,
    CONFIDENCE_LABEL[p.confidence],
    i.links[0]?.url ?? "",
  ]);
}

const ZOHO_MAIL = "https://www.zoho.com/in/mail/zohomail-pricing.html";
const ZEPTO = "https://www.zoho.com/zeptomail/pricing.html";

const EMAIL = communicationsTable(
  "communications-email",
  "Email: mailboxes on the domain, and SMTP for the app's own mail",
  "Two different costs. Mailboxes (Zoho Mail) are per person who reads and writes mail on the client's domain. SMTP (ZeptoMail or Resend) is for mail the app sends by itself: sign-up, password reset, order and invoice emails. Most client projects need both. Full suites with mail are on Business workspace.",
  [
    [
      "Zoho Mail",
      "Free",
      "₹0",
      "Up to 5 users on one domain, 5 GB each, browser and app only (no IMAP, POP or Outlook).",
      "Official",
      ZOHO_MAIL,
    ],
    [
      "Zoho Mail",
      "Mail Lite (5 GB)",
      "₹59 a user a month",
      "Billed yearly. Email on the domain, calendar; data kept in India.",
      "Secondary",
      ZOHO_MAIL,
    ],
    [
      "Zoho Mail",
      "Mail Lite (10 GB)",
      "₹75 a user a month",
      "Billed yearly. As Lite 5 GB, with 10 GB.",
      "Secondary",
      ZOHO_MAIL,
    ],
    [
      "Zoho Mail",
      "Mail Premium",
      "₹199 a user a month",
      "Billed yearly. 50 GB, email security (eProtect), retention, 1 GB attachments.",
      "Secondary",
      ZOHO_MAIL,
    ],
    [
      "Zoho ZeptoMail",
      "SMTP and API sending",
      "$2.50 per 10,000 emails",
      "Pay as you go: one credit is 10,000 emails, valid 6 months. Transactional mail only, not newsletters.",
      "Reported",
      ZEPTO,
    ],
    [
      "Zoho ZeptoMail",
      "Free start",
      "₹0",
      "10,000 emails free with the first credit.",
      "Official",
      ZEPTO,
    ],
    ...linesOf("resend"),
  ],
);

const AISENSY =
  "https://wiki.aisensy.com/en/articles/11652273-pricing-update-effective-from-july-1";

const WHATSAPP = communicationsTable(
  "communications-whatsapp",
  "WhatsApp: messages, and tools for templates and broadcasts",
  "Meta charges for each delivered template message by its kind; replies inside 24 hours of a customer's message are free. Every template (order update, OTP, offer) is approved by Meta before use. Connecting straight to Meta's Cloud API has no monthly fee; a tool such as AiSensy adds a dashboard for templates, broadcasts, chatbots and agents, for a monthly fee and a markup per message.",
  [
    ...linesOf("whatsapp"),
    [
      "AiSensy",
      "Basic plan",
      "₹1,500 a month",
      "Plus GST; about 10% off yearly. Owner plus 5 agents; templates, broadcasts and a shared inbox.",
      "Reported",
      AISENSY,
    ],
    [
      "AiSensy",
      "Pro plan",
      "₹3,200 a month",
      "Plus GST; about 10% off yearly. Adds more automation and analytics.",
      "Reported",
      AISENSY,
    ],
    [
      "AiSensy",
      "Extra agent",
      "₹750 a month",
      "Per agent above the 5 included.",
      "Reported",
      AISENSY,
    ],
    [
      "AiSensy",
      "Messages",
      "Meta's rate plus a markup",
      "Reported at about ₹0.88 to ₹1.09 per marketing message and ₹0.145 per utility or OTP message.",
      "Quote only",
      AISENSY,
    ],
  ],
);

// DLT registration, from Nesark's DLT guide and its Hindi question-and-
// answer video, translated.

const GUIDE = "https://www.nesark.com/dlt-registration-process/";

const DLT_NOTES: Pick<PriceTable, "note" | "faq" | "faqSource"> = {
  faqSource: {
    label: "From Nesark's video, translated from Hindi",
    url: "https://youtu.be/4bDyc5u0oQ8",
  },
  note: "DLT registration is only needed for the client's own sender name or their own wording. An OTP sent from the provider's default sender and template (Message Central, Fast2SMS's OTP route) costs just the price per SMS above. Anything branded, such as the client's name as sender, order alerts, reminders or offers, needs DLT: about ₹5,900 on a DLT portal, and 2 to 4 days to set up.",
  faq: [
    {
      q: "What is DLT, and who needs it?",
      a: "DLT (Distributed Ledger Technology) registration is TRAI's system to stop spam SMS. Any business sending SMS in India under its own name registers three things: the business (the principal entity), its sender name (the header, such as NESARK), and every message template. Only then can an SMS provider send for it.",
    },
    {
      q: "When can we send without DLT?",
      a: "Only for OTPs sent from the provider's own sender and fixed template. The message comes from a generic or random sender, not the client's brand, and its wording cannot be changed. The cost is just the price per SMS. For the client's name as sender, or any message of their own (order updates, reminders, offers), DLT is required.",
    },
    {
      q: "What does it cost? Is it paid every year?",
      a: "₹5,000 + 18% GST = ₹5,900, paid to the DLT portal from the company's account or the authorised person's. It gives a login where you register headers and templates for as long as the registration is valid. When it ends, approved headers and templates keep working; only adding new ones is switched off until you pay again. So register every template you will need in the first period. If nothing new is needed later, there is nothing more to pay.",
    },
    {
      q: "How long is it valid?",
      a: "It depends on the portal. Jio, Airtel and VILPOWER (Vi) give 1 year; SmartPing gives 2 years and is usually quicker to approve. Data is shared between portals, and you can move later by applying on the new portal with your existing principal entity id.",
    },
    {
      q: "How long does approval take?",
      a: "On Jio or VILPOWER, 24 to 48 hours and sometimes longer. On SmartPing, registration is often approved in 2 to 3 hours and templates in half an hour to 2 hours. Allow 2 to 4 working days in a project plan.",
    },
    {
      q: "Can one DLT registration be used with several SMS providers?",
      a: "Yes. With each new provider you do PE-TM chain binding (linking the business to that provider's telemarketer id) and map the headers and templates in its panel. There is no limit.",
    },
    {
      q: "How many templates can we register, and how long can an SMS be?",
      a: "Templates are unlimited. One SMS is 160 characters in English and 70 characters in any other language (Unicode); longer messages are billed as several SMS.",
    },
    {
      q: "Can an approved template be changed?",
      a: "No; a change means registering a new template, which costs nothing. Put anything that changes, such as the OTP, a name or an amount, as a variable when registering, so one template covers every message.",
    },
    {
      q: "Who writes the templates?",
      a: "The business does, since it knows what it needs to say. Templates are rejected when they do not follow the portal's guidelines; the SMS provider can help fix them.",
    },
    {
      q: "What kinds of SMS are there?",
      a: "Promotional (offers; only to numbers not on Do Not Disturb, 10 am to 9 pm). Transactional (OTPs from banks). Service implicit (login OTPs, order updates, alerts; any time, including DND numbers). Since 7 May 2025, service explicit is closed to new templates, and headers carry a suffix: -P promotional, -S service, -T transactional, -G government.",
    },
    {
      q: "What documents are needed?",
      a: "A company or LLP: incorporation certificate, MSME (Udyam) certificate or GST; the company's PAN; the owner's Aadhaar; a letter of authorisation (LOA) on letterhead for the person who will manage DLT; an email and mobile number. A sole proprietor: a Udyam certificate counts as business proof, with PAN, Aadhaar, GST if any, and no LOA. Names and addresses must match exactly across documents; a mismatch is the most common reason for rejection.",
    },
  ],
};

const DLT_PORTALS: PriceTable = {
  id: "providers-dlt",
  title: "DLT registration: only for the client's own sender name or messages",
  compare: false,
  nameColumns: [0],
  columns: [
    { label: "Portal", kind: "text" },
    { label: "Fee", kind: "text" },
    { label: "Valid for", kind: "text" },
    { label: "Approval", kind: "text" },
    { label: "Notes", kind: "long" },
    { label: "Confidence", kind: "confidence" },
    { label: "Source", kind: "link" },
  ],
  rows: [
    {
      id: "smartping",
      cells: [
        "SmartPing",
        "₹5,000 + GST (₹5,900)",
        "2 years",
        "Often same day; templates in 0.5 to 2 hours",
        "Recommended in Nesark's guide for the longer validity and faster approvals.",
        "Reported",
        GUIDE,
      ],
    },
    {
      id: "operators",
      cells: [
        "Jio, Airtel, VILPOWER (Vi), Tata, BSNL, MTNL",
        "₹5,000 + GST (₹5,900)",
        "1 year",
        "24 to 48 hours, sometimes more",
        "Any one portal is enough; registrations are shared across operators.",
        "Reported",
        GUIDE,
      ],
    },
    {
      id: "no-dlt",
      cells: [
        "No DLT (provider's default OTP)",
        "₹0",
        "Not needed",
        "Same day",
        "OTPs only, from the provider's sender and template; no client name, no custom text.",
        "Official",
        "https://www.messagecentral.com/product/verify-now/pricing/india",
      ],
    },
  ],
};
