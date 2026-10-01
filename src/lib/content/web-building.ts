/**
 * What the Website tab in the admin shows before anything has been saved:
 * the lessons learned building this site, the order to build a page in, and
 * places to look at real components. Once the admin saves a list, the saved
 * one replaces the matching list here.
 */

export type WebNoteKind = "learning" | "step" | "reference";

export type WebNote = {
  id: string;
  title: string;
  body: string;
  url?: string;
};

export const WEB_NOTE_KINDS: Record<
  WebNoteKind,
  { label: string; singular: string; path: string }
> = {
  learning: { label: "Learnings", singular: "learning", path: "/admin/web" },
  step: { label: "Build steps", singular: "step", path: "/admin/web" },
  reference: {
    label: "References",
    singular: "reference",
    path: "/admin/web/references",
  },
};

export const LEARNINGS: WebNote[] = [
  {
    id: "sketch-diagrams",
    title: "Fill image slots with sketch-style diagrams",
    body: "When there is no real photo, a hand-drawn diagram explains the idea better than a stock picture or an empty box. Keep the lines rough, the labels short and the colours from the palette. The Elements tab has ready ones under Sketch diagrams.",
  },
  {
    id: "symmetry",
    title: "Keep the lines symmetrical",
    body: "Edges should line up down the page: the same left edge for headings and text, equal gaps between cards, cards in one row the same height, and the same padding on both sides. A page looks finished when its lines agree with each other.",
  },
  {
    id: "three-colours",
    title: "Three colours, each in light, medium and dark",
    body: "Primary, secondary and tertiary, and each one comes in a light shade for backgrounds, a medium shade for buttons and accents, and a dark shade for text and hover states. That is the whole palette. Pick it first in the Colours tab.",
  },
  {
    id: "use-the-width",
    title: "Use the width as much as the height",
    body: "AI-built pages stack everything in one tall column. On a wide screen, put things side by side: text beside its image, a form beside what it is for, two short lists next to each other. Stack them only on a phone.",
  },
  {
    id: "keep-references",
    title: "Look at real examples before building an element",
    body: "Before building a form, a card or a pricing table, look at screenshots or live links of good ones. Save the links under References and reuse the tested pieces in Elements instead of starting from a blank file.",
  },
];

export const STEPS: WebNote[] = [
  {
    id: "colours",
    title: "Pick the three colours",
    body: "Choose primary, secondary and tertiary in the Colours tab and check them on the sample site. Everything after this uses them.",
    url: "/admin/web/colours",
  },
  {
    id: "header",
    title: "Header",
    body: "Logo on the left, four to six links, one button on the right. One line on a laptop, a menu button on a phone.",
    url: "/admin/web/elements?category=headers",
  },
  {
    id: "hero",
    title: "Hero",
    body: "A headline of two lines at most, one sentence under it, one main button, and a real image or a sketch diagram beside it. It must fit on the first screen.",
    url: "/admin/web/elements?category=heroes",
  },
  {
    id: "footer",
    title: "Footer",
    body: "Build it straight after the hero so the page has both ends. Links grouped in columns, contact details, and the small print.",
    url: "/admin/web/elements?category=footers",
  },
  {
    id: "middle",
    title: "The sections in between",
    body: "What you do, proof that it works, prices, questions. Give each section a different layout so the page does not repeat itself.",
    url: "/admin/web/elements?category=features",
  },
  {
    id: "forms-cards",
    title: "Forms and cards",
    body: "Take them from Elements: labels above the fields, a clear error under the field that is wrong, and cards in a row the same height.",
    url: "/admin/web/elements?category=forms",
  },
  {
    id: "check",
    title: "Check it on a phone and in both themes",
    body: "Narrow the window to phone width, look for anything that overflows sideways, and switch between light and dark.",
  },
];

export const REFERENCES: WebNote[] = [
  {
    id: "component-gallery",
    title: "The Component Gallery",
    body: "One component at a time (tabs, cards, date pickers) with links to how many real design systems build it. Good for seeing what is normal before designing your own.",
    url: "https://component.gallery",
  },
  {
    id: "shadcn",
    title: "shadcn/ui",
    body: "Open-source React components you copy into the project and own. Free to use (MIT licence).",
    url: "https://ui.shadcn.com",
  },
  {
    id: "hyperui",
    title: "HyperUI",
    body: "Free Tailwind sections: forms, cards, pricing, footers, headers. MIT licence, so they can be copied with the licence notice kept.",
    url: "https://www.hyperui.dev",
  },
  {
    id: "uiverse",
    title: "Uiverse",
    body: "Community-made buttons, cards, inputs, loaders and toggles, in HTML and CSS or Tailwind. MIT licence.",
    url: "https://uiverse.io",
  },
  {
    id: "flowbite",
    title: "Flowbite blocks",
    body: "Tailwind page sections. Some are free, the larger set is paid; check which before copying.",
    url: "https://flowbite.com/blocks/",
  },
  {
    id: "tailwind-plus",
    title: "Tailwind Plus",
    body: "Tailwind's own paid component and page library. Good to look at for layout ideas; the code needs a licence to use.",
    url: "https://tailwindcss.com/plus",
  },
  {
    id: "refero",
    title: "Refero",
    body: "Screenshots of real web app screens, searchable by element: sign-up forms, settings pages, empty states, pricing.",
    url: "https://refero.design",
  },
  {
    id: "mobbin",
    title: "Mobbin",
    body: "Screenshots and flows from real web and mobile apps. Some free, the full library is paid.",
    url: "https://mobbin.com",
  },
  {
    id: "land-book",
    title: "Land-book",
    body: "A gallery of real landing pages, filterable by type of site. Good for heroes and page structure.",
    url: "https://land-book.com",
  },
  {
    id: "godly",
    title: "Godly",
    body: "Hand-picked, design-heavy websites, many with motion. Good for ideas, not for copying.",
    url: "https://godly.website",
  },
  {
    id: "realtime-colors",
    title: "Realtime Colors",
    body: "Try a palette on a real-looking site layout and export it. Same idea as our Colours tab.",
    url: "https://www.realtimecolors.com",
  },
  {
    id: "coolors",
    title: "Coolors",
    body: "Generate and browse colour palettes, then lock the colours you like and shuffle the rest.",
    url: "https://coolors.co",
  },
];

export const WEB_NOTE_DEFAULTS: Record<WebNoteKind, WebNote[]> = {
  learning: LEARNINGS,
  step: STEPS,
  reference: REFERENCES,
};
