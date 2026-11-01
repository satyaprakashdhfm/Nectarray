import { notFound } from "next/navigation";
import { OmniEditor } from "@/components/admin/OmniEditor";
import { Markdown } from "@/components/dashboard/Markdown";
import { adminPage } from "@/lib/auth/access";
import { OMNI_ARTICLES } from "@/lib/content/omniproof";
import { getOmni } from "@/lib/omniproof";

export const dynamic = "force-dynamic";

/** One Omniproof piece in the editor. */
export default async function AdminOmniPiecePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await adminPage();
  const entry = await getOmni((await params).slug);
  if (!entry) notFound();

  return (
    <OmniEditor
      slug={entry.slug}
      status={entry.status}
      inRepo={OMNI_ARTICLES.some((a) => a.slug === entry.slug)}
      edited={entry.origin === "database"}
      preview={<Markdown>{entry.body}</Markdown>}
      initial={{
        title: entry.title,
        description: entry.description,
        date: entry.date,
        field: entry.field,
        subfield: entry.subfield,
        short: entry.short,
        body: entry.body,
        coverSrc: entry.cover?.src ?? "",
        coverAlt: entry.cover?.alt ?? "",
        sourceLabel: entry.source.label,
        sourceHref: entry.source.href,
        lands: entry.lands,
      }}
    />
  );
}
