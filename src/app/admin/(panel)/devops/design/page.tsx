import { DevopsNotesPage } from "@/components/admin/DevopsNotes";
import { DEVOPS_DESIGN } from "@/lib/content/devops";

/** How the code inside each project is laid out, and why. */
export default function DevopsDesignPage() {
  return <DevopsNotesPage page={DEVOPS_DESIGN} />;
}
