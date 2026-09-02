import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { marketing } from "@/lib/content";

/**
 * `asPage` is set when this section is the body of its own route rather than
 * one of several on the homepage, and promotes its heading to that page's h1.
 * The offset for the fixed header lives on <main>, so the section keeps its
 * own vertical rhythm either way.
 */
export function Marketing({ asPage = false }: { asPage?: boolean } = {}) {
  return (
    <section
      id="marketing"
      className="border-line bg-mist relative overflow-hidden border-y py-24 sm:py-28 lg:py-32"
    >
      <div
        className="grid-paper pointer-events-none absolute inset-0 -z-10 opacity-60"
        aria-hidden
      />

      <div className="shell">
        <SectionHead
          as={asPage ? "h1" : "h2"}
          eyebrow={marketing.eyebrow}
          title={
            <>
              Every channel that can send you a customer,{" "}
              <em>run by one team.</em>
            </>
          }
          lede={marketing.lede}
        />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {marketing.channels.map((channel, i) => (
            <Reveal as="li" key={channel.title} delay={(i % 4) * 70}>
              <article className="card card-hover h-full p-6">
                <span className="from-leaf/18 to-brand/18 text-brand-deep grid size-11 place-items-center rounded-xl bg-gradient-to-br">
                  <Icon name={channel.icon} className="size-5" />
                </span>
                <h3 className="text-ink mt-5 text-[1.0625rem] font-semibold tracking-tight">
                  {channel.title}
                </h3>
                <p className="text-ink-soft mt-2.5 text-[0.875rem] leading-relaxed">
                  {channel.body}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={120}>
          <p className="text-ink-soft mt-10 flex items-center justify-center gap-2.5 text-center text-[0.9375rem]">
            <Icon name="sparkles" className="text-amber-deep size-4 shrink-0" />
            {marketing.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
