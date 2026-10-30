"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  FIELDS,
  OMNI_ARTICLES,
  type Field,
  type OmniArticle,
} from "@/lib/content/omniproof";

/**
 * Below the map: one row per field. The field's name and arrows on top, its
 * one-line pitch and subfields on the left, and its pieces in a row that
 * scrolls sideways and snaps card by card.
 */
export function FieldRows({ dates }: { dates: Record<string, string> }) {
  return (
    <div className="divide-line divide-y">
      {FIELDS.map((f) => (
        <Row
          key={f.id}
          field={f}
          articles={OMNI_ARTICLES.filter((a) => a.field === f.id)}
          dates={dates}
        />
      ))}
    </div>
  );
}

function Row({
  field,
  articles,
  dates,
}: {
  field: Field;
  articles: OmniArticle[];
  dates: Record<string, string>;
}) {
  const track = useRef<HTMLDivElement>(null);
  const nudge = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    el.scrollBy({
      left: dir * ((card?.offsetWidth ?? 320) + 20),
      behavior: "smooth",
    });
  };

  return (
    <section
      id={field.id}
      aria-labelledby={`${field.id}-title`}
      className="scroll-mt-28 py-12"
    >
      <div className="flex items-start justify-between gap-4">
        <h2
          id={`${field.id}-title`}
          className="display text-ink flex items-center gap-3 text-[1.75rem] leading-tight sm:text-[2.25rem]"
        >
          <span
            className="size-3 shrink-0 rounded-full"
            style={{ background: field.color }}
            aria-hidden
          />
          {field.label}
        </h2>
        {articles.length > 1 && (
          <div className="flex gap-2">
            {(
              [
                [-1, ChevronLeft, "Previous"],
                [1, ChevronRight, "Next"],
              ] as const
            ).map(([dir, Icon, label]) => (
              <button
                key={label}
                type="button"
                onClick={() => nudge(dir)}
                aria-label={`${label} ${field.label} piece`}
                className="bg-ink text-cta-fg hover:bg-brand-deep grid size-10 place-items-center rounded-lg transition-colors"
              >
                <Icon className="size-5" aria-hidden />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,20rem)_1fr] 2xl:grid-cols-[minmax(0,24rem)_1fr]">
        <div>
          <p className="text-ink-soft text-[1.0625rem] leading-relaxed">
            {field.blurb}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {field.subfields.map((s) => (
              <li
                key={s.id}
                className="border-line text-ink-soft rounded-full border px-3 py-1 text-[0.8125rem]"
              >
                {s.label}
              </li>
            ))}
          </ul>
        </div>

        <div
          ref={track}
          className="-mx-[var(--gutter,1.25rem)] flex snap-x snap-mandatory [scrollbar-width:none] gap-5 overflow-x-auto scroll-smooth px-[var(--gutter,1.25rem)] pb-2 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {articles.length === 0 && (
            <div className="border-line bg-mist text-ink-faint grid w-72 shrink-0 snap-start place-items-center rounded-2xl border border-dashed p-8 text-center text-[0.9375rem] sm:w-80">
              The first {field.label.toLowerCase()} piece is in the works.
            </div>
          )}
          {articles.map((a) => {
            const sub = field.subfields.find((s) => s.id === a.subfield);
            return (
              <Link
                key={a.slug}
                href={`/omniproof/${a.slug}`}
                data-card
                className="group border-line bg-surface hover:border-brand w-72 shrink-0 snap-start overflow-hidden rounded-2xl border shadow-sm transition-colors sm:w-80 2xl:w-96"
              >
                {a.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element -- SVG illustration
                  <img
                    src={a.cover.src}
                    alt=""
                    width={1200}
                    height={630}
                    loading="lazy"
                    className="bg-mist aspect-video w-full object-cover"
                  />
                ) : (
                  <Placeholder field={field} label={a.short} />
                )}
                <div className="p-5">
                  <p className="text-ink-soft text-[0.8125rem] font-semibold">
                    {sub?.label ?? field.label} | {dates[a.slug]}
                  </p>
                  <h3 className="text-ink group-hover:text-brand-deep mt-2 text-[1.0625rem] leading-snug font-semibold transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-ink-soft mt-2 line-clamp-3 text-[0.875rem] leading-relaxed">
                    {a.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** A piece without cover art gets its field's colour and its short name. */
function Placeholder({ field, label }: { field: Field; label: string }) {
  return (
    <div
      className="relative grid aspect-video w-full place-items-center overflow-hidden"
      style={{
        background: `radial-gradient(circle at 30% 30%, ${field.color}55, transparent 60%), radial-gradient(circle at 80% 80%, ${field.color}33, transparent 55%), var(--color-night)`,
      }}
      aria-hidden
    >
      <svg
        viewBox="0 0 320 180"
        className="absolute inset-0 size-full opacity-60"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M 20 90 C 120 90, 160 ${30 + i * 30}, 300 ${30 + i * 30}`}
            fill="none"
            stroke={field.color}
            strokeWidth={1.5}
            strokeOpacity={0.35 + i * 0.1}
          />
        ))}
        <circle cx={20} cy={90} r={6} fill={field.color} />
      </svg>
      <span className="relative px-6 text-center text-[1.125rem] font-semibold text-white">
        {label}
      </span>
    </div>
  );
}
