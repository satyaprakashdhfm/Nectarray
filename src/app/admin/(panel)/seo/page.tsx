import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { blogPosts, seoKeywords } from "@/lib/db/schema";
import {
  ConnectionStrip,
  Empty,
  PageHead,
  Section,
  ServiceFilter,
  ServiceSelect,
  Stat,
  deleteButton,
  field,
  primaryButton,
  quietButton,
  td,
  th,
} from "@/components/admin/Business";
import { BLOG_STATUSES, isService, num, serviceLabel } from "@/lib/business";
import {
  addBlogPost,
  addKeyword,
  deleteBlogPost,
  deleteKeyword,
  updateBlogPost,
  updateKeywordPosition,
} from "../business-actions";

export const dynamic = "force-dynamic";

const POST_TONE: Record<string, string> = {
  idea: "bg-mist text-ink-soft",
  writing: "bg-amber-wash text-amber-deep",
  published: "bg-leaf-wash text-leaf-deep",
};

const day = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    : "";

/**
 * Search: the terms each service should rank for, and the blog plan that
 * goes after them.
 *
 * Positions are typed in until Search Console is connected — the card at
 * the top says what that still needs.
 */
export default async function AdminSeoPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service: wanted } = await searchParams;
  const service = wanted && isService(wanted) ? wanted : null;

  const [keywords, posts] = await Promise.all([
    db
      .select()
      .from(seoKeywords)
      .where(service ? eq(seoKeywords.service, service) : undefined)
      .orderBy(asc(seoKeywords.service), asc(seoKeywords.position)),
    db
      .select()
      .from(blogPosts)
      .where(service ? eq(blogPosts.service, service) : undefined)
      .orderBy(desc(blogPosts.createdAt)),
  ]);

  const ranked = keywords.filter((k) => k.position !== null);
  const topTen = ranked.filter((k) => num(k.position) <= 10).length;
  const published = posts.filter((p) => p.status === "published").length;

  return (
    <>
      <PageHead
        title="SEO"
        lede="Keywords each service should rank for, and the blog posts planned to win them."
      />
      <ConnectionStrip ids={["searchConsole"]} />
      <ServiceFilter basePath="/admin/seo" current={service} />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Keywords" value={String(keywords.length)} />
        <Stat
          label="On page 1"
          value={String(topTen)}
          hint="Position 10 or better"
        />
        <Stat
          label="Posts published"
          value={`${published} / ${posts.length}`}
        />
      </div>

      <Section title="Keywords">
        {keywords.length === 0 ? (
          <Empty>No keywords yet.</Empty>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[46rem] text-left">
              <thead>
                <tr className="border-line-soft border-b">
                  {["Keyword", "Service", "Page", "Position", ""].map((h) => (
                    <th key={h} className={th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {keywords.map((k) => (
                  <tr
                    key={k.id}
                    className="border-line-soft border-b last:border-0"
                  >
                    <td className={`${td} text-ink font-semibold`}>
                      {k.keyword}
                    </td>
                    <td className={td}>{serviceLabel(k.service)}</td>
                    <td className={`${td} font-mono text-[0.75rem]`}>
                      {k.targetPath ?? "—"}
                    </td>
                    <td className={td}>
                      <form
                        action={updateKeywordPosition}
                        className="flex items-center gap-1.5"
                      >
                        <input type="hidden" name="id" value={k.id} />
                        <input
                          name="position"
                          inputMode="decimal"
                          defaultValue={k.position ?? ""}
                          placeholder="—"
                          className={`${field} w-16`}
                        />
                        <button className={quietButton}>Save</button>
                        <span className="text-ink-faint text-[0.6875rem] whitespace-nowrap">
                          {day(k.checkedOn)}
                        </span>
                      </form>
                    </td>
                    <td className={td}>
                      <form action={deleteKeyword}>
                        <input type="hidden" name="id" value={k.id} />
                        <button className={deleteButton}>Remove</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <form
          action={addKeyword}
          className="card mt-4 grid gap-3 p-5 sm:grid-cols-[2fr_1fr_1.5fr_1fr_auto] sm:items-end"
        >
          <label className="block">
            <span className="eyebrow">Keyword</span>
            <input
              name="keyword"
              required
              placeholder="e.g. rag chatbot development"
              className={`${field} mt-1`}
            />
          </label>
          <ServiceSelect current={service} />
          <label className="block">
            <span className="eyebrow">Page</span>
            <input
              name="target_path"
              placeholder="/agentic-ai"
              className={`${field} mt-1`}
            />
          </label>
          <label className="block">
            <span className="eyebrow">Position</span>
            <input
              name="position"
              inputMode="decimal"
              className={`${field} mt-1`}
            />
          </label>
          <button className={primaryButton}>Add keyword</button>
        </form>
      </Section>

      <Section title="Blog plan">
        {posts.length === 0 ? (
          <Empty>No posts planned yet.</Empty>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[52rem] text-left">
              <thead>
                <tr className="border-line-soft border-b">
                  {["Post", "Service", "Status and link", ""].map((h) => (
                    <th key={h} className={th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr
                    key={p.id}
                    className="border-line-soft border-b last:border-0"
                  >
                    <td className={td}>
                      <span className="text-ink block font-semibold">
                        {p.title}
                      </span>
                      {p.keyword && (
                        <span className="text-ink-faint block text-[0.75rem]">
                          Targets “{p.keyword}”
                        </span>
                      )}
                    </td>
                    <td className={td}>{serviceLabel(p.service)}</td>
                    <td className={td}>
                      <form
                        action={updateBlogPost}
                        className="flex flex-wrap items-center gap-1.5"
                      >
                        <input type="hidden" name="id" value={p.id} />
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold capitalize ${POST_TONE[p.status]}`}
                        >
                          {p.status}
                          {p.publishedOn && ` ${day(p.publishedOn)}`}
                        </span>
                        <select
                          name="status"
                          defaultValue={p.status}
                          className={`${field} w-28`}
                        >
                          {BLOG_STATUSES.map((s) => (
                            <option key={s} value={s} className="capitalize">
                              {s}
                            </option>
                          ))}
                        </select>
                        <input
                          name="url"
                          defaultValue={p.url ?? ""}
                          placeholder="/blog/… or https://"
                          className={`${field} w-48`}
                        />
                        <button className={quietButton}>Save</button>
                      </form>
                    </td>
                    <td className={td}>
                      <form action={deleteBlogPost}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className={deleteButton}>Remove</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <form
          action={addBlogPost}
          className="card mt-4 grid gap-3 p-5 sm:grid-cols-[2fr_1fr_1.5fr_auto] sm:items-end"
        >
          <label className="block">
            <span className="eyebrow">Title</span>
            <input name="title" required className={`${field} mt-1`} />
          </label>
          <ServiceSelect current={service} />
          <label className="block">
            <span className="eyebrow">Target keyword</span>
            <input name="keyword" className={`${field} mt-1`} />
          </label>
          <button className={primaryButton}>Add post</button>
        </form>
      </Section>
    </>
  );
}
