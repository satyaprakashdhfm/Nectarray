/**
 * The Workspace runner: real Claude Code terminals for the Workspace tab in
 * the admin panel. It runs in one of two places.
 *
 * - The cloud (WORKSPACE_CLOUD=1): the Workspace service on Railway, built
 *   from the Dockerfile here. It is reachable from the internet, so every
 *   socket must carry a pass the website signs with WORKSPACE_SECRET, and
 *   the website only signs one for an admin who is all the way in (Google,
 *   the allowlist and the emailed code). Repos come from GitHub and live on
 *   the service's volume, with Claude Code's own sign-in, shared by every
 *   session. Stop closes every session; with no traffic left Railway puts
 *   the service to sleep, and the next Start wakes it.
 * - This PC (`npm run workspace`): listens on 127.0.0.1 only, for the browser
 *   on the same machine, with the repos that sit next to this one.
 *
 * Either way, only the site's own origins (ORIGINS) may open a socket.
 *
 * - /control   one socket per open admin tab: projects, sessions, Claude
 *              Code's version and sign-in, and the commands that change them.
 * - /term/<id> one socket per visible terminal: output out, keystrokes in.
 * - POST /hook what Claude Code's hooks report (see hook.mjs), which is how
 *              a session's card knows it is working, needs you, or is done.
 */
import { execFile } from "node:child_process";
import {
  createHmac,
  randomBytes,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pty from "node-pty";
import { WebSocketServer } from "ws";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CLOUD = process.env.WORKSPACE_CLOUD === "1";
const PORT = Number(
  (CLOUD ? process.env.PORT : undefined) ?? process.env.WORKSPACE_PORT ?? 4100,
);
/** Verifies the passes the website signs for admins. Required in the cloud. */
const PASS_SECRET = process.env.WORKSPACE_SECRET || null;
/** In the cloud, sessions nobody is watching are closed after this long. */
const IDLE_LIMIT = Number(process.env.WORKSPACE_IDLE_MINUTES ?? 30) * 60_000;
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

/**
 * A pass is `<payload>.<signature>`: base64url JSON { sub, exp } and its
 * HMAC-SHA256 under WORKSPACE_SECRET, made by the website's workspaceAccess
 * action after it has checked the caller. Good for one minute, which is long
 * enough to open a socket; the socket then stays open on its own.
 */
function validPass(pass) {
  if (!PASS_SECRET || typeof pass !== "string") return false;
  const [payload, signature] = pass.split(".");
  if (!payload || !signature) return false;
  const expected = createHmac("sha256", PASS_SECRET).update(payload).digest();
  const given = Buffer.from(signature, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected))
    return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

const loopback = (address = "") =>
  ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(address);
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
  /** Plugins and skills (setupClaude), in the cloud. */
  setup: { state: "idle", note: null },
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
  if (info.updating) return;
  if (!info.installed) {
    if (CLOUD) await installClaude();
    return;
  }
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

/**
 * The cloud's first start: Claude Code onto the volume (npm's global prefix
 * is /data/tools there), where it and its own updates survive redeploys.
 */
async function installClaude() {
  info.updating = true;
  info.updateNote = "Installing Claude Code…";
  broadcast({ t: "claude", claude: info });
  console.log("Installing Claude Code onto the volume…");
  const ok = await new Promise((resolve) =>
    execFile(
      "npm",
      ["install", "-g", "@anthropic-ai/claude-code", "--no-audit", "--no-fund"],
      { timeout: 10 * 60_000 },
      (err, _out, stderr) => {
        if (err) console.error(String(stderr).slice(-2000));
        resolve(!err);
      },
    ),
  );
  info.updating = false;
  await readClaude();
  info.updateNote = ok
    ? `Installed ${info.version ?? ""}.`.trim()
    : "Claude Code did not install. See the Workspace service's logs on Railway.";
  broadcast({ t: "claude", claude: info });
}

/*
 * The cloud's sessions get the same plugins and skills as Claude Code on the
 * admin's PC, from claude-setup.json: its marketplaces added, its plugins
 * installed at user scope, its skill packages installed for Claude Code.
 * Done once per version of that file (a stamp on the volume remembers it),
 * and again from the page's Set up again button.
 */
const SETUP_FILE = path.join(HERE, "claude-setup.json");
const SETUP_STAMP = path.join(
  os.homedir(),
  ".config",
  "nectarray",
  "setup-stamp",
);

const run = (file, argv, timeout) =>
  new Promise((resolve) =>
    execFile(file, argv, { timeout, env: cleanEnv() }, (err, stdout, stderr) =>
      resolve({ ok: !err, out: `${stdout}\n${stderr}` }),
    ),
  );

async function setupClaude(force = false) {
  if (!CLOUD || !info.installed || info.setup.state === "running") return;
  let wanted;
  try {
    wanted = readFileSync(SETUP_FILE, "utf8");
  } catch {
    return;
  }
  const done = {
    state: "done",
    note: "Your plugins and skills are installed.",
  };
  if (
    !force &&
    existsSync(SETUP_STAMP) &&
    readFileSync(SETUP_STAMP, "utf8") === wanted
  ) {
    info.setup = done;
    broadcast({ t: "claude", claude: info });
    return;
  }

  const config = JSON.parse(wanted);
  info.setup = {
    state: "running",
    note: "Installing your plugins and skills…",
  };
  broadcast({ t: "claude", claude: info });
  console.log("Setting up plugins and skills…");
  const failed = [];
  const already = (out) => /already/i.test(out);
  for (const source of config.marketplaces ?? []) {
    const r = await claude(
      ["plugin", "marketplace", "add", source],
      3 * 60_000,
    );
    if (!r.ok && !already(r.stdout + r.stderr)) failed.push(source);
  }
  for (const plugin of config.plugins ?? []) {
    /*
     * Reinstalled whenever the setup changes (that is the only time this
     * runs), so a plugin picks up tools added to the image since, such as
     * bun for the vercel plugin's packages.
     */
    await claude(["plugin", "uninstall", plugin, "--scope", "user"], 60_000);
    const r = await claude(
      ["plugin", "install", plugin, "--scope", "user"],
      5 * 60_000,
    );
    if (!r.ok && !already(r.stdout + r.stderr)) failed.push(plugin);
  }
  for (const pkg of config.skills ?? []) {
    const r = await run(
      "npx",
      [
        "-y",
        "skills",
        "add",
        pkg,
        "-g",
        "-y",
        "-s",
        "*",
        "-a",
        "claude-code",
        "--copy",
      ],
      5 * 60_000,
    );
    if (!r.ok) failed.push(pkg);
  }

  if (failed.length === 0) {
    mkdirSync(path.dirname(SETUP_STAMP), { recursive: true });
    writeFileSync(SETUP_STAMP, wanted);
  }
  info.setup = failed.length
    ? {
        state: "error",
        note: `Could not install: ${failed.join(", ")}. Try Set up again.`,
      }
    : done;
  console.log(info.setup.note);
  broadcast({ t: "claude", claude: info });
}

/*
 * Files for Claude Code's own folder in the cloud (~/.claude): global
 * instructions (CLAUDE.md) and skills that are not in any public package.
 * Sent by an admin over the control socket; only these places, nothing that
 * could change settings or hooks.
 */
const CLAUDE_DIR = path.join(os.homedir(), ".claude");
function putClaudeFile(relative, content) {
  const clean = String(relative ?? "").replaceAll("\\", "/");
  const allowed =
    clean === "CLAUDE.md" ||
    /^(skills|agents|commands)\/[\w.\-/ ]+$/.test(clean);
  if (!allowed || clean.split("/").includes(".."))
    return "That place is not allowed.";
  if (typeof content !== "string" || content.length > 1_000_000)
    return "Too large.";
  const target = path.join(CLAUDE_DIR, clean);
  if (!target.startsWith(CLAUDE_DIR + path.sep))
    return "That place is not allowed.";
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, content);
  return null;
}

/**
 * Marks a repo folder as trusted in Claude Code's own config, so a session
 * opens straight into Claude instead of the "Do you trust this folder?"
 * question. Only in the cloud, and only for folders under ROOT: the repos
 * cloned there from the admin's own GitHub. Worktrees inside inherit it.
 */
function trustFolder(dir) {
  if (!CLOUD || !path.resolve(dir).startsWith(ROOT + path.sep)) return;
  const file = path.join(os.homedir(), ".claude.json");
  try {
    let config = {};
    try {
      config = JSON.parse(readFileSync(file, "utf8"));
    } catch {}
    config.projects ??= {};
    if (config.projects[dir]?.hasTrustDialogAccepted) return;
    config.projects[dir] = {
      ...config.projects[dir],
      hasTrustDialogAccepted: true,
    };
    const temp = `${file}.${process.pid}.tmp`;
    writeFileSync(temp, JSON.stringify(config, null, 2));
    renameSync(temp, file);
  } catch (err) {
    console.error("Could not mark the folder as trusted:", err.message);
  }
}

/* -------------------------------------------------------------------------- */
/* Projects: the git repos in ROOT                                            */
/* -------------------------------------------------------------------------- */

let projects = [];
/** The account's GitHub repos, listed with the token: any can be opened. */
let githubRepos = [];

/*
 * The GitHub token. Pasted into the Workspace tab (kept in TOKEN_FILE on the
 * volume, readable only by this process's user) or, failing that, the
 * GITHUB_TOKEN variable. The page is only ever told the account, the expiry
 * and the last four characters; the token itself never goes back out.
 *
 * It is put into this process's environment as GITHUB_TOKEN and GH_TOKEN,
 * which is how git (through the credential helper in cloud-start.sh), gh and
 * every session started from here get it.
 */
const TOKEN_FILE = path.join(
  os.homedir(),
  ".config",
  "nectarray",
  "github.json",
);
const ENV_TOKEN = process.env.GITHUB_TOKEN || null;
let token = null;
/** What the page sees: never the token. */
let githubInfo = { connected: false };

function applyToken(value) {
  token = value || null;
  if (token) {
    process.env.GITHUB_TOKEN = token;
    process.env.GH_TOKEN = token;
  } else {
    delete process.env.GITHUB_TOKEN;
    delete process.env.GH_TOKEN;
  }
}

function loadToken() {
  try {
    const saved = JSON.parse(readFileSync(TOKEN_FILE, "utf8"));
    if (saved.token) return applyToken(saved.token);
  } catch {}
  applyToken(ENV_TOKEN);
}

const github = (route, auth = token) =>
  fetch(`https://api.github.com${route}`, {
    headers: {
      Authorization: `Bearer ${auth}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "nectarray-workspace",
    },
    signal: AbortSignal.timeout(15_000),
  });

/**
 * Asks GitHub who a token belongs to and when it expires. Fine-grained and
 * expiring tokens carry the date in a response header; a token that never
 * expires has none.
 */
async function inspectToken(value) {
  try {
    const res = await github("/user", value);
    if (res.status === 401)
      return {
        ok: false,
        error: "GitHub says this token is invalid or has expired.",
      };
    if (!res.ok) return { ok: false, error: `GitHub answered ${res.status}.` };
    const me = await res.json();
    const header = res.headers.get("github-authentication-token-expiration");
    const expires = header
      ? new Date(header.replace(" UTC", "Z").replace(" ", "T"))
      : null;
    return {
      ok: true,
      login: me.login,
      name: me.name,
      id: me.id,
      expiresAt:
        expires && !Number.isNaN(+expires) ? expires.toISOString() : null,
    };
  } catch (err) {
    return { ok: false, error: `Could not reach GitHub: ${err.message}` };
  }
}

/** Re-checks the current token and tells every open tab. */
async function refreshGitHubInfo() {
  if (!token) {
    githubInfo = { connected: false };
  } else {
    const result = await inspectToken(token);
    let source = "env";
    let savedAt = null;
    try {
      const saved = JSON.parse(readFileSync(TOKEN_FILE, "utf8"));
      if (saved.token === token) {
        source = "page";
        savedAt = saved.savedAt ?? null;
      }
    } catch {}
    githubInfo = result.ok
      ? {
          connected: true,
          login: result.login,
          expiresAt: result.expiresAt,
          savedAt,
          source,
          last4: token.slice(-4),
        }
      : {
          connected: false,
          error: result.error,
          source,
          last4: token.slice(-4),
        };
  }
  broadcast({ t: "github", github: githubInfo });
}

/** A token pasted into the page: checked with GitHub first, then kept. */
async function saveToken(value, reply) {
  const clean = String(value ?? "").trim();
  if (!/^(github_pat_|ghp_|gho_|ghu_)[A-Za-z0-9_]{20,}$/.test(clean))
    return reply({
      t: "error",
      message:
        "That does not look like a GitHub token. Fine-grained ones start with github_pat_.",
    });
  const result = await inspectToken(clean);
  if (!result.ok) return reply({ t: "error", message: result.error });
  mkdirSync(path.dirname(TOKEN_FILE), { recursive: true, mode: 0o700 });
  writeFileSync(
    TOKEN_FILE,
    JSON.stringify({ token: clean, savedAt: new Date().toISOString() }),
    { mode: 0o600 },
  );
  applyToken(clean);
  await refreshGitHubInfo();
  await readGitHub();
  readProjects();
  gitIdentity();
  broadcast({
    t: "notice",
    message: `GitHub connected as ${result.login}. New sessions use it; sessions already open keep the old one.`,
  });
}

function forgetToken() {
  try {
    unlinkSync(TOKEN_FILE);
  } catch {}
  applyToken(ENV_TOKEN);
  githubRepos = [];
  refreshGitHubInfo().then(() => readGitHub().then(readProjects));
}

async function readGitHub() {
  if (!token) {
    githubRepos = [];
    return;
  }
  try {
    const res = await github(
      "/user/repos?per_page=100&sort=pushed&affiliation=owner,collaborator,organization_member",
    );
    if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
    githubRepos = (await res.json()).map((r) => ({
      owner: r.owner.login,
      repo: r.name,
      url: r.html_url,
      branch: r.default_branch,
    }));
  } catch (err) {
    broadcast({
      t: "error",
      message: `Could not list your GitHub repos: ${err.message}`,
    });
  }
}

/**
 * Commits made in the cloud carry the GitHub account's own name and its
 * private noreply address, so they show up on GitHub as yours.
 */
async function gitIdentity() {
  if (!CLOUD || !token) return;
  try {
    const me = await (await github("/user")).json();
    const name = process.env.GIT_USER_NAME || me.name || me.login;
    const email =
      process.env.GIT_USER_EMAIL ||
      `${me.id}+${me.login}@users.noreply.github.com`;
    execFile("git", ["config", "--global", "user.name", name]);
    execFile("git", ["config", "--global", "user.email", email]);
  } catch {}
}

/** git clone into ROOT/<name>; resolves to an error message, or null. */
function gitClone(source, name) {
  return new Promise((resolve) =>
    execFile(
      "git",
      ["clone", source, name],
      { cwd: ROOT, timeout: 10 * 60_000, windowsHide: true },
      (err, _out, stderr) =>
        resolve(
          err ? String(stderr).trim().split("\n").pop() || err.message : null,
        ),
    ),
  );
}

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
      cloned: true,
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
  // GitHub repos not cloned yet, cloned the first time a session opens one.
  const key = (owner, repo) => `${owner}/${repo}`.toLowerCase();
  const have = new Set(
    found
      .filter((p) => p.github)
      .map((p) => key(p.github.owner, p.github.repo)),
  );
  const names = new Set(found.map((p) => p.name.toLowerCase()));
  for (const r of githubRepos) {
    if (have.has(key(r.owner, r.repo))) continue;
    const name = names.has(r.repo.toLowerCase())
      ? `${r.owner}-${r.repo}`
      : r.repo;
    names.add(name.toLowerCase());
    found.push({
      name,
      path: path.join(ROOT, name),
      cloned: false,
      branch: r.branch,
      github: { owner: r.owner, repo: r.repo, url: r.url },
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
  gitClone(source, name).then((error) => {
    readProjects();
    broadcast(
      error
        ? { t: "error", message: `Could not clone ${name}: ${error}` }
        : { t: "notice", message: `${name} is connected.` },
    );
  });
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

  const shell = kind === "shell";
  let program = CLAUDE;
  const args = ["--settings", HOOKS_FILE.replaceAll("\\", "/")];
  let cwd = proj.path;
  let tree = null;
  if (shell) {
    /*
     * A plain terminal in the repo, for running git and the like yourself.
     * Not a login shell: that rereads /etc/profile, which resets PATH and
     * loses /data/tools/bin, where Claude Code is installed.
     */
    program = WIN && !CLOUD ? "powershell.exe" : "bash";
    args.length = 0;
    if (WIN && !CLOUD) args.push("-NoLogo");
    if (resume?.cwd && existsSync(resume.cwd)) cwd = resume.cwd;
  } else if (kind === "login") {
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
  if (kind === "claude" && MODES.includes(mode))
    args.push("--permission-mode", mode);

  const s = resume ?? {
    id,
    kind,
    project: proj.name,
    title:
      kind === "login"
        ? "Sign in to Claude"
        : title?.trim() || (shell ? "Terminal" : ""),
    worktree: tree,
    mode: MODES.includes(mode) ? mode : "default",
    startedAt: new Date().toISOString(),
    files: [],
    prompts: 0,
  };
  Object.assign(s, {
    status: shell ? "idle" : "starting",
    activity: shell
      ? "Terminal: type commands, such as git push"
      : kind === "login"
        ? CLOUD
          ? "Open the sign-in page, then paste the code it shows into the box below"
          : "Opening the sign-in page in your browser"
        : "Starting Claude Code",
    cwd,
    exitCode: null,
    buffer: [],
    size: 0,
    viewers: new Set(),
  });
  if (kind === "claude") trustFolder(proj.path);

  try {
    s.pty = pty.spawn(program, args, {
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
  // The terminal's size, so the small live previews draw it the same shape.
  s.cols = 120;
  s.rows = 32;

  s.pty.onData((data) => {
    s.buffer.push(data);
    s.size += data.length;
    while (s.size > BUFFER_LIMIT && s.buffer.length > 1)
      s.size -= s.buffer.shift().length;
    const frame = JSON.stringify({ t: "out", data });
    for (const ws of s.viewers) if (ws.readyState === 1) ws.send(frame);
    if (s.kind === "login" && !s.link) {
      const link = findLink(s.buffer.join(""));
      if (link) {
        s.link = link;
        changed(s);
      }
    }
  });
  s.pty.onExit(({ exitCode }) => {
    s.pty = null;
    s.exitCode = exitCode;
    s.status = "ended";
    s.activity = s.stopping
      ? (s.stopReason ?? "Stopped by you")
      : exitCode === 0
        ? "Closed"
        : `Closed with exit code ${exitCode}`;
    s.stopping = false;
    s.stopReason = null;
    for (const ws of s.viewers)
      if (ws.readyState === 1)
        ws.send(JSON.stringify({ t: "exit", code: exitCode }));
    changed(s);
    if (s.kind === "login") {
      /*
       * `claude auth login` exits as soon as it has signed in, so its card
       * would only ever say Closed. Signed in, it goes away and says so;
       * otherwise it stays, with its terminal, to show what went wrong.
       */
      readClaude().then(() => {
        if (exitCode !== 0 || !info.loggedIn) return;
        sessions.delete(s.id);
        broadcast({ t: "removed", id: s.id });
        broadcast({
          t: "notice",
          message: `Signed in to Claude${info.email ? ` as ${info.email}` : ""}. Every session uses this sign-in.`,
        });
      });
    }
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
    if (s.pty === spawned && s.status === "starting" && s.kind === "claude") {
      s.status = "needs_you";
      s.activity = "Answer the question in the terminal to start";
      changed(s);
    }
  }, 6000);
  return { id };
}

/** Permission modes a session may start in, besides your usual settings. */
const MODES = ["auto", "acceptEdits"];

/**
 * The sign-in address in `claude auth login`'s output, for a button on the
 * page: in the cloud there is no browser for it to open by itself. The
 * terminal may have wrapped it, so a line break inside it is skipped.
 */
function findLink(output) {
  const text = output
    .replace(/\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g, "")
    .replace(/\x1b\[[0-9;?<>=]*[ -/]*[@-~]/g, "")
    .replace(/\r/g, "");
  const start = text.search(
    /https:\/\/[^\s]*(?:claude\.ai|claude\.com|anthropic\.com)\/[^\s]*oauth/,
  );
  if (start < 0) return null;
  let link = "";
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (c === "\n") {
      if (/\S/.test(text[i + 1] ?? "")) continue;
      break;
    }
    if (/\s/.test(c)) break;
    link += c;
  }
  return link.length > 30 ? link : null;
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
  if (!CLOUD && !HOSTS.has(req.headers.host ?? "")) {
    res.writeHead(403).end();
    return;
  }
  if (req.method === "POST" && req.url === "/hook") {
    // Only from inside this machine, and only with this run's secret.
    if (
      req.headers["x-workspace-secret"] !== SECRET ||
      !loopback(req.socket.remoteAddress)
    ) {
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
  const url = new URL(req.url ?? "/", "http://localhost");
  /*
   * The site's origin, always. Then: with WORKSPACE_SECRET set (always, in
   * the cloud), a valid pass from the website; without it (this PC only), a
   * request addressed to localhost.
   */
  const allowed =
    ORIGINS.has(origin) &&
    (PASS_SECRET
      ? validPass(url.searchParams.get("pass"))
      : HOSTS.has(req.headers.host ?? ""));
  if (!allowed) {
    socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
    socket.destroy();
    return;
  }
  wss.handleUpgrade(req, socket, head, (ws) => {
    lastSeen = Date.now();
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
    cloud: CLOUD,
    github: githubInfo,
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
        m.kind = m.kind === "shell" ? "shell" : "claude";
        const proj = projects.find((p) => p.name === m.project);
        const go = () => {
          const result = startSession(m);
          reply(
            result.error
              ? { t: "error", message: result.error }
              : { t: "started", id: result.id },
          );
        };
        if (!proj || proj.cloned) {
          go();
          break;
        }
        // A GitHub repo opened for the first time: clone it, then start.
        reply({ t: "notice", message: `Getting ${proj.name} from GitHub…` });
        gitClone(
          `https://github.com/${proj.github.owner}/${proj.github.repo}.git`,
          proj.name,
        ).then((error) => {
          readProjects();
          if (error)
            reply({
              t: "error",
              message: `Could not clone ${proj.name}: ${error}`,
            });
          else go();
        });
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
            kind: s.kind,
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
        readGitHub().then(readProjects);
        break;
      case "shutdown":
        // Stop: every session closes. In the cloud, the quiet that follows
        // lets Railway put the service to sleep until the next Start.
        closeAll("Stopped with the workspace");
        broadcast({ t: "stopped" });
        break;
      case "clone":
        cloneRepo(m.url, reply);
        break;
      case "github-token":
        saveToken(m.token, reply);
        break;
      case "github-forget":
        forgetToken();
        reply({ t: "notice", message: "The saved GitHub token was removed." });
        break;
      case "github-check":
        refreshGitHubInfo();
        break;
      case "setup":
        setupClaude(true);
        break;
      case "put-claude-file": {
        const error = putClaudeFile(m.path, m.content);
        reply(
          error
            ? { t: "error", message: `${m.path}: ${error}` }
            : { t: "notice", message: `Saved ${m.path} for Claude Code.` },
        );
        break;
      }
      case "update":
        updateClaude(true);
        break;
      case "recheck":
        readClaude();
        break;
    }
  });
}

function closeAll(reason) {
  for (const s of sessions.values())
    if (s.pty) {
      s.stopping = true;
      s.stopReason = reason;
      s.pty.kill();
    }
}

/*
 * The cloud's safety net for a forgotten Stop: with no tab open and nothing
 * working for IDLE_LIMIT, the sessions close so the service can sleep.
 */
let lastSeen = Date.now();
function checkIdle() {
  if (controls.size > 0) lastSeen = Date.now();
  for (const s of sessions.values())
    if (s.pty && (s.status === "working" || s.status === "starting"))
      lastSeen = Date.now();
  if (Date.now() - lastSeen > IDLE_LIMIT) {
    closeAll("Closed after being left idle");
    lastSeen = Date.now();
  }
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
      const cols = Math.min(Math.floor(m.cols), 500);
      const rows = Math.min(Math.floor(m.rows), 200);
      if (cols === s.cols && rows === s.rows) return;
      try {
        s.pty.resize(cols, rows);
        s.cols = cols;
        s.rows = rows;
        changed(s);
      } catch {}
    }
  });
}

/* -------------------------------------------------------------------------- */

if (CLOUD && !PASS_SECRET) {
  console.error(
    "WORKSPACE_SECRET is not set. In the cloud the runner will not start without it.",
  );
  process.exit(1);
}
mkdirSync(ROOT, { recursive: true });
loadToken();
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
server.listen(PORT, CLOUD ? "::" : "127.0.0.1", async () => {
  console.log(
    CLOUD
      ? `NectArray Workspace runner (cloud) on port ${PORT}`
      : `NectArray Workspace runner on http://127.0.0.1:${PORT}`,
  );
  await refreshGitHubInfo();
  await readGitHub();
  readProjects();
  gitIdentity();
  // Twice a day: an expiry date or a revoked token shows up on the page.
  setInterval(refreshGitHubInfo, 12 * 60 * 60 * 1000);
  console.log(
    `Repos in ${ROOT}: ${projects.filter((p) => p.cloned).length} cloned, ${projects.length} listed`,
  );
  if (CLOUD && !token)
    console.log(
      "No GitHub token yet: add one in the Workspace tab. Only public repos can be cloned.",
    );
  if (!CLOUD)
    console.log(
      "Open the Workspace tab in the admin panel. Leave this window open; Ctrl+C stops every session.",
    );
  await readClaude();
  if (!info.installed)
    console.error(
      "Claude Code was not found. Install it: npm install -g @anthropic-ai/claude-code",
    );
  else
    console.log(
      `Claude Code ${info.version}, ${info.loggedIn ? "signed in" : "not signed in yet"}`,
    );
  // Update (or, on a fresh volume, install) Claude Code, then the plugins
  // and skills, one after the other so they never run at the same time.
  (async () => {
    if (!process.env.WORKSPACE_SKIP_UPDATE) await updateClaude();
    await setupClaude();
  })();
  setInterval(() => updateClaude(), UPDATE_EVERY);
  if (CLOUD) setInterval(checkIdle, 60_000);
});

const shutdown = () => {
  for (const s of sessions.values()) s.pty?.kill();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
