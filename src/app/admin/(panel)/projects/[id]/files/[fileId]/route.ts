import { adminProject } from "@/lib/project-data";
import { isFileId } from "@/lib/project-details";
import { readProjectFile } from "@/lib/project-files";

/** A kept document: PDFs and images open in the tab, anything else downloads. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; fileId: string }> },
) {
  const { id, fileId } = await params;
  const project = await adminProject(id);
  if (project instanceof Response) return project;
  if (!isFileId(fileId)) return new Response("Not found", { status: 404 });
  const file = await readProjectFile(project.id, fileId);
  if (!file) return new Response("Not found", { status: 404 });

  const disposition = file.viewable ? "inline" : "attachment";
  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.type,
      "Content-Length": String(file.data.length),
      "Content-Disposition": `${disposition}; filename*=UTF-8''${encodeURIComponent(file.name)}`,
      "Cache-Control": "private, no-store",
    },
  });
}
