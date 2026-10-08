import { workspaceAccess } from "@/app/admin/(panel)/workspace/actions";

/**
 * The Workspace runner (workspace/server.mjs): the Workspace service on
 * Railway, or a runner on this PC in development. The page talks to it
 * straight from the browser over WebSockets, each opened with a fresh
 * one-minute pass from the website (workspaceAccess).
 */
export type Opened = WebSocket | "unset" | "expired";

export async function openRunner(path: string): Promise<Opened> {
  let access: Awaited<ReturnType<typeof workspaceAccess>>;
  try {
    access = await workspaceAccess();
  } catch {
    // requireAdmin refused: the five-hour admin session has ended.
    return "expired";
  }
  if ("error" in access) return "unset";
  const query = access.pass ? `?pass=${encodeURIComponent(access.pass)}` : "";
  return new WebSocket(`${access.url}${path}${query}`);
}

export type SessionStatus =
  "starting" | "idle" | "working" | "needs_you" | "done" | "ended";

export type Mode = "default" | "auto" | "acceptEdits";

export type Session = {
  id: string;
  kind: "claude" | "login";
  project: string;
  title: string;
  worktree: string | null;
  mode: Mode;
  status: SessionStatus;
  activity: string;
  lastPrompt?: string;
  /** The Claude sign-in page, for a sign-in session in the cloud. */
  link?: string;
  cwd: string;
  files: string[];
  prompts: number;
  startedAt: string;
  updatedAt: string;
  live: boolean;
  /** The terminal's size, so a small preview draws it the same shape. */
  cols?: number;
  rows?: number;
};

/** The GitHub token, as the page sees it: never the token itself. */
export type GitHubInfo = {
  connected: boolean;
  login?: string;
  /** ISO date, or null for a token that never expires. */
  expiresAt?: string | null;
  savedAt?: string | null;
  /** "page": pasted in this tab; "env": the Railway variable. */
  source?: "page" | "env";
  last4?: string;
  error?: string;
};

export type Project = {
  name: string;
  path: string;
  /** False for a GitHub repo not cloned yet: its first session clones it. */
  cloned: boolean;
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
      cloud: boolean;
      github: GitHubInfo;
      root: string;
      claude: ClaudeInfo;
      projects: Project[];
      sessions: Session[];
    }
  | { t: "claude"; claude: ClaudeInfo }
  | { t: "github"; github: GitHubInfo }
  | { t: "projects"; projects: Project[] }
  | { t: "session"; session: Session }
  | { t: "removed"; id: string }
  | { t: "started"; id: string }
  | { t: "stopped" }
  | { t: "notice"; message: string }
  | { t: "error"; message: string };
