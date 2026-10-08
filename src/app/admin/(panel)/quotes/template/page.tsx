import { ADMIN } from "@/lib/admin-path";
import { PageHead } from "@/components/admin/Business";
import { QuotesNav } from "@/components/admin/QuotesNav";
import { TemplateEditor } from "@/components/admin/TemplateEditor";
import { scopeFor, understandingFromLines } from "@/lib/quotes";
import { getQuoteDefaults, getQuoteTemplate } from "@/lib/quotes-data";

export const dynamic = "force-dynamic";

/** Picked for the preview: a website, admin portal, KT sessions and maintenance. */
const SAMPLE_REFS = ["website", "admin", "kt-sessions", "maintenance"];

/** Sections, headings and starting wording for every quotation. */
export default async function AdminQuoteTemplatePage() {
  const [{ template, customised }, { body }] = await Promise.all([
    getQuoteTemplate(),
    getQuoteDefaults(),
  ]);

  const picked = body.lines.filter((l) => l.ref && SAMPLE_REFS.includes(l.ref));
  const lines = (picked.length ? picked : body.lines.slice(0, 3)).map((l) => ({
    ...l,
    on: true,
  }));

  return (
    <>
      <PageHead
        title="Quotations"
        lede="The template every quotation uses: its sections, the headings it prints and the wording a new quote starts with."
      />
      <QuotesNav current={`${ADMIN}/quotes/template`} />
      <TemplateEditor
        initial={template}
        customised={customised}
        sample={{
          number: "NA-Q-SAMPLE",
          title: "Website and admin portal",
          company: "Sample Company",
          contactName: "Owner",
          phone: "+91 90000 00000",
          email: "hello@example.com",
          quoteDate: new Date().toISOString().slice(0, 10),
          body: {
            ...body,
            lines,
            doc: { ...body.doc, understanding: understandingFromLines(lines) },
          },
          scope: Object.fromEntries(
            lines.map((l) => [l.id, scopeFor(l, body.lines)]),
          ),
        }}
      />
    </>
  );
}
