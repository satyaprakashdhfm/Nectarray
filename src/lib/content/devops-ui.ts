/**
 * The UI / UX part of each DevOps project: the colours it was built on, the
 * fonts and the type sizes in use. Read from each project's own tokens
 * (globals.css / theme.css and the layout's font loaders), checked
 * 27 Oct 2026. Update it here when a project's theme changes.
 *
 * Colour families run light to dark, so a row reads as the colour's grade.
 */

/** Which loaded face a sample is drawn in; see components/admin/ProjectUi. */
export type Face =
  | "schibsted"
  | "source-serif"
  | "system-mono"
  | "hanken"
  | "cabin"
  | "script"
  | "inter"
  | "jetbrains-mono";

export type Swatch = { name: string; hex: string };

export type ColourFamily = {
  name: string;
  /** What the colour is for, in one line. */
  role: string;
  swatches: Swatch[];
};

export type ProjectFont = {
  name: string;
  face: Face;
  role: string;
  source: string;
  weights: string;
  note?: string;
};

export type TypeStep = {
  name: string;
  rem: number;
  weight: number;
  use: string;
};

export type ProjectUi = {
  summary: string;
  /** Where the tokens live in that project's repo. */
  tokens: string;
  primaries: ColourFamily[];
  supporting: ColourFamily[];
  fonts: ProjectFont[];
  /** The face the scale is drawn in, normally the heading face. */
  scaleFace: Face;
  scale: TypeStep[];
  rules: string[];
};

export const DEVOPS_UI: Record<string, ProjectUi> = {
  /* ------------------------------------------------------------------ */
  nectarray: {
    summary:
      "Three colours sampled from the NectArray mark (circuit blue, leaf green, amber rays) on cool near-white grounds. The marketing site is light; the dashboard and admin switch the same tokens to neutral dark greys.",
    tokens: "src/app/globals.css (@theme, then [data-ui-theme=\"dark\"])",
    primaries: [
      {
        name: "Brand blue",
        role: "Links, active tabs, the brand. Solid carries white labels at 6.2:1.",
        swatches: [
          { name: "brand-wash", hex: "#e9f6fd" },
          { name: "brand", hex: "#1fa5de" },
          { name: "brand-deep", hex: "#147fae" },
          { name: "brand-solid", hex: "#10688f" },
        ],
      },
      {
        name: "Leaf green",
        role: "Success, healthy, low risk. The mark's green.",
        swatches: [
          { name: "leaf-wash", hex: "#eefae7" },
          { name: "leaf", hex: "#7ed957" },
          { name: "leaf-deep", hex: "#4c9c2e" },
        ],
      },
      {
        name: "Amber",
        role: "Tips, warnings, medium risk. The mark's radiating rays.",
        swatches: [
          { name: "amber-wash", hex: "#fdf3e6" },
          { name: "amber", hex: "#f5a44a" },
          { name: "amber-deep", hex: "#d8801f" },
        ],
      },
    ],
    supporting: [
      {
        name: "Teal",
        role: "Fourth accent, the wordmark gradient's midpoint, so four practice cards each have a colour.",
        swatches: [
          { name: "teal-wash", hex: "#e4f6f5" },
          { name: "teal", hex: "#2bb3ad" },
          { name: "teal-deep", hex: "#17827e" },
        ],
      },
      {
        name: "Ink and grounds (light)",
        role: "Page, cards, panels, hairlines, then meta, body and heading text.",
        swatches: [
          { name: "surface", hex: "#ffffff" },
          { name: "canvas", hex: "#fbfcfc" },
          { name: "mist", hex: "#f2f6f8" },
          { name: "mist-deep", hex: "#e7eef3" },
          { name: "line", hex: "#e4eaee" },
          { name: "ink-faint", hex: "#7c8894" },
          { name: "ink-soft", hex: "#4c5a66" },
          { name: "ink", hex: "#0e1b26" },
        ],
      },
      {
        name: "Signed-in dark",
        role: "Dashboard and admin: near-greys, so the accents are the only colour on screen.",
        swatches: [
          { name: "ink", hex: "#eceef1" },
          { name: "ink-soft", hex: "#a6a9b2" },
          { name: "ink-faint", hex: "#71747d" },
          { name: "line", hex: "#2b2e35" },
          { name: "surface", hex: "#16181d" },
          { name: "mist", hex: "#101216" },
          { name: "canvas", hex: "#0b0c0e" },
        ],
      },
      {
        name: "Night and danger",
        role: "Dark marketing bands, and figures going the wrong way.",
        swatches: [
          { name: "night-line", hex: "#223644" },
          { name: "night-soft", hex: "#14232e" },
          { name: "night", hex: "#0b1720" },
          { name: "danger", hex: "#c0392b" },
        ],
      },
    ],
    fonts: [
      {
        name: "Schibsted Grotesk",
        face: "schibsted",
        role: "Everything: headings, body, admin. Headings use .display: 700, −0.032em tracking, 1.03 line height.",
        source: "Google Fonts via next/font, self-hosted by Next",
        weights: "400–900 (variable)",
      },
      {
        name: "Source Serif 4",
        face: "source-serif",
        role: "The serif counter-voice: two pull quotes below the fold.",
        source: "Google Fonts via next/font, not preloaded, upright only",
        weights: "400",
      },
      {
        name: "System mono",
        face: "system-mono",
        role: "Code, env names, IDs.",
        source: "ui-monospace, SF Mono, Cascadia Mono, Menlo",
        weights: "400–600",
      },
    ],
    scaleFace: "schibsted",
    scale: [
      { name: "Hero", rem: 4, weight: 700, use: "Home hero headline" },
      { name: "Page title", rem: 2.25, weight: 700, use: "Top of a page" },
      { name: "Section", rem: 1.5, weight: 700, use: "Admin h2, section heads" },
      { name: "Sub-section", rem: 1.25, weight: 600, use: "Smaller heads" },
      { name: "Card title", rem: 1.0625, weight: 600, use: "Cards and lists" },
      { name: "Body (site)", rem: 0.9375, weight: 400, use: "Marketing paragraphs" },
      { name: "Body (admin)", rem: 0.875, weight: 400, use: "Admin paragraphs" },
      { name: "Small", rem: 0.8125, weight: 400, use: "The most used size" },
      { name: "Meta / eyebrow", rem: 0.75, weight: 600, use: "Dates, labels; eyebrow is upper case, 0.16em" },
      { name: "Tag", rem: 0.6875, weight: 600, use: "Pills and badges" },
    ],
    rules: [
      "Components read the theme tokens (bg-canvas, text-ink, border-line), never a hex, so the dark theme is the same markup.",
      "brand blue carries white text at only 2.8:1; a solid button with a label uses brand-solid.",
      "Washes become dark tints of their accent in the dark theme, and -deep tones switch to the brighter display tone.",
    ],
  },

  /* ------------------------------------------------------------------ */
  adc: {
    summary:
      "A warm bakery: brand orange header, amber and peach bands, cream pages and brown ink instead of black. Every colour is a token in theme.css; nothing is hard-coded in a style.",
    tokens: "adc-cookies-frontend/src/app/theme.css (colours) and globals.css (type, space, radius)",
    primaries: [
      {
        name: "Brand orange",
        role: "The header band, primary buttons and the brand itself (#EF7507).",
        swatches: [
          { name: "orange-50", hex: "#FEF0E6" },
          { name: "orange-cta", hex: "#ECA87B" },
          { name: "orange-500", hex: "#EF7507" },
          { name: "orange-600", hex: "#D2620A" },
          { name: "orange-dark", hex: "#C2410C" },
          { name: "orange-800", hex: "#843E10" },
        ],
      },
      {
        name: "Amber",
        role: "Highlights, selection, badges and the warm gold sections.",
        swatches: [
          { name: "amber-50", hex: "#FEF6E6" },
          { name: "amber-100", hex: "#FDEBC2" },
          { name: "amber-200", hex: "#FBD98A" },
          { name: "amber-300", hex: "#F8C24D" },
          { name: "amber-400", hex: "#F5AE21" },
          { name: "amber-500", hex: "#F29F05" },
          { name: "amber-600", hex: "#D9890A" },
          { name: "amber-800", hex: "#8A5510" },
        ],
      },
      {
        name: "Peach and cream",
        role: "Page grounds, section bands and cards.",
        swatches: [
          { name: "cream-50", hex: "#FFFCF8" },
          { name: "cream-100", hex: "#FFF8F1" },
          { name: "peach-100", hex: "#FFF4DF" },
          { name: "cream-200", hex: "#F7ECE0" },
          { name: "vanilla", hex: "#F3E5C2" },
          { name: "peach-300", hex: "#FFCD90" },
          { name: "peach-400", hex: "#FFB76B" },
        ],
      },
    ],
    supporting: [
      {
        name: "Warm ink",
        role: "Text and dark fills: brown, never pure black.",
        swatches: [
          { name: "ink-400", hex: "#9C8676" },
          { name: "ink-500", hex: "#7A6353" },
          { name: "ink-700", hex: "#4A3525" },
          { name: "ink-800", hex: "#36251A" },
          { name: "ink-900", hex: "#2B1D12" },
          { name: "ink-950", hex: "#160D06" },
        ],
      },
      {
        name: "States",
        role: "Veg mark and success, errors and log out, teal accent, WhatsApp.",
        swatches: [
          { name: "green-50", hex: "#E7F6EE" },
          { name: "green-500", hex: "#2E9E5B" },
          { name: "red-50", hex: "#FCEAE8" },
          { name: "red-500", hex: "#E2483D" },
          { name: "teal-50", hex: "#E3F8F9" },
          { name: "teal-500", hex: "#06B1BB" },
          { name: "whatsapp", hex: "#25D366" },
        ],
      },
    ],
    fonts: [
      {
        name: "Aribau Grotesk",
        face: "hanken",
        role: "Display: every heading, 700 with −0.01em tracking.",
        source: "Emtype Foundry, self-hosted woff2 in /public/fonts",
        weights: "400, 500, 700, 900",
        note: "Trial files: buy the webfont licence before launch (same filenames, no code change). The sample here is drawn in its fallback, Hanken Grotesk.",
      },
      {
        name: "Hanken Grotesk",
        face: "hanken",
        role: "Display fallback while Aribau loads, or if it is missing.",
        source: "Google Fonts link in layout.tsx",
        weights: "400–900",
      },
      {
        name: "Cabin",
        face: "cabin",
        role: "Body text, buttons, forms, the map.",
        source: "Google Fonts link in layout.tsx",
        weights: "400, 500, 600, 700, italic 400",
      },
      {
        name: "Handwritten",
        face: "script",
        role: "Gift notes: the handwritten-card look.",
        source: "System: Segoe Script, Bradley Hand, Snell Roundhand",
        weights: "400",
      },
    ],
    scaleFace: "hanken",
    scale: [
      { name: "Display", rem: 5, weight: 800, use: "Home hero" },
      { name: "H1", rem: 3, weight: 700, use: "Page titles" },
      { name: "H2", rem: 2.25, weight: 700, use: "Section titles" },
      { name: "H3", rem: 1.625, weight: 700, use: "Card and product titles" },
      { name: "H4", rem: 1.25, weight: 700, use: "Small heads" },
      { name: "Large", rem: 1.125, weight: 400, use: "Lead paragraphs" },
      { name: "Base", rem: 1, weight: 400, use: "Body, line height 1.6" },
      { name: "Small", rem: 0.9375, weight: 400, use: "Secondary text" },
      { name: "XS", rem: 0.8125, weight: 500, use: "Captions, meta" },
      { name: "2XS", rem: 0.6875, weight: 600, use: "Eyebrows, 0.16em tracking" },
    ],
    rules: [
      "All colours in theme.css; components use roles like --surface-card and --text-strong, not raw shades.",
      "Round shapes: buttons and inputs 22px, cards 28px, sections 40px, pills full.",
      "A card is never the exact colour of the band it sits on: on peach bands it takes peach-100.",
    ],
  },

  /* ------------------------------------------------------------------ */
  "mobile-dashboard": {
    summary:
      "A shadcn-style operations dashboard: one strong blue on cool slate grounds, a deep navy sidebar, and four status colours. Dark mode swaps to navy surfaces with a brighter blue.",
    tokens: "frontend/src/app/globals.css (:root and .dark)",
    primaries: [
      {
        name: "Primary blue",
        role: "Buttons, links, focus rings, the first chart series.",
        swatches: [
          { name: "primary-soft", hex: "#e8efff" },
          { name: "accent", hex: "#eaf0fb" },
          { name: "ring", hex: "#3b82f6" },
          { name: "info", hex: "#2563eb" },
          { name: "primary", hex: "#1d4ed8" },
          { name: "primary-hover", hex: "#1e40af" },
          { name: "accent-fg", hex: "#1e3a8a" },
        ],
      },
      {
        name: "Navy",
        role: "The sidebar in both themes, and dark mode's grounds.",
        swatches: [
          { name: "sidebar-fg", hex: "#c3cde0" },
          { name: "sidebar-muted", hex: "#7d8bab" },
          { name: "dark secondary", hex: "#16233f" },
          { name: "dark card", hex: "#0f1a33" },
          { name: "sidebar", hex: "#0b1736" },
          { name: "dark background", hex: "#0a1224" },
        ],
      },
      {
        name: "Slate neutrals",
        role: "Page, cards, borders and text in light mode.",
        swatches: [
          { name: "card", hex: "#ffffff" },
          { name: "background", hex: "#f3f6fb" },
          { name: "muted", hex: "#eef2f7" },
          { name: "border", hex: "#e2e8f0" },
          { name: "input", hex: "#d6dde8" },
          { name: "muted-fg", hex: "#5b6779" },
          { name: "foreground", hex: "#0f172a" },
        ],
      },
    ],
    supporting: [
      {
        name: "Status",
        role: "Success, warning and danger, each with a soft background.",
        swatches: [
          { name: "success-soft", hex: "#e6f6f0" },
          { name: "success", hex: "#059669" },
          { name: "warning-soft", hex: "#fdf3e2" },
          { name: "warning", hex: "#d97706" },
          { name: "danger-soft", hex: "#fdecec" },
          { name: "danger", hex: "#dc2626" },
        ],
      },
      {
        name: "Charts",
        role: "Series 1 to 6, in order.",
        swatches: [
          { name: "chart-1", hex: "#1d4ed8" },
          { name: "chart-2", hex: "#3b82f6" },
          { name: "chart-3", hex: "#0ea5e9" },
          { name: "chart-4", hex: "#6366f1" },
          { name: "chart-5", hex: "#14b8a6" },
          { name: "chart-6", hex: "#f59e0b" },
        ],
      },
    ],
    fonts: [
      {
        name: "Inter",
        face: "inter",
        role: "Everything: headings, body, tables, the store.",
        source: "Google Fonts via next/font",
        weights: "400–700 (variable)",
      },
      {
        name: "JetBrains Mono",
        face: "jetbrains-mono",
        role: "IMEI numbers, invoice numbers, amounts that must line up.",
        source: "Google Fonts via next/font",
        weights: "400–600",
      },
    ],
    scaleFace: "inter",
    scale: [
      { name: "2XL", rem: 1.5, weight: 600, use: "Page titles, KPI figures" },
      { name: "XL", rem: 1.25, weight: 600, use: "Card heads" },
      { name: "LG", rem: 1.125, weight: 600, use: "Dialog titles" },
      { name: "Base", rem: 1, weight: 400, use: "Forms on the store" },
      { name: "SM", rem: 0.875, weight: 400, use: "Body and tables" },
      { name: "13px", rem: 0.8125, weight: 500, use: "Sidebar links" },
      { name: "XS", rem: 0.75, weight: 400, use: "The most used size: table cells, hints" },
      { name: "11px", rem: 0.6875, weight: 600, use: "Badges, column heads" },
      { name: "10.5px", rem: 0.65625, weight: 600, use: "Tiny labels" },
    ],
    rules: [
      "shadcn tokens (primary, muted, border, ring) mapped through @theme inline, so every component follows the theme.",
      "Radius 0.625rem base; cards and dialogs step up from it.",
      "Dense by design: xs and sm are four in five text sizes on screen.",
    ],
  },
};
