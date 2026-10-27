import { Cabin, Hanken_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import type {
  ColourFamily,
  Face,
  ProjectUi as Ui,
} from "@/lib/content/devops-ui";

/*
 * Other projects' faces, loaded only so their samples are drawn in the real
 * font. Not preloaded: the browser fetches each one only on the DevOps page,
 * and only when that project's tab is open.
 */
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  preload: false,
});
const cabin = Cabin({ subsets: ["latin"], display: "swap", preload: false });
const inter = Inter({ subsets: ["latin"], display: "swap", preload: false });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const FAMILY: Record<Face, string> = {
  schibsted: "var(--font-sans)",
  "source-serif": "var(--font-serif)",
  "system-mono": "var(--font-mono)",
  hanken: hanken.style.fontFamily,
  cabin: cabin.style.fontFamily,
  script: "'Segoe Script', 'Bradley Hand', 'Snell Roundhand', cursive",
  inter: inter.style.fontFamily,
  "jetbrains-mono": jetbrains.style.fontFamily,
};

const SAMPLE = "The quick brown fox jumps over the lazy dog";

/**
 * A project's UI / UX: its three primary colours and their grades, the
 * supporting colours, every font with a sample drawn in it, and the type
 * sizes in use, each shown at its real size.
 */
export function ProjectUi({ ui }: { ui: Ui }) {
  return (
    <section id="ui" className="@container mt-10 min-w-0 scroll-mt-32">
      <h3 className="text-ink flex items-center gap-2.5 text-[1rem] font-semibold">
        <span className="bg-brand h-4 w-1 rounded-full" aria-hidden />
        UI / UX
      </h3>
      <p className="text-ink-soft mt-3 max-w-3xl text-[0.875rem] leading-relaxed">
        {ui.summary}
      </p>
      <p className="text-ink-faint mt-1.5 text-[0.75rem]">
        Tokens in <span className="font-mono">{ui.tokens}</span>
      </p>

      <h4 className="eyebrow mt-6">Primary colours</h4>
      <div className="mt-2.5 grid gap-3 @4xl:grid-cols-3">
        {ui.primaries.map((family) => (
          <Family key={family.name} family={family} />
        ))}
      </div>

      <h4 className="eyebrow mt-6">Supporting colours</h4>
      <div className="mt-2.5 grid gap-3 @3xl:grid-cols-2">
        {ui.supporting.map((family) => (
          <Family key={family.name} family={family} />
        ))}
      </div>

      <h4 className="eyebrow mt-8">Fonts</h4>
      <ul className="card divide-line mt-2.5 divide-y overflow-hidden">
        {ui.fonts.map((font) => (
          <li
            key={font.name}
            className="grid gap-4 p-4 sm:p-5 @2xl:grid-cols-[17rem_minmax(0,1fr)]"
          >
            <div className="min-w-0">
              <p className="text-ink text-[0.9375rem] font-semibold">
                {font.name}
              </p>
              <p className="text-ink-soft mt-1 text-[0.8125rem] leading-relaxed">
                {font.role}
              </p>
              <p className="text-ink-faint mt-1.5 text-[0.75rem]">
                {font.source} · {font.weights}
              </p>
              {font.note && (
                <p className="bg-amber-wash text-ink mt-2 rounded-lg px-2.5 py-1.5 text-[0.75rem] leading-relaxed">
                  {font.note}
                </p>
              )}
            </div>
            <div
              className="bg-canvas border-line min-w-0 overflow-hidden rounded-xl border p-4"
              style={{ fontFamily: FAMILY[font.face] }}
            >
              <p className="text-ink text-[2.75rem] leading-none">
                Aa <span className="font-bold">Bb</span> 123
              </p>
              <p className="text-ink mt-3 text-[1.125rem] leading-snug break-words">
                {SAMPLE}
              </p>
              <p className="text-ink-soft mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.9375rem]">
                <span className="font-normal">Regular 400</span>
                <span className="font-medium">Medium 500</span>
                <span className="font-semibold">Semibold 600</span>
                <span className="font-bold">Bold 700</span>
              </p>
            </div>
          </li>
        ))}
      </ul>

      <h4 className="eyebrow mt-8">Type sizes</h4>
      <ul className="card divide-line mt-2.5 divide-y overflow-hidden">
        {ui.scale.map((step) => (
          <li
            key={step.name}
            className="grid items-baseline gap-x-5 gap-y-1 px-4 py-3 sm:px-5 @2xl:grid-cols-[17rem_minmax(0,1fr)]"
          >
            <p className="text-ink-faint text-[0.75rem]">
              <span className="text-ink font-semibold">{step.name}</span>
              {" · "}
              <span className="font-mono">
                {step.rem}rem / {Math.round(step.rem * 16 * 10) / 10}px ·{" "}
                {step.weight}
              </span>
              <span className="mt-0.5 block">{step.use}</span>
            </p>
            <p
              className="text-ink truncate leading-tight"
              style={{
                fontFamily: FAMILY[ui.scaleFace],
                fontSize: `${step.rem}rem`,
                fontWeight: step.weight,
              }}
            >
              {SAMPLE}
            </p>
          </li>
        ))}
      </ul>

      <ul className="text-ink-soft mt-5 max-w-3xl list-disc space-y-1.5 pl-5 text-[0.8125rem] leading-relaxed">
        {ui.rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
    </section>
  );
}

/** One colour family: its grade as a bar, then every shade with its hex. */
function Family({ family }: { family: ColourFamily }) {
  const hexes = family.swatches.map((s) => s.hex);
  return (
    <div className="card min-w-0 p-4">
      <p className="text-ink text-[0.875rem] font-semibold">{family.name}</p>
      <p className="text-ink-soft mt-0.5 text-[0.75rem] leading-snug">
        {family.role}
      </p>
      <div
        className="mt-3 h-2.5 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)]"
        style={{ background: `linear-gradient(to right, ${hexes.join(", ")})` }}
        aria-hidden
      />
      <ul className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(4.25rem,1fr))] gap-2">
        {family.swatches.map((s) => (
          <li key={s.name} className="min-w-0">
            <span
              className="block h-12 rounded-lg shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)]"
              style={{ background: s.hex }}
              aria-hidden
            />
            <span className="text-ink mt-1 block truncate text-[0.6875rem] font-semibold">
              {s.name}
            </span>
            <span className="text-ink-faint block font-mono text-[0.6875rem] uppercase">
              {s.hex}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
