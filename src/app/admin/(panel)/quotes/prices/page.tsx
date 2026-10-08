import { ADMIN } from "@/lib/admin-path";
import { PageHead } from "@/components/admin/Business";
import { QuotesNav } from "@/components/admin/QuotesNav";
import { StandardPrices } from "@/components/admin/StandardPrices";
import { getQuoteDefaults, getQuoteTemplate } from "@/lib/quotes-data";

export const dynamic = "force-dynamic";

/** Our price for each thing we sell, which every quote starts from. */
export default async function AdminQuotePricesPage() {
  const [{ body, customised }, { template }] = await Promise.all([
    getQuoteDefaults(),
    getQuoteTemplate(),
  ]);
  return (
    <>
      <PageHead
        title="Quotations"
        lede="Our price for each item. A row in a quote takes this price when you tick it, and every new quote starts from this list."
      />
      <QuotesNav current={`${ADMIN}/quotes/prices`} />
      <StandardPrices
        initial={body.lines}
        customised={customised}
        sections={template.sections}
      />
    </>
  );
}
