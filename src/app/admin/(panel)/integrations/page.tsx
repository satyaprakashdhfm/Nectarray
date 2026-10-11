import { ADMIN } from "@/lib/admin-path";
import Link from "next/link";
import { PageHead } from "@/components/admin/Business";
import { PriceSheet } from "@/components/admin/PriceSheet";
import { ProjectEstimate } from "@/components/admin/ProjectEstimate";
import { CHECKED, SHEETS } from "@/lib/price-book";
import { PROVIDERS } from "@/lib/price-book-providers";
import { baseSheet, withEdits } from "@/lib/price-book-store";
import { estimateItems } from "@/lib/project-estimate";

const ESTIMATE = "estimate";

/**
 * The price book, one sheet at a time like the workbook it came from, with
 * every table open. Tables the team has edited show their saved rows
 * (lib/price-book-store). The last tab adds the sheets up for a project.
 */
export default async function AdminIntegrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ sheet?: string }>;
}) {
  const { sheet: slug } = await searchParams;
  const tabs = [
    ...SHEETS.map((s) => ({ slug: s.slug, title: s.title })),
    { slug: PROVIDERS, title: "Our providers" },
    { slug: ESTIMATE, title: "Estimate" },
  ];

  if (slug === ESTIMATE) {
    const sheets = await Promise.all(SHEETS.map(withEdits));
    return (
      <>
        <Head />
        <Tabs tabs={tabs} current={ESTIMATE} />
        <p className="text-ink-soft mt-4 max-w-3xl text-[0.875rem]">
          Tick what a project needs, choose a provider and say how many. The
          total shows what is paid to start, then every month and every year.
          Add the team below to see the full running cost.
        </p>
        <ProjectEstimate items={estimateItems(sheets)} />
      </>
    );
  }

  const sheet = await withEdits(baseSheet(slug) ?? SHEETS[0]);
  return (
    <>
      <Head />
      <Tabs tabs={tabs} current={sheet.slug} />
      <p className="text-ink-soft mt-4 max-w-3xl text-[0.875rem]">
        {sheet.lede}
      </p>
      {/* Keyed so filters and ticks start fresh on each sheet. */}
      <PriceSheet key={sheet.slug} sheet={sheet} />
    </>
  );
}

function Head() {
  return (
    <PageHead
      title="Integrations"
      lede={`What the services we build on cost, as tables you can sort, filter and compare. Tick two or more rows to set them side by side, or use Edit on a table to change prices and add services. Workbook prices checked ${CHECKED}.`}
    />
  );
}

function Tabs({
  tabs,
  current,
}: {
  tabs: { slug: string; title: string }[];
  current: string;
}) {
  return (
    <nav aria-label="Sheets" className="mt-5">
      <div className="tab-bar">
        {tabs.map((t) => (
          <Link
            key={t.slug}
            href={`${ADMIN}/integrations?sheet=${t.slug}`}
            aria-current={t.slug === current ? "page" : undefined}
            className="tab"
          >
            {t.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}
