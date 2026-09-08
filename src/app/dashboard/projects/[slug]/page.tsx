import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EnrolmentPanel } from "@/components/dashboard/EnrolmentGate";
import { Markdown } from "@/components/dashboard/Markdown";
import { ProjectSubmit } from "@/components/dashboard/ProjectSubmit";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { projectSubmissions, projects } from "@/lib/db/schema";
import { getAccess } from "@/lib/auth/access";
import { cn } from "@/lib/utils";

const TONE: Record<string, string> = {
  passed: "bg-leaf-wash text-leaf-deep",
  revise: "bg-amber-wash text-amber-deep",
  pending: "bg-mist text-ink-faint",
  error: "bg-mist text-ink-faint",
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { user, active, status } = await getAccess();
  if (!active) {
    return (
      <div className="shell py-8 lg:py-10">
        <EnrolmentPanel status={status} />
      </div>
    );
  }

  const { slug } = await params;
  const [project] = await db
    .select({
      id: projects.id,
      position: projects.position,
      title: projects.title,
      summary: projects.summary,
      brief_md: projects.briefMd,
      rubric_md: projects.rubricMd,
    })
    .from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.isPublished, true)))
    .limit(1);

  if (!project) notFound();

  /*
   * This student's attempts at this project, and nobody else's. The scoping
   * used to be a row-level security policy; it is this `and` now, and it is
   * the sort of thing that has to be written every time rather than
   * remembered — see lib/auth/access.ts.
   */
  const history = user
    ? await db
        .select({
          id: projectSubmissions.id,
          repo_url: projectSubmissions.repoUrl,
          status: projectSubmissions.status,
          score: projectSubmissions.score,
          feedback_md: projectSubmissions.feedbackMd,
          created_at: projectSubmissions.createdAt,
        })
        .from(projectSubmissions)
        .where(
          and(
            eq(projectSubmissions.projectId, project.id),
            eq(projectSubmissions.userId, user.id),
          ),
        )
        .orderBy(desc(projectSubmissions.createdAt))
    : [];

  return (
    <div className="shell py-8 lg:py-10">
      <Link
        href="/dashboard/projects"
        className="text-ink-soft hover:text-ink inline-flex items-center gap-2 text-[0.875rem] font-medium transition-colors"
      >
        <ArrowLeft className="size-4" strokeWidth={2} aria-hidden />
        All projects
      </Link>

      <p className="eyebrow mt-5">Project {project.position}</p>
      <h1 className="display text-ink mt-2 text-[2rem] sm:text-[2.5rem]">
        {project.title}
      </h1>
      <p className="lede mt-4 max-w-2xl">{project.summary}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="min-w-0">
          <Markdown>{project.brief_md}</Markdown>

          <section className="mt-12">
            <h2 className="display text-ink border-line border-t pt-10 text-[1.625rem]">
              How it is marked
            </h2>
            <Markdown>{project.rubric_md}</Markdown>
          </section>
        </div>

        <div className="space-y-5 lg:sticky lg:top-[140px]">
          <ProjectSubmit
            projectId={project.id}
            lastRepo={history[0]?.repo_url ?? null}
          />

          {history.length > 0 && (
            <div className="card p-6">
              <h2 className="text-ink text-[1.0625rem] font-semibold">
                Your submissions
              </h2>
              <ul className="mt-4 space-y-4">
                {history.map((entry) => (
                  <li
                    key={entry.id}
                    className="border-line-soft border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold",
                          TONE[entry.status] ?? TONE.pending,
                        )}
                      >
                        {entry.status === "passed"
                          ? `Passed — ${entry.score}/10`
                          : entry.status === "revise"
                            ? `Revise — ${entry.score}/10`
                            : entry.status}
                      </span>
                      <span className="text-ink-faint text-[0.75rem]">
                        {new Date(entry.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                          },
                        )}
                      </span>
                    </div>
                    {entry.feedback_md && (
                      <p className="text-ink-soft mt-2 text-[0.8125rem] leading-relaxed whitespace-pre-line">
                        {entry.feedback_md}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
