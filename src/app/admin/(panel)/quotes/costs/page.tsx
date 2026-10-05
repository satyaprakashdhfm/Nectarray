import { PageHead } from "@/components/admin/Business";
import { CostSheet } from "@/components/admin/CostSheet";
import { QuotesNav } from "@/components/admin/QuotesNav";
import { getThirdPartyCosts } from "@/lib/quotes-data";

export const dynamic = "force-dynamic";

/** What outside services cost, for reference when quoting. */
export default async function AdminThirdPartyCostsPage() {
  const { groups, customised } = await getThirdPartyCosts();
  return (
    <>
      <PageHead
        title="Quotations"
        lede="What email, domains, servers, storage, AI, messages, delivery and payments cost from the companies that provide them. The client pays these on top of our price."
      />
      <QuotesNav current="/admin/quotes/costs" />
      <CostSheet initial={groups} customised={customised} />
    </>
  );
}
