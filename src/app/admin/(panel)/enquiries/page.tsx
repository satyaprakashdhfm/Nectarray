import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { academyEnquiries } from "@/lib/db/schema";

/*
 * Rendered per request, never at build time.
 *
 * Without this Next tries each of these during "Generating static pages" to
 * find out whether it can prerender them — which means running the query,
 * against a database the build container cannot reach on the private
 * network. It does not fail; it hangs for sixty seconds and then retries,
 * and the build went from twenty seconds to nearly two minutes. Nothing here
 * could ever be static: it is all somebody's admin panel.
 */
export const dynamic = "force-dynamic";

type Enquiry = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  background: string | null;
  experience: string | null;
  goal: string | null;
  timeline: string | null;
  fit: string | null;
  reply: string | null;
};

const FIT_TONE: Record<string, string> = {
  strong: "bg-leaf-wash text-leaf-deep",
  partial: "bg-amber-wash text-amber-deep",
  elsewhere: "bg-mist text-ink-faint",
  unknown: "bg-mist text-ink-faint",
};

const FIT_LABEL: Record<string, string> = {
  strong: "Strong fit",
  partial: "Partial fit",
  elsewhere: "Not our course",
  unknown: "Not assessed",
};

const day = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/**
 * Academy enquiries, and what each applicant was told.
 *
 * The reply is shown beside the answers rather than kept in the database
 * unread. An assistant that writes to prospective students on our behalf and
 * whose output nobody ever looks at is a liability — this is the page that
 * makes it reviewable.
 *
 * Over time the goals column is the more useful half of this table: it is a
 * direct read on what people are asking for that the programme does not yet
 * cover.
 */
export default async function AdminEnquiriesPage() {
  const rows = (await db
    .select({
      id: academyEnquiries.id,
      created_at: academyEnquiries.createdAt,
      name: academyEnquiries.name,
      email: academyEnquiries.email,
      phone: academyEnquiries.phone,
      background: academyEnquiries.background,
      experience: academyEnquiries.experience,
      goal: academyEnquiries.goal,
      timeline: academyEnquiries.timeline,
      fit: academyEnquiries.fit,
      reply: academyEnquiries.reply,
    })
    .from(academyEnquiries)
    .orderBy(desc(academyEnquiries.createdAt))
    .limit(200)) as unknown as Enquiry[];

  return (
    <>
      <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
        Enquiries
      </h1>
      <p className="text-ink-soft mt-3 max-w-2xl text-[0.9375rem]">
        Everyone who filled in the form at the foot of the academy page, what
        they said they were after, and the answer they were given.
      </p>

      {rows.length === 0 ? (
        <div className="card mt-8 p-8 text-center">
          <p className="text-ink-soft text-[0.9375rem]">No enquiries yet.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {rows.map((row) => (
            <article key={row.id} className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-ink text-[1.0625rem] font-semibold">
                    {row.name}
                  </h2>
                  <p className="text-ink-soft mt-1 text-[0.8125rem]">
                    <a
                      href={`mailto:${row.email}`}
                      className="hover:text-brand-deep underline underline-offset-2"
                    >
                      {row.email}
                    </a>
                    {row.phone && <> · {row.phone}</>}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[0.75rem] font-semibold ${
                      FIT_TONE[row.fit ?? "unknown"] ?? FIT_TONE.unknown
                    }`}
                  >
                    {FIT_LABEL[row.fit ?? "unknown"] ?? FIT_LABEL.unknown}
                  </span>
                  <span className="text-ink-faint text-[0.8125rem] whitespace-nowrap">
                    {day(row.created_at)}
                  </span>
                </div>
              </div>

              <dl className="border-line-soft mt-5 grid gap-x-6 gap-y-3 border-t pt-5 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Background", row.background],
                  ["Experience", row.experience],
                  ["Goal", row.goal],
                  ["Wants to start", row.timeline],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-ink-faint text-[0.6875rem] font-semibold tracking-[0.12em] uppercase">
                      {label}
                    </dt>
                    <dd className="text-ink-soft mt-1 text-[0.875rem]">
                      {value || "—"}
                    </dd>
                  </div>
                ))}
              </dl>

              {row.reply && (
                <div className="border-line bg-mist mt-5 rounded-xl border p-4">
                  <p className="text-ink-faint text-[0.6875rem] font-semibold tracking-[0.12em] uppercase">
                    What they were told
                  </p>
                  <p className="text-ink-soft mt-2 text-[0.875rem] leading-relaxed">
                    {row.reply}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
