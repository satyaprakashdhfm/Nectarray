"use client";

import { useState } from "react";
import { FileText, FolderGit2, MessageSquareText, Users } from "lucide-react";
import type { ResumeFiles } from "@/lib/resume-files";
import { HrQuestions } from "./HrQuestions";
import { IntroEditor } from "./IntroEditor";
import { PlacementProjects } from "./PlacementProjects";
import { ResumeStudio } from "./ResumeStudio";

export type PlacementTool = "intro" | "resume" | "hr" | "projects";

const TOOLS = [
  { id: "intro", label: "Self-introduction", icon: MessageSquareText },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "hr", label: "HR questions", icon: Users },
  { id: "projects", label: "Projects", icon: FolderGit2 },
] as const;

/**
 * The tools, switched here rather than by navigating.
 *
 * A link per tab would re-render the page on the server and throw away
 * whatever was typed in the other tool. They stay mounted instead, and the
 * address bar is updated in place so a refresh lands on the same tab. The
 * resume editor mounts the first time it is opened, since it compiles a PDF
 * the moment it appears, and so do the projects, which load a PDF too.
 */
export function PlacementTools({
  userId,
  initialTool,
  initialProject,
  intro,
  files,
  pdfName,
  compilerReady,
}: {
  userId: string;
  initialTool: PlacementTool;
  initialProject?: string;
  intro: string;
  files: ResumeFiles;
  pdfName: string;
  compilerReady: boolean;
}) {
  const [tool, setTool] = useState<PlacementTool>(initialTool);
  const [resumeOpened, setResumeOpened] = useState(initialTool === "resume");
  const [projectsOpened, setProjectsOpened] = useState(
    initialTool === "projects",
  );

  function choose(next: PlacementTool) {
    setTool(next);
    if (next === "resume") setResumeOpened(true);
    if (next === "projects") setProjectsOpened(true);
    const url = new URL(window.location.href);
    url.searchParams.set("tool", next);
    if (next !== "projects") url.searchParams.delete("project");
    window.history.replaceState(null, "", url);
  }

  const tabs = (
    <nav aria-label="Placement tools">
      <ul className="tab-bar">
        {TOOLS.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              onClick={() => choose(entry.id)}
              aria-current={tool === entry.id ? "page" : undefined}
              className="tab"
            >
              <entry.icon
                className="size-[1.0625rem]"
                strokeWidth={1.9}
                aria-hidden
              />
              {entry.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      <div hidden={tool !== "intro"}>
        <IntroEditor userId={userId} initial={intro} tabs={tabs} />
      </div>
      {resumeOpened && (
        <div hidden={tool !== "resume"}>
          <ResumeStudio
            userId={userId}
            initialFiles={files}
            pdfName={pdfName}
            compilerReady={compilerReady}
            tabs={tabs}
          />
        </div>
      )}
      <div hidden={tool !== "hr"}>
        <HrQuestions tabs={tabs} />
      </div>
      {projectsOpened && (
        <div hidden={tool !== "projects"}>
          <PlacementProjects tabs={tabs} initial={initialProject} />
        </div>
      )}
    </>
  );
}
