import { company as studio } from "@/lib/content/site";
import { quoteTotals, type QuoteBody, type QuoteLine } from "@/lib/quotes";
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
 * Document tab's preview. With `adding`, the preview also gets controls to
 * add a row to a section, add a paragraph between parts, or take a row
 * off; they are marked data-ui and never print.
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

export function quoteHtml(
  q: QuoteDocData,
  opts: {
    logo?: string;
    /** From the Template tab; the built-in ones when left out. */
    sections?: QuoteSectionDef[];
    labels?: QuoteLabels;
    /**
     * Which parts can be typed on in the preview (see EditField). Left out,
     * nothing can, as when printing or saving the Word file.
     */
    editable?: (field: string) => boolean;
    /** Show the add-a-row and add-text controls (see the data-ui note). */
    adding?: boolean;
  } = {},
) {
  const base = defaultTemplate();
  const { body } = q;
  const doc = body.doc;
  // A quote's own headings, typed on its page, over the template's.
  const L: QuoteLabels = {
    ...base.labels,
    ...(opts.labels ?? {}),
    ...(doc.labels ?? {}),
  };
  const show = doc.show;
  const t = quoteTotals(body);
  const on = body.lines.filter((l) => l.on);
  const signer = doc.signer.trim();
  const para = (text: string) => esc(text.trim()).replace(/\n/g, "<br>");
  /** The attributes that let a part be typed on, when it may be. */
  const E = (field: string, list = false) =>
    opts.editable?.(field)
      ? ` data-field="${esc(field)}"${list ? ' data-list="1"' : ""} contenteditable="true" spellcheck="true"`
      : "";
  const lab = (key: keyof QuoteLabels) =>
    `<span${E(`label:${key}`)}>${esc(L[key])}</span>`;
  /**
   * A worked-out part (an amount, a date, a note) that can be typed over
   * for this quote; what is typed is kept with its headings.
   */
  const own = (key: string, made: string) =>
    `<span${E(`label:${key}`)}>${esc(doc.labels?.[key] ?? made)}</span>`;
  const owned = (key: string, made: string) =>
    (doc.labels?.[key] ?? made) !== "" || E(`label:${key}`) !== "";

  // Paragraphs typed onto the page, each after the part it was added to.
  const notesAt = (slot: string) =>
    (doc.notes ?? [])
      .filter((n) => n.after === slot && (n.text.trim() || E(`note:${n.id}`)))
      .map(
        (n) =>
          `<p${E(`note:${n.id}`)} style="margin:10px 0 0;color:${SOFT};line-height:1.6">${para(n.text)}</p>`,
      )
      .join("");
  const addText = (slot: string) =>
    opts.adding
      ? `<div data-ui="text:${slot}" class="ui-add" title="Add a paragraph here">+ Add text</div>`
      : "";
  /** What goes after a part: the paragraphs typed there, and the control. */
  const after = (slot: string) => notesAt(slot) + addText(slot);

  const heading = (text: string) =>
    `<table style="margin:26px 0 10px"><tr>
      <td style="width:4px;background:${ACCENT}"></td>
      <td style="padding-left:10px;font-size:14pt;font-weight:700;color:${DEEP}">${text}</td>
    </tr></table>`;

  // Services table: what is included, without a price on each row; the
  // client sees only the final development and maintenance costs.
  const th = (text: string) =>
    `<th style="text-align:left;padding:9px 12px;font-size:9.5pt;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#ffffff">${text}</th>`;
  const td = (inner: string, extra = "") =>
    `<td style="padding:10px 12px;border-bottom:1px solid ${LINE};vertical-align:top;${extra}">${inner}</td>`;

  // Each section numbered (1. Build), and each service within it (1.1, 1.2).
  let zebra = 0;
  let sectionNo = 0;
  const serviceRows = sectionsFor(body.lines, opts.sections ?? base.sections)
    .map((section) => {
      const rows = sectionRows(body.lines, section.id);
      if (rows.length === 0) return "";
      zebra = 0;
      const n = ++sectionNo;
      let k = 0;
      return (
        `<tr><td colspan="2" style="padding:12px 12px 6px;background:${TINT};font-size:10pt;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND}">${n}.&nbsp; <span${E(`section:${section.id}`)}>${esc(section.label)}</span></td></tr>` +
        rows
          .map((r) => {
            if (r.kind === "group") {
              return `<tr><td colspan="2" style="padding:10px 12px 2px;font-weight:700;color:${INK}"><span${E(`group:${r.key}`)}>${esc(r.name)}</span></td></tr>`;
            }
            const l = r.line;
            const bg = zebra++ % 2 ? `background:${WASH};` : "";
            const what = `<div${E(`line:${l.id}:name`)} style="font-weight:600;color:${INK}">${esc(l.name || (E(`line:${l.id}:name`) ? "" : "Untitled"))}</div>${
              show.descriptions &&
              (l.description || E(`line:${l.id}:description`))
                ? `<div${E(`line:${l.id}:description`)} style="color:${SOFT};font-size:10pt;margin-top:3px;line-height:1.45">${esc(l.description)}</div>`
                : ""
            }`;
            const drop = opts.adding
              ? ` <span data-ui="drop:${esc(l.id)}" class="ui-drop" title="Take this row off the quote">&times;</span>`
              : "";
            return `<tr>${td(`${n}.${++k}${drop}`, `${bg}width:44px;padding-right:0;font-weight:600;color:${BRAND};white-space:nowrap;${r.sub ? "padding-left:28px;width:60px;" : ""}`)}${td(what, bg)}</tr>`;
          })
          .join("") +
        (opts.adding
          ? `<tr data-ui="row:${esc(section.id)}"><td colspan="2" class="ui-add ui-row">+ Add a row to ${esc(section.label)} (${n}.${k + 1})</td></tr>`
          : "")
      );
    })
    .join("");

  const totalRow = (label: string, value: string, strong = false) =>
    strong
      ? `<tr><td style="padding:10px 14px;background:${DEEP};color:#ffffff;font-weight:700">${label}</td><td style="padding:10px 14px;background:${DEEP};color:#ffffff;text-align:right;white-space:nowrap;font-weight:800;font-size:14pt">${value}</td></tr>`
      : `<tr><td style="padding:6px 14px;color:${SOFT}">${label}</td><td style="padding:6px 14px;text-align:right;white-space:nowrap;color:${INK}">${value}</td></tr>`;
  // Maintenance with no charge on the quote shows as free, with the note.
  const freeCare = !t.monthlyTotal && !t.yearlyTotal;
  const totals = [
    totalRow(lab("devCost"), own("totalDev", inr.format(t.onceTotal)), true),
    t.monthlyTotal
      ? totalRow(
          lab("maintenance"),
          own("totalMonthly", `${inr.format(t.monthlyTotal)} / month`),
        )
      : "",
    t.yearlyTotal
      ? totalRow(
          lab("maintenance"),
          own("totalYearly", `${inr.format(t.yearlyTotal)} / year`),
        )
      : "",
    freeCare ? totalRow(lab("maintenance"), own("totalFree", "Free*")) : "",
  ].join("");

  // At a glance: the development cost and the maintenance charges ----------
  const tile = (label: string, value: string, note = "", dark = false) =>
    `<td style="width:50%;padding:0 5px;vertical-align:top">
      <div style="padding:12px 14px;border-radius:8px;${dark ? `background:${DEEP};` : `background:${WASH};border:1px solid ${LINE};`}">
        <div style="font-size:9pt;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${dark ? "#bfe3f2" : FAINT}">${label}</div>
        <div style="font-size:16pt;font-weight:800;margin-top:4px;color:${dark ? "#ffffff" : INK}">${value}</div>
        ${note ? `<div style="font-size:9.5pt;margin-top:2px;color:${dark ? "#bfe3f2" : FAINT}">${note}</div>` : ""}
      </div>
    </td>`;
  const care = [
    t.monthlyTotal ? `${inr.format(t.monthlyTotal)} / month` : "",
    t.yearlyTotal ? `${inr.format(t.yearlyTotal)} / year` : "",
  ]
    .filter(Boolean)
    .join(" + ");
  const tiles =
    tile(
      lab("devCost"),
      own("devCostValue", inr.format(t.onceTotal)),
      owned("devCostNote", "Paid once") ? own("devCostNote", "Paid once") : "",
      true,
    ) +
    tile(
      lab("maintenance"),
      own("careValue", care || "Free*"),
      owned("careNote", care ? "From go-live" : "")
        ? own("careNote", care ? "From go-live" : "")
        : "",
    );
  const note = doc.summaryNote.trim();
  const summary =
    show.summary && on.length
      ? `${heading(lab("summary"))}<table><tr>${tiles}</tr></table>${
          note || E("doc:summaryNote")
            ? `<p${E("doc:summaryNote")} style="margin:8px 5px 0;color:${SOFT};font-size:10pt;line-height:1.5">${para(note)}</p>`
            : ""
        }${after("summary")}`
      : "";

  // Scope of work ------------------------------------------------------------
  const scoped = on
    .map((l) => ({ line: l, items: q.scope?.[l.id] ?? [] }))
    .filter((s) => s.items.length || s.line.description);
  const scopeCard = (s: (typeof scoped)[number]) =>
    `<td style="width:50%;padding:5px;vertical-align:top">
      <div style="border:1px solid ${LINE};border-top:3px solid ${BRAND};border-radius:6px;padding:11px 13px">
        <div${E(`line:${s.line.id}:name`)} style="font-weight:700;color:${INK}">${esc(s.line.name)}</div>
        ${
          s.items.length || E(`scope:${s.line.id}`)
            ? `<ul${E(`scope:${s.line.id}`, true)} style="margin:6px 0 0;padding-left:16px;color:${SOFT};font-size:10pt;line-height:1.5">${(s.items.length ? s.items : [s.line.description]).map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`
            : `<div style="margin-top:4px;color:${SOFT};font-size:10pt;line-height:1.5">${esc(s.line.description)}</div>`
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
      ? `${heading(lab("scope"))}<table>${scopePairs.join("")}</table>${after("scope")}`
      : "";

  // Terms -------------------------------------------------------------------
  const termPoints = points(doc.terms);
  const terms =
    show.terms && (termPoints.length || E("doc:terms"))
      ? `<div data-edit="terms">${heading(lab("notes"))}<ol${E("doc:terms", true)} style="margin:0;padding-left:20px;color:${SOFT};font-size:10pt;line-height:1.6">${(termPoints.length
          ? termPoints
          : [""]
        )
          .map((p) => `<li style="margin:2px 0">${esc(p)}</li>`)
          .join("")}</ol></div>${after("terms")}`
      : "";

  // Contact and acceptance -----------------------------------------------------
  const contact = `<table data-edit="closing" style="margin-top:26px;background:${TINT};border-radius:8px"><tr>
    <td style="padding:16px 18px;vertical-align:top">
      <div style="font-weight:700;color:${DEEP};font-size:12.5pt">${lab("questions")}</div>
      ${doc.closing.trim() || E("doc:closing") ? `<div${E("doc:closing")} style="margin-top:4px;color:${SOFT}">${para(doc.closing)}</div>` : ""}
    </td>
    <td style="padding:16px 18px;vertical-align:top;text-align:right;white-space:nowrap;color:${INK};font-size:10.5pt">
      <div><span style="color:${FAINT}">Email</span>&nbsp; ${own("contactEmail", studio.email)}</div>
      <div style="margin-top:3px"><span style="color:${FAINT}">Phone</span>&nbsp; ${own("contactPhone", studio.phone)}</div>
      <div style="margin-top:3px"><span style="color:${FAINT}">Web</span>&nbsp; ${own("contactWeb", "nectarray.com")}</div>
    </td>
  </tr></table>`;

  const acceptance = show.signatures
    ? `<div data-edit="signatures">${heading(lab("acceptance"))}
      <p style="margin:0 0 6px;color:${SOFT};font-size:10.5pt">${lab("acceptanceNote")}</p>
      <table style="margin-top:34px"><tr>
        <td style="width:50%;vertical-align:bottom;padding-right:28px">
          <div style="border-top:1px solid ${INK};padding-top:6px;font-weight:700;color:${INK}">${lab("signOurs")}</div>
          <div style="color:${FAINT};font-size:10pt">${own("signerLine", signer ? `${signer}${doc.signerRole.trim() ? `, ${doc.signerRole.trim()}` : ""}` : "Authorised signatory")}</div>
        </td>
        <td style="width:50%;vertical-align:bottom">
          <div style="border-top:1px solid ${INK};padding-top:6px;font-weight:700;color:${INK}">${lab("signClient")} ${esc(q.company)}</div>
          <div style="color:${FAINT};font-size:10pt">${own("clientSignNote", "Name, signature and date")}</div>
        </td>
      </tr></table></div>${after("acceptance")}`
    : "";

  const to = (
    [
      ["contactName", q.contactName, `color:${INK}`],
      ["phone", q.phone, ""],
      ["email", q.email, ""],
    ] as const
  )
    .filter(([key, value]) => value || E(`meta:${key}`))
    .map(
      ([key, value, style]) =>
        `<div${E(`meta:${key}`)} style="${style}">${esc(value)}</div>`,
    )
    .join("");
  // The contact person by name, else the company.
  const greeting = own(
    "greeting",
    `Dear ${q.contactName.trim() || q.company.trim() || "Sir or Madam"},`,
  );
  const meta = (label: string, value: string, last = false) =>
    `<td style="padding:10px 14px;vertical-align:top;${last ? "" : `border-right:1px solid ${LINE}`}">
      <div style="font-size:8.5pt;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${FAINT}">${label}</div>
      <div style="margin-top:2px;font-weight:600;color:${INK}">${value}</div>
    </td>`;

  return `<!doctype html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>${esc(`${q.number} ${q.company}`)}</title>
<style>
  @page { size: A4; margin: 14mm 14mm 16mm; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; line-height: 1.5; color: ${INK}; margin: 0; }
  table { border-collapse: collapse; width: 100%; }
  tr, li { page-break-inside: avoid; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; box-sizing: border-box; }
  @media screen {
    body { padding: 36px 44px; }
    [data-edit] { cursor: pointer; border-radius: 6px; transition: background-color .15s; }
    [data-edit]:hover { background: #eef6fa; outline: 1px dashed #10688f99; outline-offset: 4px; }
    [contenteditable] { cursor: text; border-radius: 3px; }
    [contenteditable]:hover { outline: 1px dashed #10688f99; outline-offset: 2px; }
    [contenteditable]:focus { outline: 2px solid #10688f; outline-offset: 2px; background: #ffffff; color: ${INK}; }
    [contenteditable]:empty::before { content: "Type here"; color: ${FAINT}; }
    .ui-add { cursor: pointer; color: ${BRAND}; font-size: 9.5pt; font-weight: 700; opacity: .45; transition: opacity .15s; user-select: none; }
    div.ui-add { margin: 6px 0 0; padding: 3px 0; border-top: 1px dashed #10688f55; text-align: center; }
    .ui-add:hover, tr[data-ui]:hover .ui-add { opacity: 1; background: #eef6fa; }
    td.ui-row { padding: 7px 12px; border-bottom: 1px solid ${LINE}; }
    .ui-drop { cursor: pointer; color: ${FAINT}; font-weight: 700; opacity: 0; padding: 0 3px; }
    tr:hover .ui-drop { opacity: 1; }
    .ui-drop:hover { color: #c0392b; }
  }
  @media print { [data-ui] { display: none !important; } }
</style>
</head>
<body>

<table style="background:${DEEP}"><tr>
  <td style="padding:20px 22px;vertical-align:middle">
    <table style="width:auto"><tr>
      ${opts.logo ? `<td style="padding-right:12px;vertical-align:middle"><div style="background:#ffffff;border-radius:8px;padding:5px 6px"><img src="${esc(opts.logo)}" width="38" height="34" alt=""></div></td>` : ""}
      <td style="vertical-align:middle">
        <div style="font-size:20pt;font-weight:800;color:#ffffff;letter-spacing:-0.02em">${own("studioName", studio.name)}</div>
        <div style="color:#bfe3f2;font-size:9.5pt">${own("studioTagline", studio.tagline)}</div>
      </td>
    </tr></table>
  </td>
  <td style="padding:20px 22px;vertical-align:middle;text-align:right">
    <div style="font-size:22pt;font-weight:800;color:#ffffff;letter-spacing:0.12em;text-transform:uppercase">${lab("title")}</div>
  </td>
</tr></table>

<table style="margin-top:12px;border:1px solid ${LINE}"><tr>
  ${meta(own("dateLabel", "Date"), own("dateValue", longDate(q.quoteDate)))}
  ${meta(own("validLabel", "Valid until"), own("validValue", validUntil(q.quoteDate, body.validDays)))}
  ${meta(own("phoneLabel", "Phone"), own("phoneValue", studio.phone), true)}
</tr></table>

<table style="margin-top:14px"><tr>
  <td style="width:50%;padding-right:7px;vertical-align:top">
    <div style="border:1px solid ${LINE};border-radius:8px;padding:12px 14px">
      <div style="font-size:8.5pt;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${FAINT}">${lab("preparedFor")}</div>
      <div${E("meta:company")} style="font-size:13.5pt;font-weight:700;color:${INK};margin-top:3px">${esc(q.company)}</div>
      <div style="color:${SOFT};font-size:10.5pt;margin-top:2px">${to}</div>
    </div>
  </td>
  <td style="width:50%;padding-left:7px;vertical-align:top">
    <div style="border:1px solid ${LINE};border-radius:8px;padding:12px 14px;background:${WASH}">
      <div style="font-size:8.5pt;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${FAINT}">${lab("project")}</div>
      <div${E("meta:title")} style="font-size:13.5pt;font-weight:700;color:${INK};margin-top:3px">${esc(q.title || (E("meta:title") ? "" : "Proposed services"))}</div>
    </div>
  </td>
</tr></table>

<div data-edit="intro" style="margin-top:20px">
  <p style="margin:0;color:${INK};font-weight:600">${greeting}</p>
  ${doc.intro.trim() || E("doc:intro") ? `<p${E("doc:intro")} style="margin:8px 0 0;color:${SOFT};line-height:1.65">${para(doc.intro)}</p>` : ""}
</div>
${after("intro")}

${summary}

${heading(lab("services"))}
${
  on.length
    ? `<table style="border:1px solid ${LINE}">
  <tr style="background:${DEEP}">${th(own("headNo", "#"))}${th(own("headService", "Service"))}</tr>
  ${serviceRows}
</table>
<table style="width:60%;margin:12px 0 0 auto;border:1px solid ${LINE}">${totals}</table>${after("totals")}`
    : `<p style="color:${FAINT}">No services selected yet.</p>`
}

${scope}
${terms}
${contact}${after("contact")}
${acceptance}

<table style="margin-top:30px;border-top:1px solid ${LINE}"><tr>
  <td style="padding-top:8px;color:${FAINT};font-size:9pt">${own("footer", `${studio.name} · ${studio.email} · ${studio.phone} · nectarray.com`)}</td>
  <td style="padding-top:8px;color:${FAINT};font-size:9pt;text-align:right">${lab("thanks")}</td>
</tr></table>
</body>
</html>`;
}
