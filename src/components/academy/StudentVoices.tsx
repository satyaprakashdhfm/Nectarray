import { Star } from "lucide-react";
import { Carousel, Slide } from "@/components/academy/Carousel";
import { Sparkle } from "@/components/academy/Doodles";
import { Reveal } from "@/components/ui/Reveal";
import { studentQuotes } from "@/lib/content";

/** Five stars, filled to the rating, with the half handled by a clip. */
function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="flex items-center gap-2"
      aria-label={`Rated ${rating} out of 5`}
    >
      <span className="text-ink text-[0.9375rem] font-semibold">
        {rating.toFixed(1)}
      </span>
      <span className="flex gap-0.5" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.min(Math.max(rating - i, 0), 1);
          return (
            <span key={i} className="relative inline-block">
              <Star className="text-line size-4 fill-current" aria-hidden />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star className="text-amber size-4 fill-current" aria-hidden />
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

/**
 * What students say.
 *
 * Renders nothing until there is something to render — `studentQuotes` is
 * empty on purpose. A course page is the one place a visitor is right to
 * read sceptically, and a quote nobody said is worse than no quotes at all.
 */
export function StudentVoices() {
  if (studentQuotes.length === 0) return null;

  return (
    <section
      className="relative py-20 sm:py-24 lg:py-28"
      aria-labelledby="voices-title"
    >
      <div className="shell">
        <Reveal>
          <p className="text-amber-deep flex items-center justify-center gap-2 text-[1.25rem] font-semibold sm:text-[1.5rem]">
            <Sparkle className="size-5" />
            Testimonials
          </p>
          <h2
            id="voices-title"
            className="display text-ink mt-2 text-center text-[2.25rem] sm:text-[2.75rem]"
          >
            What our <span className="text-brand-deep">students say</span>
          </h2>
        </Reveal>

        <div className="mt-14 lg:mt-16">
          <Carousel label="testimonials">
            {studentQuotes.map((entry) => (
              <Slide key={`${entry.name}-${entry.quote}`}>
                <figure className="card relative flex h-full flex-col overflow-hidden p-7 sm:p-8">
                  <span
                    className="text-line-soft pointer-events-none absolute top-4 right-5 font-serif text-[6rem] leading-none select-none"
                    aria-hidden
                  >
                    &rdquo;
                  </span>

                  <figcaption className="relative flex items-start gap-4">
                    <span
                      className="from-brand to-brand-deep grid size-14 shrink-0 place-items-center rounded-full bg-gradient-to-br text-[1.25rem] font-bold text-white"
                      aria-hidden
                    >
                      {entry.name.charAt(0)}
                    </span>
                    <span className="min-w-0">
                      <span className="text-ink block text-[1.0625rem] leading-snug font-bold">
                        {entry.name}, {entry.place}
                      </span>
                      <span className="text-ink-soft mt-1 block text-[0.9375rem]">
                        {entry.course}
                      </span>
                      <span className="mt-2 block">
                        <Stars rating={entry.rating} />
                      </span>
                    </span>
                  </figcaption>

                  <blockquote className="border-line-soft text-ink-soft mt-6 border-t pt-6 text-[0.9375rem] leading-[1.75]">
                    {entry.quote}
                  </blockquote>
                </figure>
              </Slide>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
