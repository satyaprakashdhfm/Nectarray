import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { PageHead } from "@/components/admin/Business";
import { STATUS_TONE } from "@/components/admin/omni-status";
import { ADMIN } from "@/lib/admin-path";
import { adminPage } from "@/lib/auth/access";
import { FIELDS, fieldById } from "@/lib/content/omniproof";
import { allOmni, readingMinutes, type OmniStatus } from "@/lib/omniproof";
import { createOmniPiece } from "./actions";

export const dynamic = "force-dynamic";

const FILTERS: { value: OmniStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Drafts" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

/**
 * Omniproof in the admin: start a piece, and the one list of all of them with
 * their field, status and length. Laid out after the Deeds & Co articles
 * console: a new piece starts as a draft and stays off the site until it is
 * published; a filter across the top picks drafts, published or archived.
 */
export default async function AdminOmniproofPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await adminPage();
  const { status } = await searchParams;
  const filter = FILTERS.find((f) => f.value === status)?.value ?? "all";
  const all = await allOmni();
  const shown = all.filter((a) => filter === "all" || a.status === filter);
  const count = (value: OmniStatus | "all") =>
    value === "all" ? all.length : all.filter((a) => a.status === value).length;

  const field =
    "border-line bg-surface text-ink focus:border-brand rounded-xl border px-3.5 py-2.5 text-[0.9375rem] transition-colors focus:outline-none";

  return (
    <>
      <PageHead
        title="Omniproof"
        lede="Five-minute pieces on what LLMs and people are changing in the sciences. Write one, edit any, and publish when it is ready. Drafts stay off the site."
      />

      <form
        action={createOmniPiece}
        className="card mt-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:p-5"
      >
        <label className="min-w-0 flex-1">
          <span className="text-ink mb-1.5 block text-[0.8125rem] font-semibold">
            New piece
          </span>
          <input
            name="title"
            required
            minLength={5}
            placeholder="Its title, e.g. Chemistry learns to search"
            className={`${field} w-full`}
          />
        </label>
        <label>
          <span className="text-ink mb-1.5 block text-[0.8125rem] font-semibold">
            Field
          </span>
          <select name="field" className={`${field} w-full sm:w-48`}>
            {FIELDS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="bg-ink text-cta-fg hover:bg-brand-deep inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[0.9375rem] font-semibold transition-colors"
        >
          <Plus className="size-4" aria-hidden />
          Start writing
        </button>
      </form>

      <ul className="tab-bar mt-8" aria-label="Filter by status">
        {FILTERS.map((f) => (
          <li key={f.value}>
            <Link
              href={`${ADMIN}/omniproof${f.value === "all" ? "" : `?status=${f.value}`}`}
              aria-current={filter === f.value ? "page" : undefined}
              className="tab"
              scroll={false}
            >
              {f.label}
              <span className="text-ink-faint ml-1 text-[0.75rem]">
                {count(f.value)}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {shown.length === 0 ? (
        <p className="card text-ink-faint mt-4 p-6 text-center text-[0.9375rem]">
          Nothing here yet.
        </p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {shown.map((a) => {
            const f = fieldById(a.field);
            const sub = f.subfields.find((x) => x.id === a.subfield);
            const minutes = readingMinutes(a.body);
            return (
              <li
                key={a.slug}
                className="card card-hover flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
                style={{ borderLeftColor: f.color, borderLeftWidth: 3 }}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-ink-faint text-[0.75rem] font-semibold">
                    <span style={{ color: f.color }}>{f.label}</span>
                    {sub && ` · ${sub.label}`} · {a.date}
                  </p>
                  <Link
                    href={`${ADMIN}/omniproof/${a.slug}`}
                    className="text-ink hover:text-brand-deep mt-1 block text-[1.0625rem] leading-snug font-semibold"
                  >
                    {a.title}
                  </Link>
                  <p className="text-ink-soft mt-1 line-clamp-1 text-[0.875rem]">
                    {a.description || "No description yet."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[0.75rem]">
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-semibold capitalize ${STATUS_TONE[a.status]}`}
                  >
                    {a.status}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-semibold ${minutes > 5 ? "bg-amber-wash text-amber-deep" : "bg-mist text-ink-soft"}`}
                    title="Omniproof pieces are five minutes at most"
                  >
                    {minutes} min
                  </span>
                  <span className="text-ink-faint">
                    {a.origin === "bundled" ? "From the repo" : "Edited here"}
                  </span>
                  {a.status === "published" && (
                    <Link
                      href={`/omniproof/${a.slug}`}
                      target="_blank"
                      className="text-brand-deep inline-flex items-center gap-0.5 font-semibold"
                    >
                      View
                      <ArrowUpRight className="size-3" aria-hidden />
                    </Link>
                  )}
                  <Link
                    href={`${ADMIN}/omniproof/${a.slug}`}
                    className="border-line text-ink hover:border-brand rounded-full border px-3 py-1 font-semibold transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
