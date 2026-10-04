import type { UiComponent } from "@/lib/content/ui-library";

/**
 * The Sections group on the Elements tab: whole page sections rather than
 * single components — approach panels, timelines, zigzag rows, bento grids
 * and practice-area layouts. Redrawn from the templates built for a law
 * firm's site, recoloured to the palette variables.
 *
 * The interactive ones (tabs, the slider, the list that swaps its image)
 * use no script at all: each choice is a hidden radio button, the clickable
 * rows are its labels, and the panel for the checked one is shown through
 * `:has()`. That is what lets them work inside the Elements previews, which
 * run with scripts switched off, and it means the copied HTML needs nothing
 * else to work.
 *
 * Every class that depends on which item is chosen is written out in full
 * in the data below, never assembled from pieces, because Tailwind only
 * generates the classes it can find whole in the source.
 */

// Lucide icon paths (ISC licence), drawn inline so a copied section carries
// its own icons.
const PATHS = {
  scale:
    '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  message:
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M13 8H7"/><path d="M17 12H7"/>',
  globe:
    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  chart:
    '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M8 17v-3"/><path d="M13 17V9"/><path d="M18 17V5"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  back: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
} as const;

const icon = (name: keyof typeof PATHS, cls: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="${cls}" aria-hidden="true">${PATHS[name]}</svg>`;

const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const eyebrow = (text: string) =>
  `<p class="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-(--p-dark) uppercase"><span class="h-px w-8 bg-(--p)"></span>${text}</p>`;

// ---------------------------------------------------------------------------
//  Content shared by the sections
// ---------------------------------------------------------------------------

type Strength = {
  icon: keyof typeof PATHS;
  title: string;
  short: string;
  long: string;
  seed: string;
};

const STRENGTHS: Strength[] = [
  {
    icon: "scale",
    title: "Proven Legal Expertise",
    short:
      "A strong track record in corporate law, M&A, and high-stakes legal matters.",
    long: "A strong track record in corporate law, M&A, and high-stakes legal matters. Our deep industry knowledge and practical insights let us deliver effective, tailored solutions.",
    seed: "law-scales-books",
  },
  {
    icon: "users",
    title: "Client-First Approach",
    short:
      "We prioritise client goals with personalised, practical and responsive counsel.",
    long: "We prioritise client goals with personalised, practical and responsive counsel. Our collaborative approach builds long-term relationships on trust.",
    seed: "business-handshake",
  },
  {
    icon: "message",
    title: "Connected Client Experience",
    short:
      "Seamless communication and a collaborative experience across every engagement.",
    long: "Seamless communication and a collaborative experience across every engagement. Technology and responsiveness keep our clients informed at every step.",
    seed: "desk-laptop-coffee",
  },
  {
    icon: "globe",
    title: "Cross-Border & Regulatory Mastery",
    short:
      "Deep understanding of global markets and regulatory frameworks.",
    long: "Deep understanding of global markets and regulatory frameworks. We help clients through complex cross-border transactions and changing regulation with confidence.",
    seed: "globe-office",
  },
  {
    icon: "chart",
    title: "Strategic Legal Solutions",
    short:
      "Practical, innovative and business-focused solutions for complex legal challenges.",
    long: "Practical, innovative and business-focused solutions for complex legal challenges. Legal insight combined with commercial understanding, aimed at your goals.",
    seed: "signing-documents",
  },
];

type Area = { title: string; text: string; seed: string };

const AREAS: Area[] = [
  {
    title: "Banking & Finance",
    text: "Strategic counsel across banking and financial markets, including financing, regulatory and transactional matters.",
    seed: "finance-coins",
  },
  {
    title: "Litigation",
    text: "Strong representation in complex disputes and high-stakes matters, from first notice to final appeal.",
    seed: "litigation-books",
  },
  {
    title: "Alternative Dispute Resolution",
    text: "Practical, effective solutions through negotiation, mediation and arbitration.",
    seed: "boardroom-meeting",
  },
  {
    title: "Corporate Advisory",
    text: "Advice for growth and governance, covering corporate transactions, compliance and restructuring.",
    seed: "corporate-tower",
  },
  {
    title: "Real Estate",
    text: "Acquisitions, leasing, development and title diligence for commercial and residential property.",
    seed: "glass-building",
  },
  {
    title: "Taxation",
    text: "Direct and indirect tax planning, GST advisory and representation before the tax authorities.",
    seed: "calculator-papers",
  },
  {
    title: "Labour & Employment",
    text: "Employment contracts, policies, workplace investigations and disputes, for employers of every size.",
    seed: "team-office",
  },
  {
    title: "Intellectual Property",
    text: "Trademarks, copyright, patents and the agreements that protect and license them.",
    seed: "lightbulb-idea",
  },
  {
    title: "Regulatory & Environmental",
    text: "Licensing, compliance and environmental clearances for regulated industries.",
    seed: "green-leaves",
  },
];

const num = (i: number) => String(i + 1).padStart(2, "0");

// ---------------------------------------------------------------------------
//  1. Approach: tabs on the left, a large image panel on the right
// ---------------------------------------------------------------------------

/** Literal per-tab classes: which panel shows for which checked radio. */
const APPROACH_SHOW = [
  "group-has-[#approach-1:checked]/approach:block",
  "group-has-[#approach-2:checked]/approach:block",
  "group-has-[#approach-3:checked]/approach:block",
  "group-has-[#approach-4:checked]/approach:block",
  "group-has-[#approach-5:checked]/approach:block",
];

const approachTabs = `<section class="group/approach bg-[#faf8f4]">
  <div class="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-[minmax(0,22rem)_1fr] md:py-20">
    <div>
      ${eyebrow("Why us")}
      <h2 class="mt-3 font-serif text-4xl tracking-tight text-zinc-900">Our approach</h2>
      <p class="mt-2 text-zinc-600">Five strengths. One committed partnership.</p>
      <div class="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white" role="radiogroup" aria-label="Our strengths">
${STRENGTHS.map(
  (s, i) => `        <label class="flex cursor-pointer items-center gap-4 border-b border-zinc-200 px-4 py-3.5 text-sm text-zinc-800 transition-colors last:border-0 hover:bg-zinc-50 has-[:checked]:bg-(--p) has-[:checked]:text-(--p-on) has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-(--p-dark) has-[:focus-visible]:ring-inset">
          <input type="radio" name="approach" id="approach-${i + 1}" class="sr-only"${i === 0 ? " checked" : ""} />
          ${icon(s.icon, "size-5 shrink-0")}
          <span class="flex-1">${s.title}</span>
          ${icon("arrow", "size-4 shrink-0 opacity-60")}
        </label>`,
).join("\n")}
      </div>
    </div>
    <div class="relative min-h-80 overflow-hidden rounded-2xl bg-zinc-950">
${STRENGTHS.map(
  (s, i) => `      <div class="absolute inset-0 hidden ${APPROACH_SHOW[i]}">
        <img src="${img(s.seed, 1200, 800)}" alt="" class="absolute inset-0 size-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/70 to-zinc-950/10"></div>
        <div class="relative flex h-full max-w-md flex-col justify-center p-8 md:p-12">
          <span class="h-0.5 w-8 bg-(--p)"></span>
          <h3 class="mt-5 font-serif text-3xl leading-tight text-white">${s.title}</h3>
          <p class="mt-4 leading-relaxed text-white/80">${s.short}</p>
        </div>
      </div>`,
).join("\n")}
    </div>
  </div>
</section>`;

// ---------------------------------------------------------------------------
//  2. Approach: vertical timeline beside a photo
// ---------------------------------------------------------------------------

const verticalTimeline = `<section class="bg-[#faf8f4]">
  <div class="mx-auto grid max-w-6xl md:grid-cols-[2fr_3fr]">
    <div class="relative min-h-72 overflow-hidden">
      <img src="${img("bright-atrium", 900, 1100)}" alt="" class="absolute inset-0 size-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-b from-[#faf8f4] via-[#faf8f4]/70 to-transparent"></div>
      <div class="relative px-5 pt-12 md:px-10">
        ${eyebrow("Why us")}
        <h2 class="mt-3 font-serif text-4xl tracking-tight text-zinc-900">Our approach</h2>
        <p class="mt-2 max-w-[22ch] text-lg text-zinc-600">Five strengths. One committed partnership.</p>
      </div>
    </div>
    <ol class="space-y-6 px-5 py-12 md:px-10">
${STRENGTHS.map(
  (s, i) => `      <li class="relative grid grid-cols-[2.75rem_2rem_1fr] items-start gap-4 before:absolute before:top-11 before:-bottom-6 before:left-[1.375rem] before:w-px before:bg-(--p)/40 last:before:hidden">
        <span class="grid size-11 place-items-center rounded-full border border-(--p) bg-white font-serif text-(--p-dark)">${num(i)}</span>
        ${icon(s.icon, "mt-2 size-7 text-(--p-dark)")}
        <div>
          <h3 class="font-serif text-lg text-zinc-900">${s.title}</h3>
          <p class="mt-1 text-sm leading-relaxed text-zinc-600">${s.short}</p>
        </div>
      </li>`,
).join("\n")}
    </ol>
  </div>
</section>`;

// ---------------------------------------------------------------------------
//  3. Approach: horizontal timeline
// ---------------------------------------------------------------------------

const horizontalTimeline = `<section class="bg-(--p-light)/60">
  <div class="mx-auto max-w-6xl px-5 py-14 md:py-20">
    ${eyebrow("Why us")}
    <h2 class="mt-3 font-serif text-4xl tracking-tight text-zinc-900">Our approach</h2>
    <p class="mt-2 text-zinc-600">Five strengths. One committed partnership.</p>
    <ol class="relative mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-5 md:overflow-visible">
      <li class="absolute top-8 right-[10%] left-[10%] hidden h-px bg-(--p)/40 md:block" aria-hidden="true"></li>
${STRENGTHS.map(
  (s, i) => `      <li class="relative w-60 shrink-0 snap-start text-center md:w-auto">
        <span class="mx-auto grid size-16 place-items-center rounded-full border border-(--p)/50 bg-white text-(--p-dark) shadow-sm">${icon(s.icon, "size-7")}</span>
        <p class="mt-4 font-serif text-lg text-(--p-dark)">${num(i)}</p>
        <h3 class="mt-1 font-serif text-base text-zinc-900">${s.title}</h3>
        <p class="mt-2 text-sm leading-relaxed text-zinc-600">${s.short}</p>
      </li>`,
).join("\n")}
    </ol>
  </div>
</section>`;

// ---------------------------------------------------------------------------
//  4. Approach: zigzag rows of photo and text
// ---------------------------------------------------------------------------

/** Literal: every other row puts its photo on the right. */
const ZIGZAG_ORDER = ["", "md:order-2", "", "md:order-2", ""];

const zigzag = `<section class="bg-[#faf8f4]">
  <div class="px-5 pt-14 pb-10 text-center md:pt-20">
    <p class="flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.2em] text-(--p-dark) uppercase"><span class="h-px w-8 bg-(--p)"></span>Why us<span class="h-px w-8 bg-(--p)"></span></p>
    <h2 class="mt-3 font-serif text-4xl tracking-tight text-zinc-900">Our approach</h2>
    <p class="mt-2 text-zinc-600">Five strengths. One committed partnership.</p>
  </div>
${STRENGTHS.map(
  (s, i) => `  <div class="grid md:grid-cols-2">
    <img src="${img(s.seed, 1000, 560)}" alt="" class="h-56 w-full object-cover md:h-full md:min-h-64 ${ZIGZAG_ORDER[i]}" />
    <div class="flex flex-col justify-center px-5 py-10 md:px-12">
      <p class="flex items-center gap-3 font-serif text-lg text-(--p-dark)">${num(i)}<span class="h-px w-8 bg-(--p)/60"></span></p>
      <h3 class="mt-3 font-serif text-2xl text-zinc-900">${s.title}</h3>
      <p class="mt-3 max-w-[48ch] leading-relaxed text-zinc-600">${s.long}</p>
    </div>
  </div>`,
).join("\n")}
</section>`;

// ---------------------------------------------------------------------------
//  5. Approach: photo beside a bento grid of cards
// ---------------------------------------------------------------------------

/** Literal per-card looks and spans: three across, then two. */
const BENTO = [
  {
    box: "bg-(--t-light) text-zinc-900 lg:col-span-2",
    soft: "text-zinc-600",
    accent: "text-(--t-dark)",
    ring: "border-zinc-900/30",
  },
  {
    box: "bg-zinc-900 text-white lg:col-span-2",
    soft: "text-white/75",
    accent: "text-(--p)",
    ring: "border-white/40",
  },
  {
    box: "bg-(--p-light) text-zinc-900 lg:col-span-2",
    soft: "text-zinc-600",
    accent: "text-(--p-dark)",
    ring: "border-zinc-900/30",
  },
  {
    box: "bg-(--p-light) text-zinc-900 lg:col-span-3",
    soft: "text-zinc-600",
    accent: "text-(--p-dark)",
    ring: "border-zinc-900/30",
  },
  {
    box: "bg-(--t-light) text-zinc-900 lg:col-span-3",
    soft: "text-zinc-600",
    accent: "text-(--t-dark)",
    ring: "border-zinc-900/30",
  },
];

const bento = `<section class="bg-[#faf8f4]">
  <div class="mx-auto max-w-6xl px-5 py-14 md:py-20">
    ${eyebrow("Why us")}
    <h2 class="mt-3 font-serif text-4xl tracking-tight text-zinc-900">Our approach</h2>
    <p class="mt-2 text-zinc-600">Five strengths. One committed partnership.</p>
    <div class="mt-8 grid gap-3 lg:grid-cols-[1fr_2fr]">
      <img src="${img("law-books-laptop", 800, 900)}" alt="" class="h-64 w-full rounded-xl object-cover lg:h-full" />
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
${STRENGTHS.map(
  (s, i) => `        <article class="flex flex-col rounded-xl p-6 ${BENTO[i].box}">
          <div class="flex items-start justify-between gap-4">
            <p class="flex items-center gap-3 font-serif text-lg ${BENTO[i].accent}">${num(i)}<span class="h-px w-6 bg-current opacity-50"></span></p>
            ${icon(s.icon, `size-8 shrink-0 ${BENTO[i].accent}`)}
          </div>
          <h3 class="mt-3 font-serif text-xl">${s.title}</h3>
          <p class="mt-2 flex-1 text-sm leading-relaxed ${BENTO[i].soft}">${s.short}</p>
          <a href="#" class="mt-5 grid size-9 place-items-center rounded-full border ${BENTO[i].ring}" aria-label="More about ${s.title}">${icon("arrow", "size-4")}</a>
        </article>`,
).join("\n")}
      </div>
    </div>
  </div>
</section>`;

// ---------------------------------------------------------------------------
//  6. Practice areas: full-width slides with arrows and dots
// ---------------------------------------------------------------------------

const SLIDES = AREAS.slice(0, 4);

/** Literal per-slide classes for the slide, its dot, and which is shown. */
const SLIDE_SHOW = [
  "group-has-[#slide-1:checked]/slides:opacity-100 group-has-[#slide-1:checked]/slides:pointer-events-auto",
  "group-has-[#slide-2:checked]/slides:opacity-100 group-has-[#slide-2:checked]/slides:pointer-events-auto",
  "group-has-[#slide-3:checked]/slides:opacity-100 group-has-[#slide-3:checked]/slides:pointer-events-auto",
  "group-has-[#slide-4:checked]/slides:opacity-100 group-has-[#slide-4:checked]/slides:pointer-events-auto",
];
const SLIDE_DOT = [
  "group-has-[#slide-1:checked]/slides:w-10 group-has-[#slide-1:checked]/slides:bg-(--p)",
  "group-has-[#slide-2:checked]/slides:w-10 group-has-[#slide-2:checked]/slides:bg-(--p)",
  "group-has-[#slide-3:checked]/slides:w-10 group-has-[#slide-3:checked]/slides:bg-(--p)",
  "group-has-[#slide-4:checked]/slides:w-10 group-has-[#slide-4:checked]/slides:bg-(--p)",
];

const roundButton =
  "grid size-11 cursor-pointer place-items-center rounded-full border border-zinc-300 bg-white/90 text-zinc-800 transition-colors hover:border-(--p) hover:text-(--p-dark)";

const slider = `<section class="group/slides bg-[#faf8f4]">
${SLIDES.map((_, i) => `  <input type="radio" name="slides" id="slide-${i + 1}" class="sr-only"${i === 0 ? " checked" : ""} aria-label="Practice area ${i + 1}" />`).join("\n")}
  <div class="mx-auto max-w-6xl px-5 pt-14 md:pt-20">
    <p class="text-sm tracking-[0.2em] text-zinc-600 uppercase">Our</p>
    <h2 class="font-serif text-4xl tracking-tight text-zinc-900 md:text-5xl">Practice <span class="text-(--p-dark)">Areas</span></h2>
    <p class="mt-3 max-w-[48ch] text-zinc-600">An integrated approach to the legal matters that shape businesses, industries and communities.</p>
  </div>
  <div class="relative mx-auto mt-8 min-h-[28rem] max-w-6xl overflow-hidden md:rounded-2xl">
${SLIDES.map(
  (a, i) => `    <div class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ${SLIDE_SHOW[i]}">
      <img src="${img(a.seed, 1400, 800)}" alt="" class="absolute inset-0 size-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-r from-[#faf8f4] via-[#faf8f4]/60 to-transparent"></div>
      <div class="relative flex h-full flex-col justify-center px-5 py-10 md:px-12">
        <div class="max-w-sm border-l-2 border-(--p) pl-6">
          <p class="font-serif text-4xl text-(--p-dark)">${num(i)}</p>
          <h3 class="mt-3 font-serif text-3xl text-zinc-900">${a.title}</h3>
          <p class="mt-3 leading-relaxed text-zinc-700">${a.text}</p>
          <a href="#" class="mt-6 inline-flex items-center gap-2 rounded-md bg-(--p) px-5 py-2.5 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Explore ${icon("arrow", "size-4")}</a>
        </div>
      </div>
      <div class="absolute top-5 right-5 flex items-center gap-2">
        <label for="slide-${((i + SLIDES.length - 1) % SLIDES.length) + 1}" class="${roundButton}" aria-label="Previous area">${icon("back", "size-4")}</label>
        <label for="slide-${((i + 1) % SLIDES.length) + 1}" class="${roundButton}" aria-label="Next area">${icon("arrow", "size-4")}</label>
        <span class="ml-2 font-mono text-xs text-zinc-700">${num(i)} / ${num(SLIDES.length - 1)}</span>
      </div>
    </div>`,
).join("\n")}
  </div>
  <div class="flex justify-center gap-2 pt-5 pb-14 md:pb-20">
${SLIDES.map((a, i) => `    <label for="slide-${i + 1}" class="h-1.5 w-6 cursor-pointer rounded-full bg-zinc-300 transition-all ${SLIDE_DOT[i]}" aria-label="${a.title}"></label>`).join("\n")}
  </div>
</section>`;

// ---------------------------------------------------------------------------
//  7. Practice areas: numbered list beside a large image
// ---------------------------------------------------------------------------

const LIST_SHOW = [
  "group-has-[#area-1:checked]/areas:opacity-100",
  "group-has-[#area-2:checked]/areas:opacity-100",
  "group-has-[#area-3:checked]/areas:opacity-100",
  "group-has-[#area-4:checked]/areas:opacity-100",
  "group-has-[#area-5:checked]/areas:opacity-100",
  "group-has-[#area-6:checked]/areas:opacity-100",
  "group-has-[#area-7:checked]/areas:opacity-100",
  "group-has-[#area-8:checked]/areas:opacity-100",
  "group-has-[#area-9:checked]/areas:opacity-100",
];

const numberedList = `<section class="group/areas bg-[#faf8f4]">
  <div class="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-[minmax(0,24rem)_1fr] md:py-20">
    <div>
      <p class="text-sm tracking-[0.2em] text-zinc-600 uppercase">Our</p>
      <h2 class="font-serif text-4xl tracking-[0.04em] text-zinc-900 uppercase">Practice areas</h2>
      <span class="mt-4 block h-0.5 w-10 bg-zinc-900"></span>
      <div class="mt-6" role="radiogroup" aria-label="Practice areas">
${AREAS.map(
  (a, i) => `        <label class="flex cursor-pointer items-center gap-5 border-b border-zinc-200 py-3 text-zinc-800 transition-colors hover:text-(--p-dark) has-[:checked]:border-(--p) has-[:checked]:text-(--p-dark) has-[:focus-visible]:underline">
          <input type="radio" name="areas" id="area-${i + 1}" class="sr-only"${i === 0 ? " checked" : ""} />
          <span class="w-6 font-serif text-lg">${num(i)}</span>
          <span class="flex-1 text-sm">${a.title}</span>
          ${icon("arrow", "size-4 opacity-60")}
        </label>`,
).join("\n")}
      </div>
    </div>
    <div class="relative min-h-96 overflow-hidden rounded-2xl bg-zinc-900">
${AREAS.map(
  (a, i) => `      <div class="absolute inset-0 opacity-0 transition-opacity duration-500 ${LIST_SHOW[i]}">
        <img src="${img(a.seed, 1000, 1100)}" alt="" class="absolute inset-0 size-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/40 to-transparent"></div>
        <div class="absolute inset-x-0 bottom-0 p-8">
          <p class="font-serif text-3xl text-(--p)">${num(i)}</p>
          <h3 class="mt-1 font-serif text-3xl text-white">${a.title}</h3>
          <p class="mt-3 max-w-md leading-relaxed text-white/80">${a.text}</p>
        </div>
      </div>`,
).join("\n")}
    </div>
  </div>
</section>`;

// ---------------------------------------------------------------------------
//  8. Practice areas: a row of image cards that scrolls sideways
// ---------------------------------------------------------------------------

const cardRow = `<section class="bg-[#faf8f4]">
  <div class="mx-auto max-w-6xl px-5 py-14 md:py-20">
    <div class="text-center">
      <p class="text-sm tracking-[0.2em] text-zinc-600 uppercase">Our</p>
      <h2 class="font-serif text-4xl tracking-[0.04em] text-zinc-900 uppercase">Practice <span class="text-(--p-dark)">areas</span></h2>
      <p class="mt-2 text-zinc-600">Diverse expertise. Practical solutions.</p>
    </div>
    <ul class="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
${AREAS.map(
  (a, i) => `      <li class="flex w-64 shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <img src="${img(a.seed, 600, 400)}" alt="" class="h-36 w-full object-cover" />
        <div class="flex flex-1 flex-col p-5">
          <p class="font-serif text-(--p-dark)">${num(i)}</p>
          <h3 class="mt-1 font-serif text-lg leading-snug text-zinc-900">${a.title}</h3>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">${a.text}</p>
          <a href="#" class="mt-5 grid size-9 place-items-center rounded-full border border-(--p) text-(--p-dark) transition-colors hover:bg-(--p) hover:text-(--p-on)" aria-label="More about ${a.title}">${icon("arrow", "size-4")}</a>
        </div>
      </li>`,
).join("\n")}
    </ul>
  </div>
</section>`;

// ---------------------------------------------------------------------------
//  9. Practice areas: a 3 × 3 grid of image tiles
// ---------------------------------------------------------------------------

const tileGrid = `<section class="bg-[#faf8f4]">
  <div class="mx-auto max-w-6xl px-5 py-14 md:py-20">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-sm tracking-[0.2em] text-zinc-600 uppercase">Our</p>
        <h2 class="font-serif text-4xl tracking-[0.04em] text-zinc-900 uppercase">Practice areas</h2>
      </div>
      <p class="max-w-xs text-sm text-zinc-600">Nine key areas. One integrated approach to practical legal solutions.</p>
    </div>
    <ul class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
${AREAS.map(
  (a, i) => `      <li>
        <a href="#" class="group/tile relative block h-44 overflow-hidden rounded-lg">
          <img src="${img(a.seed, 700, 420)}" alt="" class="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover/tile:scale-110" />
          <span class="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/60 to-zinc-950/10 transition-colors group-hover/tile:from-(--p-dark)/95"></span>
          <span class="relative flex h-full flex-col justify-between p-5 text-white">
            <span>
              <span class="block font-serif text-2xl text-(--p)">${num(i)}</span>
              <span class="mt-1 block max-w-[20ch] font-serif text-lg leading-snug">${a.title}</span>
            </span>
            <span class="grid size-8 place-items-center rounded-full border border-white/60 transition-transform group-hover/tile:translate-x-1">${icon("arrow", "size-4")}</span>
          </span>
        </a>
      </li>`,
).join("\n")}
    </ul>
  </div>
</section>`;

export const SECTION_COMPONENTS: UiComponent[] = [
  {
    id: "section-approach-tabs",
    category: "sections",
    name: "Approach: tabs beside a large image",
    note: "Click a strength and the panel beside it changes. Pure CSS, no script. Stacks on a phone.",
    html: approachTabs,
  },
  {
    id: "section-vertical-timeline",
    category: "sections",
    name: "Approach: vertical timeline",
    note: "Numbered steps joined by a line, beside a photo that fades into the heading.",
    html: verticalTimeline,
  },
  {
    id: "section-horizontal-timeline",
    category: "sections",
    name: "Approach: horizontal timeline",
    note: "Five steps along a line on a laptop; on a phone the row scrolls sideways.",
    html: horizontalTimeline,
  },
  {
    id: "section-zigzag",
    category: "sections",
    name: "Approach: zigzag photo rows",
    note: "Photo and text swap sides each row. For when every point deserves its own picture.",
    html: zigzag,
  },
  {
    id: "section-bento",
    category: "sections",
    name: "Approach: photo and bento cards",
    note: "A tall photo beside five cards, three then two, with one dark card for contrast.",
    html: bento,
  },
  {
    id: "section-slider",
    category: "sections",
    name: "Practice areas: full-width slides",
    note: "One area at a time with arrows, a counter and dots. Pure CSS, no script.",
    html: slider,
  },
  {
    id: "section-numbered-list",
    category: "sections",
    name: "Practice areas: numbered list and large image",
    note: "Click an area in the list and the image beside it changes. Pure CSS, no script.",
    html: numberedList,
  },
  {
    id: "section-card-row",
    category: "sections",
    name: "Practice areas: image cards in a scrolling row",
    note: "Cards that swipe sideways, with the next one peeking in so it is clear there is more.",
    html: cardRow,
  },
  {
    id: "section-tile-grid",
    category: "sections",
    name: "Practice areas: 3 × 3 image grid",
    note: "Nine tiles; on hover the photo zooms and the shade turns to the primary colour.",
    html: tileGrid,
  },
];
