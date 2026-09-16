"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Lock, Phone } from "lucide-react";
import { company } from "@/lib/content";

/**
 * Two sample homepages per build, in a browser frame you can scroll.
 *
 * These are our own designs, not screenshots of anybody's site. A grid of
 * real companies' pages on a services page reads as a portfolio, and a
 * portfolio has to be work you actually did and may show — so the brands
 * here are invented, and the layouts are the shapes these sites really
 * take: a clinic leads with booking, a shop leads with product, a
 * dashboard leads with numbers.
 *
 * The third slide is locked on purpose. The set we can show on a public
 * page is small; the rest happen on a call.
 *
 * Colours are inline hex rather than theme tokens because each sample is
 * its own brand — that is the point of showing two — and they must not
 * shift when the site's own theme does.
 */

type Palette = {
  /** Page ground. */ bg: string;
  /** Headings. */ ink: string;
  /** Body copy. */ muted: string;
  /** The brand itself. */ brand: string;
  /** Tint behind panels. */ soft: string;
};

type Site = {
  url: string;
  brand: string;
  nav: string[];
  hero: { eyebrow: string; title: string; sub: string; cta: string };
  palette: Palette;
  shape: Shape;
  items: { title: string; meta: string }[];
  stats?: { value: string; label: string }[];
  quote?: string;
};

type Shape =
  | "portfolio"
  | "commerce"
  | "dashboard"
  | "platform"
  | "agent"
  | "mobile";

// --------------------------------------------------------------------------
//  The samples
// --------------------------------------------------------------------------

const SITES: Record<string, Site[]> = {
  layout: [
    {
      url: "meridiandental.in",
      brand: "Meridian Dental",
      nav: ["Treatments", "Our team", "Fees", "Contact"],
      hero: {
        eyebrow: "Koramangala, Bengaluru",
        title: "Dentistry that explains itself.",
        sub: "Same-week appointments, transparent pricing, and a plan you understand before anything starts.",
        cta: "Book an appointment",
      },
      palette: {
        bg: "#ffffff",
        ink: "#0f2d2a",
        muted: "#5b736f",
        brand: "#0f8a7e",
        soft: "#e9f6f4",
      },
      shape: "portfolio",
      items: [
        { title: "Implants", meta: "From ₹18,000" },
        { title: "Root canal", meta: "Single sitting" },
        { title: "Braces & aligners", meta: "EMI available" },
      ],
      stats: [
        { value: "4.9★", label: "612 Google reviews" },
        { value: "11 yrs", label: "In practice" },
        { value: "Same week", label: "Appointments" },
      ],
      quote:
        "They showed me the scan and told me what it would cost before touching anything.",
    },
    {
      url: "aperturestudio.co",
      brand: "APERTURE",
      nav: ["Work", "Weddings", "About", "Enquire"],
      hero: {
        eyebrow: "Wedding & editorial",
        title: "Photographs that still matter in ten years.",
        sub: "Documentary-led coverage across India. Limited to eighteen weddings a year.",
        cta: "Check your date",
      },
      palette: {
        bg: "#12100e",
        ink: "#f6f1ea",
        muted: "#a99f93",
        brand: "#d9a441",
        soft: "#1e1a16",
      },
      shape: "portfolio",
      items: [
        { title: "Aditi & Rohan", meta: "Udaipur" },
        { title: "Meera & Sam", meta: "Coorg" },
        { title: "Isha & Dev", meta: "Goa" },
      ],
      stats: [
        { value: "18", label: "Weddings a year" },
        { value: "40+", label: "Cities shot in" },
        { value: "2 wks", label: "Gallery delivery" },
      ],
      quote: "We got the gallery in twelve days and cried through all of it.",
    },
  ],

  cart: [
    {
      url: "verdant.store",
      brand: "Verdant",
      nav: ["Plants", "Pots", "Care", "Cart (2)"],
      hero: {
        eyebrow: "Free delivery over ₹999",
        title: "Plants that survive real flats.",
        sub: "Low-light, low-effort, and honestly labelled. Replaced free if it dies in 30 days.",
        cta: "Shop bestsellers",
      },
      palette: {
        bg: "#ffffff",
        ink: "#14301f",
        muted: "#5d7a68",
        brand: "#2f8f4e",
        soft: "#eaf6ee",
      },
      shape: "commerce",
      items: [
        { title: "Snake Plant", meta: "₹449" },
        { title: "Money Plant", meta: "₹299" },
        { title: "ZZ Plant", meta: "₹649" },
        { title: "Peace Lily", meta: "₹529" },
      ],
      stats: [
        { value: "30-day", label: "Replacement" },
        { value: "Same day", label: "Metro delivery" },
        { value: "12k+", label: "Orders shipped" },
      ],
    },
    {
      url: "kilnandco.in",
      brand: "Kiln & Co.",
      nav: ["Tableware", "Vases", "Studio", "Bag (1)"],
      hero: {
        eyebrow: "Made in Jaipur",
        title: "Stoneware, thrown by hand.",
        sub: "Small batches from a six-person studio. Every piece slightly its own.",
        cta: "Shop the new batch",
      },
      palette: {
        bg: "#fdf8f4",
        ink: "#3a2318",
        muted: "#8a6c5b",
        brand: "#c05f2c",
        soft: "#f6e8dd",
      },
      shape: "commerce",
      items: [
        { title: "Dinner plate", meta: "₹1,250" },
        { title: "Mug, ribbed", meta: "₹850" },
        { title: "Serving bowl", meta: "₹2,100" },
        { title: "Bud vase", meta: "₹980" },
      ],
      stats: [
        { value: "6", label: "Potters" },
        { value: "Small batch", label: "Never restocked twice" },
        { value: "Ships in 3d", label: "Across India" },
      ],
    },
  ],

  gauge: [
    {
      url: "app.northwindops.com",
      brand: "Northwind Ops",
      nav: ["Overview", "Fleet", "Routes", "Billing"],
      hero: {
        eyebrow: "Live",
        title: "Today's movement",
        sub: "412 consignments in transit · 9 flagged for delay",
        cta: "Export report",
      },
      palette: {
        bg: "#0e1424",
        ink: "#eef2fb",
        muted: "#8e9ac0",
        brand: "#4f7cff",
        soft: "#182238",
      },
      shape: "dashboard",
      items: [
        { title: "TRK-4471 · Pune → Nashik", meta: "On time" },
        { title: "TRK-2210 · Surat → Indore", meta: "Delayed 40m" },
        { title: "TRK-8890 · Chennai → Hosur", meta: "On time" },
        { title: "TRK-1043 · Delhi → Jaipur", meta: "Loading" },
      ],
      stats: [
        { value: "412", label: "In transit" },
        { value: "97.2%", label: "On-time" },
        { value: "₹8.4L", label: "Billed today" },
      ],
    },
    {
      url: "pulsedesk.app/inbox",
      brand: "PulseDesk",
      nav: ["Inbox", "Assigned", "SLA", "Reports"],
      hero: {
        eyebrow: "Support queue",
        title: "38 open · 6 breaching",
        sub: "Median first reply 11 minutes, down from 34 last week.",
        cta: "Assign to me",
      },
      palette: {
        bg: "#ffffff",
        ink: "#1c1338",
        muted: "#6b6392",
        brand: "#6d4aff",
        soft: "#f1edff",
      },
      shape: "dashboard",
      items: [
        { title: "#4821 Refund not received", meta: "Breaching · 12m" },
        { title: "#4822 Cannot log in", meta: "High" },
        { title: "#4823 Change GST details", meta: "Normal" },
        { title: "#4824 Bulk upload failing", meta: "High" },
      ],
      stats: [
        { value: "38", label: "Open" },
        { value: "11 min", label: "First reply" },
        { value: "94%", label: "CSAT" },
      ],
    },
  ],

  layers: [
    {
      url: "app.coherebooks.com",
      brand: "Cohere",
      nav: ["Calendar", "Clients", "Staff", "Settings"],
      hero: {
        eyebrow: "Multi-branch",
        title: "Every chair, every branch, one calendar.",
        sub: "Roles, permissions and payouts for salons running more than one address.",
        cta: "Open today",
      },
      palette: {
        bg: "#ffffff",
        ink: "#10233f",
        muted: "#5c7291",
        brand: "#1668d6",
        soft: "#e8f1fd",
      },
      shape: "platform",
      items: [
        { title: "Indiranagar", meta: "8 staff · 92% booked" },
        { title: "Jayanagar", meta: "5 staff · 71% booked" },
        { title: "Whitefield", meta: "6 staff · 84% booked" },
      ],
      stats: [
        { value: "3", label: "Branches" },
        { value: "19", label: "Staff logins" },
        { value: "₹3.1L", label: "This month" },
      ],
    },
    {
      url: "stacklane.io/projects",
      brand: "StackLane",
      nav: ["Projects", "Sprints", "People", "Docs"],
      hero: {
        eyebrow: "Sprint 24",
        title: "Ship what you committed to.",
        sub: "Work, review and release tracked in one place — without four tools disagreeing.",
        cta: "New sprint",
      },
      palette: {
        bg: "#0d1117",
        ink: "#e8eef5",
        muted: "#8fa1b5",
        brand: "#19b8a6",
        soft: "#161d26",
      },
      shape: "platform",
      items: [
        { title: "Checkout rewrite", meta: "In review · 4 left" },
        { title: "Mobile onboarding", meta: "In progress · 9 left" },
        { title: "Billing migration", meta: "Blocked · 2 left" },
      ],
      stats: [
        { value: "31", label: "Done" },
        { value: "15", label: "In flight" },
        { value: "2", label: "Blocked" },
      ],
    },
  ],

  bot: [
    {
      url: "lumenassist.ai",
      brand: "Lumen",
      nav: ["Product", "Docs", "Pricing", "Sign in"],
      hero: {
        eyebrow: "Support copilot",
        title: "It answers from your docs, or it says it doesn't know.",
        sub: "Grounded in your own content, with every answer showing where it came from.",
        cta: "Try the demo",
      },
      palette: {
        bg: "#0b0a14",
        ink: "#f1edff",
        muted: "#9e96c4",
        brand: "#8b5cf6",
        soft: "#171429",
      },
      shape: "agent",
      items: [
        { title: "Where is my refund?", meta: "Answered · policy.pdf" },
        { title: "Do you ship to Nepal?", meta: "Answered · shipping" },
        { title: "Can I change my GST?", meta: "Handed to human" },
      ],
      stats: [
        { value: "71%", label: "Deflected" },
        { value: "1.8s", label: "Median reply" },
        { value: "0", label: "Made-up answers" },
      ],
    },
    {
      url: "clara.health/intake",
      brand: "Clara",
      nav: ["How it works", "For clinics", "Security", "Book demo"],
      hero: {
        eyebrow: "Clinic intake",
        title: "The form filled in by conversation.",
        sub: "Patients answer in their own words; your staff get a structured record.",
        cta: "See a sample intake",
      },
      palette: {
        bg: "#ffffff",
        ink: "#0d2b33",
        muted: "#5a7d85",
        brand: "#0d9aa8",
        soft: "#e6f6f8",
      },
      shape: "agent",
      items: [
        { title: "Symptom summary", meta: "Structured" },
        { title: "Medication history", meta: "Confirmed" },
        { title: "Insurance details", meta: "Verified" },
      ],
      stats: [
        { value: "6 min", label: "Saved per patient" },
        { value: "98%", label: "Completed" },
        { value: "DPDP", label: "Compliant" },
      ],
    },
  ],

  smartphone: [
    {
      url: "trailhead.fit",
      brand: "Trailhead",
      nav: ["Plans", "Coaches", "Stories", "Get app"],
      hero: {
        eyebrow: "iOS & Android",
        title: "Train for the distance you actually signed up for.",
        sub: "A plan that moves when your week does, built around one race date.",
        cta: "Start free week",
      },
      palette: {
        bg: "#101510",
        ink: "#f0f7ec",
        muted: "#9db298",
        brand: "#84cc16",
        soft: "#19211a",
      },
      shape: "mobile",
      items: [
        { title: "Easy 6 km", meta: "Today · Zone 2" },
        { title: "Intervals 8×400", meta: "Thursday" },
        { title: "Long run 18 km", meta: "Sunday" },
      ],
      stats: [
        { value: "42 km", label: "This week" },
        { value: "18 wks", label: "To race day" },
        { value: "4.8★", label: "App Store" },
      ],
    },
    {
      url: "paisa.app",
      brand: "Paisa",
      nav: ["Features", "Security", "Support", "Download"],
      hero: {
        eyebrow: "UPI · Cards · Bills",
        title: "Money that explains where it went.",
        sub: "Automatic categories, shared expenses, and a monthly summary that reads like a sentence.",
        cta: "Download",
      },
      palette: {
        bg: "#ffffff",
        ink: "#0b1f4d",
        muted: "#5b6d95",
        brand: "#2b56f5",
        soft: "#e9eeff",
      },
      shape: "mobile",
      items: [
        { title: "Groceries", meta: "₹6,420 · 18%" },
        { title: "Rent", meta: "₹24,000 · 52%" },
        { title: "Eating out", meta: "₹3,180 · 9%" },
      ],
      stats: [
        { value: "₹46k", label: "Spent" },
        { value: "12", label: "Bills on auto" },
        { value: "2 min", label: "To set up" },
      ],
    },
  ],
};

// --------------------------------------------------------------------------
//  Rendering one sample
// --------------------------------------------------------------------------

function Nav({ site }: { site: Site }) {
  const p = site.palette;
  return (
    <div
      className="flex items-center justify-between px-4 py-3"
      style={{ borderBottom: `1px solid ${p.soft}` }}
    >
      <span
        className="text-[0.6875rem] font-bold tracking-tight"
        style={{ color: p.ink }}
      >
        {site.brand}
      </span>
      <div className="flex items-center gap-2.5">
        {site.nav.map((item) => (
          <span key={item} className="text-[0.5rem]" style={{ color: p.muted }}>
            {item}
          </span>
        ))}
        <span
          className="rounded px-1.5 py-0.5 text-[0.5rem] font-semibold text-white"
          style={{ background: p.brand }}
        >
          {site.shape === "commerce" ? "Bag" : "Get in touch"}
        </span>
      </div>
    </div>
  );
}

function Hero({ site }: { site: Site }) {
  const p = site.palette;
  const dark = site.shape === "dashboard";
  return (
    <div className="px-4 pt-4 pb-3" style={{ background: dark ? p.soft : "" }}>
      <span
        className="inline-block rounded-full px-1.5 py-0.5 text-[0.4375rem] font-semibold tracking-wide uppercase"
        style={{ background: p.soft, color: p.brand }}
      >
        {site.hero.eyebrow}
      </span>
      <p
        className="mt-2 text-[0.9375rem] leading-tight font-bold tracking-tight"
        style={{ color: p.ink }}
      >
        {site.hero.title}
      </p>
      <p
        className="mt-1.5 max-w-[26ch] text-[0.5625rem] leading-relaxed"
        style={{ color: p.muted }}
      >
        {site.hero.sub}
      </p>
      <span
        className="mt-2.5 inline-block rounded px-2.5 py-1 text-[0.5625rem] font-semibold text-white"
        style={{ background: p.brand }}
      >
        {site.hero.cta}
      </span>
    </div>
  );
}

function Stats({ site }: { site: Site }) {
  const p = site.palette;
  if (!site.stats) return null;
  return (
    <div className="grid grid-cols-3 gap-2 px-4 py-3">
      {site.stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-md px-2 py-1.5"
          style={{ background: p.soft }}
        >
          <p className="text-[0.6875rem] font-bold" style={{ color: p.brand }}>
            {stat.value}
          </p>
          <p className="text-[0.4375rem]" style={{ color: p.muted }}>
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/** The middle band, which is where the shapes actually differ. */
function Body({ site }: { site: Site }) {
  const p = site.palette;

  if (site.shape === "commerce") {
    return (
      <div className="grid grid-cols-4 gap-2 px-4 pb-3">
        {site.items.map((item) => (
          <div key={item.title}>
            <div
              className="mb-1 rounded-md"
              style={{ background: p.soft, paddingTop: "78%" }}
            />
            <p
              className="truncate text-[0.5rem] font-semibold"
              style={{ color: p.ink }}
            >
              {item.title}
            </p>
            <p className="text-[0.5rem]" style={{ color: p.brand }}>
              {item.meta}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (site.shape === "dashboard" || site.shape === "platform") {
    return (
      <div className="space-y-1.5 px-4 pb-3">
        {site.items.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between rounded-md px-2.5 py-2"
            style={{ background: p.soft }}
          >
            <span className="text-[0.5rem]" style={{ color: p.ink }}>
              {item.title}
            </span>
            <span
              className="rounded-full px-1.5 py-0.5 text-[0.4375rem] font-semibold"
              style={{ background: p.brand, color: "#fff" }}
            >
              {item.meta}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (site.shape === "agent") {
    return (
      <div className="space-y-1.5 px-4 pb-3">
        {site.items.map((item, i) => (
          <div key={item.title} className="space-y-1">
            <div
              className="ml-auto w-fit rounded-lg px-2 py-1 text-[0.5rem]"
              style={{ background: p.brand, color: "#fff" }}
            >
              {item.title}
            </div>
            {i === 0 && (
              <div
                className="w-4/5 rounded-lg px-2 py-1.5 text-[0.5rem] leading-relaxed"
                style={{ background: p.soft, color: p.muted }}
              >
                Refunds land in 5–7 working days.{" "}
                <span style={{ color: p.brand }}>[policy.pdf, p.3]</span>
              </div>
            )}
            <p className="text-[0.4375rem]" style={{ color: p.muted }}>
              {item.meta}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (site.shape === "mobile") {
    return (
      <div className="flex gap-3 px-4 pb-3">
        <div
          className="w-[34%] shrink-0 space-y-1.5 rounded-xl p-2"
          style={{ background: p.soft, border: `1px solid ${p.brand}22` }}
        >
          <div
            className="mx-auto h-1 w-6 rounded-full"
            style={{ background: p.muted }}
          />
          {site.items.map((item) => (
            <div
              key={item.title}
              className="rounded-md px-1.5 py-1"
              style={{ background: site.palette.bg }}
            >
              <p
                className="truncate text-[0.4375rem] font-semibold"
                style={{ color: p.ink }}
              >
                {item.title}
              </p>
              <p className="text-[0.4375rem]" style={{ color: p.brand }}>
                {item.meta}
              </p>
            </div>
          ))}
        </div>
        <div className="flex-1 space-y-1.5">
          {site.items.map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between rounded-md px-2 py-1.5"
              style={{ background: p.soft }}
            >
              <span className="text-[0.5rem]" style={{ color: p.ink }}>
                {item.title}
              </span>
              <span
                className="text-[0.5rem] font-semibold"
                style={{ color: p.brand }}
              >
                {item.meta}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // portfolio
  return (
    <div className="grid grid-cols-3 gap-2 px-4 pb-3">
      {site.items.map((item) => (
        <div key={item.title}>
          <div
            className="mb-1 rounded-md"
            style={{ background: p.soft, paddingTop: "62%" }}
          />
          <p
            className="truncate text-[0.5rem] font-semibold"
            style={{ color: p.ink }}
          >
            {item.title}
          </p>
          <p className="text-[0.4375rem]" style={{ color: p.muted }}>
            {item.meta}
          </p>
        </div>
      ))}
    </div>
  );
}

function Quote({ site }: { site: Site }) {
  const p = site.palette;
  if (!site.quote) return null;
  return (
    <div className="px-4 pb-3">
      <div
        className="rounded-md px-3 py-2.5 text-[0.5625rem] leading-relaxed italic"
        style={{ background: p.soft, color: p.ink }}
      >
        &ldquo;{site.quote}&rdquo;
      </div>
    </div>
  );
}

function Footer({ site }: { site: Site }) {
  const p = site.palette;
  return (
    <div
      className="flex items-center justify-between px-4 py-3"
      style={{ background: p.soft }}
    >
      <span className="text-[0.5rem] font-bold" style={{ color: p.ink }}>
        {site.brand}
      </span>
      <div className="flex gap-2">
        {["Privacy", "Terms", "Contact"].map((item) => (
          <span key={item} className="text-[0.4375rem]" style={{ color: p.muted }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/** One whole page, tall enough that it actually scrolls in the frame. */
function Page({ site }: { site: Site }) {
  return (
    <div style={{ background: site.palette.bg }}>
      <Nav site={site} />
      <Hero site={site} />
      <Stats site={site} />
      <Body site={site} />
      <Quote site={site} />
      <Footer site={site} />
    </div>
  );
}

/**
 * The third slide: the rest of the work, behind a call.
 *
 * No count. Any number here would be a claim on a commercial page that
 * somebody has to be able to stand behind, and "more" is the honest
 * version of one nobody is counting.
 */
function Locked() {
  return (
    <div className="bg-night relative flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="grid size-10 place-items-center rounded-full bg-white/10">
        <Lock className="size-4 text-white/80" strokeWidth={2} aria-hidden />
      </span>
      <div>
        <p className="text-[0.8125rem] font-semibold text-white">
          More builds in this category
        </p>
        <p className="mx-auto mt-1.5 max-w-[30ch] text-[0.6875rem] leading-relaxed text-white/55">
          The rest are client work, so they are shown on a call rather than
          posted publicly — along with what each one cost and how long it took.
        </p>
      </div>
      <a
        href={`tel:${company.phone.replace(/\s/g, "")}`}
        className="bg-brand-solid text-cta-fg hover:bg-brand inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.6875rem] font-semibold transition-colors"
      >
        <Phone className="size-3" strokeWidth={2.5} aria-hidden />
        Call to see them
      </a>
    </div>
  );
}

// --------------------------------------------------------------------------

export function SiteMock({ kind }: { kind: string }) {
  const sites = SITES[kind] ?? SITES.layout;
  const slides = sites.length + 1; // the samples, then the locked one
  const [i, setI] = useState(0);

  const site = i < sites.length ? sites[i] : null;
  const go = (step: number) => setI((n) => (n + step + slides) % slides);

  return (
    <div className="border-line bg-mist overflow-hidden rounded-xl border shadow-[0_18px_40px_-24px_rgba(14,27,38,0.35)]">
      {/* Browser chrome */}
      <div className="border-line bg-surface flex items-center gap-2 border-b px-3 py-2">
        <span className="flex gap-1.5">
          <span className="bg-ink/15 size-2 rounded-full" />
          <span className="bg-ink/15 size-2 rounded-full" />
          <span className="bg-ink/15 size-2 rounded-full" />
        </span>
        <span className="border-line bg-mist text-ink-faint ml-1 flex-1 truncate rounded-md border px-2.5 py-1 font-mono text-[0.625rem]">
          {site ? site.url : "nectarray.com/work"}
        </span>
      </div>

      {/* The page itself, scrollable inside the frame */}
      <div className="relative">
        <div className="h-[17rem] overflow-y-auto overscroll-contain">
          {site ? <Page site={site} /> : <Locked />}
        </div>

        {/* Arrows */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous sample"
          className="text-ink hover:bg-surface absolute top-1/2 left-2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-white/85 shadow-md backdrop-blur transition-colors"
        >
          <ChevronLeft className="size-4" strokeWidth={2.5} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next sample"
          className="text-ink hover:bg-surface absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-white/85 shadow-md backdrop-blur transition-colors"
        >
          <ChevronRight className="size-4" strokeWidth={2.5} aria-hidden />
        </button>
      </div>

      {/* Which sample, and what it is */}
      <div className="border-line bg-surface flex items-center justify-between gap-3 border-t px-3 py-2">
        <span className="text-ink-faint truncate text-[0.6875rem]">
          {site ? `Sample ${i + 1} · ${site.brand}` : "The rest, on a call"}
        </span>
        <span className="flex shrink-0 gap-1.5">
          {Array.from({ length: slides }).map((_, n) => (
            <button
              key={n}
              type="button"
              onClick={() => setI(n)}
              aria-label={
                n < sites.length ? `Sample ${n + 1}` : "More, on a call"
              }
              aria-current={n === i ? "true" : undefined}
              className={`size-1.5 rounded-full transition-colors ${
                n === i ? "bg-brand-deep" : "bg-ink/20 hover:bg-ink/40"
              }`}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
