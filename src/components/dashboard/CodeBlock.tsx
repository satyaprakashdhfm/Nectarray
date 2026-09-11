"use client";

import { useMemo, useState } from "react";
import { highlight } from "@/lib/highlight";
import type { Token } from "@/lib/highlight";

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
  requirements: "Requirements",
  yaml: "YAML",
  yml: "YAML",
  html: "HTML",
  css: "CSS",
};

function Painted({ tokens }: { tokens: Token[] }) {
  return (
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
  );
}

function CopyButton({
  text,
  done,
  onDone,
}: {
  text: string;
  done: boolean;
  onDone: () => void;
}) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      onDone();
    } catch {
      // Clipboard access can be refused; the text is still selectable.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      data-done={done}
      aria-label={done ? "Copied" : "Copy this block"}
      className="code-copy"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {done ? (
          <path d="M20 6 9 17l-5-5" />
        ) : (
          <>
            <rect x="8" y="8" width="13" height="13" rx="2" />
            <path d="M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2" />
          </>
        )}
      </svg>
      {done ? "Copied" : "Copy"}
    </button>
  );
}

/**
 * A fenced block: the language in the corner, a copy button, the code.
 *
 * Students read these notes with an editor open beside them, and the thing
 * they do most often with a block is take it. Selecting twenty lines of
 * indented Python out of a scrolling container with a trackpad is a small
 * misery; a button is one click and cannot pick up the wrong indentation.
 *
 * With `output`, the program and what it prints share one card. Which way
 * they are arranged is left to CSS, because it depends on the room available
 * rather than on anything this component knows: the notes column runs to
 * about 90rem on a desktop, so both panes sit side by side and the pair
 * costs the height of the taller one; narrower than that, two columns of
 * monospace would be unreadable, so it falls back to a tab each and the pair
 * costs the height of one. Either way it is never the height of both, which
 * is what stacking them cost.
 *
 * The classes are short names from the style sheet rather than utilities: a
 * SQL lesson holds sixty of these blocks and several thousand coloured
 * tokens, and at twenty characters of class per token the colouring would
 * have cost more to send than the code it describes.
 */
export function CodeBlock({
  code,
  language,
  output,
  title,
}: {
  code: string;
  language: string;
  output?: string;
  /** Shown in the corner instead of the language — usually a file name. */
  title?: string;
}) {
  const [copied, setCopied] = useState("");
  const [pane, setPane] = useState<"code" | "output">("code");

  const codeTokens = useMemo(() => highlight(code, language), [code, language]);
  // Output is a terminal's words, not a program: colouring keywords in it
  // would claim a meaning the text does not have.
  const outTokens = useMemo(() => highlight(output ?? "", "text"), [output]);

  const label =
    title ?? LABEL[language.toLowerCase()] ?? language.toUpperCase();
  const mark = (key: string) => () => {
    setCopied(key);
    window.setTimeout(() => setCopied(""), 1600);
  };

  if (typeof output !== "string") {
    return (
      <div className="code-block">
        <div className="code-bar">
          <span className="code-lang">{label || "Code"}</span>
          <CopyButton
            text={code}
            done={copied === "code"}
            onDone={mark("code")}
          />
        </div>
        <Painted tokens={codeTokens} />
      </div>
    );
  }

  return (
    <div className="code-block code-duo">
      {/* Narrow only. Hidden once both panes fit beside each other. */}
      <div className="code-bar code-bar-tabs">
        <div className="code-tabs">
          <button
            type="button"
            aria-pressed={pane === "code"}
            onClick={() => setPane("code")}
            className={pane === "code" ? "code-tab is-on" : "code-tab"}
          >
            {label || "Code"}
          </button>
          <button
            type="button"
            aria-pressed={pane === "output"}
            onClick={() => setPane("output")}
            className={pane === "output" ? "code-tab is-on" : "code-tab"}
          >
            Output
          </button>
        </div>
        <CopyButton
          text={pane === "output" ? output : code}
          done={copied === "tab"}
          onDone={mark("tab")}
        />
      </div>

      <div className="code-duo-grid">
        <section
          className="code-pane"
          data-shown={pane === "code"}
          aria-label={label || "Code"}
        >
          {/* Wide only, one per column, so the two read as a pair. */}
          <div className="code-bar code-bar-pane">
            <span className="code-lang">{label || "Code"}</span>
            <CopyButton
              text={code}
              done={copied === "pane-code"}
              onDone={mark("pane-code")}
            />
          </div>
          <Painted tokens={codeTokens} />
        </section>

        <section
          className="code-pane"
          data-shown={pane === "output"}
          aria-label="Output"
        >
          <div className="code-bar code-bar-pane">
            <span className="code-lang">Output</span>
            <CopyButton
              text={output}
              done={copied === "pane-output"}
              onDone={mark("pane-output")}
            />
          </div>
          <Painted tokens={outTokens} />
        </section>
      </div>
    </div>
  );
}
