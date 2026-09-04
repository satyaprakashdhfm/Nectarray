#!/usr/bin/env node
/**
 * Cuts the academy hero artwork out of the supplied banner.
 *
 *   node scripts/crop-hero.cjs <path-to-banner> [left-px]
 *
 * The banner we were given is 3084x1376 and only its right half is usable.
 * The left half is a headline, a strapline and a "100+ Students" badge baked
 * into the pixels — text that cannot appear on the page, because it reads
 * "Nectarcourses" rather than NectArray, because it would repeat the h1 next
 * to it in a typeface we do not use and no crawler can read, and because
 * "100+ Students" contradicts the claim the rest of the page rests on.
 *
 * Cropping the file rather than masking it in CSS means that text is absent
 * from what ships, so no later change to the layout can bring it back. The
 * re-encode is most of the win on weight: 6.4 MB of PNG becomes ~234 KB.
 *
 * `left` is the x in source pixels to cut from — everything left of it is
 * discarded. Raise it to tighten onto the figure, lower it to keep more of
 * the desk, and check the result: below about 1470 the strapline starts
 * reappearing at the left edge. AcademyHero.tsx carries the output's aspect
 * ratio in the box around it, so update that if this changes.
 */
const path = require("node:path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const TARGET = path.join(ROOT, "public", "academy-hero.jpg");

/** Clears the baked strapline, keeps the whole of the left monitor. */
const DEFAULT_LEFT = 1500;

async function main() {
  const source = process.argv[2];
  if (!source) {
    console.error("Usage: node scripts/crop-hero.cjs <path-to-banner> [left]");
    process.exit(1);
  }

  const left = Number.parseInt(process.argv[3] ?? "", 10) || DEFAULT_LEFT;
  const { width, height, format } = await sharp(source).metadata();

  if (left >= width) {
    console.error(`left (${left}) is beyond the image width (${width}).`);
    process.exit(1);
  }

  const info = await sharp(source)
    .extract({ left, top: 0, width: width - left, height })
    // Flattened onto the panel's own ground, so alpha in the source cannot
    // punch a hole in a JPEG that has nowhere to put it.
    .flatten({ background: "#0b1720" })
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(TARGET);

  const ratio = (info.width / info.height).toFixed(4);
  console.log(`in   ${width}x${height} ${format}`);
  console.log(`out  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
  console.log(`     ${path.relative(ROOT, TARGET)}`);
  console.log(`\nSet the box in AcademyHero.tsx to aspect-[${info.width}/${info.height}] (${ratio}:1).`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
