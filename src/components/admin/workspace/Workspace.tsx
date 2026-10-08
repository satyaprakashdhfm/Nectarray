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
  KeyRound,
  LayoutGrid,
  Loader2,
  LogIn,
  Maximize2,
  Mic,
  Minimize2,
  Play,
  Plus,
  Power,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  Settings2,
  Square,
  SquareTerminal,
  X,
} from "lucide-react";
import { field, primaryButton, quietButton } from "@/components/admin/Business";
import { cn } from "@/lib/utils";
import {
  openRunner,
  type ClaudeInfo,
  type GitHubInfo,
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
  github: GitHubInfo;
  root: string;
  claude: ClaudeInfo | null;
  projects: Project[];
  sessions: Record<string, Session>;
};

type Action = RunnerMessage | { t: "phase"; phase: Phase };

const INITIAL: State = {
  phase: "stopped",
  cloud: false,
  github: { connected: false },
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
    case "github":
      return { ...state, github: action.github };
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

/** Status colours on the dark terminal ground. */
const STATUS: Record<SessionStatus, { label: string; tone: string }> = {
  starting: { label: "Starting", tone: "bg-white/10 text-white/70" },
  idle: { label: "Ready", tone: "bg-white/10 text-white/75" },
  working: { label: "Working", tone: "bg-brand/20 text-brand" },
  needs_you: { label: "Needs you", tone: "bg-amber/20 text-amber" },
  done: { label: "Done", tone: "bg-leaf/20 text-leaf" },
  ended: { label: "Closed", tone: "bg-white/5 text-white/45" },
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

/**
 * Keys as the terminal sends them: for picking options in Claude Code (the
 * arrows, Enter, Esc), switching its mode (Shift+Tab) or stopping a command
 * (Ctrl+C), from a phone or without clicking into the terminal first.
 */
const KEYS: [label: string, sequence: string, name: string][] = [
  ["↑", "\x1b[A", "Up arrow"],
  ["↓", "\x1b[B", "Down arrow"],
  ["←", "\x1b[D", "Left arrow"],
  ["→", "\x1b[C", "Right arrow"],
  ["Enter", "\r", "Enter"],
  ["Esc", "\x1b", "Escape"],
  ["Tab", "\t", "Tab"],
  ["⇧Tab", "\x1b[Z", "Shift+Tab: switch Claude's mode"],
  ["Ctrl+C", "\x03", "Ctrl+C: stop what is running"],
];

/** Keys the empty message box hands straight to the terminal. */
const PASS_THROUGH: Record<string, string> = {
  ArrowUp: "\x1b[A",
  ArrowDown: "\x1b[B",
  ArrowLeft: "\x1b[D",
  ArrowRight: "\x1b[C",
  Escape: "\x1b",
  Tab: "\t",
  ShiftTab: "\x1b[Z",
};

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

const day = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/** Whole days until a date; negative once it has passed. */
const daysLeft = (iso: string, now: number) =>
  Math.ceil((Date.parse(iso) - now) / 86_400_000);

/** A clock that ticks every half minute, for times and expiry dates. */
function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);
  return now;
}

const noop = () => () => {};

const sessionName = (s: Session) =>
  s.title ||
  (s.kind === "login"
    ? "Sign in to Claude"
    : s.kind === "shell"
      ? "Terminal"
      : "New session");

/* -------------------------------------------------------------------------- */

/**
 * The Workspace tab: a terminal space. Every Claude Code session (and any
 * plain terminal) is a window in a dark grid, live; click one to bring it
 * into the main view, maximize it to the whole screen, or send it back.
 * Repos, the GitHub token and Claude Code's own setup live in side panels,
 * so the space holds nothing but terminals.
 *
 * Nothing runs until Start. Start wakes the Workspace service on Railway;
 * Stop closes every session and lets it go back to sleep, so it costs nothing
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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [maximized, setMaximized] = useState(false);
  const [drawer, setDrawer] = useState<"new" | "setup" | null>(null);
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
          body: `${sessionName(session)}: ${session.activity}`,
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
        if (message.t === "started") {
          setSessionId(message.id);
          setDrawer(null);
        }
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
      a.startedAt.localeCompare(b.startedAt),
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
  const toggleAlerts = async () => {
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
  };

  if (state.phase === "unset") return <NotSetUp />;
  if (state.phase === "expired") return <Expired />;
  if (state.phase === "stopped") return <Stopped onStart={start} />;
  if (state.phase === "starting" && !state.claude)
    return <Waking onCancel={() => setPrefs((p) => ({ ...p, on: false }))} />;

  // The session in the main view; none means every session is a tile.
  const focused = (sessionId && state.sessions[sessionId]) || null;
  const others = focused
    ? sessions.filter((s) => s.id !== focused.id)
    : sessions;

  return (
    <div className="mt-6 space-y-4">
      <Toolbar
        claude={state.claude}
        github={state.cloud ? state.github : null}
        now={now}
        reconnecting={state.phase === "starting"}
        alerts={prefs.alerts}
        onNew={() => setDrawer("new")}
        onSetup={() => setDrawer("setup")}
        onAlerts={toggleAlerts}
        onStop={stop}
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
      {state.cloud && (
        <TokenWarning
          github={state.github}
          now={now}
          onFix={() => setDrawer("setup")}
        />
      )}

      {/* The terminal space. */}
      <div className="bg-night rounded-2xl p-2.5 sm:p-3">
        {sessions.length === 0 ? (
          <EmptySpace onNew={() => setDrawer("new")} />
        ) : (
          <div className="space-y-3">
            {focused && (
              <MainTerminal
                key={focused.id}
                session={focused}
                maximized={maximized}
                onMaximize={setMaximized}
                onMinimize={() => {
                  setSessionId(null);
                  setMaximized(false);
                }}
                prefs={prefs}
                setPrefs={setPrefs}
                send={send}
              />
            )}
            {others.length > 0 && (
              <ul
                aria-label={focused ? "Other sessions" : "Sessions"}
                className={cn(
                  "grid gap-2.5",
                  focused
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                    : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
                )}
              >
                {others.map((s) => (
                  <li key={s.id}>
                    <Tile
                      session={s}
                      now={now}
                      onOpen={() => {
                        setSessionId(s.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <Drawer
        open={drawer === "new"}
        title="New session"
        onClose={() => setDrawer(null)}
      >
        <NewSession projects={state.projects} sessions={sessions} send={send} />
      </Drawer>
      <Drawer
        open={drawer === "setup"}
        title="Setup"
        onClose={() => setDrawer(null)}
      >
        <div className="space-y-5">
          {state.claude && (
            <ClaudeSetup
              claude={state.claude}
              cloud={state.cloud}
              send={send}
            />
          )}
          {state.cloud && (
            <GitHubPanel github={state.github} now={now} send={send} />
          )}
          <ConnectRepo send={send} />
        </div>
      </Drawer>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Before there is anything to show                                           */
/* -------------------------------------------------------------------------- */

function Loading() {
  return (
    <div className="mt-6 space-y-4" aria-hidden>
      <div className="bg-mist-deep h-14 animate-pulse rounded-xl" />
      <div className="bg-night grid gap-2.5 rounded-2xl p-3 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-night-soft h-56 animate-pulse rounded-xl"
          />
        ))}
      </div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="card mt-6 max-w-2xl p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <SquareTerminal
          className="text-brand-deep mt-0.5 size-5 shrink-0"
          strokeWidth={1.9}
          aria-hidden
        />
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

function EmptySpace({ onNew }: { onNew: () => void }) {
  return (
    <div className="grid min-h-[50dvh] place-items-center px-4 py-12 text-center">
      <div className="max-w-md">
        <SquareTerminal
          className="mx-auto size-8 text-white/40"
          strokeWidth={1.5}
          aria-hidden
        />
        <p className="mt-4 text-[1rem] font-semibold text-white">
          No sessions yet
        </p>
        <p className="mt-1.5 text-[0.875rem] text-white/60">
          Start Claude Code on any of your repos. Every session gets its own
          window here, and you can run as many as you like at once.
        </p>
        <button
          type="button"
          onClick={onNew}
          className="bg-brand text-night hover:bg-brand/90 mt-5 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[0.875rem] font-semibold transition-[background-color,transform] active:scale-[0.98]"
        >
          <Plus className="size-4" aria-hidden />
          New session
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* The bar above the space                                                    */
/* -------------------------------------------------------------------------- */

function Toolbar({
  claude,
  github,
  now,
  reconnecting,
  alerts,
  onNew,
  onSetup,
  onAlerts,
  onStop,
}: {
  claude: ClaudeInfo | null;
  github: GitHubInfo | null;
  now: number;
  reconnecting: boolean;
  alerts: boolean;
  onNew: () => void;
  onSetup: () => void;
  onAlerts: () => void;
  onStop: () => void;
}) {
  const left =
    github?.connected && github.expiresAt
      ? daysLeft(github.expiresAt, now)
      : null;
  return (
    <div className="card flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3">
      <dl className="flex min-w-0 flex-wrap gap-x-5 gap-y-1 text-[0.8125rem]">
        <div className="min-w-0">
          <dt className="text-ink-faint text-[0.6875rem] font-semibold">
            Claude Code
          </dt>
          <dd className="text-ink truncate font-semibold">
            {reconnecting
              ? "Reconnecting…"
              : !claude?.installed
                ? claude?.updating
                  ? "Installing…"
                  : "Not installed"
                : `${claude.version ?? ""}${claude.loggedIn ? "" : ", not signed in"}`}
          </dd>
        </div>
        {github && (
          <div className="min-w-0">
            <dt className="text-ink-faint text-[0.6875rem] font-semibold">
              GitHub
            </dt>
            <dd
              className={cn(
                "truncate font-semibold",
                !github.connected || (left !== null && left <= 0)
                  ? "text-danger"
                  : left !== null && left <= 7
                    ? "text-amber-deep"
                    : "text-ink",
              )}
            >
              {!github.connected
                ? "Not connected"
                : left === null
                  ? github.login
                  : left <= 0
                    ? `${github.login}, token expired`
                    : `${github.login}, ${left} day${left === 1 ? "" : "s"} left`}
            </dd>
          </div>
        )}
      </dl>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onNew}
          className={cn(primaryButton, "inline-flex items-center gap-1.5")}
        >
          <Plus className="size-3.5" aria-hidden />
          New session
        </button>
        <button
          type="button"
          onClick={onSetup}
          className={cn(quietButton, "inline-flex items-center gap-1.5")}
        >
          <Settings2 className="size-3.5" aria-hidden />
          Setup
        </button>
        <button
          type="button"
          onClick={onAlerts}
          aria-pressed={alerts}
          className={cn(quietButton, "inline-flex items-center px-2")}
          title={
            alerts
              ? "Alerts on: a desktop alert when a session needs you or finishes"
              : "Alerts off"
          }
          aria-label={alerts ? "Turn alerts off" : "Turn alerts on"}
        >
          {alerts ? (
            <Bell className="size-4" aria-hidden />
          ) : (
            <BellOff className="size-4" aria-hidden />
          )}
        </button>
        <button
          type="button"
          onClick={onStop}
          className="border-danger/40 text-danger hover:bg-danger/10 inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors"
        >
          <Power className="size-3.5" aria-hidden />
          Stop
        </button>
      </div>
    </div>
  );
}

/** A line under the bar when the token is missing, failing or nearly due. */
function TokenWarning({
  github,
  now,
  onFix,
}: {
  github: GitHubInfo;
  now: number;
  onFix: () => void;
}) {
  let text: string | null = null;
  let urgent = false;
  if (!github.connected) {
    text = github.error
      ? "The GitHub token is not working."
      : "No GitHub token yet: private repos cannot be opened and nothing can be pushed.";
    urgent = !!github.error;
  } else if (github.expiresAt) {
    const left = daysLeft(github.expiresAt, now);
    if (left <= 0) {
      text = `The GitHub token expired on ${day(github.expiresAt)}.`;
      urgent = true;
    } else if (left <= 7) {
      text = `The GitHub token expires in ${left} day${left === 1 ? "" : "s"}, on ${day(github.expiresAt)}.`;
    }
  }
  if (!text) return null;
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-lg border px-4 py-2.5 text-[0.8125rem]",
        urgent
          ? "border-danger/30 text-danger bg-surface"
          : "border-amber/30 bg-amber-wash text-amber-deep",
      )}
    >
      <p className="min-w-0 flex-1">{text}</p>
      <button type="button" onClick={onFix} className="font-semibold underline">
        {github.connected ? "Replace token" : "Add a token"}
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Terminal windows                                                           */
/* -------------------------------------------------------------------------- */

function StatusPill({ status }: { status: SessionStatus }) {
  const s = STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold whitespace-nowrap",
        s.tone,
      )}
    >
      {status === "working" && (
        <span
          className="bg-brand size-1.5 rounded-full motion-safe:animate-pulse"
          aria-hidden
        />
      )}
      {s.label}
    </span>
  );
}

/** One session as a small live terminal window. Click to open it. */
function Tile({
  session: s,
  now,
  onOpen,
}: {
  session: Session;
  now: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "border-night-line bg-night-soft hover:border-brand/70 block w-full overflow-hidden rounded-xl border text-left transition-[border-color,transform] active:scale-[0.99]",
        s.status === "needs_you" && "border-amber/70",
        s.status === "ended" && "opacity-70",
      )}
    >
      <div className="border-night-line flex items-center gap-2 border-b px-3 py-2">
        <SquareTerminal
          className="size-3.5 shrink-0 text-white/45"
          strokeWidth={1.9}
          aria-hidden
        />
        <p className="min-w-0 flex-1 truncate text-[0.8125rem]">
          <span className="font-semibold text-white">{s.project}</span>
          <span className="text-white/45"> {sessionName(s)}</span>
        </p>
        <StatusPill status={s.status} />
      </div>
      <TerminalView
        key={`${s.id}-${s.startedAt}-${s.live}`}
        id={s.id}
        preview
        cols={s.cols ?? 120}
        rows={s.rows ?? 32}
      />
      <div className="border-night-line flex items-center gap-2 border-t px-3 py-1.5 text-[0.6875rem]">
        <p
          className={cn(
            "min-w-0 flex-1 truncate",
            s.status === "needs_you" ? "text-amber" : "text-white/55",
          )}
        >
          {s.activity}
        </p>
        <span className="shrink-0 text-white/35">
          {since(s.startedAt, now)}
        </span>
      </div>
    </button>
  );
}

/** The opened session: large, typed into, maximizable. */
function MainTerminal({
  session,
  maximized,
  onMaximize,
  onMinimize,
  prefs,
  setPrefs,
  send,
}: {
  session: Session;
  maximized: boolean;
  onMaximize: (on: boolean) => void;
  onMinimize: () => void;
  prefs: Prefs;
  setPrefs: (update: (p: Prefs) => Prefs) => void;
  send: (m: object) => void;
}) {
  // Maximized, the page behind stays put.
  useEffect(() => {
    if (!maximized) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
    };
  }, [maximized]);

  const chrome =
    "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.8125rem] font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white";

  return (
    <section
      aria-label="Terminal"
      className={cn(
        "bg-night-soft border-night-line flex flex-col overflow-hidden border",
        maximized ? "fixed inset-0 z-50 rounded-none" : "rounded-xl",
      )}
    >
      <div className="border-night-line flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b px-3 py-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <SquareTerminal
            className="size-4 shrink-0 text-white/45"
            strokeWidth={1.9}
            aria-hidden
          />
          <p className="min-w-0 truncate text-[0.875rem]">
            <span className="font-semibold text-white">{session.project}</span>
            <span className="text-white/50"> {sessionName(session)}</span>
          </p>
          {session.worktree && (
            <span className="hidden items-center gap-1 text-[0.75rem] text-white/45 sm:inline-flex">
              <GitBranch className="size-3" aria-hidden />
              {session.worktree}
            </span>
          )}
          <StatusPill status={session.status} />
          <p className="hidden min-w-0 truncate text-[0.75rem] text-white/45 lg:block">
            {session.activity}
          </p>
        </div>
        <div className="flex items-center gap-0.5">
          {session.live ? (
            <button
              type="button"
              onClick={() => {
                if (confirm("Stop this session?"))
                  send({ t: "stop", id: session.id });
              }}
              className={chrome}
            >
              <Square className="size-3.5" aria-hidden />
              <span className="hidden sm:inline">Stop</span>
            </button>
          ) : (
            <>
              {session.kind !== "login" && (
                <button
                  type="button"
                  onClick={() => send({ t: "resume", id: session.id })}
                  className={chrome}
                >
                  <RotateCcw className="size-3.5" aria-hidden />
                  Resume
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  send({ t: "remove", id: session.id });
                  onMinimize();
                }}
                className={chrome}
              >
                <X className="size-3.5" aria-hidden />
                Remove
              </button>
            </>
          )}
          <span className="mx-1 h-5 w-px bg-white/15" aria-hidden />
          <button
            type="button"
            onClick={() => onMaximize(!maximized)}
            className={chrome}
            title={maximized ? "Restore" : "Maximize"}
            aria-label={maximized ? "Restore" : "Maximize"}
          >
            {maximized ? (
              <Minimize2 className="size-4" aria-hidden />
            ) : (
              <Maximize2 className="size-4" aria-hidden />
            )}
          </button>
          <button
            type="button"
            onClick={onMinimize}
            className={chrome}
            title="Minimize to the grid"
            aria-label="Minimize to the grid"
          >
            <LayoutGrid className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      {session.kind === "login" && session.link && session.live && (
        <div className="border-night-line bg-brand/10 flex flex-wrap items-center gap-3 border-b px-3 py-2.5">
          <p className="min-w-0 flex-1 text-[0.8125rem] text-white/85">
            Open the sign-in page, choose Continue with Google, then paste the
            code it shows into the box below and press Send.
          </p>
          <a
            href={session.link}
            target="_blank"
            rel="noreferrer"
            className="bg-brand text-night inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.8125rem] font-semibold"
          >
            <ExternalLink className="size-3.5" aria-hidden />
            Open the sign-in page
          </a>
        </div>
      )}

      <div
        className={
          maximized ? "min-h-0 flex-1" : "h-[min(66dvh,46rem)] min-h-[20rem]"
        }
      >
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
/* Side panels                                                                */
/* -------------------------------------------------------------------------- */

function Drawer({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="bg-ink/40 absolute inset-0 cursor-default"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="bg-canvas relative flex h-full w-full max-w-[28rem] flex-col shadow-2xl"
      >
        <div className="border-line flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-ink text-[1.0625rem] font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-faint hover:text-ink rounded-md p-1"
            aria-label="Close"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {children}
        </div>
      </aside>
    </div>
  );
}

/** Pick a repo, say what it is for, and start Claude Code or a terminal in it. */
function NewSession({
  projects,
  sessions,
  send,
}: {
  projects: Project[];
  sessions: Session[];
  send: (m: object) => void;
}) {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [kind, setKind] = useState<"claude" | "shell">("claude");
  const [title, setTitle] = useState("");
  const [ownCopy, setOwnCopy] = useState<boolean | null>(null);
  const [mode, setMode] = useState<Mode>("auto");

  const project =
    projects.find((p) => p.name === picked) ??
    projects.find((p) => p.name === "Nectarray") ??
    projects[0] ??
    null;
  const busy =
    !!project && sessions.some((s) => s.project === project.name && s.live);
  // A second session in the same repo gets its own copy unless told otherwise.
  const copy = ownCopy ?? busy;
  const shown = projects.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!project) return;
        send({
          t: "start",
          project: project.name,
          kind,
          title,
          worktree: kind === "claude" && copy,
          mode,
        });
      }}
    >
      <fieldset>
        <legend className="text-ink mb-2 text-[0.875rem] font-semibold">
          Repo
        </legend>
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
        <ul className="border-line max-h-64 space-y-0.5 overflow-y-auto rounded-lg border p-1">
          {shown.map((p) => {
            const active = p.name === project?.name;
            const live = sessions.filter(
              (s) => s.project === p.name && s.live,
            ).length;
            return (
              <li key={p.name}>
                <button
                  type="button"
                  onClick={() => setPicked(p.name)}
                  aria-pressed={active}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left transition-colors",
                    active ? "bg-brand-solid text-cta-fg" : "hover:bg-mist",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.8125rem] font-semibold">
                      {p.name}
                    </span>
                    <span
                      className={cn(
                        "block truncate text-[0.6875rem]",
                        active ? "text-cta-fg/75" : "text-ink-faint",
                      )}
                    >
                      {p.branch ?? "no branch"}
                      {!p.cloned && ", fetched from GitHub on first use"}
                    </span>
                  </span>
                  {live > 0 && (
                    <span className="text-[0.6875rem] font-bold">
                      {live} open
                    </span>
                  )}
                </button>
              </li>
            );
          })}
          {shown.length === 0 && (
            <li className="text-ink-faint px-2.5 py-2 text-[0.8125rem]">
              {projects.length === 0
                ? "No repos yet. Add a GitHub token in Setup."
                : "No repo matches."}
            </li>
          )}
        </ul>
      </fieldset>

      <fieldset>
        <legend className="text-ink mb-2 text-[0.875rem] font-semibold">
          Open
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["claude", "Claude Code", "Work with Claude"],
              ["shell", "Terminal", "Run git and commands yourself"],
            ] as const
          ).map(([id, label, hint]) => (
            <button
              key={id}
              type="button"
              onClick={() => setKind(id)}
              aria-pressed={kind === id}
              className={cn(
                "rounded-lg border px-3 py-2 text-left transition-colors",
                kind === id
                  ? "border-brand bg-brand-wash"
                  : "border-line bg-surface hover:border-brand",
              )}
            >
              <span className="text-ink block text-[0.8125rem] font-semibold">
                {label}
              </span>
              <span className="text-ink-faint block text-[0.6875rem]">
                {hint}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label
          htmlFor="ws-title"
          className="text-ink mb-1 block text-[0.8125rem] font-semibold"
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

      {kind === "claude" && (
        <>
          <label className="text-ink-soft flex items-start gap-2 text-[0.8125rem]">
            <input
              type="checkbox"
              checked={copy}
              onChange={(e) => setOwnCopy(e.target.checked)}
              className="accent-brand mt-0.5"
            />
            <span>
              Own copy of the repo
              <span className="text-ink-faint block text-[0.75rem]">
                A git worktree on its own branch, so parallel sessions never
                edit the same files.
              </span>
            </span>
          </label>
          <div>
            <label
              htmlFor="ws-mode"
              className="text-ink mb-1 block text-[0.8125rem] font-semibold"
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
        </>
      )}

      <button
        type="submit"
        disabled={!project}
        className={cn(
          primaryButton,
          "inline-flex w-full items-center justify-center gap-1.5 py-2.5 disabled:opacity-50",
        )}
      >
        <Play className="size-3.5" aria-hidden />
        {project
          ? `Start ${kind === "claude" ? "Claude Code" : "a terminal"} in ${project.name}`
          : "Pick a repo"}
      </button>
    </form>
  );
}

/** Claude Code itself: version, updates, sign-in, plugins and skills. */
function ClaudeSetup({
  claude,
  cloud,
  send,
}: {
  claude: ClaudeInfo;
  cloud: boolean;
  send: (m: object) => void;
}) {
  return (
    <section className="card space-y-3 p-4">
      <h3 className="text-ink text-[0.9375rem] font-semibold">Claude Code</h3>
      <div className="space-y-1 text-[0.8125rem]">
        <p className="text-ink">
          {claude.installed
            ? `Version ${claude.version ?? "unknown"}`
            : claude.updating
              ? "Installing, first start only"
              : "Not installed"}
          <span className="text-ink-faint">
            {claude.updating
              ? ", updating…"
              : claude.updateNote
                ? `. ${claude.updateNote}`
                : ""}
          </span>
        </p>
        <p className="text-ink-soft">
          {claude.loggedIn
            ? `Signed in as ${claude.email ?? "your account"}, for every session`
            : "Not signed in yet"}
        </p>
        {cloud && claude.setup && claude.setup.state !== "idle" && (
          <p
            className={cn(
              claude.setup.state === "error"
                ? "text-danger"
                : claude.setup.state === "running"
                  ? "text-ink-soft"
                  : "text-leaf-deep",
            )}
          >
            {claude.setup.note}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
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
            Update now
          </button>
        )}
        {cloud && claude.installed && (
          <button
            type="button"
            disabled={claude.setup?.state === "running"}
            onClick={() => send({ t: "setup" })}
            className={cn(quietButton, "disabled:opacity-50")}
            title="Install the plugins and skills from workspace/claude-setup.json again"
          >
            Set up plugins again
          </button>
        )}
      </div>
    </section>
  );
}

/**
 * The token git, gh and every session use for your repos: pasted here, kept
 * on the Workspace's own disk, and checked with GitHub, which also says when
 * it expires. The page only ever sees the account, the last four characters
 * and the date.
 */
function GitHubPanel({
  github,
  now,
  send,
}: {
  github: GitHubInfo;
  now: number;
  send: (m: object) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const showForm = editing || !github.connected;
  const left =
    github.connected && github.expiresAt
      ? daysLeft(github.expiresAt, now)
      : null;

  return (
    <section className="card space-y-3 p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-ink text-[0.9375rem] font-semibold">GitHub</h3>
        {github.connected && (
          <button
            type="button"
            onClick={() => send({ t: "github-check" })}
            className="text-ink-faint hover:text-brand-deep rounded-md p-1 transition-colors"
            title="Check the token with GitHub again"
            aria-label="Check the token again"
          >
            <RefreshCw className="size-3.5" aria-hidden />
          </button>
        )}
      </div>

      {github.connected ? (
        <div className="space-y-1 text-[0.8125rem]">
          <p className="text-ink">
            Connected as <span className="font-semibold">{github.login}</span>
          </p>
          <p className="text-ink-faint text-[0.75rem]">
            Token ending {github.last4}
            {github.source === "env"
              ? ", from the Railway variable"
              : github.savedAt
                ? `, added ${day(github.savedAt)}`
                : ""}
          </p>
          <p
            className={cn(
              "font-medium",
              left === null || left > 7
                ? "text-ink-soft"
                : left <= 0
                  ? "text-danger"
                  : "text-amber-deep",
            )}
          >
            {left === null || !github.expiresAt
              ? "Never expires"
              : left <= 0
                ? `Expired on ${day(github.expiresAt)}`
                : `Expires ${day(github.expiresAt)}, in ${left} day${left === 1 ? "" : "s"}`}
          </p>
        </div>
      ) : (
        <div className="space-y-2 text-[0.8125rem]">
          {github.error && (
            <p className="text-danger font-medium">
              {github.error}
              {github.last4 ? ` (token ending ${github.last4})` : ""}
            </p>
          )}
          <p className="text-ink-soft">
            Needed to open your private repos and to push. Create a fine-grained
            token, then paste it below.
          </p>
          <ol className="text-ink-soft list-decimal space-y-1 pl-4 text-[0.75rem]">
            <li>
              <a
                href="https://github.com/settings/personal-access-tokens/new"
                target="_blank"
                rel="noreferrer"
                className="text-brand-deep font-semibold hover:underline"
              >
                Open GitHub&apos;s new token page
              </a>
            </li>
            <li>
              Repository access: All repositories, or the ones to work on.
            </li>
            <li>
              Permissions: Contents, Read and write. Add Pull requests, Read and
              write, for pull requests.
            </li>
            <li>Generate, copy, and paste it here.</li>
          </ol>
        </div>
      )}

      {showForm ? (
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!value.trim()) return;
            send({ t: "github-token", token: value.trim() });
            setValue("");
            setEditing(false);
          }}
        >
          <label
            htmlFor="ws-token"
            className="text-ink-faint block text-[0.6875rem] font-semibold"
          >
            {github.connected ? "New token" : "Token"}
          </label>
          <div className="flex gap-2">
            <input
              id="ws-token"
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={field}
              placeholder="github_pat_…"
              autoComplete="off"
              spellCheck={false}
            />
            <button type="submit" className={primaryButton}>
              Save
            </button>
          </div>
          {editing && (
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-ink-faint hover:text-ink text-[0.75rem] font-semibold"
            >
              Cancel
            </button>
          )}
        </form>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className={cn(quietButton, "inline-flex items-center gap-1.5")}
          >
            <KeyRound className="size-3.5" aria-hidden />
            Replace token
          </button>
          {github.source === "page" && (
            <button
              type="button"
              onClick={() => {
                if (
                  confirm("Remove the saved GitHub token from the workspace?")
                )
                  send({ t: "github-forget" });
              }}
              className="text-ink-faint hover:text-danger px-2 text-[0.75rem] font-semibold transition-colors"
            >
              Remove
            </button>
          )}
        </div>
      )}
    </section>
  );
}

function ConnectRepo({ send }: { send: (m: object) => void }) {
  const [url, setUrl] = useState("");
  return (
    <form
      className="card space-y-2 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!url.trim()) return;
        send({ t: "clone", url: url.trim() });
        setUrl("");
      }}
    >
      <label
        htmlFor="ws-clone"
        className="text-ink text-[0.9375rem] font-semibold"
      >
        Add another repo
      </label>
      <p className="text-ink-faint text-[0.75rem]">
        Your own repos are listed already. This is for any other GitHub link,
        such as a public repo.
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
/* Typing, pasting and voice                                                  */
/* -------------------------------------------------------------------------- */

/**
 * A message box under the open terminal: type or paste (the sign-in code, a
 * long prompt, anything awkward on a phone), or hold the mic and talk. Spoken
 * words land in the box to check first, unless "Send speech right away" is
 * on. Send types the box into the session and presses Enter; an empty Send
 * just presses Enter.
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
  /** One key straight into the terminal, as if pressed there. */
  const press = (sequence: string) =>
    send({ t: "type", id: sessionId, text: sequence, enter: false });

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

  const darkField =
    "border-night-line bg-night rounded-lg border px-3 py-2 text-[0.8125rem] text-white placeholder:text-white/40 focus:border-brand focus:outline-none";

  return (
    <div className="border-night-line space-y-2 border-t px-3 py-2.5">
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
                : "bg-white/10 text-white hover:bg-white/15",
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
          onKeyDown={(e) => {
            // With nothing typed, arrows, Esc and Tab drive the terminal:
            // picking an option in Claude Code works from here too.
            if (text || voice.listening) return;
            const key = e.key === "Tab" && e.shiftKey ? "ShiftTab" : e.key;
            const sequence = PASS_THROUGH[key];
            if (!sequence) return;
            e.preventDefault();
            press(sequence);
          }}
          className={cn(darkField, "min-w-0 flex-1")}
          placeholder={
            voice.listening
              ? "Speak now"
              : "Type, paste or talk. Enter sends it to the terminal"
          }
          aria-label="Message for the terminal"
        />
        <button
          type="submit"
          className="bg-brand text-night hover:bg-brand/90 inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[0.8125rem] font-semibold transition-colors"
        >
          <Send className="size-3.5" aria-hidden />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
      <div
        className="flex flex-wrap items-center gap-1"
        role="group"
        aria-label="Keys"
      >
        {KEYS.map(([label, sequence, name]) => (
          <button
            key={label}
            type="button"
            onClick={() => press(sequence)}
            className="min-w-9 rounded-md border border-white/15 bg-white/5 px-2 py-1 font-mono text-[0.75rem] text-white/80 transition-[background-color,transform] hover:bg-white/15 hover:text-white active:scale-[0.96]"
            aria-label={name}
            title={name}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.75rem]">
        {voice.error ? (
          <p className="text-danger">{voice.error}</p>
        ) : !voice.supported ? (
          <p className="text-white/45">Voice needs Chrome or Edge.</p>
        ) : null}
        {voice.supported && (
          <>
            <select
              value={prefs.lang}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, lang: e.target.value }))
              }
              className={cn(darkField, "w-auto py-0.5 text-[0.75rem]")}
              aria-label="Voice language"
            >
              {LANGS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-1.5 text-white/60">
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
