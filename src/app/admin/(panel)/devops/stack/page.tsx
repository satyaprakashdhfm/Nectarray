import { DevopsNotesPage } from "@/components/admin/DevopsNotes";
import { DEVOPS_STACK } from "@/lib/content/devops";

/** Languages, frameworks and infrastructure across every project. */
export default function DevopsStackPage() {
  return <DevopsNotesPage page={DEVOPS_STACK} />;
}
