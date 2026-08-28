/**
 * Turns the supplied JPEG logo (flat white background) into every derived
 * brand asset the site serves. Re-run with `npm run brand` if the source
 * artwork is replaced.
 *
 *   public/logo.png          full lockup, transparent
 *   public/logo-mark.png     circuit mark alone, transparent — used in the header
 *   public/logo-square.png   512px mark on brand ivory, padded — Organization
 *                            schema logo, which Google requires to be a real
 *                            crawlable image on a solid background
 *   src/app/icon.png         512px favicon (Next serves this as the tab icon)
 *   src/app/apple-icon.png   180px home-screen icon — opaque, because iOS
 *                            composites transparency onto black
 */
const path = require("path");
const sharp = require("sharp");

const SOURCE = "public/logo-source.jpg";
const IVORY = { r: 251, g: 252, b: 252, alpha: 1 };

/** Treat flat white as transparent and un-premultiply what is left. */
async function knockout(input, extract) {
  let image = sharp(input);
  if (extract) image = image.extract(extract);

  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const white = Math.min(r, g, b); // flat white component of the pixel
    const alpha = 255 - white;
    if (alpha <= 6) continue; // leave fully transparent
    const k = 255 / alpha;
    out[i] = Math.min(255, Math.round((r - white) * k));
    out[i + 1] = Math.min(255, Math.round((g - white) * k));
    out[i + 2] = Math.min(255, Math.round((b - white) * k));
    out[i + 3] = alpha;
  }

  return sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  });
}

async function write(pipeline, file) {
  const info = await pipeline.png({ compressionLevel: 9 }).toFile(file);
  console.log(`  ${file.padEnd(28)} ${info.width}x${info.height}`);
}

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

/** Square canvas with the mark centred and even breathing room around it. */
async function squared(markBuffer, size, background = TRANSPARENT) {
  // Scale the mark down first so the padding ratio holds whatever the
  // source resolution is, then drop it onto the square canvas.
  const inner = await sharp(markBuffer)
    .resize(Math.round(size * 0.78), Math.round(size * 0.78), {
      fit: "contain",
      background: TRANSPARENT,
    })
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background },
  }).composite([{ input: inner, gravity: "center" }]);
}

(async () => {
  const { width, height } = await sharp(SOURCE).metadata();
  console.log(`source ${path.basename(SOURCE)} ${width}x${height}\n`);

  // Full lockup and the mark on its own.
  await write(
    (await knockout(SOURCE)).trim({ threshold: 1 }),
    "public/logo.png",
  );

  const markPipeline = (
    await knockout(SOURCE, {
      left: 0,
      top: 0,
      width,
      height: Math.round(height * 0.68),
    })
  ).trim({ threshold: 1 });

  const mark = await markPipeline.png().toBuffer();
  await sharp(mark).toFile("public/logo-mark.png");
  const markMeta = await sharp(mark).metadata();
  console.log(
    `  ${"public/logo-mark.png".padEnd(28)} ${markMeta.width}x${markMeta.height}`,
  );

  // Derived icons.
  await write(await squared(mark, 512, IVORY), "public/logo-square.png");
  await write(await squared(mark, 512), "src/app/icon.png");
  await write(await squared(mark, 180, IVORY), "src/app/apple-icon.png");
})();
