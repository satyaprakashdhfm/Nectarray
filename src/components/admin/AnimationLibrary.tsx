"use client";
import { ADMIN } from "@/lib/admin-path";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MotionConfig } from "motion/react";
import {
  Check,
  Code,
  Copy,
  Monitor,
  RotateCcw,
  Smartphone,
  Tablet,
  type LucideIcon,
} from "lucide-react";
import { HEROES } from "@/components/admin/animations";
import type { AnimationEntry } from "@/lib/content/animations";
import { ROLES, paletteCss, paletteVars, usePalette } from "@/lib/palette";
import { useNarrow } from "@/lib/use-narrow";
import { cn } from "@/lib/utils";

type Device = "desktop" | "tablet" | "phone";

const DEVICES: {
  id: Device;
  label: string;
  /** null: as wide as the column allows. */
  width: number | null;
  icon: LucideIcon;
}[] = [
  { id: "desktop", label: "Laptop", width: null, icon: Monitor },
  { id: "tablet", label: "Tablet", width: 768, icon: Tablet },
  { id: "phone", label: "Phone", width: 390, icon: Smartphone },
];

const smallButton =
  "border-line bg-surface text-ink hover:border-brand hover:text-brand-deep inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[0.75rem] font-semibold transition-colors";

export type AnimationCategoryCount = {
  id: string;
  label: string;
  count: number;
};

export type AnimationWithSource = AnimationEntry & { source: string };

/**
 * The Animations tab: animated heroes by kind of website, each running live
 * in the chosen palette at laptop, tablet or phone width, with its source to
 * copy.
 *
 * Unlike Elements, the previews are not in iframes: they are real React
 * components and need their scripts. They still get the honest phone layout
 * because each hero lays itself out with container queries, so narrowing the
 * box it sits in is enough. The palette arrives as CSS variables on that box.
 *
 * Motion is told to respect the reader's reduced-motion setting, which is
 * also what every one of these does when copied into a site wrapped the same
 * way.
 */
export function AnimationLibrary({
  categories,
  category,
  blurb,
  animations,
}: {
  categories: AnimationCategoryCount[];
  category: string;
  blurb: string;
  animations: AnimationWithSource[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const palette = usePalette();
  const vars = useMemo(() => paletteVars(palette), [palette]);
  const [chosen, setDevice] = useState<Device | null>(null);
  const narrow = useNarrow();
  const device: Device = chosen ?? (narrow ? "phone" : "desktop");
  const width = DEVICES.find((d) => d.id === device)!.width;
  const [copiedCss, setCopiedCss] = useState(false);

  function pick(id: string) {
    startTransition(() =>
      router.replace(`${pathname}?category=${id}`, { scroll: false }),
    );
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
    <div className="mt-6 grid gap-6 xl:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="min-w-0 xl:sticky xl:top-[88px] xl:self-start">
        <ul className="tab-bar xl:flex xl:flex-col xl:gap-0.5 xl:overflow-visible xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0">
          {categories.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => pick(c.id)}
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

        <div className="card mt-4 hidden p-4 xl:block">
          <p className="eyebrow">To use one</p>
          <ol className="text-ink-soft mt-3 list-decimal space-y-2 pl-4 text-[0.8125rem] leading-relaxed">
            <li>
              Install what the card lists: Motion for all of them, and three.js
              as well for Cinematic 3D.
            </li>
            <li>Copy the colours as CSS into the site&rsquo;s stylesheet.</li>
            <li>Copy the component into the project and render it.</li>
          </ol>
        </div>
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

        <p className="text-ink-soft mt-4 text-[0.875rem]">{blurb}</p>

        <MotionConfig reducedMotion="user">
          <ul className="mt-4 space-y-6">
            {animations.map((a) => (
              <li key={a.id} className="min-w-0">
                <AnimationCard animation={a} vars={vars} width={width} />
              </li>
            ))}
          </ul>
        </MotionConfig>
      </div>
    </div>
  );
}

function AnimationCard({
  animation,
  vars,
  width,
}: {
  animation: AnimationWithSource;
  vars: Record<string, string>;
  width: number | null;
}) {
  const Hero = HEROES[animation.id];
  const palette = Object.values(vars).join();
  // Bumped to remount the hero, which plays its entrance again.
  const [run, setRun] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(animation.source);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard refused; Code is there to select by hand.
    }
  }

  return (
    // overflow-clip rather than hidden here and on the frame below: hidden
    // makes a scroll container, which stops the scroll stories' sticky
    // panels from pinning to the window.
    <article className="card overflow-clip p-0">
      <div className="border-line flex flex-wrap items-start justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-ink text-[0.9375rem] font-semibold">
            {animation.name}
          </h3>
          <p className="text-ink-soft max-w-3xl text-[0.8125rem]">
            {animation.note}
          </p>
          <code className="bg-mist text-ink-soft mt-1.5 inline-block rounded px-1.5 py-0.5 font-mono text-[0.6875rem]">
            {animation.install ?? "npm i motion"}
          </code>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setRun(run + 1)}
            className={smallButton}
          >
            <RotateCcw className="size-3.5" strokeWidth={2} aria-hidden />
            Replay
          </button>
          <button
            type="button"
            onClick={() => setShowCode(!showCode)}
            aria-expanded={showCode}
            className={smallButton}
          >
            <Code className="size-3.5" strokeWidth={2} aria-hidden />
            {showCode ? "Hide code" : "Code"}
          </button>
          <button type="button" onClick={copy} className={smallButton}>
            {copied ? (
              <Check className="size-3.5" strokeWidth={2} aria-hidden />
            ) : (
              <Copy className="size-3.5" strokeWidth={2} aria-hidden />
            )}
            {copied ? "Copied" : "Copy TSX"}
          </button>
        </div>
      </div>

      {showCode && (
        <pre className="bg-night border-night-line max-h-96 overflow-auto border-b p-4 font-mono text-[0.75rem] leading-relaxed text-white/85">
          <code>{animation.source}</code>
        </pre>
      )}

      <div className="bg-mist p-2 sm:p-3">
        <div
          className="mx-auto max-w-full overflow-clip rounded-md bg-white"
          style={{ ...vars, width: width ?? "100%" } as React.CSSProperties}
        >
          {Hero ? (
            // Keyed on the palette too: the 3D heroes read their colours
            // once, on mount, so a new palette remounts them.
            <Hero key={`${run}-${palette}`} />
          ) : (
            <p className="text-ink-soft p-6 text-[0.875rem]">
              No component is registered for {animation.id}.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
