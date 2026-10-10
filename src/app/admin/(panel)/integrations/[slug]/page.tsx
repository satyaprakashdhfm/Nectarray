import { ADMIN } from "@/lib/admin-path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, TriangleAlert } from "lucide-react";
import { IntegrationMark } from "@/components/admin/IntegrationMark";
import { IntegrationToc } from "@/components/admin/IntegrationToc";
import {
  CATEGORIES,
  CONFIDENCE_LABEL,
  INTEGRATIONS,
  SECTIONS,
  integrationBySlug,
  type Confidence,
} from "@/lib/integrations";
import { cn } from "@/lib/utils";

const CONFIDENCE_TONE: Record<Confidence, string> = {
  official: "bg-leaf-wash text-leaf-deep",
  reported: "bg-amber-wash text-amber-deep",
  quote: "bg-mist text-ink-soft",
};

/**
 * One provider, in the same seven sections as every other: what it is, its
 * integrations, pricing, getting access, how it connects, watch-outs and
 * links. Contents on the right from 1280px, a strip of links above that.
 */
export default async function AdminIntegrationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = integrationBySlug(slug);
  if (!item) notFound();

  const category = CATEGORIES.find((c) => c.id === item.category)!;
  const siblings = INTEGRATIONS.filter(
    (i) => i.category === item.category && i.slug !== item.slug,
  );

  return (
    <>
      <Link
        href={`${ADMIN}/integrations`}
        className="text-ink-faint hover:text-ink inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold transition-colors"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All integrations
      </Link>

      <header className="mt-4 flex items-start gap-4">
        <IntegrationMark slug={item.slug} name={item.name} size="lg" />
        <div className="min-w-0">
          <p className="text-ink-faint text-[0.8125rem]">{category.label}</p>
          <h1 className="display text-ink text-[1.75rem] sm:text-[2rem]">
            {item.name}
          </h1>
          <p className="text-ink-soft mt-1 max-w-3xl text-[0.9375rem]">
            {item.tagline}
          </p>
        </div>
      </header>

      {/* Below 1280px the contents become a strip of jump links. */}
      <nav aria-label="On this page" className="mt-5 xl:hidden">
        <ul className="tab-bar">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="tab">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6 xl:grid xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-10">
        <div className="min-w-0 space-y-10">
          <Block id="overview" title="Overview">
            <p className="text-ink-soft max-w-[70ch] text-[0.9375rem] leading-relaxed">
              {item.overview}
            </p>
            <h3 className="text-ink mt-5 text-[0.875rem] font-semibold">
              What we use it for
            </h3>
            <ul className="text-ink-soft mt-2 grid gap-x-8 gap-y-1.5 text-[0.875rem] sm:grid-cols-2">
              {item.useFor.map((u) => (
                <li key={u} className="flex gap-2">
                  <span className="bg-brand mt-2 size-1.5 shrink-0 rounded-full" />
                  {u}
                </li>
              ))}
            </ul>
          </Block>

          <Block
            id="integrations"
            title="Integrations"
            count={item.products.length}
          >
            <ul className="grid gap-3 md:grid-cols-2">
              {item.products.map((p) => (
                <li key={p.name} className="card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-ink text-[0.9375rem] font-semibold">
                      {p.name}
                    </p>
                    <span className="bg-brand-wash text-brand-deep rounded-md px-2 py-0.5 text-[0.6875rem] font-semibold whitespace-nowrap">
                      {p.via}
                    </span>
                  </div>
                  <p className="text-ink-soft mt-1.5 text-[0.8125rem] leading-relaxed">
                    {p.what}
                  </p>
                </li>
              ))}
            </ul>
          </Block>

          <Block id="pricing" title="Pricing">
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left">
                <thead>
                  <tr className="border-line text-ink-faint border-b text-[0.75rem] font-semibold">
                    <th className="px-4 py-2.5">What</th>
                    <th className="px-4 py-2.5">Price</th>
                    <th className="px-4 py-2.5">Basis</th>
                    <th className="px-4 py-2.5">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-line-soft divide-y">
                  {item.pricing.map((r) => (
                    <tr key={r.item} className="align-top">
                      <td className="text-ink px-4 py-3 text-[0.8125rem] font-semibold">
                        {r.item}
                      </td>
                      <td className="text-ink px-4 py-3 text-[0.8125rem]">
                        {r.price}
                      </td>
                      <td className="text-ink-soft px-4 py-3 text-[0.8125rem]">
                        {r.basis}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "rounded-md px-2 py-0.5 text-[0.6875rem] font-semibold whitespace-nowrap",
                            CONFIDENCE_TONE[r.confidence],
                          )}
                        >
                          {CONFIDENCE_LABEL[r.confidence]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-ink-soft mt-3 max-w-[75ch] text-[0.8125rem] leading-relaxed">
              {item.pricingNote}
            </p>
            <p className="text-ink-faint mt-2 text-[0.75rem]">
              Official: the provider&apos;s own pricing page. Reported: from
              third-party sources that do not always agree. Quote only: set per
              account. Checked {item.checked}.
            </p>
          </Block>

          <Block id="setup" title="Getting access">
            <ol className="space-y-3">
              {item.setup.map((step, n) => (
                <li key={step} className="flex gap-3">
                  <span className="bg-brand-solid text-cta-fg flex size-6 shrink-0 items-center justify-center rounded-full text-[0.75rem] font-semibold">
                    {n + 1}
                  </span>
                  <p className="text-ink-soft pt-0.5 text-[0.875rem] leading-relaxed">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </Block>

          <Block id="technical" title="How it connects">
            <dl className="card divide-line-soft divide-y">
              {item.technical.map((t) => (
                <div
                  key={t.label}
                  className="grid gap-1 px-4 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4"
                >
                  <dt className="text-ink-faint text-[0.8125rem] font-semibold">
                    {t.label}
                  </dt>
                  <dd className="text-ink text-[0.8125rem] break-words">
                    {t.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Block>

          <Block id="watch-outs" title="Watch-outs">
            <ul className="space-y-2.5">
              {item.watchOuts.map((w) => (
                <li
                  key={w}
                  className="bg-amber-wash flex gap-3 rounded-lg px-4 py-3"
                >
                  <TriangleAlert
                    className="text-amber-deep mt-0.5 size-4 shrink-0"
                    aria-hidden
                  />
                  <p className="text-ink text-[0.8125rem] leading-relaxed">
                    {w}
                  </p>
                </li>
              ))}
            </ul>
          </Block>

          <Block id="links" title="Links">
            <ul className="flex flex-wrap gap-2">
              {item.links.map((l) => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="border-line bg-surface text-ink hover:border-brand inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[0.8125rem] font-semibold transition-colors"
                  >
                    {l.label}
                    <ExternalLink
                      className="text-ink-faint size-3.5"
                      aria-hidden
                    />
                  </a>
                </li>
              ))}
            </ul>
          </Block>
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-[96px] space-y-8">
            <IntegrationToc sections={SECTIONS} />
            {siblings.length > 0 && (
              <div>
                <p className="text-ink-faint text-[0.75rem] font-semibold">
                  Also in {category.label.toLowerCase()}
                </p>
                <ul className="mt-2 space-y-1">
                  {siblings.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`${ADMIN}/integrations/${s.slug}`}
                        className="text-ink-soft hover:text-ink text-[0.8125rem] transition-colors"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

function Block({
  id,
  title,
  count,
  children,
}: {
  id: string;
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <section id={id}>
      <h2 className="text-ink mb-3 flex items-baseline gap-2 text-[1.125rem] font-semibold">
        {title}
        {count !== undefined && (
          <span className="text-ink-faint text-[0.8125rem] font-medium">
            {count}
          </span>
        )}
      </h2>
      {children}
    </section>
  );
}
