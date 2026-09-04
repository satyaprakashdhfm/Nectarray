#!/usr/bin/env node
/**
 * Optimises a full-bleed hero background.
 *
 *   node scripts/prepare-hero-art.cjs <source> <name>
 *
 * e.g. node scripts/prepare-hero-art.cjs ~/Downloads/agentic.png agentic-hero
 *      -> public/hero/agentic-hero.jpg
 *
 * Sources arrive as multi-megabyte PNGs straight out of an image model. A
 * hero background sits behind a heavy scrim, so it is the one asset where
 * quality can be spent freely: none of the detail survives being knocked
 * back far enough for white copy to sit on it. Hence a lower JPEG quality
 * than the card art gets, and the alpha channel flattened onto the dark
 * ground the section is drawn in.
 *
 * Never upscales — a hero rendered wider than its source only looks soft.
 */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "hero");

/** Covers a 92rem container at ~1.4x. Beyond this the scrim eats the detail. */
const TARGET_WIDTH = 2000;

/** The `night` token, so any transparency lands on the section's own ground. */
const GROUND = "#0b1720";

async function main() {
  const [source, name] = process.argv.slice(2);
  if (!source || !name) {
    console.error("Usage: node scripts/prepare-hero-art.cjs <source> <name>");
    process.exit(1);
  }
  if (!fs.existsSync(source)) {
    console.error(`missing: ${source}`);
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const meta = await sharp(source).metadata();
  const width = Math.min(TARGET_WIDTH, meta.width);
  const target = path.join(OUT_DIR, `${name}.jpg`);

  const info = await sharp(source)
    .resize({ width, withoutEnlargement: true })
    .flatten({ background: GROUND })
    .jpeg({ quality: 72, mozjpeg: true })
    .toFile(target);

  const before = fs.statSync(source).size;
  console.log(
    `in   ${meta.width}x${meta.height} ${meta.format}  ${(before / 1048576).toFixed(2)} MB`,
  );
  console.log(
    `out  ${info.width}x${info.height} jpeg  ${(info.size / 1024).toFixed(0)} KB`,
  );
  console.log(`     ${path.relative(ROOT, target)}`);
  if (width < TARGET_WIDTH) {
    console.log(
      `\nSource is only ${meta.width}px wide, so it was not upscaled.`,
    );
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
