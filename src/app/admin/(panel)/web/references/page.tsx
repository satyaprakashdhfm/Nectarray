import { PageHead } from "@/components/admin/Business";
import { WebNotesEditor } from "@/components/admin/WebNotesEditor";
import { getWebNotes } from "@/lib/web-notes";

export const dynamic = "force-dynamic";

/** Places to look at real components and real sites before building one. */
export default async function AdminWebReferencesPage() {
  const references = await getWebNotes("reference");
  return (
    <>
      <PageHead
        title="References"
        lede="Galleries of real components, screenshots and sites to look at before building. Add your own links with Edit."
      />
      <div className="mt-8">
        <WebNotesEditor
          kind="reference"
          initial={references.notes}
          customised={references.customised}
          title="Where to look"
          lede="Check the licence before copying code. Free ones say MIT; paid kits need a licence."
        />
      </div>
    </>
  );
}
