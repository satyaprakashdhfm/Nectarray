/**
 * The Workspace runner (workspace/server.mjs), on the PC this browser runs
 * on. Never a server of ours: the page talks to it straight from the
 * browser, so it only works on the machine where `npm run workspace` runs.
 */
export const RUNNER = "ws://127.0.0.1:4100";

export type SessionStatus =
  "starting" | "idle" | "working" | "needs_you" | "done" | "ended";

export type Session = {
  id: string;
  kind: "claude" | "login";
  project: string;
  title: string;
  worktree: string | null;
  mode: "default" | "acceptEdits";
  status: SessionStatus;
  activity: string;
  lastPrompt?: string;
  cwd: string;
  files: string[];
  prompts: number;
  startedAt: string;
  updatedAt: string;
  live: boolean;
};

export type Project = {
  name: string;
  path: string;
  branch: string | null;
  github: { owner: string; repo: string; url: string } | null;
};

export type ClaudeInfo = {
  installed: boolean;
  version: string | null;
  loggedIn: boolean;
  email: string | null;
  updating: boolean;
  lastUpdate: string | null;
  updateNote: string | null;
};

/** Messages from the runner's /control socket. */
export type RunnerMessage =
  | {
      t: "hello";
      root: string;
      claude: ClaudeInfo;
      projects: Project[];
      sessions: Session[];
    }
  | { t: "claude"; claude: ClaudeInfo }
  | { t: "projects"; projects: Project[] }
  | { t: "session"; session: Session }
  | { t: "removed"; id: string }
  | { t: "started"; id: string }
  | { t: "notice"; message: string }
  | { t: "error"; message: string };
