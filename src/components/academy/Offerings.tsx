import { Carousel, Slide } from "@/components/academy/Carousel";
import { Sparkle } from "@/components/academy/Doodles";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { academy } from "@/lib/content";

/** The four brand accents, cycled so no two adjacent cards share one. */
const accents = [
  "bg-brand-wash text-brand-deep",
  "bg-leaf-wash text-leaf-deep",
  "bg-teal-wash text-teal-deep",
  "bg-amber-wash text-amber-deep",
];

export function Offerings() {
  return (
    <section
      id="offerings"
      className="border-line bg-mist relative border-y py-20 sm:py-24 lg:py-28"
      aria-labelledby="offerings-title"
    >
      <div className="shell-wide">
        <Reveal>
          <p className="text-brand-deep flex items-center justify-center gap-2 text-[1.25rem] font-semibold sm:text-[1.5rem]">
            <Sparkle className="text-leaf size-5" />
            Exclusive course offerings
          </p>
          <h2
            id="offerings-title"
            className="display text-ink mt-2 text-center text-[2.25rem] sm:text-[2.75rem]"
          >
            Our <span className="ink-gradient">Offerings</span>
          </h2>
          <p className="lede mx-auto mt-5 max-w-2xl text-center">
            Six things this programme does that a recorded course cannot, and
            that a class of two hundred cannot either.
          </p>
        </Reveal>

        <div className="mt-14 lg:mt-16">
          <Carousel label="offerings">
            {academy.course.offerings.map((offering, i) => (
              <Slide key={offering.title}>
                <article className="card flex h-full flex-col p-7 text-center sm:p-8">
                  <span
                    className={`mx-auto grid size-16 place-items-center rounded-2xl ${accents[i % accents.length]}`}
                  >
                    <Icon name={offering.icon} className="size-7" />
                  </span>

                  <h3 className="text-ink mt-6 text-[1.1875rem] font-bold tracking-tight">
                    {offering.title}
                  </h3>
                  <p className="text-ink-soft mt-3 text-[0.9375rem] leading-relaxed">
                    {offering.body}
                  </p>

                  <div className="border-line-soft mt-6 border-t pt-5 text-left">
                    <p className="text-ink text-[0.875rem] font-semibold">
                      Course highlights:
                    </p>
                    <ul className="mt-3 space-y-2">
                      {offering.points.map((point) => (
                        <li
                          key={point}
                          className="text-ink-soft flex gap-2.5 text-[0.875rem] leading-relaxed"
                        >
                          <span
                            className="border-brand-deep mt-[0.45rem] size-1.5 shrink-0 rounded-full border-[1.5px]"
                            aria-hidden
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Slide>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
