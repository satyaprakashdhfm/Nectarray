import { BrandChip } from "@/components/software/BrandChip";
import { headGap, sectionPad, wideShell } from "@/components/software/layout";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { software } from "@/lib/content";

const { stack } = software;

/**
 * The stack, by logo.
 *
 * A second panel under this listed every cloud service by name — EC2, RDS,
 * SQS, Bedrock and thirty more, as chips. It answered a question almost
 * nobody on this page was asking, and it was the longest thing on the route.
 * The logo rows answer the question people do ask: do you know my platform.
 */
export function StackGrid() {
  return (
    <section id="stack" className={sectionPad}>
      <div className={wideShell}>
        <SectionHead
          eyebrow={stack.eyebrow}
          title={
            <>
              Built on tools you can <em>hire for later.</em>
            </>
          }
          lede={stack.lede}
        />

        <div className={`grid gap-4 md:grid-cols-2 xl:grid-cols-3 ${headGap}`}>
          {stack.groups.map((group, i) => (
            <Reveal key={group.label} delay={(i % 2) * 70}>
              <div className="card h-full p-5">
                <h3 className="eyebrow">{group.label}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.brands.map((brand) => (
                    <BrandChip key={brand.name} brand={brand} />
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
