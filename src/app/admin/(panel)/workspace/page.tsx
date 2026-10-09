import type { Metadata } from "next";
import { PageHead } from "@/components/admin/Business";
import { DeployBoard } from "@/components/admin/workspace/DeployBoard";
import { Workspace } from "@/components/admin/workspace/Workspace";

export const metadata: Metadata = {
  title: "Workspace | NectArray Admin",
};

/**
 * Claude Code sessions side by side, each in its own terminal, run by the
 * Workspace service on Railway (workspace/server.mjs), not by this server;
 * the page only shows them. Admin-only through the panel's layout, like every other tab.
 * Above them, what is deploying on Railway right now (DeployBoard).
 */
export default function AdminWorkspacePage() {
  return (
    <>
      <PageHead
        title="Workspace"
        lede="Claude Code in the cloud, on any of your GitHub repos. Every session is a live tile; open one to work in it, talk or type to it. Sessions stay: one left alone for 5 minutes goes to sleep and wakes, on the same conversation, when you open it."
      />
      <DeployBoard />
      <Workspace />
    </>
  );
}
