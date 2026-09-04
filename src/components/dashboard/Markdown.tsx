import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Slug for a heading, matched byte-for-byte by the table of contents.
 *
 * The TOC scans the raw markdown while the renderer sees React nodes, so
 * both sides must agree on the rule — hence one exported function rather
 * than two implementations that drift.
 */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Flattens heading children back to plain text so it can be slugged. */
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
 * Every element is styled explicitly rather than through a prose plugin,
 * because these notes lean hard on three things a generic style sheet gets
 * wrong: fenced SQL next to its real output, wide result tables, and
 * headings used as numbered section markers. GFM is on for the tables.
 */
export function Markdown({ children }: { children: string }) {
  /*
   * Prose is capped at a readable measure; everything else is not.
   *
   * These notes are mostly wide artefacts — SQL result tables, terminal
   * output, long fenced blocks — and squeezing those into a text column to
   * keep paragraphs comfortable wastes the half of a desktop screen they
   * would happily use. So the limit goes on the paragraphs and lists that
   * need it, and headings, tables and code run the full width of the page.
   */
  return (
    <div className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2
              id={slugify(toText(children))}
              className="display text-ink border-line mt-12 scroll-mt-[140px] border-t pt-10 text-[1.625rem] first:mt-0 first:border-0 first:pt-0 sm:text-[1.875rem]"
            >
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h3
              id={slugify(toText(children))}
              className="display text-ink mt-10 scroll-mt-[140px] text-[1.375rem]"
            >
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="text-ink mt-8 text-[1.0625rem] font-semibold">
              {children}
            </h4>
          ),
          h4: ({ children }) => <h5 className="eyebrow mt-7">{children}</h5>,
          p: ({ children }) => (
            <p className="text-ink-soft mt-4 max-w-[74ch] text-[0.9375rem] leading-[1.75]">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="text-ink-soft marker:text-ink-faint mt-4 max-w-[74ch] list-disc space-y-2 pl-5 text-[0.9375rem] leading-[1.7]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="text-ink-soft marker:text-ink-faint mt-4 max-w-[74ch] list-decimal space-y-2 pl-5 text-[0.9375rem] leading-[1.7]">
              {children}
            </ol>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-brand-deep font-medium underline underline-offset-2"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="text-ink font-semibold">{children}</strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-brand bg-brand-wash/40 text-ink-soft mt-5 max-w-[74ch] border-l-[3px] py-1 pl-5 text-[0.9375rem] italic">
              {children}
            </blockquote>
          ),
          // The notes separate sections with ---, so the rule does the work and
          // headings do not also draw one; two rules and a gap read as a bug.
          hr: () => <hr className="border-line mt-12" />,

          // Wide result tables must scroll inside themselves, never push the
          // page sideways.
          table: ({ children }) => (
            <div className="border-line mt-5 overflow-x-auto rounded-xl border">
              <table className="w-full text-left text-[0.875rem]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-mist border-line-soft border-b">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="text-ink px-4 py-3 font-semibold whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-line-soft text-ink-soft border-b px-4 py-3 align-top">
              {children}
            </td>
          ),

          code: ({ className, children, ...props }) => {
            // Fenced blocks carry a language class; inline code does not.
            const fenced = /language-/.test(className ?? "");
            if (fenced) {
              return (
                <code
                  className="font-mono text-[0.8125rem] leading-[1.7]"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className="border-line bg-mist text-ink rounded border px-1.5 py-0.5 font-mono text-[0.85em]">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="border-night-line bg-night mt-5 overflow-x-auto rounded-xl border p-4 text-white/90">
              {children}
            </pre>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
