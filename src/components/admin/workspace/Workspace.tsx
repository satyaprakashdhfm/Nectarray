"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Bell,
  BellOff,
  ExternalLink,
  GitBranch,
  Loader2,
  LogIn,
  Mic,
  Play,
  Power,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  Square,
  SquareTerminal,
  X,
} from "lucide-react";
import { field, primaryButton, quietButton } from "@/components/admin/Business";
import { cn } from "@/lib/utils";
import {
  openRunner,
  type ClaudeInfo,
  type Mode,
  type Project,
  type RunnerMessage,
  type Session,
  type SessionStatus,
} from "./runner";
import { TerminalView } from "./TerminalView";
import { useVoice } from "./useVoice";

/* -------------------------------------------------------------------------- */
/* State from the runner                                                      */
/* -------------------------------------------------------------------------- */

/**
 * stopped: not started (the cloud service may be asleep, which is free).
 * starting: Start was pressed, or the connection dropped; trying every few
 * seconds while the service wakes. connected: in. unset: the website has no
 * WORKSPACE_URL. expired: the five-hour admin session ended.
 */
type Phase = "stopped" | "starting" | "connected" | "unset" | "expired";

type State = {
  phase: Phase;
  cloud: boolean;
  github: boolean;
  root: string;
  claude: ClaudeInfo | null;
  projects: Project[];
  sessions: Record<string, Session>;
};

type Action = RunnerMessage | { t: "phase"; phase: Phase };

const INITIAL: State = {
  phase: "stopped",
  cloud: false,
  github: false,
  root: "",
  claude: null,
  projects: [],
  sessions: {},
};

function reduce(state: State, action: Action): State {
  switch (action.t) {
    case "hello":
      return {
        phase: "connected",
        cloud: action.cloud,
        github: action.github,
        root: action.root,
        claude: action.claude,
        projects: action.projects,
        sessions: Object.fromEntries(action.sessions.map((s) => [s.id, s])),
      };
    case "phase":
      return { ...state, phase: action.phase };
    case "claude":
      return { ...state, claude: action.claude };
    case "projects":
      return { ...state, projects: action.projects };
    case "session":
      return {
        ...state,
        sessions: { ...state.sessions, [action.session.id]: action.session },
      };
    case "removed": {
      const { [action.id]: _gone, ...rest } = state.sessions;
      return { ...state, sessions: rest };
    }
    default:
      return state;
  }
}

/* -------------------------------------------------------------------------- */
/* Small helpers                                                              */
/* -------------------------------------------------------------------------- */

const STATUS: Record<SessionStatus, { label: string; tone: string }> = {
  starting: { label: "Starting", tone: "bg-mist text-ink-soft" },
  idle: { label: "Ready", tone: "bg-mist text-ink-soft" },
  working: { label: "Working", tone: "bg-brand-wash text-brand-deep" },
  needs_you: { label: "Needs you", tone: "bg-amber-wash text-amber-deep" },
  done: { label: "Done", tone: "bg-leaf-wash text-leaf-deep" },
  ended: { label: "Closed", tone: "bg-mist text-ink-faint" },
};

const MODES: { id: Mode; label: string }[] = [
  { id: "auto", label: "Auto: routine steps approved for you" },
  { id: "acceptEdits", label: "Accept file edits, ask for the rest" },
  { id: "default", label: "Ask before every step" },
];

const LANGS = [
  { id: "en-IN", label: "English (India)" },
  { id: "en-US", label: "English (US)" },
  { id: "en-GB", label: "English (UK)" },
];

const PREFS = "nectarray-workspace";
type Prefs = { lang: string; autoSend: boolean; alerts: boolean; on: boolean };

function readPrefs(): Prefs {
  const fallback: Prefs = {
    lang: "en-IN",
    autoSend: false,
    alerts: false,
    on: false,
  };
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(PREFS) ?? "{}") };
  } catch {
    return fallback;
  }
}

function since(iso: string, now: number) {
  const minutes = Math.max(0, Math.round((now - Date.parse(iso)) / 60_000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `${hours} h ${minutes % 60} min`;
}

/** A clock that ticks every half minute, for the "running for" times. */
function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);
  return now;
}

const noop = () => () => {};

/* -------------------------------------------------------------------------- */

/**
 * The Workspace tab: Claude Code sessions in the cloud (the Workspace service
 * on Railway), one card each, and the terminal of whichever is open.
 *
 * Nothing runs until Start. Start wakes the service and connects; Stop closes
 * every session and lets the service go back to sleep, so it costs nothing
 * while nobody is working. Every connection carries a one-minute pass the
 * website only gives an admin who is fully signed in.
 *
 * Rendered only in the browser: it reads saved preferences and opens
 * sockets, neither of which means anything on the server.
 */
export function Workspace() {
  const client = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  return client ? <WorkspaceApp /> : <Loading />;
}

function WorkspaceApp() {
  const [state, dispatch] = useReducer(reduce, INITIAL);
  const [prefs, setPrefs] = useState(readPrefs);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; error: boolean } | null>(
    null,
  );
  const socket = useRef<WebSocket | null>(null);
  const statuses = useRef<Record<string, SessionStatus>>({});
  const prefsRef = useRef(prefs);
  const now = useNow();

  useEffect(() => {
    prefsRef.current = prefs;
    try {
      localStorage.setItem(PREFS, JSON.stringify(prefs));
    } catch {}
  }, [prefs]);

  const send = useCallback((message: object) => {
    const ws = socket.current;
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message));
  }, []);

  /*
   * The control socket, while the workspace is on: retried every few seconds
   * while the service wakes or redeploys. Off, nothing connects, so an open
   * tab never keeps the service awake.
   */
  useEffect(() => {
    if (!prefs.on) {
      dispatch({ t: "phase", phase: "stopped" });
      return;
    }
    let closed = false;
    let retry: ReturnType<typeof setTimeout> | undefined;

    const alert = (session: Session) => {
      const before = statuses.current[session.id];
      statuses.current[session.id] = session.status;
      if (
        !prefsRef.current.alerts ||
        !document.hidden ||
        before === session.status ||
        (session.status !== "needs_you" && session.status !== "done") ||
        typeof Notification === "undefined" ||
        Notification.permission !== "granted"
      )
        return;
      new Notification(
        session.status === "needs_you" ? "Claude needs you" : "Claude is done",
        {
          body: `${session.title || session.project}: ${session.activity}`,
          tag: session.id,
        },
      );
    };

    const connect = async () => {
      dispatch({ t: "phase", phase: "starting" });
      const opened = await openRunner("/control");
      if (closed) {
        if (typeof opened !== "string") opened.close();
        return;
      }
      if (typeof opened === "string") {
        dispatch({ t: "phase", phase: opened });
        return;
      }
      const ws = opened;
      socket.current = ws;
      ws.onmessage = (event) => {
        const message = JSON.parse(String(event.data)) as RunnerMessage;
        if (message.t === "hello")
          for (const s of message.sessions) statuses.current[s.id] = s.status;
        if (message.t === "session") alert(message.session);
        if (message.t === "started") setSessionId(message.id);
        if (message.t === "notice" || message.t === "error")
          setToast({ text: message.message, error: message.t === "error" });
        dispatch(message);
      };
      ws.onclose = () => {
        if (socket.current === ws) socket.current = null;
        if (closed) return;
        dispatch({ t: "phase", phase: "starting" });
        retry = setTimeout(connect, 3000);
      };
    };
    void connect();

    return () => {
      closed = true;
      clearTimeout(retry);
      socket.current?.close();
      socket.current = null;
    };
  }, [prefs.on]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), toast.error ? 9000 : 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const sessions = Object.values(state.sessions).sort(
    (a, b) =>
      Number(a.status === "ended") - Number(b.status === "ended") ||
      b.startedAt.localeCompare(a.startedAt),
  );
  const waiting = sessions.filter((s) => s.status === "needs_you").length;

  useEffect(() => {
    const base = "Workspace | NectArray Admin";
    document.title = waiting ? `(${waiting}) ${base}` : base;
  }, [waiting]);

  const start = () => setPrefs((p) => ({ ...p, on: true }));
  const stop = () => {
    const live = sessions.filter((s) => s.live).length;
    if (
      live > 0 &&
      !confirm(
        `Stop the workspace? ${live} running session${live === 1 ? "" : "s"} will close. Conversations are kept and can be resumed.`,
      )
    )
      return;
    send({ t: "shutdown" });
    setTimeout(() => setPrefs((p) => ({ ...p, on: false })), 300);
  };

  if (state.phase === "unset") return <NotSetUp />;
  if (state.phase === "expired") return <Expired />;
  if (state.phase === "stopped") return <Stopped onStart={start} />;
  if (state.phase === "starting" && !state.claude)
    return <Waking onCancel={() => setPrefs((p) => ({ ...p, on: false }))} />;

  const project =
    state.projects.find((p) => p.name === projectName) ??
    state.projects.find((p) => p.name === "Nectarray") ??
    state.projects[0] ??
    null;
  const current =
    (sessionId && state.sessions[sessionId]) || sessions[0] || null;

  return (
    <div className="mt-6 space-y-6">
      <StatusStrip
        claude={state.claude}
        reconnecting={state.phase === "starting"}
        alerts={prefs.alerts}
        onAlerts={async () => {
          if (!prefs.alerts && typeof Notification !== "undefined") {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
              setToast({
                text: "Alerts are blocked for this site in the browser settings.",
                error: true,
              });
              return;
            }
          }
          setPrefs((p) => ({ ...p, alerts: !p.alerts }));
        }}
        onStop={stop}
        send={send}
      />

      {toast && (
        <p
          role="status"
          className={cn(
            "rounded-lg border px-4 py-2.5 text-[0.8125rem] font-medium",
            toast.error
              ? "border-danger/30 text-danger bg-surface"
              : "border-line bg-surface text-ink-soft",
          )}
        >
          {toast.text}
        </p>
      )}

      {state.cloud && !state.github && (
        <p className="border-amber/30 bg-amber-wash text-amber-deep rounded-lg border px-4 py-2.5 text-[0.8125rem]">
          No GitHub token yet, so only public repos can be opened and nothing
          can be pushed. Add GITHUB_TOKEN to the Workspace service on Railway.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="min-w-0 space-y-6">
          <Projects
            root={state.root}
            projects={state.projects}
            sessions={sessions}
            selected={project?.name ?? null}
            onSelect={setProjectName}
            send={send}
          />
          {project && (
            <NewSession
              key={project.name}
              project={project}
              busy={sessions.some((s) => s.project === project.name && s.live)}
              send={send}
            />
          )}
          <ConnectRepo send={send} />
        </aside>

        <div className="min-w-0 space-y-6">
          <Board
            sessions={sessions}
            current={current?.id ?? null}
            onOpen={setSessionId}
            now={now}
          />
          {current && (
            <SessionPanel
              session={current}
              prefs={prefs}
              setPrefs={setPrefs}
              send={send}
              onRemoved={() => setSessionId(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Before there is anything to show                                           */
/* -------------------------------------------------------------------------- */

function Loading() {
  return (
    <div
      className="mt-6 grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]"
      aria-hidden
    >
      <div className="bg-mist-deep h-72 animate-pulse rounded-xl" />
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-mist-deep h-32 animate-pulse rounded-xl" />
          <div className="bg-mist-deep h-32 animate-pulse rounded-xl" />
        </div>
        <div className="bg-mist-deep h-80 animate-pulse rounded-xl" />
      </div>
    </div>
  );
}

function Panel({
  children,
  icon = true,
}: {
  children: React.ReactNode;
  icon?: boolean;
}) {
  return (
    <div className="card mt-6 max-w-2xl p-5 sm:p-6">
      <div className="flex items-start gap-3">
        {icon && (
          <SquareTerminal
            className="text-brand-deep mt-0.5 size-5 shrink-0"
            strokeWidth={1.9}
            aria-hidden
          />
        )}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

function Stopped({ onStart }: { onStart: () => void }) {
  return (
    <Panel>
      <h2 className="text-ink text-[1.0625rem] font-semibold">
        The workspace is stopped
      </h2>
      <p className="text-ink-soft mt-1.5 text-[0.875rem]">
        It runs Claude Code in the cloud, on any of your repos, and costs
        nothing while it is stopped. Start it to work; Stop it when you are
        done.
      </p>
      <button
        type="button"
        onClick={onStart}
        className={cn(
          primaryButton,
          "mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-[0.875rem]",
        )}
      >
        <Power className="size-4" aria-hidden />
        Start the workspace
      </button>
    </Panel>
  );
}

function Waking({ onCancel }: { onCancel: () => void }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <Panel>
      <h2 className="text-ink flex items-center gap-2 text-[1.0625rem] font-semibold">
        <Loader2
          className="text-brand-deep size-4 motion-safe:animate-spin"
          aria-hidden
        />
        Starting the workspace
      </h2>
      <p className="text-ink-soft mt-1.5 text-[0.875rem]">
        {seconds < 45
          ? "Waking the cloud service. This usually takes under a minute."
          : seconds < 180
            ? "Still waking. The very first start also installs Claude Code, which takes a couple of minutes."
            : "This is taking longer than it should. Check the Workspace service on Railway; this page keeps trying."}
      </p>
      <p className="text-ink-faint mt-3 text-[0.75rem]">{seconds}s</p>
      <button
        type="button"
        onClick={onCancel}
        className={cn(quietButton, "mt-4")}
      >
        Cancel
      </button>
    </Panel>
  );
}

function NotSetUp() {
  return (
    <Panel>
      <h2 className="text-ink text-[1.0625rem] font-semibold">
        The cloud workspace is not set up yet
      </h2>
      <p className="text-ink-soft mt-1.5 text-[0.875rem]">
        The website needs WORKSPACE_URL and WORKSPACE_SECRET, pointing at the
        Workspace service on Railway.
      </p>
    </Panel>
  );
}

function Expired() {
  return (
    <Panel>
      <h2 className="text-ink text-[1.0625rem] font-semibold">
        Your admin session has ended
      </h2>
      <p className="text-ink-soft mt-1.5 text-[0.875rem]">
        Admin sign-ins last five hours. Sign in again with Google and the
        emailed code; running sessions keep going in the meantime.
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className={cn(primaryButton, "mt-5 inline-flex items-center gap-2")}
      >
        <LogIn className="size-3.5" aria-hidden />
        Sign in again
      </button>
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/* Claude Code: version, sign-in, alerts, Stop                                 */
/* -------------------------------------------------------------------------- */

function StatusStrip({
  claude,
  reconnecting,
  alerts,
  onAlerts,
  onStop,
  send,
}: {
  claude: ClaudeInfo | null;
  reconnecting: boolean;
  alerts: boolean;
  onAlerts: () => void;
  onStop: () => void;
  send: (m: object) => void;
}) {
  if (!claude) return null;
  return (
    <div className="card flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-5">
      <div className="min-w-0">
        <p className="text-ink-faint text-[0.6875rem] font-semibold">
          Claude Code
        </p>
        {claude.installed ? (
          <p className="text-ink text-[0.875rem] font-semibold">
            {claude.version ?? "Installed"}
            <span className="text-ink-faint ml-2 font-normal">
              {reconnecting
                ? "Reconnecting…"
                : claude.updating
                  ? "Updating…"
                  : (claude.updateNote ?? "Updates itself")}
            </span>
          </p>
        ) : (
          <p className="text-danger text-[0.875rem] font-semibold">
            Not installed yet
          </p>
        )}
      </div>

      <div className="min-w-0">
        <p className="text-ink-faint text-[0.6875rem] font-semibold">
          Claude account
        </p>
        <p className="text-ink truncate text-[0.875rem] font-semibold">
          {claude.loggedIn
            ? (claude.email ?? "Signed in")
            : "Not signed in, press Sign in"}
        </p>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        {claude.installed && (
          <button
            type="button"
            disabled={claude.updating}
            onClick={() => send({ t: "update" })}
            className={cn(
              quietButton,
              "inline-flex items-center gap-1.5 disabled:opacity-50",
            )}
          >
            <RefreshCw
              className={cn(
                "size-3.5",
                claude.updating && "motion-safe:animate-spin",
              )}
              aria-hidden
            />
            {claude.updating ? "Updating" : "Update now"}
          </button>
        )}
        {claude.installed && (
          <button
            type="button"
            onClick={() => send({ t: "login" })}
            className={cn(
              claude.loggedIn ? quietButton : primaryButton,
              "inline-flex items-center gap-1.5",
            )}
          >
            <LogIn className="size-3.5" aria-hidden />
            {claude.loggedIn ? "Switch account" : "Sign in"}
          </button>
        )}
        <button
          type="button"
          onClick={onAlerts}
          aria-pressed={alerts}
          className={cn(quietButton, "inline-flex items-center gap-1.5")}
          title="A desktop alert when a session needs you or finishes while this tab is in the background"
        >
          {alerts ? (
            <Bell className="size-3.5" aria-hidden />
          ) : (
            <BellOff className="size-3.5" aria-hidden />
          )}
          {alerts ? "Alerts on" : "Alerts off"}
        </button>
        <button
          type="button"
          onClick={onStop}
          className="border-danger/40 text-danger hover:bg-danger/10 inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors"
        >
          <Power className="size-3.5" aria-hidden />
          Stop workspace
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Repos                                                                      */
/* -------------------------------------------------------------------------- */

function Projects({
  root,
  projects,
  sessions,
  selected,
  onSelect,
  send,
}: {
  root: string;
  projects: Project[];
  sessions: Session[];
  selected: string | null;
  onSelect: (name: string) => void;
  send: (m: object) => void;
}) {
  const [query, setQuery] = useState("");
  const shown = projects.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <section>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-ink text-[1rem] font-semibold">Repos</h2>
        <button
          type="button"
          onClick={() => send({ t: "projects" })}
          className="text-ink-faint hover:text-brand-deep rounded-md p-1 transition-colors"
          title="Look for repos again"
          aria-label="Refresh repos"
        >
          <RefreshCw className="size-3.5" aria-hidden />
        </button>
      </div>
      {projects.length > 6 && (
        <div className="relative mb-2">
          <Search
            className="text-ink-faint pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2"
            aria-hidden
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={cn(field, "pl-8")}
            placeholder="Find a repo"
            aria-label="Find a repo"
          />
        </div>
      )}
      {projects.length === 0 ? (
        <p className="text-ink-soft text-[0.8125rem]">
          No repos yet in {root}. Connect one below.
        </p>
      ) : (
        <ul className="max-h-[26rem] space-y-1 overflow-y-auto pr-1">
          {shown.map((p) => {
            const live = sessions.filter(
              (s) => s.project === p.name && s.live,
            ).length;
            const active = p.name === selected;
            return (
              <li key={p.name} className="relative">
                <button
                  type="button"
                  onClick={() => onSelect(p.name)}
                  aria-pressed={active}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 pr-9 text-left transition-colors",
                    active
                      ? "bg-brand-solid text-cta-fg"
                      : "text-ink hover:bg-surface",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.875rem] font-semibold">
                      {p.name}
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-1 truncate text-[0.75rem]",
                        active ? "text-cta-fg/75" : "text-ink-faint",
                      )}
                    >
                      <GitBranch className="size-3 shrink-0" aria-hidden />
                      {p.branch ?? "no branch"}
                      {!p.cloned && ", not opened yet"}
                      {!p.github && ", not on GitHub"}
                    </span>
                  </span>
                  {live > 0 && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 text-[0.6875rem] font-bold",
                        active
                          ? "bg-cta-fg/20"
                          : "bg-brand-wash text-brand-deep",
                      )}
                      title={`${live} running`}
                    >
                      {live}
                    </span>
                  )}
                </button>
                {p.github && (
                  <a
                    href={p.github.url}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 transition-colors",
                      active
                        ? "text-cta-fg/70 hover:text-cta-fg"
                        : "text-ink-faint hover:text-brand-deep",
                    )}
                    title={`${p.github.owner}/${p.github.repo} on GitHub`}
                    aria-label={`Open ${p.name} on GitHub`}
                  >
                    <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                )}
              </li>
            );
          })}
          {shown.length === 0 && (
            <li className="text-ink-faint px-3 py-2 text-[0.8125rem]">
              No repo matches.
            </li>
          )}
        </ul>
      )}
    </section>
  );
}

function NewSession({
  project,
  busy,
  send,
}: {
  project: Project;
  busy: boolean;
  send: (m: object) => void;
}) {
  const [title, setTitle] = useState("");
  // A second session in the same repo gets its own copy by default.
  const [ownCopy, setOwnCopy] = useState(busy);
  const [mode, setMode] = useState<Mode>("auto");

  return (
    <form
      className="card space-y-3 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        send({
          t: "start",
          project: project.name,
          title,
          worktree: ownCopy,
          mode,
        });
        setTitle("");
      }}
    >
      <h2 className="text-ink text-[0.9375rem] font-semibold">
        New session in {project.name}
      </h2>
      {!project.cloned && (
        <p className="text-ink-faint text-[0.75rem]">
          The first session gets this repo from GitHub, which can take a minute.
        </p>
      )}
      <div>
        <label
          htmlFor="ws-title"
          className="text-ink-faint mb-1 block text-[0.6875rem] font-semibold"
        >
          What it is for (optional)
        </label>
        <input
          id="ws-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={field}
          maxLength={80}
          placeholder="Blog page SEO"
        />
      </div>
      <label className="text-ink-soft flex items-start gap-2 text-[0.8125rem]">
        <input
          type="checkbox"
          checked={ownCopy}
          onChange={(e) => setOwnCopy(e.target.checked)}
          className="accent-brand mt-0.5"
        />
        <span>
          Own copy of the repo
          <span className="text-ink-faint block text-[0.75rem]">
            A git worktree on its own branch, so parallel sessions never edit
            the same files.
          </span>
        </span>
      </label>
      <div>
        <label
          htmlFor="ws-mode"
          className="text-ink-faint mb-1 block text-[0.6875rem] font-semibold"
        >
          Permissions
        </label>
        <select
          id="ws-mode"
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          className={field}
        >
          {MODES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className={cn(
          primaryButton,
          "inline-flex w-full items-center justify-center gap-1.5 py-2",
        )}
      >
        <Play className="size-3.5" aria-hidden />
        Start session
      </button>
    </form>
  );
}

function ConnectRepo({ send }: { send: (m: object) => void }) {
  const [url, setUrl] = useState("");
  return (
    <form
      className="space-y-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (!url.trim()) return;
        send({ t: "clone", url: url.trim() });
        setUrl("");
      }}
    >
      <label
        htmlFor="ws-clone"
        className="text-ink text-[0.875rem] font-semibold"
      >
        Connect another repo
      </label>
      <p className="text-ink-faint text-[0.75rem]">
        Any GitHub link, including public repos that are not yours.
      </p>
      <div className="flex gap-2">
        <input
          id="ws-clone"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={field}
          placeholder="https://github.com/owner/repo"
          inputMode="url"
        />
        <button type="submit" className={quietButton}>
          Clone
        </button>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/* Sessions                                                                   */
/* -------------------------------------------------------------------------- */

function StatusPill({ status }: { status: SessionStatus }) {
  const s = STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold whitespace-nowrap",
        s.tone,
      )}
    >
      {status === "working" && (
        <span
          className="bg-brand-deep size-1.5 rounded-full motion-safe:animate-pulse"
          aria-hidden
        />
      )}
      {s.label}
    </span>
  );
}

function Board({
  sessions,
  current,
  onOpen,
  now,
}: {
  sessions: Session[];
  current: string | null;
  onOpen: (id: string) => void;
  now: number;
}) {
  if (sessions.length === 0)
    return (
      <div className="card p-6">
        <p className="text-ink text-[0.9375rem] font-semibold">
          No sessions yet
        </p>
        <p className="text-ink-soft mt-1 text-[0.875rem]">
          Pick a repo and start one. Each session is its own Claude Code, and
          you can run as many side by side as you like, on one repo or many.
        </p>
      </div>
    );

  return (
    <section aria-label="Sessions">
      <ul className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
        {sessions.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onOpen(s.id)}
              aria-current={s.id === current ? "true" : undefined}
              className={cn(
                "card block h-full w-full p-4 text-left transition-[box-shadow,transform] active:scale-[0.99]",
                s.id === current
                  ? "ring-brand ring-2"
                  : "hover:ring-line hover:ring-1",
                s.status === "ended" && "opacity-70",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-ink line-clamp-2 min-w-0 text-[0.9375rem] font-semibold">
                  {s.title ||
                    (s.kind === "login" ? "Sign in to Claude" : "New session")}
                </p>
                <StatusPill status={s.status} />
              </div>
              <p className="text-ink-faint mt-1 flex items-center gap-1 truncate text-[0.75rem]">
                {s.project}
                {s.worktree && (
                  <>
                    <GitBranch className="ml-1 size-3 shrink-0" aria-hidden />
                    {s.worktree}
                  </>
                )}
              </p>
              <p
                className={cn(
                  "mt-3 line-clamp-2 text-[0.8125rem]",
                  s.status === "needs_you"
                    ? "text-amber-deep font-medium"
                    : "text-ink-soft",
                )}
              >
                {s.activity}
              </p>
              <p className="text-ink-faint mt-3 text-[0.75rem]">
                {s.status === "ended" ? "Ran" : "Running"} for{" "}
                {since(s.startedAt, now)}
                {s.files.length > 0 &&
                  `, ${s.files.length} file${s.files.length === 1 ? "" : "s"} edited`}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SessionPanel({
  session,
  prefs,
  setPrefs,
  send,
  onRemoved,
}: {
  session: Session;
  prefs: Prefs;
  setPrefs: (update: (p: Prefs) => Prefs) => void;
  send: (m: object) => void;
  onRemoved: () => void;
}) {
  return (
    <section
      aria-label="Terminal"
      className="border-line bg-surface overflow-hidden rounded-xl border"
    >
      <div className="border-line flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <SquareTerminal
            className="text-ink-faint size-4 shrink-0"
            strokeWidth={1.9}
            aria-hidden
          />
          <p className="text-ink truncate text-[0.875rem] font-semibold">
            {session.title || session.project}
          </p>
          <StatusPill status={session.status} />
        </div>
        <div className="flex items-center gap-2">
          {session.live ? (
            <button
              type="button"
              onClick={() => {
                if (confirm("Stop this session? Claude Code closes."))
                  send({ t: "stop", id: session.id });
              }}
              className={cn(quietButton, "inline-flex items-center gap-1.5")}
            >
              <Square className="size-3.5" aria-hidden />
              Stop
            </button>
          ) : (
            <>
              {session.kind === "claude" && (
                <button
                  type="button"
                  onClick={() => send({ t: "resume", id: session.id })}
                  className={cn(
                    primaryButton,
                    "inline-flex items-center gap-1.5",
                  )}
                >
                  <RotateCcw className="size-3.5" aria-hidden />
                  Resume
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  send({ t: "remove", id: session.id });
                  onRemoved();
                }}
                className={cn(quietButton, "inline-flex items-center gap-1.5")}
              >
                <X className="size-3.5" aria-hidden />
                Remove
              </button>
            </>
          )}
        </div>
      </div>

      {session.kind === "login" && session.link && session.live && (
        <div className="border-line bg-brand-wash flex flex-wrap items-center gap-3 border-b px-4 py-3">
          <p className="text-ink min-w-0 flex-1 text-[0.8125rem]">
            Open the sign-in page, choose Continue with Google, then paste the
            code it shows into the box under the terminal and press Send.
          </p>
          <a
            href={session.link}
            target="_blank"
            rel="noreferrer"
            className={cn(primaryButton, "inline-flex items-center gap-1.5")}
          >
            <ExternalLink className="size-3.5" aria-hidden />
            Open the sign-in page
          </a>
        </div>
      )}

      <div className="h-[min(64dvh,44rem)] min-h-[20rem]">
        <TerminalView
          key={`${session.id}-${session.startedAt}-${session.live}`}
          id={session.id}
        />
      </div>

      {session.live && (
        <PromptBar
          key={session.id}
          sessionId={session.id}
          prefs={prefs}
          setPrefs={setPrefs}
          send={send}
        />
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Typing, pasting and voice                                                  */
/* -------------------------------------------------------------------------- */

/**
 * A message box under the terminal: type or paste (the sign-in code, a long
 * prompt, anything awkward on a phone), or hold the mic and talk. Spoken
 * words land in the box to check first, unless "Send right away" is on.
 * Send types the box into Claude Code and presses Enter; an empty Send just
 * presses Enter.
 */
function PromptBar({
  sessionId,
  prefs,
  setPrefs,
  send,
}: {
  sessionId: string;
  prefs: Prefs;
  setPrefs: (update: (p: Prefs) => Prefs) => void;
  send: (m: object) => void;
}) {
  const [text, setText] = useState("");

  const submit = (value: string) => {
    send({ t: "type", id: sessionId, text: value, enter: true });
    setText("");
  };

  const voice = useVoice({
    lang: prefs.lang,
    onText: (heard) => {
      if (prefs.autoSend) submit(text ? `${text} ${heard}` : heard);
      else setText((t) => (t ? `${t} ${heard}` : heard));
    },
  });

  const hold = {
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      voice.start();
    },
    onPointerUp: () => voice.stop(),
    onPointerCancel: () => voice.stop(),
    onKeyDown: (e: React.KeyboardEvent) => {
      if ((e.key === " " || e.key === "Enter") && !e.repeat) {
        e.preventDefault();
        voice.start();
      }
    },
    onKeyUp: (e: React.KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") voice.stop();
    },
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  };

  return (
    <div className="border-line space-y-2 border-t px-4 py-3">
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit(text);
        }}
      >
        {voice.supported && (
          <button
            type="button"
            {...hold}
            aria-pressed={voice.listening}
            aria-label="Hold to talk"
            title="Hold to talk"
            className={cn(
              "inline-flex shrink-0 touch-none items-center gap-2 rounded-lg px-3 py-2 text-[0.8125rem] font-semibold transition-[background-color,transform] select-none active:scale-[0.98]",
              voice.listening
                ? "bg-amber text-night"
                : "bg-ink text-cta-fg hover:bg-brand-deep",
            )}
          >
            <Mic
              className={cn(
                "size-4",
                voice.listening && "motion-safe:animate-pulse",
              )}
              aria-hidden
            />
            <span className="hidden sm:inline">
              {voice.listening ? "Listening" : "Hold to talk"}
            </span>
          </button>
        )}
        <input
          value={voice.listening ? voice.heard || text : text}
          onChange={(e) => setText(e.target.value)}
          readOnly={voice.listening}
          className={cn(field, "min-w-0 flex-1 py-2")}
          placeholder={
            voice.listening
              ? "Speak now"
              : "Type, paste or talk. Enter sends it to Claude"
          }
          aria-label="Message for Claude"
        />
        <button
          type="submit"
          className={cn(primaryButton, "inline-flex items-center gap-1.5 py-2")}
        >
          <Send className="size-3.5" aria-hidden />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {voice.error ? (
          <p className="text-danger text-[0.75rem]">{voice.error}</p>
        ) : !voice.supported ? (
          <p className="text-ink-faint text-[0.75rem]">
            Voice needs Chrome or Edge.
          </p>
        ) : null}
        {voice.supported && (
          <>
            <select
              value={prefs.lang}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, lang: e.target.value }))
              }
              className={cn(field, "w-auto py-0.5 text-[0.75rem]")}
              aria-label="Voice language"
            >
              {LANGS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
            <label className="text-ink-soft flex items-center gap-1.5 text-[0.75rem]">
              <input
                type="checkbox"
                checked={prefs.autoSend}
                onChange={(e) =>
                  setPrefs((p) => ({ ...p, autoSend: e.target.checked }))
                }
                className="accent-brand"
              />
              Send speech right away
            </label>
          </>
        )}
      </div>
    </div>
  );
}
