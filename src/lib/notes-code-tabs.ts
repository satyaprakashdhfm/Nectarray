import type { Code, Parent, Root, RootContent } from "mdast";
import { toString } from "mdast-util-to-string";

/** Fence languages that hold a program's output rather than a program. */
const OUTPUT_LANGS = new Set(["output", "text", "txt", "out", "console"]);

/** A paragraph that only announces the block below it. */
const OUTPUT_LABEL = /^(expected\s+)?(output|result|results)\s*:?$/i;

/** `title="..."` in a fence's info string: ```python title="mcp_server.py" */
const TITLE = /title="([^"]+)"/;

/** One tab of a code group — see remarkCodeTabs. */
export type CodeTab = {
  title: string;
  language: string;
  code: string;
  output?: string;
};

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

const isOutput = (node: RootContent | undefined): node is Code =>
  node?.type === "code" && OUTPUT_LANGS.has((node.lang ?? "").toLowerCase());

const isProgram = (node: RootContent | undefined): node is Code =>
  node?.type === "code" && !isOutput(node);

const titleOf = (node: Code) => TITLE.exec(node.meta ?? "")?.[1];

/**
 * The output fence belonging to the program at `i`, if it has one, and the
 * index just past whichever of the two ends the pair.
 */
function outputAfter(kids: RootContent[], i: number) {
  let next = i + 1;
  // Step over an "**Output**" line if one stands between the pair; the tab
  // says the same thing, so it would only be repeating itself.
  if (
    kids[next]?.type === "paragraph" &&
    OUTPUT_LABEL.test(toString(kids[next]).trim())
  ) {
    next += 1;
  }
  const output = kids[next];
  return isOutput(output)
    ? { output: output.value, end: next + 1 }
    : { output: undefined, end: i + 1 };
}

function escape(node: Code, hName: string, props: Record<string, string>) {
  const data = (node.data ?? {}) as HastEscape;
  data.hName = hName;
  data.hProperties = props;
  data.hChildren = [];
  node.data = data;
}

/**
 * Joins fences that belong together, so they render as one block with tabs.
 *
 * Two shapes, both only ever from *adjacent* fences — a heading, a sentence or
 * a second example between them means the author was making a different
 * point, and is left alone.
 *
 * A program and its output. The notes teach by showing a short program and
 * then what it prints; tabbed, the pair takes the room of one block rather
 * than two, and the output stays one click from the code that produced it.
 *
 * A group of versions. Two or more fences each carrying `title="..."` — the
 * same call in three libraries, or the files of one small app — become one
 * block with a tab per title, each keeping its own output if it has one:
 *
 *     ```python title="Native"            ```js title="Vercel AI SDK"
 *     ...                                 ...
 *     ```                                 ```
 *     ```output
 *     ...
 *     ```
 *
 * A lone titled fence keeps the title as its label, which is how a file name
 * ends up in the corner of the block instead of just the language.
 */
export function remarkCodeTabs() {
  return (tree: Root) => walk(tree);
}

function walk(parent: Parent) {
  const kids = parent.children as RootContent[];
  const kept: RootContent[] = [];

  for (let i = 0; i < kids.length;) {
    const node = kids[i];

    if (!isProgram(node)) {
      if ("children" in node) walk(node as Parent);
      kept.push(node);
      i += 1;
      continue;
    }

    // A run of titled programs, each with its output if one follows.
    const tabs: CodeTab[] = [];
    let j = i;
    while (isProgram(kids[j]) && titleOf(kids[j] as Code)) {
      const fence = kids[j] as Code;
      const { output, end } = outputAfter(kids, j);
      tabs.push({
        title: titleOf(fence)!,
        language: fence.lang ?? "",
        code: fence.value,
        ...(output !== undefined ? { output } : {}),
      });
      j = end;
    }

    if (tabs.length >= 2) {
      escape(node, "codegroup", { tabs: JSON.stringify(tabs) });
      kept.push(node);
      i = j;
      continue;
    }

    const title = titleOf(node);
    const { output, end } = outputAfter(kids, i);
    if (output !== undefined || title) {
      escape(node, "codetabs", {
        code: node.value,
        language: node.lang ?? "",
        ...(output !== undefined ? { output } : {}),
        ...(title ? { title } : {}),
      });
      kept.push(node);
      i = end;
      continue;
    }

    kept.push(node);
    i += 1;
  }

  parent.children = kept as Parent["children"];
}
