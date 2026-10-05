import { eq } from "drizzle-orm";
import ExcelJS from "exceljs";
import { db } from "@/lib/db";
import { clientProjects } from "@/lib/db/schema";
import { AccessError, requireAdmin } from "@/lib/auth/access";
import { serviceLabel } from "@/lib/business";
import { loadProjectSheets } from "@/lib/project-data";
import { frequencyLabel } from "@/lib/project-details";

/**
 * The project's handover workbook: a summary, what was paid to outside
 * services, the recurring charges and the logins, one sheet each.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
  } catch (error) {
    const status = error instanceof AccessError ? error.status : 401;
    return new Response("Not allowed", { status });
  }
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id))
    return new Response("Not found", { status: 404 });
  const [project] = await db
    .select()
    .from(clientProjects)
    .where(eq(clientProjects.id, id));
  if (!project) return new Response("Not found", { status: 404 });
  const s = await loadProjectSheets(id);

  const book = new ExcelJS.Workbook();
  book.creator = "NectArray";
  const sheet = (
    name: string,
    columns: { header: string; key: string; width: number }[],
    rows: Record<string, unknown>[],
  ) => {
    const ws = book.addWorksheet(name);
    ws.columns = columns;
    ws.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    ws.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF10688F" },
    };
    ws.views = [{ state: "frozen", ySplit: 1 }];
    rows.forEach((r) => ws.addRow(r));
    return ws;
  };

  sheet(
    "Summary",
    [
      { header: "Field", key: "k", width: 22 },
      { header: "Value", key: "v", width: 70 },
    ],
    [
      { k: "Project", v: project.title },
      { k: "Client", v: project.client },
      { k: "Service", v: serviceLabel(project.service) },
      { k: "Status", v: project.status },
      { k: "Status notes", v: s.statusNote },
      ...s.links.map((l) => ({ k: l.label || "Link", v: l.url })),
    ],
  ).getColumn("v").alignment = { wrapText: true, vertical: "top" };

  const paid = sheet(
    "Amounts paid",
    [
      { header: "Item", key: "item", width: 30 },
      { header: "Paid to", key: "vendor", width: 20 },
      { header: "Amount (₹)", key: "amount", width: 14 },
      { header: "Date", key: "date", width: 14 },
      { header: "Note", key: "note", width: 40 },
    ],
    s.paid,
  );
  paid.getColumn("amount").numFmt = "#,##0";
  if (s.paid.length) {
    const total = paid.addRow({
      item: "Total",
      amount: s.paid.reduce((n, r) => n + r.amount, 0),
    });
    total.font = { bold: true };
  }

  const services = sheet(
    "Services and charges",
    [
      { header: "Platform", key: "item", width: 24 },
      { header: "Billing frequency", key: "billing", width: 18 },
      { header: "Amount (₹)", key: "amount", width: 14 },
      { header: "Next renewal", key: "renews", width: 14 },
      { header: "Details", key: "note", width: 70 },
    ],
    s.recurring.map((r) => ({
      ...r,
      billing: frequencyLabel(r.billing),
      amount: r.amount || null,
    })),
  );
  services.getColumn("amount").numFmt = "#,##0";
  services.getColumn("note").alignment = { wrapText: true, vertical: "top" };

  sheet(
    "Passwords",
    [
      { header: "Service", key: "service", width: 26 },
      { header: "Link", key: "url", width: 34 },
      { header: "Username or email", key: "username", width: 30 },
      { header: "Password", key: "password", width: 26 },
      { header: "Note", key: "note", width: 36 },
    ],
    s.access,
  );

  const buffer = await book.xlsx.writeBuffer();
  const name = `${project.client} ${project.title}`
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return new Response(buffer as ArrayBuffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${name || "project"}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
