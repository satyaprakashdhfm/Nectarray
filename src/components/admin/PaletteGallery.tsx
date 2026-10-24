"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Plus, Trash2 } from "lucide-react";
import { addPalette, removePalette } from "@/app/admin/(panel)/actions";
import {
  OUR_PALETTES,
  PALETTE_STYLES,
  TRENDING_PALETTES,
  type TrendingPalette,
} from "@/lib/content/coolors-palettes";
import { textOn } from "@/lib/palette";
import { cn } from "@/lib/utils";

type Shown = TrendingPalette & { id?: string };

const HEXES = /([0-9a-f]{6}(?:-[0-9a-f]{6}){1,9})/i;

/**
 * Palettes laid out the way Coolors' trending page shows them, grouped on
 * the left by the words designers use: pastel, earthy, corporate and so
 * on. Click a colour to copy its code.
 */
export function PaletteGallery({
  saved,
}: {
  saved: { id: string; colors: string[] }[];
}) {
  const router = useRouter();
  const [style, setStyle] = useState<string>("all");
  const [link, setLink] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const added: Shown[] = saved.map((p) => ({
    id: p.id,
    name: "Added from Coolors",
    colors: p.colors,
    styles: ["added"],
  }));
  const all: Shown[] = [...OUR_PALETTES, ...TRENDING_PALETTES];

  const groups = [
    { id: "all", label: "All trending", count: all.length },
    { id: "ours", label: "Our picks", count: OUR_PALETTES.length },
    ...PALETTE_STYLES.map((s) => ({
      id: s.id,
      label: s.label,
      count: all.filter((p) => p.styles.includes(s.id)).length,
    })),
    { id: "added", label: "Added by you", count: added.length },
  ];

  const shown: Shown[] =
    style === "all"
      ? all
      : style === "ours"
        ? OUR_PALETTES
        : style === "added"
          ? added
          : all.filter((p) => p.styles.includes(style));
  const blurb = PALETTE_STYLES.find((s) => s.id === style)?.blurb;

  function add() {
    const match = link.match(HEXES);
    if (!match) {
      setError("Paste a Coolors link, e.g. coolors.co/264653-2a9d8f-e9c46a");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await addPalette(match[1]);
      if (result.error) {
        setError(result.error);
        return;
      }
      setLink("");
      setStyle("added");
      router.refresh();
    });
  }

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[14rem_minmax(0,1fr)]">
      <aside className="min-w-0 xl:sticky xl:top-[88px] xl:max-h-[calc(100vh-104px)] xl:self-start xl:overflow-y-auto">
        <ul className="tab-bar xl:flex xl:flex-col xl:gap-0.5 xl:overflow-visible xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0">
          {groups.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => setStyle(g.id)}
                aria-pressed={style === g.id}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-full px-3 py-1.5 text-left text-[0.8125rem] font-semibold whitespace-nowrap transition-colors xl:gap-3 xl:rounded-lg",
                  style === g.id
                    ? "bg-brand-solid text-cta-fg"
                    : "text-ink-soft hover:bg-surface hover:text-ink",
                )}
              >
                {g.label}
                <span className="font-mono text-[0.6875rem] opacity-70">
                  {g.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="text-ink-soft max-w-[60ch] text-[0.875rem]">
            {blurb ??
              (style === "added"
                ? "Palettes pasted from Coolors."
                : "Click a colour to copy its code.")}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              add();
            }}
            className="flex w-full max-w-md gap-2"
          >
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Paste a Coolors palette link"
              className="border-line bg-surface text-ink focus:border-brand min-w-0 flex-1 rounded-lg border px-3 py-1.5 text-[0.8125rem] focus:outline-none"
            />
            <button
              type="submit"
              disabled={pending || !link.trim()}
              className="bg-ink hover:bg-brand-deep text-cta-fg inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors disabled:opacity-40"
            >
              <Plus className="size-3.5" strokeWidth={2} aria-hidden />
              Add
            </button>
          </form>
        </div>
        {error && (
          <p className="text-danger mt-2 text-right text-[0.75rem]">{error}</p>
        )}

        {shown.length === 0 ? (
          <div className="card text-ink-soft mt-5 p-8 text-center text-[0.875rem]">
            Nothing here yet. Paste a palette link from Coolors above.
          </div>
        ) : (
          <ul className="mt-5 grid gap-x-6 gap-y-7 sm:grid-cols-2 2xl:grid-cols-3">
            {shown.map((p, i) => (
              <li key={p.id ?? `${p.name}-${i}`}>
                <PaletteCard
                  palette={p}
                  onRemove={
                    p.id
                      ? () =>
                          startTransition(async () => {
                            await removePalette(p.id!);
                            router.refresh();
                          })
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

function PaletteCard({
  palette,
  onRemove,
}: {
  palette: Shown;
  onRemove?: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const many = palette.colors.length > 6;

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      window.setTimeout(() => setCopied(null), 1400);
    } catch {
      // Clipboard refused; the code is on screen to copy by hand.
    }
  }

  const all = palette.colors.map((c) => `#${c}`).join(", ");

  return (
    <article>
      <div className="border-line flex h-36 overflow-hidden rounded-xl border sm:h-40">
        {palette.colors.map((hex, i) => (
          <button
            key={`${hex}-${i}`}
            type="button"
            onClick={() => copy(`#${hex}`)}
            title={`Copy #${hex}`}
            className="group relative flex flex-1 items-end justify-center pb-3 transition-[flex-grow] duration-200 hover:flex-[1.8]"
            style={{ background: `#${hex}`, color: textOn(`#${hex}`) }}
          >
            <span
              className={cn(
                "font-mono font-semibold uppercase opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
                many ? "text-[0.625rem]" : "text-[0.75rem]",
              )}
            >
              {copied === `#${hex}` ? "Copied" : hex}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2 px-1">
        <h3 className="text-ink min-w-0 truncate text-[0.9375rem]">
          {palette.name}
        </h3>
        <div className="text-ink-soft flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={() => copy(all)}
            title="Copy all codes"
            className="hover:bg-mist hover:text-ink grid size-7 place-items-center rounded-md"
          >
            {copied === all ? (
              <Check className="size-3.5" strokeWidth={2} />
            ) : (
              <Copy className="size-3.5" strokeWidth={2} />
            )}
          </button>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              title="Remove"
              className="hover:bg-mist hover:text-danger grid size-7 place-items-center rounded-md"
            >
              <Trash2 className="size-3.5" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
