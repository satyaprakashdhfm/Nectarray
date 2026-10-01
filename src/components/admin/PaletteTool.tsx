"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Shuffle } from "lucide-react";
import { PreviewFrame } from "@/components/admin/PreviewFrame";
import { SAMPLE_SITE } from "@/lib/content/sample-site";
import {
  PRESETS,
  ROLES,
  SHADES,
  contrast,
  isHex,
  normalHex,
  paletteCss,
  paletteVars,
  setPalette,
  shadesOf,
  usePalette,
  type Palette,
  type Role,
} from "@/lib/palette";
import { useNarrow } from "@/lib/use-narrow";
import { cn } from "@/lib/utils";

const smallButton =
  "border-line bg-surface text-ink hover:border-brand hover:text-brand-deep inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors";

/** Every order the three colours can take: which one leads, which supports. */
function orders(p: Palette): Palette[] {
  const c = [p.primary, p.secondary, p.tertiary];
  const idx = [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0],
  ];
  return idx.map(([a, b, d]) => ({
    primary: c[a],
    secondary: c[b],
    tertiary: c[d],
  }));
}

const same = (a: Palette, b: Palette) =>
  a.primary === b.primary &&
  a.secondary === b.secondary &&
  a.tertiary === b.tertiary;

/**
 * Pick three colours and see them on a page.
 *
 * Left, the three colours and the light, medium and dark shade of each.
 * Right, a sample site painted with them. Below, the same three colours in
 * every order, and a set of ready palettes, each as a small site to click.
 */
export function PaletteTool() {
  const palette = usePalette();
  const vars = useMemo(() => paletteVars(palette), [palette]);
  const [copied, setCopied] = useState(false);
  // On a phone the big preview shows the phone layout; a laptop page
  // shrunk to a third of its size is too small to judge colours on.
  const narrow = useNarrow();

  const rotate = () =>
    setPalette({
      primary: palette.secondary,
      secondary: palette.tertiary,
      tertiary: palette.primary,
    });

  async function copyCss() {
    try {
      await navigator.clipboard.writeText(paletteCss(palette));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard refused; the values are on screen to copy by hand.
    }
  }

  return (
    <>
      <div className="mt-6 grid gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <div className="min-w-0 space-y-4">
          {ROLES.map(({ role, label }) => (
            <ColourRow
              key={role}
              role={role}
              label={label}
              value={palette[role]}
              onChange={(hex) => setPalette({ ...palette, [role]: hex })}
            />
          ))}

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={rotate} className={smallButton}>
              <Shuffle className="size-3.5" strokeWidth={2} aria-hidden />
              Swap the order
            </button>
            <button type="button" onClick={copyCss} className={smallButton}>
              {copied ? (
                <Check className="size-3.5" strokeWidth={2} aria-hidden />
              ) : (
                <Copy className="size-3.5" strokeWidth={2} aria-hidden />
              )}
              {copied ? "Copied" : "Copy as CSS"}
            </button>
          </div>
          <p className="text-ink-faint text-[0.75rem] leading-relaxed">
            Kept in this browser and used by the Elements tab, so every
            component there shows in these colours.
          </p>
        </div>

        <div className="card min-w-0 overflow-hidden p-0">
          <PreviewFrame
            html={SAMPLE_SITE}
            vars={vars}
            title="Sample site in the chosen colours"
            width={narrow ? 390 : 1200}
            fit
            minHeight={600}
          />
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-ink text-[1.125rem] font-semibold">
          The same colours in different jobs
        </h2>
        <p className="text-ink-soft mt-1 max-w-[65ch] text-[0.8125rem] leading-relaxed">
          Which colour leads changes the whole feel. Click the order you like.
        </p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {orders(palette).map((p, i) => (
            <li key={i}>
              <MiniSite
                palette={p}
                active={same(p, palette)}
                caption={
                  <span className="flex flex-wrap gap-x-3 gap-y-1">
                    {ROLES.map(({ role, label }) => (
                      <span
                        key={role}
                        className="inline-flex items-center gap-1.5"
                      >
                        <span
                          className="ring-line size-3 rounded-full ring-1"
                          style={{ background: p[role] }}
                        />
                        {label}
                      </span>
                    ))}
                  </span>
                }
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-ink text-[1.125rem] font-semibold">
          Ready palettes
        </h2>
        <p className="text-ink-soft mt-1 max-w-[65ch] text-[0.8125rem] leading-relaxed">
          A quick start. Pick one, then change any colour above.
        </p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {PRESETS.map((preset) => (
            <li key={preset.name}>
              <MiniSite
                palette={preset.palette}
                active={same(preset.palette, palette)}
                caption={
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-ink font-semibold">
                      {preset.name}
                    </span>
                    <span className="flex -space-x-1">
                      {ROLES.map(({ role }) => (
                        <span
                          key={role}
                          className="ring-surface size-4 rounded-full ring-2"
                          style={{ background: preset.palette[role] }}
                        />
                      ))}
                    </span>
                  </span>
                }
              />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function ColourRow({
  role,
  label,
  value,
  onChange,
}: {
  role: Role;
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  // What is typed, which may be half a colour; the palette only takes whole ones.
  const [typed, setTyped] = useState<string | null>(null);
  const shades = shadesOf(value);

  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <label className="relative size-10 shrink-0 cursor-pointer overflow-hidden rounded-lg">
          <span className="sr-only">{label} colour</span>
          <span className="absolute inset-0" style={{ background: value }} />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(normalHex(e.target.value))}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </label>
        <div className="min-w-0 flex-1">
          <p className="text-ink text-[0.9375rem] font-semibold">{label}</p>
          <input
            aria-label={`${label} colour code`}
            value={typed ?? value}
            onChange={(e) => {
              setTyped(e.target.value);
              if (isHex(e.target.value)) onChange(normalHex(e.target.value));
            }}
            onBlur={() => setTyped(null)}
            spellCheck={false}
            className="text-ink-soft focus:border-brand border-line w-28 rounded-md border bg-transparent px-1.5 py-0.5 font-mono text-[0.8125rem] focus:outline-none"
          />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2" data-role={role}>
        {SHADES.map(({ key, label: shade, use }) => {
          const hex = shades[key];
          const white = contrast(hex, "#ffffff");
          return (
            <div key={key} className="min-w-0">
              <div
                className="ring-line flex h-12 items-end rounded-md p-1.5 ring-1 ring-inset"
                style={{ background: hex }}
                title={use}
              >
                <span
                  className="text-[0.6875rem] font-semibold"
                  style={{ color: white >= 4.5 ? "#ffffff" : "#111418" }}
                >
                  Aa
                </span>
              </div>
              <p className="text-ink mt-1 text-[0.75rem] font-semibold">
                {shade}
              </p>
              <p className="text-ink-faint font-mono text-[0.6875rem]">{hex}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiniSite({
  palette,
  active,
  caption,
}: {
  palette: Palette;
  active: boolean;
  caption: React.ReactNode;
}) {
  const vars = useMemo(() => paletteVars(palette), [palette]);
  return (
    <button
      type="button"
      onClick={() => setPalette(palette)}
      aria-pressed={active}
      className={cn(
        "card group block w-full overflow-hidden p-0 text-left transition-shadow",
        active ? "ring-brand ring-2" : "hover:ring-line hover:ring-2",
      )}
    >
      <div className="max-h-56 overflow-hidden" aria-hidden>
        <PreviewFrame
          html={SAMPLE_SITE}
          vars={vars}
          title="Sample site"
          width={1200}
          fit
          minHeight={600}
        />
      </div>
      <div className="border-line text-ink-soft border-t px-3 py-2.5 text-[0.75rem]">
        {caption}
      </div>
    </button>
  );
}
