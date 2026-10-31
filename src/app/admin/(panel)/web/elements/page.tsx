import { PageHead } from "@/components/admin/Business";
import { DomainSites } from "@/components/admin/DomainSites";
import { ElementLibrary } from "@/components/admin/ElementLibrary";
import {
  DOMAINS,
  HERO_TYPES,
  UI_CATEGORIES,
} from "@/lib/content/ui-library";
import { ALL_COMPONENTS } from "@/lib/content/ui-library-all";
import { WEB_DOMAINS } from "@/lib/content/web-domains";
import { getDomainSites } from "@/lib/web-domains";
import { adminPage } from "@/lib/auth/access";

export const dynamic = "force-dynamic";

/** The component library in page order, live in the chosen colours. */
export default async function AdminWebElementsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    q?: string;
    type?: string;
    domain?: string;
  }>;
}) {
  await adminPage();
  const { category: wanted, q = "", type, domain: wantedDomain } =
    await searchParams;
  const current = UI_CATEGORIES.find((c) => c.id === wanted);
  const query = q.trim().slice(0, 60);
  // One category at a time: every component is a live preview, and all of
  // them at once would be two hundred frames. A search looks everywhere.
  const category =
    wanted === DOMAINS && !query
      ? DOMAINS
      : (current?.id ?? (query ? "all" : UI_CATEGORIES[0].id));
  const heroType =
    category === "heroes" ? (HERO_TYPES.find((t) => t.id === type) ?? null) : null;
  const needle = query.toLowerCase();

  const matching = ALL_COMPONENTS.filter(
    (c) =>
      (category === "all" || c.category === category) &&
      (!heroType || (c.type ?? "other") === heroType.id) &&
      (!needle ||
        c.name.toLowerCase().includes(needle) ||
        c.note.toLowerCase().includes(needle) ||
        c.category.includes(needle) ||
        UI_CATEGORIES.find((x) => x.id === c.category)!
          .label.toLowerCase()
          .includes(needle)),
  );
  // A cap on frames, not on results: the count says how many were left out.
  const components = matching.slice(0, 40);

  const categories = UI_CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label,
    part: c.part,
    count: ALL_COMPONENTS.filter((x) => x.category === c.id).length,
  }));
  const heroTypes = HERO_TYPES.map((t) => ({
    id: t.id,
    label: t.label,
    count: ALL_COMPONENTS.filter(
      (x) => x.category === "heroes" && (x.type ?? "other") === t.id,
    ).length,
  }));

  let domainView = null;
  if (category === DOMAINS) {
    const domain =
      WEB_DOMAINS.find((d) => d.id === wantedDomain) ?? WEB_DOMAINS[0];
    const { sites, customised } = await getDomainSites(domain.id);
    domainView = (
      <DomainSites
        key={domain.id}
        domain={domain.id}
        initial={sites}
        customised={customised}
      />
    );
  }

  return (
    <>
      <PageHead
        title="Elements"
        lede="Every part of a page in order, ribbon to footer, live in your colours. Domains lists real websites to look at for each kind of business."
      />
      <ElementLibrary
        categories={categories}
        total={ALL_COMPONENTS.length}
        category={category}
        blurb={heroType?.blurb ?? current?.blurb ?? null}
        query={query}
        found={matching.length}
        components={components}
        heroTypes={heroTypes}
        heroType={heroType?.id ?? null}
        domainView={domainView}
      />
    </>
  );
}
