/** Identity, navigation and the hero — the things every section leans on. */
import type { Link } from "@/types";

export const company = {
  name: "NectArray",
  tagline: "Software solutions, growth marketing & applied AI",
  email: "info@nectarray.com",
  phone: "+91 93815 02998",
  location: "Bengaluru, India — working worldwide",

  /**
   * Profiles the studio actually owns.
   *
   * `live` gates both the footer links and the `sameAs` array in the
   * structured data. Flip one to true only once the profile really exists:
   * a footer link to a missing page is a dead end for visitors, and a
   * `sameAs` pointing nowhere actively works against the brand, since
   * `sameAs` is exactly how Google corroborates that an entity is real.
   * That corroboration is what stops it spell-correcting "NectArray".
   */
  socials: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/nectarray/",
      live: true,
    },
    {
      label: "Instagram",
      href: "https://instagram.com/nectarray",
      live: false,
    },
    { label: "X", href: "https://x.com/nectarray", live: false },
    // The org exists, but client work is private, so it would send visitors
    // to an empty profile. Deliberately unlinked rather than not-yet-created.
    { label: "GitHub", href: "https://github.com/nectarray", live: false },
  ],
};

/** Only the profiles that exist — safe to link and to publish as sameAs. */
export const liveSocials = company.socials.filter((social) => social.live);

/** Header navigation. Every entry is now a real route. */
export const nav: Link[] = [
  { label: "Marketing", href: "/marketing" },
  { label: "Software", href: "/software" },
  { label: "Agentic AI", href: "/agentic-ai" },
  { label: "Academy", href: "/academy" },
  { label: "Work", href: "/work" },
];

export const hero = {
  headline: ["We build the software,", "and the demand for it."],
  lede: "NectArray is a four-in-one studio: we engineer web products, ship AI agents that actually do work, run the paid and organic marketing that fills them, and train the next set of engineers who build them.",
  primaryCta: { label: "Start a project", href: "/contact" },
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
