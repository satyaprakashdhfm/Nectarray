/**
 * Renders public/og.png — the 1200x630 card shown when the site is shared on
 * social, in chat apps and in search previews.
 *
 * Rendered in headless Chromium rather than composed with sharp so the card
 * uses the site's real typography and gradients instead of whatever fonts a
 * raster pipeline happens to have. The output PNG is committed, so this only
 * needs re-running when the branding or the tagline changes:
 *
 *   npm i -D playwright && node scripts/generate-og.cjs
 */
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const OUT = "public/og.png";
const WIDTH = 1200;
const HEIGHT = 630;

const markDataUri = `data:image/png;base64,${fs
  .readFileSync(path.join(__dirname, "..", "public", "logo-mark.png"))
  .toString("base64")}`;

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${WIDTH}px; height: ${HEIGHT}px;
    background: #0b1720;
    font-family: "Schibsted Grotesk", sans-serif;
    color: #fff; overflow: hidden; position: relative;
    display: flex; flex-direction: column; justify-content: center;
    padding: 0 76px;
  }
  .grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px);
    background-size: 52px 52px;
    -webkit-mask-image: radial-gradient(120% 80% at 50% 0%, #000 30%, transparent 78%);
  }
  .glow { position: absolute; border-radius: 50%; filter: blur(120px); }
  .glow-a { width: 520px; height: 520px; left: -140px; top: -120px; background: rgba(31,165,222,.30); }
  .glow-b { width: 460px; height: 460px; right: -110px; bottom: -170px; background: rgba(126,217,87,.26); }
  .row { position: relative; display: flex; align-items: center; gap: 18px; margin-bottom: 44px; }
  .row img { width: 76px; height: 76px; object-fit: contain; }
  .word {
    font-size: 50px; font-weight: 700; font-style: italic; letter-spacing: -.03em;
    background: linear-gradient(100deg, #7ed957 0%, #46c9c0 45%, #1fa5de 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  h1 {
    position: relative; font-size: 74px; line-height: 1.04;
    letter-spacing: -.035em; font-weight: 700; max-width: 960px;
  }
  h1 span {
    background: linear-gradient(100deg, #7ed957 0%, #46c9c0 45%, #1fa5de 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  ul {
    position: relative; list-style: none; display: flex; gap: 10px; margin-top: 46px;
  }
  li {
    font-size: 21px; font-weight: 500; color: rgba(255,255,255,.82);
    border: 1px solid rgba(255,255,255,.16); border-radius: 999px;
    padding: 11px 22px; background: rgba(255,255,255,.04);
  }
</style>
</head>
<body>
  <div class="grid"></div>
  <div class="glow glow-a"></div>
  <div class="glow glow-b"></div>

  <div class="row">
    <img src="${markDataUri}" alt="">
    <span class="word">NectArray</span>
  </div>

  <h1>We build the software,<br><span>and the demand for it.</span></h1>

  <ul>
    <li>Marketing</li>
    <li>Software</li>
    <li>Agentic AI</li>
    <li>Academy</li>
  </ul>
</body>
</html>`;

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
  });
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });

  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: OUT });
  await browser.close();

  console.log(`${OUT}  ${WIDTH}x${HEIGHT}`);
})();
