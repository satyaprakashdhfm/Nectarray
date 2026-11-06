import { AccessError, requireAdmin } from "@/lib/auth/access";
import { contentType, knowledgeMedia } from "@/lib/knowledge";

/**
 * One image or figure from the Knowledge base's notes.
 *
 * Admin only, like everything else in the panel — the notes are reference
 * material, not something to hand out from a public folder. Names are
 * content hashes, so a file never changes under its name and can be cached
 * by the browser for as long as it likes.
 *
 * An SVG can carry script, so it is served sandboxed: a unique origin, no
 * access to the panel's cookies or pages.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  try {
    await requireAdmin();
  } catch (error) {
    const status = error instanceof AccessError ? error.status : 401;
    return new Response("Not allowed", { status });
  }

  const { file } = await params;
  const bytes = await knowledgeMedia(file);
  if (!bytes) return new Response("Not found", { status: 404 });

  const type = contentType(file);
  const headers: Record<string, string> = {
    "Content-Type": type,
    "Cache-Control": "private, max-age=31536000, immutable",
  };
  if (type.startsWith("text/html") || type.startsWith("image/svg")) {
    headers["Content-Security-Policy"] = "sandbox allow-scripts";
  }
  return new Response(new Uint8Array(bytes), { headers });
}
