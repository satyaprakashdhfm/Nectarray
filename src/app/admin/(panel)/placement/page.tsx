import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { ChevronRight, FileText, MessageSquareText } from "lucide-react";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { placementProfiles, users } from "@/lib/db/schema";
import { displayName } from "@/lib/utils";
import { defaultIntro } from "@/lib/resume";

export const dynamic = "force-dynamic";

const day = (value: Date | null | undefined) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

/**
 * What the placement tools actually offer, and who has used them.
 *
 * The templates are shown so an admin can see exactly what a student sees
 * before they write a word of their own — the same starter text and the
 * same resume.tex, not a description of them. The list below links to each
 * student's own tab: [[id]] renders their saved intro and compiles their
 * latest resume.
 */
export default async function AdminPlacementPage() {
  const [rows, templateTex] = await Promise.all([
    db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        intro: placementProfiles.intro,
        resumeFiles: placementProfiles.resumeFiles,
        updatedAt: placementProfiles.updatedAt,
      })
      .from(users)
      .leftJoin(placementProfiles, eq(placementProfiles.userId, users.id))
      .orderBy(desc(users.createdAt)),
    readFile(
      path.join(process.cwd(), "content", "resume", "template.tex"),
      "utf8",
    ),
  ]);

  const introTemplate = defaultIntro();
  const written = rows.filter((r) => r.intro || r.resumeFiles).length;

  return (
    <>
      <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
        Placement
      </h1>
      <p className="text-ink-soft mt-3 max-w-2xl text-[0.9375rem] leading-relaxed">
        Every student gets a self-introduction and a resume tool at{" "}
        <code className="text-ink-soft font-mono text-[0.8125rem]">
          /dashboard/placement
        </code>
        . The two starting points are below; {written} of {rows.length} accounts
        have written past them.
      </p>

      {/* The templates ---------------------------------------------------- */}
      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <div className="card p-6">
          <p className="text-ink flex items-center gap-2 text-[0.9375rem] font-semibold">
            <MessageSquareText
              className="text-brand-deep size-4"
              strokeWidth={2}
              aria-hidden
            />
            Self-introduction starter
          </p>
          <p className="text-ink-faint mt-1.5 text-[0.8125rem]">
            What a student sees the first time they open the tab, before they
            change anything.
          </p>
          <pre className="bg-mist text-ink-soft mt-4 max-h-64 overflow-auto rounded-lg p-4 text-[0.8125rem] leading-relaxed whitespace-pre-wrap">
            {introTemplate}
          </pre>
        </div>

        <div className="card p-6">
          <p className="text-ink flex items-center gap-2 text-[0.9375rem] font-semibold">
            <FileText
              className="text-brand-deep size-4"
              strokeWidth={2}
              aria-hidden
            />
            Resume starter — content/resume/template.tex
          </p>
          <p className="text-ink-faint mt-1.5 text-[0.8125rem]">
            The one template every student edits, with their name and email
            filled in from their account. Change the file to change the starting
            point for everybody who hasn&rsquo;t saved their own yet.
          </p>
          <pre className="bg-night mt-4 max-h-64 overflow-auto rounded-lg p-4 font-mono text-[0.75rem] leading-relaxed whitespace-pre-wrap text-white/80">
            {templateTex}
          </pre>
        </div>
      </div>

      {/* Everyone ----------------------------------------------------------- */}
      <div className="card mt-7 overflow-x-auto">
        <table className="w-full min-w-[44rem] text-left">
          <thead>
            <tr className="border-line-soft border-b">
              {["Student", "Self-introduction", "Resume", "Last saved", ""].map(
                (head) => (
                  <th
                    key={head}
                    className="text-ink-faint px-4 py-3.5 text-[0.6875rem] font-semibold tracking-[0.1em] uppercase"
                  >
                    {head}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const name =
                displayName(
                  [row.firstName, row.lastName].filter(Boolean).join(" "),
                ) || "—";
              return (
                <tr
                  key={row.id}
                  className="border-line-soft border-b align-top last:border-0"
                >
                  <td className="px-4 py-4">
                    <span className="text-ink block text-[0.9375rem] font-semibold">
                      {name}
                    </span>
                    <span className="text-ink-soft block text-[0.8125rem]">
                      {row.email}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Status ok={Boolean(row.intro)} label="Written" />
                  </td>
                  <td className="px-4 py-4">
                    <Status ok={Boolean(row.resumeFiles)} label="Saved" />
                  </td>
                  <td className="text-ink-soft px-4 py-4 text-[0.8125rem] whitespace-nowrap">
                    {day(row.updatedAt)}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/admin/placement/${row.id}`}
                      className="text-brand-deep hover:text-brand inline-flex items-center gap-1 text-[0.8125rem] font-semibold transition-colors"
                    >
                      View
                      <ChevronRight
                        className="size-3.5"
                        strokeWidth={2.5}
                        aria-hidden
                      />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Status({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[0.75rem] font-semibold whitespace-nowrap ${
        ok ? "bg-leaf-wash text-leaf-deep" : "bg-mist text-ink-faint"
      }`}
    >
      {ok ? label : "Starter only"}
    </span>
  );
}
