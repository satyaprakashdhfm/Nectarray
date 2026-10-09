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
  TrainFront,
} from "lucide-react";
import { railwayDeploys } from "@/app/admin/(panel)/workspace/actions";
import type {
  DeployState,
  ProjectDeploys,
  RailwayBoard,
  ServiceDeploy,
} from "@/lib/railway";
import { cn } from "@/lib/utils";

/**
 * Railway at a glance, above the Workspace: what is building or rolling out
 * now, what failed, and what just went live. Everything else that is running
 * fine folds away behind "Show all".
 *
 * Read by the website itself (RAILWAY_API_TOKEN), not by the Workspace
 * service, so it works while the workspace is stopped. It checks every 10
 * seconds while something is deploying and every minute otherwise, and not at
 * all while the tab is hidden: Railway allows 1,000 requests an hour.
 */

const FAST_MS = 10_000;
const SLOW_MS = 60_000;
const BACK_OFF_MS = 5 * 60_000;
/** A deploy that finished this recently still shows while folded. */
const RECENT_MS = 15 * 60_000;
const OPEN_KEY = "nectarray.deploys.open";

type View = RailwayBoard | { ok: false; error: "loading" | "expired" };

const LABEL: Record<string, string> = {
  QUEUED: "Queued",
  WAITING: "Waiting",
  NEEDS_APPROVAL: "Needs approval",
  INITIALIZING: "Starting",
  BUILDING: "Building",
  DEPLOYING: "Deploying",
  SUCCESS: "Live",
  FAILED: "Failed",
  CRASHED: "Crashed",
  SLEEPING: "Asleep",
  REMOVING: "Removing",
  REMOVED: "Removed",
  SKIPPED: "Skipped",
};

function ago(iso: string, now: number) {
  const minutes = Math.max(0, Math.round((now - Date.parse(iso)) / 60_000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours} h`;
  return `${Math.floor(hours / 24)} days`;
}

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

export function DeployBoard() {
  const [view, setView] = useState<View>({ ok: false, error: "loading" });
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
        next = await railwayDeploys();
      } catch {
        // The action refuses once the admin sign-in has run out.
        next = { ok: false, error: "expired" };
      }
      if (!alive) return;
      setView(next);
      setNow(Date.now());
      setChecking(false);

      const delay = next.ok
        ? next.projects.some((p) =>
            p.services.some((s) => s.state === "active"),
          )
          ? FAST_MS
          : SLOW_MS
        : next.error === "down"
          ? SLOW_MS
          : next.error === "busy" || next.error === "token"
            ? BACK_OFF_MS
            : null;
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

  if (!view.ok) {
    const { error } = view;
    if (error === "loading")
      return (
        <div
          className="bg-mist-deep mt-6 h-[3.25rem] animate-pulse rounded-xl"
          aria-hidden
        />
      );
    return (
      <section aria-label="Railway deploys" className="card mt-6 px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Title />
          <p className="text-ink-soft min-w-0 flex-1 text-[0.8125rem]">
            <Problem error={error} />
          </p>
          {error !== "unset" && error !== "expired" && (
            <Refresh checking={checking} onClick={() => check.current()} />
          )}
        </div>
      </section>
    );
  }

  const all = view.projects.flatMap((p) => p.services);
  const count = (state: DeployState) =>
    all.filter((s) => s.state === state).length;
  const shown = open
    ? view.projects
    : view.projects
        .map((p) => ({
          ...p,
          services: p.services.filter((s) => worthShowing(s, now)),
        }))
        .filter((p) => p.services.length > 0);
  const hidden = all.length - shown.reduce((n, p) => n + p.services.length, 0);

  return (
    <section aria-label="Railway deploys" className="card mt-6 px-4 py-3">
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
            Checked {ago(view.checkedAt, now)}
            {ago(view.checkedAt, now) === "just now" ? "" : " ago"}
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

      {all.length === 0 ? (
        <p className="text-ink-soft mt-2 text-[0.8125rem]">
          No deployed services on this Railway account yet.
        </p>
      ) : shown.length === 0 ? (
        <p className="text-ink-faint mt-1.5 text-[0.8125rem]">
          Nothing deploying, nothing failed.{" "}
          {hidden > 0 && "Show all to see every service."}
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          {shown.map((p) => (
            <Project key={p.id} project={p} now={now} />
          ))}
        </div>
      )}
    </section>
  );
}

function Title() {
  return (
    <h2 className="text-ink inline-flex items-center gap-2 text-[0.875rem] font-semibold">
      <TrainFront
        className="text-brand-deep size-4"
        strokeWidth={1.9}
        aria-hidden
      />
      Railway
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
      aria-label="Check Railway now"
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

function Problem({
  error,
}: {
  error: "unset" | "token" | "busy" | "down" | "expired";
}) {
  if (error === "unset")
    return (
      <>
        See your deploys here: create an account token at{" "}
        <a
          href="https://railway.com/account/tokens"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-deep font-semibold underline"
        >
          railway.com/account/tokens
        </a>{" "}
        (Workspace: No workspace) and add it to the Web service as
        RAILWAY_API_TOKEN.
      </>
    );
  if (error === "token")
    return (
      <span className="text-danger">
        Railway refused the token in RAILWAY_API_TOKEN. Make a new one and
        replace it on the Web service.
      </span>
    );
  if (error === "busy")
    return "Railway asked us to slow down. Checking again in 5 minutes.";
  if (error === "expired")
    return "Your admin session has ended. Reload the page to sign in again.";
  return "Could not reach Railway just now. Trying again in a minute.";
}

function Project({ project, now }: { project: ProjectDeploys; now: number }) {
  return (
    <div>
      <h3 className="text-ink-faint text-[0.6875rem] font-semibold">
        {project.name}
      </h3>
      <ul className="mt-1.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
        {project.services.map((s) => (
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
      title={`Open ${s.service} on Railway`}
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
          {label}
          {s.state === "active"
            ? `, ${ago(s.at, now) === "just now" ? "just started" : `for ${ago(s.at, now)}`}`
            : `, ${ago(s.at, now)}${ago(s.at, now) === "just now" ? "" : " ago"}`}
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
