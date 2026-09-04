"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Play, RotateCcw } from "lucide-react";
import initSqlJs, { type Database, type SqlValue } from "sql.js";
import { PRACTICE_SCHEMA, PRACTICE_TABLES } from "@/lib/practice-db";

type Result = { columns: string[]; rows: unknown[][] };

/*
 * sql.js loads SQLite compiled to WebAssembly. There is no server behind
 * this: the database lives in the tab, so a query is instant, works offline,
 * and the worst a student can do is DROP their own copy — which a refresh
 * puts back.
 *
 * The module is loaded once per page and shared, because instantiating the
 * WASM twice would download and compile 640 KB twice.
 */
let sqlPromise: ReturnType<typeof initSqlJs> | null = null;

/** Loaded once per page: instantiating twice would compile 640 KB twice. */
function loadSqlJs() {
  sqlPromise ??= initSqlJs({ locateFile: () => "/sql/sql-wasm.wasm" });
  return sqlPromise;
}

export function SqlPlayground({
  initialQuery = "SELECT * FROM students;",
}: {
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const dbRef = useRef<Database | null>(null);

  /*
   * The database is built on first use rather than on mount. It keeps 640 KB
   * of WebAssembly off the wire for anyone who never runs a query, and it
   * means no state is set from an effect — the load belongs to the click
   * that needed it.
   */
  async function ensureDb(rebuild = false) {
    if (dbRef.current && !rebuild) return dbRef.current;
    const SQL = await loadSqlJs();
    const db = new SQL.Database();
    db.exec(PRACTICE_SCHEMA);
    dbRef.current?.close();
    dbRef.current = db;
    return db;
  }

  // Only tears down; nothing is set, so nothing to re-render.
  useEffect(() => {
    return () => {
      dbRef.current?.close();
      dbRef.current = null;
    };
  }, []);

  async function reset() {
    setRunning(true);
    try {
      await ensureDb(true);
      setResult(null);
      setFailed(false);
      setMessage("Database reset to its original rows.");
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setRunning(false);
    }
  }

  async function run() {
    if (running) return;
    setRunning(true);
    setMessage("");
    setFailed(false);

    try {
      const db = await ensureDb();
      const output = db.exec(query);
      if (output.length === 0) {
        // Statements like INSERT and CREATE return no result set. That is a
        // success, not an empty table, and saying so avoids "did it work?".
        setResult(null);
        setMessage("Statement ran. No rows returned.");
      } else {
        // Only the last result set is shown, which is what a student means
        // when they run several statements and look at the bottom one.
        const last = output[output.length - 1];
        setResult({ columns: last.columns, rows: last.values });
      }
    } catch (error) {
      setResult(null);
      setFailed(true);
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setRunning(false);
    }
  }

  function onKeyDown(event: React.KeyboardEvent) {
    // Ctrl/Cmd+Enter runs, the shortcut every SQL client already uses.
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      void run();
    }
  }

  const isError = failed && message !== "";

  return (
    <div className="card overflow-hidden">
      <div className="border-line-soft flex flex-wrap items-center gap-3 border-b px-5 py-3">
        <span className="eyebrow">SQL playground</span>
        <span className="text-ink-faint text-[0.8125rem]">
          Runs in your browser — nothing is sent anywhere.
        </span>

        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => void reset()}
            title="Reset the database"
            className="border-line text-ink-soft hover:text-ink inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[0.8125rem] font-medium transition-colors"
          >
            <RotateCcw className="size-3.5" strokeWidth={2} aria-hidden />
            Reset
          </button>
          <button
            type="button"
            onClick={() => void run()}
            disabled={running}
            className="bg-ink hover:bg-brand-deep disabled:hover:bg-ink inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-[0.8125rem] font-semibold text-white transition-colors disabled:opacity-40"
          >
            {running ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
            ) : (
              <Play className="size-3.5" strokeWidth={2.5} aria-hidden />
            )}
            {running ? "Running…" : "Run"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_13rem]">
        <div className="min-w-0">
          <label className="sr-only" htmlFor="sql-editor">
            SQL query
          </label>
          <textarea
            id="sql-editor"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            rows={7}
            className="bg-night w-full resize-y border-0 p-5 font-mono text-[0.875rem] leading-[1.7] text-white/90 focus:outline-none"
          />
        </div>

        {/* Schema crib, so nobody guesses at column names */}
        <div className="border-line-soft bg-mist border-t p-5 lg:border-t-0 lg:border-l">
          <p className="eyebrow mb-3">Tables</p>
          <ul className="space-y-3">
            {PRACTICE_TABLES.map((table) => (
              <li key={table.name}>
                <button
                  type="button"
                  onClick={() => setQuery(`SELECT * FROM ${table.name};`)}
                  className="text-brand-deep font-mono text-[0.8125rem] font-semibold hover:underline"
                >
                  {table.name}
                </button>
                <span className="text-ink-faint mt-0.5 block font-mono text-[0.6875rem] leading-snug">
                  {table.columns}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Output ---------------------------------------------------------- */}
      <div className="border-line-soft border-t">
        {isError ? (
          <p className="text-amber-deep bg-amber-wash px-5 py-4 font-mono text-[0.8125rem]">
            {message}
          </p>
        ) : message ? (
          <p className="text-ink-soft px-5 py-4 text-[0.875rem]">{message}</p>
        ) : result ? (
          <>
            <div className="max-h-[26rem] overflow-auto">
              <table className="w-full text-left text-[0.8125rem]">
                <thead className="bg-mist sticky top-0">
                  <tr>
                    {result.columns.map((column) => (
                      <th
                        key={column}
                        className="text-ink border-line-soft border-b px-4 py-2.5 font-mono font-semibold whitespace-nowrap"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className={`border-line-soft border-b px-4 py-2.5 font-mono whitespace-nowrap ${
                            cell === null
                              ? "text-ink-faint italic"
                              : "text-ink-soft"
                          }`}
                        >
                          {/* NULL is not the empty string, and a blank cell
                              is the single most common misreading here. */}
                          {cell === null ? "NULL" : String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-ink-faint border-line-soft border-t px-5 py-2.5 text-[0.8125rem]">
              {result.rows.length} row{result.rows.length === 1 ? "" : "s"}
            </p>
          </>
        ) : (
          <p className="text-ink-faint px-5 py-4 text-[0.875rem]">
            Write a query and press Run — or Ctrl/Cmd + Enter.
          </p>
        )}
      </div>
    </div>
  );
}
