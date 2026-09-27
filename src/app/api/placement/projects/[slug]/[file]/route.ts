import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { AccessError, requireEnrolled } from "@/lib/auth/access";
import { projectBySlug } from "@/lib/content/placement-projects";

export const runtime = "nodejs";

const DIR = path.join(process.cwd(), "content", "placement-projects");

/**
 * A placement project's source zip or its guide, for enrolled students only.
 *
 * Kept out of public/ for that reason. The slug is checked against the list
 * and the file against two names, so nothing else on disk can be asked for.
 * The guide is sent inline so the page can show it; the zip downloads.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; file: string }> },
) {
  try {
    await requireEnrolled();
  } catch (error) {
    if (error instanceof AccessError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    throw error;
  }

  const { slug, file } = await params;
  const project = projectBySlug(slug);
  if (!project || (file !== "guide.pdf" && file !== "source.zip")) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const body = await readFile(path.join(DIR, project.slug, file));
  const pdf = file === "guide.pdf";
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": pdf ? "application/pdf" : "application/zip",
      "Content-Disposition": `${pdf ? "inline" : "attachment"}; filename="${
        pdf ? project.guideName : project.zipName
      }"`,
      "Content-Length": String(body.length),
      "Cache-Control": "private, max-age=3600",
    },
  });
}
