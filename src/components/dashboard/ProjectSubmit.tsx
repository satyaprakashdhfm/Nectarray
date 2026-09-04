"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderGit2, Loader2, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Stage =
  | { at: "idle" }
  | { at: "working"; note: string }
  | { at: "done"; passed: boolean; score: number; feedback: string }
  | { at: "failed"; note: string };

/**
 * Submitting a project: a repository URL, reviewed against the rubric.
 *
 * A URL rather than an upload, because a repository is what the student would
 * hand an employer — the folder structure and the commit history are part of
 * the work, and neither survives a zip.
 */
export function ProjectSubmit({
  projectId,
  lastRepo,
}: {
  projectId: string;
  lastRepo: string | null;
}) {
  const [repo, setRepo] = useState(lastRepo ?? "");
  const [stage, setStage] = useState<Stage>({ at: "idle" });
  const router = useRouter();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (stage.at === "working") return;

    const url = repo.trim();
    if (!/^https:\/\/(www\.)?github\.com\/[^/]+\/[^/]+/.test(url)) {
      setStage({
        at: "failed",
        note: "That does not look like a GitHub repository URL.",
      });
      return;
    }

    setStage({ at: "working", note: "Submitting…" });
    try {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id;
      if (!userId) throw new Error("Your session expired. Sign in again.");

      const { data: submission, error } = await supabase
        .from("project_submissions")
        .insert({ project_id: projectId, user_id: userId, repo_url: url })
        .select("id")
        .single();
      if (error) throw new Error(error.message);

      setStage({ at: "working", note: "Reading your repository…" });

      const response = await fetch("/api/review-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: submission.id }),
      });
      const result = (await response.json()) as {
        passed?: boolean;
        score?: number;
        feedback?: string;
        error?: string;
      };
      if (!response.ok) throw new Error(result.error ?? "Review failed.");

      setStage({
        at: "done",
        passed: Boolean(result.passed),
        score: result.score ?? 0,
        feedback: result.feedback ?? "",
      });
      router.refresh();
    } catch (error) {
      setStage({
        at: "failed",
        note: error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  }

  return (
    <div className="card p-6">
      <h2 className="text-ink text-[1.0625rem] font-semibold">Submit</h2>
      <p className="text-ink-soft mt-1.5 text-[0.875rem] leading-relaxed">
        Push your work to a <strong className="text-ink">public</strong> GitHub
        repository and paste the link. It is read and marked against the rubric;
        you can resubmit as many times as you like.
      </p>

      <form onSubmit={submit} className="mt-4 flex flex-wrap gap-3">
        <label className="sr-only" htmlFor="repo">
          Repository URL
        </label>
        <span className="border-line bg-surface focus-within:border-brand flex min-w-0 flex-1 items-center gap-2 rounded-xl border px-3 transition-colors">
          <FolderGit2
            className="text-ink-faint size-4 shrink-0"
            strokeWidth={2}
            aria-hidden
          />
          <input
            id="repo"
            value={repo}
            onChange={(event) => setRepo(event.target.value)}
            placeholder="https://github.com/you/your-project"
            spellCheck={false}
            className="text-ink min-w-0 flex-1 bg-transparent py-3 text-[0.9375rem] focus:outline-none"
          />
        </span>
        <button
          type="submit"
          disabled={stage.at === "working"}
          className="bg-ink text-cta-fg hover:bg-brand-deep disabled:hover:bg-ink inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[0.9375rem] font-semibold transition-colors disabled:opacity-50"
        >
          {stage.at === "working" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Send className="size-4" strokeWidth={2} aria-hidden />
          )}
          {stage.at === "working" ? stage.note : "Submit for review"}
        </button>
      </form>

      {stage.at === "failed" && (
        <p className="bg-amber-wash text-amber-deep mt-4 rounded-lg px-4 py-3 text-[0.875rem]">
          {stage.note}
        </p>
      )}

      {stage.at === "done" && (
        <div
          className={cn(
            "mt-4 rounded-xl px-5 py-4",
            stage.passed
              ? "bg-leaf-wash text-leaf-deep"
              : "bg-amber-wash text-amber-deep",
          )}
        >
          <p className="text-[0.9375rem] font-semibold">
            {stage.passed ? "Passed" : "Needs another pass"} — {stage.score} / 10
          </p>
          <div className="text-ink-soft mt-2 space-y-1.5 text-[0.875rem] leading-relaxed whitespace-pre-line">
            {stage.feedback}
          </div>
        </div>
      )}
    </div>
  );
}
