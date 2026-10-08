import type { Metadata } from "next";
import { PageHead } from "@/components/admin/Business";
import { Workspace } from "@/components/admin/workspace/Workspace";

export const metadata: Metadata = {
  title: "Workspace | NectArray Admin",
};

/**
 * Claude Code sessions on the admin's own PC, side by side, each in its own
 * terminal, with a card per session saying what it is doing. The sessions
 * run in workspace/server.mjs on that PC, not on this server; the page only
 * shows them. Admin-only through the panel's layout, like every other tab.
 */
export default function AdminWorkspacePage() {
  return (
    <>
      <PageHead
        title="Workspace"
        lede="Claude Code on your PC, one terminal per session. Pick a repo, start as many sessions as you need, and talk or type to each one."
      />
      <Workspace />
    </>
  );
}
