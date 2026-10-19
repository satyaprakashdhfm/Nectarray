import { useSyncExternalStore } from "react";

/**
 * The three-colour palette behind the Colours and Elements tabs.
 *
 * A palette is three base colours: primary, secondary and tertiary. Each one
 * becomes three shades: a light tint for backgrounds, the colour itself for
 * buttons and accents, and a dark shade for text and hover states. The
 * Elements previews read them as CSS variables, so a component picked there
 * is already in the chosen colours.
 */

export type Palette = { primary: string; secondary: string; tertiary: string };
export type Role = keyof Palette;

export const ROLES: {
  role: Role;
  label: string;
  prefix: string;
  /** The colour's job, in a few words. */
  job: string;
  /** Where it goes on a page. */
  uses: string[];
  /** How to use its light and dark shades, or what to avoid. */
  note: string;
}[] = [
  {
    role: "primary",
    label: "Primary",
    prefix: "p",
    job: "The main interactive colour",
    uses: [
      "Main buttons: Apply, Book now, Get started",
      "Links and the active menu item",
      "Selected tabs, pagination and toggles",
      "Key icons, focus rings and progress bars",
    ],
    note: "Its light tint marks selected backgrounds; its dark shade is the hover state.",
  },
  {
    role: "secondary",
    label: "Secondary",
    prefix: "s",
    job: "Supporting emphasis",
    uses: [
      "Second buttons and important alternative actions",
      "A featured testimonial or selected feature card",
      "Promotions, notification highlights and selected badges",
      "Small illustrations and decorative accents",
    ],
    note: "Use its pale tint for larger areas instead of filling many cards with the full colour.",
  },
  {
    role: "tertiary",
    label: "Tertiary",
    prefix: "t",
    job: "Occasional highlights",
    uses: [
      "Star ratings and achievement markers",
      "Small promotional labels and decorative icons",
      "Selected chart data and illustrations",
      "Premium indicators and special highlights",
    ],
    note: "Keep it off large amounts of text and off the background of major sections.",
  },
];

export const SHADES = [
  { key: "light", label: "Light", use: "backgrounds, tags" },
  { key: "medium", label: "Medium", use: "buttons, accents" },
  { key: "dark", label: "Dark", use: "text, hover" },
] as const;
export type Shade = (typeof SHADES)[number]["key"];

export const PRESETS: { name: string; palette: Palette }[] = [
  {
    name: "NectArray",
    palette: { primary: "#1fa5de", secondary: "#7ed957", tertiary: "#f5a44a" },
  },
  {
    name: "Cobalt and coral",
    palette: { primary: "#2546d6", secondary: "#ff6b4a", tertiary: "#f2c94c" },
  },
  {
    name: "Forest",
    palette: { primary: "#1f6f4a", secondary: "#c9a227", tertiary: "#d9583b" },
  },
  {
    name: "Terracotta and slate",
    palette: { primary: "#c4532d", secondary: "#3c5a73", tertiary: "#e8b04a" },
  },
  {
    name: "Ink and lime",
    palette: { primary: "#1d2b3a", secondary: "#8cc63f", tertiary: "#3aa7a3" },
  },
  {
    name: "Plum and mint",
    palette: { primary: "#6b2d5c", secondary: "#3fb68b", tertiary: "#f0a04b" },
  },
  {
    name: "Harbour",
    palette: { primary: "#0f6e8c", secondary: "#f25f5c", tertiary: "#ffd166" },
  },
  {
    name: "Charcoal and rose",
    palette: { primary: "#272d36", secondary: "#e8436d", tertiary: "#2ec4b6" },
  },
  // Three-colour sets: the deep, strong colour leads, the lightest is kept
  // for highlights, and the one left over supports.
  {
    name: "Saddle and tan",
    palette: { primary: "#733f2d", secondary: "#a67153", tertiary: "#d99962" },
  },
  {
    name: "Fern and lime",
    palette: { primary: "#4f772d", secondary: "#90a955", tertiary: "#ecf39e" },
  },
  {
    name: "Deep space",
    palette: { primary: "#1d3557", secondary: "#457b9d", tertiary: "#a8dadc" },
  },
  {
    name: "Ember and jasmine",
    palette: { primary: "#bf0603", secondary: "#8d0801", tertiary: "#f4d58d" },
  },
  {
    name: "Plum and cocoa",
    palette: { primary: "#402a2c", secondary: "#241715", tertiary: "#703d57" },
  },
];

export const DEFAULT_PALETTE = PRESETS[0].palette;

// ---------------------------------------------------------------------------
//  Colour maths
// ---------------------------------------------------------------------------

const HEX = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i;

export const isHex = (value: string) => HEX.test(value.trim());

export function normalHex(value: string): string {
  let h = value.trim().replace("#", "").toLowerCase();
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  return `#${h}`;
}

const rgb = (hex: string) => {
  const h = normalHex(hex).slice(1);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

const toHex = (channels: number[]) =>
  `#${channels
    .map((c) =>
      Math.round(Math.min(255, Math.max(0, c)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;

/** `amount` of the way from `a` to `b`. */
const mix = (a: string, b: string, amount: number) => {
  const [x, y] = [rgb(a), rgb(b)];
  return toHex(x.map((c, i) => c + (y[i] - c) * amount));
};

/**
 * A pale tint that keeps the colour's hue. Mixing with white greys out dark
 * colours (navy turns to grey), so the tint is drawn at a fixed lightness
 * instead, with enough saturation to still read as the colour. Greys stay
 * grey.
 */
function tint(hex: string) {
  const [r, g, b] = rgb(hex).map((c) => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  if (d < 0.04) return mix(hex, "#ffffff", 0.86);
  const sat = d / (1 - Math.abs(2 * l - 1));
  const hue =
    max === r
      ? ((g - b) / d + 6) % 6
      : max === g
        ? (b - r) / d + 2
        : (r - g) / d + 4;
  const s = Math.min(0.75, Math.max(0.4, sat));
  const L = 0.93;
  const c = (1 - Math.abs(2 * L - 1)) * s;
  const x = c * (1 - Math.abs((hue % 2) - 1));
  const [r1, g1, b1] = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][Math.floor(hue) % 6];
  const m = L - c / 2;
  return toHex([r1, g1, b1].map((v) => (v + m) * 255));
}

export function shadesOf(hex: string): Record<Shade, string> {
  const base = normalHex(hex);
  return {
    light: tint(base),
    medium: base,
    dark: mix(base, "#0b1016", 0.5),
  };
}

function luminance(hex: string) {
  const [r, g, b] = rgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

const INK = "#111418";
const PAPER = "#ffffff";

/** White or near-black, whichever reads better on `hex`. */
export const textOn = (hex: string) =>
  contrast(hex, PAPER) >= contrast(hex, INK) ? PAPER : INK;

/**
 * The palette as CSS variables: --p, --p-light, --p-dark and --p-on (the
 * text colour for --p), and the same for --s and --t.
 */
export function paletteVars(palette: Palette): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const { role, prefix } of ROLES) {
    const s = shadesOf(palette[role]);
    vars[`--${prefix}`] = s.medium;
    vars[`--${prefix}-light`] = s.light;
    vars[`--${prefix}-dark`] = s.dark;
    vars[`--${prefix}-on`] = textOn(s.medium);
  }
  return vars;
}

export function paletteCss(palette: Palette): string {
  const lines = Object.entries(paletteVars(palette)).map(
    ([k, v]) => `  ${k}: ${v};`,
  );
  return `:root {\n${lines.join("\n")}\n}`;
}

// ---------------------------------------------------------------------------
//  The chosen palette, kept in this browser
// ---------------------------------------------------------------------------

const STORE = "nectarray:web-palette";
let cachedRaw: string | null | undefined;
let cache: Palette = DEFAULT_PALETTE;
const listeners = new Set<() => void>();

function read(): Palette {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORE);
  } catch {
    return cache;
  }
  if (raw === cachedRaw) return cache;
  cachedRaw = raw;
  try {
    const parsed = raw ? (JSON.parse(raw) as Partial<Palette>) : {};
    cache = {
      primary: isHex(parsed.primary ?? "")
        ? normalHex(parsed.primary!)
        : DEFAULT_PALETTE.primary,
      secondary: isHex(parsed.secondary ?? "")
        ? normalHex(parsed.secondary!)
        : DEFAULT_PALETTE.secondary,
      tertiary: isHex(parsed.tertiary ?? "")
        ? normalHex(parsed.tertiary!)
        : DEFAULT_PALETTE.tertiary,
    };
  } catch {
    cache = DEFAULT_PALETTE;
  }
  return cache;
}

export function setPalette(next: Palette) {
  try {
    window.localStorage.setItem(STORE, JSON.stringify(next));
  } catch {
    // Storage refused: the choice lasts until the page is left.
    cache = next;
    cachedRaw = JSON.stringify(next);
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** The palette chosen on the Colours tab, shared with Elements. */
export function usePalette(): Palette {
  return useSyncExternalStore(subscribe, read, () => DEFAULT_PALETTE);
}
