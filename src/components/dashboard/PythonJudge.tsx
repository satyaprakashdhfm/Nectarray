"use client";

import { useCallback, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  Lightbulb,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Play,
  RotateCcw,
  X,
} from "lucide-react";
import { ProofUpload } from "@/components/dashboard/ProofUpload";
import { display, displayArgs } from "@/lib/judge";
import { cn } from "@/lib/utils";

/**
 * The public half of a problem. Expected outputs stay on the server — a
 * student who can read them does not need to solve anything.
 */
export type ProblemBrief = {
  slug: string;
  starter_code: string;
  note: string;
  case_count: number;
  samples: { args: unknown[]; expect: unknown }[];
};

export type PyQuestion = {
  id: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  position: number;
  title: string;
  prompt_md: string | null;
  hint_md: string | null;
  leetcode_url: string | null;
  has_judge: boolean;
};

const DIFF_TONE: Record<string, string> = {
  easy: "bg-leaf-wash text-leaf-deep",
  medium: "bg-amber-wash text-amber-deep",
  hard: "bg-brand-wash text-brand-deep",
};

const slugOf = (url: string | null) =>
  url ? (/\/problems\/([^/]+)/.exec(url)?.[1] ?? null) : null;

type Failing = {
  number: number;
  args: unknown[];
  expect: unknown;
  got: unknown;
  error: string | null;
};

type Verdict = {
  verdict: "accepted" | "wrong" | "timeout" | "error";
  passed?: number;
  total?: number;
  ms?: number | null;
  results?: boolean[];
  failing?: Failing | null;
  message?: string;
};

type Run =
  | { at: "idle" }
  | { at: "running" }
  | { at: "failed"; message: string }
  | { at: "done"; verdict: Verdict };

/** Pointer-drag sizing, matching the SQL workspace's splitters. */
function useDragSize(initial: number, min: number, max: number) {
  const [size, setSize] = useState(initial);
  const state = useRef({ start: 0, base: 0, sign: 1, axis: "x" as "x" | "y" });

  const begin = useCallback(
    (event: React.PointerEvent, sign: 1 | -1, axis: "x" | "y" = "x") => {
      event.preventDefault();
      state.current = {
        start: axis === "x" ? event.clientX : event.clientY,
        base: size,
        sign,
        axis,
      };
      const move = (moveEvent: PointerEvent) => {
        const { start, base, sign: s, axis: a } = state.current;
        const now = a === "x" ? moveEvent.clientX : moveEvent.clientY;
        setSize(Math.min(max, Math.max(min, base + (now - start) * s)));
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        document.body.style.userSelect = "";
      };
      document.body.style.userSelect = "none";
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    },
    [size, min, max],
  );

  return [size, begin] as const;
}

/**
 * The Python workspace.
 *
 * Code goes up, a verdict comes back. Judging on the server rather than in
 * the page is what lets the expected outputs stay hidden: a browser-side
 * judge has to ship the answers to the browser, and a student who opens the
 * network tab then has the answer key. The service that executes the code
 * never sees the expectations either — only the web app holds both halves.
 */
export function PythonJudge({
  questions,
  briefs,
  solved: initialSolved,
}: {
  questions: PyQuestion[];
  briefs: Record<string, ProblemBrief>;
  solved: string[];
}) {
  const [index, setIndex] = useState(0);
  const [edited, setEdited] = useState<string | null>(null);
  const [run, setRun] = useState<Run>({ at: "idle" });
  const [solved, setSolved] = useState<string[]>(initialSolved);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solutionText, setSolutionText] = useState<string | null>(null);

  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [leftWidth, dragLeft] = useDragSize(268, 200, 420);
  const [rightWidth, dragRight] = useDragSize(360, 280, 620);
  const [editorHeight, dragEditor] = useDragSize(320, 140, 700);

  const question = questions[index];
  const slug = slugOf(question?.leetcode_url ?? null);
  const brief = slug ? briefs[slug] : undefined;

  /*
   * The editor holds the student's edit, or null while they have not touched
   * it — the starter code is then derived from whichever problem is open.
   */
  const code = edited ?? brief?.starter_code ?? "";

  function go(next: number) {
    setIndex(next);
    setRun({ at: "idle" });
    setShowHint(false);
    setShowSolution(false);
    setSolutionText(null);
    setEdited(null);
  }

  async function judge() {
    if (!question || !slug || run.at === "running") return;
    setRun({ at: "running" });

    try {
      const response = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question.id, slug, source: code }),
      });
      const data = (await response.json()) as Verdict & { error?: string };

      if (!response.ok) {
        setRun({
          at: "failed",
          message: data.error ?? "Something went wrong.",
        });
        return;
      }

      setRun({ at: "done", verdict: data });
      if (data.verdict === "accepted" && !solved.includes(question.id)) {
        setSolved((prev) => [...prev, question.id]);
      }
    } catch {
      setRun({ at: "failed", message: "Could not reach the judge." });
    }
  }

  /** Fetched only when asked for, so it is not sitting in the page markup. */
  async function revealSolution() {
    if (showSolution) {
      setShowSolution(false);
      return;
    }
    setShowSolution(true);
    if (solutionText === null && slug) {
      const response = await fetch(
        `/api/judge/solution?slug=${encodeURIComponent(slug)}`,
      );
      const data = (await response.json()) as { solution?: string };
      setSolutionText(data.solution ?? "No reference solution recorded.");
    }
  }

  if (!question) {
    return (
      <div className="card m-6 p-8 text-center">
        <p className="text-ink-soft text-[0.9375rem]">
          No questions published.
        </p>
      </div>
    );
  }

  const isSolved = solved.includes(question.id);
  const done = questions.filter((q) => solved.includes(q.id)).length;
  const pct = questions.length ? (done / questions.length) * 100 : 0;

  const statement = (
    <Statement
      question={question}
      brief={brief}
      solved={isSolved}
      showHint={showHint}
      showSolution={showSolution}
      solutionText={solutionText}
      onHint={() => setShowHint((v) => !v)}
      onSolution={revealSolution}
      onSolved={() =>
        setSolved((prev) =>
          prev.includes(question.id) ? prev : [...prev, question.id],
        )
      }
    />
  );

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar ------------------------------------------------------- */}
      <div className="border-line bg-surface flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b px-3 py-2">
        <button
          type="button"
          onClick={() => setLeftOpen((v) => !v)}
          aria-label={leftOpen ? "Hide problems" : "Show problems"}
          className="text-ink-soft hover:bg-mist hover:text-ink hidden rounded-lg p-1.5 transition-colors lg:grid"
        >
          {leftOpen ? (
            <PanelLeftClose className="size-4" strokeWidth={2} aria-hidden />
          ) : (
            <PanelLeftOpen className="size-4" strokeWidth={2} aria-hidden />
          )}
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => go(Math.max(0, index - 1))}
            disabled={index === 0}
            className="border-line text-ink-soft hover:text-ink grid size-7 place-items-center rounded-md border transition-colors disabled:opacity-30"
            aria-label="Previous problem"
          >
            <ChevronLeft className="size-3.5" strokeWidth={2} aria-hidden />
          </button>
          <span className="text-ink-faint px-1 font-mono text-[0.75rem] tabular-nums">
            {index + 1}/{questions.length}
          </span>
          <button
            type="button"
            onClick={() => go(Math.min(questions.length - 1, index + 1))}
            disabled={index === questions.length - 1}
            className="border-line text-ink-soft hover:text-ink grid size-7 place-items-center rounded-md border transition-colors disabled:opacity-30"
            aria-label="Next problem"
          >
            <ChevronRight className="size-3.5" strokeWidth={2} aria-hidden />
          </button>
        </div>

        <span className="text-ink min-w-0 flex-1 truncate text-[0.875rem] font-semibold">
          {question.title}
        </span>

        <div className="flex items-center gap-2.5">
          <span className="bg-mist hidden h-1.5 w-28 overflow-hidden rounded-full sm:block">
            <span
              className="bg-leaf-deep block h-full rounded-full transition-[width] duration-500"
              style={{ width: `${pct}%` }}
            />
          </span>
          <span className="text-ink-soft font-mono text-[0.75rem] tabular-nums">
            {done}/{questions.length} solved
          </span>
        </div>

        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold capitalize",
            DIFF_TONE[question.difficulty],
          )}
        >
          {question.difficulty}
        </span>

        <button
          type="button"
          onClick={() => setEdited(null)}
          className="border-line text-ink-soft hover:text-ink inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[0.8125rem] font-medium transition-colors"
        >
          <RotateCcw className="size-3.5" strokeWidth={2} aria-hidden />
          <span className="hidden sm:inline">Reset code</span>
        </button>

        <button
          type="button"
          onClick={() => void judge()}
          disabled={!brief || run.at === "running"}
          className="bg-ink text-cta-fg hover:bg-brand-deep disabled:hover:bg-ink inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[0.8125rem] font-semibold transition-colors disabled:opacity-40"
        >
          {run.at === "running" ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          ) : (
            <Play className="size-3.5" strokeWidth={2.5} aria-hidden />
          )}
          {run.at === "running" ? "Running…" : "Run tests"}
        </button>

        <button
          type="button"
          onClick={() => setRightOpen((v) => !v)}
          aria-label={rightOpen ? "Hide problem" : "Show problem"}
          className="text-ink-soft hover:bg-mist hover:text-ink hidden rounded-lg p-1.5 transition-colors lg:grid"
        >
          {rightOpen ? (
            <PanelRightClose className="size-4" strokeWidth={2} aria-hidden />
          ) : (
            <PanelRightOpen className="size-4" strokeWidth={2} aria-hidden />
          )}
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {leftOpen && (
          <>
            <aside
              style={{ width: leftWidth }}
              className="border-line bg-mist hidden shrink-0 overflow-y-auto border-r lg:block"
            >
              <ProblemList
                questions={questions}
                index={index}
                solved={solved}
                onPick={go}
              />
            </aside>
            <Splitter onPointerDown={(e) => dragLeft(e, 1)} />
          </>
        )}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div
            style={{ height: editorHeight }}
            className="bg-night flex shrink-0 flex-col"
          >
            <label className="sr-only" htmlFor="py-editor">
              Your Python solution
            </label>
            <textarea
              id="py-editor"
              value={code}
              onChange={(event) => setEdited(event.target.value)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                  event.preventDefault();
                  void judge();
                }
                // A code editor that moves focus on Tab is not a code editor.
                if (event.key === "Tab") {
                  event.preventDefault();
                  const target = event.currentTarget;
                  const { selectionStart: from, selectionEnd: to } = target;
                  setEdited(`${code.slice(0, from)}    ${code.slice(to)}`);
                  requestAnimationFrame(() => {
                    target.selectionStart = target.selectionEnd = from + 4;
                  });
                }
              }}
              spellCheck={false}
              className="h-full w-full resize-none border-0 bg-transparent p-4 font-mono text-[0.875rem] leading-[1.7] text-white/90 focus:outline-none"
            />
          </div>

          <Splitter horizontal onPointerDown={(e) => dragEditor(e, 1, "y")} />

          <div className="bg-surface flex min-h-0 flex-1 flex-col">
            <VerdictLine run={run} />
            <Results run={run} solved={isSolved} />
          </div>
        </div>

        {rightOpen && (
          <>
            <Splitter onPointerDown={(e) => dragRight(e, -1)} />
            <aside
              style={{ width: rightWidth }}
              className="border-line bg-mist hidden shrink-0 overflow-y-auto border-l lg:block"
            >
              {statement}
            </aside>
          </>
        )}
      </div>

      <div className="border-line max-h-[55vh] shrink-0 overflow-y-auto border-t lg:hidden">
        {statement}
        <ProblemList
          questions={questions}
          index={index}
          solved={solved}
          onPick={go}
        />
      </div>
    </div>
  );
}

function Splitter({
  horizontal,
  onPointerDown,
}: {
  horizontal?: boolean;
  onPointerDown: (event: React.PointerEvent) => void;
}) {
  return (
    <div
      onPointerDown={onPointerDown}
      role="separator"
      aria-orientation={horizontal ? "horizontal" : "vertical"}
      aria-label="Resize"
      className={cn(
        "bg-line hover:bg-brand active:bg-brand shrink-0 transition-colors",
        horizontal
          ? "h-1 w-full cursor-row-resize"
          : "hidden w-1 cursor-col-resize lg:block",
      )}
    />
  );
}

function VerdictLine({ run }: { run: Run }) {
  if (run.at === "idle" || run.at === "running") return null;

  if (run.at === "failed") {
    return (
      <p className="bg-amber-wash text-amber-deep shrink-0 px-4 py-2.5 text-[0.875rem] font-semibold">
        {run.message}
      </p>
    );
  }

  const { verdict } = run;

  if (verdict.verdict === "timeout") {
    return (
      <p className="bg-amber-wash text-amber-deep shrink-0 px-4 py-2.5 text-[0.875rem] font-semibold">
        Time limit exceeded — most likely a loop that never ends.
      </p>
    );
  }

  if (verdict.verdict === "error") {
    return (
      <pre className="bg-amber-wash text-amber-deep max-h-36 shrink-0 overflow-auto px-4 py-2.5 font-mono text-[0.8125rem] whitespace-pre-wrap">
        {verdict.message}
      </pre>
    );
  }

  const accepted = verdict.verdict === "accepted";
  return (
    <p
      className={cn(
        "flex shrink-0 flex-wrap items-center gap-2 px-4 py-2.5 text-[0.875rem] font-semibold",
        accepted
          ? "bg-leaf-wash text-leaf-deep"
          : "bg-amber-wash text-amber-deep",
      )}
    >
      {accepted ? (
        <>
          <Check className="size-4" strokeWidth={3} aria-hidden />
          Accepted — {verdict.passed}/{verdict.total} test cases passed.
        </>
      ) : (
        <>
          <X className="size-4" strokeWidth={3} aria-hidden />
          Wrong answer — {verdict.passed}/{verdict.total} test cases passed.
        </>
      )}
      {verdict.ms != null && (
        <span className="font-mono text-[0.75rem] font-normal opacity-70">
          {verdict.ms} ms
        </span>
      )}
    </p>
  );
}

function Results({ run, solved }: { run: Run; solved: boolean }) {
  if (run.at !== "done") {
    return (
      <p className="text-ink-faint px-4 py-4 text-[0.875rem]">
        {run.at === "running"
          ? "Running your code…"
          : solved
            ? "Solved. Run again any time."
            : "Write your solution and press Run tests. Ctrl/⌘ + Enter also works."}
      </p>
    );
  }

  const { failing, results } = run.verdict;

  return (
    <div className="min-h-0 flex-1 overflow-auto p-4">
      {/* One failing case, the way LeetCode shows it: enough to debug with,
          not enough to read the answer key off a run of wrong submissions. */}
      {failing && (
        <div className="border-line bg-mist mb-4 overflow-hidden rounded-xl border">
          <p className="eyebrow border-line-soft border-b px-4 py-2">
            Failing test case {failing.number}
          </p>
          <dl className="grid gap-3 p-4 text-[0.8125rem] sm:grid-cols-[6rem_1fr]">
            <dt className="text-ink-faint font-semibold">Input</dt>
            <dd className="text-ink-soft font-mono break-all">
              {displayArgs(failing.args)}
            </dd>

            <dt className="text-ink-faint font-semibold">Expected</dt>
            <dd className="text-leaf-deep font-mono break-all">
              {display(failing.expect)}
            </dd>

            <dt className="text-ink-faint font-semibold">
              {failing.error ? "Error" : "You returned"}
            </dt>
            <dd className="text-amber-deep font-mono break-all">
              {failing.error ?? display(failing.got)}
            </dd>
          </dl>
        </div>
      )}

      {results && (
        <ol className="flex flex-wrap gap-1.5">
          {results.map((ok, i) => (
            <li key={i}>
              <span
                title={`Test case ${i + 1}`}
                className={cn(
                  "grid size-7 place-items-center rounded-md font-mono text-[0.6875rem] font-semibold",
                  ok
                    ? "bg-leaf-wash text-leaf-deep"
                    : "bg-amber-wash text-amber-deep",
                )}
              >
                {i + 1}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/**
 * Every problem, numbered, in one list.
 *
 * Not grouped by topic any more: the grouping was a second thing to navigate,
 * and it put a collapsed heading between the reader and problem 14. Fifty-four
 * numbered rows is what people actually scroll.
 */
function ProblemList({
  questions,
  index,
  solved,
  onPick,
}: {
  questions: PyQuestion[];
  index: number;
  solved: string[];
  onPick: (next: number) => void;
}) {
  return (
    <ul className="py-2">
      {questions.map((question, i) => (
        <li key={question.id}>
          <button
            type="button"
            onClick={() => onPick(i)}
            aria-current={i === index ? "true" : undefined}
            className={cn(
              "flex w-full items-start gap-2.5 border-l-2 py-2 pr-3 pl-3 text-left text-[0.8125rem] leading-snug transition-colors",
              i === index
                ? "border-brand bg-surface text-ink font-medium"
                : "text-ink-soft hover:bg-surface hover:text-ink border-transparent",
            )}
          >
            <span
              className={cn(
                "mt-px grid size-[1.125rem] shrink-0 place-items-center rounded-full font-mono text-[0.625rem]",
                solved.includes(question.id)
                  ? "bg-leaf-deep text-white"
                  : "text-ink-faint border-line border",
              )}
            >
              {solved.includes(question.id) ? (
                <Check className="size-2.5" strokeWidth={4} aria-hidden />
              ) : (
                i + 1
              )}
            </span>
            <span className="min-w-0 flex-1">{question.title}</span>
            <span
              title={question.difficulty}
              className={cn(
                "mt-1.5 size-1.5 shrink-0 rounded-full",
                question.difficulty === "easy"
                  ? "bg-leaf-deep"
                  : question.difficulty === "medium"
                    ? "bg-amber-deep"
                    : "bg-brand-deep",
              )}
            />
          </button>
        </li>
      ))}
    </ul>
  );
}

function Statement({
  question,
  brief,
  solved,
  showHint,
  showSolution,
  solutionText,
  onHint,
  onSolution,
  onSolved,
}: {
  question: PyQuestion;
  brief: ProblemBrief | undefined;
  solved: boolean;
  showHint: boolean;
  showSolution: boolean;
  solutionText: string | null;
  onHint: () => void;
  onSolution: () => void;
  onSolved: () => void;
}) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        <p className="eyebrow">Problem {question.position}</p>
        {solved && (
          <span className="bg-leaf-wash text-leaf-deep ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold">
            <Check className="size-3" strokeWidth={3} aria-hidden />
            Solved
          </span>
        )}
      </div>

      <h2 className="text-ink mt-2 text-[1rem] leading-snug font-semibold">
        {question.title}
      </h2>
      {question.prompt_md && (
        <p className="text-ink-soft mt-2 text-[0.875rem] leading-relaxed">
          {question.prompt_md}
        </p>
      )}

      {question.leetcode_url && (
        <a
          href={question.leetcode_url}
          target="_blank"
          rel="noreferrer noopener"
          className="text-brand-deep mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold hover:underline"
        >
          Read the full statement on LeetCode
          <ExternalLink className="size-3" strokeWidth={2} aria-hidden />
        </a>
      )}

      {!question.has_judge && (
        <div className="border-amber/30 bg-amber-wash mt-4 rounded-lg border px-3 py-2.5">
          <p className="text-ink-soft text-[0.8125rem] leading-relaxed">
            A design problem — a sequence of operations rather than one function
            — so it is not run here. Solve it on LeetCode and upload the
            accepted submission; it is read and checked before it counts.
          </p>
          <div className="mt-2.5">
            <ProofUpload
              questionId={question.id}
              solved={solved}
              onSolved={onSolved}
            />
          </div>
        </div>
      )}

      {brief?.note && (
        <p className="text-ink-faint mt-3 text-[0.8125rem] leading-relaxed">
          {brief.note}
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onHint}
          disabled={!question.hint_md}
          className="border-line bg-surface text-amber-deep hover:border-amber inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[0.8125rem] font-semibold transition-colors disabled:opacity-40"
        >
          <Lightbulb className="size-3.5" strokeWidth={2} aria-hidden />
          {showHint ? "Hide hint" : "Get hint"}
        </button>
        <button
          type="button"
          onClick={() => void onSolution()}
          disabled={!brief}
          className="border-line bg-surface text-ink-soft hover:text-ink hover:border-brand inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[0.8125rem] font-semibold transition-colors disabled:opacity-40"
        >
          <Eye className="size-3.5" strokeWidth={2} aria-hidden />
          {showSolution ? "Hide" : "Solution"}
        </button>
      </div>

      {showHint && question.hint_md && (
        <p className="border-amber/30 bg-amber-wash text-ink-soft mt-3 rounded-lg border px-3 py-2.5 text-[0.8125rem] leading-relaxed">
          {question.hint_md}
        </p>
      )}
      {showSolution && (
        <pre className="border-line bg-night mt-3 overflow-x-auto rounded-lg border p-3 font-mono text-[0.75rem] leading-[1.6] whitespace-pre-wrap text-white/90">
          {solutionText ?? "Loading…"}
        </pre>
      )}

      {brief && (
        <div className="mt-5">
          <p className="eyebrow mb-2">Sample cases</p>
          <ul className="space-y-2">
            {brief.samples.map((sample, i) => (
              <li
                key={i}
                className="border-line bg-surface rounded-lg border p-3 font-mono text-[0.75rem]"
              >
                <p className="text-ink-soft break-all">
                  <span className="text-ink-faint">in&nbsp;&nbsp;</span>
                  {displayArgs(sample.args)}
                </p>
                <p className="text-leaf-deep mt-1 break-all">
                  <span className="text-ink-faint">out&nbsp;</span>
                  {display(sample.expect)}
                </p>
              </li>
            ))}
          </ul>
          <p className="text-ink-faint mt-2 text-[0.75rem]">
            Judged against {brief.case_count} test cases. The rest are hidden.
          </p>
        </div>
      )}
    </div>
  );
}
