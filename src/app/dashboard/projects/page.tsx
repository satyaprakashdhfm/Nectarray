import Link from "next/link";
import { ArrowRight, Check, FolderGit2 } from "lucide-react";
import { EnrolmentPanel } from "@/components/dashboard/EnrolmentGate";
import { createClient, getAccess } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

type Project = {
  id: string;
  slug: string;
  position: number;
  title: string;
  summary: string;
};

export default async function ProjectsPage() {
  const { active, status } = await getAccess();
  if (!active) {
    return (
      <div className="shell py-8 lg:py-10">
        <EnrolmentPanel status={status} />
      </div>
    );
  }

  const supabase = await createClient();
  const [{ data: projects }, { data: submissions }] = await Promise.all([
    supabase
      .from("projects")
      .select("id, slug, position, title, summary")
      .eq("is_published", true)
      .order("position"),
    supabase
      .from("project_submissions")
      .select("project_id, status, score, created_at")
      .order("created_at", { ascending: false }),
  ]);

  // The most recent submission per project is the one that counts.
  const latest = new Map<string, { status: string; score: number | null }>();
  for (const row of submissions ?? []) {
    if (!latest.has(row.project_id)) {
      latest.set(row.project_id, { status: row.status, score: row.score });
    }
  }

  const list = (projects ?? []) as Project[];
  const passed = list.filter(
    (p) => latest.get(p.id)?.status === "passed",
  ).length;

  return (
    <div className="shell py-8 lg:py-10">
      <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
        Projects
      </h1>
      <p className="text-ink-soft mt-3 max-w-2xl text-[0.9375rem] leading-relaxed">
        Five builds, each one a thing you can show someone. They stack: the file
        you clean in the first is the data you model in the second, and the last
        one puts everything in one system. Submit a public GitHub repository and
        it is read and marked against the brief.
      </p>

      <div className="border-night-line bg-night mt-7 flex items-center gap-5 rounded-2xl border p-6 text-white">
        <span className="display text-[1.75rem]">
          {passed}
          <span className="text-white/40"> / {list.length}</span>
        </span>
        <span className="text-[0.9375rem] text-white/60">passed</span>
      </div>

      <ol className="mt-6 space-y-4">
        {list.map((project) => {
          const state = latest.get(project.id);
          return (
            <li key={project.id}>
              <Link
                href={`/dashboard/projects/${project.slug}`}
                className="card card-hover group flex items-start gap-5 p-5 sm:p-6"
              >
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-xl font-mono text-[0.875rem] font-semibold",
                    state?.status === "passed"
                      ? "bg-leaf-deep text-white"
                      : "bg-brand-wash text-brand-deep",
                  )}
                >
                  {state?.status === "passed" ? (
                    <Check className="size-4" strokeWidth={3} aria-hidden />
                  ) : (
                    project.position
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="text-ink block text-[1.0625rem] font-semibold">
                    {project.title}
                  </span>
                  <span className="text-ink-soft mt-1.5 block text-[0.9rem] leading-relaxed">
                    {project.summary}
                  </span>
                  {state && (
                    <span
                      className={cn(
                        "mt-3 inline-flex rounded-full px-3 py-1 text-[0.75rem] font-semibold",
                        state.status === "passed"
                          ? "bg-leaf-wash text-leaf-deep"
                          : state.status === "revise"
                            ? "bg-amber-wash text-amber-deep"
                            : "bg-mist text-ink-faint",
                      )}
                    >
                      {state.status === "passed"
                        ? `Passed — ${state.score}/10`
                        : state.status === "revise"
                          ? `Needs another pass — ${state.score}/10`
                          : "Review failed"}
                    </span>
                  )}
                </span>

                <FolderGit2
                  className="text-ink-faint group-hover:text-brand-deep mt-1 size-4 shrink-0 transition-colors"
                  strokeWidth={2}
                  aria-hidden
                />
                <ArrowRight
                  className="text-ink-faint group-hover:text-brand-deep mt-1 size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2}
                  aria-hidden
                />
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
