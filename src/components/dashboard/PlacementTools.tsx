"use client";

import { useState } from "react";
import { FileText, MessageSquareText, Users } from "lucide-react";
import type { ResumeFiles } from "@/lib/resume-files";
import { HrQuestions } from "./HrQuestions";
import { IntroEditor } from "./IntroEditor";
import { ResumeStudio } from "./ResumeStudio";

export type PlacementTool = "intro" | "resume" | "hr";

const TOOLS = [
  { id: "intro", label: "Self-introduction", icon: MessageSquareText },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "hr", label: "HR questions", icon: Users },
] as const;

/**
 * The three tools, switched here rather than by navigating.
 *
 * A link per tab would re-render the page on the server and throw away
 * whatever was typed in the other tool. Both stay mounted instead, and the
 * address bar is updated in place so a refresh lands on the same tab. The
 * resume editor mounts the first time it is opened, since it compiles a PDF
 * the moment it appears.
 */
export function PlacementTools({
  userId,
  initialTool,
  intro,
  files,
  pdfName,
  compilerReady,
}: {
  userId: string;
  initialTool: PlacementTool;
  intro: string;
  files: ResumeFiles;
  pdfName: string;
  compilerReady: boolean;
}) {
  const [tool, setTool] = useState<PlacementTool>(initialTool);
  const [resumeOpened, setResumeOpened] = useState(initialTool === "resume");

  function choose(next: PlacementTool) {
    setTool(next);
    if (next === "resume") setResumeOpened(true);
    const url = new URL(window.location.href);
    url.searchParams.set("tool", next);
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
    </>
  );
}
