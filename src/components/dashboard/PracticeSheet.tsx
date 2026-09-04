"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, ChevronDown, ExternalLink, Lightbulb } from "lucide-react";
import { ProofUpload } from "@/components/dashboard/ProofUpload";
import { cn } from "@/lib/utils";

export type Question = {
  id: string;
  track: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  position: number;
  title: string;
  prompt_md: string | null;
  hint_md: string | null;
  solution_sql: string | null;
  leetcode_url: string | null;
};

const DIFF_ORDER = { easy: 0, medium: 1, hard: 2 } as const;

const DIFF_TONE: Record<string, string> = {
  easy: "bg-leaf-wash text-leaf-deep",
  medium: "bg-amber-wash text-amber-deep",
  hard: "bg-brand-wash text-brand-deep",
};

const DIFF_DOT: Record<string, string> = {
  easy: "bg-leaf-deep",
  medium: "bg-amber-deep",
  hard: "bg-brand-deep",
};

export function PracticeSheet({
  questions,
  solved: initialSolved,
}: {
  questions: Question[];
  solved: string[];
}) {
  const [solved, setSolved] = useState<string[]>(initialSolved);
  const solvedSet = useMemo(() => new Set(solved), [solved]);

  const markSolved = useCallback((id: string) => {
    setSolved((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const byDifficulty = useMemo(() => {
    const counts = { easy: [0, 0], medium: [0, 0], hard: [0, 0] };
    for (const q of questions) {
      counts[q.difficulty][1] += 1;
      if (solvedSet.has(q.id)) counts[q.difficulty][0] += 1;
    }
    return counts;
  }, [questions, solvedSet]);

  const topics = useMemo(() => {
    const map = new Map<string, Question[]>();
    for (const q of questions) {
      if (!map.has(q.topic)) map.set(q.topic, []);
      map.get(q.topic)!.push(q);
    }
    for (const list of map.values()) {
      list.sort(
        (a, b) =>
          DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty] ||
          a.position - b.position,
      );
    }
    return [...map.entries()];
  }, [questions]);

  const done = solvedSet.size;
  const total = questions.length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="mt-8">
      {/* Progress header ------------------------------------------------- */}
      <div className="border-night-line bg-night flex flex-wrap items-center gap-6 rounded-2xl border p-6 text-white sm:gap-10 sm:p-7">
        <Ring pct={pct} />
        <div>
          <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-white/40 uppercase">
            Verified
          </p>
          <p className="display mt-1 text-[1.75rem]">
            {done}
            <span className="text-white/40"> / {total}</span>
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-7 gap-y-2 sm:ml-auto">
          {(["easy", "medium", "hard"] as const).map((level) => (
            <li key={level} className="flex items-center gap-2.5">
              <span
                className={cn("size-2.5 rounded-full", DIFF_DOT[level])}
                aria-hidden
              />
              <span className="text-[0.875rem] font-medium text-white/80 capitalize">
                {level}
              </span>
              <span className="font-mono text-[0.875rem] text-white/50">
                {byDifficulty[level][0]}/{byDifficulty[level][1]}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-ink-soft mt-4 text-[0.875rem] leading-relaxed">
        Solve each problem on LeetCode, then upload a screenshot of the accepted
        submission. It is read and checked before it counts &mdash; the tick
        means you solved it, not that you pressed something.
      </p>

      {/* Topics ---------------------------------------------------------- */}
      <div className="mt-5 space-y-4">
        {topics.map(([topic, list], i) => {
          const topicDone = list.filter((q) => solvedSet.has(q.id)).length;
          return (
            <details
              key={topic}
              open={i === 0}
              className="card group overflow-hidden"
            >
              <summary className="flex cursor-pointer list-none items-center gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
                <ChevronDown
                  className="text-ink-faint size-5 shrink-0 transition-transform duration-300 group-open:rotate-180"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="text-ink flex-1 text-[1.0625rem] font-semibold">
                  {topic}
                </span>
                <span className="bg-mist hidden h-1.5 w-32 overflow-hidden rounded-full sm:block">
                  <span
                    className="bg-leaf-deep block h-full rounded-full transition-[width] duration-500"
                    style={{
                      width: `${list.length ? (topicDone / list.length) * 100 : 0}%`,
                    }}
                  />
                </span>
                <span className="text-ink-faint shrink-0 font-mono text-[0.875rem]">
                  {topicDone} / {list.length}
                </span>
              </summary>

              <div className="border-line-soft border-t">
                <table className="w-full text-left">
                  <thead className="sr-only">
                    <tr>
                      <th>Done</th>
                      <th>Problem</th>
                      <th>Practice</th>
                      <th>Proof</th>
                      <th>Difficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((q) => (
                      <Row
                        key={q.id}
                        question={q}
                        solved={solvedSet.has(q.id)}
                        onSolved={() => markSolved(q.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}

function Row({
  question,
  solved,
  onSolved,
}: {
  question: Question;
  solved: boolean;
  onSolved: () => void;
}) {
  const [showHint, setShowHint] = useState(false);

  return (
    <>
      <tr className="border-line-soft border-b last:border-0">
        <td className="w-10 py-4 pl-5 sm:pl-6">
          {/*
           * A state, not a control. The tick is what the grader concluded, so
           * there is nothing here to press — pressing it was the old way, and
           * it made this a to-do list rather than a record.
           */}
          <span
            role="img"
            aria-label={solved ? "Verified" : "Not yet verified"}
            className={cn(
              "grid size-[1.15rem] place-items-center rounded-[0.35rem] border",
              solved
                ? "bg-leaf-deep border-leaf-deep text-white"
                : "border-line",
            )}
          >
            {solved && <Check className="size-3" strokeWidth={4} aria-hidden />}
          </span>
        </td>

        <td className="py-4 pr-4">
          <span
            className={cn(
              "text-[0.9375rem] font-medium",
              solved ? "text-ink-faint" : "text-ink",
            )}
          >
            {question.title}
          </span>
          {question.hint_md && (
            <button
              type="button"
              onClick={() => setShowHint((v) => !v)}
              className="text-amber-deep ml-3 inline-flex items-center gap-1 text-[0.8125rem] font-semibold hover:underline"
            >
              <Lightbulb className="size-3" strokeWidth={2} aria-hidden />
              Hint
            </button>
          )}
        </td>

        <td className="py-4 pr-4 whitespace-nowrap">
          {question.leetcode_url && (
            <a
              href={question.leetcode_url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-ink-soft hover:text-ink inline-flex items-center gap-1.5 text-[0.875rem] font-semibold"
            >
              Solve
              <ExternalLink className="size-3.5" strokeWidth={2} aria-hidden />
            </a>
          )}
        </td>

        <td className="py-4 pr-4">
          <ProofUpload
            questionId={question.id}
            solved={solved}
            onSolved={onSolved}
          />
        </td>

        <td className="py-4 pr-5 text-right sm:pr-6">
          <span
            className={cn(
              "inline-flex rounded-full px-3 py-1 text-[0.75rem] font-semibold capitalize",
              DIFF_TONE[question.difficulty],
            )}
          >
            {question.difficulty}
          </span>
        </td>
      </tr>

      {showHint && question.hint_md && (
        <tr className="border-line-soft border-b last:border-0">
          <td colSpan={5} className="bg-mist px-5 pb-4 sm:px-6">
            <p className="text-ink-soft pt-3 text-[0.875rem] leading-relaxed">
              <span className="text-amber-deep font-semibold">Hint — </span>
              {question.hint_md}
            </p>
          </td>
        </tr>
      )}
    </>
  );
}

/** The progress ring from the reference sheet. */
function Ring({ pct }: { pct: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid size-[68px] shrink-0 place-items-center">
      <svg className="size-[68px] -rotate-90" viewBox="0 0 68 68" aria-hidden>
        <circle
          cx="34"
          cy="34"
          r={r}
          fill="none"
          strokeWidth="6"
          className="stroke-white/10"
        />
        <circle
          cx="34"
          cy="34"
          r={r}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
          className="stroke-leaf transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <span className="absolute text-[0.875rem] font-semibold">{pct}%</span>
    </div>
  );
}
