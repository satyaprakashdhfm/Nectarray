/** Identity, navigation and the hero — the things every section leans on. */
import type { Link } from "@/types";

export const company = {
  name: "NectArray",
  tagline: "Software solutions, growth marketing & applied AI",
  email: "hello@nectarray.com",
  phone: "+91 00000 00000",
  location: "Hyderabad, India — working worldwide",
  calendarUrl: "https://cal.com/nectarray/intro",
  socials: [
    { label: "LinkedIn", href: "https://linkedin.com/company/nectarray" },
    { label: "Instagram", href: "https://instagram.com/nectarray" },
    { label: "X", href: "https://x.com/nectarray" },
    { label: "GitHub", href: "https://github.com/nectarray" },
  ],
};

export const nav: Link[] = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Academy", href: "#academy" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
];

export const hero = {
  eyebrow: "Studio · Est. 2026",
  headline: ["We build the software,", "and the demand for it."],
  lede: "NectArray is a four-in-one studio: we engineer web products, ship AI agents that actually do work, run the paid and organic marketing that fills them, and train the next set of engineers who build them.",
  primaryCta: { label: "Start a project", href: "#contact" },
  secondaryCta: { label: "See what we do", href: "#services" },
  microNote: "No pitch deck. One call, and a straight answer on what you need.",
  stats: [
    { value: "4", label: "Practices under one roof" },
    { value: "2–6", label: "Weeks to first launch" },
    { value: "100%", label: "Senior-built, no handoffs" },
  ],
};

/** Pill chips that scroll under the hero. */
export const trustChips = [
  "Senior engineers only",
  "Fixed scope, fixed price",
  "You own the code",
  "Weekly demos",
  "Launch in 2–6 weeks",
  "Marketing + build under one roof",
  "No lock-in",
  "Reply within 1 business day",
];

/** Tools we work with, scrolled as a second band under the chips. */
export const marqueeItems = [
  "Next.js",
  "React",
  "TypeScript",
  "Vercel AI SDK",
  "Claude",
  "Python",
  "PostgreSQL",
  "Meta Ads",
  "Google Ads",
  "GA4",
  "Shopify",
  "WhatsApp API",
  "n8n",
  "Figma",
  "Tailwind",
  "LangGraph",
];

export const footerNote =
  "NectArray builds software, ships AI agents, runs growth marketing and teaches the whole stack.";
