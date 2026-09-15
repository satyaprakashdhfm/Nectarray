"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { EditorView } from "@uiw/react-codemirror";
import {
  Download,
  ExternalLink,
  FileText,
  ListTree,
  LoaderCircle,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";
import { CodeEditor } from "@/components/dashboard/CodeEditor";
import {
  RESUME_FILE_NAMES,
  RESUME_MAIN,
  type ResumeFileName,
  type ResumeFiles,
} from "@/lib/resume-files";
import { cn } from "@/lib/utils";
import { PlacementBar, SaveIndicator } from "./PlacementBar";
import { putPlacement, recallSaved, useAutosave } from "./use-autosave";

type Problem = { message: string; file?: string; line?: number; log?: string };

function isResumeFile(name: string | undefined): name is ResumeFileName {
  return (RESUME_FILE_NAMES as readonly string[]).includes(name ?? "");
}

/** Every `\section{…}` in the document, with the line it starts on. */
function sectionsOf(tex: string) {
  const found: { title: string; line: number }[] = [];
  tex.split("\n").forEach((text, index) => {
    const match = /^\s*\\section\*?\{([^}]*)\}/.exec(text);
    if (match) {
      found.push({ title: match[1].replace(/\\&/g, "&"), line: index + 1 });
    }
  });
  return found;
}

function goToLine(editor: EditorView | null, line: number) {
  if (!editor) return;
  const doc = editor.state.doc;
  const target = doc.line(Math.max(1, Math.min(line, doc.lines)));
  editor.dispatch({
    selection: { anchor: target.from },
    effects: EditorView.scrollIntoView(target.from, { y: "start", yMargin: 16 }),
  });
  editor.focus();
}

const secondaryButton =
  "border-line bg-surface text-ink hover:bg-mist inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-[0.875rem] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

/**
 * The resume, as LaTeX, beside the PDF it compiles to.
 *
 * Laid out the way Overleaf is, because that is where the template came from
 * and where most students will have seen it: files and outline, source, PDF.
 * The source autosaves; the PDF is rebuilt on open and whenever the student
 * asks, from what is in the editor rather than what was last saved.
 */
export function ResumeStudio({
  userId,
  initialFiles,
  pdfName,
  compilerReady,
  tabs,
}: {
  userId: string;
  initialFiles: ResumeFiles;
  pdfName: string;
  compilerReady: boolean;
  tabs: ReactNode;
}) {
  const key = `resume:${userId}`;
  const [files, setFiles] = useState<ResumeFiles>(
    () =>
      JSON.parse(recallSaved(key, JSON.stringify(initialFiles))) as ResumeFiles,
  );
  const [open, setOpen] = useState<ResumeFileName>(RESUME_MAIN);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [compiling, setCompiling] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [showLog, setShowLog] = useState(false);

  const serialized = useMemo(() => JSON.stringify(files), [files]);
  const save = useCallback(
    (value: string, keepalive: boolean) =>
      putPlacement(`{"files":${value}}`, keepalive),
    [],
  );
  const { status, saveNow } = useAutosave(key, serialized, save);

  // Read by compile, so compile itself can stay stable across keystrokes —
  // it is bound to Ctrl/⌘ + Enter inside the editor.
  const filesRef = useRef(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  const view = useRef<EditorView | null>(null);
  const pendingLine = useRef<number | null>(null);
  const objectUrl = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    },
    [],
  );

  const compile = useCallback(async () => {
    if (!compilerReady) return;
    setCompiling(true);
    try {
      const response = await fetch("/api/placement/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: filesRef.current }),
      });
      if (response.ok) {
        const url = URL.createObjectURL(await response.blob());
        if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
        objectUrl.current = url;
        setPdfUrl(url);
        setProblem(null);
        setShowLog(false);
      } else {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
          file?: string;
          line?: number;
          log?: string;
        };
        setProblem({
          message: data.error ?? "Could not compile.",
          file: data.file,
          line: data.line,
          log: data.log,
        });
      }
    } catch {
      setProblem({
        message: "Could not reach the compiler. Check your connection and try again.",
      });
    } finally {
      setCompiling(false);
    }
  }, [compilerReady]);

  const recompile = useCallback(() => void compile(), [compile]);

  // Compile once on open, so the PDF is there without asking. Deferred a
  // tick so a development double-mount schedules it once, not twice.
  useEffect(() => {
    const timer = setTimeout(() => void compile(), 0);
    return () => clearTimeout(timer);
  }, [compile]);

  const change = useCallback(
    (next: string) => setFiles((prev) => ({ ...prev, [open]: next })),
    [open],
  );

  const jump = useCallback(
    (file: ResumeFileName, line: number) => {
      if (file === open) {
        goToLine(view.current, line);
        return;
      }
      // The editor remounts for the other file; land there once it exists.
      pendingLine.current = line;
      setOpen(file);
    },
    [open],
  );

  const onView = useCallback((editor: EditorView) => {
    view.current = editor;
    const line = pendingLine.current;
    if (line !== null) {
      pendingLine.current = null;
      requestAnimationFrame(() => goToLine(editor, line));
    }
  }, []);

  const sections = useMemo(() => sectionsOf(files[RESUME_MAIN]), [files]);

  return (
    <div className="flex min-h-[calc(100dvh-var(--app-chrome))] flex-col lg:h-[calc(100dvh-var(--app-chrome))]">
      <PlacementBar tabs={tabs}>
        <SaveIndicator status={status} />
        <button
          type="button"
          onClick={recompile}
          disabled={!compilerReady || compiling}
          className="bg-brand-solid text-cta-fg hover:bg-brand-deep inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[0.875rem] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {compiling ? (
            <LoaderCircle className="size-4 animate-spin" strokeWidth={2.2} aria-hidden />
          ) : (
            <RefreshCw className="size-4" strokeWidth={2.2} aria-hidden />
          )}
          {compiling ? "Compiling…" : "Recompile"}
        </button>
        {pdfUrl ? (
          <a href={pdfUrl} download={pdfName} className={secondaryButton}>
            <Download className="size-4" strokeWidth={2} aria-hidden />
            Download PDF
          </a>
        ) : (
          <button type="button" disabled className={secondaryButton}>
            <Download className="size-4" strokeWidth={2} aria-hidden />
            Download PDF
          </button>
        )}
      </PlacementBar>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Files and outline ------------------------------------------- */}
        <aside className="border-line bg-mist hidden w-56 shrink-0 overflow-y-auto border-r py-4 lg:block">
          <p className="text-ink-faint px-4 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase">
            Files
          </p>
          <ul className="mt-2 space-y-0.5 px-2">
            {RESUME_FILE_NAMES.map((name) => (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => setOpen(name)}
                  aria-current={open === name ? "true" : undefined}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left font-mono text-[0.8125rem] transition-colors",
                    open === name
                      ? "bg-brand-wash text-brand-deep font-semibold"
                      : "text-ink-soft hover:bg-surface hover:text-ink",
                  )}
                >
                  <FileText className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
                  {name}
                </button>
              </li>
            ))}
          </ul>

          <p className="text-ink-faint mt-6 flex items-center gap-1.5 px-4 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase">
            <ListTree className="size-3.5" strokeWidth={2} aria-hidden />
            Outline
          </p>
          <ul className="mt-2 space-y-0.5 px-2">
            {sections.map((section) => (
              <li key={`${section.line}-${section.title}`}>
                <button
                  type="button"
                  onClick={() => jump(RESUME_MAIN, section.line)}
                  className="text-ink-soft hover:bg-surface hover:text-ink w-full truncate rounded-md px-2.5 py-1.5 text-left text-[0.8125rem] transition-colors"
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Source ------------------------------------------------------ */}
        <section
          aria-label="LaTeX source"
          className="bg-night flex min-h-[65vh] min-w-0 flex-1 flex-col lg:min-h-0"
        >
          <div className="border-night-line flex shrink-0 items-center gap-1 overflow-x-auto border-b px-2 py-1.5">
            {RESUME_FILE_NAMES.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setOpen(name)}
                aria-current={open === name ? "true" : undefined}
                className={cn(
                  "shrink-0 rounded-md px-2.5 py-1 font-mono text-[0.75rem] transition-colors",
                  open === name
                    ? "bg-white/10 text-white"
                    : "text-white/45 hover:text-white/80",
                )}
              >
                {name}
              </button>
            ))}
            <span className="ml-auto hidden shrink-0 pr-1 text-[0.6875rem] text-white/35 xl:inline">
              Ctrl/⌘ + S saves · Ctrl/⌘ + Enter recompiles
            </span>
          </div>
          <CodeEditor
            key={open}
            language="latex"
            value={files[open]}
            onChange={change}
            onRun={recompile}
            onSave={saveNow}
            onView={onView}
          />
        </section>

        {/* Preview ----------------------------------------------------- */}
        <section
          aria-label="PDF preview"
          className="border-line bg-mist-deep flex min-h-[75vh] min-w-0 flex-1 flex-col lg:min-h-0 lg:border-l"
        >
          {problem && (
            <div className="border-line bg-amber-wash shrink-0 border-b px-4 py-3">
              <p className="text-amber-deep flex items-start gap-2 text-[0.875rem] font-semibold">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={2.2} aria-hidden />
                <span>
                  {problem.file && problem.line
                    ? `${problem.file}, line ${problem.line}: `
                    : ""}
                  {problem.message}
                </span>
              </p>
              <div className="mt-1.5 flex flex-wrap gap-4 pl-6 text-[0.8125rem]">
                {isResumeFile(problem.file) && problem.line && (
                  <button
                    type="button"
                    onClick={() => jump(problem.file as ResumeFileName, problem.line!)}
                    className="text-amber-deep font-semibold underline underline-offset-2"
                  >
                    Go to line {problem.line}
                  </button>
                )}
                {problem.log && (
                  <button
                    type="button"
                    onClick={() => setShowLog((shown) => !shown)}
                    className="text-ink-soft hover:text-ink underline underline-offset-2"
                  >
                    {showLog ? "Hide the log" : "Show the full log"}
                  </button>
                )}
              </div>
              {showLog && problem.log && (
                <pre className="bg-night mt-3 max-h-64 overflow-auto rounded-lg p-3 font-mono text-[0.72rem] leading-relaxed whitespace-pre-wrap text-white/75">
                  {problem.log}
                </pre>
              )}
            </div>
          )}

          <div className="relative min-h-0 flex-1">
            {pdfUrl ? (
              <iframe
                key={pdfUrl}
                src={`${pdfUrl}#view=FitH&navpanes=0`}
                title="Resume preview"
                className="absolute inset-0 size-full"
              />
            ) : (
              <div className="grid size-full place-items-center p-8 text-center">
                <p className="text-ink-soft max-w-xs text-[0.9375rem] leading-relaxed">
                  {!compilerReady
                    ? "The PDF preview isn't connected on this server yet. Your edits still save."
                    : compiling
                      ? "Compiling your resume…"
                      : problem
                        ? "Fix the error above, then recompile to see your PDF."
                        : "Press Recompile to see your PDF."}
                </p>
              </div>
            )}
          </div>

          {/* Phones rarely draw a PDF inside a page; open it instead. */}
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener"
              className="border-line bg-surface text-brand-deep flex shrink-0 items-center justify-center gap-2 border-t px-4 py-3 text-[0.875rem] font-semibold lg:hidden"
            >
              <ExternalLink className="size-4" strokeWidth={2} aria-hidden />
              Open the PDF
            </a>
          )}
        </section>
      </div>
    </div>
  );
}
