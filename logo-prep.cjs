/**
 * One-off asset prep: turns the supplied JPEG logo (flat white background)
 * into transparent PNGs used by the site.
 *
 *   public/logo.png       full lockup — circuit mark + "NectArray" wordmark
 *   public/logo-mark.png  the circuit mark alone, used in the header
 *
 * Re-run with `node logo-prep.cjs` if the source artwork is replaced.
 */
const sharp = require("sharp");

/** Treat flat white as transparent and un-premultiply what is left. */
async function knockout(input, extract) {
  let img = sharp(input);
  if (extract) img = img.extract(extract);

  const { data, info } = await img
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const white = Math.min(r, g, b); // flat white component of the pixel
    const a = 255 - white;
    if (a <= 6) continue; // leave as fully transparent zeros
    const k = 255 / a;
    out[i] = Math.min(255, Math.round((r - white) * k));
    out[i + 1] = Math.min(255, Math.round((g - white) * k));
    out[i + 2] = Math.min(255, Math.round((b - white) * k));
    out[i + 3] = a;
  }

  return sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  });
}

async function write(pipeline, output) {
  const info = await pipeline
    .trim({ threshold: 1 }) // crop away the now-transparent margin
    .png({ compressionLevel: 9 })
    .toFile(output);
  console.log(`${output}  ${info.width}x${info.height}`);
}

(async () => {
  const src = "public/logo-source.jpg";
  const { width, height } = await sharp(src).metadata();

  await write(await knockout(src), "public/logo.png");
  await write(
    await knockout(src, {
      left: 0,
      top: 0,
      width,
      height: Math.round(height * 0.68),
    }),
    "public/logo-mark.png",
  );
})();
