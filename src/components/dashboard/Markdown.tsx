import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BookOpen,
  Info,
  Lightbulb,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { CodeBlock } from "@/components/dashboard/CodeBlock";
import { remarkCodeTabs } from "@/lib/notes-code-tabs";
import { idCounter } from "@/lib/toc";

/**
 * The callout kinds, written as GitHub-style alerts.
 *
 *     > [!TIP]
 *     > Name the variable after what it holds, not what type it is.
 *
 * A callout is an ordinary blockquote in the source, so a lesson stays
 * readable as plain markdown and anything that does not know this convention
 * still renders the text.
 */
const CALLOUTS: Record<
  string,
  { label: string; variant: string; icon: LucideIcon }
> = {
  TIP: { label: "Tip", variant: "tip", icon: Lightbulb },
  NOTE: { label: "Note", variant: "note", icon: Info },
  IMPORTANT: { label: "Important", variant: "note", icon: Info },
  EXAMPLE: { label: "Example", variant: "example", icon: BookOpen },
  WARNING: { label: "Warning", variant: "warning", icon: TriangleAlert },
  CAUTION: { label: "Caution", variant: "warning", icon: TriangleAlert },
};

const MARKER = /^\s*\[!(\w+)\]\s*\n?/;

/**
 * Removes the `[!TIP]` marker from the front of a callout's body.
 *
 * The marker is text like any other by the time react-markdown has parsed
 * it, and it usually arrives as its own string followed by the line break
 * that ended it — so both have to go, or the callout opens on a blank line.
 */
function stripMarker(node: ReactNode): ReactNode {
  if (typeof node === "string") return node.replace(MARKER, "");

  if (Array.isArray(node)) {
    const out = [...node];
    let done = false;
    while (out.length > 0) {
      const head = out[0];
      if (!done && typeof head === "string") {
        const rest = head.replace(MARKER, "");
        done = true;
        if (rest.trim() === "") {
          out.shift();
          continue;
        }
        out[0] = rest;
        break;
      }
      // The soft break that ended the marker's own line.
      if (done && isValidElement(head) && head.type === "br") {
        out.shift();
        continue;
      }
      break;
    }
    return out;
  }

  if (isValidElement(node)) {
    const element = node as ReactElement<{ children?: ReactNode }>;
    return cloneElement(element, {}, stripMarker(element.props.children));
  }

  return node;
}

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
        remarkPlugins={[remarkGfm, remarkCodeTabs]}
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

          blockquote: ({ children }) => {
            const marker = MARKER.exec(toText(children));
            const kind = marker
              ? CALLOUTS[marker[1].toUpperCase()]
              : undefined;

            // An ordinary quotation, which is still a blockquote.
            if (!kind) return <blockquote>{children}</blockquote>;

            const Icon = kind.icon;
            return (
              <div className={`callout callout-${kind.variant}`}>
                <Icon className="callout-icon" aria-hidden />
                <p className="callout-label">{kind.label}</p>
                <div>{stripMarker(children)}</div>
              </div>
            );
          },

          /*
           * The fence is taken apart here rather than in `code` because the
           * language, the source text and the frame around them belong to one
           * component — the copy button has to hand over exactly the
           * characters that were in the block, and by the time `code` runs
           * the <pre> wrapper has already been decided.
           *
           * A pair joined by remarkCodeTabs arrives here too. The rename it
           * asks for lands on the inner <code> and leaves this wrapper in
           * place, so the joined block is the child rather than a sibling —
           * it carries both texts as props and no children of its own, and
           * that is what tells the two cases apart.
           */
          pre: ({ children }) => {
            const child = (
              Array.isArray(children) ? children[0] : children
            ) as ReactElement<{
              className?: string;
              children?: ReactNode;
              code?: string;
              language?: string;
              output?: string;
            }>;
            const props = child?.props ?? {};
            const language =
              /language-([\w+-]+)/.exec(props.className ?? "")?.[1] ?? "";

            if (typeof props.code === "string") {
              return (
                <CodeBlock
                  language={props.language || language}
                  code={props.code}
                  output={props.output ?? ""}
                />
              );
            }

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
