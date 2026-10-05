/**
 * What outside services cost: email, domains, servers, storage, AI,
 * messages, delivery and payments. For reference when quoting, edited on the
 * Third-party costs tab. Prices change, so each item says when it was
 * checked and where.
 */

export type CostItem = {
  id: string;
  name: string;
  /** What comes free, if anything. */
  free: string;
  price: string;
  /** Renewal, extra usage or the next tier. */
  extra: string;
  notes: string;
  url: string;
  checked: string;
};

export type CostGroup = { id: string; label: string; items: CostItem[] };

const CHECKED = "Oct 2026";

let n = 0;
const item = (i: Omit<CostItem, "id" | "checked">): CostItem => ({
  id: `c${++n}`,
  checked: CHECKED,
  ...i,
});

export const DEFAULT_COSTS: CostGroup[] = [
  {
    id: "email",
    label: "Business email",
    items: [
      item({
        name: "Zoho Mail Forever Free",
        free: "Up to 5 users, 5 GB each, on your own domain",
        price: "₹0",
        extra: "More than 5 users needs a paid plan",
        notes:
          "Web and Zoho Mail app only. No IMAP or POP, so no Outlook or Apple Mail.",
        url: "https://www.cloudfysystems.com/blog/zoho-mail-free-forever-plan-india",
      }),
      item({
        name: "Zoho Mail Lite",
        free: "",
        price: "₹59 per user a month, billed yearly (5 GB)",
        extra: "₹75 per user a month for 10 GB",
        notes:
          "Adds IMAP, POP and ActiveSync, so Outlook and phone mail apps work.",
        url: "https://www.cloudfysystems.com/blog/zoho-mail-lite-india",
      }),
      item({
        name: "Google Workspace Business Standard",
        free: "",
        price: "₹1,080 per user a month, billed yearly, plus 18% GST",
        extra: "Offers of about ₹864 for the first users are common",
        notes:
          "Gmail on your domain, 2 TB Drive per user, Meet, and Gemini AI included.",
        url: "https://www.cloudfysystems.com/blog/google-workspace-pricing-plans-india",
      }),
    ],
  },
  {
    id: "domains",
    label: "Domains",
    items: [
      item({
        name: ".com domain (GoDaddy)",
        free: "",
        price: "About ₹199 for the first year on offer",
        extra: "Renews at ₹1,099 to ₹1,299 a year",
        notes: "Quote the renewal price, not the offer price.",
        url: "https://www.godaddy.com/en-in/pricing",
      }),
      item({
        name: ".in domain (GoDaddy)",
        free: "",
        price: "About ₹149 for the first year on offer",
        extra: "Renews at ₹699 to ₹999 a year",
        notes: "",
        url: "https://www.godaddy.com/en-in/pricing",
      }),
      item({
        name: ".com or .in domain (Hostinger)",
        free: "",
        price: "From ₹1 for the first year on a 3-year term",
        extra: "Renews at about ₹1,000 (.com) or ₹700 (.in) a year",
        notes: "Renewal prices are shown before buying.",
        url: "https://www.hostinger.com/in/domains",
      }),
    ],
  },
  {
    id: "hosting",
    label: "Servers and hosting",
    items: [
      item({
        name: "Railway Hobby",
        free: "$5 of usage included each month",
        price: "$5 a month",
        extra:
          "Usage over the credit: $10 per GB of RAM, $20 per vCPU a month, $0.05 per GB sent out",
        notes: "Good for a small site with a database. What this site runs on.",
        url: "https://railway.com/pricing",
      }),
      item({
        name: "Railway Pro",
        free: "$20 of usage included each month",
        price: "$20 a month",
        extra: "Same usage rates as Hobby, higher limits",
        notes: "For production apps with more traffic.",
        url: "https://railway.com/pricing",
      }),
      item({
        name: "Vercel Pro",
        free: "$20 of usage and 1 TB of transfer included per seat",
        price: "$20 per developer seat a month",
        extra: "Usage over the credit is billed on top",
        notes: "The free Hobby plan is for non-commercial use only.",
        url: "https://vercel.com/pricing",
      }),
      item({
        name: "Hostinger shared hosting",
        free: "",
        price: "Premium from ₹149 a month on a 48-month term",
        extra: "Renews at about ₹449 a month (Single ₹69, renews ₹289)",
        notes: "For simple static or WordPress sites, not apps.",
        url: "https://www.hostinger.com/in/pricing",
      }),
    ],
  },
  {
    id: "storage",
    label: "Cloud storage",
    items: [
      item({
        name: "Cloudflare R2",
        free: "10 GB a month",
        price: "$0.015 per GB a month after that",
        extra: "No charge for downloads (egress)",
        notes: "Cheapest for images, videos and files people download.",
        url: "https://www.cloudflare.com/products/r2/",
      }),
      item({
        name: "AWS S3 (Mumbai)",
        free: "",
        price: "$0.025 per GB a month for the first 50 TB",
        extra: "Downloads about $0.11 per GB",
        notes: "Download charges can be more than the storage itself.",
        url: "https://aws.amazon.com/s3/pricing/",
      }),
      item({
        name: "Railway volume",
        free: "",
        price: "$0.15 per GB a month",
        extra: "",
        notes:
          "Disk attached to a server. Fine for a database, dear for files.",
        url: "https://railway.com/pricing",
      }),
    ],
  },
  {
    id: "ai",
    label: "AI for the team",
    items: [
      item({
        name: "ChatGPT Business",
        free: "",
        price: "$20 per user a month billed yearly, $25 monthly",
        extra: "Premium seats $100 yearly, $125 monthly",
        notes: "Company workspace; chats are not used to train models.",
        url: "https://openai.com/chatgpt/pricing/",
      }),
      item({
        name: "Claude Team",
        free: "",
        price: "$20 per seat a month billed yearly, $25 monthly",
        extra: "Premium seats $100 yearly, $125 monthly; minimum seats apply",
        notes: "Shared projects and admin controls.",
        url: "https://claude.com/pricing",
      }),
      item({
        name: "Gemini in Google Workspace",
        free: "Included in Business Standard",
        price: "₹1,080 per user a month with Workspace",
        extra: "",
        notes: "Comes with the email plan above, nothing extra to buy.",
        url: "https://workspace.google.com/pricing",
      }),
      item({
        name: "AI API, pay as you go (OpenAI, Anthropic, Google)",
        free: "",
        price: "Prepaid credits, from about $5",
        extra: "Set a monthly cap, for example $10, so a bill never surprises",
        notes:
          "For AI features inside the website or app. What $10 buys depends on the model and how much text goes through it.",
        url: "https://platform.openai.com/docs/pricing",
      }),
    ],
  },
  {
    id: "messages",
    label: "Notifications and OTP",
    items: [
      item({
        name: "WhatsApp Business API (Meta, India)",
        free: "First 1,000 service replies a month per number",
        price:
          "Utility and OTP ₹0.115 a message; marketing ₹0.863 a message (from 1 Oct 2026)",
        extra: "Plus 18% GST and the provider's own fee",
        notes: "Order updates are utility messages; OTPs are authentication.",
        url: "https://developers.facebook.com/docs/whatsapp/pricing",
      }),
      item({
        name: "SMS OTP (MSG91)",
        free: "",
        price: "₹0.25 an SMS for 5,000; ₹0.20 for 16,500",
        extra: "₹0.17 from 60,000 up; lower on request",
        notes: "Needs DLT registration of the sender and templates.",
        url: "https://msg91.com/in/pricing",
      }),
      item({
        name: "Website emails (Resend)",
        free: "3,000 emails a month, 100 a day",
        price: "$20 a month for 50,000 emails",
        extra: "$35 a month for 100,000",
        notes: "For enquiry, order and password emails sent by the site.",
        url: "https://resend.com/pricing",
      }),
    ],
  },
  {
    id: "delivery",
    label: "Delivery",
    items: [
      item({
        name: "Porter two-wheeler (Bengaluru)",
        free: "",
        price: "From ₹48 a trip",
        extra: "Includes the first 1 km and 25 minutes of waiting",
        notes: "Same-city deliveries; varies by area and time.",
        url: "https://porter.in/two-wheelers/bangalore",
      }),
      item({
        name: "Rapido parcel",
        free: "",
        price: "About ₹35 for the first 2 km",
        extra: "About ₹15 a km after that",
        notes:
          "Same-city deliveries. Rates from public reports; confirm in the app.",
        url: "https://www.rapido.bike/",
      }),
      item({
        name: "Shiprocket courier",
        free: "",
        price: "From ₹20 to ₹26 per 500 g, by plan",
        extra: "Plus cash-on-delivery charges, GST and zone charges",
        notes: "For shipping across India.",
        url: "https://www.shiprocket.in/pricing-plan-professionals/",
      }),
    ],
  },
  {
    id: "payments",
    label: "Payments",
    items: [
      item({
        name: "Razorpay standard",
        free: "No set-up or yearly fee",
        price: "2% of each payment (cards, UPI, netbanking, wallets)",
        extra: "International cards up to 3%; 18% GST on the fee",
        notes: "₹1,000 paid costs about ₹23.60 in fees with GST.",
        url: "https://razorpay.com/pricing/",
      }),
    ],
  },
];

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.slice(0, max) : "";

/** Anything the tab sends, made safe to store. */
export function cleanCosts(input: unknown): CostGroup[] {
  const groups = Array.isArray(input) ? input : [];
  return groups.slice(0, 30).map((raw, gi) => {
    const g = (raw ?? {}) as Partial<CostGroup>;
    return {
      id: str(g.id, 40) || `g${gi}`,
      label: str(g.label, 80).trim() || "Untitled",
      items: (Array.isArray(g.items) ? g.items : [])
        .slice(0, 60)
        .map((r, ii) => {
          const i = (r ?? {}) as Partial<CostItem>;
          const url = str(i.url, 500).trim();
          return {
            id: str(i.id, 40) || `i${gi}-${ii}`,
            name: str(i.name, 120),
            free: str(i.free, 300),
            price: str(i.price, 300),
            extra: str(i.extra, 300),
            notes: str(i.notes, 1000),
            url: /^https:\/\//.test(url) ? url : "",
            checked: str(i.checked, 40),
          };
        }),
    };
  });
}
