"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Download } from "lucide-react";
import type { FigureTab } from "@/lib/notes-figure-tabs";

/**
 * Several images, one tab each — previews of the files a lesson uses, for
 * example. The same tab strip as CodeGroup, so the two read as one family,
 * over a dark frame that holds each image like a file viewer would.
 */
export function FigureGroup({ figures }: { figures: FigureTab[] }) {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (active + step + figures.length) % figures.length;
    setActive(next);
    buttons.current[next]?.focus();
  };

  const figure = figures[active];
  const fileName = figure.href?.split("/").pop();

  return (
    <div className="figure-group">
      <div role="tablist" aria-label="Figures" className="code-group-tabs">
        {figures.map((entry, i) => (
          <button
            key={entry.src}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={onKey}
            className="code-group-tab"
          >
            {entry.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
        className="figure-group-panel"
      >
        <a href={figure.src} target="_blank" rel="noreferrer noopener">
          {/* eslint-disable-next-line @next/next/no-img-element -- markdown images have no known size for next/image */}
          <img
            key={figure.src}
            src={figure.src}
            alt={figure.caption ?? figure.label}
            decoding="async"
          />
        </a>
        {(figure.caption || figure.href) && (
          <div className="figure-group-foot">
            {figure.caption && <p>{figure.caption}</p>}
            {figure.href && (
              <a href={figure.href} download className="figure-group-download">
                <Download aria-hidden className="size-3.5" />
                {fileName}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
