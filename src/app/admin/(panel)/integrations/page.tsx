import { ADMIN } from "@/lib/admin-path";
import Link from "next/link";
import { PageHead } from "@/components/admin/Business";
import { PriceSheet } from "@/components/admin/PriceSheet";
import { CATEGORIES, CONFIDENCE_LABEL, INTEGRATIONS } from "@/lib/integrations";
import { CHECKED, SHEETS, sheetBySlug, type Sheet } from "@/lib/price-book";

const PROVIDERS = "providers";

/**
 * The price book, one sheet at a time like the workbook it came from, with
 * every table open. The last sheet lists every price from our own provider
 * pages in one table, each provider linking to its full page.
 */
export default async function AdminIntegrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ sheet?: string }>;
}) {
  const { sheet: slug } = await searchParams;
  const sheet =
    slug === PROVIDERS ? providersSheet() : (sheetBySlug(slug) ?? SHEETS[0]);
  const tabs = [
    ...SHEETS.map((s) => ({ slug: s.slug, title: s.title })),
    { slug: PROVIDERS, title: "Our providers" },
  ];

  return (
    <>
      <PageHead
        title="Integrations"
        lede={`What the services we build on cost, as tables you can sort, filter and compare. Tick two or more rows in a table to set them side by side. Prices checked ${CHECKED}.`}
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

/** Every price row from the provider pages, as one comparable table. */
function providersSheet(): Sheet {
  const category = (id: string) =>
    CATEGORIES.find((c) => c.id === id)?.label ?? id;
  const rows = INTEGRATIONS.flatMap((i) =>
    i.pricing.map((p) => ({
      slug: i.slug,
      cells: [
        i.name,
        category(i.category),
        p.item,
        p.price,
        p.basis,
        CONFIDENCE_LABEL[p.confidence],
      ],
    })),
  );
  return {
    slug: PROVIDERS,
    title: "Our providers",
    lede: `Every price from the ${INTEGRATIONS.length} provider pages in one table. A provider's name opens its full page: what it does, how to get access and how it connects.`,
    tables: [
      {
        id: "providers",
        title: "Provider prices",
        compare: true,
        nameColumns: [0, 2],
        columns: [
          { label: "Provider", kind: "text", facet: true },
          { label: "Kind", kind: "text", facet: true },
          { label: "Item", kind: "text" },
          { label: "Price", kind: "text" },
          { label: "Basis", kind: "long" },
          { label: "Confidence", kind: "confidence", facet: true },
        ],
        rows: rows.map((r) => r.cells),
        links: Object.fromEntries(
          rows.map((r, index) => [
            index,
            { 0: `${ADMIN}/integrations/${r.slug}` },
          ]),
        ),
      },
    ],
    checks: [],
    sources: INTEGRATIONS.flatMap((i) =>
      i.links.slice(0, 1).map((l) => ({
        label: `${i.name}: ${l.label}`,
        url: l.url,
      })),
    ),
  };
}
