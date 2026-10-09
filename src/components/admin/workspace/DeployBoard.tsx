"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  CircleCheck,
  CircleX,
  ExternalLink,
  Loader2,
  Moon,
  RefreshCw,
  Rocket,
} from "lucide-react";
import { deploys } from "@/app/admin/(panel)/workspace/actions";
import type {
  DeployBoard as Board,
  DeployGroup,
  DeployState,
  Host,
  HostProblem,
  ServiceDeploy,
} from "@/lib/deploys/board";
import { cn } from "@/lib/utils";

/**
 * Railway and Vercel at a glance, above the Workspace, grouped by app (an
 * API on Railway and its front end on Vercel sit together): what is building
 * now, what failed, and what just went live. Everything else running fine
 * folds away behind "Show all".
 *
 * Read by the website itself (RAILWAY_API_TOKEN, VERCEL_API_TOKEN), not by
 * the Workspace service, so it works while the workspace is stopped. It
 * checks every 10 seconds while something is deploying and every minute
 * otherwise, and not at all while the tab is hidden.
 */

const FAST_MS = 10_000;
const SLOW_MS = 60_000;
const BACK_OFF_MS = 5 * 60_000;
/** A deploy that finished this recently still shows while folded. */
const RECENT_MS = 15 * 60_000;
const OPEN_KEY = "nectarray.deploys.open";

type View =
  { kind: "loading" } | { kind: "expired" } | { kind: "board"; board: Board };

const HOST: Record<Host, string> = { railway: "Railway", vercel: "Vercel" };

const LABEL: Record<string, string> = {
  QUEUED: "Queued",
  WAITING: "Waiting",
  NEEDS_APPROVAL: "Needs approval",
  INITIALIZING: "Starting",
  BUILDING: "Building",
  DEPLOYING: "Deploying",
  SUCCESS: "Live",
  READY: "Live",
  FAILED: "Failed",
  ERROR: "Failed",
  CRASHED: "Crashed",
  BLOCKED: "Blocked",
  SLEEPING: "Asleep",
  REMOVING: "Removing",
  REMOVED: "Removed",
  SKIPPED: "Skipped",
  CANCELED: "Canceled",
  DELETED: "Deleted",
};

function ago(iso: string, now: number) {
  const minutes = Math.max(0, Math.round((now - Date.parse(iso)) / 60_000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours} h`;
  return `${Math.floor(hours / 24)} days`;
}

const agoText = (iso: string, now: number) => {
  const text = ago(iso, now);
  return text === "just now" ? text : `${text} ago`;
};

function readOpen() {
  try {
    return localStorage.getItem(OPEN_KEY) === "1";
  } catch {
    return false;
  }
}

/** What shows while folded: anything in motion, broken, or just finished. */
const worthShowing = (s: ServiceDeploy, now: number) =>
  s.state === "active" ||
  s.state === "failed" ||
  now - Date.parse(s.at) < RECENT_MS;

/** How long until the next check, or null to stop until the page reloads. */
function nextDelay(board: Board): number | null {
  if (board.hosts.every((h) => h.problem === "unset")) return null;
  if (board.hosts.some((h) => h.problem === "busy")) return BACK_OFF_MS;
  return board.groups.some((g) => g.services.some((s) => s.state === "active"))
    ? FAST_MS
    : SLOW_MS;
}

export function DeployBoard() {
  const [view, setView] = useState<View>({ kind: "loading" });
  const [open, setOpen] = useState(readOpen);
  const [checking, setChecking] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const check = useRef<() => void>(() => {});

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function run() {
      clearTimeout(timer);
      setChecking(true);
      let next: View;
      try {
        next = { kind: "board", board: await deploys() };
      } catch {
        // The action refuses once the admin sign-in has run out.
        next = { kind: "expired" };
      }
      if (!alive) return;
      setView(next);
      setNow(Date.now());
      setChecking(false);

      const delay = next.kind === "board" ? nextDelay(next.board) : null;
      // A hidden tab waits; coming back checks at once (below).
      if (delay !== null && document.visibilityState === "visible")
        timer = setTimeout(run, delay);
    }

    const onVisible = () => {
      if (document.visibilityState === "visible") void run();
      else clearTimeout(timer);
    };
    check.current = () => void run();
    void run();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  // Times on the board keep moving between checks.
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(tick);
  }, []);

  const toggle = () => {
    setOpen((was) => {
      try {
        localStorage.setItem(OPEN_KEY, was ? "0" : "1");
      } catch {}
      return !was;
    });
  };

  if (view.kind === "loading")
    return (
      <div
        className="bg-mist-deep mt-6 h-[3.25rem] animate-pulse rounded-xl"
        aria-hidden
      />
    );

  if (view.kind === "expired")
    return (
      <Frame>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Title />
          <p className="text-ink-soft text-[0.8125rem]">
            Your admin session has ended. Reload the page to sign in again.
          </p>
        </div>
      </Frame>
    );

  const { board } = view;
  if (board.hosts.every((h) => h.problem === "unset"))
    return (
      <Frame>
        <Title />
        <p className="text-ink-soft mt-1.5 text-[0.8125rem]">
          See what is deploying on Railway and Vercel here. Add either token, or
          both, to the Web service on Railway:
        </p>
        <ul className="mt-2 space-y-1.5 text-[0.8125rem]">
          {board.hosts.map((h) => (
            <li key={h.host} className="text-ink-soft">
              <Setup host={h.host} />
            </li>
          ))}
        </ul>
      </Frame>
    );

  const all = board.groups.flatMap((g) => g.services);
  const count = (state: DeployState) =>
    all.filter((s) => s.state === state).length;
  const shown = open
    ? board.groups
    : board.groups
        .map((g) => ({
          ...g,
          services: g.services.filter((s) => worthShowing(s, now)),
        }))
        .filter((g) => g.services.length > 0);
  const problems = board.hosts.flatMap(({ host, problem }) =>
    problem ? [{ host, problem }] : [],
  );

  return (
    <Frame>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Title />
        <ul className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[0.8125rem] font-semibold">
          {count("active") > 0 && (
            <li className="text-brand-deep inline-flex items-center gap-1.5">
              <Loader2
                className="size-3.5 motion-safe:animate-spin"
                aria-hidden
              />
              {count("active")} deploying
            </li>
          )}
          {count("failed") > 0 && (
            <li className="text-danger inline-flex items-center gap-1.5">
              <CircleX className="size-3.5" aria-hidden />
              {count("failed")} failed
            </li>
          )}
          <li className="text-ink-soft inline-flex items-center gap-1.5">
            <CircleCheck className="text-leaf-deep size-3.5" aria-hidden />
            {count("live")} live
          </li>
          {count("idle") > 0 && (
            <li className="text-ink-faint inline-flex items-center gap-1.5">
              <Moon className="size-3.5" aria-hidden />
              {count("idle")} asleep or off
            </li>
          )}
        </ul>

        <div className="ml-auto flex items-center gap-1">
          <span className="text-ink-faint hidden text-[0.75rem] sm:inline">
            Checked {agoText(board.checkedAt, now)}
          </span>
          <Refresh checking={checking} onClick={() => check.current()} />
          {all.length > 0 && (
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              className="text-ink-soft hover:text-brand-deep inline-flex items-center gap-1 rounded-md px-2 py-1 text-[0.75rem] font-semibold transition-colors"
            >
              {open ? "Fold" : `Show all ${all.length}`}
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform duration-200",
                  open && "rotate-180",
                )}
                aria-hidden
              />
            </button>
          )}
        </div>
      </div>

      {problems.length > 0 && (
        <ul className="mt-2 space-y-1 text-[0.75rem]">
          {problems.map((h) => (
            <li key={h.host} className="text-ink-faint">
              {h.problem === "unset" ? (
                <Setup host={h.host} />
              ) : (
                <Problem host={h.host} problem={h.problem} />
              )}
            </li>
          ))}
        </ul>
      )}

      {all.length === 0 ? (
        <p className="text-ink-soft mt-2 text-[0.8125rem]">
          Nothing deployed yet.
        </p>
      ) : shown.length === 0 ? (
        <p className="text-ink-faint mt-1.5 text-[0.8125rem]">
          Nothing deploying, nothing failed. Show all to see every app.
        </p>
      ) : (
        <div className="divide-line mt-3 divide-y">
          {shown.map((g) => (
            <Group key={g.id} group={g} now={now} />
          ))}
        </div>
      )}
    </Frame>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <section aria-label="Deploys" className="card mt-6 px-4 py-3">
      {children}
    </section>
  );
}

function Title() {
  return (
    <h2 className="text-ink inline-flex items-center gap-2 text-[0.875rem] font-semibold">
      <Rocket
        className="text-brand-deep size-4"
        strokeWidth={1.9}
        aria-hidden
      />
      Deploys
    </h2>
  );
}

function Refresh({
  checking,
  onClick,
}: {
  checking: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={checking}
      aria-label="Check deploys now"
      title="Check now"
      className="text-ink-soft hover:text-brand-deep inline-flex size-8 items-center justify-center rounded-md transition-colors disabled:opacity-50"
    >
      <RefreshCw
        className={cn("size-3.5", checking && "motion-safe:animate-spin")}
        aria-hidden
      />
    </button>
  );
}

const LINK = "text-brand-deep font-semibold underline";

/** How to connect a host that has no token yet. */
function Setup({ host }: { host: Host }) {
  return host === "railway" ? (
    <>
      Railway: an account token from{" "}
      <a
        href="https://railway.com/account/tokens"
        target="_blank"
        rel="noopener noreferrer"
        className={LINK}
      >
        railway.com/account/tokens
      </a>{" "}
      (Workspace: No workspace), as RAILWAY_API_TOKEN.
    </>
  ) : (
    <>
      Vercel: a token from{" "}
      <a
        href="https://vercel.com/account/settings/tokens"
        target="_blank"
        rel="noopener noreferrer"
        className={LINK}
      >
        vercel.com/account/settings/tokens
      </a>{" "}
      (Scope: your team), as VERCEL_API_TOKEN.
    </>
  );
}

function Problem({
  host,
  problem,
}: {
  host: Host;
  problem: Exclude<HostProblem, "unset">;
}) {
  const name = HOST[host];
  const variable =
    host === "railway" ? "RAILWAY_API_TOKEN" : "VERCEL_API_TOKEN";
  if (problem === "token")
    return (
      <span className="text-danger">
        {name} refused the token in {variable}. Make a new one and replace it on
        the Web service.
      </span>
    );
  if (problem === "busy")
    return `${name} asked us to slow down. Checking again in 5 minutes.`;
  return `Could not reach ${name} just now. Trying again shortly.`;
}

function Group({ group, now }: { group: DeployGroup; now: number }) {
  const hosts = [...new Set(group.services.map((s) => s.host))];
  return (
    <div className="py-2.5 first:pt-0 last:pb-0">
      <h3 className="flex flex-wrap items-baseline gap-x-2 text-[0.8125rem]">
        <span className="text-ink font-semibold">{group.name}</span>
        <span className="text-ink-faint text-[0.6875rem]">
          {hosts.map((h) => HOST[h]).join(" and ")}
        </span>
      </h3>
      <ul className="mt-1.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
        {group.services.map((s) => (
          <li key={s.key}>
            <Service service={s} now={now} />
          </li>
        ))}
      </ul>
    </div>
  );
}

const ICON: Record<DeployState, React.ReactNode> = {
  active: (
    <Loader2
      className="text-brand-deep size-4 motion-safe:animate-spin"
      aria-hidden
    />
  ),
  failed: <CircleX className="text-danger size-4" aria-hidden />,
  live: <CircleCheck className="text-leaf-deep size-4" aria-hidden />,
  idle: <Moon className="text-ink-faint size-4" aria-hidden />,
};

function Service({ service: s, now }: { service: ServiceDeploy; now: number }) {
  const label = LABEL[s.status] ?? s.status.toLowerCase();
  return (
    <a
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      title={`Open ${s.service} on ${HOST[s.host]}`}
      className={cn(
        "group flex min-w-0 items-start gap-2.5 rounded-lg border px-3 py-2 transition-colors",
        s.state === "failed"
          ? "border-danger/30 hover:border-danger/60"
          : s.state === "active"
            ? "border-brand/30 bg-brand-wash hover:border-brand/60"
            : "border-line hover:border-brand/50",
      )}
    >
      <span className="mt-0.5 shrink-0">{ICON[s.state]}</span>
      <span className="min-w-0 flex-1">
        <span className="flex min-w-0 items-baseline gap-1.5">
          <span className="text-ink truncate text-[0.8125rem] font-semibold">
            {s.service}
          </span>
          <span className="bg-mist text-ink-faint shrink-0 rounded px-1.5 text-[0.625rem] font-semibold">
            {HOST[s.host]}
          </span>
          {s.environment !== "production" && (
            <span className="text-ink-faint shrink-0 text-[0.6875rem]">
              {s.environment}
            </span>
          )}
          <ExternalLink
            className="text-ink-faint ml-auto size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            aria-hidden
          />
        </span>
        <span
          className={cn(
            "block text-[0.75rem]",
            s.state === "failed" ? "text-danger" : "text-ink-soft",
          )}
        >
          {label},{" "}
          {s.state === "active"
            ? ago(s.at, now) === "just now"
              ? "just started"
              : `for ${ago(s.at, now)}`
            : agoText(s.at, now)}
        </span>
        {s.commit && (
          <span className="text-ink-faint block truncate text-[0.75rem]">
            {s.commit}
          </span>
        )}
      </span>
    </a>
  );
}
