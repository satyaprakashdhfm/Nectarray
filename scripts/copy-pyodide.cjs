#!/usr/bin/env node
/**
 * Copies the Pyodide runtime into public/ so we serve it ourselves.
 *
 * Not from a CDN: the judge is the thing that decides whether a student's work
 * counts, and it should not stop working because someone else's CDN is having
 * a bad day. Served from our own origin it is also cached by the browser after
 * the first Python problem and costs nothing thereafter.
 *
 * Copied at build time rather than committed — 13 MB of WebAssembly does not
 * belong in git history.
 */

const fs = require("node:fs");
const path = require("node:path");

// Everything loadPyodide() reaches for, and nothing else. The package also
// ships source maps, type definitions and two demo consoles.
const FILES = [
  // The UMD build: the judge worker is a classic worker loaded through
  // importScripts, so that the bundler never processes it.
  "pyodide.js",
  "pyodide.asm.mjs",
  "pyodide.asm.wasm",
  "python_stdlib.zip",
  "pyodide-lock.json",
];

const from = path.dirname(require.resolve("pyodide/package.json"));
const to = path.join(__dirname, "..", "public", "pyodide");

fs.mkdirSync(to, { recursive: true });

let bytes = 0;
for (const file of FILES) {
  const source = path.join(from, file);
  if (!fs.existsSync(source)) {
    console.error(`pyodide is missing ${file} — has the package layout changed?`);
    process.exit(1);
  }
  fs.copyFileSync(source, path.join(to, file));
  bytes += fs.statSync(source).size;
}

const version = require(path.join(from, "package.json")).version;
console.log(
  `Copied Pyodide ${version} into public/pyodide — ${Math.round(bytes / 1024 / 1024)} MB.`,
);
