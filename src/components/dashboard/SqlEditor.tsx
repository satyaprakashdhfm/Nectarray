"use client";

import { useMemo } from "react";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { acceptCompletion, startCompletion } from "@codemirror/autocomplete";
import { sql, SQLite, type SQLNamespace } from "@codemirror/lang-sql";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { keymap } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";
import { PRACTICE_TABLES } from "@/lib/practice-db";

/**
 * Token colours, matching the palette `.t-k` / `.t-s` / `.t-c` / `.t-n`
 * already use for every other fenced block on the site (globals.css) — so a
 * `SELECT` here and a `SELECT` in the course notes are the same blue.
 */
const highlight = HighlightStyle.define([
  { tag: t.keyword, color: "#7cc4f8", fontWeight: 600 },
  { tag: [t.string, t.special(t.string)], color: "#9ae6a4" },
  { tag: [t.number, t.bool, t.null], color: "#f0b37e" },
  { tag: t.comment, color: "#7b8f9e", fontStyle: "italic" },
  { tag: [t.typeName, t.className], color: "#c9a3ff" },
  { tag: t.operator, color: "rgba(255,255,255,0.75)" },
  { tag: [t.punctuation, t.bracket], color: "rgba(255,255,255,0.55)" },
  { tag: t.function(t.variableName), color: "#7cc4f8" },
]);

/** Panel chrome and the editor surface, dropped over the site's night ink. */
const theme = EditorView.theme(
  {
    "&": {
      backgroundColor: "transparent",
      color: "rgba(255,255,255,0.9)",
      height: "100%",
      fontSize: "0.875rem",
    },
    ".cm-content": {
      fontFamily: "var(--font-mono)",
      padding: "1rem",
      caretColor: "#fff",
    },
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#fff" },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
      backgroundColor: "rgba(124,196,248,0.25)",
    },
    ".cm-gutters": {
      backgroundColor: "transparent",
      color: "rgba(255,255,255,0.25)",
      border: "none",
    },
    ".cm-activeLine": { backgroundColor: "rgba(255,255,255,0.04)" },
    ".cm-activeLineGutter": { backgroundColor: "transparent" },
    ".cm-matchingBracket, .cm-nonmatchingBracket": {
      backgroundColor: "rgba(124,196,248,0.25)",
      outline: "1px solid rgba(124,196,248,0.5)",
    },
    ".cm-tooltip-autocomplete": {
      backgroundColor: "#0f1720",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "0.5rem",
      overflow: "hidden",
      fontFamily: "var(--font-mono)",
      fontSize: "0.8125rem",
    },
    ".cm-tooltip-autocomplete ul li[aria-selected]": {
      backgroundColor: "rgba(124,196,248,0.18)",
      color: "#fff",
    },
    ".cm-tooltip-autocomplete .cm-completionIcon": { opacity: 0.6 },
    ".cm-completionLabel": { color: "rgba(255,255,255,0.9)" },
    ".cm-completionDetail": {
      color: "rgba(255,255,255,0.4)",
      fontStyle: "normal",
      marginLeft: "0.5rem",
    },
    "&.cm-focused": { outline: "none" },
  },
  { dark: true },
);

/** Tab inserts the highlighted suggestion; only falls through when there is
 *  none to accept, so a student who wants an actual tab still gets one. */
const tabCompletion = keymap.of([
  { key: "Tab", run: acceptCompletion },
  { key: "Ctrl-Space", run: startCompletion },
]);

/**
 * The training schema, shaped the way `@codemirror/lang-sql`'s completion
 * source wants it — a table name mapped to its columns — so `SELECT p.` and
 * `FROM pat…` both suggest real things rather than nothing.
 */
function useSchema(): SQLNamespace {
  return useMemo(() => {
    const schema: Record<string, string[]> = {};
    for (const table of PRACTICE_TABLES) {
      schema[table.name] = table.columns.map((c) => c.name);
    }
    return schema;
  }, []);
}

/**
 * The query editor: SQL syntax highlighting, bracket matching and
 * schema-aware autocomplete on table and column names, tuned to sit inside
 * the same dark panel the plain textarea used to fill.
 *
 * Kept as its own component rather than inlined in SqlPractice — the schema
 * memo and the theme/highlight objects are only worth building once, and a
 * Python editor with the same shell can reuse this file's theme later
 * without also reusing SQL-specific pieces.
 */
export function SqlEditor({
  value,
  onChange,
  onRun,
}: {
  value: string;
  onChange: (value: string) => void;
  /** Ctrl/⌘ + Enter — the shortcut the placeholder already advertised. */
  onRun: () => void;
}) {
  const schema = useSchema();

  /*
   * `onRun` is included in the deps rather than boxed in a ref: it changes
   * identity on every keystroke (the parent re-renders on every one, since
   * the query itself is state there), so this recomputes just as often. That
   * only means one more `StateEffect.reconfigure` dispatch per keystroke —
   * `@uiw/react-codemirror` is built to take a changing `extensions` array
   * this way, and it costs nothing a typist would ever feel.
   */
  const extensions = useMemo(
    () => [
      sql({ dialect: SQLite, schema, upperCaseKeywords: true }),
      syntaxHighlighting(highlight),
      theme,
      tabCompletion,
      keymap.of([
        {
          key: "Mod-Enter",
          run: () => {
            onRun();
            return true;
          },
        },
      ]),
      EditorView.lineWrapping,
    ],
    [schema, onRun],
  );

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={extensions}
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        highlightActiveLine: true,
        autocompletion: true,
        bracketMatching: true,
        closeBrackets: true,
        indentOnInput: true,
      }}
      placeholder={"SELECT * FROM patients;\n\nCtrl/⌘ + Enter to run."}
      height="100%"
      className="h-full"
    />
  );
}
