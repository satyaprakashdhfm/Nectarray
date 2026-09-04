"use client";

import { useMemo, useState } from "react";
import { highlight } from "@/lib/highlight";

/** What each language calls itself in the corner of the block. */
const LABEL: Record<string, string> = {
  py: "Python",
  python: "Python",
  sql: "SQL",
  mysql: "MySQL",
  postgres: "PostgreSQL",
  postgresql: "PostgreSQL",
  psql: "PostgreSQL",
  sqlite: "SQLite",
  js: "JavaScript",
  javascript: "JavaScript",
  jsx: "JavaScript",
  ts: "TypeScript",
  tsx: "TypeScript",
  typescript: "TypeScript",
  json: "JSON",
  bash: "Bash",
  sh: "Shell",
  shell: "Shell",
  zsh: "Shell",
  console: "Terminal",
  text: "Output",
  txt: "Output",
  output: "Output",
  csv: "CSV",
  yaml: "YAML",
  yml: "YAML",
  html: "HTML",
  css: "CSS",
};

/**
 * A fenced block: the language in the corner, a copy button, the code.
 *
 * Students read these notes with an editor open beside them, and the thing
 * they do most often with a block is take it. Selecting twenty lines of
 * indented Python out of a scrolling container with a trackpad is a small
 * misery; a button is one click and cannot pick up the wrong indentation.
 *
 * The classes are short names from the style sheet rather than utilities: a
 * SQL lesson holds sixty of these blocks and several thousand coloured
 * tokens, and at twenty characters of class per token the colouring would
 * have cost more to send than the code it describes.
 */
export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [copied, setCopied] = useState(false);
  const tokens = useMemo(() => highlight(code, language), [code, language]);
  const label = LABEL[language.toLowerCase()] ?? language.toUpperCase();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access can be refused; the code is still selectable.
    }
  };

  return (
    <div className="code-block">
      <div className="code-bar">
        <span className="code-lang">{label || "Code"}</span>
        <button type="button" onClick={copy} className="code-copy">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {copied ? (
              <path d="M20 6 9 17l-5-5" />
            ) : (
              <>
                <rect x="8" y="8" width="13" height="13" rx="2" />
                <path d="M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2" />
              </>
            )}
          </svg>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre>
        <code>
          {tokens.map((token, i) =>
            token.k === "plain" ? (
              token.t
            ) : (
              <span key={i} className={`t-${token.k[0]}`}>
                {token.t}
              </span>
            ),
          )}
        </code>
      </pre>
    </div>
  );
}
