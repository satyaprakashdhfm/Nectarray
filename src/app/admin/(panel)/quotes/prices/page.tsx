import { PageHead } from "@/components/admin/Business";
import { QuotesNav } from "@/components/admin/QuotesNav";
import { StandardPrices } from "@/components/admin/StandardPrices";
import { getQuoteDefaults } from "@/lib/quotes-data";

export const dynamic = "force-dynamic";

/** Our price for each thing we sell, which every quote starts from. */
export default async function AdminQuotePricesPage() {
  const { body, customised } = await getQuoteDefaults();
  return (
    <>
      <PageHead
        title="Quotations"
        lede="Our price for each item. A row in a quote takes this price when you tick it, and every new quote starts from this list."
      />
      <QuotesNav current="/admin/quotes/prices" />
      <StandardPrices initial={body.lines} customised={customised} />
    </>
  );
}
