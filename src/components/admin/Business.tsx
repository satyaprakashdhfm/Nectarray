import Link from "next/link";
import { Plug } from "lucide-react";
import {
  CONNECTIONS,
  PROJECT_STATUSES,
  SERVICES,
  missingEnv,
  type ConnectionId,
} from "@/lib/business";

/** Pieces shared by the revenue, SEO, analytics and service pages. */

export const field =
  "w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[0.8125rem] text-ink focus:border-brand focus:outline-none";

export const primaryButton =
  "bg-ink hover:bg-brand-deep text-cta-fg shrink-0 rounded-lg px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors";

export const quietButton =
  "border-line bg-surface text-ink hover:border-brand hover:text-brand-deep shrink-0 rounded-lg border px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors";

export const deleteButton =
  "text-ink-faint hover:text-danger text-[0.75rem] font-semibold transition-colors";

export const th =
  "text-ink-faint px-4 py-3 text-[0.6875rem] font-semibold tracking-[0.1em] uppercase whitespace-nowrap";

export const td = "px-4 py-3 text-[0.8125rem] text-ink-soft align-top";

export function PageHead({ title, lede }: { title: string; lede: string }) {
  return (
    <>
      <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
        {title}
      </h1>
      <p className="text-ink-soft mt-3 max-w-2xl text-[0.9375rem]">{lede}</p>
    </>
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="card p-5">
      <p className="eyebrow">{label}</p>
      <p className="display text-ink mt-1.5 text-[1.5rem]">{value}</p>
      {hint && <p className="text-ink-faint mt-1 text-[0.75rem]">{hint}</p>}
    </div>
  );
}

export function Section({
  title,
  children,
  aside,
}: {
  title: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-ink text-[1.125rem] font-semibold">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="card p-6 text-center">
      <p className="text-ink-soft text-[0.875rem]">{children}</p>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const s = PROJECT_STATUSES.find((x) => x.id === status);
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold whitespace-nowrap ${
        s?.tone ?? "bg-mist text-ink-soft"
      }`}
    >
      {s?.label ?? status}
    </span>
  );
}

/** All · Marketing · Software · Agentic AI · Academy, as links on ?service=. */
export function ServiceFilter({
  basePath,
  current,
}: {
  basePath: string;
  current: string | null;
}) {
  const options = [{ id: null, label: "All services" }, ...SERVICES];
  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.id === current;
        return (
          <li key={option.label}>
            <Link
              href={option.id ? `${basePath}?service=${option.id}` : basePath}
              aria-current={active ? "page" : undefined}
              className={`rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-semibold transition-colors ${
                active
                  ? "border-ink bg-ink text-cta-fg"
                  : "border-line bg-surface text-ink-soft hover:border-brand hover:text-brand-deep"
              }`}
            >
              {option.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Whether an outside source is ready. Reads only which variables are set,
 * never their values.
 */
export function ConnectionCard({ id }: { id: ConnectionId }) {
  const connection = CONNECTIONS[id];
  const missing = missingEnv(id);
  const ready = missing.length === 0;

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Plug className="text-ink-faint size-4" aria-hidden />
          <h3 className="text-ink text-[0.9375rem] font-semibold">
            {connection.label}
          </h3>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold whitespace-nowrap ${
            ready
              ? "bg-leaf-wash text-leaf-deep"
              : "bg-amber-wash text-amber-deep"
          }`}
        >
          {ready ? "Keys set" : "Waiting for access"}
        </span>
      </div>
      <p className="text-ink-soft mt-2 text-[0.8125rem]">{connection.gives}</p>
      {!ready && (
        <p className="text-ink-faint mt-3 text-[0.75rem]">
          Needs in Railway:{" "}
          {missing.map((name, i) => (
            <span key={name}>
              {i > 0 && ", "}
              <code className="text-ink-soft font-mono">{name}</code>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

/** The service a new keyword, post or campaign belongs to. */
export function ServiceSelect({ current }: { current: string | null }) {
  return (
    <label className="block">
      <span className="eyebrow">Service</span>
      <select
        name="service"
        defaultValue={current ?? "marketing"}
        className={`${field} mt-1`}
      >
        {SERVICES.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
    </label>
  );
}
