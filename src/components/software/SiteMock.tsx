"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Lock, Phone, Star } from "lucide-react";
import { company } from "@/lib/content";

/**
 * Two sample homepages per build, in a browser frame you can scroll.
 *
 * These are our own designs with invented brands, not screenshots of real
 * companies — a grid of other people's pages on a services page reads as a
 * portfolio, and a portfolio has to be work we actually did and may show.
 *
 * What they are modelled on is the Indian web as it actually is, because
 * that is who buys: an offer strip above the fold, a rating with a real
 * number of reviews beside it, prices in rupees with EMI and COD spelled
 * out, a WhatsApp button that outranks the contact form, an address and
 * opening hours in the footer. A site without those reads foreign here, and
 * a mock-up without them reads like a template.
 *
 * Colours are inline hex rather than theme tokens because each sample is a
 * brand of its own — that is the point of showing two — and they must not
 * shift when the site's own theme does.
 */

type Palette = {
  /** Page ground. */ bg: string;
  /** Headings. */ ink: string;
  /** Body copy. */ muted: string;
  /** The brand itself. */ brand: string;
  /** Second brand colour, for gradients and photo blocks. */ accent: string;
  /** Tint behind panels. */ soft: string;
  /** Hairlines. */ line: string;
};

type Site = {
  url: string;
  brand: string;
  /** The thin strip above the nav — an offer, or where they are. */
  topbar: string;
  nav: string[];
  navCta: string;
  hero: {
    eyebrow: string;
    title: string;
    sub: string;
    cta: string;
    /** Green button. On an Indian site this is usually the one that gets used. */
    whatsapp: string;
    badges: string[];
  };
  palette: Palette;
  shape: Shape;
  /** Section heading above the main band. */
  bandTitle: string;
  items: { title: string; meta: string; sub?: string; tag?: string }[];
  stats: { value: string; label: string }[];
  quote: { text: string; who: string; place: string };
  footer: string;
};

type Shape =
  | "clinic"
  | "studio"
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
      url: "thirtytwodental.in",
      brand: "Thirtytwo Dental",
      topbar: "Indiranagar, Bengaluru · Open today till 8pm",
      nav: ["Treatments", "Our dentists", "Fees", "Reviews"],
      navCta: "Book now",
      hero: {
        eyebrow: "Since 2014",
        title: "Dentistry you are allowed to ask questions in.",
        sub: "You see the scan, you get the price on WhatsApp, and nothing starts until you say so.",
        cta: "Book an appointment",
        whatsapp: "WhatsApp us",
        badges: ["4.9★ · 840 Google reviews", "EMI from ₹1,999/mo", "GST invoice"],
      },
      palette: {
        bg: "#ffffff",
        ink: "#0d2b28",
        muted: "#5d7c77",
        brand: "#0f8a7e",
        accent: "#5ac8b4",
        soft: "#eaf7f5",
        line: "#d4ece8",
      },
      shape: "clinic",
      bandTitle: "What people come in for",
      items: [
        { title: "Dental implant", meta: "₹18,000", sub: "Single tooth, 2 visits", tag: "Most booked" },
        { title: "Root canal", meta: "₹6,500", sub: "Single sitting, painless" },
        { title: "Braces & aligners", meta: "₹45,000", sub: "EMI available" },
        { title: "Cleaning & polish", meta: "₹1,200", sub: "30 minutes" },
      ],
      stats: [
        { value: "11 yrs", label: "In Indiranagar" },
        { value: "16,000+", label: "Patients treated" },
        { value: "Same week", label: "Appointments" },
      ],
      quote: {
        text: "They showed me the X-ray, told me what it would cost, and then told me one of the three fillings could wait a year. Nobody does that.",
        who: "Ananya R.",
        place: "Indiranagar",
      },
      footer: "100 Ft Road, Indiranagar · Mon–Sat 9am–8pm",
    },
    {
      url: "saanjhstudio.com",
      brand: "SAANJH",
      topbar: "Now booking 2027 wedding dates",
      nav: ["Films", "Photographs", "About", "Pricing"],
      navCta: "Check your date",
      hero: {
        eyebrow: "Wedding films & photography",
        title: "The day, told the way it actually happened.",
        sub: "No posing lists, no shot-by-shot sameness. Eighteen weddings a year so each one gets the whole team.",
        cta: "See full films",
        whatsapp: "WhatsApp for dates",
        badges: ["18 weddings a year", "Delivered in 14 days", "Travels PAN-India"],
      },
      palette: {
        bg: "#100e0c",
        ink: "#f7f2ea",
        muted: "#a99e90",
        brand: "#d9a441",
        accent: "#8c5e2a",
        soft: "#1c1814",
        line: "#2a241d",
      },
      shape: "studio",
      bandTitle: "Recent weddings",
      items: [
        { title: "Aditi & Rohan", meta: "Udaipur", sub: "3 days · 4 shooters" },
        { title: "Meera & Sameer", meta: "Coorg", sub: "Intimate · 40 guests" },
        { title: "Isha & Dev", meta: "Goa", sub: "Beach · 2 days" },
        { title: "Tara & Karan", meta: "Jaipur", sub: "Palace · 5 days" },
      ],
      stats: [
        { value: "240+", label: "Weddings shot" },
        { value: "14 days", label: "To your gallery" },
        { value: "40+", label: "Cities" },
      ],
      quote: {
        text: "We watched the film with my grandmother, who is 89 and does not cry. She cried.",
        who: "Meera & Sameer",
        place: "Coorg, 2026",
      },
      footer: "Studio in Jaipur · Shooting across India",
    },
  ],

  cart: [
    {
      url: "mittiliving.in",
      brand: "Mitti Living",
      topbar: "Free shipping over ₹999 · COD available · 7-day returns",
      nav: ["Cookware", "Tableware", "Storage", "Gifting"],
      navCta: "Bag · 2",
      hero: {
        eyebrow: "Made in Jaipur & Khurja",
        title: "Clay that goes from the stove to the table.",
        sub: "Unglazed terracotta and stoneware from potter families we buy from directly. Seasoned, tested, and safe on gas.",
        cta: "Shop bestsellers",
        whatsapp: "Order on WhatsApp",
        badges: ["4.8★ · 2,100 reviews", "COD across India", "Ships in 48 hrs"],
      },
      palette: {
        bg: "#fdf9f5",
        ink: "#3a2318",
        muted: "#8a6c5b",
        brand: "#c05f2c",
        accent: "#e0a06a",
        soft: "#f7eade",
        line: "#ecdcce",
      },
      shape: "commerce",
      bandTitle: "This week's bestsellers",
      items: [
        { title: "Terracotta handi", meta: "₹1,299", sub: "₹1,799", tag: "28% off" },
        { title: "Stoneware dinner set", meta: "₹3,450", sub: "₹4,200", tag: "Bestseller" },
        { title: "Clay water bottle", meta: "₹649", sub: "₹899" },
        { title: "Serving bowl, ribbed", meta: "₹880", sub: "₹1,100" },
      ],
      stats: [
        { value: "60+", label: "Potter families" },
        { value: "48 hrs", label: "Dispatch" },
        { value: "32,000+", label: "Orders delivered" },
      ],
      quote: {
        text: "The handi actually survived daily dal for a year. I ordered three more for my sisters.",
        who: "Lakshmi V.",
        place: "Hyderabad",
      },
      footer: "Jaipur, Rajasthan · GSTIN 08AACCM••••1Z5",
    },
    {
      url: "koralabel.com",
      brand: "KORA",
      topbar: "New: Chanderi edit · Extra 10% on prepaid",
      nav: ["Women", "Men", "Handloom", "Sale"],
      navCta: "Bag · 1",
      hero: {
        eyebrow: "Handloom, not handloom-look",
        title: "Cotton you can actually wear in May.",
        sub: "Woven in Chanderi and Bhagalpur, cut for Indian summers, and sized on real bodies rather than a chart we copied.",
        cta: "Shop the new edit",
        whatsapp: "Size help on WhatsApp",
        badges: ["Free size exchange", "COD available", "4.7★ · 5,400 reviews"],
      },
      palette: {
        bg: "#ffffff",
        ink: "#241f2c",
        muted: "#6f6878",
        brand: "#7c4dff",
        accent: "#c8a2ff",
        soft: "#f2edff",
        line: "#e6ddf7",
      },
      shape: "commerce",
      bandTitle: "The Chanderi edit",
      items: [
        { title: "Chanderi kurta", meta: "₹2,190", sub: "₹2,890", tag: "New" },
        { title: "Bhagalpur silk shirt", meta: "₹2,650", sub: "₹3,200" },
        { title: "Cotton co-ord set", meta: "₹3,400", sub: "₹4,100", tag: "Trending" },
        { title: "Handwoven dupatta", meta: "₹1,150", sub: "₹1,450" },
      ],
      stats: [
        { value: "400+", label: "Weavers paid direct" },
        { value: "XS–5XL", label: "Every style" },
        { value: "Free", label: "First exchange" },
      ],
      quote: {
        text: "First brand where the 3XL actually fit like the photo. The exchange took one WhatsApp message.",
        who: "Rhea D.",
        place: "Pune",
      },
      footer: "Bengaluru · Woven in Chanderi, MP",
    },
  ],

  gauge: [
    {
      url: "app.vahanops.in",
      brand: "Vahan Ops",
      topbar: "Live · 412 trips moving · last sync 14s ago",
      nav: ["Overview", "Fleet", "Trips", "Billing"],
      navCta: "Export",
      hero: {
        eyebrow: "Today, across 6 depots",
        title: "412 trips moving. 9 will be late.",
        sub: "Flagged the moment a truck stops longer than its route allows — not when the customer calls to ask.",
        cta: "Open delay queue",
        whatsapp: "Alert the drivers",
        badges: ["97.2% on-time", "6 depots", "₹8.4L billed today"],
      },
      palette: {
        bg: "#0d1322",
        ink: "#eef2fb",
        muted: "#8d9ac2",
        brand: "#5680ff",
        accent: "#22d3ee",
        soft: "#161f33",
        line: "#243149",
      },
      shape: "dashboard",
      bandTitle: "Needs someone to look",
      items: [
        { title: "TRK-2210 · Surat → Indore", meta: "Late 40m", sub: "Halted at Dahod", tag: "urgent" },
        { title: "TRK-4471 · Pune → Nashik", meta: "On time", sub: "ETA 4:20pm" },
        { title: "TRK-8890 · Chennai → Hosur", meta: "On time", sub: "ETA 6:05pm" },
        { title: "TRK-1043 · Delhi → Jaipur", meta: "Loading", sub: "Docked 22m" },
      ],
      stats: [
        { value: "412", label: "In transit" },
        { value: "97.2%", label: "On-time" },
        { value: "₹8.4L", label: "Billed today" },
      ],
      quote: {
        text: "We stopped finding out about delays from angry customers. That is the whole product.",
        who: "Vikram S.",
        place: "Ops head, Surat",
      },
      footer: "Vahan Ops · SOC 2 · Data in Mumbai",
    },
    {
      url: "khatapro.in/receivables",
      brand: "Khata Pro",
      topbar: "GST filing due in 6 days · 12 invoices unreconciled",
      nav: ["Invoices", "Receivables", "GST", "Reports"],
      navCta: "New invoice",
      hero: {
        eyebrow: "Receivables",
        title: "₹14.2 lakh is owed to you. ₹3.1 lakh is overdue.",
        sub: "Reminders go out on WhatsApp on the day a bill ages past its terms, in the buyer's own language.",
        cta: "Send reminders",
        whatsapp: "Chase on WhatsApp",
        badges: ["GSTR-1 ready", "Tally export", "e-Invoice enabled"],
      },
      palette: {
        bg: "#ffffff",
        ink: "#152038",
        muted: "#64748b",
        brand: "#1f6feb",
        accent: "#38bdf8",
        soft: "#eef4ff",
        line: "#dde7f7",
      },
      shape: "dashboard",
      bandTitle: "Overdue, oldest first",
      items: [
        { title: "Sri Balaji Traders", meta: "₹1,24,500", sub: "62 days overdue", tag: "urgent" },
        { title: "Ganesh Distributors", meta: "₹86,200", sub: "41 days overdue" },
        { title: "New Anand Agencies", meta: "₹58,900", sub: "22 days overdue" },
        { title: "Kumar & Sons", meta: "₹41,300", sub: "9 days overdue" },
      ],
      stats: [
        { value: "₹14.2L", label: "Outstanding" },
        { value: "38 days", label: "Average collection" },
        { value: "212", label: "Active buyers" },
      ],
      quote: {
        text: "Collection time went from 58 days to 38. I did not hire anyone to do it.",
        who: "Mahesh P.",
        place: "Distributor, Coimbatore",
      },
      footer: "Khata Pro · Built for Indian distributors",
    },
  ],

  layers: [
    {
      url: "app.slotwise.in",
      brand: "Slotwise",
      topbar: "3 branches · 19 staff logins · today 84% booked",
      nav: ["Calendar", "Clients", "Staff", "Payouts"],
      navCta: "Add booking",
      hero: {
        eyebrow: "Multi-branch salons & clinics",
        title: "Every chair, every branch, one calendar.",
        sub: "A manager sees her branch. The owner sees all three, plus who is actually earning their chair.",
        cta: "Open today's diary",
        whatsapp: "Remind no-shows",
        badges: ["Role-based logins", "Auto WhatsApp reminders", "Staff payouts"],
      },
      palette: {
        bg: "#ffffff",
        ink: "#10233f",
        muted: "#5d7391",
        brand: "#1668d6",
        accent: "#5ea8ff",
        soft: "#e9f1fd",
        line: "#d8e6f8",
      },
      shape: "platform",
      bandTitle: "Branches today",
      items: [
        { title: "Indiranagar", meta: "92% booked", sub: "8 staff · ₹64,200 today", tag: "Full" },
        { title: "Jayanagar", meta: "71% booked", sub: "5 staff · ₹31,800 today" },
        { title: "Whitefield", meta: "84% booked", sub: "6 staff · ₹47,500 today" },
      ],
      stats: [
        { value: "3", label: "Branches" },
        { value: "19", label: "Staff logins" },
        { value: "₹3.1L", label: "This month" },
      ],
      quote: {
        text: "I used to call three managers every evening to ask the same question. Now I open one screen.",
        who: "Farah K.",
        place: "Owner, 3 branches",
      },
      footer: "Slotwise · Bengaluru",
    },
    {
      url: "vidyalayos.com",
      brand: "Vidyalay OS",
      topbar: "Term 2 · Fee collection 78% · 4 reports pending",
      nav: ["Students", "Attendance", "Fees", "Exams"],
      navCta: "Add student",
      hero: {
        eyebrow: "School ERP",
        title: "Fees, attendance and report cards without four registers.",
        sub: "Parents get the fee receipt on WhatsApp the second it is paid. Teachers mark attendance in one tap.",
        cta: "See a live term",
        whatsapp: "Message parents",
        badges: ["CBSE & State boards", "Parent app included", "Works offline"],
      },
      palette: {
        bg: "#fbfcff",
        ink: "#1a1f3c",
        muted: "#646b92",
        brand: "#4338ca",
        accent: "#f59e0b",
        soft: "#eeedfd",
        line: "#e0dff7",
      },
      shape: "platform",
      bandTitle: "This term, by class",
      items: [
        { title: "Class 10-A", meta: "94% present", sub: "42 students · fees 88%" },
        { title: "Class 9-B", meta: "91% present", sub: "38 students · fees 72%", tag: "Follow up" },
        { title: "Class 8-A", meta: "96% present", sub: "40 students · fees 81%" },
      ],
      stats: [
        { value: "1,240", label: "Students" },
        { value: "78%", label: "Fees collected" },
        { value: "62", label: "Teachers" },
      ],
      quote: {
        text: "Fee follow-up used to be two clerks and a phone. It is now a scheduled WhatsApp.",
        who: "Principal, DAV",
        place: "Nagpur",
      },
      footer: "Vidyalay OS · Used by 40+ schools",
    },
  ],

  bot: [
    {
      url: "sahayak.ai",
      brand: "Sahayak",
      topbar: "Answers from your own documents · nothing invented",
      nav: ["Product", "Grounding", "Pricing", "Docs"],
      navCta: "Book a demo",
      hero: {
        eyebrow: "Support copilot",
        title: "It answers from your policy file, or it says it does not know.",
        sub: "Every reply cites the page it came from. When it has nothing, it hands the chat to a human instead of guessing.",
        cta: "Try the live demo",
        whatsapp: "Deploy on WhatsApp",
        badges: ["Cited answers", "Hindi & English", "Handover to human"],
      },
      palette: {
        bg: "#0b0a14",
        ink: "#f2eeff",
        muted: "#9c93c6",
        brand: "#8b5cf6",
        accent: "#22d3ee",
        soft: "#171429",
        line: "#272041",
      },
      shape: "agent",
      bandTitle: "A real conversation from last week",
      items: [
        { title: "Mera refund kab aayega?", meta: "Answered", sub: "refund-policy.pdf · p.3" },
        { title: "Do you ship to Nepal?", meta: "Answered", sub: "shipping.md · Intl" },
        { title: "Change GST on invoice #4471", meta: "Handed over", sub: "No document covers this" },
      ],
      stats: [
        { value: "71%", label: "Resolved without a human" },
        { value: "1.8s", label: "Median reply" },
        { value: "0", label: "Invented answers" },
      ],
      quote: {
        text: "The part that sold us was watching it refuse to answer something and pass it to an agent.",
        who: "Head of CX",
        place: "D2C brand, Mumbai",
      },
      footer: "Sahayak · Data stays in your account",
    },
    {
      url: "aarogyaassist.in",
      brand: "Aarogya Assist",
      topbar: "Patient intake in Hindi, Tamil, Telugu & English",
      nav: ["How it works", "For clinics", "Security", "Demo"],
      navCta: "Book a demo",
      hero: {
        eyebrow: "Clinic intake agent",
        title: "The form, filled in by conversation.",
        sub: "The patient talks in their own language on WhatsApp. Your front desk receives a structured case sheet.",
        cta: "See a sample intake",
        whatsapp: "Start on WhatsApp",
        badges: ["DPDP compliant", "4 languages", "ABDM-ready"],
      },
      palette: {
        bg: "#ffffff",
        ink: "#0d2b33",
        muted: "#5a7d85",
        brand: "#0d9aa8",
        accent: "#7dd3c0",
        soft: "#e6f6f8",
        line: "#cfeaee",
      },
      shape: "agent",
      bandTitle: "What the doctor gets before the patient sits down",
      items: [
        { title: "Chief complaint", meta: "Structured", sub: "Fever 3 days, dry cough" },
        { title: "Medication history", meta: "Confirmed", sub: "2 ongoing, 1 allergy flagged" },
        { title: "Insurance & ID", meta: "Verified", sub: "Star Health · policy active" },
      ],
      stats: [
        { value: "6 min", label: "Saved per patient" },
        { value: "98%", label: "Forms completed" },
        { value: "4", label: "Languages" },
      ],
      quote: {
        text: "Patients who would never fill a form will happily answer a WhatsApp message. That was the unlock.",
        who: "Dr. Suresh M.",
        place: "Polyclinic, Chennai",
      },
      footer: "Aarogya Assist · DPDP compliant",
    },
  ],

  smartphone: [
    {
      url: "daud.fit",
      brand: "Daud",
      topbar: "iOS & Android · free for 7 days · no card",
      nav: ["Plans", "Coaches", "Stories", "Get app"],
      navCta: "Download",
      hero: {
        eyebrow: "Built for Indian roads & weather",
        title: "Train for the race you actually signed up for.",
        sub: "A plan that shifts when your week does — and knows that a 6am run in Chennai is not a 6am run in Shimla.",
        cta: "Get the app",
        whatsapp: "Ask a coach",
        badges: ["4.8★ · 22k ratings", "₹299/month", "Works offline"],
      },
      palette: {
        bg: "#0f1410",
        ink: "#f0f7ec",
        muted: "#9db298",
        brand: "#84cc16",
        accent: "#22d3ee",
        soft: "#182118",
        line: "#25302410",
      },
      shape: "mobile",
      bandTitle: "Your week",
      items: [
        { title: "Easy 6 km", meta: "Today", sub: "Zone 2 · 38 min", tag: "Now" },
        { title: "Intervals 8×400m", meta: "Thursday", sub: "With 90s jog" },
        { title: "Long run 18 km", meta: "Sunday", sub: "Before 7am · humid" },
      ],
      stats: [
        { value: "42 km", label: "This week" },
        { value: "18 wks", label: "To race day" },
        { value: "4.8★", label: "22k ratings" },
      ],
      quote: {
        text: "It moved my long run to Saturday because I told it I had a wedding. No other app does that.",
        who: "Arjun N.",
        place: "TCS World 10K",
      },
      footer: "Daud · Made in Bengaluru",
    },
    {
      url: "kharcha.app",
      brand: "Kharcha",
      topbar: "UPI · Cards · Bills · ₹0 forever plan",
      nav: ["Features", "Security", "Pricing", "Download"],
      navCta: "Download",
      hero: {
        eyebrow: "Reads your SMS, not your bank login",
        title: "Where did ₹46,000 go last month?",
        sub: "Categories that name the actual shop, splits that settle over UPI, and a monthly summary that reads like a sentence.",
        cta: "Get the app",
        whatsapp: "Get the link",
        badges: ["No bank login needed", "4.6★ · 68k ratings", "Free forever"],
      },
      palette: {
        bg: "#ffffff",
        ink: "#0b1f4d",
        muted: "#5b6d95",
        brand: "#2b56f5",
        accent: "#f59e0b",
        soft: "#eaefff",
        line: "#dbe3fb",
      },
      shape: "mobile",
      bandTitle: "September so far",
      items: [
        { title: "Rent", meta: "₹24,000", sub: "52% · paid 3 Sep", tag: "Auto" },
        { title: "Groceries", meta: "₹6,420", sub: "18% · BigBasket, Zepto" },
        { title: "Eating out", meta: "₹3,180", sub: "9% · up ₹800" },
      ],
      stats: [
        { value: "₹46k", label: "Spent" },
        { value: "12", label: "Bills on auto" },
        { value: "2 min", label: "To set up" },
      ],
      quote: {
        text: "It told me my Swiggy spend was up 40% before I noticed. Slightly rude. Very useful.",
        who: "Nikhil T.",
        place: "Gurugram",
      },
      footer: "Kharcha · Your data stays on the phone",
    },
  ],
};

// --------------------------------------------------------------------------
//  The page furniture
// --------------------------------------------------------------------------

const WHATSAPP = "#25D366";

/** A photograph, as a gradient. Small enough that a real one would smudge. */
function Photo({
  site,
  h,
  label,
  className = "",
}: {
  site: Site;
  h: string;
  label?: string;
  className?: string;
}) {
  const p = site.palette;
  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{
        height: h,
        background: `linear-gradient(135deg, ${p.brand} 0%, ${p.accent} 55%, ${p.soft} 100%)`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 80% 10%, rgba(255,255,255,0.35), transparent 60%)",
        }}
      />
      {label && (
        <span
          className="absolute bottom-1 left-1 rounded px-1.5 py-0.5 text-[0.4375rem] font-semibold text-white"
          style={{ background: "rgba(0,0,0,0.42)" }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

function Stars({ color }: { color: string }) {
  return (
    <span className="flex gap-[1px]">
      {[0, 1, 2, 3, 4].map((n) => (
        <Star key={n} className="size-2" style={{ color }} fill={color} strokeWidth={0} />
      ))}
    </span>
  );
}

function TopBar({ site }: { site: Site }) {
  const p = site.palette;
  return (
    <div
      className="flex items-center justify-between px-4 py-1.5 text-[0.4375rem] font-medium"
      style={{ background: p.brand, color: "#fff" }}
    >
      <span className="truncate">{site.topbar}</span>
      <span className="hidden shrink-0 items-center gap-1 sm:flex">
        <Phone className="size-2" strokeWidth={3} aria-hidden />
        +91 98800 00000
      </span>
    </div>
  );
}

function Nav({ site }: { site: Site }) {
  const p = site.palette;
  return (
    <div
      className="flex items-center justify-between px-4 py-2.5"
      style={{ borderBottom: `1px solid ${p.line}`, background: p.bg }}
    >
      <span
        className="text-[0.75rem] font-extrabold tracking-tight"
        style={{ color: p.ink }}
      >
        {site.brand}
      </span>
      <div className="flex items-center gap-3">
        {site.nav.map((item) => (
          <span
            key={item}
            className="text-[0.5rem] font-medium"
            style={{ color: p.muted }}
          >
            {item}
          </span>
        ))}
        <span
          className="rounded-md px-2 py-1 text-[0.5rem] font-bold text-white"
          style={{ background: p.brand }}
        >
          {site.navCta}
        </span>
      </div>
    </div>
  );
}

function Hero({ site }: { site: Site }) {
  const p = site.palette;
  const app = site.shape === "mobile";

  return (
    <div
      className="grid grid-cols-[1.15fr_0.85fr] gap-3 px-4 py-4"
      style={{
        background: `linear-gradient(180deg, ${p.soft} 0%, ${p.bg} 100%)`,
      }}
    >
      <div>
        <span
          className="inline-block rounded-full px-2 py-0.5 text-[0.4375rem] font-bold tracking-wide uppercase"
          style={{ background: p.bg, color: p.brand, border: `1px solid ${p.line}` }}
        >
          {site.hero.eyebrow}
        </span>
        <p
          className="mt-2 text-[1.0625rem] leading-[1.15] font-extrabold tracking-tight"
          style={{ color: p.ink }}
        >
          {site.hero.title}
        </p>
        <p
          className="mt-1.5 text-[0.5625rem] leading-relaxed"
          style={{ color: p.muted }}
        >
          {site.hero.sub}
        </p>

        <div className="mt-2.5 flex items-center gap-1.5">
          <span
            className="rounded-md px-2.5 py-1.5 text-[0.5625rem] font-bold text-white"
            style={{ background: p.brand }}
          >
            {site.hero.cta}
          </span>
          <span
            className="rounded-md px-2.5 py-1.5 text-[0.5625rem] font-bold text-white"
            style={{ background: WHATSAPP }}
          >
            {site.hero.whatsapp}
          </span>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1">
          {site.hero.badges.map((badge) => (
            <span
              key={badge}
              className="rounded px-1.5 py-0.5 text-[0.4375rem] font-semibold"
              style={{ background: p.soft, color: p.ink, border: `1px solid ${p.line}` }}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {app ? (
        <div className="flex justify-center">
          <div
            className="w-[72%] rounded-[0.6rem] p-1"
            style={{ background: p.ink }}
          >
            <div className="overflow-hidden rounded-[0.45rem]" style={{ background: p.bg }}>
              <div
                className="flex items-center justify-between px-1.5 py-1 text-[0.375rem] font-bold"
                style={{ color: p.muted }}
              >
                <span>9:41</span>
                <span>▮▮▮</span>
              </div>
              <Photo site={site} h="3rem" className="mx-1.5 rounded" />
              <div className="space-y-1 p-1.5">
                {site.items.slice(0, 2).map((item) => (
                  <div
                    key={item.title}
                    className="rounded px-1.5 py-1"
                    style={{ background: p.soft }}
                  >
                    <p className="text-[0.4375rem] font-bold" style={{ color: p.ink }}>
                      {item.title}
                    </p>
                    <p className="text-[0.375rem]" style={{ color: p.brand }}>
                      {item.meta}
                    </p>
                  </div>
                ))}
                <div
                  className="rounded py-1 text-center text-[0.4375rem] font-bold text-white"
                  style={{ background: p.brand }}
                >
                  Start today
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Photo
          site={site}
          h="100%"
          label={site.shape === "clinic" ? "Our clinic" : undefined}
        />
      )}
    </div>
  );
}

function Stats({ site }: { site: Site }) {
  const p = site.palette;
  return (
    <div
      className="grid grid-cols-3 divide-x px-4 py-2.5"
      style={{ borderTop: `1px solid ${p.line}`, borderBottom: `1px solid ${p.line}` }}
    >
      {site.stats.map((stat) => (
        <div key={stat.label} className="px-2 text-center first:pl-0 last:pr-0">
          <p className="text-[0.75rem] leading-none font-extrabold" style={{ color: p.brand }}>
            {stat.value}
          </p>
          <p className="mt-1 text-[0.4375rem]" style={{ color: p.muted }}>
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

function BandTitle({ site }: { site: Site }) {
  const p = site.palette;
  return (
    <div className="flex items-baseline justify-between px-4 pt-3.5 pb-2">
      <p className="text-[0.6875rem] font-extrabold tracking-tight" style={{ color: p.ink }}>
        {site.bandTitle}
      </p>
      <span className="text-[0.4375rem] font-semibold" style={{ color: p.brand }}>
        View all →
      </span>
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
          <div
            key={item.title}
            className="overflow-hidden rounded-lg"
            style={{ border: `1px solid ${p.line}` }}
          >
            <div className="relative">
              <Photo site={site} h="2.6rem" className="rounded-none" />
              {item.tag && (
                <span
                  className="absolute top-1 left-1 rounded px-1 py-0.5 text-[0.375rem] font-bold text-white"
                  style={{ background: p.brand }}
                >
                  {item.tag}
                </span>
              )}
            </div>
            <div className="p-1.5">
              <p className="truncate text-[0.4375rem] font-bold" style={{ color: p.ink }}>
                {item.title}
              </p>
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="text-[0.5rem] font-extrabold" style={{ color: p.ink }}>
                  {item.meta}
                </span>
                {item.sub && (
                  <span className="text-[0.375rem] line-through" style={{ color: p.muted }}>
                    {item.sub}
                  </span>
                )}
              </div>
              <div className="mt-1">
                <Stars color={p.accent} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (site.shape === "clinic") {
    return (
      <div className="grid grid-cols-2 gap-2 px-4 pb-3">
        {site.items.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between rounded-lg px-2.5 py-2"
            style={{ border: `1px solid ${p.line}`, background: p.bg }}
          >
            <div className="min-w-0">
              <p className="truncate text-[0.5rem] font-bold" style={{ color: p.ink }}>
                {item.title}
              </p>
              <p className="truncate text-[0.4375rem]" style={{ color: p.muted }}>
                {item.sub}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[0.5625rem] font-extrabold" style={{ color: p.brand }}>
                {item.meta}
              </p>
              {item.tag && (
                <p className="text-[0.375rem] font-semibold" style={{ color: p.muted }}>
                  {item.tag}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (site.shape === "studio") {
    return (
      <div className="grid grid-cols-4 gap-1.5 px-4 pb-3">
        {site.items.map((item) => (
          <div key={item.title}>
            <Photo site={site} h="3.2rem" />
            <p className="mt-1 truncate text-[0.4375rem] font-bold" style={{ color: p.ink }}>
              {item.title}
            </p>
            <p className="truncate text-[0.375rem]" style={{ color: p.muted }}>
              {item.meta} · {item.sub}
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
            className="flex items-center justify-between rounded-lg px-2.5 py-2"
            style={{ background: p.soft, border: `1px solid ${p.line}` }}
          >
            <div className="min-w-0">
              <p className="truncate text-[0.5rem] font-bold" style={{ color: p.ink }}>
                {item.title}
              </p>
              <p className="truncate text-[0.4375rem]" style={{ color: p.muted }}>
                {item.sub}
              </p>
            </div>
            <span
              className="ml-2 shrink-0 rounded-full px-1.5 py-0.5 text-[0.4375rem] font-bold"
              style={{
                background: item.tag === "urgent" ? "#ef4444" : p.brand,
                color: "#fff",
              }}
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
              className="ml-auto w-fit max-w-[70%] rounded-lg rounded-br-sm px-2 py-1 text-[0.4375rem] font-medium"
              style={{ background: p.brand, color: "#fff" }}
            >
              {item.title}
            </div>
            <div
              className="w-[78%] rounded-lg rounded-bl-sm px-2 py-1.5"
              style={{ background: p.soft, border: `1px solid ${p.line}` }}
            >
              <p className="text-[0.4375rem] leading-relaxed" style={{ color: p.ink }}>
                {i === 0
                  ? "Refunds are credited in 5–7 working days from pickup."
                  : item.meta}
              </p>
              <p className="mt-1 text-[0.375rem] font-semibold" style={{ color: p.accent }}>
                ↳ {item.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // mobile
  return (
    <div className="space-y-1.5 px-4 pb-3">
      {site.items.map((item) => (
        <div
          key={item.title}
          className="flex items-center gap-2 rounded-lg px-2.5 py-2"
          style={{ background: p.soft, border: `1px solid ${p.line}` }}
        >
          <span
            className="size-5 shrink-0 rounded-md"
            style={{ background: `linear-gradient(135deg, ${p.brand}, ${p.accent})` }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.5rem] font-bold" style={{ color: p.ink }}>
              {item.title}
            </p>
            <p className="truncate text-[0.4375rem]" style={{ color: p.muted }}>
              {item.sub}
            </p>
          </div>
          <span className="shrink-0 text-[0.5625rem] font-extrabold" style={{ color: p.ink }}>
            {item.meta}
          </span>
        </div>
      ))}
    </div>
  );
}

function Quote({ site }: { site: Site }) {
  const p = site.palette;
  return (
    <div className="px-4 pb-3">
      <div
        className="rounded-lg px-3 py-2.5"
        style={{ background: p.soft, border: `1px solid ${p.line}` }}
      >
        <Stars color={p.accent} />
        <p
          className="mt-1.5 text-[0.5rem] leading-relaxed"
          style={{ color: p.ink }}
        >
          &ldquo;{site.quote.text}&rdquo;
        </p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span
            className="size-3.5 rounded-full"
            style={{ background: `linear-gradient(135deg, ${p.brand}, ${p.accent})` }}
          />
          <span className="text-[0.4375rem] font-bold" style={{ color: p.ink }}>
            {site.quote.who}
          </span>
          <span className="text-[0.4375rem]" style={{ color: p.muted }}>
            · {site.quote.place}
          </span>
        </div>
      </div>
    </div>
  );
}

function Footer({ site }: { site: Site }) {
  const p = site.palette;
  return (
    <div
      className="flex items-center justify-between px-4 py-3"
      style={{ background: p.soft, borderTop: `1px solid ${p.line}` }}
    >
      <div className="min-w-0">
        <p className="text-[0.5625rem] font-extrabold" style={{ color: p.ink }}>
          {site.brand}
        </p>
        <p className="truncate text-[0.4375rem]" style={{ color: p.muted }}>
          {site.footer}
        </p>
      </div>
      <div className="flex shrink-0 gap-1">
        {["UPI", "Visa", "COD"].map((item) => (
          <span
            key={item}
            className="rounded px-1 py-0.5 text-[0.375rem] font-bold"
            style={{ background: p.bg, color: p.muted, border: `1px solid ${p.line}` }}
          >
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
    <div className="relative" style={{ background: site.palette.bg }}>
      <TopBar site={site} />
      <Nav site={site} />
      <Hero site={site} />
      <Stats site={site} />
      <BandTitle site={site} />
      <Body site={site} />
      <Quote site={site} />
      <Footer site={site} />

      {/* The button that actually gets pressed on an Indian site. */}
      <span
        className="sticky bottom-2 left-full mr-2 grid size-6 place-items-center rounded-full text-[0.625rem] font-bold text-white shadow-lg"
        style={{ background: WHATSAPP, transform: "translateY(-0.5rem)" }}
        aria-hidden
      >
        ✆
      </span>
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
        <div className="h-[26rem] overflow-y-auto overscroll-contain">
          {site ? <Page site={site} /> : <Locked />}
        </div>

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
              aria-label={n < sites.length ? `Sample ${n + 1}` : "More, on a call"}
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
