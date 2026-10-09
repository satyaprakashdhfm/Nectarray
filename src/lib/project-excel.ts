import ExcelJS from "exceljs";
import {
  fixedMonthlyCost,
  frequencyLabel,
  monthLabel,
  monthlyTotals,
  paidInMonth,
  type ProjectSheets,
} from "@/lib/project-details";

/**
 * The two Excel files a project gives out.
 *
 * - The monthly bill: what was paid on the client's behalf in one month,
 *   sent to the client at the month's end. Amounts only; no passwords,
 *   links or documents.
 * - The full sheet: everything, passwords and running costs included, for
 *   handing over whenever it is asked for.
 */

export type ExcelProject = {
  client: string;
  title: string;
  /** The service's name, as the client reads it. */
  service: string;
  status: string;
};

const HEADER_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF10688F" },
};
const MONEY = "#,##0";
const DAY = "dd mmm yyyy";
const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** "2026-10-04" as a date Excel sorts and formats; blank stays blank. */
const excelDate = (day: string) => (day ? new Date(`${day}T00:00:00Z`) : null);

function newBook() {
  const book = new ExcelJS.Workbook();
  book.creator = "NectArray";
  return book;
}

function styleHeader(row: ExcelJS.Row) {
  row.font = { bold: true, color: { argb: "FFFFFFFF" } };
  row.fill = HEADER_FILL;
}

/** A sheet whose first row is the header, kept in view while scrolling. */
function table(
  book: ExcelJS.Workbook,
  name: string,
  columns: { header: string; key: string; width: number }[],
  rows: Record<string, unknown>[],
) {
  const ws = book.addWorksheet(name);
  ws.columns = columns;
  styleHeader(ws.getRow(1));
  ws.views = [{ state: "frozen", ySplit: 1 }];
  rows.forEach((r) => ws.addRow(r));
  return ws;
}

/** One month's expenses, with a total, ready to send to the client. */
export function monthlyBillBook(
  project: ExcelProject,
  sheets: ProjectSheets,
  month: string,
) {
  const book = newBook();
  const rows = paidInMonth(sheets.paid, month);
  const ws = book.addWorksheet(monthLabel(month));
  [8, 34, 22, 14, 44].forEach(
    (width, i) => (ws.getColumn(i + 1).width = width),
  );

  ws.addRow(["Monthly expenses"]).font = { bold: true, size: 14 };
  for (const [k, v] of [
    ["Client", project.client],
    ["Project", project.title],
    ["Month", monthLabel(month)],
  ])
    ws.addRow([k, v]).getCell(1).font = { bold: true };
  ws.addRow([]);

  const header = ws.addRow(["No.", "Item", "Paid to", "Amount (₹)", "Details"]);
  styleHeader(header);
  const first = header.number + 1;
  rows.forEach((r, i) =>
    ws.addRow([i + 1, r.item, r.vendor, r.amount, r.note]),
  );
  if (!rows.length) ws.addRow([null, "No expenses this month"]);
  const last = ws.lastRow!.number;

  // A formula, so a line the client edits still adds up; a plain 0 when
  // there is nothing to add, since a formula's cached 0 is not written out.
  const total = ws.addRow([
    null,
    "Total",
    null,
    rows.length
      ? {
          formula: `SUM(D${first}:D${last})`,
          result: rows.reduce((n, r) => n + r.amount, 0),
        }
      : 0,
  ]);
  total.font = { bold: true };
  total.getCell(4).border = { top: { style: "thin" } };

  ws.getColumn(1).alignment = { horizontal: "left" };
  ws.getColumn(4).numFmt = MONEY;
  ws.getColumn(5).alignment = { wrapText: true, vertical: "top" };
  ws.views = [{ state: "frozen", ySplit: header.number }];
  return book;
}

/**
 * The whole project: a summary with the monthly running cost, what was
 * spent month by month, every payment, the services and the passwords.
 */
export function fullSheetBook(project: ExcelProject, sheets: ProjectSheets) {
  const book = newBook();
  const fixed = fixedMonthlyCost(sheets.recurring);
  const paidTotal = sheets.paid.reduce((n, r) => n + r.amount, 0);

  table(
    book,
    "Summary",
    [
      { header: "Field", key: "k", width: 24 },
      { header: "Value", key: "v", width: 70 },
    ],
    [
      { k: "Project", v: project.title },
      { k: "Client", v: project.client },
      { k: "Service", v: project.service },
      { k: "Status", v: project.status },
      {
        k: "Fixed charges a month",
        v:
          fixed.yearly > 0
            ? `${inr.format(fixed.perMonth)} (${inr.format(fixed.monthly)} monthly, plus ${inr.format(fixed.yearly)} yearly spread over 12 months)`
            : inr.format(fixed.perMonth),
      },
      { k: "Paid so far", v: inr.format(paidTotal) },
      { k: "Status notes", v: sheets.statusNote },
      ...sheets.links.map((l) => ({ k: l.label || "Link", v: l.url })),
    ],
  ).getColumn("v").alignment = { wrapText: true, vertical: "top" };

  const months = monthlyTotals(sheets.paid);
  const spend = table(
    book,
    "Monthly spend",
    [
      { header: "Month", key: "month", width: 20 },
      { header: "Payments", key: "count", width: 12 },
      { header: "Amount (₹)", key: "total", width: 16 },
    ],
    months.map((m) => ({ ...m, month: monthLabel(m.month) })),
  );
  spend.getColumn("total").numFmt = MONEY;
  if (months.length)
    spend.addRow({
      month: "Total",
      count: months.reduce((n, m) => n + m.count, 0),
      total: months.reduce((n, m) => n + m.total, 0),
    }).font = { bold: true };

  const paid = table(
    book,
    "Amounts paid",
    [
      { header: "Month", key: "month", width: 18 },
      { header: "Item", key: "item", width: 30 },
      { header: "Paid to", key: "vendor", width: 20 },
      { header: "Amount (₹)", key: "amount", width: 14 },
      { header: "Note", key: "note", width: 40 },
    ],
    // Month by month, each in the order it was added (sort is stable).
    [...sheets.paid]
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((r) => ({ ...r, month: r.month ? monthLabel(r.month) : "" })),
  );
  paid.getColumn("amount").numFmt = MONEY;
  if (sheets.paid.length)
    paid.addRow({ item: "Total", amount: paidTotal }).font = { bold: true };

  const services = table(
    book,
    "Services and charges",
    [
      { header: "Platform", key: "item", width: 24 },
      { header: "Billing frequency", key: "billing", width: 18 },
      { header: "Amount (₹)", key: "amount", width: 14 },
      { header: "Next renewal", key: "renews", width: 14 },
      { header: "Details", key: "note", width: 70 },
    ],
    sheets.recurring.map((r) => ({
      ...r,
      billing: frequencyLabel(r.billing),
      amount: r.amount || null,
      renews: excelDate(r.renews),
    })),
  );
  services.getColumn("amount").numFmt = MONEY;
  services.getColumn("renews").numFmt = DAY;
  services.getColumn("note").alignment = { wrapText: true, vertical: "top" };

  table(
    book,
    "Passwords",
    [
      { header: "Service", key: "service", width: 26 },
      { header: "Link", key: "url", width: 34 },
      { header: "Username or email", key: "username", width: 30 },
      { header: "Password", key: "password", width: 26 },
      { header: "Note", key: "note", width: 36 },
    ],
    sheets.access,
  );
  return book;
}

/** "Client Project" as a file name: letters, digits and dashes. */
export const fileStem = (project: ExcelProject) =>
  `${project.client} ${project.title}`
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-") || "project";

export async function xlsxResponse(book: ExcelJS.Workbook, name: string) {
  const buffer = await book.xlsx.writeBuffer();
  return new Response(buffer as ArrayBuffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${name}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
