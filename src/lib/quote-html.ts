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
 * and for downloading as a Word file. Table layout and inline styles, so it
 * looks the same in a print frame and in Word.
 *
 * Parts marked data-edit open their wording field when clicked in the
 * Document tab's preview.
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
  /** What each ticked row includes, by row id, for the Scope of work. */
  scope?: Record<string, string[]>;
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
    .map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
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

const DEEP = "#0b3f57";
const BRAND = "#10688f";
const INK = "#1b2430";
const SOFT = "#4a5565";
const FAINT = "#7a8494";
const LINE = "#dfe4ea";
const WASH = "#f2f6f9";
const TINT = "#e7f1f6";
const ACCENT = "#f5a44a";

const per = (b: Billing) =>
  b === "monthly" ? " / month" : b === "yearly" ? " / year" : "";

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
  const doc = body.doc;
  const show = doc.show;
  const t = quoteTotals(body);
  const on = body.lines.filter((l) => l.on);
  const anyDiscount =
    on.some((l) => l.discount.mode !== "none" && l.discount.value > 0) ||
    t.overall > 0;
  const signer = doc.signer.trim();
  const para = (text: string) => esc(text.trim()).replace(/\n/g, "<br>");

  const heading = (text: string) =>
    `<table style="margin:26px 0 10px"><tr>
      <td style="width:4px;background:${ACCENT}"></td>
      <td style="padding-left:10px;font-size:13pt;font-weight:700;color:${DEEP}">${text}</td>
    </tr></table>`;

  // Services table ----------------------------------------------------------
  const cols = anyDiscount ? 4 : 2;
  const th = (text: string, align = "right") =>
    `<th style="text-align:${align};padding:9px 12px;font-size:8.5pt;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#ffffff">${text}</th>`;
  const td = (inner: string, extra = "") =>
    `<td style="padding:10px 12px;border-bottom:1px solid ${LINE};vertical-align:top;${extra}">${inner}</td>`;
  const money = (n: number, b: Billing) =>
    `${inr.format(n)}${b === "once" ? "" : `<span style="color:${FAINT};font-size:8.5pt">${per(b)}</span>`}`;

  let zebra = 0;
  const serviceRows = sectionsFor(body.lines, opts.sections ?? base.sections)
    .map((section) => {
      const rows = sectionRows(body.lines, section.id);
      if (rows.length === 0) return "";
      zebra = 0;
      return (
        `<tr><td colspan="${cols}" style="padding:12px 12px 6px;background:${TINT};font-size:9pt;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND}">${esc(section.label)}</td></tr>` +
        rows
          .map((r) => {
            if (r.kind === "group") {
              return `<tr><td colspan="${cols}" style="padding:10px 12px 2px;font-weight:700;color:${INK}">${esc(r.name)}</td></tr>`;
            }
            const l = r.line;
            const off = discountOf(l.price, l.discount);
            const bg = zebra++ % 2 ? `background:${WASH};` : "";
            const what = `<div style="font-weight:600;color:${INK}">${esc(l.name || "Untitled")}</div>${
              l.description && show.descriptions
                ? `<div style="color:${SOFT};font-size:9pt;margin-top:3px;line-height:1.45">${esc(l.description)}</div>`
                : ""
            }`;
            return `<tr>${td(what, `${bg}${r.sub ? "padding-left:28px;" : ""}`)}${
              anyDiscount
                ? td(
                    money(l.price, l.billing),
                    `${bg}text-align:right;white-space:nowrap;color:${SOFT}`,
                  ) +
                  td(
                    off
                      ? `-${inr.format(off)}${l.discount.mode === "percent" ? `<br><span style="font-size:8.5pt;color:${FAINT}">${l.discount.value}% off</span>` : ""}`
                      : "",
                    `${bg}text-align:right;white-space:nowrap;color:${SOFT}`,
                  )
                : ""
            }${td(money(lineTotal(l), l.billing), `${bg}text-align:right;white-space:nowrap;font-weight:700;color:${INK}`)}</tr>`;
          })
          .join("")
      );
    })
    .join("");

  const totalRow = (label: string, value: string, strong = false) =>
    strong
      ? `<tr><td style="padding:10px 14px;background:${DEEP};color:#ffffff;font-weight:700">${label}</td><td style="padding:10px 14px;background:${DEEP};color:#ffffff;text-align:right;white-space:nowrap;font-weight:800;font-size:13pt">${value}</td></tr>`
      : `<tr><td style="padding:6px 14px;color:${SOFT}">${label}</td><td style="padding:6px 14px;text-align:right;white-space:nowrap;color:${INK}">${value}</td></tr>`;
  const totals = [
    t.onceList || t.onceTotal
      ? (anyDiscount
          ? totalRow("Subtotal", inr.format(t.onceList)) +
            totalRow("Discount", `-${inr.format(t.onceSaved)}`)
          : "") + totalRow("One-time total", inr.format(t.onceTotal), true)
      : "",
    t.monthlyTotal
      ? totalRow("Monthly charges", `${inr.format(t.monthlyTotal)} / month`)
      : "",
    t.yearlyTotal
      ? totalRow("Yearly charges", `${inr.format(t.yearlyTotal)} / year`)
      : "",
  ].join("");

  // At a glance -------------------------------------------------------------
  const tile = (label: string, value: string, note = "", dark = false) =>
    `<td style="padding:0 5px;vertical-align:top">
      <div style="padding:12px 14px;border-radius:8px;${dark ? `background:${DEEP};` : `background:${WASH};border:1px solid ${LINE};`}">
        <div style="font-size:8pt;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${dark ? "#bfe3f2" : FAINT}">${label}</div>
        <div style="font-size:15pt;font-weight:800;margin-top:4px;color:${dark ? "#ffffff" : INK}">${value}</div>
        ${note ? `<div style="font-size:8.5pt;margin-top:2px;color:${dark ? "#bfe3f2" : FAINT}">${note}</div>` : ""}
      </div>
    </td>`;
  const tiles = [
    tile("One-time", inr.format(t.onceTotal), "Build and set-up", true),
    t.monthlyTotal
      ? tile("Monthly", inr.format(t.monthlyTotal), "From go-live")
      : "",
    t.yearlyTotal
      ? tile("Yearly", inr.format(t.yearlyTotal), "From go-live")
      : "",
    t.onceSaved > 0
      ? tile("You save", inr.format(t.onceSaved), "On the one-time price")
      : tile(
          "Services",
          String(on.length),
          on.length === 1 ? "item included" : "items included",
        ),
  ]
    .filter(Boolean)
    .join("");
  const summary =
    show.summary && on.length
      ? `${heading(esc(L.summary))}<table><tr>${tiles}</tr></table>`
      : "";

  // Scope of work ------------------------------------------------------------
  const scoped = on
    .map((l) => ({ line: l, items: q.scope?.[l.id] ?? [] }))
    .filter((s) => s.items.length || s.line.description);
  const scopeCard = (s: (typeof scoped)[number]) =>
    `<td style="width:50%;padding:5px;vertical-align:top">
      <div style="border:1px solid ${LINE};border-top:3px solid ${BRAND};border-radius:6px;padding:11px 13px">
        <div style="font-weight:700;color:${INK}">${esc(s.line.name)}</div>
        ${
          s.items.length
            ? `<ul style="margin:6px 0 0;padding-left:16px;color:${SOFT};font-size:9pt;line-height:1.5">${s.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`
            : `<div style="margin-top:4px;color:${SOFT};font-size:9pt;line-height:1.5">${esc(s.line.description)}</div>`
        }
      </div>
    </td>`;
  const scopePairs: string[] = [];
  for (let i = 0; i < scoped.length; i += 2) {
    scopePairs.push(
      `<tr>${scopeCard(scoped[i])}${scoped[i + 1] ? scopeCard(scoped[i + 1]) : `<td style="width:50%"></td>`}</tr>`,
    );
  }
  const scope =
    show.scope && scoped.length
      ? `${heading(esc(L.scope))}<table>${scopePairs.join("")}</table>`
      : "";

  // Understanding, next steps, terms -----------------------------------------
  const understandingPoints = points(doc.understanding);
  const understanding =
    show.understanding && understandingPoints.length
      ? `<div data-edit="understanding">${heading(esc(L.understanding))}
        <div style="background:${WASH};border-radius:8px;padding:12px 16px">
          <ul style="margin:0;padding-left:18px;color:${SOFT};line-height:1.6">${understandingPoints.map((p) => `<li style="margin:2px 0">${esc(p)}</li>`).join("")}</ul>
        </div></div>`
      : "";

  const steps = points(doc.nextSteps);
  const nextSteps =
    show.nextSteps && steps.length
      ? `<div data-edit="nextSteps">${heading(esc(L.nextSteps))}<table>${steps
          .map(
            (s, i) => `<tr>
              <td style="width:30px;padding:5px 0;vertical-align:top">
                <div style="width:22px;height:22px;line-height:22px;border-radius:11px;background:${BRAND};color:#ffffff;text-align:center;font-size:9pt;font-weight:700">${i + 1}</div>
              </td>
              <td style="padding:6px 0 6px 6px;color:${SOFT};vertical-align:top">${esc(s)}</td>
            </tr>`,
          )
          .join("")}</table></div>`
      : "";

  const termPoints = points(doc.terms);
  const terms =
    show.terms && termPoints.length
      ? `<div data-edit="terms">${heading(esc(L.notes))}<ol style="margin:0;padding-left:20px;color:${SOFT};font-size:9pt;line-height:1.6">${termPoints
          .map((p) => `<li style="margin:2px 0">${esc(p)}</li>`)
          .join("")}</ol></div>`
      : "";

  // Contact and acceptance -----------------------------------------------------
  const contact = `<table data-edit="closing" style="margin-top:26px;background:${TINT};border-radius:8px"><tr>
    <td style="padding:16px 18px;vertical-align:top">
      <div style="font-weight:700;color:${DEEP};font-size:11.5pt">Questions? We are here to help.</div>
      ${doc.closing.trim() ? `<div style="margin-top:4px;color:${SOFT}">${para(doc.closing)}</div>` : ""}
    </td>
    <td style="padding:16px 18px;vertical-align:top;text-align:right;white-space:nowrap;color:${INK};font-size:9.5pt">
      <div><span style="color:${FAINT}">Email</span>&nbsp; ${esc(studio.email)}</div>
      <div style="margin-top:3px"><span style="color:${FAINT}">Phone</span>&nbsp; ${esc(studio.phone)}</div>
      <div style="margin-top:3px"><span style="color:${FAINT}">Web</span>&nbsp; nectarray.com</div>
    </td>
  </tr></table>`;

  const acceptance = show.signatures
    ? `<div data-edit="signatures">${heading("Acceptance")}
      <p style="margin:0 0 6px;color:${SOFT};font-size:9.5pt">By signing below, both parties agree to the services and prices in this quotation.</p>
      <table style="margin-top:34px"><tr>
        <td style="width:50%;vertical-align:bottom;padding-right:28px">
          <div style="border-top:1px solid ${INK};padding-top:6px;font-weight:700;color:${INK}">${esc(L.signOurs)}</div>
          <div style="color:${FAINT};font-size:9pt">${signer ? `${esc(signer)}${doc.signerRole.trim() ? `, ${esc(doc.signerRole.trim())}` : ""}` : "Authorised signatory"}</div>
        </td>
        <td style="width:50%;vertical-align:bottom">
          <div style="border-top:1px solid ${INK};padding-top:6px;font-weight:700;color:${INK}">${esc(L.signClient)} ${esc(q.company)}</div>
          <div style="color:${FAINT};font-size:9pt">Name, signature and date</div>
        </td>
      </tr></table></div>`
    : "";

  const to = [
    q.contactName && `<div style="color:${INK}">${esc(q.contactName)}</div>`,
    q.phone && `<div>${esc(q.phone)}</div>`,
    q.email && `<div>${esc(q.email)}</div>`,
  ]
    .filter(Boolean)
    .join("");
  const greeting = q.contactName.trim()
    ? `Dear ${esc(q.contactName.trim())},`
    : "Dear Sir or Madam,";
  const meta = (label: string, value: string, last = false) =>
    `<td style="padding:10px 14px;vertical-align:top;${last ? "" : `border-right:1px solid ${LINE}`}">
      <div style="font-size:7.5pt;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${FAINT}">${label}</div>
      <div style="margin-top:2px;font-weight:600;color:${INK}">${value}</div>
    </td>`;

  return `<!doctype html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>${esc(`${q.number} ${q.company}`)}</title>
<style>
  @page { size: A4; margin: 14mm 14mm 16mm; }
  body { font-family: "Segoe UI", Arial, Helvetica, sans-serif; font-size: 10pt; line-height: 1.5; color: ${INK}; margin: 0; }
  table { border-collapse: collapse; width: 100%; }
  tr, li { page-break-inside: avoid; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; box-sizing: border-box; }
  @media screen {
    body { padding: 36px 44px; }
    [data-edit] { cursor: pointer; border-radius: 6px; transition: background-color .15s; }
    [data-edit]:hover { background: #eef6fa; outline: 1px dashed #10688f99; outline-offset: 4px; }
  }
</style>
</head>
<body>

<table style="background:${DEEP}"><tr>
  <td style="padding:20px 22px;vertical-align:middle">
    <table style="width:auto"><tr>
      ${opts.logo ? `<td style="padding-right:12px;vertical-align:middle"><div style="background:#ffffff;border-radius:8px;padding:5px 6px"><img src="${esc(opts.logo)}" width="38" height="34" alt=""></div></td>` : ""}
      <td style="vertical-align:middle">
        <div style="font-size:19pt;font-weight:800;color:#ffffff;letter-spacing:-0.02em">${esc(studio.name)}</div>
        <div style="color:#bfe3f2;font-size:8.5pt">${esc(studio.tagline)}</div>
      </td>
    </tr></table>
  </td>
  <td style="padding:20px 22px;vertical-align:middle;text-align:right">
    <div style="font-size:21pt;font-weight:800;color:#ffffff;letter-spacing:0.12em;text-transform:uppercase">${esc(L.title)}</div>
    <div style="color:${ACCENT};font-weight:700;font-size:10pt;margin-top:2px">${esc(q.number)}</div>
  </td>
</tr></table>

<table style="margin-top:12px;border:1px solid ${LINE}"><tr>
  ${meta("Date", longDate(q.quoteDate))}
  ${meta("Valid until", validUntil(q.quoteDate, body.validDays))}
  ${meta("Prepared by", signer ? `${esc(signer)}, ${esc(studio.name)}` : esc(studio.name))}
  ${meta("Phone", esc(studio.phone), true)}
</tr></table>

<table style="margin-top:14px"><tr>
  <td style="width:50%;padding-right:7px;vertical-align:top">
    <div style="border:1px solid ${LINE};border-radius:8px;padding:12px 14px">
      <div style="font-size:7.5pt;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${FAINT}">${esc(L.preparedFor)}</div>
      <div style="font-size:12.5pt;font-weight:700;color:${INK};margin-top:3px">${esc(q.company)}</div>
      <div style="color:${SOFT};font-size:9.5pt;margin-top:2px">${to}</div>
    </div>
  </td>
  <td style="width:50%;padding-left:7px;vertical-align:top">
    <div style="border:1px solid ${LINE};border-radius:8px;padding:12px 14px;background:${WASH}">
      <div style="font-size:7.5pt;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${FAINT}">${esc(L.project)}</div>
      <div style="font-size:12.5pt;font-weight:700;color:${INK};margin-top:3px">${esc(q.title || "Proposed services")}</div>
      <div style="color:${SOFT};font-size:9.5pt;margin-top:2px">${on.length} ${on.length === 1 ? "service" : "services"} included</div>
    </div>
  </td>
</tr></table>

<div data-edit="intro" style="margin-top:20px">
  <p style="margin:0;color:${INK};font-weight:600">${greeting}</p>
  ${doc.intro.trim() ? `<p style="margin:8px 0 0;color:${SOFT};line-height:1.65">${para(doc.intro)}</p>` : ""}
</div>

${summary}

${heading(esc(L.services))}
${
  on.length
    ? `<table style="border:1px solid ${LINE}">
  <tr style="background:${DEEP}">${th("Service", "left")}${anyDiscount ? th("Price") + th("Discount") : ""}${th("Amount")}</tr>
  ${serviceRows}
</table>
<table style="width:55%;margin:12px 0 0 auto;border:1px solid ${LINE}">${totals}</table>`
    : `<p style="color:${FAINT}">No services selected yet.</p>`
}

${scope}
${understanding}
${nextSteps}
${terms}
${contact}
${acceptance}

<table style="margin-top:30px;border-top:1px solid ${LINE}"><tr>
  <td style="padding-top:8px;color:${FAINT};font-size:8pt">${esc(studio.name)} · ${esc(studio.email)} · ${esc(studio.phone)} · nectarray.com</td>
  <td style="padding-top:8px;color:${FAINT};font-size:8pt;text-align:right">Thank you for considering ${esc(studio.name)}.</td>
</tr></table>
</body>
</html>`;
}
