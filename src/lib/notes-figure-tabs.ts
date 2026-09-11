import type { Paragraph, Parent, Root, RootContent } from "mdast";

/** One tab of a figure group — see remarkFigureTabs. */
export type FigureTab = {
  /** The image's alt text, which is also its tab label. */
  label: string;
  src: string;
  caption?: string;
  /** The file the image previews, when the image was written as a link. */
  href?: string;
};

/** See notes-code-tabs.ts: read by mdast-util-to-hast, declared locally. */
type HastEscape = {
  hName?: string;
  hProperties?: Record<string, string>;
  hChildren?: never[];
};

/**
 * The figures in a paragraph that holds nothing but images, each optionally
 * wrapped in a link, or null if it holds anything else or fewer than two.
 */
function figuresIn(paragraph: Paragraph): FigureTab[] | null {
  const figures: FigureTab[] = [];
  for (const kid of paragraph.children) {
    // The line breaks between one image line and the next.
    if (kid.type === "text" && kid.value.trim() === "") continue;
    if (kid.type === "break") continue;

    const link = kid.type === "link" && kid.children.length === 1 ? kid : null;
    const image = link ? link.children[0] : kid;
    if (image.type !== "image") return null;

    figures.push({
      label: image.alt ?? "",
      src: image.url,
      ...(image.title ? { caption: image.title } : {}),
      ...(link ? { href: link.url } : {}),
    });
  }
  return figures.length >= 2 ? figures : null;
}

/**
 * Turns images written on consecutive lines into one figure with a tab each —
 * the pages of three documents, say, where stacking them would cost three
 * screens:
 *
 *     [![handbook.pdf](/notes/handbook.webp "Both pages")](/notes/data/handbook.pdf)
 *     [![policy.docx](/notes/policy.webp "The hotel table")](/notes/data/policy.docx)
 *
 * The alt text is the tab's label and the title its caption. An image wrapped
 * in a link is a preview of that file, and the tab offers the file for
 * download. Consecutive lines are one paragraph in markdown, which is what
 * marks them as a group; a blank line between images keeps them apart.
 */
export function remarkFigureTabs() {
  return (tree: Root) => walk(tree);
}

function walk(parent: Parent) {
  for (const node of parent.children as RootContent[]) {
    if (node.type === "paragraph") {
      const figures = figuresIn(node);
      if (!figures) continue;
      // A div rather than a custom element, so it needs no custom type in
      // react-markdown's components map; the attribute is what marks it.
      const data = (node.data ?? {}) as HastEscape;
      data.hName = "div";
      data.hProperties = { "data-figures": JSON.stringify(figures) };
      data.hChildren = [];
      node.data = data;
    } else if ("children" in node) {
      walk(node as Parent);
    }
  }
}
