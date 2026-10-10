import { ADMIN } from "@/lib/admin-path";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHead } from "@/components/admin/Business";
import { IntegrationMark } from "@/components/admin/IntegrationMark";
import { INTEGRATIONS, integrationsByCategory } from "@/lib/integrations";

/**
 * Every outside service we connect for clients, by kind. Each one opens a
 * page that answers the same questions in the same order.
 */
export default function AdminIntegrationsPage() {
  const groups = integrationsByCategory();
  return (
    <>
      <PageHead
        title="Integrations"
        lede={`The ${INTEGRATIONS.length} outside services we connect for clients: what each one can do, what it costs, how to get access and what to watch for. Every provider page follows the same contents, so two are easy to compare.`}
      />

      {groups.map((group) => (
        <section key={group.id} className="mt-8">
          <h2 className="text-ink text-[1.125rem] font-semibold">
            {group.label}
          </h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            {group.items.map((i) => (
              <li key={i.slug}>
                <Link
                  href={`${ADMIN}/integrations/${i.slug}`}
                  className="card card-hover group flex h-full gap-4 p-4 active:scale-[0.99] sm:p-5"
                >
                  <IntegrationMark slug={i.slug} name={i.name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-ink flex items-center gap-1 text-[0.9375rem] font-semibold">
                      {i.name}
                      <ArrowUpRight
                        className="text-ink-faint group-hover:text-brand-deep size-4 transition-colors"
                        aria-hidden
                      />
                    </p>
                    <p className="text-ink-soft mt-1 text-[0.8125rem]">
                      {i.tagline}
                    </p>
                    <p className="text-ink-faint mt-2 text-[0.75rem]">
                      {i.products.length} integrations, {i.pricing.length}{" "}
                      prices
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
