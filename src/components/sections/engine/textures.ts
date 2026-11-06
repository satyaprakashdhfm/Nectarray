import * as THREE from "three";

/**
 * Procedural textures for the Growth Engine hero. Everything is drawn on a
 * canvas at start-up — no image downloads, nothing that can 404, and the
 * circuit language is the logo's own: orthogonal runs, 45° bends, and a
 * round pad at every end.
 */

/** The four practices, in the site's order, with the accent each one wears
 *  everywhere else (Hero cards, practice pages). */
export const PRACTICES = [
  {
    id: "marketing",
    index: "01",
    title: "Growth & Marketing",
    short: "Growth",
    href: "/marketing",
    color: "#f5a44a",
  },
  {
    id: "software",
    index: "02",
    title: "Software & Web",
    short: "Software",
    href: "/software",
    color: "#1fa5de",
  },
  {
    id: "ai",
    index: "03",
    title: "Agentic AI",
    short: "AI agents",
    href: "/agentic-ai",
    color: "#7ed957",
  },
  {
    id: "academy",
    index: "04",
    title: "Academy",
    short: "Academy",
    href: "/academy",
    color: "#2bb3ad",
  },
] as const;

export type PracticeId = (typeof PRACTICES)[number]["id"];

/** Small deterministic PRNG, so the board is identical on every visit. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

function finish(c: HTMLCanvasElement, srgb = true) {
  const tex = new THREE.CanvasTexture(c);
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/**
 * A layer of circuitry, for inside the core's glass. Traces walk a grid in
 * eight directions, turning at most 45° at a time, and end in a ring pad —
 * the mark's vocabulary. Coloured across the sheet from the brand blue to
 * the leaf green, as the mark is.
 */
export function circuitTexture(seed: number, density = 1) {
  const size = 1024;
  const [c, g] = canvas(size, size);
  const rand = rng(seed);
  const cells = 22;
  const step = size / cells;
  const taken = new Set<string>();
  const dirs = [
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
  ];

  const grad = g.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, "#5cc8f5");
  grad.addColorStop(0.55, "#4fd1c5");
  grad.addColorStop(1, "#8fe36a");
  g.strokeStyle = grad;
  g.fillStyle = grad;
  g.lineCap = "round";
  g.lineJoin = "round";

  const traces = Math.round(46 * density);
  for (let n = 0; n < traces; n++) {
    let x = 2 + Math.floor(rand() * (cells - 4));
    let y = 2 + Math.floor(rand() * (cells - 4));
    if (taken.has(`${x},${y}`)) continue;
    let d = Math.floor(rand() * 4) * 2; // start orthogonal
    const pts: [number, number][] = [[x, y]];
    taken.add(`${x},${y}`);
    const len = 3 + Math.floor(rand() * 7);
    for (let i = 0; i < len; i++) {
      if (i > 0 && rand() < 0.35) d = (d + (rand() < 0.5 ? 1 : 7)) % 8;
      const nx = x + dirs[d][0];
      const ny = y + dirs[d][1];
      if (nx < 1 || ny < 1 || nx > cells - 2 || ny > cells - 2) break;
      if (taken.has(`${nx},${ny}`)) break;
      x = nx;
      y = ny;
      taken.add(`${x},${y}`);
      pts.push([x, y]);
    }
    if (pts.length < 2) continue;

    g.lineWidth = 7;
    g.beginPath();
    pts.forEach(([px, py], i) => {
      const cx = px * step + step / 2;
      const cy = py * step + step / 2;
      if (i === 0) g.moveTo(cx, cy);
      else g.lineTo(cx, cy);
    });
    g.stroke();

    // Ring pad at the far end, a filled via at the start.
    const [ex, ey] = pts[pts.length - 1];
    g.lineWidth = 6;
    g.beginPath();
    g.arc(ex * step + step / 2, ey * step + step / 2, 11, 0, Math.PI * 2);
    g.stroke();
    g.beginPath();
    g.arc(
      pts[0][0] * step + step / 2,
      pts[0][1] * step + step / 2,
      7,
      0,
      Math.PI * 2,
    );
    g.fill();
  }

  // A die outline, so each layer reads as an engineered part, not a doodle.
  g.lineWidth = 4;
  g.strokeRect(step * 0.6, step * 0.6, size - step * 1.2, size - step * 1.2);

  return finish(c);
}

/**
 * The plinth's top plate: a machined grid with register marks and a few
 * engraved references. Returns the colour map and a matching emissive mask
 * that lets the engraving glow faintly once the board powers up.
 */
export function plinthTextures() {
  const size = 2048;
  const [c, g] = canvas(size, size);
  const [e, h] = canvas(size, size);

  g.fillStyle = "#0d141a";
  g.fillRect(0, 0, size, size);
  h.fillStyle = "#000";
  h.fillRect(0, 0, size, size);

  const line = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  // Fine grid, then a coarser one.
  for (const [every, alpha, glow] of [
    [32, 0.035, 0.05],
    [128, 0.07, 0.16],
  ] as const) {
    g.strokeStyle = `rgba(190,215,235,${alpha})`;
    h.strokeStyle = `rgba(255,255,255,${glow})`;
    g.lineWidth = h.lineWidth = every === 32 ? 1 : 1.6;
    for (let p = 96; p <= size - 96; p += every) {
      line(g, p, 96, p, size - 96);
      line(g, 96, p, size - 96, p);
      line(h, p, 96, p, size - 96);
      line(h, 96, p, size - 96, p);
    }
  }

  // Inset frame.
  g.strokeStyle = "rgba(200,225,240,0.18)";
  h.strokeStyle = "rgba(255,255,255,0.5)";
  g.lineWidth = h.lineWidth = 3;
  g.strokeRect(64, 64, size - 128, size - 128);
  h.strokeRect(64, 64, size - 128, size - 128);

  // Register crosses at the corners.
  g.strokeStyle = "rgba(220,235,245,0.4)";
  h.strokeStyle = "rgba(255,255,255,0.9)";
  for (const [x, y] of [
    [140, 140],
    [size - 140, 140],
    [140, size - 140],
    [size - 140, size - 140],
  ]) {
    for (const ctx of [g, h]) {
      ctx.lineWidth = 3;
      line(ctx, x - 22, y, x + 22, y);
      line(ctx, x, y - 22, x, y + 22);
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Engraved references along the edges.
  g.fillStyle = "rgba(200,220,235,0.32)";
  h.fillStyle = "rgba(255,255,255,0.7)";
  for (const ctx of [g, h]) {
    ctx.font = "600 30px ui-monospace, Menlo, monospace";
    ctx.textBaseline = "middle";
    ctx.fillText("NECTARRAY  ·  GROWTH ENGINE  ·  REV 04", 190, 104);
    ctx.fillText("BUS A — DEMAND", 190, size - 104);
    ctx.fillText("BUS B — PRODUCT", size - 470, size - 104);
    ctx.fillText("NA-01", size - 300, 104);
  }

  const map = finish(c);
  const emissive = finish(e);
  return { map, emissive };
}

function roundRect(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/**
 * A floating interface panel for one practice. `compact` draws only the
 * label row, for the phone composition where a full panel would be too
 * small to read.
 */
export function panelTexture(
  practice: (typeof PRACTICES)[number],
  fontFamily: string,
  compact = false,
) {
  const w = 768;
  const h = compact ? 168 : 480;
  const [c, g] = canvas(w, h);
  const accent = practice.color;
  const sans = `${fontFamily}, ui-sans-serif, system-ui, sans-serif`;
  const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

  // Glass card.
  roundRect(g, 6, 6, w - 12, h - 12, 28);
  const fill = g.createLinearGradient(0, 0, 0, h);
  fill.addColorStop(0, "rgba(22,36,46,0.78)");
  fill.addColorStop(1, "rgba(8,16,22,0.7)");
  g.fillStyle = fill;
  g.fill();
  g.lineWidth = 3;
  g.strokeStyle = "rgba(255,255,255,0.16)";
  g.stroke();

  // Top highlight — the lit edge of a pane of glass.
  g.save();
  roundRect(g, 6, 6, w - 12, h - 12, 28);
  g.clip();
  const sheen = g.createLinearGradient(0, 0, w, 0);
  sheen.addColorStop(0, "rgba(255,255,255,0)");
  sheen.addColorStop(0.5, "rgba(255,255,255,0.35)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = sheen;
  g.fillRect(0, 6, w, 2);
  g.restore();

  // Label row.
  g.fillStyle = accent;
  g.beginPath();
  g.arc(52, 66, 9, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.5)";
  g.font = `500 26px ${mono}`;
  g.textBaseline = "middle";
  g.fillText(practice.index, 80, 67);
  g.fillStyle = "#ffffff";
  g.font = `600 38px ${sans}`;
  g.fillText(practice.title, 130, 66);

  if (compact) return finish(c);

  g.strokeStyle = "rgba(255,255,255,0.08)";
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(36, 118);
  g.lineTo(w - 36, 118);
  g.stroke();

  const x0 = 44;
  const y0 = 150;
  const vw = w - 88;
  const vh = h - y0 - 44;

  if (practice.id === "marketing") {
    // Demand curve: an area chart that climbs.
    const pts = [
      0.12, 0.18, 0.15, 0.27, 0.33, 0.31, 0.46, 0.55, 0.62, 0.78, 0.86,
    ];
    const px = (i: number) => x0 + (i / (pts.length - 1)) * vw;
    const py = (v: number) => y0 + vh - v * vh;
    g.strokeStyle = "rgba(255,255,255,0.06)";
    for (let i = 0; i <= 3; i++) {
      g.beginPath();
      g.moveTo(x0, y0 + (vh * i) / 3);
      g.lineTo(x0 + vw, y0 + (vh * i) / 3);
      g.stroke();
    }
    const area = g.createLinearGradient(0, y0, 0, y0 + vh);
    area.addColorStop(0, hexA(accent, 0.35));
    area.addColorStop(1, hexA(accent, 0));
    g.beginPath();
    g.moveTo(px(0), py(pts[0]));
    pts.forEach((v, i) => g.lineTo(px(i), py(v)));
    g.lineTo(px(pts.length - 1), y0 + vh);
    g.lineTo(px(0), y0 + vh);
    g.closePath();
    g.fillStyle = area;
    g.fill();
    g.beginPath();
    pts.forEach((v, i) =>
      i ? g.lineTo(px(i), py(v)) : g.moveTo(px(i), py(v)),
    );
    g.strokeStyle = accent;
    g.lineWidth = 5;
    g.stroke();
    g.fillStyle = "#fff";
    g.beginPath();
    g.arc(px(pts.length - 1), py(pts[pts.length - 1]), 9, 0, Math.PI * 2);
    g.fill();
    g.font = `500 24px ${mono}`;
    g.fillStyle = "rgba(255,255,255,0.55)";
    g.fillText("PAID · ORGANIC · CRO", x0, y0 + vh + 22);
  } else if (practice.id === "software") {
    // Code: indented token bars, like an editor at a distance.
    const rows = [
      [0, [0.18, 0.3]],
      [1, [0.12, 0.22, 0.16]],
      [2, [0.26, 0.14]],
      [2, [0.1, 0.32]],
      [1, [0.2]],
      [1, [0.14, 0.28, 0.1]],
      [0, [0.08]],
    ] as const;
    const tones = ["#7cc8ef", "rgba(255,255,255,0.75)", accent, "#9be37a"];
    rows.forEach(([indent, parts], r) => {
      let x = x0 + 46 + indent * 36;
      const y = y0 + 10 + r * 34;
      g.fillStyle = "rgba(255,255,255,0.25)";
      g.font = `500 20px ${mono}`;
      g.fillText(String(r + 1).padStart(2, "0"), x0, y + 6);
      parts.forEach((p, k) => {
        g.fillStyle = tones[(r + k) % tones.length];
        g.globalAlpha = 0.85;
        roundRect(g, x, y, p * vw * 0.9, 13, 6);
        g.fill();
        x += p * vw * 0.9 + 14;
      });
      g.globalAlpha = 1;
    });
    g.fillStyle = "#9be37a";
    g.beginPath();
    g.arc(x0 + 8, y0 + vh + 18, 7, 0, Math.PI * 2);
    g.fill();
    g.font = `500 24px ${mono}`;
    g.fillStyle = "rgba(255,255,255,0.6)";
    g.fillText("deploy · production · live", x0 + 26, y0 + vh + 19);
  } else if (practice.id === "ai") {
    // An agent's run: steps it actually took, each one checked off.
    const steps = [
      "read new enquiry",
      "look up customer in CRM",
      "draft quote from price book",
      "send for approval",
    ];
    steps.forEach((s, i) => {
      const y = y0 + 16 + i * 56;
      const done = i < 3;
      g.strokeStyle = done ? accent : "rgba(255,255,255,0.35)";
      g.lineWidth = 3;
      g.beginPath();
      g.arc(x0 + 14, y, 13, 0, Math.PI * 2);
      g.stroke();
      if (done) {
        g.beginPath();
        g.moveTo(x0 + 7, y);
        g.lineTo(x0 + 12, y + 6);
        g.lineTo(x0 + 22, y - 6);
        g.stroke();
      }
      if (i < steps.length - 1) {
        g.strokeStyle = "rgba(255,255,255,0.12)";
        g.beginPath();
        g.moveTo(x0 + 14, y + 16);
        g.lineTo(x0 + 14, y + 40);
        g.stroke();
      }
      g.fillStyle = done ? "rgba(255,255,255,0.86)" : "rgba(255,255,255,0.45)";
      g.font = `500 27px ${sans}`;
      g.fillText(s, x0 + 46, y + 1);
    });
  } else {
    // Academy: a cohort's progress through the tracks.
    const tracks = [
      ["Python", 0.86],
      ["SQL", 0.72],
      ["System design", 0.48],
      ["Agents", 0.3],
    ] as const;
    tracks.forEach(([name, p], i) => {
      const y = y0 + 6 + i * 58;
      g.fillStyle = "rgba(255,255,255,0.8)";
      g.font = `500 25px ${sans}`;
      g.fillText(name, x0, y + 4);
      const bx = x0 + 250;
      const bw = vw - 250;
      g.fillStyle = "rgba(255,255,255,0.09)";
      roundRect(g, bx, y - 6, bw, 12, 6);
      g.fill();
      g.fillStyle = accent;
      roundRect(g, bx, y - 6, bw * p, 12, 6);
      g.fill();
    });
  }

  return finish(c);
}
