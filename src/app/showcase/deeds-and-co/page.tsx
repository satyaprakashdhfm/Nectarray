import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * The three Deeds & Co. templates side by side, for the client to choose
 * between: each card opens its template's own page.
 */

const TEMPLATES = [
  {
    href: "/showcase/deeds-and-co/original",
    label: "Template 1",
    title: "The original",
    body: "The site as it is today: the film across the top with four messages taking turns over it, then the firm, the team, practices, approach and contact.",
    image: "/animations/law-journey/deeds/hero-poster.webp",
  },
  {
    href: "/showcase/deeds-and-co/story",
    label: "Template 2",
    title: "The client's visit",
    body: "The same sections down the left, and on the right a client's visit to the office that plays as you scroll, from walking in to the file handed back.",
    image: "/animations/law-journey/scene-2-3.webp",
  },
  {
    href: "/showcase/deeds-and-co/office",
    label: "Template 3",
    title: "The file's journey",
    body: "The film slides away under a soft panel, then your title file, in 3D, travels down the page beside the words: opened on the records, checked, stamped, and sent to your phone.",
    image: "/animations/law-journey/deeds/template-journey.webp",
  },
];

export default function DeedsTemplates() {
  return (
    <main className="mx-auto min-h-dvh max-w-6xl px-6 py-14 font-[family-name:var(--font-figtree)] text-[#2a0a0c] sm:py-20">
      {/* eslint-disable-next-line @next/next/no-img-element -- a fixed small logo */}
      <img
        src="/animations/law-journey/deeds/logo-oval.webp"
        alt="Deeds & Co."
        className="h-12 w-auto"
      />
      <h1 className="mt-8 max-w-2xl font-[family-name:var(--font-outfit)] text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        Three ways your website could look
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#5c4446]">
        Open each one and scroll through it. Every template carries the same
        firm, the same words and the same team.
      </p>
      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {TEMPLATES.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#ece8e8] bg-white transition hover:-translate-y-1 hover:border-[#7a0204]/40 hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#f6f4f4]">
                {/* eslint-disable-next-line @next/next/no-img-element -- fixed preview images */}
                <img
                  src={t.image}
                  alt=""
                  className="size-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-[0.6875rem] font-semibold tracking-[0.18em] text-[#7a0204] uppercase">
                  {t.label}
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-2xl font-semibold tracking-tight">
                  {t.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#5c4446]">
                  {t.body}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#7a0204]">
                  Open the template
                  <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
