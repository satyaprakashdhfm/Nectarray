import { PageHead } from "@/components/admin/Business";
import { WebNotesEditor } from "@/components/admin/WebNotesEditor";
import { getWebNotes } from "@/lib/web-notes";

export const dynamic = "force-dynamic";

/**
 * What building this site has taught us, and the order to build the next
 * one in, side by side on a wide screen.
 */
export default async function AdminWebPage() {
  const [learnings, steps] = await Promise.all([
    getWebNotes("learning"),
    getWebNotes("step"),
  ]);

  return (
    <>
      <PageHead
        title="Website building"
        lede="Lessons from building our own site, and the order to build a new page in. Colours, Elements and References hold the tools."
      />
      <div className="mt-8 grid gap-8 xl:grid-cols-2 xl:gap-10">
        <WebNotesEditor
          kind="learning"
          initial={learnings.notes}
          customised={learnings.customised}
          title="Learnings"
          lede="Rules to follow on every page."
        />
        <WebNotesEditor
          kind="step"
          initial={steps.notes}
          customised={steps.customised}
          title="Build steps"
          lede="Colours first, then the header, hero and footer, then everything in between."
        />
      </div>
    </>
  );
}
