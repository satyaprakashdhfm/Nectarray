import {
  DEFAULT_DOC,
  cleanDoc,
  QUOTE_SECTIONS,
  type QuoteDoc,
  type QuoteLine,
} from "@/lib/quotes";

/**
 * The quotation template: the sections rows are grouped into, the headings
 * on the printed quote, and the wording a new quote starts with. Edited on
 * the Template tab; every quote reads its sections and headings from here.
 */

export type QuoteSectionDef = { id: string; label: string; lede: string };

export type QuoteLabels = {
  title: string;
  preparedFor: string;
  project: string;
  services: string;
  summary: string;
  scope: string;
  understanding: string;
  nextSteps: string;
  notes: string;
  signOurs: string;
  signClient: string;
};

export type QuoteTemplate = {
  sections: QuoteSectionDef[];
  labels: QuoteLabels;
  doc: QuoteDoc;
  validDays: number;
};

/** What each heading is for, in the order the quote shows them. */
export const LABEL_FIELDS: { key: keyof QuoteLabels; what: string }[] = [
  { key: "title", what: "Big title at the top right" },
  { key: "preparedFor", what: "Above the client's name" },
  { key: "project", what: "Before the project name" },
  { key: "summary", what: "Above the investment summary" },
  { key: "services", what: "Above the table of services" },
  { key: "scope", what: "Above what each service includes" },
  { key: "understanding", what: "Above the meeting notes" },
  { key: "nextSteps", what: "Above the next steps" },
  { key: "notes", what: "Above the notes and terms" },
  { key: "signOurs", what: "Our signature line" },
  { key: "signClient", what: "Client's signature line, before their name" },
];

export const DEFAULT_LABELS: QuoteLabels = {
  title: "Quotation",
  preparedFor: "Prepared for",
  project: "Project",
  services: "Services and pricing",
  summary: "Investment at a glance",
  scope: "Scope of work",
  understanding: "Our understanding of the requirements",
  nextSteps: "Next steps",
  notes: "Terms and notes",
  signOurs: "For NectArray",
  signClient: "Accepted for",
};

export function defaultTemplate(): QuoteTemplate {
  return {
    sections: QUOTE_SECTIONS.map((s) => ({ ...s })),
    labels: { ...DEFAULT_LABELS },
    doc: { ...DEFAULT_DOC },
    validDays: 30,
  };
}

/** A section id from its name: "Knowledge transfer" is knowledge-transfer. */
export const sectionId = (label: string) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "section";

/**
 * The template's sections, then any section a quote's rows use that the
 * template no longer has, so no row is ever hidden.
 */
export function sectionsFor(
  lines: Pick<QuoteLine, "section">[],
  sections: QuoteSectionDef[],
): QuoteSectionDef[] {
  const known = new Set(sections.map((s) => s.id));
  const extra: QuoteSectionDef[] = [];
  for (const l of lines) {
    if (!known.has(l.section)) {
      known.add(l.section);
      extra.push({ id: l.section, label: l.section, lede: "" });
    }
  }
  return [...sections, ...extra];
}

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.slice(0, max) : "";

/** Anything the Template tab sends, made safe to store. */
export function cleanTemplate(input: unknown): QuoteTemplate {
  const t = (input ?? {}) as Partial<QuoteTemplate>;
  const base = defaultTemplate();
  const seen = new Set<string>();
  const sections = (Array.isArray(t.sections) ? t.sections : [])
    .slice(0, 20)
    .map((raw) => {
      const s = (raw ?? {}) as Partial<QuoteSectionDef>;
      const label = str(s.label, 60).trim();
      let id = str(s.id, 40).trim() || sectionId(label);
      while (seen.has(id)) id += "-2";
      seen.add(id);
      return { id, label: label || "Untitled", lede: str(s.lede, 200) };
    });
  const labels = { ...base.labels };
  const raw = (t.labels ?? {}) as Partial<QuoteLabels>;
  for (const { key } of LABEL_FIELDS) {
    const v = str(raw[key], 80).trim();
    if (v) labels[key] = v;
  }
  const valid = Math.round(Number(t.validDays));
  return {
    sections: sections.length ? sections : base.sections,
    labels,
    doc: cleanDoc(t.doc),
    validDays: Number.isFinite(valid) && valid > 0 ? Math.min(valid, 365) : 30,
  };
}
