"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  Compass,
  Earth,
  Mail,
  Menu,
  MessageSquareText,
  Phone,
  Scale,
  Stamp,
  X,
} from "lucide-react";

/**
 * The Deeds & Co. site's own parts (Advanced Property Lawyers, Bengaluru),
 * matched to the live site at deeds-and-co.vercel.app and its repo: the
 * contact bar and header, section headings, the standard line, about,
 * team, practices, approach, locations and careers, the call to action,
 * the footer, the WhatsApp button and the Bar Council disclaimer. The three
 * Deeds & Co. templates (the original with its film, the client's visit,
 * and the office from above) are built from these, so they read as the
 * same firm.
 *
 * Colours are the firm's own, not the palette: maroon #7a0204 on white,
 * with every other band on a soft maroon tint. Headings use --font-outfit,
 * body --font-figtree and the logo's descriptor --font-michroma, when the
 * page provides them. Pictures live in public/animations/law-journey/deeds/.
 */

export const ASSET = "/animations/law-journey/deeds";
export const FIRM = "Deeds & Co.";

export const C = {
  ink: "#2a0a0c",
  inkDeep: "#180506",
  inkSoft: "#5c4446",
  slate: "#806a6b",
  gold: "#7a0204",
  goldDeep: "#5e0103",
  goldBright: "#f3cfc6",
  tint: "#faf1f0",
  line: "#ece8e8",
  lineStrong: "#d9d2d2",
  paperTint: "#f6f4f4",
};

export const display = "font-[family-name:var(--font-outfit,ui-sans-serif)]";
export const body = "font-[family-name:var(--font-figtree,ui-sans-serif)]";
const wide = "font-[family-name:var(--font-michroma,ui-sans-serif)]";

/** The page's measure: the live site's container-page. */
export const container = "mx-auto w-full max-w-[100rem] px-6 @5xl:px-10";

export const pill =
  "inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-[#d9d2d2] px-6 py-3 text-sm font-semibold text-[#2a0a0c] transition hover:border-[#7a0204] hover:text-[#5e0103] active:scale-[0.98]";

export const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: {
    duration: 0.8,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  },
};

/* ---------- Content, as on the live site ---------- */

export const NAV = [
  "Practices",
  "Insights",
  "About Us",
  "Community",
  "Careers",
  "Contact",
];
export const PHONE = "+91 80 0000 0000";
export const EMAIL = "contact@deedsandco.example";

export const TAGLINE =
  "Every document checked. Every deed sealed. Every title clear.".split(" ");

export const OVERVIEW = [
  "Deeds & Co. is a property law practice in Bengaluru. We verify titles, draft and register deeds, regularise khata and conversion records, and act in the disputes that follow when a property's paperwork does not hold.",
  "Property in Karnataka is decided by its documents: the chain of title, the revenue records in Bhoomi, the registered instruments in Kaveri, and the municipal and development-authority approvals behind them. We read each of them before we advise.",
  "We work for home buyers, landowners and families, NRIs managing property from abroad, developers, and the banks and businesses that lend against or occupy land.",
];

export const PEOPLE = [
  { name: "Adv. Raghavendra Murthy", role: "Founding Partner", photo: 1 },
  { name: "Adv. Arjun Nair", role: "Partner, Real Estate", photo: 2 },
  { name: "Adv. Kavya Hegde", role: "Senior Associate", photo: 3 },
];

export const PRACTICES = [
  ["real-estate-infrastructure", "Property & Real Estate"],
  ["banking-finance", "Banking & Finance"],
  ["corporate-ma", "Corporate Advisory"],
  ["litigation", "Litigation"],
  ["dispute-resolution", "Alternative Dispute Resolution"],
  ["labour-employment", "Labour & Employment"],
  ["taxation", "Taxation"],
  ["intellectual-property", "Intellectual Property"],
  ["regulatory-environmental", "Regulatory & Environmental Law"],
] as const;

export const APPROACH = [
  [
    Scale,
    "Title, verified line by line",
    "Thirty-year chain of title, encumbrance certificates, RTCs and mutation records, read and reconciled before you pay.",
  ],
  [
    Stamp,
    "Registration handled",
    "Stamp duty, Kaveri slots, sub-registrar appointments and the post-registration khata transfer.",
  ],
  [
    MessageSquareText,
    "Updates you can follow",
    "One point of contact and a written status at each stage, so you always know what is pending.",
  ],
  [
    Earth,
    "For NRIs, from abroad",
    "Power of attorney drafting and adjudication, embassy attestation, and purchases and sales completed without travel.",
  ],
  [
    Compass,
    "Practical, not theoretical",
    "Advice that fits the deal in front of you: what to ask the seller for, and what to walk away from.",
  ],
] as const;

/* ---------- Brand marks lucide does not carry ---------- */

export function WhatsAppIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5.1 5.24-1.37A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.82.83-3.03-.2-.31a8.22 8.22 0 1 1 6.95 3.85Zm4.5-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.97-.15.16-.29.19-.54.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.72-1.34.08-.16.04-.3-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.47a.9.9 0 0 0-.65.3c-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.66 4.22 3.73 1.57.68 2.18.74 2.97.62.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.15-1.18-.06-.1-.22-.16-.47-.3Z" />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <span className="grid size-6 place-items-center rounded-[4px] bg-[#0a66c2] text-white">
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="currentColor"
        aria-hidden
      >
        <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 13.3c0-3.1-1.65-4.55-3.86-4.55a3.34 3.34 0 0 0-3.02 1.66V8.5h-3.24c.04.9 0 11.5 0 11.5h3.24v-6.42c0-.34.02-.69.13-.93.27-.69.9-1.4 1.95-1.4 1.38 0 1.93 1.05 1.93 2.6V20h3.24l-.37-6.7Z" />
      </svg>
    </span>
  );
}

function InstagramMark() {
  return (
    <span className="grid size-6 place-items-center rounded-[6px] bg-[linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)] text-white">
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

/* ---------- Header ---------- */

/**
 * The maroon contact bar over the white header, held at the top together.
 * Its height is --hh on the page's wrapper (see DEEDS_SHELL), which the
 * story templates pin their pictures under.
 */
export function DeedsHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40">
      <div className="hidden bg-[#7a0204] text-white @3xl:block">
        <div
          className={`${container} flex h-9 items-center justify-between text-xs font-semibold`}
        >
          <span className="pl-5">Bengaluru · Karnataka</span>
          <span className="flex gap-11">
            <a href="#contact">{PHONE}</a>
            <a href="#contact">{EMAIL}</a>
          </span>
        </div>
      </div>
      <div className="border-b border-[#ece8e8] bg-white/95 backdrop-blur-md">
        <div
          className={`${container} flex h-[4.25rem] items-center justify-between gap-4 @3xl:h-[5.25rem]`}
        >
          <a
            href="#top"
            className="group flex items-center gap-3"
            aria-label={`${FIRM}, home`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- copied into other projects, which may not use next/image */}
            <img
              src={`${ASSET}/logo-oval.webp`}
              alt=""
              className="h-10 w-auto transition duration-300 group-hover:scale-[1.03] @3xl:h-11"
            />
            <span
              className={`hidden flex-col text-[0.66rem] leading-[1.35] tracking-[0.2em] text-[#5c4446] uppercase @lg:flex ${wide}`}
            >
              <span>Advanced Property Lawyers</span>
              <span>Bengaluru</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-[0.9375rem] text-[#45100f] @5xl:flex">
            {NAV.map((label) => (
              <a
                key={label}
                href="#top"
                className="inline-flex items-center gap-1 transition hover:text-[#7a0204]"
              >
                {label}
                {label === "Practices" && <ChevronDown className="size-3.5" />}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden items-center gap-2 rounded-full bg-[#7a0204] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5e0103] active:scale-[0.98] @lg:inline-flex"
            >
              Request Consultation <ArrowRight className="size-4" />
            </a>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-10 place-items-center rounded-full border border-[#d9d2d2] text-[#2a0a0c] @5xl:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className={`${container} grid gap-1 pb-5 @5xl:hidden`}>
            {NAV.map((label) => (
              <a
                key={label}
                href="#top"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base text-[#2a0a0c] hover:bg-[#faf1f0]"
              >
                {label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#7a0204] px-5 py-3 text-sm font-semibold text-white"
            >
              Request Consultation <ArrowRight className="size-4" />
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}

/** The page wrapper: container queries, the firm's faces, and --hh. */
export const DEEDS_SHELL = `@container ${body} bg-white text-[#2a0a0c]`;
/** On the element inside the shell: the header's height, for pinning under. */
export const HEADER_HEIGHT = "[--hh:4.3rem] @3xl:[--hh:7.6rem]";

/* ---------- Pieces of the home page ---------- */

export function SectionHeading({
  eyebrow,
  title,
  lead,
  large = false,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  large?: boolean;
}) {
  return (
    <motion.div className="max-w-2xl" {...reveal}>
      {eyebrow && (
        <p className="inline-flex items-center gap-2.5 text-[0.6875rem] font-semibold tracking-[0.18em] text-[#5e0103] uppercase">
          <span aria-hidden className="w-8 border-t border-[#7a0204]/70" />
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-3 ${display} text-2xl leading-tight font-semibold tracking-tight text-balance @xl:text-4xl ${
          large ? "@5xl:text-[2.5rem] @5xl:leading-[1.15]" : ""
        }`}
      >
        {title}
      </h2>
      {lead && (
        <p className="mt-4 text-base leading-relaxed text-[#5c4446] @5xl:text-[1.0625rem]">
          {lead}
        </p>
      )}
    </motion.div>
  );
}

/** The firm's standard, each word settling in; the last three in maroon. */
export function Tagline({ className = "" }: { className?: string }) {
  return (
    <p
      className={`${display} text-2xl leading-[1.2] font-semibold tracking-tight text-balance @xl:text-4xl ${className}`}
    >
      {TAGLINE.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={`inline-block ${i >= TAGLINE.length - 3 ? "text-[#7a0204]" : ""}`}
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{
            duration: 0.6,
            delay: i * 0.07,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {word}
          {i < TAGLINE.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </p>
  );
}

/** About the firm. `stacked` puts the picture under the words (narrow columns). */
export function About({ stacked = false }: { stacked?: boolean }) {
  return (
    <div
      className={`grid items-center gap-10 ${
        stacked
          ? ""
          : "@5xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] @5xl:gap-14"
      }`}
    >
      <div>
        <SectionHeading
          eyebrow="About the firm"
          title="A Property Practice, Start to Finish"
          large
        />
        <motion.div
          className="mt-6 max-w-[65ch] space-y-4 text-base leading-relaxed text-[#5c4446] @5xl:text-[1.0625rem]"
          {...reveal}
        >
          {(stacked ? OVERVIEW.slice(0, 2) : OVERVIEW).map((p) => (
            <p key={p}>{p}</p>
          ))}
        </motion.div>
        <a href="#about" className={`mt-8 ${pill}`}>
          About the firm <ArrowRight className="size-3.5" />
        </a>
      </div>
      <motion.div
        className={`relative overflow-hidden rounded-2xl ${stacked ? "aspect-[16/9]" : "aspect-[16/10] @5xl:aspect-[4/3]"}`}
        {...reveal}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- copied into other projects, which may not use next/image */}
        <img
          src={`${ASSET}/approach-scales.webp`}
          alt=""
          className="absolute inset-0 size-full object-cover object-[68%_50%]"
        />
      </motion.div>
    </div>
  );
}

/** A portrait with the name over a soft fade, and a rule that grows on hover. */
export function PersonCard({ person }: { person: (typeof PEOPLE)[number] }) {
  return (
    <article className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#f6f4f4]">
      {/* eslint-disable-next-line @next/next/no-img-element -- copied into other projects, which may not use next/image */}
      <img
        src={`${ASSET}/person-${person.photo}.webp`}
        alt={person.name}
        className="absolute inset-0 size-full object-cover object-top transition duration-700 ease-out group-hover:scale-[1.03]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgb(24_5_6/0.85)_0%,rgb(24_5_6/0.35)_55%,transparent_100%)]"
      />
      <div className="absolute inset-x-0 bottom-0 p-4 @xl:p-5">
        <span
          aria-hidden
          className="mb-3 block h-0.5 w-6 origin-left bg-[#f3cfc6] transition-transform duration-500 group-hover:scale-x-[2.5]"
        />
        <h3
          className={`${display} text-base leading-snug font-semibold text-white @xl:text-lg`}
        >
          {person.name}
        </h3>
        <p className="mt-0.5 text-xs text-white/80 @xl:text-sm">
          {person.role}
        </p>
      </div>
    </article>
  );
}

export function Team({ narrow = false }: { narrow?: boolean }) {
  return (
    <>
      <SectionHeading
        title="Experienced Minds, Trusted Counsel"
        lead="Advocates who read every document in the chain before they advise, and stay with the file until the records are in your name."
      />
      <ul
        className={`mt-8 grid gap-4 @xl:gap-5 ${narrow ? "grid-cols-2 @5xl:grid-cols-3" : "grid-cols-2 @3xl:grid-cols-3"}`}
      >
        {PEOPLE.map((person, i) => (
          <motion.li
            key={person.name}
            {...reveal}
            transition={{ ...reveal.transition, delay: i * 0.08 }}
          >
            <PersonCard person={person} />
          </motion.li>
        ))}
      </ul>
      <a href="#team" className={`mt-8 ${pill}`}>
        Meet the team <ArrowRight className="size-3.5" />
      </a>
    </>
  );
}

const ADVANCE_MS = 5000;

/**
 * The numbered practices beside the selected one's photograph, stepping
 * through every five seconds with a maroon line that fills while each is
 * shown; pointing at a row selects it and holds. `stacked` puts the
 * photograph above the list.
 */
export function Practices({ stacked = false }: { stacked?: boolean }) {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const autoplay = useReducedMotion() === false;

  useEffect(() => {
    if (!autoplay || held) return;
    const timer = window.setTimeout(() => {
      if (document.visibilityState === "visible")
        setActive((i) => (i + 1) % PRACTICES.length);
    }, ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [active, autoplay, held]);

  const photo = (
    <a
      href="#practices"
      aria-label={PRACTICES[active][1]}
      className={`relative block overflow-hidden rounded-2xl bg-[#f6f4f4] ${
        stacked ? "aspect-[16/9]" : "min-h-[18rem] @5xl:min-h-full"
      }`}
    >
      {PRACTICES.map(([slug], i) => (
        // eslint-disable-next-line @next/next/no-img-element -- copied into other projects, which may not use next/image
        <img
          key={slug}
          src={`${ASSET}/practice-${slug}.webp`}
          alt=""
          className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ease-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </a>
  );

  return (
    <div onPointerLeave={() => setHeld(false)}>
      <SectionHeading
        title="Practice Areas"
        lead="Property law at the centre, with the corporate, finance, dispute and regulatory work that property matters lead into."
      />
      <div
        className={`mt-8 grid gap-8 ${stacked ? "" : "@5xl:grid-cols-2 @5xl:gap-12"}`}
      >
        {stacked && photo}
        <div>
          <ol className="space-y-1">
            {PRACTICES.map(([slug, name], i) => {
              const on = i === active;
              return (
                <li key={slug}>
                  <a
                    href="#practices"
                    onPointerEnter={() => {
                      setHeld(true);
                      setActive(i);
                    }}
                    onFocus={() => {
                      setHeld(true);
                      setActive(i);
                    }}
                    className={`group relative flex items-center gap-5 overflow-hidden rounded-lg px-4 py-3 text-[0.95rem] transition-colors duration-300 ${
                      on ? "bg-[#7a0204]/[0.07]" : "hover:bg-[#7a0204]/[0.04]"
                    }`}
                  >
                    <span
                      className={`w-6 ${display} tabular-nums ${on ? "text-[#7a0204]" : ""}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">{name}</span>
                    <ArrowRight
                      className={`size-4 shrink-0 transition duration-300 ${
                        on
                          ? "translate-x-0.5 text-[#7a0204]"
                          : "text-[#5c4446]/50 group-hover:text-[#5c4446]"
                      }`}
                    />
                    {on && (
                      <span
                        aria-hidden
                        className="absolute inset-x-4 bottom-0 h-0.5 overflow-hidden"
                      >
                        <motion.span
                          key={`fill-${active}-${held}`}
                          className="absolute inset-0 origin-left bg-[#7a0204]"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            duration: autoplay && !held ? ADVANCE_MS / 1000 : 0,
                            ease: "linear",
                          }}
                        />
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ol>
          <a href="#practices" className={`mt-6 ${pill}`}>
            View all practices <ArrowRight className="size-3.5" />
          </a>
        </div>
        {!stacked && photo}
      </div>
    </div>
  );
}

/** One panel: a photograph, then the five commitments in two columns. */
export function Approach({ stacked = false }: { stacked?: boolean }) {
  return (
    <>
      <SectionHeading
        eyebrow="Why us"
        title="Our Approach"
        lead="Five commitments on every property matter."
      />
      <motion.div
        className={`mt-8 grid overflow-hidden rounded-2xl border border-[#ece8e8] bg-white ${
          stacked ? "" : "@3xl:grid-cols-[minmax(0,0.55fr)_minmax(0,1.6fr)]"
        }`}
        {...reveal}
      >
        <div
          className={`relative ${stacked ? "aspect-[16/7]" : "min-h-[15rem] @3xl:min-h-full"}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- copied into other projects, which may not use next/image */}
          <img
            src={`${ASSET}/approach-client-first.webp`}
            alt=""
            className="absolute inset-0 size-full object-cover object-[50%_55%]"
          />
        </div>
        <ol
          className={`grid gap-x-10 gap-y-6 p-6 @xl:p-8 ${
            stacked
              ? ""
              : "@5xl:grid-flow-col @5xl:grid-cols-2 @5xl:grid-rows-3"
          }`}
        >
          {APPROACH.map(([Icon, title, text], i) => (
            <li
              key={title}
              className="grid grid-cols-[2.5rem_1.5rem_minmax(0,1fr)] gap-x-4"
            >
              <span className="flex size-10 items-center justify-center rounded-full border border-[#d9d2d2] bg-white text-sm tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Icon
                className="mt-2 size-6 text-[#7a0204]"
                strokeWidth={1.25}
                aria-hidden
              />
              <div className="pt-1.5">
                <h3
                  className={`${display} text-lg leading-snug font-semibold tracking-tight`}
                >
                  {title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[#5c4446]">
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </motion.div>
    </>
  );
}

/** Where the firm is, and joining it: two cards. */
export function Locations({ stacked = false }: { stacked?: boolean }) {
  return (
    <div className={`grid gap-5 ${stacked ? "" : "@5xl:grid-cols-2"}`}>
      <motion.article
        className="flex flex-col rounded-2xl border border-[#ece8e8] bg-white p-6 @xl:p-8"
        {...reveal}
      >
        <p className="text-[0.6875rem] font-semibold tracking-[0.18em] text-[#5e0103] uppercase">
          Locations
        </p>
        <h2
          className={`mt-2 ${display} text-2xl font-semibold tracking-tight @xl:text-3xl`}
        >
          Our legal presence
        </h2>
        <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-[#5c4446]">
          Local practice matters in property law: sub-registrar offices, BBMP
          and BDA procedures, and Karnataka&apos;s revenue records each have
          their own ways, and we work with them every day.
        </p>
        <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-5">
          {/* The High Court of Karnataka, in maroon through its own alpha. */}
          <div
            aria-hidden
            className="aspect-[697/260] w-full max-w-[13rem] bg-[#7a0204]/85"
            style={{
              mask: `url(${ASSET}/hc-karnataka.webp) center/contain no-repeat`,
              WebkitMask: `url(${ASSET}/hc-karnataka.webp) center/contain no-repeat`,
            }}
          />
          <div>
            <h3 className={`${display} text-lg font-semibold tracking-tight`}>
              Bengaluru
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[#5c4446]">
              Bengaluru
              <br />
              Karnataka, India
            </p>
          </div>
        </div>
        <ul className="mt-6 flex flex-wrap gap-2">
          {["Bengaluru Urban", "Bengaluru Rural", "Across Karnataka"].map(
            (place) => (
              <li
                key={place}
                className="rounded-full border border-[#d9d2d2] px-3.5 py-1.5 text-sm"
              >
                {place}
              </li>
            ),
          )}
        </ul>
      </motion.article>
      <motion.article
        className="flex flex-col overflow-hidden rounded-2xl border border-[#ece8e8] bg-white"
        {...reveal}
      >
        <div className="relative aspect-[16/5]">
          {/* eslint-disable-next-line @next/next/no-img-element -- copied into other projects, which may not use next/image */}
          <img
            src={`${ASSET}/office-desk.webp`}
            alt=""
            className="absolute inset-0 size-full object-cover object-[78%_50%]"
          />
        </div>
        <div className="flex flex-1 flex-col p-6 @xl:p-8">
          <h2
            className={`${display} text-2xl font-semibold tracking-tight @xl:text-3xl`}
          >
            Work with us
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5c4446] @xl:text-base">
            We look for advocates who want responsibility early and take the
            time to read a file properly.
          </p>
          <a href="#careers" className={`mt-6 ${pill}`}>
            View openings <ArrowRight className="size-3.5" />
          </a>
        </div>
      </motion.article>
    </div>
  );
}

const CONTACT_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white active:scale-[0.98]";

/** The maroon call to action. */
export function CtaBand() {
  return (
    <motion.div
      className="grid gap-6 rounded-2xl bg-[#7a0204] px-6 py-8 text-white @xl:px-8 @5xl:grid-cols-[minmax(0,1fr)_auto] @5xl:items-center @5xl:gap-10"
      {...reveal}
    >
      <div>
        <h2
          className={`max-w-lg ${display} text-2xl font-semibold tracking-tight @xl:text-3xl`}
        >
          Have a property document you want checked?
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/85 @xl:text-base">
          Send us what you have. We will tell you what it shows, what is missing
          and what it will take to make the title clear.
        </p>
      </div>
      <div className="flex flex-col gap-3 @xl:flex-row @xl:flex-wrap">
        <a
          href="#contact"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#7a0204] transition hover:bg-[#f3cfc6] active:scale-[0.98]"
        >
          Book a title check <ArrowRight className="size-3.5" />
        </a>
        <a href="#contact" className={CONTACT_BUTTON}>
          <WhatsAppIcon className="size-[18px]" /> WhatsApp
        </a>
        <a href="#contact" className={CONTACT_BUTTON}>
          <Phone className="size-[18px]" strokeWidth={1.6} /> Call
        </a>
        <a href="#contact" className={CONTACT_BUTTON}>
          <Mail className="size-[18px]" strokeWidth={1.6} /> Email
        </a>
      </div>
    </motion.div>
  );
}

const FOOTER_COLUMNS: [string, string[]][] = [
  [
    "Practices",
    [
      "Property",
      "Banking & Finance",
      "Corporate Advisory",
      "Litigation",
      "ADR",
      "Labour & Employment",
      "Taxation",
      "Intellectual Property",
      "Regulatory & Environmental",
    ],
  ],
  [
    "Sectors",
    [
      "Financial Services",
      "Infrastructure & Energy",
      "Manufacturing",
      "TMT",
      "Real Estate",
      "Healthcare",
      "Startups",
      "Public Sector",
    ],
  ],
  ["Firm", ["About Us", "Insights", "Community", "Careers", "Contact Us"]],
];

export function DeedsFooter() {
  return (
    <footer id="contact" className="bg-[#7a0204] text-white/85">
      <div
        className={`${container} grid gap-12 py-16 @5xl:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)]`}
      >
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element -- copied into other projects, which may not use next/image */}
          <img
            src={`${ASSET}/logo-white.webp`}
            alt={`${FIRM}, Advanced Property Lawyers, Bengaluru`}
            className="h-28 w-auto"
          />
          <p className="mt-8 max-w-sm text-sm leading-relaxed">
            A property law practice in Bengaluru: title verification, sale
            deeds, registration, khata and RERA work, and property disputes.
          </p>
          <ul className="mt-6 space-y-2 text-sm">
            <li className="flex items-center gap-3">
              <Phone className="size-4" strokeWidth={1.6} /> {PHONE}
            </li>
            <li className="flex items-center gap-3">
              <WhatsAppIcon /> WhatsApp {PHONE}
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4" strokeWidth={1.6} /> {EMAIL}
            </li>
          </ul>
          <div className="mt-6 flex gap-3">
            <LinkedInMark />
            <span className="grid size-6 place-items-center rounded-full bg-[#25d366] text-white">
              <WhatsAppIcon className="size-4" />
            </span>
            <InstagramMark />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10 @3xl:grid-cols-3">
          {FOOTER_COLUMNS.map(([title, links]) => (
            <div key={title}>
              <p className="text-sm font-semibold text-white">{title}</p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#top" className="transition hover:text-white">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className={container}>
        <div className="flex flex-col gap-4 border-t border-white/15 py-7 text-xs @5xl:flex-row @5xl:items-center @5xl:justify-between">
          <p>© 2026 {FIRM} All rights reserved.</p>
          <p>Clear titles. Registered deeds. No loose ends.</p>
          <p className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              "Disclaimer",
              "Privacy Policy",
              "Cookie Policy",
              "Terms of Use",
              "Sitemap",
            ].map((l) => (
              <a key={l} href="#top" className="hover:text-white">
                {l}
              </a>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}

/** The WhatsApp button in the corner, with two rings rippling out. Full page only. */
export function WhatsAppFloat() {
  return (
    <a
      href="#contact"
      aria-label="Chat on WhatsApp"
      className="fixed right-6 bottom-6 z-40 grid size-12 place-items-center rounded-full bg-[#25d366] text-white shadow-lg shadow-black/20"
    >
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute inset-0 rounded-full border-2 border-[#25d366]"
          initial={{ scale: 1, opacity: 0.4 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            delay: i * 1.2,
            ease: "easeOut",
          }}
        />
      ))}
      <WhatsAppIcon className="size-6" />
    </a>
  );
}

const GATE_KEY = "deeds-disclaimer";

/**
 * The Bar Council of India disclaimer, as the live site opens with. Shown
 * once a visit (remembered for the session). Full page only.
 */
export function DisclaimerGate() {
  const [open, setOpen] = useState(false);
  // Read after the first paint, so the server and client markup agree.
  useEffect(() => {
    const id = window.setTimeout(() => {
      let seen = false;
      try {
        seen = sessionStorage.getItem(GATE_KEY) === "1";
      } catch {
        // Storage blocked: show it.
      }
      if (!seen) setOpen(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);
  const close = () => {
    try {
      sessionStorage.setItem(GATE_KEY, "1");
    } catch {
      // Private mode: it simply shows again next time.
    }
    setOpen(false);
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-[#180506]/60 p-4 backdrop-blur-sm">
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="deeds-disclaimer-title"
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white text-[#2a0a0c] shadow-2xl"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3 border-b border-[#ece8e8] px-8 py-5">
          <span className="grid size-10 place-items-center rounded-lg border border-[#ece8e8]">
            {/* eslint-disable-next-line @next/next/no-img-element -- copied into other projects, which may not use next/image */}
            <img src={`${ASSET}/logo-oval.webp`} alt="" className="w-8" />
          </span>
          <div>
            <p
              id="deeds-disclaimer-title"
              className={`${display} text-xl font-semibold`}
            >
              Disclaimer
            </p>
            <p className="text-[0.6875rem] tracking-[0.18em] text-[#806a6b] uppercase">
              Deeds &amp; Co.
            </p>
          </div>
        </div>
        <div className="space-y-4 px-8 py-6 text-[0.9375rem] leading-relaxed text-[#5c4446]">
          <p>
            As per the rules of the Bar Council of India, we are not permitted
            to solicit work and advertise. By clicking on the &lsquo;I
            AGREE&rsquo; button below, you acknowledge the following:
          </p>
          <ul className="space-y-3">
            {[
              "There has been no advertisement, personal communication, solicitation, invitation or inducement of any sort whatsoever from us or any of our members to solicit any work through this website;",
              "You wish to gain more information about us for your own information and use;",
              "The information about us is provided to you on your specific request and any information obtained or materials downloaded from this website is completely at your own volition and any transmission, receipt or use of this site does not create any lawyer-client relationship; and that",
              "We are not liable for any consequence of any action taken by you relying on the material / information provided on this website.",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[#7a0204]" />
                {t}
              </li>
            ))}
          </ul>
          <p className="font-medium text-[#2a0a0c]">
            If you have any legal issues, you, in all cases, must seek
            independent legal advice.
          </p>
        </div>
        <div className="flex justify-end gap-3 border-t border-[#ece8e8] px-8 py-5">
          <button
            type="button"
            onClick={close}
            className="rounded-full border border-[#d9d2d2] px-7 py-3 text-sm font-semibold"
          >
            I DO NOT AGREE
          </button>
          <button
            type="button"
            onClick={close}
            className="rounded-lg bg-[#2a0a0c] px-8 py-3 text-sm font-semibold text-white"
          >
            I AGREE
          </button>
        </div>
      </motion.div>
    </div>
  );
}
