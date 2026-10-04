import { PageHead } from "@/components/admin/Business";
import { ElementLibrary } from "@/components/admin/ElementLibrary";
import { UI_CATEGORIES } from "@/lib/content/ui-library";
import { ALL_COMPONENTS } from "@/lib/content/ui-library-all";

/** The component library, live in the chosen colours. */
export default async function AdminWebElementsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category: wanted, q = "" } = await searchParams;
  const current = UI_CATEGORIES.find((c) => c.id === wanted);
  const query = q.trim().slice(0, 60);
  // One category at a time: every component is a live preview, and all of
  // them at once would be two hundred frames. A search looks everywhere.
  const category = current?.id ?? (query ? "all" : UI_CATEGORIES[0].id);
  const needle = query.toLowerCase();

  const matching = ALL_COMPONENTS.filter(
    (c) =>
      (category === "all" || c.category === category) &&
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
    count: ALL_COMPONENTS.filter((x) => x.category === c.id).length,
  }));

  return (
    <>
      <PageHead
        title="Elements"
        lede={`${ALL_COMPONENTS.length} components in ${UI_CATEGORIES.length} groups: headers, heroes, forms, profile cards, pricing, product cards and more. Each shows in your colours at laptop, tablet or phone width, and copies as HTML or JSX.`}
      />
      <ElementLibrary
        categories={categories}
        total={ALL_COMPONENTS.length}
        category={category}
        blurb={current?.blurb ?? null}
        query={query}
        found={matching.length}
        components={components}
      />
    </>
  );
}
