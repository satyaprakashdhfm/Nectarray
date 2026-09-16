import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, TriangleAlert } from "lucide-react";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { placementProfiles, users } from "@/lib/db/schema";
import { displayName } from "@/lib/utils";
import { compilerConfigured, compileResume } from "@/lib/latex-compile";
import { asResumeFiles } from "@/lib/resume";

export const dynamic = "force-dynamic";

/**
 * One student's placement tools, as an admin sees them.
 *
 * Compiled here rather than through /api/placement/compile: a server
 * component can call compileResume directly, and there is no editor on this
 * page for a client component to drive. Nothing here is editable — this is
 * the read of what a student actually wrote and saved, not a second place to
 * change it.
 */
export default async function AdminPlacementProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [person] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!person) notFound();

  const [profile] = await db
    .select()
    .from(placementProfiles)
    .where(eq(placementProfiles.userId, id))
    .limit(1);

  const name =
    displayName([person.firstName, person.lastName].filter(Boolean).join(" ")) ||
    person.email;

  const files = asResumeFiles(profile?.resumeFiles);
  const compile = files && compilerConfigured() ? await compileResume(files) : null;

  return (
    <>
      <Link
        href="/admin/placement"
        className="text-ink-soft hover:text-ink inline-flex items-center gap-2 text-[0.875rem] font-medium transition-colors"
      >
        <ArrowLeft className="size-4" strokeWidth={2} aria-hidden />
        Placement
      </Link>

      <div className="mt-4">
        <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
          {name}
        </h1>
        <p className="text-ink-soft mt-1.5 text-[0.9375rem]">{person.email}</p>
      </div>

      {/* Self-introduction ------------------------------------------------ */}
      <section className="card mt-7 p-6">
        <h2 className="text-ink text-[1.0625rem] font-semibold">
          Self-introduction
        </h2>
        {profile?.intro ? (
          <p className="text-ink-soft mt-3 max-w-3xl text-[0.9375rem] leading-relaxed whitespace-pre-wrap">
            {profile.intro}
          </p>
        ) : (
          <p className="text-ink-faint mt-3 text-[0.875rem]">
            Hasn&rsquo;t written one — they see the starter template when they
            open the tab. See it on the{" "}
            <Link href="/admin/placement" className="text-brand-deep underline underline-offset-2">
              Placement overview
            </Link>
            .
          </p>
        )}
      </section>

      {/* Resume ------------------------------------------------------------- */}
      <section className="card mt-6 p-6">
        <h2 className="text-ink flex items-center gap-2 text-[1.0625rem] font-semibold">
          <FileText className="text-brand-deep size-4" strokeWidth={2} aria-hidden />
          Resume
        </h2>

        {!files ? (
          <p className="text-ink-faint mt-3 text-[0.875rem]">
            Hasn&rsquo;t saved one — they start from{" "}
            <code className="font-mono text-[0.8125rem]">
              content/resume/template.tex
            </code>{" "}
            with their name and email filled in.
          </p>
        ) : (
          <>
            <p className="text-ink-faint mt-1.5 text-[0.8125rem]">
              Last saved {new Date(profile!.updatedAt).toLocaleString("en-IN")}
            </p>

            <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_20rem]">
              <div className="border-line bg-mist-deep overflow-hidden rounded-xl border">
                {compile?.ok ? (
                  <iframe
                    src={`data:application/pdf;base64,${Buffer.from(compile.pdf).toString("base64")}#toolbar=0&navpanes=0&view=FitH`}
                    title={`${name}'s resume`}
                    className="h-[70vh] w-full"
                  />
                ) : (
                  <div className="grid h-48 place-items-center p-6 text-center">
                    <p className="text-ink-soft flex items-center gap-2 text-[0.875rem]">
                      <TriangleAlert
                        className="text-amber-deep size-4 shrink-0"
                        strokeWidth={2}
                        aria-hidden
                      />
                      {!compilerConfigured()
                        ? "The compiler isn't connected on this server. Read the source alongside."
                        : (compile && !compile.ok && compile.error) ||
                          "Could not compile this resume."}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {(["template.tex", "resume.cls"] as const).map((fileName) => (
                  <div key={fileName}>
                    <p className="text-ink-faint font-mono text-[0.75rem] font-semibold">
                      {fileName}
                    </p>
                    <pre className="bg-night mt-1.5 max-h-64 overflow-auto rounded-lg p-3 font-mono text-[0.7rem] leading-relaxed whitespace-pre-wrap text-white/80">
                      {files[fileName]}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}
