"use client";

import { useState, type ReactNode } from "react";
import { Download, ExternalLink, FileText, FolderGit2 } from "lucide-react";
import { CopyButton } from "@/components/dashboard/CopyButton";
import {
  PLACEMENT_PROJECTS,
  type PlacementProject,
} from "@/lib/content/placement-projects";
import { cn } from "@/lib/utils";
import { PlacementBar } from "./PlacementBar";

const fileUrl = (p: PlacementProject, file: "guide.pdf" | "source.zip") =>
  `/api/placement/projects/${p.slug}/${file}`;

const size = (bytes: number) =>
  bytes >= 1_000_000
    ? `${(bytes / 1_000_000).toFixed(1)} MB`
    : `${Math.round(bytes / 1000)} KB`;

/**
 * Finished projects to put on a resume: what each one does, the numbers worth
 * quoting, how to run it, what an interviewer will ask, the source as a zip,
 * and the project's own guide beside it.
 *
 * The guide is shown in the page from a tablet up. A phone browser either
 * cannot show a PDF inside a page or shows only its first page, so there it
 * is a button that opens the whole file.
 */
export function PlacementProjects({
  tabs,
  initial,
}: {
  tabs: ReactNode;
  initial?: string;
}) {
  const [slug, setSlug] = useState(
    PLACEMENT_PROJECTS.some((p) => p.slug === initial)
      ? initial!
      : PLACEMENT_PROJECTS[0].slug,
  );
  const project = PLACEMENT_PROJECTS.find((p) => p.slug === slug)!;

  function choose(next: string) {
    setSlug(next);
    const url = new URL(window.location.href);
    url.searchParams.set("project", next);
    window.history.replaceState(null, "", url);
  }

  return (
    <>
      <PlacementBar tabs={tabs} />

      <div className="shell-wide py-8 lg:py-10">
        <h1 className="display text-ink text-[1.75rem]">Projects</h1>
        <p className="text-ink-soft mt-2 max-w-3xl text-[0.9375rem] leading-relaxed">
          Complete projects to study, run and talk about in interviews. Each one
          comes with its full source and a guide to how it works. Run it
          yourself first. Then practise explaining the design choices, because
          that is where the interview questions come from.
        </p>

        {/* ── Pick a project ─────────────────────────────────────── */}
        <div
          role="tablist"
          aria-label="Projects"
          className="mt-6 grid gap-3 sm:grid-cols-2"
        >
          {PLACEMENT_PROJECTS.map((p, i) => {
            const active = p.slug === slug;
            return (
              <button
                key={p.slug}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => choose(p.slug)}
                className={cn(
                  "card flex items-start gap-3.5 p-4 text-left transition-colors sm:p-5",
                  active
                    ? "border-brand ring-brand/25 ring-2"
                    : "hover:border-brand/50",
                )}
              >
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-xl font-mono text-[0.875rem] font-bold",
                    active
                      ? "bg-brand-solid text-cta-fg"
                      : "bg-brand-wash text-brand-deep",
                  )}
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="eyebrow block">{p.kind}</span>
                  <span className="text-ink mt-1 block text-[1.0625rem] leading-snug font-semibold">
                    {p.title}
                  </span>
                  <span className="text-ink-faint mt-1 block text-[0.8125rem]">
                    {p.stack.slice(0, 4).join(" · ")}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <ProjectDetail key={project.slug} project={project} />
      </div>
    </>
  );
}

function ProjectDetail({ project: p }: { project: PlacementProject }) {
  const guide = fileUrl(p, "guide.pdf");

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start">
      {/* ── What it is ───────────────────────────────────────────── */}
      <div className="min-w-0 space-y-6">
        <section className="card p-5 sm:p-6">
          <p className="eyebrow">{p.kind}</p>
          <h2 className="display text-ink mt-1.5 text-[1.5rem]">{p.title}</h2>
          <p className="text-ink-soft mt-3 text-[0.9375rem] leading-relaxed">
            {p.summary}
          </p>

          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
            {p.stack.map((s) => (
              <li
                key={s}
                className="bg-mist text-ink-soft border-line-soft rounded-full border px-2.5 py-1 text-[0.75rem] font-semibold"
              >
                {s}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <a
              href={fileUrl(p, "source.zip")}
              download={p.zipName}
              className="bg-brand-solid text-cta-fg inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[0.875rem] font-semibold transition-opacity hover:opacity-90"
            >
              <Download className="size-4" strokeWidth={2} aria-hidden />
              Download source ({size(p.zipBytes)})
            </a>
            <a
              href={guide}
              target="_blank"
              rel="noopener"
              className="border-line text-ink hover:bg-mist inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[0.875rem] font-semibold transition-colors"
            >
              <FileText className="size-4" strokeWidth={2} aria-hidden />
              Open the guide ({p.guidePages} pages)
            </a>
          </div>
        </section>

        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {p.facts.map((f) => (
            <div key={f.label} className="card min-w-0 p-4">
              <dt className="sr-only">{f.label}</dt>
              <dd className="display text-ink text-[1.375rem]">{f.value}</dd>
              <dd className="text-ink-faint mt-0.5 text-[0.75rem] leading-snug">
                {f.label}
              </dd>
            </div>
          ))}
        </dl>

        <section>
          <h3 className="text-ink text-[1.0625rem] font-semibold">
            What makes it stand out
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {p.highlights.map((h) => (
              <div key={h.title} className="card p-4 sm:p-5">
                <p className="text-ink text-[0.9375rem] font-semibold">
                  {h.title}
                </p>
                <p className="text-ink-soft mt-1.5 text-[0.875rem] leading-relaxed">
                  {h.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-ink text-[1.0625rem] font-semibold">
            Run it on your machine
          </h3>
          <p className="text-ink-soft mt-1 text-[0.875rem]">
            Unzip the download, open the folder in a terminal, then run these in
            order.
          </p>
          <ol className="mt-3 space-y-3">
            {p.run.map((step) => (
              <li key={step.label} className="card overflow-hidden">
                <div className="border-line-soft bg-mist flex items-center justify-between gap-3 border-b px-4 py-2">
                  <span className="text-ink text-[0.8125rem] font-semibold">
                    {step.label}
                  </span>
                  <CopyButton text={step.commands} />
                </div>
                <pre className="text-ink overflow-x-auto px-4 py-3 font-mono text-[0.8125rem] leading-relaxed">
                  {step.commands}
                </pre>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h3 className="text-ink text-[1.0625rem] font-semibold">
            What the interviewer will ask
          </h3>
          <div className="mt-3 space-y-2.5">
            {p.talkingPoints.map((t, i) => (
              <details
                key={t.q}
                className="card group p-4 sm:p-5"
                open={i === 0}
              >
                <summary className="text-ink flex cursor-pointer list-none items-start justify-between gap-3 text-[0.9375rem] font-semibold [&::-webkit-details-marker]:hidden">
                  {t.q}
                  <span
                    aria-hidden
                    className="text-ink-faint mt-0.5 shrink-0 text-[1.125rem] leading-none transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="text-ink-soft mt-2.5 text-[0.875rem] leading-relaxed">
                  {t.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>

      {/* ── The guide ────────────────────────────────────────────── */}
      {/* 140px clears the site header and the dashboard nav, both sticky. */}
      <aside className="min-w-0 lg:sticky lg:top-[140px]">
        <div className="card overflow-hidden">
          <div className="border-line-soft flex items-center justify-between gap-3 border-b px-4 py-2.5">
            <span className="text-ink inline-flex min-w-0 items-center gap-2 text-[0.875rem] font-semibold">
              <FolderGit2
                className="text-brand-deep size-4 shrink-0"
                strokeWidth={2}
                aria-hidden
              />
              <span className="truncate">Project guide</span>
            </span>
            <a
              href={guide}
              target="_blank"
              rel="noopener"
              className="text-brand-deep hover:text-ink inline-flex shrink-0 items-center gap-1 text-[0.8125rem] font-semibold transition-colors"
            >
              Full screen
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </div>
          <iframe
            src={`${guide}#view=FitH`}
            title={`${p.title} guide`}
            loading="lazy"
            className="bg-mist hidden h-[80vh] w-full md:block lg:h-[calc(100vh-200px)]"
          />
          <div className="p-5 md:hidden">
            <p className="text-ink-soft text-[0.875rem] leading-relaxed">
              The guide covers every file, the flow, the endpoints and the
              design choices, in {p.guidePages} pages.
            </p>
            <a
              href={guide}
              target="_blank"
              rel="noopener"
              className="bg-brand-solid text-cta-fg mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[0.875rem] font-semibold"
            >
              <FileText className="size-4" strokeWidth={2} aria-hidden />
              Read the guide
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
