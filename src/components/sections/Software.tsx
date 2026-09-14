import { BuildShowcase } from "@/components/software/BuildShowcase";
import { headGap, sectionPad, wideShell } from "@/components/software/layout";
import { SectionHead } from "@/components/ui/SectionHead";
import { software } from "@/lib/content";

/**
 * What we build, as a showcase rather than a service list.
 *
 * The heading and the lede; BuildShowcase carries the six builds themselves.
 *
 * A compact quote band used to sit between the two. The same ask closes the
 * page in full, and one screen after the hero — which already has a Get a
 * quote button on it — it was the third time of asking before a reader had
 * seen a single thing we make.
 *
 * No durations anywhere. A timeline printed on a card is a quote given before
 * anyone has described the job, and the number is either wrong or a hedge —
 * scope decides it, and scope is what the call is for.
 *
 * Always an h2. It used to take an `asPage` flag that promoted it to the h1
 * of /software and padded it clear of the fixed header, because it was the
 * first thing on that route. SoftwareHero is now, and it carries both.
 */
export function Software() {
  return (
    <section id="software" className={`scroll-mt-24 ${sectionPad}`}>
      <div className={wideShell}>
        <SectionHead
          eyebrow={software.eyebrow}
          title={
            <>
              Whatever the business is, <em>there is a build here for it.</em>
            </>
          }
          lede={software.lede}
        />

        <div className={headGap}>
          <BuildShowcase />
        </div>
      </div>
    </section>
  );
}
