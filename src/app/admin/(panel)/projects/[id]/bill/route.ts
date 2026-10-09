import { serviceLabel } from "@/lib/business";
import { adminProject, loadProjectSheets } from "@/lib/project-data";
import { isMonth } from "@/lib/project-details";
import { fileStem, monthlyBillBook, xlsxResponse } from "@/lib/project-excel";

/** One month's expenses for the client: ?month=2026-10. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const project = await adminProject((await params).id);
  if (project instanceof Response) return project;
  const month = new URL(request.url).searchParams.get("month") ?? "";
  if (!isMonth(month)) return new Response("Pick a month", { status: 400 });
  const sheets = await loadProjectSheets(project.id);
  const view = { ...project, service: serviceLabel(project.service) };
  return xlsxResponse(
    monthlyBillBook(view, sheets, month),
    `${fileStem(view)}-expenses-${month}`,
  );
}
