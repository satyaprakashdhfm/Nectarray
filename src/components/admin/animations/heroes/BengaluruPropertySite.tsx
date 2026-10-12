"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * A property-verification home page over real Bengaluru satellite imagery.
 *
 * The camera opens on an old-map view of the city that turns into satellite
 * imagery, glides south-east past the landmarks and drops onto one real plot
 * in HSR Layout, which is outlined while the rest of the street dims. A
 * panel beside it lists the five things a check covers. Then the camera
 * pulls up fast: the city breaks into square tiles that turn into other
 * Bengaluru neighbourhoods, and it stays wide on that grid for good, with
 * slow drift and a neighbourhood outlined now and then. Last, the page's
 * own first screen arrives over it: a glassy orange header, a headline, a
 * glass search that works (localities light up their square on the map;
 * services point to their card), quick links, three service cards fanned
 * out with a dark curve cutting across them, and reviews under the curve.
 *
 * The imagery is live map tiles from Esri's World Imagery, so it is real and
 * sharp at any size; the credit line in the corner is part of their terms.
 * The orange is --p.
 */

// ---------------------------------------------------------------------------
//  Map tiles: world pixels at zoom 19, Esri's tile services
// ---------------------------------------------------------------------------

const LAYERS = {
  imagery:
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile",
  streets:
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile",
};
type Layer = keyof typeof LAYERS;

/** A latitude and longitude as world pixels at zoom 19. */
function world(lat: number, lon: number): [number, number] {
  const n = 256 * 2 ** 19;
  const r = (lat * Math.PI) / 180;
  return [
    ((lon + 180) / 360) * n,
    ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n,
  ];
}

type Tile = { img: HTMLImageElement; ready: boolean };
const cache = new Map<string, Tile>();

function tile(layer: Layer, z: number, x: number, y: number): Tile {
  const key = `${layer}/${z}/${x}/${y}`;
  let t = cache.get(key);
  if (!t) {
    const img = new Image();
    const entry: Tile = { img, ready: false };
    img.decoding = "async";
    img.onload = () => {
      entry.ready = true;
    };
    img.src = `${LAYERS[layer]}/${z}/${y}/${x}`;
    cache.set(key, entry);
    t = entry;
  }
  return t;
}

type View = { x: number; y: number; z: number };
type Rect = { x: number; y: number; w: number; h: number };

/** The tiles that cover a rectangle of the screen, at the zoom that suits it. */
function tilesFor(view: View, W: number, H: number, area?: Rect) {
  const s = 2 ** (view.z - 19);
  const tz = Math.max(3, Math.min(19, Math.round(view.z + 0.25)));
  const span = 256 * 2 ** (19 - tz);
  const r = area ?? { x: 0, y: 0, w: W, h: H };
  const wx0 = view.x + (r.x - W / 2) / s;
  const wy0 = view.y + (r.y - H / 2) / s;
  return {
    s,
    tz,
    span,
    x0: Math.floor(wx0 / span),
    y0: Math.floor(wy0 / span),
    x1: Math.floor((wx0 + r.w / s) / span),
    y1: Math.floor((wy0 + r.h / s) / span),
  };
}

function prefetch(layer: Layer, view: View, W: number, H: number) {
  const { tz, x0, y0, x1, y1 } = tilesFor(view, W, H);
  for (let x = x0; x <= x1; x++)
    for (let y = y0; y <= y1; y++) tile(layer, tz, x, y);
}

/**
 * Draws the map for a view, clipped to `area`. A tile still loading is
 * covered by the nearest loaded tile above it, stretched, so the picture
 * sharpens rather than flashing blank.
 */
function drawMap(
  ctx: CanvasRenderingContext2D,
  layer: Layer,
  view: View,
  W: number,
  H: number,
  area?: Rect,
) {
  const { s, tz, span, x0, y0, x1, y1 } = tilesFor(view, W, H, area);
  if ((x1 - x0 + 1) * (y1 - y0 + 1) > 600) return;
  ctx.save();
  if (area) {
    ctx.beginPath();
    ctx.rect(area.x, area.y, area.w, area.h);
    ctx.clip();
  }
  const size = span * s;
  for (let tx = x0; tx <= x1; tx++) {
    for (let ty = y0; ty <= y1; ty++) {
      const dx = W / 2 + (tx * span - view.x) * s;
      const dy = H / 2 + (ty * span - view.y) * s;
      const t = tile(layer, tz, tx, ty);
      if (t.ready) {
        ctx.drawImage(t.img, dx, dy, size + 0.6, size + 0.6);
        continue;
      }
      for (let k = 1; k <= 7 && tz - k >= 3; k++) {
        const parent = cache.get(`${layer}/${tz - k}/${tx >> k}/${ty >> k}`);
        if (!parent?.ready) continue;
        const sub = 256 / 2 ** k;
        ctx.drawImage(
          parent.img,
          (tx - ((tx >> k) << k)) * sub,
          (ty - ((ty >> k) << k)) * sub,
          sub,
          sub,
          dx,
          dy,
          size + 0.6,
          size + 0.6,
        );
        break;
      }
    }
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------
//  The place: one real plot in HSR Layout, and the city around it
// ---------------------------------------------------------------------------

/** The plot's corners, traced from the imagery (zoom-19 world pixels). */
const PLOT: [number, number][] = [
  [96054678, 62253675],
  [96054727, 62253676],
  [96054727, 62253755],
  [96054678, 62253755],
];
const PLOT_C: [number, number] = [96054702.5, 62253715];
const CITY = world(12.9745, 77.6005);

const LANDMARKS: { name: string; at: [number, number] }[] = [
  { name: "Cubbon Park", at: world(12.9763, 77.5929) },
  { name: "MG Road", at: world(12.9756, 77.6066) },
  { name: "Ulsoor Lake", at: world(12.9822, 77.6197) },
  { name: "Lalbagh", at: world(12.9507, 77.5848) },
  { name: "Indiranagar", at: world(12.9719, 77.6412) },
  { name: "Koramangala", at: world(12.9352, 77.6245) },
  { name: "Bellandur Lake", at: world(12.9359, 77.6667) },
  { name: "Agara Lake", at: world(12.9234, 77.6436) },
  { name: "HSR Layout", at: world(12.9116, 77.6389) },
];

/** One grid square is one zoom-18 tile: about 140 m across. */
const CELL = 512;
const GX = 10;
const GY = 5;

/** Named neighbourhoods placed near the middle of the grid, for search. */
const PLACES: { name: string; lat: number; lon: number }[] = [
  { name: "Koramangala", lat: 12.9352, lon: 77.6245 },
  { name: "Indiranagar", lat: 12.9719, lon: 77.6412 },
  { name: "Jayanagar", lat: 12.9308, lon: 77.5838 },
  { name: "Whitefield", lat: 12.9698, lon: 77.75 },
  { name: "Electronic City", lat: 12.8452, lon: 77.6602 },
  { name: "JP Nagar", lat: 12.9063, lon: 77.5857 },
  { name: "Malleshwaram", lat: 13.0035, lon: 77.571 },
  { name: "Hebbal", lat: 13.0358, lon: 77.597 },
  { name: "Yelahanka", lat: 13.1007, lon: 77.5963 },
  { name: "Banashankari", lat: 12.9255, lon: 77.5468 },
  { name: "BTM Layout", lat: 12.9166, lon: 77.6101 },
  { name: "Marathahalli", lat: 12.9569, lon: 77.7011 },
  { name: "Bellandur", lat: 12.9304, lon: 77.6784 },
  { name: "Rajajinagar", lat: 12.9915, lon: 77.5525 },
  { name: "Basavanagudi", lat: 12.9406, lon: 77.5738 },
  { name: "Sadashivanagar", lat: 13.0068, lon: 77.5813 },
  { name: "Frazer Town", lat: 12.9988, lon: 77.6156 },
  { name: "Hennur", lat: 13.0358, lon: 77.6431 },
  { name: "Kanakapura Road", lat: 12.878, lon: 77.545 },
  { name: "Bannerghatta Road", lat: 12.888, lon: 77.597 },
  { name: "Sarjapur Road", lat: 12.9105, lon: 77.6862 },
  { name: "Devanahalli", lat: 13.2437, lon: 77.712 },
];

function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Cell = { i: number; j: number; tx: number; ty: number; name?: string };

/**
 * Every square of the grid but the middle one, each a zoom-18 tile from
 * somewhere else in Bengaluru: the named places nearest the middle, so they
 * are on screen, and random spots across the city for the rest.
 */
const CELLS: Cell[] = (() => {
  const r = seeded(560102);
  const spots: Cell[] = [];
  for (let i = -GX; i <= GX; i++)
    for (let j = -GY; j <= GY; j++)
      if (i || j) spots.push({ i, j, tx: 0, ty: 0 });
  spots.sort((a, b) => Math.hypot(a.i, a.j * 1.4) - Math.hypot(b.i, b.j * 1.4));
  let named = 0;
  spots.forEach((c, k) => {
    let lat: number;
    let lon: number;
    if (k % 2 === 1 && named < PLACES.length) {
      const p = PLACES[named++];
      c.name = p.name;
      lat = p.lat;
      lon = p.lon;
    } else {
      lat = 12.86 + r() * 0.2;
      lon = 77.52 + r() * 0.22;
    }
    const [x, y] = world(lat, lon);
    c.tx = Math.floor(x / CELL);
    c.ty = Math.floor(y / CELL);
  });
  return spots;
})();
const SELECTED_NAME = "HSR Layout";

// ---------------------------------------------------------------------------
//  The timeline, in seconds
// ---------------------------------------------------------------------------

const T = {
  glide: 5,
  outline: 3.7,
  info: 5.3,
  firstItem: 5.9,
  itemGap: 0.75,
  out: 10,
  panel: 12.6,
  grid: 13.6,
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const smooth = (u: number) => u * u * (3 - 2 * u);
const easeInOut = (u: number) =>
  u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2;
const easeSpeed = (u: number) =>
  (u < 0.5 ? 12 * u * u : 3 * (-2 * u + 2) ** 2) / 3;

/** Where the plot sits on screen while it is looked at, and at the end. */
function anchors(W: number, H: number) {
  const wide = W >= 768;
  return {
    plot: { x: wide ? W * 0.34 : W * 0.5, y: wide ? H * 0.55 : H * 0.3 },
    rest: { x: wide ? W * 0.82 : W * 0.5, y: wide ? H * 0.42 : H * 0.5 },
  };
}

function farZoom(W: number, H: number) {
  return 19 + Math.log2(Math.max(W / 12.5, H / 7.2) / CELL);
}

/** The camera at time t (before any panning the visitor asked for). */
function cameraAt(t: number, W: number, H: number) {
  const { plot, rest } = anchors(W, H);
  const at = (z: number, focus: { x: number; y: number }, amount = 1) => {
    const s = 2 ** (z - 19);
    return {
      x: PLOT_C[0] - ((focus.x - W / 2) / s) * amount,
      y: PLOT_C[1] - ((focus.y - H / 2) / s) * amount,
    };
  };
  if (t < T.glide) {
    const u = t / T.glide;
    const z = lerp(12.2, 18.5, smooth(u));
    const toward = 1 - (1 - u) ** 3;
    const aim = at(z, plot, smooth(clamp((u - 0.5) / 0.5)));
    return {
      x: lerp(CITY[0], aim.x, toward),
      y: lerp(CITY[1], aim.y, toward),
      z,
      blur: 0,
    };
  }
  if (t < T.out) {
    const u = (t - T.glide) / (T.out - T.glide);
    const z = lerp(18.5, 19.6, 1 - (1 - u) ** 2);
    return { ...at(z, plot), z, blur: 0 };
  }
  const far = farZoom(W, H);
  if (t < T.grid) {
    const u = (t - T.out) / (T.grid - T.out);
    const e = easeInOut(u);
    const z = lerp(19.6, far, e);
    const focus = { x: lerp(plot.x, rest.x, e), y: lerp(plot.y, rest.y, e) };
    return { ...at(z, focus), z, blur: easeSpeed(u) };
  }
  return { ...at(far, rest), z: far, blur: 0 };
}

// ---------------------------------------------------------------------------
//  Copy
// ---------------------------------------------------------------------------

const CHECKS = [
  { name: "Ownership & Title", note: "Sale deeds and the chain of title" },
  { name: "Encumbrances", note: "Mortgages, liens and EC entries" },
  { name: "Property Records", note: "Khata, RTC and tax receipts" },
  { name: "Approvals & Compliance", note: "Plan sanction, OC and conversion" },
  { name: "Boundaries & Land Extent", note: "Survey sketch against the site" },
];

type Service = {
  id: string;
  title: string;
  body: string;
  href: string;
  keywords: string[];
  icon: React.ReactNode;
};

const SERVICES: Service[] = [
  {
    id: "records",
    title: "Property Records & Documents",
    body: "Find relevant property records, maps and documents.",
    href: "#records",
    keywords: [
      "record",
      "document",
      "map",
      "khata",
      "rtc",
      "pahani",
      "ec",
      "encumbrance certificate",
      "sale deed",
      "tax",
    ],
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </>
    ),
  },
  {
    id: "verification",
    title: "Property Verification",
    body: "Review ownership, encumbrances and property-related records.",
    href: "#verification",
    keywords: [
      "verif",
      "owner",
      "title",
      "encumbrance",
      "check",
      "due diligence",
      "lien",
      "mortgage",
    ],
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    id: "legal",
    title: "Legal Assistance",
    body: "Get professional help with title checks, approvals and property documentation.",
    href: "#legal",
    keywords: [
      "legal",
      "lawyer",
      "advocate",
      "approval",
      "registration",
      "khata transfer",
      "agreement",
      "dispute",
    ],
    icon: (
      <>
        <path d="M12 3v18M7 21h10M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1zM2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z" />
      </>
    ),
  },
];

const POPULAR = [
  "Khata transfer",
  "Encumbrance certificate",
  "Sale deed",
  "RTC / Pahani",
];

type Suggestion =
  | { kind: "place"; label: string; cell: number | "selected" }
  | { kind: "service"; label: string; service: string }
  | { kind: "survey"; label: string };

function suggest(query: string): Suggestion[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: Suggestion[] = [];
  if (SELECTED_NAME.toLowerCase().includes(q))
    out.push({ kind: "place", label: SELECTED_NAME, cell: "selected" });
  CELLS.forEach((c, i) => {
    if (c.name?.toLowerCase().includes(q))
      out.push({ kind: "place", label: c.name, cell: i });
  });
  for (const s of SERVICES) {
    if (
      s.title.toLowerCase().includes(q) ||
      s.keywords.some((k) => k.includes(q) || q.includes(k))
    )
      out.push({ kind: "service", label: s.title, service: s.id });
  }
  if (/\d/.test(q))
    out.push({ kind: "survey", label: `Survey number ${query.trim()}` });
  return out.slice(0, 7);
}

const Icon = ({
  children,
  className = "size-5",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {children}
  </svg>
);

const SEARCH_ICON = (
  <>
    <circle cx="11" cy="11" r="7.5" />
    <path d="m20.5 20.5-4-4" />
  </>
);

/**
 * The proof under the curve. Placeholders: put the firm's own review,
 * rating and wording here before it goes live.
 */
const PROOF = {
  quote:
    "We had the khata and EC checked before paying the advance. Clear answers, in plain English, within the week.",
  by: "a home buyer in Whitefield",
  link: "#reviews",
  rating: "4.8",
  count: "From our clients on Google",
  badgeTop: "Property checks",
  badge: "By practising advocates",
  badgeYear: "Bengaluru",
};

/** The fan: left card tipped back, middle one upright and in front. */
const CARD_TILT = [
  "@3xl:mt-16 @3xl:-rotate-6 @3xl:origin-bottom-right",
  "relative z-10",
  "@3xl:mt-16 @3xl:rotate-6 @3xl:origin-bottom-left",
];

/** A small picture in each card, mostly hidden by the curve. */
const CARD_ART = [
  <span key="records" className="flex gap-2">
    {["EC", "Khata", "RTC"].map((d) => (
      <span
        key={d}
        className="flex h-16 w-14 flex-col justify-between rounded-md border border-zinc-200 bg-white p-1.5 text-[0.625rem] font-semibold text-zinc-500 shadow-sm"
      >
        <span className="h-1 w-8 rounded bg-zinc-200" />
        {d}
      </span>
    ))}
  </span>,
  <span
    key="verification"
    className="block rounded-xl border border-zinc-200 bg-white p-3 shadow-sm"
  >
    {["Title chain", "Encumbrances", "Approvals"].map((d) => (
      <span
        key={d}
        className="flex items-center gap-2 py-0.5 text-xs text-zinc-600"
      >
        <span className="grid size-4 place-items-center rounded-full bg-(--p-light) text-(--p-dark)">
          <Icon className="size-2.5">
            <path d="m5 12 5 5 9-10" />
          </Icon>
        </span>
        {d}
      </span>
    ))}
  </span>,
  <span
    key="legal"
    className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm"
  >
    <span className="grid size-9 place-items-center rounded-full bg-(--p) text-xs font-semibold text-(--p-on)">
      Adv
    </span>
    <span className="text-xs leading-snug text-zinc-600">
      An advocate on your file,
      <br />
      from first record to registration
    </span>
  </span>,
];

const STAR =
  "m10 1.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z";

function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`flex gap-0.5 text-[#f6b93b] ${className}`} aria-hidden>
      {[0, 1, 2, 3].map((k) => (
        <svg key={k} viewBox="0 0 20 20" className="size-4" fill="currentColor">
          <path d={STAR} />
        </svg>
      ))}
      <svg viewBox="0 0 20 20" className="size-4">
        <path d={STAR} fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M10 1.5v13.4l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

/** A laurel branch, drawn leaf by leaf round an arc. */
function Laurel({ flip = false }: { flip?: boolean }) {
  // Rounded, so the server and the browser write the same numbers.
  const round = (n: number) => Math.round(n * 10) / 10;
  const at = (deg: number, out = 0) => {
    const a = (deg * Math.PI) / 180;
    return {
      x: round(52 + Math.cos(a) * (40 + out)),
      y: round(52 + Math.sin(a) * (44 + out)),
    };
  };
  const stem = Array.from({ length: 30 }, (_, k) => at(104 + k * 5));
  // A pair of leaves at each step, one either side of the stem, leaning
  // towards the tip at the top.
  const leaves = Array.from({ length: 8 }, (_, k) => 112 + k * 18).flatMap(
    (deg) =>
      [-1, 1].map((side) => ({
        ...at(deg, side * 5),
        r: Math.round(deg + 90 - side * 32),
      })),
  );
  return (
    <svg
      viewBox="0 0 60 104"
      className={`h-24 w-14 shrink-0 text-white ${flip ? "-scale-x-100" : ""}`}
      aria-hidden
    >
      <polyline
        points={stem.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {leaves.map((l, k) => (
        <ellipse
          key={k}
          cx={l.x}
          cy={l.y}
          rx="7"
          ry="2.6"
          fill="currentColor"
          transform={`rotate(${l.r} ${l.x} ${l.y})`}
        />
      ))}
    </svg>
  );
}

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" className="size-9" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.5z"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
//  The component
// ---------------------------------------------------------------------------

export function BengaluruPropertySite({
  brand = "LegallyYours",
  searchAction,
  onSearch,
}: {
  brand?: string;
  /** Where the search form goes (GET, as ?q=). Without it, it searches the map. */
  searchAction?: string;
  onSearch?: (query: string) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const infoRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const clockRef = useRef(0);
  const pinRef = useRef<number | "selected" | null>(null);
  const reduce = useReducedMotion();

  const [items, setItems] = useState(0);
  const [infoOn, setInfoOn] = useState(false);
  const [panelUp, setPanelUp] = useState(false);
  const [intro, setIntro] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [message, setMessage] = useState("");
  const [service, setService] = useState<string | null>(null);
  const suggestions = useMemo(() => suggest(query), [query]);

  const skip = () => {
    clockRef.current = Math.max(clockRef.current, T.grid);
  };

  const choose = (s: Suggestion) => {
    setOpen(false);
    setQuery(s.kind === "survey" ? query : s.label);
    if (s.kind === "place") {
      pinRef.current = s.cell;
      setService(null);
      setMessage(
        `${s.label} is outlined on the map. Tell us the property and we will check its records for you.`,
      );
    } else if (s.kind === "service") {
      pinRef.current = null;
      setService(s.service);
      setMessage(
        `${s.label}: see the card below, or start a request with Get Started.`,
      );
    } else {
      pinRef.current = null;
      setService(null);
      setMessage(
        `We will look up ${s.label.toLowerCase()} in the land records and tell you what they show.`,
      );
    }
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    const q = query.trim();
    if (!q) {
      e.preventDefault();
      inputRef.current?.focus();
      return;
    }
    onSearch?.(q);
    if (searchAction) return;
    e.preventDefault();
    const s = suggestions[open ? active : 0];
    if (s) choose(s);
    else {
      pinRef.current = null;
      setService(null);
      setOpen(false);
      setMessage(
        `Nothing on the map matches "${q}". Our team can still find it: start with Get Started.`,
      );
    }
  };

  const pickPopular = (label: string) => {
    const s = suggest(label)[0];
    if (s) choose(s);
    setQuery(label);
  };

  useEffect(() => {
    const section = stageRef.current;
    const cnv = canvasRef.current;
    const ctx = cnv?.getContext("2d");
    if (!section || !cnv || !ctx) return;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let accent = "#d9733b";
    const readColours = () => {
      accent =
        getComputedStyle(section).getPropertyValue("--p").trim() || accent;
    };

    // What the page has told React, so it is only told about changes.
    let sentItems = -1;
    let sentInfo = false;
    let sentPanel = false;
    let sentIntro = true;
    const report = (t: number) => {
      const n = clamp(Math.floor((t - T.firstItem) / T.itemGap) + 1, 0, 5);
      if (n !== sentItems) setItems((sentItems = n));
      const info = t >= T.info && t < T.out + 0.2;
      if (info !== sentInfo) setInfoOn((sentInfo = info));
      const panel = t >= T.panel;
      if (panel !== sentPanel) setPanelUp((sentPanel = panel));
      const inIntro = t < T.grid;
      if (inIntro !== sentIntro) setIntro((sentIntro = inIntro));
    };

    const toScreen = (v: View, x: number, y: number) => {
      const s = 2 ** (v.z - 19);
      return [W / 2 + (x - v.x) * s, H / 2 + (y - v.y) * s] as const;
    };

    const cellRect = (v: View, i: number, j: number): Rect => {
      const s = 2 ** (v.z - 19);
      const [x, y] = toScreen(
        v,
        PLOT_C[0] - CELL / 2 + i * CELL,
        PLOT_C[1] - CELL / 2 + j * CELL,
      );
      return { x, y, w: CELL * s, h: CELL * s };
    };

    const swapAt = (i: number, j: number, g: number) =>
      clamp((g * 1.7 - 0.2 - Math.hypot(i, j) * 0.075) / 0.35);

    const plotPath = (v: View) => {
      ctx.beginPath();
      PLOT.forEach(([x, y], k) => {
        const [sx, sy] = toScreen(v, x, y);
        if (k) ctx.lineTo(sx, sy);
        else ctx.moveTo(sx, sy);
      });
      ctx.closePath();
    };

    const label = (text: string, x: number, y: number, strong = false) => {
      ctx.font = `600 ${strong ? 12 : 11}px ui-sans-serif, system-ui, sans-serif`;
      const w = ctx.measureText(text).width + 14;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.25)";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "rgba(253,248,241,0.94)";
      ctx.beginPath();
      ctx.roundRect(x, y, w, 20, 10);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = "#2a2420";
      ctx.fillText(text, x + 7, y + 14);
    };

    /*
     * Every square of the grid in one canvas, at a tile's full 256 px, each
     * painted in once as its tile arrives. A frame then draws the grid from
     * this one image: drawing hundreds of separate images every frame makes
     * the GPU upload each of them again, which brought it to a crawl.
     */
    const A = 192;
    const atlas = document.createElement("canvas");
    let atlasCtx: CanvasRenderingContext2D | null = null;
    const painted = new Set<number>();
    const fillAtlas = () => {
      if (!atlasCtx) {
        atlas.width = (2 * GX + 1) * A;
        atlas.height = (2 * GY + 1) * A;
        atlasCtx = atlas.getContext("2d");
        if (!atlasCtx) return;
        atlasCtx.fillStyle = "#3a332d";
        atlasCtx.fillRect(0, 0, atlas.width, atlas.height);
      }
      const a = atlasCtx;
      CELLS.forEach((c, k) => {
        if (painted.has(k)) return;
        const img = tile("imagery", 18, c.tx, c.ty);
        if (!img.ready) return;
        a.drawImage(img.img, (c.i + GX) * A, (c.j + GY) * A, A, A);
        painted.add(k);
      });
      if (!painted.has(-1)) {
        // The middle square: the map around the plot, at zoom 18.
        const middle: View = { x: PLOT_C[0], y: PLOT_C[1], z: 18 };
        const area = { x: GX * A, y: GY * A, w: A, h: A };
        drawMap(a, "imagery", middle, atlas.width, atlas.height, area);
        const { tz, x0, y0, x1, y1 } = tilesFor(
          middle,
          atlas.width,
          atlas.height,
          area,
        );
        let ready = true;
        for (let x = x0; x <= x1; x++)
          for (let y = y0; y <= y1; y++)
            ready &&= tile("imagery", tz, x, y).ready;
        if (ready) painted.add(-1);
      }
    };

    /** Everything that moves with the camera. */
    const drawScene = (t: number, v: View) => {
      const g = clamp((t - T.out) / (T.grid - T.out));
      const old = 1 - smooth(clamp((t - 0.7) / 2.3));
      const swapped = g >= 1;
      const s = 2 ** (v.z - 19);

      if (!swapped) {
        if (old > 0.01) {
          // An old paper map first: the street map, greyed and warmed.
          drawMap(ctx, "streets", v, W, H);
          ctx.globalCompositeOperation = "saturation";
          ctx.fillStyle = "hsl(0,0%,50%)";
          ctx.fillRect(0, 0, W, H);
          ctx.globalCompositeOperation = "multiply";
          ctx.fillStyle = "#e7d2ad";
          ctx.fillRect(0, 0, W, H);
          ctx.globalCompositeOperation = "source-over";
        }
        ctx.globalAlpha = 1 - old;
        drawMap(ctx, "imagery", v, W, H);
        ctx.globalAlpha = 1;
      } else {
        drawMap(ctx, "imagery", v, W, H, cellRect(v, 0, 0));
      }

      if (g > 0) {
        const left = Math.max(
          -GX,
          Math.floor((v.x - W / 2 / s - PLOT_C[0] + CELL / 2) / CELL),
        );
        const right = Math.min(
          GX,
          Math.floor((v.x + W / 2 / s - PLOT_C[0] + CELL / 2) / CELL),
        );
        const top = Math.max(
          -GY,
          Math.floor((v.y - H / 2 / s - PLOT_C[1] + CELL / 2) / CELL),
        );
        const bottom = Math.min(
          GY,
          Math.floor((v.y + H / 2 / s - PLOT_C[1] + CELL / 2) / CELL),
        );
        for (const c of CELLS) {
          if (c.i < left || c.i > right || c.j < top || c.j > bottom) continue;
          const p = swapAt(c.i, c.j, g);
          if (p <= 0) continue;
          const r = cellRect(v, c.i, c.j);
          ctx.globalAlpha = p;
          if (atlasCtx) {
            const sx = (c.i + GX) * A;
            const sy = (c.j + GY) * A;
            ctx.drawImage(atlas, sx, sy, A, A, r.x, r.y, r.w + 0.5, r.h + 0.5);
          } else {
            ctx.fillStyle = "#3a332d";
            ctx.fillRect(r.x, r.y, r.w, r.h);
          }
        }
        ctx.globalAlpha = 1;
        // The gutters between squares.
        const line = clamp((g - 0.05) / 0.35);
        if (line > 0) {
          const w = Math.max(1.5, CELL * s * 0.04) * line;
          ctx.fillStyle = "#16120f";
          for (let i = left; i <= right + 1; i++) {
            const [x] = toScreen(v, PLOT_C[0] - CELL / 2 + i * CELL, 0);
            ctx.fillRect(x - w / 2, 0, w, H);
          }
          for (let j = top; j <= bottom + 1; j++) {
            const [, y] = toScreen(v, 0, PLOT_C[1] - CELL / 2 + j * CELL);
            ctx.fillRect(0, y - w / 2, W, w);
          }
        }
      }
    };

    /** The overlays drawn once per frame, on top of the scene. */
    const drawMarks = (t: number, v: View) => {
      const g = clamp((t - T.out) / (T.grid - T.out));
      const s = 2 ** (v.z - 19);

      // Landmarks while the camera is high.
      const marks = clamp((t - 0.9) / 0.8) * clamp((16.6 - v.z) / 0.9);
      if (marks > 0) {
        ctx.save();
        ctx.globalAlpha = marks;
        ctx.font = "600 12px ui-sans-serif, system-ui, sans-serif";
        for (const m of LANDMARKS) {
          const [x, y] = toScreen(v, m.at[0], m.at[1]);
          if (x < -80 || x > W + 80 || y < -40 || y > H + 40) continue;
          ctx.fillStyle = accent;
          ctx.strokeStyle = "rgba(255,255,255,0.95)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.shadowColor = "rgba(0,0,0,0.85)";
          ctx.shadowBlur = 6;
          ctx.fillStyle = "#fff";
          ctx.fillText(m.name, x + 9, y + 4);
          ctx.shadowBlur = 0;
        }
        ctx.restore();
      }

      // The street dims around the plot while it is looked at.
      const dim = 0.5 * smooth(clamp((t - 4.1) / 0.9)) * (1 - clamp(g / 0.3));
      if (dim > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, W, H);
        PLOT.forEach(([x, y], k) => {
          const [sx, sy] = toScreen(v, x, y);
          if (k) ctx.lineTo(sx, sy);
          else ctx.moveTo(sx, sy);
        });
        ctx.closePath();
        ctx.fillStyle = `rgba(20,15,11,${dim})`;
        ctx.fill("evenodd");
        ctx.restore();
      }

      // The plot's outline, drawn round once, then kept.
      const drawn = smooth(clamp((t - T.outline) / 1.2));
      if (drawn > 0) {
        const perimeter = PLOT.reduce((sum, [x, y], k) => {
          const [nx, ny] = PLOT[(k + 1) % PLOT.length];
          return sum + Math.hypot(nx - x, ny - y) * s;
        }, 0);
        ctx.save();
        plotPath(v);
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.14 * drawn;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.setLineDash([perimeter * drawn, perimeter]);
        ctx.strokeStyle = accent;
        ctx.lineWidth = Math.max(1.2, Math.min(2.5, s * 2));
        ctx.shadowColor = accent;
        ctx.shadowBlur = 14;
        ctx.stroke();
        ctx.restore();
      }

      // A fine line from the plot to the panel beside it.
      const link = clamp((t - T.info) / 0.5) * (1 - clamp((t - T.out) / 0.4));
      const info = infoRef.current;
      if (link > 0 && info) {
        const box = info.getBoundingClientRect();
        const home = section.getBoundingClientRect();
        const wide = W >= 768;
        const [px, py] = toScreen(v, PLOT[1][0], (PLOT[1][1] + PLOT[2][1]) / 2);
        const [bx, by] = toScreen(v, (PLOT[2][0] + PLOT[3][0]) / 2, PLOT[2][1]);
        const from = wide ? { x: px, y: py } : { x: bx, y: by };
        const to = wide
          ? { x: box.left - home.left, y: box.top - home.top + 34 }
          : { x: box.left - home.left + 28, y: box.top - home.top };
        const mid = wide
          ? { x: lerp(from.x, to.x, 0.45), y: from.y }
          : { x: from.x, y: lerp(from.y, to.y, 0.5) };
        ctx.save();
        ctx.globalAlpha = link;
        ctx.strokeStyle = accent;
        ctx.fillStyle = accent;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(mid.x, mid.y);
        ctx.lineTo(wide ? mid.x : to.x, wide ? to.y : mid.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        for (const p of [from, to]) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (g < 0.9) return;
      const settle = clamp((g - 0.9) / 0.1);
      const outline = (r: Rect, alpha: number, width = 1.6) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = accent;
        ctx.lineWidth = width;
        ctx.shadowColor = accent;
        ctx.shadowBlur = 10;
        ctx.strokeRect(r.x + 1, r.y + 1, r.w - 2, r.h - 2);
        ctx.restore();
      };

      // The selected plot's square stays marked.
      const home = cellRect(v, 0, 0);
      outline(home, settle, 2);
      const pin = pinRef.current;
      // Phones have words over the middle of the map, so just the outline there.
      if (
        W >= 768 &&
        t > T.grid + 0.3 &&
        (pin === null || pin === "selected")
      ) {
        ctx.globalAlpha = clamp((t - T.grid - 0.3) / 0.5);
        label(`${SELECTED_NAME} · selected plot`, home.x + 6, home.y + 6, true);
        ctx.globalAlpha = 1;
      }

      // A neighbourhood outlined now and then, or the one searched for.
      if (pin !== null && pin !== "selected") {
        const c = CELLS[pin];
        const r = cellRect(v, c.i, c.j);
        outline(r, 1, 2);
        label(c.name ?? "", r.x + 6, r.y + 6, true);
      } else if (t > T.grid + 1) {
        const named = CELLS.filter((c) => c.name);
        const k = Math.floor((t - T.grid - 1) / 3.2);
        const phase = (t - T.grid - 1) % 3.2;
        const c = named[(k * 7) % named.length];
        const r = cellRect(v, c.i, c.j);
        const a = clamp(phase / 0.5) * (1 - clamp((phase - 2.4) / 0.7));
        // Only where no words sit over the map, and not on phones.
        const clear =
          W >= 768 &&
          (r.x > W * 0.72 || r.x + r.w < W * 0.28) &&
          r.x > 0 &&
          r.x + r.w < W &&
          r.y > 90 &&
          r.y + r.h < H * 0.66;
        if (a > 0 && clear) {
          outline(r, a * 0.85);
          ctx.globalAlpha = a;
          label(c.name ?? "", r.x + 6, r.y + 6);
          ctx.globalAlpha = 1;
        }
      }
    };

    // The visitor's pan towards a searched place, eased.
    const pan = { x: 0, y: 0 };
    const panTarget = (v: View) => {
      const pin = pinRef.current;
      if (pin === null) return { x: 0, y: 0 };
      const s = 2 ** (v.z - 19);
      const c = pin === "selected" ? { i: 0, j: 0 } : CELLS[pin];
      // Into the clearing right of the words; phones have none, so stay.
      if (W < 768) return { x: 0, y: 0 };
      const want = anchors(W, H).rest;
      const [cx, cy] = toScreen(
        v,
        PLOT_C[0] + c.i * CELL,
        PLOT_C[1] + c.j * CELL,
      );
      // How far the view can move before the grid's edge shows.
      const roomX = Math.max(0, (GX + 0.5) * CELL - W / 2 / s);
      const roomY = Math.max(0, (GY + 0.5) * CELL - H / 2 / s);
      const baseX = v.x - PLOT_C[0];
      const baseY = v.y - PLOT_C[1];
      return {
        x: clamp((cx - want.x) / s, -roomX - baseX, roomX - baseX),
        y: clamp((cy - want.y) / s, -roomY - baseY, roomY - baseY),
      };
    };

    /** The whole grid, drawn from the atlas, with its gutters. */
    const drawHeldGrid = (v: View) => {
      const s = 2 ** (v.z - 19);
      const cell = CELL * s;
      const [x, y] = toScreen(
        v,
        PLOT_C[0] - (GX + 0.5) * CELL,
        PLOT_C[1] - (GY + 0.5) * CELL,
      );
      const cw = (2 * GX + 1) * cell;
      const ch = (2 * GY + 1) * cell;
      if (atlasCtx) ctx.drawImage(atlas, x, y, cw, ch);
      const gap = Math.max(1.5, cell * 0.04);
      ctx.fillStyle = "#16120f";
      for (let i = 0; i <= 2 * GX + 1; i++)
        ctx.fillRect(x + i * cell - gap / 2, y, gap, ch);
      for (let j = 0; j <= 2 * GY + 1; j++)
        ctx.fillRect(x, y + j * cell - gap / 2, cw, gap);
    };

    const frame = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#1b1612";
      ctx.fillRect(0, 0, W, H);
      const cam = cameraAt(t, W, H);
      const view: View = { x: cam.x, y: cam.y, z: cam.z };
      if (t >= T.grid) {
        // Barely moving, for good: a slow drift, and any pan asked for.
        const drift = reduce ? 0 : Math.sin((t - T.grid) * 0.11);
        const target = panTarget(view);
        pan.x += (target.x - pan.x) * 0.06;
        pan.y += (target.y - pan.y) * 0.06;
        view.x += pan.x + drift * 0.15 * CELL * Math.min(1, W / 900);
        view.y += pan.y + drift * 0.06 * CELL;
      }
      if (t >= T.grid) drawHeldGrid(view);
      else drawScene(t, view);
      // A zoom blur: the frame again, a little nearer and farther, faint.
      if (cam.blur > 0.05) {
        ctx.globalAlpha = 0.18;
        for (let i = 1; i <= 3; i++) {
          const k = (i % 2 ? 1 : -1) * Math.ceil(i / 2) * 0.05 * cam.blur;
          drawScene(t, { ...view, z: view.z + k });
        }
        ctx.globalAlpha = 1;
      }

      // Light: warm and dark at the edges, a slow glow moving across.
      const glowX = W * (0.5 + 0.3 * Math.sin(t * 0.07));
      const glow = ctx.createRadialGradient(
        glowX,
        H * 0.25,
        0,
        glowX,
        H * 0.25,
        W * 0.8,
      );
      glow.addColorStop(0, "rgba(255,196,140,0.10)");
      glow.addColorStop(1, "rgba(255,196,140,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);
      const edge = ctx.createRadialGradient(
        W / 2,
        H / 2,
        Math.min(W, H) * 0.35,
        W / 2,
        H / 2,
        Math.max(W, H) * 0.8,
      );
      edge.addColorStop(0, "rgba(20,14,10,0)");
      edge.addColorStop(1, "rgba(20,14,10,0.55)");
      ctx.fillStyle = edge;
      ctx.fillRect(0, 0, W, H);

      // Darker behind the headline and search once they arrive.
      const veil = smooth(clamp((t - T.panel + 0.3) / 1.2));
      if (veil > 0) {
        ctx.fillStyle = `rgba(18,12,8,${0.3 * veil})`;
        ctx.fillRect(0, 0, W, H);
        const middle = ctx.createRadialGradient(
          W / 2,
          H * 0.36,
          0,
          W / 2,
          H * 0.36,
          Math.max(W * 0.42, 260),
        );
        middle.addColorStop(0, `rgba(18,12,8,${0.5 * veil})`);
        middle.addColorStop(1, "rgba(18,12,8,0)");
        ctx.fillStyle = middle;
        ctx.fillRect(0, 0, W, H);
      }

      drawMarks(t, view);
    };

    const resize = () => {
      const b = section.getBoundingClientRect();
      W = b.width;
      H = b.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cnv.width = Math.round(W * dpr);
      cnv.height = Math.round(H * dpr);
      readColours();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(section);
    resize();

    // Ask for the whole flight's tiles up front, the first view first.
    if (reduce) clockRef.current = T.grid;
    for (let t = clockRef.current; t <= T.out; t += 0.2) {
      const c = cameraAt(t, W, H);
      if (t < 3.2) prefetch("streets", c, W, H);
      prefetch("imagery", c, W, H);
    }
    const first = cameraAt(clockRef.current, W, H);
    const { tz, x0, y0, x1, y1 } = tilesFor(first, W, H);
    const opening: Tile[] = [];
    for (let x = x0; x <= x1; x++)
      for (let y = y0; y <= y1; y++)
        opening.push(tile(reduce ? "imagery" : "streets", tz, x, y));
    const mounted = performance.now();
    let gridAsked = false;

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(section);

    let raf = 0;
    let last = performance.now();
    let frames = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      if (!visible || document.hidden) return;
      if (++frames % 30 === 0) readColours();
      // Wait for the opening view (or three seconds) before starting.
      const started =
        opening.every((o) => o.ready) || now - mounted > 3000 || reduce;
      if (started) clockRef.current += dt;
      const t = clockRef.current;
      if (!gridAsked && t > T.info) {
        gridAsked = true;
        for (const c of CELLS) tile("imagery", 18, c.tx, c.ty);
      }
      if (gridAsked && painted.size <= CELLS.length && frames % 10 === 0)
        fillAtlas();
      report(t);
      frame(t);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduce]);

  const listId = "blr-search-options";

  return (
    <section className="@container relative isolate overflow-hidden bg-[#120e0b] text-zinc-900">
      <div
        ref={stageRef}
        className="relative isolate flex min-h-[max(46rem,100svh)] flex-col overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 -z-10 size-full"
          aria-hidden
        />

        <motion.header
          className="relative z-30 mx-3 mt-3 flex items-center justify-between gap-3 rounded-2xl border border-white/25 bg-(--p)/80 px-3.5 py-2.5 text-white shadow-[0_12px_40px_-14px_rgba(20,10,4,0.7)] backdrop-blur-md @3xl:mx-8 @3xl:mt-5 @3xl:px-6"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href="#"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight"
          >
            <Icon className="size-6">
              <path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5M10 21v-6h4v6" />
            </Icon>
            {brand}
          </a>
          <nav className="hidden items-center gap-8 text-[0.9375rem] font-medium text-white/85 @3xl:flex">
            <a
              href="#"
              className="relative text-white after:absolute after:inset-x-0 after:-bottom-1.5 after:h-0.5 after:rounded-full after:bg-white"
            >
              Home
            </a>
            <a href="#services" className="hover:text-white">
              Services
            </a>
            <a href="#packages" className="hover:text-white">
              Packages
            </a>
            <a href="#premium" className="hover:text-white">
              Premium
            </a>
          </nav>
          <div className="flex items-center gap-2 @3xl:gap-3">
            <button
              type="button"
              aria-label="Search"
              onClick={() => {
                skip();
                window.setTimeout(
                  () => inputRef.current?.focus(),
                  panelUp ? 0 : 1200,
                );
              }}
              className="grid size-9 place-items-center rounded-full text-white hover:bg-white/15"
            >
              <Icon className="size-[1.15rem]">{SEARCH_ICON}</Icon>
            </button>
            <a
              href="#login"
              className="hidden rounded-xl border border-white/60 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 @md:inline-block"
            >
              Login
            </a>
            <a
              href="#get-started"
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-(--p-dark) shadow-sm hover:bg-(--p-light)"
            >
              Get Started
            </a>
          </div>
        </motion.header>

        {/* The five things a check covers, beside the plot. */}
        <motion.aside
          ref={infoRef}
          className="absolute top-[47%] right-4 left-4 z-10 rounded-2xl border border-white/60 bg-[#fdf8f1]/90 p-4 shadow-[0_20px_60px_-20px_rgba(20,12,6,0.7)] backdrop-blur-md @3xl:top-[24%] @3xl:right-auto @3xl:left-[57%] @3xl:w-[22rem] @3xl:p-5"
          initial={false}
          animate={{ opacity: infoOn ? 1 : 0, y: infoOn ? 0 : 14 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden={!infoOn}
        >
          <p className="text-[0.6875rem] font-semibold tracking-[0.16em] text-(--p-dark) uppercase">
            Selected plot
          </p>
          <p className="mt-1 font-semibold text-zinc-900">
            HSR Layout, Bengaluru
          </p>
          <p className="text-xs text-zinc-500">
            What a check of this plot covers
          </p>
          <ul className="mt-3 divide-y divide-zinc-900/10 border-t border-zinc-900/10">
            {CHECKS.map((c, i) => (
              <motion.li
                key={c.name}
                className="flex items-center justify-between gap-3 py-2"
                initial={false}
                animate={{ opacity: i < items ? 1 : 0, x: i < items ? 0 : 8 }}
                transition={{ duration: 0.4 }}
              >
                <span>
                  <span className="block text-[0.8125rem] font-medium text-zinc-900">
                    {c.name}
                  </span>
                  <span className="block text-[0.6875rem] text-zinc-500">
                    {c.note}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5 text-[0.6875rem] font-medium text-zinc-500">
                  <span className="size-1.5 rounded-full bg-(--p)" />
                  In the check
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.aside>

        {/* The page's own first screen, once the grid holds. */}
        <motion.div
          className="relative z-20 mx-auto flex w-full max-w-4xl flex-col items-center px-4 pt-9 text-center @3xl:pt-12"
          initial={false}
          animate={{ opacity: panelUp ? 1 : 0, y: panelUp ? 0 : 28 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          inert={!panelUp}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[0.6875rem] font-semibold tracking-[0.16em] text-white/90 uppercase backdrop-blur-md">
            <Icon className="size-3.5">
              <path d="M3 21h18M5 21V10M19 21V10M9 21V10M15 21V10M2 10l10-6 10 6z" />
            </Icon>
            Backed by our law firm
          </span>
          <h1 className="mt-5 text-[2rem] leading-[1.08] font-semibold tracking-tight text-balance text-white @md:text-5xl @5xl:text-[3.6rem]">
            Know every Bengaluru property.{" "}
            <span className="text-(--s)">Before you sign.</span>
          </h1>
          <p className="mt-5 max-w-[48ch] text-[0.9375rem] leading-loose text-white/85 @3xl:text-lg">
            Property intelligence. Records.{" "}
            <span className="rounded-full bg-(--p) px-2.5 py-0.5 font-semibold whitespace-nowrap text-(--p-on)">
              Legal clarity
            </span>{" "}
            from people who read every document.
          </p>

          <form
            role="search"
            action={searchAction}
            method="get"
            onSubmit={submit}
            className="relative mt-7 w-full max-w-3xl text-left"
          >
            <label htmlFor="blr-search" className="sr-only">
              Search a property, survey number or location
            </label>
            <div className="flex items-center rounded-full border border-white/35 bg-white/10 p-1.5 pl-5 shadow-[0_14px_44px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md focus-within:border-white/80 focus-within:bg-white/15">
              <input
                ref={inputRef}
                id="blr-search"
                name="q"
                type="search"
                role="combobox"
                autoComplete="off"
                aria-expanded={open && suggestions.length > 0}
                aria-controls={listId}
                aria-activedescendant={
                  open && suggestions.length ? `${listId}-${active}` : undefined
                }
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                  setActive(0);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => window.setTimeout(() => setOpen(false), 120)}
                onKeyDown={(e) => {
                  if (!suggestions.length) return;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setOpen(true);
                    setActive((a) => (a + 1) % suggestions.length);
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive(
                      (a) => (a - 1 + suggestions.length) % suggestions.length,
                    );
                  } else if (e.key === "Escape") setOpen(false);
                }}
                placeholder="Search a property, survey number or location…"
                style={{ outline: "none" }}
                className="min-w-0 flex-1 bg-transparent py-2.5 text-[0.9375rem] text-white placeholder:text-white/65 [&::-webkit-search-cancel-button]:hidden"
              />
              <button
                type="submit"
                aria-label="Search"
                className="grid size-11 shrink-0 place-items-center rounded-full bg-(--p) text-(--p-on) hover:bg-(--p-dark) hover:text-white"
              >
                <Icon className="size-5">{SEARCH_ICON}</Icon>
              </button>
            </div>
            {open && suggestions.length > 0 && (
              <ul
                id={listId}
                role="listbox"
                className="absolute inset-x-0 top-full z-40 mt-2 max-h-64 overflow-auto rounded-2xl border border-zinc-900/10 bg-white p-1.5 shadow-2xl"
              >
                {suggestions.map((s, i) => (
                  <li
                    key={`${s.kind}-${s.label}`}
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      choose(s);
                    }}
                    onMouseEnter={() => setActive(i)}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm ${i === active ? "bg-(--p)/10 text-zinc-900" : "text-zinc-700"}`}
                  >
                    {s.label}
                    <span className="text-[0.6875rem] font-medium text-zinc-400">
                      {s.kind === "place"
                        ? "Locality"
                        : s.kind === "service"
                          ? "Service"
                          : "Survey number"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </form>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-[0.8125rem]">
            {POPULAR.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => pickPopular(p)}
                className="rounded-lg border border-white/35 bg-white/5 px-3 py-1 text-white/90 backdrop-blur-sm hover:bg-white hover:text-zinc-900"
              >
                {p}
              </button>
            ))}
          </div>
          <p
            aria-live="polite"
            className="mt-3 min-h-[1.25rem] max-w-2xl text-[0.8125rem] text-white/80"
          >
            {message}
          </p>
        </motion.div>

        {/* Three services, fanned, the curve cutting across their feet. */}
        <div id="services" className="relative z-10 mt-auto">
          <div className="mx-auto grid max-w-6xl gap-3 px-4 pt-6 pb-10 @3xl:grid-cols-3 @3xl:gap-0 @3xl:px-10 @3xl:pt-4 @3xl:pb-0">
            {SERVICES.map((s, i) => (
              <motion.a
                key={s.id}
                href={s.href}
                initial={false}
                animate={{
                  opacity: panelUp ? 1 : 0,
                  y: panelUp ? 0 : 160,
                }}
                transition={
                  panelUp
                    ? {
                        type: "spring",
                        stiffness: 70,
                        damping: 16,
                        delay: 0.35 + i * 0.12,
                      }
                    : { duration: 0 }
                }
                inert={!panelUp}
                className={`group block rounded-2xl border bg-[#fdf8f1]/92 p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)] backdrop-blur-md transition-[border-color,box-shadow] @3xl:h-72 @3xl:rounded-b-none @3xl:p-7 ${CARD_TILT[i]} ${service === s.id ? "border-(--p) ring-4 ring-(--p)/40" : "border-white/70 hover:border-(--p)"}`}
              >
                <span className="flex items-center gap-2 text-xl font-semibold tracking-tight text-zinc-900 @3xl:text-2xl">
                  {s.title}
                  <svg
                    viewBox="0 0 12 12"
                    className="size-3 shrink-0 text-(--p) transition-transform group-hover:translate-x-1"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M3 1.5v9l7-4.5z" />
                  </svg>
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-zinc-600 @3xl:text-[0.9375rem]">
                  {s.body}
                </span>
                <span className="mt-5 hidden @3xl:block">{CARD_ART[i]}</span>
              </motion.a>
            ))}
          </div>
        </div>
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 left-1/2 z-20 hidden h-60 w-[170%] -translate-x-1/2 rounded-[100%] bg-[#120e0b] @3xl:block"
          initial={false}
          animate={{ opacity: panelUp ? 1 : 0 }}
          transition={{ duration: 0.8, delay: panelUp ? 0.3 : 0 }}
        />

        {intro && (
          <button
            type="button"
            onClick={skip}
            className="absolute right-4 bottom-4 z-30 rounded-full border border-white/30 bg-zinc-950/40 px-3.5 py-1.5 text-xs font-semibold text-white/85 backdrop-blur-sm hover:bg-zinc-950/60 hover:text-white @3xl:right-8"
          >
            Skip intro
          </button>
        )}
        <p className="pointer-events-none absolute bottom-0.5 left-3 z-30 text-[0.5625rem] text-white/70 [text-shadow:0_1px_2px_rgba(0,0,0,0.8)] @3xl:left-8">
          Powered by Esri · Imagery: Esri, Maxar, Earthstar Geographics
        </p>
      </div>

      {/* What clients say, under the curve. */}
      <div className="relative z-10 px-6 pt-4 pb-14 text-white @3xl:pt-0">
        <div className="mx-auto grid max-w-6xl items-center gap-10 text-center @3xl:grid-cols-3 @3xl:text-left">
          <figure>
            <blockquote className="text-[0.9375rem] leading-relaxed text-white/90">
              &ldquo;{PROOF.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-sm text-white/70">
              Review by{" "}
              <a
                href={PROOF.link}
                className="font-semibold text-white underline underline-offset-4 hover:text-(--s)"
              >
                {PROOF.by}
              </a>
            </figcaption>
          </figure>
          <div className="flex items-center justify-center gap-2">
            <Laurel />
            <div className="text-center">
              <Stars className="justify-center" />
              <p className="mt-1.5 text-[0.6875rem] tracking-wide text-white/70">
                {PROOF.badgeTop}
              </p>
              <p className="mt-1 text-sm leading-tight font-semibold tracking-wide uppercase">
                {PROOF.badge}
              </p>
              <p className="mt-1 text-xs text-white/70">{PROOF.badgeYear}</p>
            </div>
            <Laurel flip />
          </div>
          <div className="flex items-center justify-center gap-4 @3xl:justify-end">
            <span className="grid size-16 place-items-center rounded-full bg-white shadow-lg">
              <GoogleG />
            </span>
            <div className="text-left">
              <p className="text-sm font-semibold">Google Reviews</p>
              <div className="mt-1 flex items-center gap-2">
                <Stars />
                <span className="text-sm font-semibold">{PROOF.rating}/5</span>
              </div>
              <p className="mt-1 text-xs text-white/70">{PROOF.count}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
