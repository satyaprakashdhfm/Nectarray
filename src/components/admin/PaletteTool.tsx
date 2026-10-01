"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import {
  Check,
  Copy,
  Monitor,
  Shuffle,
  Smartphone,
  X,
  type LucideIcon,
} from "lucide-react";
import { PreviewFrame } from "@/components/admin/PreviewFrame";
import { SAMPLE_SITE } from "@/lib/content/sample-site";
import {
  PRESETS,
  ROLES,
  SHADES,
  normalHex,
  paletteCss,
  paletteVars,
  setPalette,
  shadesOf,
  textOn,
  usePalette,
  type Palette,
  type Role,
} from "@/lib/palette";
import { useNarrow } from "@/lib/use-narrow";
import { cn } from "@/lib/utils";

const smallButton =
  "border-line bg-surface text-ink hover:border-brand hover:text-brand-deep inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[0.8125rem] font-semibold transition-colors";

/** Colours to start from in the picker, a few steps around the wheel. */
const SUGGESTIONS = [
  "#1fa5de",
  "#2546d6",
  "#0f6e8c",
  "#3c5a73",
  "#1d2b3a",
  "#6b2d5c",
  "#1f6f4a",
  "#3fb68b",
  "#8cc63f",
  "#c9a227",
  "#f5a44a",
  "#ffd166",
  "#c4532d",
  "#f25f5c",
  "#e8436d",
  "#2ec4b6",
  "#7c5cff",
  "#272d36",
];

type Device = "desktop" | "phone";
const DEVICES: {
  id: Device;
  label: string;
  width: number;
  icon: LucideIcon;
}[] = [
  { id: "desktop", label: "Laptop", width: 1280, icon: Monitor },
  { id: "phone", label: "Phone", width: 390, icon: Smartphone },
];

const same = (a: Palette, b: Palette) =>
  a.primary === b.primary &&
  a.secondary === b.secondary &&
  a.tertiary === b.tertiary;

/**
 * Pick three colours and see them on a whole website.
 *
 * Left: a button for each colour that opens a colour picker, the light,
 * medium and dark shade it makes, and ready palettes. Right: one sample
 * website with almost every kind of component, repainted as you pick.
 */
export function PaletteTool() {
  const palette = usePalette();
  const vars = useMemo(() => paletteVars(palette), [palette]);
  const [open, setOpen] = useState<Role | null>(null);
  const [copied, setCopied] = useState(false);
  const narrow = useNarrow();
  const [chosen, setDevice] = useState<Device | null>(null);
  const device: Device = chosen ?? (narrow ? "phone" : "desktop");

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
      // Clipboard refused; the codes are on screen to copy by hand.
    }
  }

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
      <aside className="min-w-0 space-y-4 xl:sticky xl:top-[88px] xl:max-h-[calc(100vh-104px)] xl:self-start xl:overflow-y-auto xl:pb-2">
        <div className="card p-4">
          <p className="text-ink text-[0.9375rem] font-semibold">
            Your three colours
          </p>
          <p className="text-ink-faint mt-0.5 text-[0.75rem]">
            Click a colour to change it.
          </p>
          <div className="mt-4 space-y-3">
            {ROLES.map(({ role, label }) => (
              <ColourButton
                key={role}
                label={label}
                value={palette[role]}
                open={open === role}
                onOpen={() => setOpen(open === role ? null : role)}
                onClose={() => setOpen(null)}
                onChange={(hex) => setPalette({ ...palette, [role]: hex })}
              />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" onClick={rotate} className={smallButton}>
              <Shuffle className="size-3.5" strokeWidth={2} aria-hidden />
              Swap order
            </button>
            <button type="button" onClick={copyCss} className={smallButton}>
              {copied ? (
                <Check className="size-3.5" strokeWidth={2} aria-hidden />
              ) : (
                <Copy className="size-3.5" strokeWidth={2} aria-hidden />
              )}
              {copied ? "Copied" : "Copy CSS"}
            </button>
          </div>
        </div>

        <div className="card p-4">
          <p className="text-ink text-[0.9375rem] font-semibold">
            Ready palettes
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {PRESETS.map((preset) => {
              const active = same(preset.palette, palette);
              return (
                <li key={preset.name}>
                  <button
                    type="button"
                    onClick={() => setPalette(preset.palette)}
                    aria-pressed={active}
                    className={cn(
                      "w-full overflow-hidden rounded-lg border text-left transition-colors",
                      active
                        ? "border-brand ring-brand ring-1"
                        : "border-line hover:border-ink-faint",
                    )}
                  >
                    <span className="flex h-8">
                      {ROLES.map(({ role }) => (
                        <span
                          key={role}
                          className="flex-1"
                          style={{ background: preset.palette[role] }}
                        />
                      ))}
                    </span>
                    <span className="text-ink block truncate px-2 py-1.5 text-[0.75rem] font-semibold">
                      {preset.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-ink-soft text-[0.8125rem]">
            A sample website with most kinds of component, in your colours.
          </p>
          <div
            role="radiogroup"
            aria-label="Screen width"
            className="bg-surface border-line inline-flex rounded-lg border p-0.5"
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
                    ? "bg-mist text-ink"
                    : "text-ink-faint hover:text-ink",
                )}
              >
                <d.icon className="size-3.5" strokeWidth={2} aria-hidden />
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <div className="card bg-mist overflow-hidden p-0">
          <PreviewFrame
            html={SAMPLE_SITE}
            vars={vars}
            title="Sample website in the chosen colours"
            width={DEVICES.find((d) => d.id === device)!.width}
            fit
            interactive
            minHeight={800}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * One colour: a big swatch button with its three shades, and a picker that
 * opens right under it, in the flow of the panel so nothing clips it. It
 * closes on Done, on Escape, or on a click anywhere outside it.
 */
function ColourButton({
  label,
  value,
  open,
  onOpen,
  onClose,
  onChange,
}: {
  label: string;
  value: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onChange: (hex: string) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const shades = shadesOf(value);

  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) onClose();
    };
    const escape = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open, onClose]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={onOpen}
        aria-expanded={open}
        aria-label={`${label} colour, ${value}. Change it`}
        className={cn(
          "border-line bg-surface hover:border-ink-faint flex w-full items-center gap-3 rounded-xl border p-2 text-left transition-colors",
          open && "border-brand ring-brand ring-1",
        )}
      >
        <span
          className="grid size-12 shrink-0 place-items-center rounded-lg text-[0.75rem] font-bold"
          style={{ background: value, color: textOn(value) }}
        >
          Aa
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-ink block text-[0.875rem] font-semibold">
            {label}
          </span>
          <span className="text-ink-faint block font-mono text-[0.75rem]">
            {value}
          </span>
        </span>
        <span className="flex shrink-0 overflow-hidden rounded-md">
          {SHADES.map(({ key, label: shade }) => (
            <span
              key={key}
              title={`${shade} ${shades[key]}`}
              className="h-12 w-5"
              style={{ background: shades[key] }}
            />
          ))}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={`Pick the ${label.toLowerCase()} colour`}
          className="border-line bg-surface mt-2 rounded-xl border p-3 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <p className="text-ink text-[0.8125rem] font-semibold">{label}</p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-ink-faint hover:text-ink hover:bg-mist grid size-7 place-items-center rounded-md"
            >
              <X className="size-4" strokeWidth={2} />
            </button>
          </div>
          <HexColorPicker
            color={value}
            onChange={(hex) => onChange(normalHex(hex))}
            style={{ width: "100%", height: 180, marginTop: 8 }}
          />
          <div className="mt-3 flex items-center gap-2">
            <span
              className="ring-line size-9 shrink-0 rounded-lg ring-1 ring-inset"
              style={{ background: value }}
            />
            <label className="flex-1">
              <span className="sr-only">Colour code</span>
              <HexColorInput
                color={value}
                onChange={(hex) => onChange(normalHex(hex))}
                prefixed
                className="border-line bg-surface text-ink focus:border-brand w-full rounded-lg border px-3 py-2 font-mono text-[0.875rem] uppercase focus:outline-none"
              />
            </label>
          </div>
          <div className="mt-3 grid grid-cols-9 gap-1.5">
            {SUGGESTIONS.map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => onChange(hex)}
                aria-label={hex}
                className={cn(
                  "aspect-square rounded-md ring-1 ring-black/10 transition-transform ring-inset hover:scale-110",
                  hex === value && "ring-ink ring-2",
                )}
                style={{ background: hex }}
              />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {SHADES.map(({ key, label: shade }) => (
              <div key={key} className="min-w-0">
                <div
                  className="ring-line h-8 rounded-md ring-1 ring-inset"
                  style={{ background: shades[key] }}
                />
                <p className="text-ink-faint mt-1 truncate text-[0.6875rem]">
                  {shade} <span className="font-mono">{shades[key]}</span>
                </p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="bg-ink hover:bg-brand-deep text-cta-fg mt-3 w-full rounded-lg py-2 text-[0.8125rem] font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
