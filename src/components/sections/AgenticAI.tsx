import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { ai } from "@/lib/content";

export function AgenticAI() {
  return (
    <section
      id="ai"
      className="bg-night relative scroll-mt-24 overflow-hidden py-24 text-white sm:py-28 lg:py-32"
    >
      {/* Circuit-coloured glow, echoing the mark */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [mask-image:radial-gradient(110%_70%_at_50%_0%,#000_30%,transparent_75%)] [background-size:46px_46px] opacity-[0.55]" />
        <div className="bg-brand/18 absolute top-10 -left-24 size-[30rem] rounded-full blur-[130px]" />
        <div className="bg-leaf/14 absolute -right-20 bottom-0 size-[28rem] rounded-full blur-[130px]" />
      </div>

      <div className="shell">
        <SectionHead
          onDark
          eyebrow={ai.eyebrow}
          title={
            <>
              Agents that <em>do the work</em>, not demos that describe it.
            </>
          }
          lede={ai.lede}
        />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {ai.capabilities.map((capability, i) => (
            <Reveal as="li" key={capability.title} delay={(i % 3) * 80}>
              <article className="group border-night-line bg-night-soft/70 hover:border-leaf/40 hover:bg-night-soft h-full rounded-2xl border p-7 backdrop-blur transition-colors duration-400">
                <span className="text-leaf group-hover:bg-leaf/15 grid size-11 place-items-center rounded-xl bg-white/6 transition-colors duration-400">
                  <Icon name={capability.icon} className="size-5" />
                </span>
                <h3 className="mt-5 text-[1.0625rem] font-semibold tracking-tight text-white">
                  {capability.title}
                </h3>
                <p className="mt-2.5 text-[0.875rem] leading-relaxed text-white/60">
                  {capability.body}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>

        {/* Harnesses ----------------------------------------------------- */}
        <Reveal delay={120}>
          <div className="border-night-line bg-night-soft/50 mt-6 grid gap-9 rounded-2xl border p-8 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <h3 className="display text-[1.75rem] text-white sm:text-[2rem]">
                {ai.harnesses.title}
              </h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-white/60">
                {ai.harnesses.body}
              </p>
            </div>

            <ul className="grid grid-cols-2 gap-2.5 self-center sm:grid-cols-2">
              {ai.harnesses.items.map((item) => (
                <li
                  key={item}
                  className="border-night-line flex items-center gap-2.5 rounded-xl border bg-white/[0.03] px-3.5 py-3 text-[0.875rem] font-medium text-white/85"
                >
                  <span
                    className="bg-leaf size-1.5 shrink-0 rounded-full"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
