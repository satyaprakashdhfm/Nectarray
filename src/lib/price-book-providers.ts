import { ADMIN } from "@/lib/admin-path";
import { CATEGORIES, CONFIDENCE_LABEL, INTEGRATIONS } from "@/lib/integrations";
import type { Sheet } from "@/lib/price-book";

export const PROVIDERS = "providers";

/**
 * Every outside service the software connects to (lib/integrations), as
 * one sheet of the price book with a table per kind: delivery, payments,
 * messages, maps, sign-in, AI, analytics and hosting. Each row's name opens
 * its provider's full page.
 */
export function providersSheet(): Sheet {
  return {
    slug: PROVIDERS,
    title: "Third-party providers",
    lede: `The ${INTEGRATIONS.length} outside services we connect to, grouped by what they do, with every price from their websites. A provider's name opens its full page: what it does, how to get access and how it connects.`,
    tables: CATEGORIES.flatMap((category) => {
      const providers = INTEGRATIONS.filter((i) => i.category === category.id);
      if (providers.length === 0) return [];
      return [
        {
          id: `providers-${category.id}`,
          title: `${category.label}: ${providers.map((p) => p.name).join(", ")}`,
          compare: true,
          nameColumns: [0, 1],
          columns: [
            { label: "Provider", kind: "text" as const, facet: true },
            { label: "Item", kind: "text" as const },
            { label: "Price", kind: "text" as const },
            { label: "Basis", kind: "long" as const },
            { label: "Confidence", kind: "confidence" as const, facet: true },
          ],
          rows: providers.flatMap((i) =>
            i.pricing.map((p, n) => ({
              id: `${i.slug}-${n}`,
              href: `${ADMIN}/integrations/${i.slug}`,
              cells: [
                i.name,
                p.item,
                p.price,
                p.basis,
                CONFIDENCE_LABEL[p.confidence],
              ],
            })),
          ),
        },
      ];
    }),
    checks: [],
    sources: INTEGRATIONS.flatMap((i) =>
      i.links.slice(0, 1).map((l) => ({
        label: `${i.name}: ${l.label}`,
        url: l.url,
      })),
    ),
  };
}
