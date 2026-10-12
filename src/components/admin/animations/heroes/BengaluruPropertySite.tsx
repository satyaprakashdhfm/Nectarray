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
 * slow drift and a neighbourhood outlined now and then. Last, a cream glass
 * panel rises with a search that works (localities light up their tile on
 * the map; services point to their card) and three service cards.
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
const GX = 7;
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
    rest: { x: W * 0.5, y: wide ? H * 0.31 : H * 0.24 },
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
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const infoRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
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
    const section = sectionRef.current;
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
    const A = 256;
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
      if (t > T.grid + 0.3 && (pin === null || pin === "selected")) {
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
        if (a > 0 && r.x > 0 && r.x + r.w < W && r.y > 60 && r.y + r.h < H) {
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
      const panel = panelRef.current?.getBoundingClientRect();
      const home = section.getBoundingClientRect();
      const top = 80;
      const bottom = panel ? panel.top - home.top : H * 0.55;
      const want = { x: W / 2, y: (top + Math.max(top + 40, bottom)) / 2 };
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
        view.x += pan.x + drift * 0.22 * CELL * Math.min(1, W / 900);
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
    <section
      ref={sectionRef}
      className="@container relative isolate flex min-h-[54rem] flex-col overflow-hidden bg-[#1b1612] text-zinc-900 @3xl:min-h-[48rem]"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 -z-10 size-full"
        aria-hidden
      />

      <motion.header
        className="relative z-20 mx-3 mt-3 flex items-center justify-between gap-3 rounded-2xl border border-white/50 bg-[#fdf8f1]/85 px-3.5 py-2.5 shadow-[0_10px_40px_-14px_rgba(30,18,8,0.55)] backdrop-blur-md @3xl:mx-8 @3xl:mt-5 @3xl:px-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <a
          href="#"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-zinc-900"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-(--p) text-(--p-on)">
            <Icon className="size-[1.1rem]">
              <path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5M10 21v-6h4v6" />
            </Icon>
          </span>
          {brand}
        </a>
        <nav className="hidden items-center gap-7 text-sm font-medium text-zinc-600 @3xl:flex">
          <a
            href="#"
            className="relative text-zinc-900 after:absolute after:inset-x-0 after:-bottom-1.5 after:h-0.5 after:rounded-full after:bg-(--p)"
          >
            Home
          </a>
          <a href="#services" className="hover:text-zinc-900">
            Services
          </a>
          <a href="#packages" className="hover:text-zinc-900">
            Packages
          </a>
          <a href="#premium" className="hover:text-zinc-900">
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
                panelUp ? 0 : 900,
              );
            }}
            className="grid size-9 place-items-center rounded-full text-zinc-700 hover:bg-zinc-900/5"
          >
            <Icon className="size-[1.15rem]">{SEARCH_ICON}</Icon>
          </button>
          <a
            href="#login"
            className="hidden rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 hover:border-zinc-900 @md:inline-block"
          >
            Login
          </a>
          <a
            href="#get-started"
            className="rounded-xl bg-(--p) px-4 py-2 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white"
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

      {/* The glass panel that rises once the grid holds. */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 px-3 pb-5 @3xl:px-8 @3xl:pb-7"
        initial={false}
        animate={{ y: panelUp ? "0%" : "115%" }}
        transition={
          panelUp
            ? { type: "spring", stiffness: 60, damping: 17, mass: 1.1 }
            : { duration: 0 }
        }
        inert={!panelUp}
      >
        <div
          ref={panelRef}
          className="mx-auto max-w-5xl rounded-[1.75rem] border border-white/60 bg-[#fdf8f1]/75 p-4 shadow-[0_-12px_70px_-24px_rgba(20,12,6,0.75)] backdrop-blur-lg @3xl:p-7"
        >
          <p className="text-[0.6875rem] font-semibold tracking-[0.18em] text-(--p-dark) uppercase @3xl:text-xs">
            Property intelligence. Records. Legal clarity.
          </p>
          <h1 className="mt-1.5 text-xl leading-tight font-semibold tracking-tight text-zinc-900 @md:text-2xl @3xl:text-[2.1rem]">
            Know a Bengaluru property before you sign
          </h1>

          <form
            role="search"
            action={searchAction}
            method="get"
            onSubmit={submit}
            className="relative mt-4"
          >
            <label htmlFor="blr-search" className="sr-only">
              Search a property, survey number or location
            </label>
            <div className="flex items-center rounded-2xl border border-zinc-900/10 bg-white/90 p-1.5 pl-4 shadow-sm focus-within:border-(--p) focus-within:ring-4 focus-within:ring-(--p)/15">
              <Icon className="size-5 shrink-0 text-zinc-400">
                {SEARCH_ICON}
              </Icon>
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
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-[0.9375rem] text-zinc-900 outline-none placeholder:text-zinc-400 [&::-webkit-search-cancel-button]:hidden"
              />
              <button
                type="submit"
                className="rounded-xl bg-(--p) px-4 py-2.5 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white @3xl:px-6"
              >
                Search
              </button>
            </div>
            {open && suggestions.length > 0 && (
              <ul
                id={listId}
                role="listbox"
                className="absolute inset-x-0 top-full z-30 mt-2 max-h-64 overflow-auto rounded-2xl border border-zinc-900/10 bg-white p-1.5 shadow-2xl"
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
          <div className="mt-2.5 hidden flex-wrap items-center gap-2 text-[0.8125rem] @3xl:flex">
            <span className="text-zinc-500">Popular:</span>
            {POPULAR.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => pickPopular(p)}
                className="rounded-full border border-zinc-900/10 bg-white/70 px-3 py-1 text-zinc-700 hover:border-(--p) hover:text-zinc-900"
              >
                {p}
              </button>
            ))}
          </div>
          <p
            aria-live="polite"
            className="mt-2 min-h-[1.25rem] text-[0.8125rem] text-zinc-600"
          >
            {message}
          </p>

          <div
            id="services"
            className="mt-2 grid gap-2.5 @3xl:grid-cols-3 @3xl:gap-4"
          >
            {SERVICES.map((s) => (
              <a
                key={s.id}
                href={s.href}
                className={`group flex items-start gap-3 rounded-2xl border bg-white/70 px-3 py-2.5 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-(--p) hover:shadow-lg @3xl:flex-col @3xl:items-stretch @3xl:p-5 ${service === s.id ? "border-(--p) shadow-lg ring-4 ring-(--p)/25" : "border-zinc-900/10"}`}
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-(--p-light) text-(--p-dark) @3xl:size-10">
                  <Icon>{s.icon}</Icon>
                </span>
                <span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-zinc-900 @3xl:text-base">
                    {s.title}
                    <span className="text-(--p) transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-zinc-600 @3xl:mt-1 @3xl:text-[0.8125rem] @3xl:leading-relaxed">
                    {s.body}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </motion.div>

      {intro && (
        <button
          type="button"
          onClick={skip}
          className="absolute right-4 bottom-4 z-20 rounded-full border border-white/30 bg-zinc-950/40 px-3.5 py-1.5 text-xs font-semibold text-white/85 backdrop-blur-sm hover:bg-zinc-950/60 hover:text-white @3xl:right-8"
        >
          Skip intro
        </button>
      )}
      <p className="pointer-events-none absolute bottom-0.5 left-3 z-20 text-[0.5625rem] text-white/75 [text-shadow:0_1px_2px_rgba(0,0,0,0.8)] @3xl:left-8">
        Powered by Esri · Imagery: Esri, Maxar, Earthstar Geographics
      </p>
    </section>
  );
}
