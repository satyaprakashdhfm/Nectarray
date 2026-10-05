import { company as studio } from "@/lib/content/site";
import {
  discountOf,
  lineTotal,
  quoteTotals,
  type Billing,
  type QuoteBody,
  type QuoteLine,
} from "@/lib/quotes";
import {
  defaultTemplate,
  sectionsFor,
  type QuoteLabels,
  type QuoteSectionDef,
} from "@/lib/quote-template";

/**
 * A quote as one standalone HTML page, for printing (and so saving as PDF)
 * and for downloading as a Word file. Inline styles only, so it looks the
 * same in a print frame and in Word.
 */

export type QuoteDocData = {
  number: string;
  title: string;
  company: string;
  contactName: string;
  phone: string;
  email: string;
  quoteDate: string;
  body: QuoteBody;
};

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export function validUntil(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Lines of text as points, dropping blanks and any bullet already typed. */
export const points = (text: string) =>
  text
    .split("\n")
    .map((l) => l.replace(/^\s*[-*•]\s*/, "").trim())
    .filter(Boolean);

/** The ticked rows of one section, with the group headings between them. */
export function sectionRows(lines: QuoteLine[], section: string) {
  const rows: (
    | { kind: "group"; name: string; key: string }
    | { kind: "line"; line: QuoteLine; sub: boolean }
  )[] = [];
  let group: string | null = null;
  for (const line of lines) {
    if (!line.on || line.section !== section) continue;
    if (line.groupId && line.groupId !== group) {
      rows.push({
        kind: "group",
        name: line.groupName || "Options",
        key: line.groupId,
      });
    }
    group = line.groupId;
    rows.push({ kind: "line", line, sub: Boolean(line.groupId) });
  }
  return rows;
}

const INK = "#1b2430";
const SOFT = "#4a5565";
const FAINT = "#7a8494";
const LINE = "#dfe4ea";
const BRAND = "#10688f";
const WASH = "#f2f6f9";

export function quoteHtml(
  q: QuoteDocData,
  opts: {
    logo?: string;
    /** From the Template tab; the built-in ones when left out. */
    sections?: QuoteSectionDef[];
    labels?: QuoteLabels;
  } = {},
) {
  const base = defaultTemplate();
  const L = opts.labels ?? base.labels;
  const { body } = q;
  const t = quoteTotals(body);
  const on = body.lines.filter((l) => l.on);
  const anyDiscount =
    on.some((l) => l.discount.mode !== "none" && l.discount.value > 0) ||
    t.overall > 0;

  const cell = (s: string, extra = "") =>
    `<td style="padding:8px 10px;border-bottom:1px solid ${LINE};vertical-align:top;${extra}">${s}</td>`;
  const money = (n: number, billing: Billing) =>
    `${inr.format(n)}${billing === "once" ? "" : `<span style="color:${FAINT};font-size:9pt"> /${billing === "monthly" ? "month" : "year"}</span>`}`;

  const tableRows = sectionsFor(q.body.lines, opts.sections ?? base.sections)
    .map((section) => {
      const rows = sectionRows(body.lines, section.id);
      if (rows.length === 0) return "";
      const span = anyDiscount ? 4 : 2;
      const head = `<tr><td colspan="${span}" style="padding:14px 10px 6px;font-weight:700;color:${BRAND};font-size:10pt;letter-spacing:0.04em;text-transform:uppercase">${esc(section.label)}</td></tr>`;
      return (
        head +
        rows
          .map((r) => {
            if (r.kind === "group") {
              return `<tr><td colspan="${span}" style="padding:8px 10px 2px;font-weight:700;color:${INK}">${esc(r.name)}</td></tr>`;
            }
            const l = r.line;
            const off = discountOf(l.price, l.discount);
            const what = `<div style="font-weight:600;color:${INK}">${esc(l.name || "Untitled")}</div>${
              l.description
                ? `<div style="color:${SOFT};font-size:9.5pt;margin-top:2px">${esc(l.description)}</div>`
                : ""
            }`;
            const indent = r.sub ? "padding-left:24px;" : "";
            return `<tr>${cell(what, indent)}${
              anyDiscount
                ? cell(
                    money(l.price, l.billing),
                    "text-align:right;white-space:nowrap",
                  ) +
                  cell(
                    off
                      ? `-${inr.format(off)}${l.discount.mode === "percent" ? ` (${l.discount.value}%)` : ""}`
                      : "",
                    `text-align:right;white-space:nowrap;color:${SOFT}`,
                  )
                : ""
            }${cell(money(lineTotal(l), l.billing), `text-align:right;white-space:nowrap;font-weight:600;color:${INK}`)}</tr>`;
          })
          .join("")
      );
    })
    .join("");

  const totalRow = (label: string, value: string, strong = false) =>
    `<tr><td style="padding:5px 10px;color:${strong ? INK : SOFT};${strong ? "font-weight:700;" : ""}">${label}</td><td style="padding:5px 10px;text-align:right;white-space:nowrap;color:${INK};${strong ? "font-weight:700;font-size:12pt;" : ""}">${value}</td></tr>`;

  const totals = [
    t.onceSubtotal || t.onceList
      ? anyDiscount
        ? totalRow("One-time price", inr.format(t.onceList)) +
          totalRow("Discount", `-${inr.format(t.onceSaved)}`) +
          totalRow("One-time total", inr.format(t.onceTotal), true)
        : totalRow("One-time total", inr.format(t.onceTotal), true)
      : "",
    t.monthlyTotal
      ? totalRow(
          "Monthly charges",
          `${inr.format(t.monthlyTotal)} a month`,
          true,
        )
      : "",
    t.yearlyTotal
      ? totalRow("Yearly charges", `${inr.format(t.yearlyTotal)} a year`, true)
      : "",
  ].join("");

  const list = (text: string) => {
    const items = points(text);
    return items.length
      ? `<ul style="margin:6px 0 0;padding-left:20px;color:${SOFT}">${items
          .map((p) => `<li style="margin:3px 0">${esc(p)}</li>`)
          .join("")}</ul>`
      : "";
  };
  const heading = (s: string) =>
    `<h2 style="font-size:12pt;color:${INK};margin:22px 0 4px">${s}</h2>`;

  const to = [
    q.contactName && `Attn: ${esc(q.contactName)}`,
    q.phone && esc(q.phone),
    q.email && esc(q.email),
  ]
    .filter(Boolean)
    .join("<br>");

  const understanding = list(body.doc.understanding);
  const terms = list(body.doc.terms);

  return `<!doctype html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>${esc(`${q.number} ${q.company}`)}</title>
<style>
  @page { size: A4; margin: 16mm 15mm; }
  body { font-family: "Segoe UI", Arial, Helvetica, sans-serif; font-size: 10.5pt; line-height: 1.45; color: ${INK}; margin: 0; }
  table { border-collapse: collapse; width: 100%; }
  tr { page-break-inside: avoid; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @media screen { body { padding: 44px 50px; } }
</style>
</head>
<body>
<table><tr>
  <td style="vertical-align:top">
    <table style="width:auto"><tr>
      ${opts.logo ? `<td style="padding-right:10px;vertical-align:middle"><img src="${esc(opts.logo)}" width="44" height="39" alt=""></td>` : ""}
      <td style="vertical-align:middle">
        <div style="font-size:20pt;font-weight:800;color:${BRAND};letter-spacing:-0.02em">${esc(studio.name)}</div>
        <div style="color:${FAINT};font-size:9pt">${esc(studio.tagline)}</div>
      </td>
    </tr></table>
  </td>
  <td style="vertical-align:top;text-align:right;color:${SOFT};font-size:9.5pt">
    ${esc(studio.email)}<br>${esc(studio.phone)}<br>Bengaluru, India
  </td>
</tr></table>

<div style="border-top:2px solid ${BRAND};margin:14px 0 18px"></div>

<table><tr>
  <td style="vertical-align:top;width:55%">
    <div style="color:${FAINT};font-size:9pt;text-transform:uppercase;letter-spacing:0.06em">${esc(L.preparedFor)}</div>
    <div style="font-size:13pt;font-weight:700;margin-top:2px">${esc(q.company)}</div>
    <div style="color:${SOFT};margin-top:2px">${to}</div>
  </td>
  <td style="vertical-align:top;text-align:right">
    <div style="font-size:18pt;font-weight:800;color:${INK}">${esc(L.title)}</div>
    <div style="color:${SOFT}">${esc(q.number)}</div>
    <div style="color:${SOFT}">Date: ${longDate(q.quoteDate)}</div>
    <div style="color:${SOFT}">Valid until: ${validUntil(q.quoteDate, body.validDays)}</div>
  </td>
</tr></table>

${q.title ? `<div style="margin-top:18px;padding:10px 12px;background:${WASH};border-left:3px solid ${BRAND}"><span style="color:${FAINT}">${esc(L.project)}:</span> <strong>${esc(q.title)}</strong></div>` : ""}

${body.doc.intro.trim() ? `<p style="margin:16px 0 0;color:${SOFT}">${esc(body.doc.intro.trim()).replace(/\n/g, "<br>")}</p>` : ""}

${heading(esc(L.services))}
${
  on.length
    ? `<table style="margin-top:4px">
  <tr style="background:${WASH}">
    <th style="text-align:left;padding:7px 10px;font-size:9pt;color:${SOFT}">Service</th>
    ${anyDiscount ? `<th style="text-align:right;padding:7px 10px;font-size:9pt;color:${SOFT}">Price</th><th style="text-align:right;padding:7px 10px;font-size:9pt;color:${SOFT}">Discount</th>` : ""}
    <th style="text-align:right;padding:7px 10px;font-size:9pt;color:${SOFT}">Amount</th>
  </tr>
  ${tableRows}
</table>
<table style="width:58%;margin:10px 0 0 auto">${totals}</table>`
    : `<p style="color:${FAINT}">No services selected yet.</p>`
}

${understanding ? heading(esc(L.understanding)) + understanding : ""}
${terms ? heading(esc(L.notes)) + terms : ""}

<table style="margin-top:44px"><tr>
  <td style="width:50%;vertical-align:bottom;padding-right:24px">
    <div style="border-top:1px solid ${INK};padding-top:6px;width:80%">${esc(L.signOurs)}</div>
  </td>
  <td style="width:50%;vertical-align:bottom">
    <div style="border-top:1px solid ${INK};padding-top:6px;width:80%">${esc(L.signClient)} ${esc(q.company)}</div>
  </td>
</tr></table>
</body>
</html>`;
}
