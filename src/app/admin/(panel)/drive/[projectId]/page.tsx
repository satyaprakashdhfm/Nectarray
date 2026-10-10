import { ADMIN } from "@/lib/admin-path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { DriveBrowser, NotConnected } from "@/components/admin/DriveBrowser";
import { db } from "@/lib/db";
import { clientProjects } from "@/lib/db/schema";
import { isId, loadFolder } from "@/lib/drive";
import { driveReady } from "@/lib/drive-storage";

export const dynamic = "force-dynamic";

/** One project's Drive, open at a folder (`?folder=`) or at the top. */
export default async function AdminProjectDrivePage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ folder?: string }>;
}) {
  const [{ projectId }, { folder }] = await Promise.all([params, searchParams]);
  if (!isId(projectId)) notFound();
  const [project] = await db
    .select({
      id: clientProjects.id,
      title: clientProjects.title,
      client: clientProjects.client,
    })
    .from(clientProjects)
    .where(eq(clientProjects.id, projectId));
  if (!project) notFound();

  const folderId = isId(folder) ? folder : null;
  const contents = await loadFolder(project.id, folderId);
  if (!contents) notFound();

  return (
    <>
      <Link
        href={`${ADMIN}/drive`}
        className="text-ink-faint hover:text-ink inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold transition-colors"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All drives
      </Link>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="display text-ink text-[1.75rem] sm:text-[2rem]">
          {project.title}
        </h1>
        <Link
          href={`${ADMIN}/projects/${project.id}`}
          className="text-brand-deep text-[0.8125rem] font-semibold hover:underline"
        >
          Open the project
        </Link>
      </div>
      <p className="text-ink-soft mt-1 text-[0.9375rem]">{project.client}</p>
      {!driveReady() && <NotConnected />}

      <DriveBrowser
        projectId={project.id}
        folderId={folderId}
        path={[{ id: null, name: "Drive" }, ...contents.path]}
        folders={contents.folders.map((f) => ({ id: f.id, name: f.name }))}
        files={contents.files.map((f) => ({
          ...f,
          createdAt: f.createdAt.toISOString(),
        }))}
        storage={driveReady()}
      />
    </>
  );
}
