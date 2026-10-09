import { NextResponse } from "next/server";
import { adminProject } from "@/lib/project-data";
import { MAX_FILE_BYTES, saveProjectFile } from "@/lib/project-files";

/**
 * Keeps a receipt or invoice with the project and answers with its id,
 * which the page puts on the payment's row. The row is saved with the rest
 * of the sheet.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const project = await adminProject((await params).id);
  if (project instanceof Response) return project;

  let file: File | null = null;
  try {
    const value = (await request.formData()).get("file");
    file = value instanceof File ? value : null;
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  if (!file || file.size === 0)
    return NextResponse.json({ error: "No file." }, { status: 400 });
  if (file.size > MAX_FILE_BYTES)
    return NextResponse.json(
      { error: "That file is over 8 MB." },
      { status: 413 },
    );

  return NextResponse.json(await saveProjectFile(project.id, file));
}
