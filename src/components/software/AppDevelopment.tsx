import Link from "next/link";
import { ArrowRight, Check, MapPin, Star } from "lucide-react";
import { headGap, sectionPad, wideShell } from "@/components/software/layout";
import { Reveal } from "@/components/ui/Reveal";
import { software } from "@/lib/content";

const { app } = software;

/**
 * App development, in its own dark band straight after the hero.
 *
 * Apps were the fifth tab of the build showcase, which meant most readers
 * never got to them. A band in the night colour breaks the page's light
 * rhythm on purpose, so this is the section the eye stops on, and the two
 * phones beside it show the thing rather than describe it.
 *
 * The phones are plain markup, not screenshots: they take the theme colours
 * and stay sharp at any size.
 */
export function AppDevelopment() {
  return (
    <section
      id="apps"
      className={`bg-night relative scroll-mt-24 overflow-hidden text-white ${sectionPad}`}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="bg-brand/20 absolute -top-32 right-0 size-[32rem] rounded-full blur-[140px]" />
        <div className="bg-leaf/10 absolute bottom-0 -left-24 size-[26rem] rounded-full blur-[140px]" />
      </div>

      <div className={`relative ${wideShell}`}>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <p className="text-brand flex items-center gap-2.5 text-[0.75rem] font-semibold tracking-[0.16em] uppercase">
                <span className="bg-brand h-px w-6" aria-hidden />
                {app.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display mt-5 text-[2rem] leading-[1.05] sm:text-[2.6rem] lg:text-[3rem]">
                {app.title[0]}{" "}
                <span className="text-brand">{app.title[1]}</span>
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-white/70">
                {app.lede}
              </p>
            </Reveal>

            {/* Three ways to build it, as rows rather than cards: they are
              one decision with three answers, not three products. */}
            <ul
              className={`border-night-line divide-night-line divide-y border-y ${headGap}`}
            >
              {app.ways.map((way, i) => (
                <Reveal as="li" key={way.name} delay={i * 80}>
                  <div className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
                    <div>
                      <p className="text-[0.9375rem] font-semibold">
                        {way.name}
                      </p>
                      <p className="text-brand mt-0.5 font-mono text-[0.75rem]">
                        {way.tools}
                      </p>
                    </div>
                    <p className="text-[0.875rem] leading-relaxed text-white/65">
                      {way.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={150}>
            <Phones />
          </Reveal>
        </div>

        <div className="border-night-line bg-night-soft/60 mt-12 grid gap-8 rounded-[1.5rem] border p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[0.75rem] font-semibold tracking-[0.14em] text-white/50 uppercase">
              Every app includes
            </p>
            <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {app.included.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-[0.875rem] leading-snug text-white/80"
                >
                  <Check
                    className="text-leaf mt-0.5 size-4 shrink-0"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Link
            href={app.cta.href}
            className="bg-brand text-night group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[0.9375rem] font-semibold whitespace-nowrap transition-colors hover:bg-white"
          >
            {app.cta.label}
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2.25}
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * Two phones, slightly overlapped: a delivery tracker in front, a booking
 * screen behind. Decorative, so hidden from screen readers.
 */
function Phones() {
  return (
    <div
      className="relative mx-auto flex h-[30rem] max-w-md items-center justify-center sm:h-[34rem]"
      aria-hidden
    >
      {/* Behind: booking. */}
      <div className="absolute top-2 left-[6%] w-[46%] -rotate-6 sm:left-[10%]">
        <Frame>
          <div className="px-3.5 pt-3">
            <p className="text-[0.625rem] text-zinc-400">Good evening</p>
            <p className="text-[0.875rem] font-semibold text-zinc-900">
              Book a slot
            </p>
            <div className="mt-3 grid grid-cols-5 gap-1">
              {["M", "T", "W", "T", "F"].map((d, i) => (
                <span
                  key={i}
                  className={`rounded-md py-1.5 text-center text-[0.625rem] font-semibold ${
                    i === 2
                      ? "bg-brand text-white"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {d}
                </span>
              ))}
            </div>
            <div className="mt-3 space-y-1.5">
              {["10:00", "11:30", "4:00", "6:30"].map((t, i) => (
                <div
                  key={t}
                  className={`flex items-center justify-between rounded-lg border px-2.5 py-2 text-[0.6875rem] ${
                    i === 1
                      ? "border-brand bg-brand-wash text-zinc-900"
                      : "border-zinc-200 text-zinc-500"
                  }`}
                >
                  {t}
                  <span className="text-[0.5625rem]">
                    {i === 1 ? "Selected" : "Open"}
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-night mt-3 rounded-lg py-2 text-center text-[0.6875rem] font-semibold text-white">
              Confirm booking
            </div>
          </div>
        </Frame>
      </div>

      {/* In front: live delivery tracking. */}
      <div className="absolute right-[6%] bottom-2 w-[50%] rotate-3 sm:right-[10%]">
        <Frame>
          <div className="relative h-[52%] overflow-hidden bg-[#e8eef2]">
            {/* A map made of a few roads. */}
            <div className="absolute inset-x-0 top-1/3 h-2 bg-white" />
            <div className="absolute inset-y-0 left-1/3 w-2 bg-white" />
            <div className="absolute inset-x-0 top-[70%] h-1.5 rotate-[-8deg] bg-white" />
            <div className="absolute inset-y-0 right-1/4 w-1.5 bg-white" />
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 size-full"
              preserveAspectRatio="none"
            >
              <path
                d="M20 85 L36 70 L36 36 L74 36 L74 18"
                fill="none"
                stroke="var(--color-brand)"
                strokeWidth="3"
                strokeDasharray="5 4"
                strokeLinecap="round"
              />
            </svg>
            <span className="bg-brand absolute top-[30%] left-[33%] grid size-6 place-items-center rounded-full ring-4 ring-white">
              <span className="size-2 animate-ping rounded-full bg-white" />
            </span>
            <MapPin
              className="text-amber-deep absolute top-[8%] right-[20%] size-5"
              fill="currentColor"
              strokeWidth={1.5}
            />
          </div>
          <div className="px-3.5 pt-3">
            <p className="text-[0.625rem] text-zinc-400">Arriving in</p>
            <p className="text-[1.125rem] font-semibold text-zinc-900">
              12 min
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-zinc-100">
              <div className="bg-leaf h-full w-2/3 rounded-full" />
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-zinc-50 p-2">
              <span className="bg-amber-wash text-amber-deep grid size-7 place-items-center rounded-full text-[0.625rem] font-bold">
                RK
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.6875rem] font-semibold text-zinc-900">
                  Ravi is on the way
                </p>
                <p className="flex items-center gap-0.5 text-[0.5625rem] text-zinc-500">
                  <Star
                    className="size-2.5 text-amber-500"
                    fill="currentColor"
                  />
                  4.9 · KA 05 2048
                </p>
              </div>
            </div>
          </div>
        </Frame>
      </div>
    </div>
  );
}

/** A phone body: rounded, bezelled, with a notch, at a fixed aspect. */
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative aspect-[9/19] overflow-hidden rounded-[2rem] border-[7px] border-zinc-950 bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
      <div className="absolute top-1.5 left-1/2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-zinc-950" />
      <div className="h-full pt-7">{children}</div>
    </div>
  );
}
