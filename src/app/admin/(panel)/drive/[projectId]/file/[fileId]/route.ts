import { adminProject } from "@/lib/project-data";
import { readyFile } from "@/lib/drive";
import { downloadLink } from "@/lib/drive-storage";

/**
 * Opens or downloads a Drive file: checks the admin and the project, then
 * sends the browser to a short-lived link straight to the bucket.
 * `?download=1` always downloads; otherwise PDFs, images, video and text
 * open in the browser. The Drive's grid uses it for image and video previews.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string; fileId: string }> },
) {
  const { projectId, fileId } = await params;
  const project = await adminProject(projectId);
  if (project instanceof Response) return project;

  const file = await readyFile(project.id, fileId);
  if (!file) return new Response("Not found", { status: 404 });

  const download = new URL(request.url).searchParams.has("download");
  // The link lasts 15 minutes; letting the browser reuse this redirect for
  // ten of them keeps the grid's previews from refetching on every refresh.
  return new Response(null, {
    status: 302,
    headers: {
      Location: await downloadLink(file.key, file, download),
      "Cache-Control": "private, max-age=600",
    },
  });
}
