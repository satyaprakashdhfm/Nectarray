#!/usr/bin/env node
/**
 * Normalises the six category photographs for the /software showcase.
 *
 *   node scripts/prepare-card-art.cjs <folder-of-source-images>
 *
 * The sources arrive at wildly different sizes — one at 5824px wide, one at
 * 640 — and at three different aspect ratios. The cards need one shape and
 * one weight budget, so every image is cover-cropped to 16:9 and written as
 * JPEG into public/software/.
 *
 * 16:9 because the art sits in a band across the top of each card, at the
 * card's own width. A card is portrait and these photographs are landscape;
 * covering the whole card would scale them to the card's height and throw
 * away most of the composition sideways. A band crops far less.
 *
 * Never upscales. An image smaller than the target is written at its own
 * size and called out, because inventing pixels only makes a soft image
 * bigger, and the honest fix is a better source.
 */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "software");

/**
 * The navy every card is tinted to.
 *
 * Muted rather than the brand blue itself: these are photographs behind
 * body copy, not accents, and at full saturation the grid started competing
 * with the chips and the headings on top of it.
 */
const DUOTONE = { r: 40, g: 78, b: 130 };

/** Card width is ~460 CSS px at three columns, so this covers 2x. */
const TARGET_WIDTH = 1200;
const ASPECT = 16 / 9;

/** source file -> published name, in the order the cards appear. */
const ART = [
  ["protifoleo_bg.jpg", "portfolio"],
  ["ecomerce_bg.jpg", "ecommerce"],
  ["dashboard_bg.png", "dashboards"],
  ["webstie_bg.jpg", "platforms"],
  ["agenticai_bg.jpg", "agentic-ai"],
  ["mobile_bg.jpg", "mobile"],
];

async function main() {
  const dir = process.argv[2];
  if (!dir) {
    console.error("Usage: node scripts/prepare-card-art.cjs <source-folder>");
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  let total = 0;
  const soft = [];

  for (const [file, slug] of ART) {
    const source = path.join(dir, file);
    if (!fs.existsSync(source)) {
      console.error(`missing: ${source}`);
      process.exit(1);
    }

    const meta = await sharp(source).metadata();
    const width = Math.min(TARGET_WIDTH, meta.width);
    const height = Math.round(width / ASPECT);

    const target = path.join(OUT_DIR, `${slug}.jpg`);
    const info = await sharp(source)
      .resize(width, height, { fit: "cover", position: "centre" })
      // Duotoned to one navy, because the six sources do not agree on colour
      // temperature: two are near-black, two are blue, one is warm orange.
      // Side by side in a grid they read as six unrelated pictures rather
      // than a set.
      //
      // `tint` alone, with no `greyscale` in front of it. sharp orders its
      // own pipeline rather than following call order, and greyscale runs
      // after tint — so asking for both returns a plain grey image with the
      // navy quietly discarded. tint already maps onto luminance, which is
      // the duotone we wanted.
      .tint(DUOTONE)
      .modulate({ brightness: 0.94 })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(target);

    total += info.size;
    const note = width < TARGET_WIDTH ? "  <- source too small to fill 2x" : "";
    console.log(
      `${slug.padEnd(11)} ${String(meta.width).padStart(5)}x${String(meta.height).padEnd(5)} -> ` +
        `${info.width}x${info.height}  ${String(Math.round(info.size / 1024)).padStart(4)} KB${note}`,
    );
    if (width < TARGET_WIDTH) soft.push(`${slug} (${meta.width}px wide)`);
  }

  console.log(`\ntotal ${(total / 1024).toFixed(0)} KB in public/software/`);
  if (soft.length) {
    console.log(
      `\nSoft on retina, replace the source when you can: ${soft.join(", ")}.`,
    );
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
