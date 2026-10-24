"use client";

import { useEffect, useState } from "react";
import { CircleCheck, ExternalLink, Siren } from "lucide-react";
import { incidents as readIncidents } from "@/app/admin/(panel)/workspace/actions";
import type { Incident } from "@/lib/monitor/incidents";
import { cn } from "@/lib/utils";

/**
 * Anything down, above the deploy board: open incidents in red, and what
 * recovered in the last week below them. Fed by Railway's project webhooks
 * (/api/hooks/railway) and the uptime checker (MONITOR_URLS); see
 * lib/monitor. Checks every minute while the tab is visible.
 */

const EVERY_MS = 60_000;

type View =
  | { kind: "loading" }
  | { kind: "expired" }
  | { kind: "ready"; incidents: Incident[]; watching: number };

function span(fromIso: string, to: number) {
  const minutes = Math.max(1, Math.round((to - Date.parse(fromIso)) / 60_000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours} h ${minutes % 60} min`;
  return `${Math.floor(hours / 24)} days`;
}

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

export function Incidents() {
  const [view, setView] = useState<View>({ kind: "loading" });
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function run() {
      clearTimeout(timer);
      let next: View;
      try {
        next = { kind: "ready", ...(await readIncidents()) };
      } catch {
        next = { kind: "expired" };
      }
      if (!alive) return;
      setView(next);
      setNow(Date.now());
      if (next.kind === "ready" && document.visibilityState === "visible")
        timer = setTimeout(run, EVERY_MS);
    }

    const onVisible = () => {
      if (document.visibilityState === "visible") void run();
      else clearTimeout(timer);
    };
    void run();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  // The deploy board already says when the session has run out.
  if (view.kind !== "ready") return null;

  const open = view.incidents.filter((i) => !i.resolvedAt);
  const recovered = view.incidents.filter((i) => i.resolvedAt);

  return (
    <section
      aria-label="Incidents"
      className={cn(
        "card mt-6 px-4 py-3",
        open.length > 0 && "border-danger/40",
      )}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <h2 className="text-ink inline-flex items-center gap-2 text-[0.875rem] font-semibold">
          <Siren
            className={cn(
              "size-4",
              open.length > 0 ? "text-danger" : "text-brand-deep",
            )}
            strokeWidth={1.9}
            aria-hidden
          />
          Incidents
        </h2>
        {open.length > 0 ? (
          <span className="text-danger text-[0.8125rem] font-semibold">
            {open.length} down now
          </span>
        ) : (
          <span className="text-ink-soft inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold">
            <CircleCheck className="text-leaf-deep size-3.5" aria-hidden />
            Everything up
          </span>
        )}
        <span className="text-ink-faint ml-auto text-[0.75rem]">
          {view.watching > 0
            ? `Checking ${view.watching} ${view.watching === 1 ? "site" : "sites"} every 2 min, plus Railway alerts`
            : "Railway alerts only. Add MONITOR_URLS to check sites too."}
        </span>
      </div>

      {open.length > 0 && (
        <ul className="mt-2.5 space-y-1.5">
          {open.map((i) => (
            <li
              key={i.id}
              className="border-danger/30 rounded-lg border px-3 py-2"
            >
              <Row incident={i} />
              <p className="text-danger text-[0.75rem]">
                Down for {span(i.openedAt, now)}, since {when(i.openedAt)}
                {i.lastSeenAt !== i.openedAt &&
                  `. Last seen ${span(i.lastSeenAt, now)} ago`}
              </p>
            </li>
          ))}
        </ul>
      )}

      {recovered.length > 0 && (
        <details className="mt-2 text-[0.75rem]">
          <summary className="text-ink-soft hover:text-brand-deep cursor-pointer font-semibold">
            Recovered this week ({recovered.length})
          </summary>
          <ul className="divide-line mt-1.5 divide-y">
            {recovered.map((i) => (
              <li key={i.id} className="py-1.5">
                <Row incident={i} />
                <p className="text-ink-faint">
                  {when(i.openedAt)}, down for{" "}
                  {span(i.openedAt, Date.parse(i.resolvedAt!))}
                </p>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

function Row({ incident: i }: { incident: Incident }) {
  return (
    <div className="flex min-w-0 items-baseline gap-1.5">
      <span className="text-ink truncate text-[0.8125rem] font-semibold">
        {i.title}
      </span>
      <span className="bg-mist text-ink-faint shrink-0 rounded px-1.5 text-[0.625rem] font-semibold">
        {i.source === "railway" ? "Railway" : "Uptime"}
      </span>
      {i.detail && (
        <span className="text-ink-faint hidden truncate text-[0.75rem] sm:inline">
          {i.detail}
        </span>
      )}
      {i.href && (
        <a
          href={i.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${i.title}`}
          className="text-ink-faint hover:text-brand-deep ml-auto shrink-0"
        >
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
      )}
    </div>
  );
}
