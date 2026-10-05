import Link from "next/link";
import { desc } from "drizzle-orm";
import { ChevronRight } from "lucide-react";
import { db } from "@/lib/db";
import { quotations } from "@/lib/db/schema";
import {
  Empty,
  PageHead,
  Section,
  field,
  primaryButton,
} from "@/components/admin/Business";
import { QuoteStatusPill } from "@/components/admin/QuoteBuilder";
import { QuotesNav } from "@/components/admin/QuotesNav";
import { createQuote } from "@/app/admin/(panel)/quote-actions";
import { num, rupees } from "@/lib/business";
import { getQuoteDefaults } from "@/lib/quotes-data";

export const dynamic = "force-dynamic";

const day = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

async function loadQuotes() {
  try {
    return await db
      .select({
        id: quotations.id,
        number: quotations.number,
        title: quotations.title,
        company: quotations.company,
        contactName: quotations.contactName,
        status: quotations.status,
        quoteDate: quotations.quoteDate,
        onceTotal: quotations.onceTotal,
        monthlyTotal: quotations.monthlyTotal,
      })
      .from(quotations)
      .orderBy(desc(quotations.createdAt));
  } catch (error) {
    const code =
      (error as { code?: string }).code ??
      (error as { cause?: { code?: string } }).cause?.code;
    if (code === "42P01") return null;
    throw error;
  }
}

/** Every quote, newest first, and the form that starts the next one. */
export default async function AdminQuotesPage() {
  const [quotes, defaults] = await Promise.all([
    loadQuotes(),
    getQuoteDefaults(),
  ]);

  return (
    <>
      <PageHead
        title="Quotations"
        lede="Price a client's project row by row, tick what they want, and turn it into a document to print or save as PDF. An accepted quote becomes a project on the Marketing or Software tab."
      />

      <QuotesNav current="/admin/quotes" />

      <div className="mt-6 grid gap-8 xl:grid-cols-[22rem_minmax(0,1fr)] xl:items-start">
        <form action={createQuote} className="card space-y-3 p-4 sm:p-5">
          <h2 className="text-ink text-[1.0625rem] font-semibold">
            New quotation
          </h2>
          <Field
            label="Company"
            name="company"
            required
            autoComplete="organization"
          />
          <Field
            label="Contact person"
            name="contact_name"
            autoComplete="name"
          />
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-1">
            <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
            />
          </div>
          <Field
            label="Project name"
            name="title"
            hint="For example: Website and admin portal"
          />
          <button type="submit" className={`${primaryButton} w-full py-2.5`}>
            Start quote
          </button>
          <p className="text-ink-faint text-[0.75rem]">
            {defaults.customised
              ? "Starts with your standard prices."
              : "Starts with the built-in standard prices. Change them under Standard prices."}
          </p>
        </form>

        <Section title={`All quotes${quotes ? ` (${quotes.length})` : ""}`}>
          {quotes === null ? (
            <Empty>
              The quotations table is not in this database yet. It is created on
              the next deploy.
            </Empty>
          ) : quotes.length === 0 ? (
            <Empty>No quotes yet. Start one with the form.</Empty>
          ) : (
            <ul className="card divide-line divide-y overflow-hidden p-0">
              {quotes.map((q) => (
                <li key={q.id}>
                  <Link
                    href={`/admin/quotes/${q.id}`}
                    className="hover:bg-mist/60 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-4 py-3.5 transition-colors sm:grid-cols-[minmax(0,1fr)_8rem_8rem_6rem_auto] sm:px-5"
                  >
                    <span className="min-w-0">
                      <span className="text-ink block truncate text-[0.9375rem] font-semibold">
                        {q.company}
                      </span>
                      <span className="text-ink-faint block truncate text-[0.75rem]">
                        {q.number} · {day(q.quoteDate)}
                        {q.title ? ` · ${q.title}` : ""}
                      </span>
                    </span>
                    <span className="text-ink row-span-2 self-center text-right text-[0.875rem] font-semibold tabular-nums sm:row-span-1">
                      {rupees.format(num(q.onceTotal))}
                      <span className="text-ink-faint block text-[0.6875rem] font-normal">
                        one-time
                      </span>
                    </span>
                    <span className="text-ink-soft hidden text-right text-[0.875rem] tabular-nums sm:block">
                      {num(q.monthlyTotal)
                        ? rupees.format(num(q.monthlyTotal))
                        : "None"}
                      <span className="text-ink-faint block text-[0.6875rem]">
                        a month
                      </span>
                    </span>
                    <span className="sm:justify-self-end">
                      <QuoteStatusPill status={q.status} />
                    </span>
                    <ChevronRight
                      className="text-ink-faint hidden size-4 sm:block"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </>
  );
}

function Field({
  label,
  name,
  hint,
  ...rest
}: {
  label: string;
  name: string;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-ink-soft mb-1 block text-[0.75rem] font-semibold">
        {label}
        {rest.required && <span className="text-danger"> *</span>}
      </span>
      <input name={name} className={`${field} py-2`} {...rest} />
      {hint && (
        <span className="text-ink-faint mt-1 block text-[0.6875rem]">
          {hint}
        </span>
      )}
    </label>
  );
}
