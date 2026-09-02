import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { software } from "@/lib/content";

/**
 * `asPage` is set when this section is the body of its own route rather than
 * one of several on the homepage: it promotes the heading to the page's h1
 * and adds the top offset the fixed header needs.
 */
export function Software({ asPage = false }: { asPage?: boolean } = {}) {
  return (
    <section id="software" className="py-24 sm:py-28 lg:py-32">
      <div className="shell">
        <SectionHead
          as={asPage ? "h1" : "h2"}
          eyebrow={software.eyebrow}
          title={
            <>
              From a landing page to a platform,{" "}
              <em>built to the same standard.</em>
            </>
          }
          lede={software.lede}
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {software.services.map((service, i) => (
            <Reveal as="li" key={service.title} delay={(i % 3) * 80}>
              <article className="card card-hover flex h-full flex-col p-7">
                <div className="flex items-center justify-between gap-3">
                  <span className="bg-brand-wash text-brand-deep grid size-11 place-items-center rounded-xl">
                    <Icon name={service.icon} className="size-5" />
                  </span>
                  <span className="border-line bg-canvas text-ink-faint rounded-full border px-2.5 py-1 font-mono text-[0.6875rem]">
                    {service.meta}
                  </span>
                </div>

                <h3 className="text-ink mt-6 text-[1.1875rem] font-semibold tracking-tight">
                  {service.title}
                </h3>
                <p className="text-ink-soft mt-3 text-[0.9375rem] leading-relaxed">
                  {service.body}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>

        {/* The default stack -------------------------------------------- */}
        <Reveal delay={100}>
          <div className="card mt-6 grid gap-10 p-8 sm:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div>
              <h3 className="display text-[1.75rem] sm:text-[2rem]">
                {software.stack.title}
              </h3>
              <p className="text-ink-soft mt-4 text-[0.9375rem] leading-relaxed">
                {software.stack.body}
              </p>
            </div>

            <dl className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {software.stack.groups.map((group) => (
                <div key={group.label}>
                  <dt className="eyebrow mb-3">{group.label}</dt>
                  <dd>
                    <ul className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="border-line bg-canvas text-ink-soft rounded-lg border px-2.5 py-1.5 font-mono text-[0.75rem]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
