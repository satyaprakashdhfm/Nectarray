"use client";
import { ADMIN } from "@/lib/admin-path";

import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  useTransition,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  ChevronsDownUp,
  ChevronsUpDown,
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
  DOMAINS,
  UI_PARTS,
  type UiComponent,
  type UiPart,
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

const OPEN_KEY = "elements-open-all";

/**
 * A component's own group if it names one; otherwise "Feature grid 3" is a
 * Feature grid, and ours, with no number, are Layouts.
 */
function kindOf(c: UiComponent): string {
  if (c.group) return c.group;
  const kind = c.name.match(/^(.*\D)\s+\d+$/)?.[1];
  if (!c.source || !kind) return "Layouts";
  return kind.endsWith("s") ? kind : `${kind}s`;
}

// Stands in for storage when the browser blocks it.
let openInMemory = false;

function readOpen() {
  try {
    return localStorage.getItem(OPEN_KEY) === "1";
  } catch {
    return openInMemory;
  }
}

function subscribeOpen(listener: () => void) {
  window.addEventListener(OPEN_KEY, listener);
  return () => window.removeEventListener(OPEN_KEY, listener);
}

export type CategoryCount = {
  id: string;
  label: string;
  count: number;
  part: UiPart;
};

export type HeroTypeCount = { id: string; label: string; count: number };

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
  heroTypes,
  heroType,
  domainView,
}: {
  categories: CategoryCount[];
  total: number;
  category: string;
  blurb: string | null;
  query: string;
  /** How many matched, before the page capped how many it sends. */
  found: number;
  components: UiComponent[];
  heroTypes: HeroTypeCount[];
  /** The hero type picked in the dropdown; null is all of them. */
  heroType: string | null;
  /** Shown in place of the components when Domains is picked. */
  domainView?: ReactNode;
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
  // Cards start closed, to open one at a time; Open all flips that, and the
  // choice is kept for next time. Cards toggled by hand differ from it.
  const allOpen = useSyncExternalStore(subscribeOpen, readOpen, () => false);
  const [flipped, setFlipped] = useState<Set<string>>(() => new Set());

  function setAll(open: boolean) {
    setFlipped(new Set());
    openInMemory = open;
    try {
      localStorage.setItem(OPEN_KEY, open ? "1" : "0");
    } catch {
      // Storage blocked; the choice lasts until the page is left.
    }
    window.dispatchEvent(new Event(OPEN_KEY));
  }

  const isOpen = (id: string) => allOpen !== flipped.has(id);

  // Sub-sections inside the category, each folded on its own: by category
  // for a search, by type for heroes, otherwise by kind (Feature grid,
  // Card), with the ones written here first as Layouts.
  const searching = category === "all" || !!query;
  const groups = useMemo(() => {
    const byLabel = new Map<string, UiComponent[]>();
    for (const c of components) {
      const label = searching
        ? (categories.find((x) => x.id === c.category)?.label ?? "Other")
        : category === "heroes"
          ? (heroTypes.find((t) => t.id === (c.type ?? "other"))?.label ??
            "Other")
          : kindOf(c);
      byLabel.set(label, [...(byLabel.get(label) ?? []), c]);
    }
    return [...byLabel].map(([label, items]) => ({ label, items }));
  }, [components, categories, heroTypes, category, searching]);

  function toggle(id: string) {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }

  function go(next: { category?: string; q?: string; type?: string | null }) {
    const params = new URLSearchParams();
    const c = next.category ?? category;
    const q = (next.q ?? typed).trim();
    // A new category starts with every hero type; a type of null, picked
    // as "All types", clears it rather than keeping the current one.
    const t = "type" in next ? next.type : next.category ? null : heroType;
    if (c !== "all") params.set("category", c);
    if (q) params.set("q", q);
    if (c === "heroes" && t) params.set("type", t);
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
        <div className="tab-bar mt-3 xl:block xl:overflow-visible xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0">
          {[
            ...UI_PARTS.map((part) => ({
              id: part.id,
              label: part.label,
              items: categories.filter((c) => c.part === part.id),
            })),
            {
              id: "sites",
              label: "Reference websites",
              items: [{ id: DOMAINS, label: "Domains", count: 0 }],
            },
          ].map((group) => (
            <div key={group.id} className="contents xl:mb-3 xl:block">
              <p className="eyebrow hidden px-3 pt-2 pb-1 xl:block">
                {group.label}
              </p>
              <ul className="contents xl:flex xl:flex-col xl:gap-0.5">
                {group.items.map((c) => (
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
                      {c.id !== DOMAINS && (
                        <span className="font-mono text-[0.6875rem] opacity-70">
                          {c.count}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      <div
        className={cn("min-w-0 transition-opacity", pending && "opacity-60")}
      >
        {category === DOMAINS ? (
          domainView
        ) : (
          <>
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
                <button
                  type="button"
                  onClick={() => setAll(!allOpen)}
                  className={smallButton}
                >
                  {allOpen ? (
                    <ChevronsDownUp
                      className="size-3.5"
                      strokeWidth={2}
                      aria-hidden
                    />
                  ) : (
                    <ChevronsUpDown
                      className="size-3.5"
                      strokeWidth={2}
                      aria-hidden
                    />
                  )}
                  {allOpen ? "Close all" : "Open all"}
                </button>
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
            </p>

            {category === "heroes" && !query && (
              <label className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-ink text-[0.8125rem] font-semibold">
                  Type
                </span>
                <select
                  value={heroType ?? ""}
                  onChange={(e) => go({ type: e.target.value || null })}
                  className="border-line bg-surface text-ink focus:border-brand rounded-lg border px-3 py-1.5 text-[0.875rem] focus:outline-none"
                >
                  <option value="">
                    All types ({heroTypes.reduce((n, t) => n + t.count, 0)})
                  </option>
                  {heroTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label} ({t.count})
                    </option>
                  ))}
                </select>
                <Link
                  href={`${ADMIN}/web/animations`}
                  className="text-brand-deep hover:text-brand text-[0.8125rem] font-semibold"
                >
                  Animated heroes →
                </Link>
              </label>
            )}

            {components.length === 0 ? (
              <div className="card text-ink-soft mt-4 p-8 text-center text-[0.875rem]">
                Nothing matches. Try a shorter word, like form or card.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {groups.map((g) => {
                  const list = (
                    <ul
                      className={cn(
                        "grid gap-4",
                        device === "tablet" && "2xl:grid-cols-2",
                        device === "phone" && "lg:grid-cols-2 2xl:grid-cols-3",
                      )}
                    >
                      {g.items.map((c) => (
                        <li key={c.id} className="min-w-0">
                          <ComponentCard
                            component={c}
                            vars={vars}
                            width={width}
                            open={isOpen(c.id)}
                            onToggle={() => toggle(c.id)}
                            categoryLabel={
                              searching
                                ? categories.find((x) => x.id === c.category)
                                    ?.label
                                : undefined
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  );
                  // One group needs no fold of its own.
                  if (groups.length === 1)
                    return <div key={g.label}>{list}</div>;
                  const open = isOpen(`group:${g.label}`);
                  return (
                    <section
                      key={g.label}
                      className="border-line bg-surface rounded-xl border"
                    >
                      <button
                        type="button"
                        onClick={() => toggle(`group:${g.label}`)}
                        aria-expanded={open}
                        className="hover:bg-mist flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition-colors"
                      >
                        <span className="text-ink text-[0.9375rem] font-semibold">
                          {g.label}
                          <span className="text-ink-faint ml-2 font-mono text-[0.75rem] font-normal">
                            {g.items.length}
                          </span>
                        </span>
                        <ChevronDown
                          className={cn(
                            "text-ink-soft size-4 shrink-0 transition-transform",
                            open && "rotate-180",
                          )}
                          strokeWidth={2}
                          aria-hidden
                        />
                      </button>
                      {open && <div className="px-3 pb-3">{list}</div>}
                    </section>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ComponentCard({
  component,
  vars,
  width,
  open,
  onToggle,
  categoryLabel,
}: {
  component: UiComponent;
  vars: Record<string, string>;
  width: number;
  open: boolean;
  onToggle: () => void;
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
      <div
        className={cn(
          "border-line flex flex-wrap items-start justify-between gap-3 px-4 py-3",
          open && "border-b",
        )}
      >
        <div className="min-w-0 flex-1 cursor-pointer" onClick={onToggle}>
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
            onClick={() => {
              // Code on a closed card opens it to show the code.
              if (!open) {
                onToggle();
                setShowCode(true);
              } else setShowCode(!showCode);
            }}
            aria-expanded={open && showCode}
            className={smallButton}
          >
            <Code className="size-3.5" strokeWidth={2} aria-hidden />
            {open && showCode ? "Hide code" : "Code"}
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
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            title={open ? "Close" : "Open"}
            className={cn(smallButton, "px-1.5")}
          >
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                open && "rotate-180",
              )}
              strokeWidth={2}
            />
            <span className="sr-only">{open ? "Close" : "Open"}</span>
          </button>
        </div>
      </div>

      {open && showCode && (
        <pre className="bg-night border-night-line max-h-80 overflow-auto border-b p-4 font-mono text-[0.75rem] leading-relaxed text-white/85">
          <code>{component.html}</code>
        </pre>
      )}

      {open && (
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
      )}
    </article>
  );
}
