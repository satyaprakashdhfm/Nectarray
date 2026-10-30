import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

/** An Omniproof article's markdown, from content/omniproof/<slug>.md. */
export async function readOmni(slug: string): Promise<string> {
  return readFile(
    path.join(process.cwd(), "content", "omniproof", `${slug}.md`),
    "utf8",
  );
}
