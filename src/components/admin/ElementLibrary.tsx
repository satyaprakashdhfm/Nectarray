"use client";
import { ADMIN } from "@/lib/admin-path";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import type { UiComponent } from "@/lib/content/ui-library";
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
  [/\sfill-rule="/g, ' fillRule="'],
  [/\sclip-rule="/g, ' clipRule="'],
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
      .replace(/<!--([\s\S]*?)-->/g, "{/*$1*/}")
  );
}

export type CategoryCount = { id: string; label: string; count: number };

/**
 * The component library: pick a category, see each component live in the
 * chosen palette at laptop, tablet or phone width, and copy its code.
 *
 * The server sends only the components on screen (the whole library is
 * hundreds of kilobytes of HTML), so changing category or searching goes
 * through the URL and the page re-renders with the new set.
 */
export function ElementLibrary({
  categories,
  total,
  category,
  blurb,
  query,
  found,
  components,
}: {
  categories: CategoryCount[];
  total: number;
  category: string;
  blurb: string | null;
  query: string;
  /** How many matched, before the page capped how many it sends. */
  found: number;
  components: UiComponent[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const palette = usePalette();
  const vars = useMemo(() => paletteVars(palette), [palette]);
  const [typed, setTyped] = useState(query);
  // Until one is picked: phone width on a phone, where a scaled-down
  // laptop layout is too small to read, and laptop width elsewhere.
  const [chosen, setDevice] = useState<Device | null>(null);
  const narrow = useNarrow();
  const device: Device = chosen ?? (narrow ? "phone" : "desktop");
  const width = DEVICES.find((d) => d.id === device)!.width;
  const [copiedCss, setCopiedCss] = useState(false);

  function go(next: { category?: string; q?: string }) {
    const params = new URLSearchParams();
    const c = next.category ?? category;
    const q = (next.q ?? typed).trim();
    if (c !== "all") params.set("category", c);
    if (q) params.set("q", q);
    const search = params.toString();
    startTransition(() =>
      router.replace(search ? `${pathname}?${search}` : pathname, {
        scroll: false,
      }),
    );
  }

  // Search as you type, a moment after the typing stops, across every
  // category rather than only the one open.
  useEffect(() => {
    if (typed.trim() === query) return;
    const timer = window.setTimeout(
      () => go({ q: typed, category: typed.trim() ? "all" : category }),
      350,
    );
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typed]);

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
    <div className="mt-6 grid gap-6 xl:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="min-w-0 xl:sticky xl:top-[88px] xl:max-h-[calc(100vh-104px)] xl:self-start xl:overflow-y-auto">
        <label className="relative block">
          <span className="sr-only">Search components</span>
          <Search
            className="text-ink-faint pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            strokeWidth={2}
            aria-hidden
          />
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Search, e.g. login, pricing, team"
            className="border-line bg-surface text-ink focus:border-brand w-full rounded-lg border py-2 pr-3 pl-9 text-[0.875rem] focus:outline-none"
          />
        </label>
        <ul className="tab-bar mt-3 xl:flex xl:flex-col xl:gap-0.5 xl:overflow-visible xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0">
          {categories.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => go({ category: c.id })}
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

      <div
        className={cn("min-w-0 transition-opacity", pending && "opacity-60")}
      >
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
              href={`${ADMIN}/web/colours`}
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

        <p className="text-ink-soft mt-4 text-[0.875rem]">
          {query
            ? found > components.length
              ? `${found} found for "${query}". Showing the first ${components.length}; add a word to narrow it.`
              : `${found} found for "${query}".`
            : (blurb ?? `${total} components in all.`)}
          {category === "heroes" && !query && (
            <>
              {" "}
              <Link
                href={`${ADMIN}/web/animations`}
                className="text-brand-deep hover:text-brand font-semibold"
              >
                Animated heroes are on the Animations tab →
              </Link>
            </>
          )}
        </p>

        {components.length === 0 ? (
          <div className="card text-ink-soft mt-4 p-8 text-center text-[0.875rem]">
            Nothing matches. Try a shorter word, like form or card.
          </div>
        ) : (
          <ul
            className={cn(
              "mt-4 grid gap-5",
              device === "tablet" && "2xl:grid-cols-2",
              device === "phone" && "lg:grid-cols-2 2xl:grid-cols-3",
            )}
          >
            {components.map((c) => (
              <li key={c.id} className="min-w-0">
                <ComponentCard
                  component={c}
                  vars={vars}
                  width={width}
                  categoryLabel={
                    category === "all" || query
                      ? categories.find((x) => x.id === c.category)?.label
                      : undefined
                  }
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
  categoryLabel,
}: {
  component: UiComponent;
  vars: Record<string, string>;
  width: number;
  categoryLabel?: string;
}) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState<"html" | "jsx" | null>(null);

  async function copy(kind: "html" | "jsx") {
    try {
      await navigator.clipboard.writeText(
        kind === "html" ? component.html : toJsx(component.html),
      );
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      // Clipboard refused; Code is there to select by hand.
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
            {categoryLabel && (
              <span className="text-brand-deep font-semibold">
                {categoryLabel}.{" "}
              </span>
            )}
            {component.source
              ? `From ${component.source} (MIT licence), recoloured to the palette.`
              : component.note}
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
