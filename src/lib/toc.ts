import type { Nodes } from "mdast";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { toString } from "mdast-util-to-string";
import { slugify } from "@/lib/slug";

export type TocEntry = { level: 1 | 2; text: string; id: string };

/** One heading, before we decide which of them are top level. */
type Heading = { depth: number; text: string };

/**
 * The same parser react-markdown uses, stopped after the parse.
 *
 * The contents list has to see exactly the headings the renderer will emit,
 * in exactly the same order — the two sides number repeated headings
 * independently and have to arrive at the same numbers. A regular expression
 * over the source gets that wrong the moment a lesson uses an underlined
 * heading, a heading inside a list, or a fence the expression cannot pair,
 * and one disagreement shifts every id after it.
 */
const parser = unified().use(remarkParse).use(remarkGfm);

/** Every heading in the document, in the order the renderer will reach them. */
function headings(source: string): Heading[] {
  const found: Heading[] = [];

  const walk = (node: Nodes) => {
    if (node.type === "heading") {
      const text = toString(node).trim();
      if (text) found.push({ depth: node.depth, text });
      return;
    }
    if ("children" in node) for (const child of node.children) walk(child);
  };

  walk(parser.parse(source));
  return found;
}

/**
 * Ids for headings, unique within one document.
 *
 * The notes repeat headings constantly — a SQL lesson has "Syntax",
 * "Example" and "Expected Output" under every command it covers — so a plain
 * slug would give thirty elements the same id and every contents link would
 * jump to the first of them. The nth repeat gets `-n`, and the renderer runs
 * the same counter over the same headings so the two agree.
 */
export function idCounter(): (text: string) => string {
  const seen = new Map<string, number>();
  return (text: string) => {
    const base = slugify(text) || "section";
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  };
}

/**
 * The contents of a lesson: its sections, and the subsections of each.
 *
 * Which markdown level counts as a "section" is decided per lesson rather
 * than fixed, because the notes were written by different hands and do not
 * agree. The SQL notes open sections with `#` and use `###` for the
 * boilerplate Syntax/Example/Output triplet under every command; the Agentic
 * AI notes never use `#` at all and start at `##`. Fixing on H1+H2 gave one
 * course a contents list of nothing and the other a list of a hundred
 * repetitions of the word "Syntax".
 *
 * So: the shallowest level present is the section level, the next one down is
 * the subsection level, and anything deeper is detail that belongs in the
 * page rather than in the rail.
 */
export function tocEntries(source: string): TocEntry[] {
  const found = headings(source);
  if (found.length === 0) return [];

  const depths = [...new Set(found.map((h) => h.depth))].sort((a, b) => a - b);
  const [primary, secondary] = depths;

  const nextId = idCounter();
  const entries: TocEntry[] = [];

  for (const heading of found) {
    // Every heading advances the counter, including the deep ones we do not
    // list, so the ids stay in step with the ones the renderer hands out.
    const id = nextId(heading.text);
    if (heading.depth === primary) {
      entries.push({ level: 1, text: heading.text, id });
    } else if (heading.depth === secondary) {
      entries.push({ level: 2, text: heading.text, id });
    }
  }

  return entries;
}
