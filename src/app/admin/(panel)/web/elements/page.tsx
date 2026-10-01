import { PageHead } from "@/components/admin/Business";
import { ElementLibrary } from "@/components/admin/ElementLibrary";
import { UI_COMPONENTS } from "@/lib/content/ui-library";

/** The component library, live in the chosen colours. */
export default async function AdminWebElementsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return (
    <>
      <PageHead
        title="Elements"
        lede={`${UI_COMPONENTS.length} components to reuse: headers, heroes, forms, profile cards, pricing and more. Each shows in your colours at laptop, tablet or phone width, and copies as HTML or JSX.`}
      />
      <ElementLibrary initialCategory={category ?? "all"} />
    </>
  );
}
