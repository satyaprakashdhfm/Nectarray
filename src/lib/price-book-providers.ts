import {
  CATEGORIES,
  CONFIDENCE_LABEL,
  INTEGRATIONS,
  type Integration,
} from "@/lib/integrations";
import type { PriceTable, Sheet } from "@/lib/price-book";

export const PROVIDERS = "providers";

type CategoryId = Integration["category"];

/**
 * Kinds of provider left off Third-party providers: payments and delivery
 * are on the Payments & delivery sheet, one table each.
 */
const ELSEWHERE = new Set<CategoryId>(["payments", "delivery"]);

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
    lede: "The outside services we connect to for messages, maps, sign-in and analytics, grouped by what they do, with every price and a link to the provider's own pricing page. Payment gateways and couriers are on Payments & delivery; AI, hosting and storage have their own sheets.",
    tables: providerTables(categories),
    checks: [],
    sources: [],
  };
}

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
