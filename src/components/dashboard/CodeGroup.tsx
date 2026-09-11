"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { CodeBlock } from "@/components/dashboard/CodeBlock";
import type { CodeTab } from "@/lib/notes-code-tabs";

/**
 * Several versions of one example, one tab each — the same call written with
 * three libraries, or the files of one small app.
 *
 * Tabs rather than stacked blocks because the versions answer one question:
 * a reader comparing them wants to flip between them in place, not scroll
 * three screens and hold the first in their head. The tabs sit on the block
 * like the file tabs of an editor, and each tab's own output, if it has one,
 * travels with it.
 */
export function CodeGroup({ tabs }: { tabs: CodeTab[] }) {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  // Arrow keys move between tabs, as they do in any tab strip.
  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (active + step + tabs.length) % tabs.length;
    setActive(next);
    buttons.current[next]?.focus();
  };

  const tab = tabs[active];

  return (
    <div className="code-group">
      <div role="tablist" aria-label="Versions" className="code-group-tabs">
        {tabs.map((entry, i) => (
          <button
            key={entry.title}
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
            {entry.title}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
      >
        {/* Keyed, so a tab's code/output pane choice starts fresh. */}
        <CodeBlock
          key={active}
          code={tab.code}
          language={tab.language}
          output={tab.output}
        />
      </div>
    </div>
  );
}
