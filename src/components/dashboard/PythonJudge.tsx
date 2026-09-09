"use client";

import { useCallback, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Lock,
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
import { CopyButton } from "@/components/dashboard/CopyButton";
import {
  countdown,
  useSolution,
  type SolutionState,
} from "@/components/dashboard/use-solution";
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
  /** The problem itself. See content/python-statements.json. */
  statement: string;
  constraints: string[];
};

export type PyQuestion = {
  id: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  position: number;
  title: string;
  prompt_md: string | null;
  hint_md: string | null;
  slug: string | null;
  has_judge: boolean;
};

const DIFF_TONE: Record<string, string> = {
  easy: "bg-leaf-wash text-leaf-deep",
  medium: "bg-amber-wash text-amber-deep",
  hard: "bg-brand-wash text-brand-deep",
};

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
  openedAt,
}: {
  questions: PyQuestion[];
  briefs: Record<string, ProblemBrief>;
  solved: string[];
  openedAt: Record<string, number>;
}) {
  const [index, setIndex] = useState(0);
  const [edited, setEdited] = useState<string | null>(null);
  const [run, setRun] = useState<Run>({ at: "idle" });
  const [solved, setSolved] = useState<string[]>(initialSolved);
  const [showHint, setShowHint] = useState(false);

  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [leftWidth, dragLeft] = useDragSize(268, 200, 420);
  const [rightWidth, dragRight] = useDragSize(360, 280, 620);
  const [editorHeight, dragEditor] = useDragSize(320, 140, 700);

  const question = questions[index];
  const slug = question?.slug ?? null;
  const brief = slug ? briefs[slug] : undefined;
  const isSolved = question ? solved.includes(question.id) : false;

  // The clock, the lock and the fetch. Nothing about the answer is in the
  // page until it has been earned and asked for.
  const solution = useSolution(question?.id ?? null, isSolved, openedAt);

  /*
   * The editor holds the student's edit, or null while they have not touched
   * it — the starter code is then derived from whichever problem is open.
   */
  const code = edited ?? brief?.starter_code ?? "";

  function go(next: number) {
    setIndex(next);
    setRun({ at: "idle" });
    setShowHint(false);
    setEdited(null);
  }

  async function judge() {
    if (!question || !slug || run.at === "running") return;
    setRun({ at: "running" });

    try {
      const response = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question.id, source: code }),
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

  if (!question) {
    return (
      <div className="card m-6 p-8 text-center">
        <p className="text-ink-soft text-[0.9375rem]">
          No questions published.
        </p>
      </div>
    );
  }

  const done = questions.filter((q) => solved.includes(q.id)).length;
  const pct = questions.length ? (done / questions.length) * 100 : 0;

  const statement = (
    <Statement
      question={question}
      brief={brief}
      solved={isSolved}
      showHint={showHint}
      solution={solution}
      onHint={() => setShowHint((v) => !v)}
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
            {/*
              A bar over the editor, mostly for the copy button. Taking your
              own answer out to paste somewhere is the thing students ask for
              most; selecting it out of a textarea with a trackpad is not.
            */}
            <div className="border-night-line flex shrink-0 items-center justify-between border-b px-3 py-1.5">
              <span className="text-[0.6875rem] font-semibold text-white/40">
                Python
              </span>
              <CopyButton
                text={code}
                className="text-white/50 hover:bg-white/10 hover:text-white"
              />
            </div>
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

/**
 * A run of text with `code spans` in it.
 *
 * The statements are ours and they are short, so a markdown parser in the
 * browser would be several kilobytes to do one thing. Backticks are the one
 * piece of markdown they use.
 */
function Prose({ text }: { text: string }) {
  return (
    <>
      {text.split("\n\n").map((paragraph, p) => (
        <p
          key={p}
          className="text-ink-soft mt-2 text-[0.875rem] leading-relaxed first:mt-0"
        >
          {paragraph.split(/`([^`]+)`/).map((part, i) =>
            i % 2 === 1 ? (
              <code
                key={i}
                className="bg-mist text-ink rounded px-1 py-0.5 font-mono text-[0.8125rem]"
              >
                {part}
              </code>
            ) : (
              part
            ),
          )}
        </p>
      ))}
    </>
  );
}

/**
 * The solution button.
 *
 * Shut for the first fifteen minutes a student has the problem open, and it
 * says how much of that is left rather than simply refusing — a disabled
 * control with no explanation reads as broken. Already solved skips the wait:
 * the delay exists to buy the time spent stuck, and that has been paid.
 */
function SolutionButton({ solution }: { solution: SolutionState }) {
  const locked = !solution.unlocked;

  return (
    <button
      type="button"
      onClick={solution.toggle}
      disabled={locked}
      title={
        locked
          ? "The worked solution opens after fifteen minutes with the problem."
          : undefined
      }
      className="border-line bg-surface text-ink-soft hover:text-ink hover:border-brand disabled:hover:border-line disabled:hover:text-ink-soft inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[0.8125rem] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
    >
      {locked ? (
        <>
          <Lock className="size-3.5" strokeWidth={2} aria-hidden />
          {countdown(solution.remaining)}
        </>
      ) : (
        <>
          <Eye className="size-3.5" strokeWidth={2} aria-hidden />
          {solution.showing ? "Hide" : "Solution"}
        </>
      )}
    </button>
  );
}

/** The revealed answer, with a copy button on it. */
function SolutionBlock({
  solution,
  language,
}: {
  solution: SolutionState;
  language: string;
}) {
  if (!solution.showing) return null;

  return (
    <div className="border-line bg-night mt-3 overflow-hidden rounded-lg border">
      <div className="border-night-line flex items-center justify-between border-b px-3 py-1.5">
        <span className="text-[0.6875rem] font-semibold text-white/40">
          {language}
        </span>
        {solution.text && (
          <CopyButton
            text={solution.text}
            className="text-white/50 hover:bg-white/10 hover:text-white"
          />
        )}
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-[0.75rem] leading-[1.6] whitespace-pre-wrap text-white/90">
        {solution.busy ? "Loading…" : (solution.text ?? "")}
      </pre>
    </div>
  );
}

function Statement({
  question,
  brief,
  solved,
  showHint,
  solution,
  onHint,
}: {
  question: PyQuestion;
  brief: ProblemBrief | undefined;
  solved: boolean;
  showHint: boolean;
  solution: SolutionState;
  onHint: () => void;
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

      {/*
        The problem itself. This used to be a one-line prompt over a link
        reading "Read the full statement on LeetCode", which made the portal a
        table of contents for somebody else's site: a student had to leave to
        find out what the question was, and came back to a page that could not
        tell them whether they had answered it. `prompt_md` is the fallback for
        anything added through the admin panel that has no written statement.
      */}
      <div className="mt-2">
        <Prose text={brief?.statement || question.prompt_md || ""} />
      </div>

      {brief && brief.constraints.length > 0 && (
        <div className="border-line-soft mt-3 border-t pt-3">
          <p className="eyebrow mb-1.5">Constraints</p>
          <ul className="text-ink-faint space-y-1 text-[0.8125rem] leading-relaxed">
            {brief.constraints.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden>·</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!question.has_judge && (
        <div className="border-amber/30 bg-amber-wash mt-4 rounded-lg border px-3 py-2.5">
          <p className="text-ink-soft text-[0.8125rem] leading-relaxed">
            A design problem — a class with several operations rather than one
            function — so there is nothing here for the judge to call. Write it
            in the editor, try it against the examples yourself, then tick it
            off.
          </p>
          <div className="mt-2.5">
            <MarkDone questionId={question.id} solved={solved} />
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
        <SolutionButton solution={solution} />
      </div>

      {!solution.unlocked && (
        <p className="text-ink-faint mt-2 text-[0.75rem] leading-relaxed">
          The worked solution opens fifteen minutes after you open a problem, or
          as soon as you have solved it.
        </p>
      )}
      {solution.error && (
        <p className="text-amber-deep mt-2 text-[0.75rem]">{solution.error}</p>
      )}

      {showHint && question.hint_md && (
        <p className="border-amber/30 bg-amber-wash text-ink-soft mt-3 rounded-lg border px-3 py-2.5 text-[0.8125rem] leading-relaxed">
          {question.hint_md}
        </p>
      )}

      <SolutionBlock solution={solution} language="Python" />

      {brief && brief.samples.length > 0 && (
        <div className="mt-5">
          <p className="eyebrow mb-2">Examples</p>
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

/**
 * The tick for the two problems the judge cannot run.
 *
 * It used to be an upload: a screenshot of an accepted submission somewhere
 * else, read by a grader. With the problems stated here and solved here there
 * is no elsewhere to screenshot, so it is a checkbox — and honest about being
 * one. Two questions out of fifty-four are on the student's word.
 */
function MarkDone({
  questionId,
  solved,
}: {
  questionId: string;
  solved: boolean;
}) {
  const [done, setDone] = useState(solved);
  const [busy, setBusy] = useState(false);

  if (done) {
    return (
      <p className="text-leaf-deep inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold">
        <Check className="size-3.5" strokeWidth={3} aria-hidden />
        Marked as done
      </p>
    );
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void fetch("/api/practice/solved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId }),
        })
          .then((response) => {
            if (response.ok) setDone(true);
          })
          .finally(() => setBusy(false));
      }}
      className="border-line bg-canvas text-ink hover:border-brand inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors disabled:opacity-50"
    >
      {busy ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden />
      ) : (
        <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
      )}
      Mark as done
    </button>
  );
}
