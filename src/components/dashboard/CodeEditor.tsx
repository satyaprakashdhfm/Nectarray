"use client";

import { useCallback, useMemo, useState } from "react";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import {
  acceptCompletion,
  autocompletion,
  startCompletion,
  type Completion,
  type CompletionContext,
  type CompletionResult,
} from "@codemirror/autocomplete";
import { indentLess, indentMore } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import {
  keywordCompletionSource,
  schemaCompletionSource,
  sql,
  SQLite,
  type SQLNamespace,
} from "@codemirror/lang-sql";
import {
  HighlightStyle,
  indentUnit,
  syntaxHighlighting,
} from "@codemirror/language";
import { keymap, type KeyBinding } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";
import { PRACTICE_TABLES } from "@/lib/practice-db";

/**
 * Token colours.
 *
 * Built out from the four the fenced blocks in the notes already use
 * (`.t-k` / `.t-s` / `.t-c` / `.t-n` in globals.css), so a `SELECT` or a
 * `def` here is the same blue a student just read in the lesson. The extra
 * entries are the ones an editor needs and a static block does not: a
 * definition should not look like a call, and a class should not look like
 * a keyword, or a screen of code reads as one undifferentiated colour.
 *
 * Always dark, in either UI theme — same reasoning as the code blocks: an
 * editor is an editor, and every student in the cohort has a dark one.
 */
const highlight = HighlightStyle.define([
  // def / class / import / return / if — the words that are the language
  { tag: [t.keyword, t.moduleKeyword], color: "#7cc4f8", fontWeight: 600 },
  {
    tag: [t.controlKeyword, t.operatorKeyword],
    color: "#c9a3ff",
    fontWeight: 600,
  },
  // `self`, `None`, `True` — language-provided names, not the student's
  { tag: [t.self, t.atom], color: "#f0906b" },

  // The name being declared, and the name being called: both yellow, which
  // is the convention every editor a student has seen already uses.
  { tag: [t.definition(t.variableName), t.function(t.variableName)], color: "#f5d67b" },
  { tag: [t.function(t.propertyName), t.macroName], color: "#f5d67b" },

  { tag: [t.className, t.typeName, t.namespace], color: "#5fd3bc" },
  { tag: [t.propertyName, t.attributeName], color: "#9fd4f5" },
  { tag: t.variableName, color: "rgba(236,240,244,0.88)" },

  { tag: [t.string, t.special(t.string), t.regexp], color: "#9ae6a4" },
  { tag: [t.number, t.bool, t.null], color: "#f0b37e" },
  { tag: [t.comment, t.lineComment, t.blockComment], color: "#7b8f9e", fontStyle: "italic" },
  { tag: t.docString, color: "#c9977a", fontStyle: "italic" },

  { tag: t.operator, color: "rgba(236,240,244,0.72)" },
  { tag: [t.punctuation, t.bracket, t.separator], color: "rgba(236,240,244,0.5)" },
  { tag: t.invalid, color: "#ff8a8a" },
]);

/**
 * The editor surface and its chrome.
 *
 * Sits on whatever dark panel the workspace gives it rather than painting
 * its own ground, so the editor and the bar above it are visibly one thing.
 */
const theme = EditorView.theme(
  {
    "&": {
      backgroundColor: "transparent",
      color: "rgba(236,240,244,0.9)",
      height: "100%",
      fontSize: "0.875rem",
    },
    ".cm-scroller": {
      fontFamily: "var(--font-mono)",
      lineHeight: "1.7",
    },
    ".cm-content": {
      padding: "0.75rem 0",
      caretColor: "#7cc4f8",
    },
    ".cm-line": { padding: "0 1rem" },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "#7cc4f8",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection":
      { backgroundColor: "rgba(124,196,248,0.22)" },
    ".cm-selectionMatch": { backgroundColor: "rgba(124,196,248,0.14)" },

    ".cm-gutters": {
      backgroundColor: "transparent",
      color: "rgba(236,240,244,0.28)",
      border: "none",
      paddingRight: "0.35rem",
      minWidth: "2.75rem",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      padding: "0 0.5rem 0 1rem",
    },
    ".cm-activeLine": { backgroundColor: "rgba(255,255,255,0.045)" },
    ".cm-activeLineGutter": {
      backgroundColor: "transparent",
      color: "rgba(236,240,244,0.7)",
    },

    ".cm-matchingBracket, &.cm-focused .cm-matchingBracket": {
      backgroundColor: "rgba(124,196,248,0.2)",
      outline: "1px solid rgba(124,196,248,0.45)",
      borderRadius: "2px",
    },
    ".cm-nonmatchingBracket": {
      backgroundColor: "rgba(255,138,138,0.18)",
      outline: "1px solid rgba(255,138,138,0.4)",
    },

    /* Autocomplete: a small panel, not a browser dropdown. */
    ".cm-tooltip": { border: "none", backgroundColor: "transparent" },
    ".cm-tooltip.cm-tooltip-autocomplete": {
      backgroundColor: "#141922",
      border: "1px solid rgba(255,255,255,0.14)",
      borderRadius: "0.625rem",
      overflow: "hidden",
      boxShadow: "0 18px 40px -18px rgba(0,0,0,0.9)",
    },
    ".cm-tooltip.cm-tooltip-autocomplete > ul": {
      fontFamily: "var(--font-mono)",
      fontSize: "0.8125rem",
      maxHeight: "15rem",
    },
    ".cm-tooltip.cm-tooltip-autocomplete > ul > li": {
      padding: "0.3rem 0.7rem",
      lineHeight: "1.5",
    },
    ".cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]": {
      backgroundColor: "rgba(124,196,248,0.2)",
      color: "#fff",
    },
    ".cm-completionIcon": { opacity: 0.55, paddingRight: "0.6rem" },
    ".cm-completionLabel": { color: "rgba(236,240,244,0.92)" },
    ".cm-completionMatchedText": {
      color: "#7cc4f8",
      textDecoration: "none",
      fontWeight: 700,
    },
    ".cm-completionDetail": {
      color: "rgba(236,240,244,0.38)",
      fontStyle: "normal",
      marginLeft: "0.6rem",
    },

    ".cm-placeholder": { color: "rgba(236,240,244,0.3)" },
    "&.cm-focused": { outline: "none" },
  },
  { dark: true },
);

/**
 * The training schema, shaped the way `@codemirror/lang-sql` wants it.
 *
 * Every column carries its type and whether it is a key, because that is the
 * question a student actually has mid-query — "is this a date or a string",
 * "which one joins to admissions". The table itself gets a `self` completion
 * so `FROM pat…` offers `patients` with its size rather than a bare word.
 */
function sqlSchema(): SQLNamespace {
  const schema: Record<string, { self: Completion; children: Completion[] }> =
    {};
  for (const table of PRACTICE_TABLES) {
    schema[table.name] = {
      self: {
        label: table.name,
        type: "type",
        detail: `table · ${table.columns.length} columns`,
      },
      children: table.columns.map((column) => columnCompletion(table.name, column)),
    };
  }
  return schema;
}

/** One column, described the way the completion panel will show it. */
function columnCompletion(
  table: string,
  column: (typeof PRACTICE_TABLES)[number]["columns"][number],
): Completion {
  const key = column.key === "pk" ? " · pk" : column.key === "fk" ? " · fk" : "";
  return {
    label: column.name,
    type: column.key === "pk" ? "constant" : "property",
    detail: `${column.type}${key}`,
    info: `${table}.${column.name}`,
  };
}

/**
 * Everything in the training database, offered on a bare word.
 *
 * `schemaCompletionSource` only knows what to suggest once the query says
 * which table it is about — after `FROM`, or behind a `patients.` prefix.
 * Half of typing a query happens before that: `SELECT fi…` has no table in
 * scope yet, and answering it with nothing is the difference between an
 * editor that helps and one that waits. So every column is offered here too,
 * each labelled with the table it came from, which doubles as a way to learn
 * the schema without going back to the panel on the left.
 */
function practiceColumns(): Completion[] {
  const out: Completion[] = [];
  for (const table of PRACTICE_TABLES) {
    for (const column of table.columns) {
      const base = columnCompletion(table.name, column);
      out.push({
        ...base,
        // The table belongs in the detail here: patients and doctors both
        // carry a first_name, and which one you meant is the whole question.
        detail: `${base.detail} · ${table.name}`,
        boost: 1,
      });
    }
  }
  return out;
}

/** Where a table name belongs and a column does not. */
const TABLE_POSITION = /\b(from|join|into|update|table)\s+[\w$]*$/i;

/** A word being typed, completed against the columns we ship. */
function schemaWordSource(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/[\w$]+/);
  if (!word || (word.from === word.to && !context.explicit)) return null;

  // After a dot the SQL source knows which table is meant and answers
  // precisely; every column of every table on top would bury that answer.
  if (context.matchBefore(/\.[\w$]*/)) return null;

  // Straight after FROM or JOIN the answer is a table, and the SQL source
  // gives those. Offering columns as well would push the table being asked
  // for below a list of things that cannot go there.
  const line = context.state.doc.lineAt(context.pos);
  if (TABLE_POSITION.test(line.text.slice(0, context.pos - line.from))) {
    return null;
  }

  return { from: word.from, options: practiceColumns(), validFor: /^[\w$]*$/ };
}

export type EditorLanguage = "python" | "sql";

/**
 * The editor both practice workspaces write in.
 *
 * One component rather than one per language, because everything a student
 * would notice — the colours, the completion panel, what Tab does, what
 * Enter does — should not depend on which tab they are on. Only the
 * language pack and the indent width differ.
 */
export function CodeEditor({
  value,
  onChange,
  onRun,
  language,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  /** Ctrl/⌘ + Enter, the shortcut both workspaces advertise. */
  onRun: () => void;
  language: EditorLanguage;
  placeholder?: string;
}) {
  const [cursor, setCursor] = useState({ line: 1, col: 1 });

  const cursorWatcher = useMemo(
    () =>
      EditorView.updateListener.of((update) => {
        if (!update.selectionSet && !update.docChanged) return;
        const head = update.state.selection.main.head;
        const line = update.state.doc.lineAt(head);
        setCursor({ line: line.number, col: head - line.from + 1 });
      }),
    [],
  );

  /*
   * Tab is a chain, tried in order: take the highlighted suggestion if the
   * completion panel is open, otherwise indent. `acceptCompletion` returns
   * false when there is nothing to accept, which is what lets the next
   * binding run — so Tab never does nothing, and never does both.
   *
   * A code editor that moved focus on Tab would not be a code editor, so
   * Escape first is the way out for anyone navigating by keyboard.
   */
  const editing: KeyBinding[] = useMemo(
    () => [
      { key: "Tab", run: acceptCompletion },
      { key: "Tab", run: indentMore, shift: indentLess },
      { key: "Ctrl-Space", run: startCompletion },
      { key: "Mod-Enter", run: () => (onRun(), true), preventDefault: true },
    ],
    [onRun],
  );

  const extensions = useMemo(
    () => [
      language === "python"
        ? python()
        : sql({ dialect: SQLite, schema: sqlSchema(), upperCaseKeywords: true }),
      /*
       * Python keeps the language pack's own sources (builtins, and the
       * names already in the file). SQL gets an explicit list instead, in
       * priority order — what is in the database first, keywords after —
       * because a student typing `fi` wants `first_name`, not `FILTER`.
       */
      language === "python"
        ? autocompletion()
        : autocompletion({
            override: [
              schemaCompletionSource({ dialect: SQLite, schema: sqlSchema() }),
              schemaWordSource,
              keywordCompletionSource(SQLite, true),
            ],
          }),
      // Four for Python because that is the language's own rule; two for SQL
      // because a query nests far deeper and four runs off the panel.
      indentUnit.of(language === "python" ? "    " : "  "),
      syntaxHighlighting(highlight),
      theme,
      keymap.of(editing),
      cursorWatcher,
      EditorView.lineWrapping,
    ],
    [language, editing, cursorWatcher],
  );

  const handleChange = useCallback(
    (next: string) => onChange(next),
    [onChange],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-hidden">
        <CodeMirror
          value={value}
          onChange={handleChange}
          extensions={extensions}
          /*
           * Not "light", which is what this component defaults to — and
           * that default is why the editor was unreadable. It paints a white
           * ground, our theme paints near-white text on top of it, and
           * everything that was not a coloured token — variables, plain
           * text, the caret — went white on white. `none` leaves the ground
           * to the panel and the colours to the theme above.
           */
          theme="none"
          /* Tab is bound above, as a chain that tries completion first —
             this would bind it again to indent only. */
          indentWithTab={false}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
            // Configured above instead, so the SQL sources and their order
            // are ours rather than the default set's.
            autocompletion: false,
            bracketMatching: true,
            closeBrackets: true,
            indentOnInput: true,
            highlightSelectionMatches: true,
            tabSize: language === "python" ? 4 : 2,
          }}
          placeholder={placeholder}
          height="100%"
          className="h-full"
        />
      </div>
      {/* Where the caret is, which is the one thing a plain textarea could
          never tell you and every editor a student has used does. */}
      <div className="border-night-line flex shrink-0 items-center justify-end gap-3 border-t px-3 py-1 font-mono text-[0.6875rem] text-white/35">
        <span>
          Ln {cursor.line}, Col {cursor.col}
        </span>
      </div>
    </div>
  );
}
