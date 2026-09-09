import type { Parent, Root, RootContent } from "mdast";
import { toString } from "mdast-util-to-string";

/** Fence languages that hold a program's output rather than a program. */
const OUTPUT_LANGS = new Set(["output", "text", "txt", "out", "console"]);

/** A paragraph that only announces the block below it. */
const OUTPUT_LABEL = /^(expected\s+)?(output|result|results)\s*:?$/i;

/**
 * `mdast-util-to-hast` reads these to decide what element a node becomes.
 * Declared locally rather than imported: the package that augments mdast's
 * `Data` with them is a transitive dependency of react-markdown, so the
 * augmentation is not reliably in scope here.
 */
type HastEscape = {
  hName?: string;
  hProperties?: Record<string, string>;
  hChildren?: never[];
};

/**
 * Joins a code fence to the output fence beneath it, so the two render as one
 * block with a tab each.
 *
 * The notes teach by showing a short program and then what it prints, which
 * is the right way round for reading but costs two framed blocks and a
 * heading's worth of vertical space every time — and a lesson has forty of
 * them, so the page ends up mostly scrolling. Tabbed, the pair takes the room
 * of one, and the output stays one click from the code that produced it
 * rather than a screen away.
 *
 * Only an *adjacent* pair is joined. A heading, a sentence or a second
 * example between them means the author was making a different point, and the
 * SQL notes — which put Syntax, Example and Expected Output under headings of
 * their own — are left exactly as they were.
 */
export function remarkCodeTabs() {
  return (tree: Root) => walk(tree);
}

function walk(parent: Parent) {
  const kids = parent.children as RootContent[];
  const kept: RootContent[] = [];

  for (let i = 0; i < kids.length;) {
    const node = kids[i];

    if (
      node.type !== "code" ||
      OUTPUT_LANGS.has((node.lang ?? "").toLowerCase())
    ) {
      if ("children" in node) walk(node as Parent);
      kept.push(node);
      i += 1;
      continue;
    }

    // Step over an "**Output**" line if one stands between the pair; the tab
    // says the same thing, so it would only be repeating itself.
    let next = i + 1;
    if (
      kids[next]?.type === "paragraph" &&
      OUTPUT_LABEL.test(toString(kids[next]).trim())
    ) {
      next += 1;
    }

    const output = kids[next];
    if (
      output?.type === "code" &&
      OUTPUT_LANGS.has((output.lang ?? "").toLowerCase())
    ) {
      const data = (node.data ?? {}) as HastEscape;
      data.hName = "codetabs";
      data.hProperties = {
        code: node.value,
        language: node.lang ?? "",
        output: output.value,
      };
      data.hChildren = [];
      node.data = data;
      kept.push(node);
      i = next + 1;
      continue;
    }

    kept.push(node);
    i += 1;
  }

  parent.children = kept as Parent["children"];
}
