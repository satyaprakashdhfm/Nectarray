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
];

export const hero = {
  headline: ["We build the software,", "and the demand for it."],
  lede: "We build web products, ship AI agents that do real work, run the paid and organic marketing that brings people to them, and teach the engineers coming up behind us.",
  primaryCta: { label: "Start a project", href: "/contact#enquiry" },
  secondaryCta: { label: "See what we do", href: "#services" },
  microNote: "One call is usually enough to know what your project needs and what it will take.",
  stats: [
    { value: "4", label: "Practices under one roof" },
    { value: "160+", label: "Integrations we work with" },
    { value: "25+", label: "Platforms and consoles" },
  ],
};

export const footerNote =
  "NectArray builds software, ships AI agents, runs growth marketing and teaches the whole stack.";
