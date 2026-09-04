import type { ReactElement, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/dashboard/CodeBlock";
import { idCounter } from "@/lib/toc";

/** Flattens children back to plain text, for slugs and for fenced code. */
function toText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean")
    return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (typeof node === "object" && "props" in node) {
    return toText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

/**
 * Renders course notes.
 *
 * Almost nothing is overridden here. The look lives in the `.notes` block in
 * globals.css, because a lesson is a couple of thousand elements and giving
 * each one its own class string put tens of kilobytes of repeated attribute
 * on the wire — twice, since a server-rendered page ships the markup and the
 * data to rehydrate it. The overrides that remain are the ones that are not
 * styling: heading ids for the contents list, the scroll box a wide table
 * needs, and the fenced block, which is a component of its own.
 *
 * The markdown itself is rendered on the server, so none of react-markdown
 * reaches the browser.
 */
export function Markdown({ children }: { children: string }) {
  /*
   * Heading ids come from a counter rather than straight from the slug,
   * because the notes repeat headings — "Syntax", "Example" and "Expected
   * Output" appear under every command in the SQL notes — and thirty
   * elements sharing an id means every contents link lands on the first of
   * them. The contents list runs the identical counter over the identical
   * headings, so the two sides agree without sharing state.
   */
  const nextId = idCounter();
  const heading = (Tag: "h2" | "h3" | "h4" | "h5") =>
    function Heading({ children }: { children?: ReactNode }) {
      return <Tag id={nextId(toText(children))}>{children}</Tag>;
    };

  return (
    <div className="notes">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Shifted down one level: the lesson title is the page's h1, so a
          // section of the notes is an h2 however it was written.
          h1: heading("h2"),
          h2: heading("h3"),
          h3: heading("h4"),
          h4: heading("h5"),

          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer noopener">
              {children}
            </a>
          ),

          table: ({ children }) => (
            <div className="table-scroll">
              <table>{children}</table>
            </div>
          ),

          /*
           * The fence is taken apart here rather than in `code` because the
           * language, the source text and the frame around them belong to one
           * component — the copy button has to hand over exactly the
           * characters that were in the block, and by the time `code` runs
           * the <pre> wrapper has already been decided.
           */
          pre: ({ children }) => {
            const child = (
              Array.isArray(children) ? children[0] : children
            ) as ReactElement<{ className?: string; children?: ReactNode }>;
            const props = child?.props ?? {};
            const language =
              /language-([\w+-]+)/.exec(props.className ?? "")?.[1] ?? "";
            return (
              <CodeBlock
                language={language}
                code={toText(props.children).replace(/\n$/, "")}
              />
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
