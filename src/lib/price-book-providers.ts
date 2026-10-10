import { ADMIN } from "@/lib/admin-path";
import { CATEGORIES, CONFIDENCE_LABEL, INTEGRATIONS } from "@/lib/integrations";
import type { Sheet } from "@/lib/price-book";

export const PROVIDERS = "providers";

/**
 * Every price from the provider pages (lib/integrations) as one sheet of
 * the price book, each row's name linking to its provider's full page.
 */
export function providersSheet(): Sheet {
  const category = (id: string) =>
    CATEGORIES.find((c) => c.id === id)?.label ?? id;
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
        rows: INTEGRATIONS.flatMap((i) =>
          i.pricing.map((p, n) => ({
            id: `${i.slug}-${n}`,
            href: `${ADMIN}/integrations/${i.slug}`,
            cells: [
              i.name,
              category(i.category),
              p.item,
              p.price,
              p.basis,
              CONFIDENCE_LABEL[p.confidence],
            ],
          })),
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
