import { serviceLabel } from "@/lib/business";
import { adminProject, loadProjectSheets } from "@/lib/project-data";
import { fileStem, fullSheetBook, xlsxResponse } from "@/lib/project-excel";

/**
 * The full sheet: summary and monthly running cost, spend by month, every
 * payment, the services and the passwords, one sheet each.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const project = await adminProject((await params).id);
  if (project instanceof Response) return project;
  const sheets = await loadProjectSheets(project.id);
  const view = { ...project, service: serviceLabel(project.service) };
  return xlsxResponse(fullSheetBook(view, sheets), fileStem(view));
}
