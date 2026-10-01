"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  Code,
  Copy,
  Monitor,
  Search,
  Smartphone,
  Tablet,
  type LucideIcon,
} from "lucide-react";
import { PreviewFrame } from "@/components/admin/PreviewFrame";
import {
  UI_CATEGORIES,
  UI_COMPONENTS,
  type UiComponent,
} from "@/lib/content/ui-library";
import { ROLES, paletteCss, paletteVars, usePalette } from "@/lib/palette";
import { useNarrow } from "@/lib/use-narrow";
import { cn } from "@/lib/utils";

type Device = "desktop" | "tablet" | "phone";

const DEVICES: {
  id: Device;
  label: string;
  width: number;
  icon: LucideIcon;
}[] = [
  { id: "desktop", label: "Laptop", width: 1280, icon: Monitor },
  { id: "tablet", label: "Tablet", width: 768, icon: Tablet },
  { id: "phone", label: "Phone", width: 390, icon: Smartphone },
];

const smallButton =
  "border-line bg-surface text-ink hover:border-brand hover:text-brand-deep inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[0.75rem] font-semibold transition-colors";

const ATTRIBUTES: [RegExp, string][] = [
  [/\sclass="/g, ' className="'],
  [/\sfor="/g, ' htmlFor="'],
  [/\stabindex="/g, ' tabIndex="'],
  [/\sautocomplete="/g, ' autoComplete="'],
  [/\sstroke-width="/g, ' strokeWidth="'],
  [/\sstroke-linecap="/g, ' strokeLinecap="'],
  [/\sstroke-linejoin="/g, ' strokeLinejoin="'],
  [/\sstroke-dasharray="/g, ' strokeDasharray="'],
  [/\stext-anchor="/g, ' textAnchor="'],
  [/\sfont-size="/g, ' fontSize="'],
  [/\sfont-family="/g, ' fontFamily="'],
];

/** The HTML as JSX for a React project: className, htmlFor, closed tags. */
function toJsx(html: string): string {
  let jsx = html;
  for (const [pattern, replacement] of ATTRIBUTES) {
    jsx = jsx.replace(pattern, replacement);
  }
  return (
    jsx
      // Void elements must close themselves.
      .replace(/<(input|img|br|hr)([^>]*?)\s*\/?>/g, "<$1$2 />")
      .replace(/\schecked(?=[\s/>])/g, " defaultChecked")
      .replace(/(<(?:input|textarea)[^>]*?)\svalue="/g, '$1 defaultValue="')
      .replace(/\srows="(\d+)"/g, " rows={$1}")
  );
}

/**
 * The component library: pick a category, see each component live in the
 * chosen palette at laptop, tablet or phone width, and copy its code.
 */
export function ElementLibrary({
  initialCategory,
}: {
  initialCategory: string;
}) {
  const palette = usePalette();
  const vars = useMemo(() => paletteVars(palette), [palette]);
  const [category, setCategory] = useState(
    UI_CATEGORIES.some((c) => c.id === initialCategory)
      ? initialCategory
      : "all",
  );
  const [query, setQuery] = useState("");
  // Until one is picked: phone width on a phone, where a scaled-down
  // laptop layout is too small to read, and laptop width elsewhere.
  const [chosen, setDevice] = useState<Device | null>(null);
  const narrow = useNarrow();
  const device: Device = chosen ?? (narrow ? "phone" : "desktop");
  const [copiedCss, setCopiedCss] = useState(false);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of UI_COMPONENTS) {
      map.set(c.category, (map.get(c.category) ?? 0) + 1);
    }
    return map;
  }, []);

  const q = query.trim().toLowerCase();
  const shown = UI_COMPONENTS.filter(
    (c) =>
      (category === "all" || c.category === category) &&
      (!q ||
        c.name.toLowerCase().includes(q) ||
        c.note.toLowerCase().includes(q) ||
        c.category.includes(q)),
  );
  const current = UI_CATEGORIES.find((c) => c.id === category);
  const width = DEVICES.find((d) => d.id === device)!.width;

  function choose(id: string) {
    setCategory(id);
    const url = new URL(window.location.href);
    if (id === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", id);
    window.history.replaceState(null, "", url);
  }

  async function copyCss() {
    try {
      await navigator.clipboard.writeText(paletteCss(palette));
      setCopiedCss(true);
      window.setTimeout(() => setCopiedCss(false), 1600);
    } catch {
      // Clipboard refused.
    }
  }

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[14rem_minmax(0,1fr)]">
      <aside className="min-w-0 xl:sticky xl:top-[88px] xl:self-start">
        <label className="relative block">
          <span className="sr-only">Search components</span>
          <Search
            className="text-ink-faint pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            strokeWidth={2}
            aria-hidden
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="border-line bg-surface text-ink focus:border-brand w-full rounded-lg border py-2 pr-3 pl-9 text-[0.875rem] focus:outline-none"
          />
        </label>
        <ul className="tab-bar mt-3 xl:flex xl:flex-col xl:gap-0.5 xl:overflow-visible xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0">
          {[
            { id: "all", label: "All", count: UI_COMPONENTS.length },
            ...UI_CATEGORIES.map((c) => ({
              id: c.id,
              label: c.label,
              count: counts.get(c.id) ?? 0,
            })),
          ].map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => choose(c.id)}
                aria-pressed={category === c.id}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-full px-3 py-1.5 text-left text-[0.8125rem] font-semibold whitespace-nowrap transition-colors xl:gap-3 xl:rounded-lg",
                  category === c.id
                    ? "bg-brand-solid text-cta-fg"
                    : "text-ink-soft hover:bg-surface hover:text-ink",
                )}
              >
                {c.label}
                <span className="font-mono text-[0.6875rem] opacity-70">
                  {c.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="min-w-0">
        <div className="card flex flex-wrap items-center justify-between gap-3 p-3">
          <div
            role="radiogroup"
            aria-label="Screen width"
            className="bg-mist inline-flex rounded-lg p-0.5"
          >
            {DEVICES.map((d) => (
              <button
                key={d.id}
                type="button"
                role="radio"
                aria-checked={device === d.id}
                onClick={() => setDevice(d.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[0.75rem] font-semibold transition-colors",
                  device === d.id
                    ? "bg-surface text-ink shadow-sm"
                    : "text-ink-faint hover:text-ink",
                )}
              >
                <d.icon className="size-3.5" strokeWidth={2} aria-hidden />
                {d.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/web/colours"
              className="text-ink-soft hover:text-ink inline-flex items-center gap-2 text-[0.75rem] font-semibold"
              title="Change the colours"
            >
              <span className="flex -space-x-1">
                {ROLES.map(({ role }) => (
                  <span
                    key={role}
                    className="ring-surface size-4 rounded-full ring-2"
                    style={{ background: palette[role] }}
                  />
                ))}
              </span>
              Colours
            </Link>
            <button type="button" onClick={copyCss} className={smallButton}>
              {copiedCss ? (
                <Check className="size-3.5" strokeWidth={2} aria-hidden />
              ) : (
                <Copy className="size-3.5" strokeWidth={2} aria-hidden />
              )}
              {copiedCss ? "Copied" : "Copy colours as CSS"}
            </button>
          </div>
        </div>

        {current && !q && (
          <p className="text-ink-soft mt-4 text-[0.875rem]">{current.blurb}</p>
        )}

        {shown.length === 0 ? (
          <div className="card text-ink-soft mt-4 p-8 text-center text-[0.875rem]">
            Nothing matches &ldquo;{query}&rdquo;.
          </div>
        ) : (
          <ul
            className={cn(
              "mt-4 grid gap-5",
              device === "tablet" && "2xl:grid-cols-2",
              device === "phone" && "lg:grid-cols-2 2xl:grid-cols-3",
            )}
          >
            {shown.map((c) => (
              <li key={c.id} className="min-w-0">
                <ComponentCard
                  component={c}
                  vars={vars}
                  width={width}
                  showCategory={category === "all" || Boolean(q)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ComponentCard({
  component,
  vars,
  width,
  showCategory,
}: {
  component: UiComponent;
  vars: Record<string, string>;
  width: number;
  showCategory: boolean;
}) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState<"html" | "jsx" | null>(null);
  const category = UI_CATEGORIES.find((c) => c.id === component.category);

  async function copy(kind: "html" | "jsx") {
    try {
      await navigator.clipboard.writeText(
        kind === "html" ? component.html : toJsx(component.html),
      );
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      // Clipboard refused; Show code is there to select by hand.
    }
  }

  return (
    <article className="card overflow-hidden p-0">
      <div className="border-line flex flex-wrap items-start justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <h3 className="text-ink text-[0.9375rem] font-semibold">
            {component.name}
          </h3>
          <p className="text-ink-soft text-[0.8125rem]">
            {showCategory && category && (
              <span className="text-brand-deep font-semibold">
                {category.label}.{" "}
              </span>
            )}
            {component.note}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setShowCode(!showCode)}
            aria-expanded={showCode}
            className={smallButton}
          >
            <Code className="size-3.5" strokeWidth={2} aria-hidden />
            {showCode ? "Hide code" : "Code"}
          </button>
          <button
            type="button"
            onClick={() => copy("html")}
            className={smallButton}
          >
            {copied === "html" ? (
              <Check className="size-3.5" strokeWidth={2} aria-hidden />
            ) : (
              <Copy className="size-3.5" strokeWidth={2} aria-hidden />
            )}
            HTML
          </button>
          <button
            type="button"
            onClick={() => copy("jsx")}
            className={smallButton}
          >
            {copied === "jsx" ? (
              <Check className="size-3.5" strokeWidth={2} aria-hidden />
            ) : (
              <Copy className="size-3.5" strokeWidth={2} aria-hidden />
            )}
            JSX
          </button>
        </div>
      </div>

      {showCode && (
        <pre className="bg-night border-night-line max-h-80 overflow-auto border-b p-4 font-mono text-[0.75rem] leading-relaxed text-white/85">
          <code>{component.html}</code>
        </pre>
      )}

      <div className="bg-mist p-2 sm:p-3">
        <div className="overflow-hidden rounded-md">
          <PreviewFrame
            html={component.html}
            vars={vars}
            title={component.name}
            width={width}
            fit
            interactive
            minHeight={120}
          />
        </div>
      </div>
    </article>
  );
}
