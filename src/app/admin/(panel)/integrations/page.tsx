import { ADMIN } from "@/lib/admin-path";
import Link from "next/link";
import { PageHead } from "@/components/admin/Business";
import { PriceSheet } from "@/components/admin/PriceSheet";
import { CHECKED, SHEETS } from "@/lib/price-book";
import { PROVIDERS } from "@/lib/price-book-providers";
import { baseSheet, withEdits } from "@/lib/price-book-store";

/**
 * The price book, one sheet at a time like the workbook it came from, with
 * every table open. Tables the team has edited show their saved rows
 * (lib/price-book-store).
 */
export default async function AdminIntegrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ sheet?: string }>;
}) {
  const { sheet: slug } = await searchParams;
  const sheet = await withEdits(baseSheet(slug) ?? SHEETS[0]);
  const tabs = [
    ...SHEETS.map((s) => ({ slug: s.slug, title: s.title })),
    { slug: PROVIDERS, title: "Our providers" },
  ];

  return (
    <>
      <PageHead
        title="Integrations"
        lede={`What the services we build on cost, as tables you can sort, filter and compare. Tick two or more rows to set them side by side, or use Edit on a table to change prices and add services. Workbook prices checked ${CHECKED}.`}
      />
      <nav aria-label="Sheets" className="mt-5">
        <div className="tab-bar">
          {tabs.map((t) => (
            <Link
              key={t.slug}
              href={`${ADMIN}/integrations?sheet=${t.slug}`}
              aria-current={t.slug === sheet.slug ? "page" : undefined}
              className="tab"
            >
              {t.title}
            </Link>
          ))}
        </div>
      </nav>
      <p className="text-ink-soft mt-4 max-w-3xl text-[0.875rem]">
        {sheet.lede}
      </p>
      {/* Keyed so filters and ticks start fresh on each sheet. */}
      <PriceSheet key={sheet.slug} sheet={sheet} />
    </>
  );
}
