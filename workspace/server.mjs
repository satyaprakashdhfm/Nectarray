/**
 * The Workspace runner: real Claude Code terminals on this PC, for the
 * Workspace tab in the admin panel.
 *
 * The admin page (on nectarray.com or on localhost:3000) connects to this
 * over WebSockets on 127.0.0.1. It never listens on the network: it is a
 * shell on this machine, so only this machine's browser may reach it, and
 * only from the origins in ORIGINS.
 *
 * - /control   one socket per open admin tab: projects, sessions, Claude
 *              Code's version and sign-in, and the commands that change them.
 * - /term/<id> one socket per visible terminal: output out, keystrokes in.
 * - POST /hook what Claude Code's hooks report (see hook.mjs), which is how
 *              a session's card knows it is working, needs you, or is done.
 */
import { execFile } from "node:child_process";
import { randomBytes, randomUUID } from "node:crypto";
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pty from "node-pty";
import { WebSocketServer } from "ws";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.WORKSPACE_PORT ?? 4100);
/** The folder whose git repos are the projects: the one this repo sits in. */
const ROOT = path.resolve(
  process.env.WORKSPACE_ROOT ?? path.join(HERE, "..", ".."),
);
const ORIGINS = new Set([
  "https://nectarray.com",
  "https://www.nectarray.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  ...(process.env.WORKSPACE_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
]);
const HOSTS = new Set([`localhost:${PORT}`, `127.0.0.1:${PORT}`]);
/** Lets only hook.mjs, started by our own sessions, post hook events. */
const SECRET = randomBytes(24).toString("hex");
const WIN = process.platform === "win32";
const CLAUDE = process.env.CLAUDE_BIN ?? (WIN ? "claude.cmd" : "claude");
const BUFFER_LIMIT = 400_000;
const UPDATE_EVERY = 6 * 60 * 60 * 1000;

/* -------------------------------------------------------------------------- */
/* Claude Code: version, sign-in, updates                                     */
/* -------------------------------------------------------------------------- */

/** Runs `claude <args>`; .cmd shims need cmd.exe on Windows. */
function claude(args, timeout = 60_000) {
  const [file, argv] = WIN
    ? [process.env.ComSpec ?? "cmd.exe", ["/d", "/c", "claude", ...args]]
    : [CLAUDE, args];
  return new Promise((resolve) =>
    execFile(
      file,
      argv,
      { timeout, windowsHide: true, env: cleanEnv() },
      (err, stdout, stderr) =>
        resolve({ ok: !err, stdout: String(stdout), stderr: String(stderr) }),
    ),
  );
}

const info = {
  installed: false,
  version: null,
  loggedIn: false,
  email: null,
  updating: false,
  lastUpdate: null,
  updateNote: null,
};

async function readClaude() {
  const version = await claude(["--version"], 20_000);
  info.installed = version.ok;
  info.version = version.ok
    ? (version.stdout.match(/\d+\.\d+\.\d+/)?.[0] ?? null)
    : null;
  if (info.installed) {
    const auth = await claude(["auth", "status", "--json"], 20_000);
    try {
      const status = JSON.parse(auth.stdout);
      info.loggedIn = !!status.loggedIn;
      info.email = status.email ?? null;
    } catch {
      info.loggedIn = false;
      info.email = null;
    }
  }
  broadcast({ t: "claude", claude: info });
}

/**
 * `claude update`, at start and every six hours. Skipped while sessions are
 * running, so a session is never updated out from under itself; the button
 * on the page can still force it.
 */
async function updateClaude(force = false) {
  if (info.updating || !info.installed) return;
  if (!force && [...sessions.values()].some((s) => s.pty)) return;
  info.updating = true;
  info.updateNote = null;
  broadcast({ t: "claude", claude: info });
  const before = info.version;
  const result = await claude(["update"], 10 * 60_000);
  info.updating = false;
  info.lastUpdate = new Date().toISOString();
  await readClaude();
  info.updateNote = !result.ok
    ? "The update did not finish. Try again, or run `claude update` in a terminal."
    : info.version !== before
      ? `Updated to ${info.version}.`
      : "Already up to date.";
  broadcast({ t: "claude", claude: info });
}

/* -------------------------------------------------------------------------- */
/* Projects: the git repos in ROOT                                            */
/* -------------------------------------------------------------------------- */

let projects = [];

function readProjects() {
  const found = [];
  for (const entry of readdirSync(ROOT, { withFileTypes: true })) {
    if (
      !entry.isDirectory() ||
      entry.name.startsWith(".") ||
      entry.name === "node_modules"
    )
      continue;
    const dir = path.join(ROOT, entry.name);
    const git = path.join(dir, ".git");
    if (!existsSync(git) || !statSync(git).isDirectory()) continue;
    let remote = null;
    let branch = null;
    try {
      const config = readFileSync(path.join(git, "config"), "utf8");
      remote =
        config.match(/\[remote "origin"\][^[]*?url\s*=\s*(\S+)/)?.[1] ?? null;
      const head = readFileSync(path.join(git, "HEAD"), "utf8").trim();
      branch = head.startsWith("ref: refs/heads/")
        ? head.slice(16)
        : head.slice(0, 7);
    } catch {}
    const gh = remote?.match(/github\.com[:/]([^/\s]+)\/([^/\s]+?)(?:\.git)?$/);
    found.push({
      name: entry.name,
      path: dir,
      branch,
      github: gh
        ? {
            owner: gh[1],
            repo: gh[2],
            url: `https://github.com/${gh[1]}/${gh[2]}`,
          }
        : null,
    });
  }
  projects = found.sort((a, b) => a.name.localeCompare(b.name));
  broadcast({ t: "projects", projects });
}

const REPO_URL =
  /^(?:https:\/\/github\.com\/|git@github\.com:)([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/;

/** Clones a GitHub repo into ROOT so it shows up as a project. */
function cloneRepo(url, reply) {
  const match = String(url ?? "")
    .trim()
    .match(REPO_URL);
  if (!match)
    return reply({
      t: "error",
      message: "That is not a GitHub repository link.",
    });
  const name = match[2];
  if (existsSync(path.join(ROOT, name)))
    return reply({
      t: "error",
      message: `A folder called ${name} is already there.`,
    });
  const source = url.trim().startsWith("git@")
    ? url.trim()
    : `https://github.com/${match[1]}/${name}.git`;
  broadcast({ t: "notice", message: `Cloning ${match[1]}/${name}…` });
  execFile(
    "git",
    ["clone", source, name],
    { cwd: ROOT, timeout: 10 * 60_000, windowsHide: true },
    (err, _out, stderr) => {
      readProjects();
      if (err)
        broadcast({
          t: "error",
          message: `Could not clone ${name}: ${String(stderr).trim().split("\n").pop()}`,
        });
      else broadcast({ t: "notice", message: `${name} is connected.` });
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Sessions                                                                    */
/* -------------------------------------------------------------------------- */

/** @type {Map<string, any>} */
const sessions = new Map();
const HOOKS_FILE = path.join(HERE, ".hooks.json");

/** The hooks every session runs with, layered over your own settings. */
function writeHooks() {
  const command = `node "${path.join(HERE, "hook.mjs").replaceAll("\\", "/")}"`;
  const hook = [{ type: "command", command, timeout: 5 }];
  const plain = (event) => [event, [{ hooks: hook }]];
  const tools = (event) => [event, [{ matcher: "*", hooks: hook }]];
  const settings = {
    hooks: Object.fromEntries([
      plain("SessionStart"),
      plain("UserPromptSubmit"),
      tools("PreToolUse"),
      tools("PostToolUse"),
      plain("Notification"),
      plain("Stop"),
    ]),
  };
  writeFileSync(HOOKS_FILE, JSON.stringify(settings, null, 2));
}

/**
 * This process's environment, minus the markers a parent Claude Code session
 * leaves behind when the runner is started from inside one. Inherited, they
 * make each session think it is a nested child (transcripts off, wrong
 * session id). Only stripped in that case, so variables you set yourself
 * stay.
 */
function cleanEnv() {
  const env = { ...process.env };
  if (!env.CLAUDECODE) return env;
  for (const key of Object.keys(env)) {
    if (
      key.startsWith("CLAUDE_CODE_") ||
      [
        "CLAUDECODE",
        "CLAUDE_PID",
        "CLAUDE_EFFORT",
        "CLAUDE_AGENT_SDK_VERSION",
        "MCP_CONNECTION_NONBLOCKING",
      ].includes(key)
    )
      delete env[key];
  }
  return env;
}

const slug = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);

function publicSession(s) {
  const { pty: _p, buffer: _b, size: _s, viewers: _v, ...rest } = s;
  return { ...rest, live: !!s.pty };
}

function changed(s) {
  s.updatedAt = new Date().toISOString();
  broadcast({ t: "session", session: publicSession(s) });
}

/**
 * Starts Claude Code in a terminal. `resume` brings back an ended session's
 * conversation instead of starting a new one.
 */
function startSession({
  project,
  title,
  worktree,
  mode,
  kind = "claude",
  resume,
}) {
  const id = resume?.id ?? randomUUID().slice(0, 8);
  const proj =
    kind === "login"
      ? { name: "Claude", path: ROOT }
      : projects.find((p) => p.name === project);
  if (!proj)
    return { error: "That project is not in the list. Refresh and try again." };

  const args = ["--settings", HOOKS_FILE.replaceAll("\\", "/")];
  let cwd = proj.path;
  let tree = null;
  if (kind === "login") {
    args.length = 0;
    args.push("auth", "login");
  } else if (resume) {
    cwd = resume.cwd && existsSync(resume.cwd) ? resume.cwd : proj.path;
    if (resume.claudeSession) args.push("--resume", resume.claudeSession);
    else args.push("--continue");
    tree = resume.worktree;
  } else if (worktree) {
    tree = `${slug(title || "session") || "session"}-${id.slice(0, 4)}`;
    args.push("--worktree", tree);
  }
  if (kind !== "login" && mode === "acceptEdits")
    args.push("--permission-mode", "acceptEdits");

  const s = resume ?? {
    id,
    kind,
    project: proj.name,
    title: kind === "login" ? "Sign in to Claude" : title?.trim() || "",
    worktree: tree,
    mode: mode === "acceptEdits" ? "acceptEdits" : "default",
    startedAt: new Date().toISOString(),
    files: [],
    prompts: 0,
  };
  Object.assign(s, {
    status: "starting",
    activity:
      kind === "login"
        ? "Opening the sign-in page in your browser"
        : "Starting Claude Code",
    cwd,
    exitCode: null,
    buffer: [],
    size: 0,
    viewers: new Set(),
  });

  try {
    s.pty = pty.spawn(CLAUDE, args, {
      name: "xterm-256color",
      cols: 120,
      rows: 32,
      cwd,
      env: {
        ...cleanEnv(),
        TERM: "xterm-256color",
        COLORTERM: "truecolor",
        FORCE_COLOR: "1",
        NECTARRAY_WS_SESSION: id,
        NECTARRAY_WS_PORT: String(PORT),
        NECTARRAY_WS_SECRET: SECRET,
      },
    });
  } catch (err) {
    return { error: `Could not start Claude Code: ${err.message}` };
  }

  s.pty.onData((data) => {
    s.buffer.push(data);
    s.size += data.length;
    while (s.size > BUFFER_LIMIT && s.buffer.length > 1)
      s.size -= s.buffer.shift().length;
    const frame = JSON.stringify({ t: "out", data });
    for (const ws of s.viewers) if (ws.readyState === 1) ws.send(frame);
  });
  s.pty.onExit(({ exitCode }) => {
    s.pty = null;
    s.exitCode = exitCode;
    s.status = "ended";
    s.activity = s.stopping
      ? "Stopped by you"
      : exitCode === 0
        ? "Closed"
        : `Closed with exit code ${exitCode}`;
    s.stopping = false;
    for (const ws of s.viewers)
      if (ws.readyState === 1)
        ws.send(JSON.stringify({ t: "exit", code: exitCode }));
    changed(s);
    if (s.kind === "login") readClaude();
  });

  sessions.set(id, s);
  changed(s);
  /*
   * Hooks only start once Claude is past its own start-up questions (trust
   * this folder?, keep this worktree?). Still "starting" after a few seconds
   * means one of those is on screen.
   */
  const spawned = s.pty;
  setTimeout(() => {
    if (s.pty === spawned && s.status === "starting" && s.kind !== "login") {
      s.status = "needs_you";
      s.activity = "Answer the question in the terminal to start";
      changed(s);
    }
  }, 6000);
  return { id };
}

const base = (p) => (p ? path.basename(String(p)) : "");

/** What a tool call looks like on a card, in a few words. */
function describe(tool, input = {}) {
  switch (tool) {
    case "Bash":
    case "PowerShell":
      return `Running ${input.description || input.command || "a command"}`;
    case "Edit":
    case "MultiEdit":
    case "Write":
    case "NotebookEdit":
      return `Editing ${base(input.file)}`;
    case "Read":
      return `Reading ${base(input.file)}`;
    case "Grep":
    case "Glob":
      return `Searching for ${input.pattern ?? "files"}`;
    case "WebFetch":
      return `Reading ${input.url ?? "a web page"}`;
    case "WebSearch":
      return `Searching the web for ${input.query ?? "something"}`;
    case "Task":
    case "Agent":
      return input.description
        ? `Helper: ${input.description}`
        : "Running a helper";
    case "TodoWrite":
    case "TaskCreate":
    case "TaskUpdate":
      return "Updating its plan";
    default:
      return tool ? `Using ${tool}` : "Working";
  }
}

/** One hook event from hook.mjs, folded into its session's card. */
function onHook(e) {
  const s = sessions.get(e.session);
  if (!s) return;
  if (e.cwd) s.cwd = e.cwd;
  if (e.claudeSession) s.claudeSession = e.claudeSession;
  switch (e.event) {
    case "SessionStart":
      s.status = "idle";
      s.activity = "Ready for your first prompt";
      break;
    case "UserPromptSubmit":
      s.status = "working";
      s.activity = "Thinking";
      s.prompts += 1;
      if (e.prompt) {
        s.lastPrompt = e.prompt;
        if (!s.title) s.title = e.prompt.split("\n")[0].slice(0, 70);
      }
      break;
    case "PreToolUse":
      s.status = "working";
      s.activity = describe(e.tool, e.input);
      if (
        ["Edit", "MultiEdit", "Write", "NotebookEdit"].includes(e.tool) &&
        e.input?.file
      ) {
        const file = path.relative(s.cwd ?? "", e.input.file) || e.input.file;
        if (!s.files.includes(file)) s.files = [...s.files, file].slice(-50);
      }
      break;
    case "PostToolUse":
      if (s.status === "needs_you") s.status = "working";
      break;
    case "Notification":
      if (e.kind === "idle_prompt") return;
      s.status = "needs_you";
      s.activity = e.message || "Waiting for you";
      break;
    case "Stop":
      s.status = "done";
      s.activity = "Finished. Waiting for your next prompt";
      break;
    default:
      return;
  }
  changed(s);
}

/* -------------------------------------------------------------------------- */
/* Server                                                                      */
/* -------------------------------------------------------------------------- */

/** @type {Set<import("ws").WebSocket>} */
const controls = new Set();

function broadcast(message) {
  const frame = JSON.stringify(message);
  for (const ws of controls) if (ws.readyState === 1) ws.send(frame);
}

const server = http.createServer((req, res) => {
  if (!HOSTS.has(req.headers.host ?? "")) {
    res.writeHead(403).end();
    return;
  }
  if (req.method === "POST" && req.url === "/hook") {
    if (req.headers["x-workspace-secret"] !== SECRET) {
      res.writeHead(403).end();
      return;
    }
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 64_000) req.destroy();
    });
    req.on("end", () => {
      try {
        onHook(JSON.parse(body));
      } catch {}
      res.writeHead(204).end();
    });
    return;
  }
  res
    .writeHead(200, { "content-type": "text/plain" })
    .end(
      "NectArray Workspace runner. Open the Workspace tab in the admin panel.\n",
    );
});

const wss = new WebSocketServer({ noServer: true, maxPayload: 1_000_000 });

server.on("upgrade", (req, socket, head) => {
  const origin = req.headers.origin ?? "";
  if (!HOSTS.has(req.headers.host ?? "") || !ORIGINS.has(origin)) {
    socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
    socket.destroy();
    return;
  }
  wss.handleUpgrade(req, socket, head, (ws) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (url.pathname === "/control") openControl(ws);
    else if (url.pathname.startsWith("/term/"))
      openTerminal(ws, url.pathname.slice(6));
    else ws.close(1008, "Unknown path");
  });
});

function openControl(ws) {
  controls.add(ws);
  const reply = (message) =>
    ws.readyState === 1 && ws.send(JSON.stringify(message));
  reply({
    t: "hello",
    root: ROOT,
    claude: info,
    projects,
    sessions: [...sessions.values()].map(publicSession),
  });
  ws.on("close", () => controls.delete(ws));
  ws.on("message", (raw) => {
    let m;
    try {
      m = JSON.parse(String(raw));
    } catch {
      return;
    }
    const s = m.id ? sessions.get(m.id) : null;
    switch (m.t) {
      case "start": {
        const result = startSession(m);
        reply(
          result.error
            ? { t: "error", message: result.error }
            : { t: "started", id: result.id },
        );
        break;
      }
      case "login": {
        const live = [...sessions.values()].find(
          (x) => x.kind === "login" && x.pty,
        );
        const result = live ? { id: live.id } : startSession({ kind: "login" });
        reply(
          result.error
            ? { t: "error", message: result.error }
            : { t: "started", id: result.id },
        );
        break;
      }
      case "type":
        // Voice and the Send button: text into the prompt, then Enter if asked.
        if (s?.pty) {
          if (m.text) s.pty.write(String(m.text));
          if (m.enter) setTimeout(() => s.pty?.write("\r"), m.text ? 60 : 0);
        }
        break;
      case "stop":
        if (s?.pty) {
          s.stopping = true;
          s.pty.kill();
        }
        break;
      case "resume":
        if (s && !s.pty) {
          const result = startSession({
            project: s.project,
            resume: s,
            mode: s.mode,
          });
          if (result.error) reply({ t: "error", message: result.error });
        }
        break;
      case "remove":
        if (s && !s.pty) {
          sessions.delete(s.id);
          broadcast({ t: "removed", id: s.id });
        }
        break;
      case "rename":
        if (s && typeof m.title === "string") {
          s.title = m.title.slice(0, 80);
          changed(s);
        }
        break;
      case "projects":
        readProjects();
        break;
      case "clone":
        cloneRepo(m.url, reply);
        break;
      case "update":
        updateClaude(true);
        break;
      case "recheck":
        readClaude();
        break;
    }
  });
}

function openTerminal(ws, id) {
  const s = sessions.get(id);
  if (!s) return ws.close(1008, "No such session");
  s.viewers.add(ws);
  ws.send(JSON.stringify({ t: "out", data: s.buffer.join("") }));
  if (!s.pty) ws.send(JSON.stringify({ t: "exit", code: s.exitCode }));
  ws.on("close", () => s.viewers.delete(ws));
  ws.on("message", (raw) => {
    let m;
    try {
      m = JSON.parse(String(raw));
    } catch {
      return;
    }
    if (!s.pty) return;
    if (m.t === "in" && typeof m.data === "string") s.pty.write(m.data);
    if (m.t === "resize" && m.cols > 1 && m.rows > 1) {
      try {
        s.pty.resize(Math.min(m.cols, 500), Math.min(m.rows, 200));
      } catch {}
    }
  });
}

/* -------------------------------------------------------------------------- */

writeHooks();
readProjects();
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is in use: the Workspace runner is probably already running.`,
    );
    process.exit(1);
  }
  throw err;
});
server.listen(PORT, "127.0.0.1", async () => {
  console.log(`NectArray Workspace runner on http://127.0.0.1:${PORT}`);
  console.log(`Projects from ${ROOT} (${projects.length} git repos)`);
  console.log("Open the Workspace tab: https://nectarray.com/admin/workspace");
  console.log(
    "Leave this window open while you work. Ctrl+C stops it and every session.",
  );
  await readClaude();
  if (!info.installed)
    console.error(
      "Claude Code was not found. Install it: npm install -g @anthropic-ai/claude-code",
    );
  else
    console.log(
      `Claude Code ${info.version}, ${info.loggedIn ? `signed in as ${info.email}` : "not signed in yet"}`,
    );
  if (!process.env.WORKSPACE_SKIP_UPDATE) updateClaude();
  setInterval(() => updateClaude(), UPDATE_EVERY);
});

const shutdown = () => {
  for (const s of sessions.values()) s.pty?.kill();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
