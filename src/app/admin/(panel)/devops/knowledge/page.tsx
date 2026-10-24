import { DevopsNotesPage } from "@/components/admin/DevopsNotes";
import { DEVOPS_KNOWLEDGE } from "@/lib/content/devops";

/** Internal experiments (Rust vs Node) and the DevOps ideas behind them. */
export default function DevopsKnowledgePage() {
  return <DevopsNotesPage page={DEVOPS_KNOWLEDGE} />;
}
