/**
 * `npm run workspace` from the repo root: installs the runner's own
 * dependencies the first time (they are kept out of the website's; .npmrc
 * there runs their install scripts through cmd, not PowerShell 5), then
 * starts it.
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

if (!existsSync(path.join(here, "node_modules", "node-pty"))) {
  console.log("First run: installing the Workspace runner…");
  execSync("npm install --no-audit --no-fund", {
    cwd: here,
    stdio: "inherit",
  });
}

await import("./server.mjs");
