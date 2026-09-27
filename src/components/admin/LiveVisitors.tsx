"use client";

import { useEffect, useState } from "react";
import type { Result } from "@/lib/google";
import type { Realtime } from "@/lib/analytics-report";

/**
 * People on the site in the last 30 minutes. Starts from what the server
 * rendered, then asks again every minute while the tab is visible.
 */
export function LiveVisitors({ initial }: { initial: Result<Realtime> }) {
  const [live, setLive] = useState(initial);

  useEffect(() => {
    const refresh = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const response = await fetch("/api/admin/realtime", {
          cache: "no-store",
        });
        if (response.ok) setLive((await response.json()) as Result<Realtime>);
      } catch {
        // A missed minute is fine; the next one will try again.
      }
    };
    const timer = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (live.error !== undefined) {
    return (
      <div className="card p-5">
        <p className="text-ink-soft text-[0.875rem]">
          Live visitors could not be read: {live.error}
        </p>
      </div>
    );
  }
  const r = live.data;

  return (
    <div className="card grid gap-5 p-5 sm:p-6 md:grid-cols-[auto_1fr_auto] md:gap-8">
      <div>
        <p className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            {r.active > 0 && (
              <span className="bg-leaf absolute inline-flex size-full animate-ping rounded-full opacity-60" />
            )}
            <span
              className={`relative inline-flex size-2.5 rounded-full ${r.active > 0 ? "bg-leaf-deep" : "bg-line"}`}
            />
          </span>
          <span className="display text-ink text-[2.25rem] leading-none">
            {r.active}
          </span>
        </p>
        <p className="text-ink-soft mt-1.5 text-[0.8125rem]">
          {r.active === 1 ? "person" : "people"} on the site
        </p>
      </div>

      <div className="min-w-0">
        <p className="eyebrow mb-2">Looking at</p>
        {r.pages.length === 0 ? (
          <p className="text-ink-faint text-[0.8125rem]">Nobody right now.</p>
        ) : (
          <ul className="space-y-1">
            {r.pages.map((p) => (
              <li
                key={p.name}
                className="flex items-baseline justify-between gap-3 text-[0.8125rem]"
              >
                <span className="text-ink min-w-0 truncate" title={p.name}>
                  {p.name || "(untitled page)"}
                </span>
                <span className="text-ink-soft shrink-0 font-semibold tabular-nums">
                  {p.people}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <p className="eyebrow mb-2">On a</p>
        <ul className="space-y-1">
          {r.devices.map((d) => (
            <li
              key={d.name}
              className="flex items-baseline justify-between gap-6 text-[0.8125rem]"
            >
              <span className="text-ink">{d.name}</span>
              <span className="text-ink-soft font-semibold tabular-nums">
                {d.people}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
