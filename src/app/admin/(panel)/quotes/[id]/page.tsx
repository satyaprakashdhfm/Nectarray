import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, inArray } from "drizzle-orm";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import { clientProjects, quotations } from "@/lib/db/schema";
import { QuoteBuilder } from "@/components/admin/QuoteBuilder";
import { cleanBody } from "@/lib/quotes";
import { getQuoteDefaults } from "@/lib/quotes-data";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f-]{36}$/i;

/** One quote: its rows and prices, and the document made from them. */
export default async function AdminQuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const [quote] = await db
    .select()
    .from(quotations)
    .where(eq(quotations.id, id));
  if (!quote) notFound();

  const { body: standard } = await getQuoteDefaults();
  const ids = Array.isArray(quote.projectIds) ? quote.projectIds : [];
  const projects = ids.length
    ? await db
        .select({
          id: clientProjects.id,
          service: clientProjects.service,
          title: clientProjects.title,
          status: clientProjects.status,
          value: clientProjects.value,
        })
        .from(clientProjects)
        .where(inArray(clientProjects.id, ids))
    : [];

  return (
    <>
      <Link
        href="/admin/quotes"
        className="text-ink-soft hover:text-ink inline-flex items-center gap-1 text-[0.8125rem] font-semibold"
      >
        <ChevronLeft className="size-4" aria-hidden />
        All quotes
      </Link>
      <QuoteBuilder
        quote={{
          id: quote.id,
          number: quote.number,
          title: quote.title,
          company: quote.company,
          contactName: quote.contactName ?? "",
          phone: quote.phone ?? "",
          email: quote.email ?? "",
          status: quote.status,
          quoteDate: quote.quoteDate,
          body: cleanBody(quote.body),
        }}
        projects={projects}
        standards={standard.lines}
      />
    </>
  );
}
