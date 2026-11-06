import { AccessError, requireAdmin } from "@/lib/auth/access";
import { contentType, knowledgeSource } from "@/lib/knowledge";

/** Opened in the browser; everything else downloads. */
const INLINE = /\.(pdf|png|jpe?g|gif|webp|txt|py|json)$/i;

/**
 * An original from the Knowledge base archive (knowledge/source/): the
 * notebook a note was made from, a PDF, a dataset, a file of a code project.
 * `?download=1` always downloads.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    await requireAdmin();
  } catch (error) {
    const status = error instanceof AccessError ? error.status : 401;
    return new Response("Not allowed", { status });
  }

  const { path: parts } = await params;
  const decoded = parts.map((part) => decodeURIComponent(part));
  const bytes = await knowledgeSource(decoded);
  if (!bytes) return new Response("Not found", { status: 404 });

  const name = decoded.at(-1) ?? "file";
  const download =
    new URL(request.url).searchParams.has("download") || !INLINE.test(name);
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": contentType(name),
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(name)}`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
