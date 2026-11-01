import { Stat } from "@/components/admin/Business";
import {
  SEC_DOMAINS,
  type SecSeverity,
  type SecStatus,
  type SecurityFinding,
} from "@/lib/content/devops-security";
import { cn } from "@/lib/utils";

const SEVERITY: Record<SecSeverity, string> = {
  Critical: "bg-danger/15 text-danger",
  High: "bg-amber-wash text-amber-deep",
  Medium: "bg-amber-wash text-amber-deep",
  Low: "bg-mist text-ink-soft",
  "Owner check": "bg-brand-wash text-brand-deep",
};

const STATUS: Record<SecStatus, { label: string; tone: string }> = {
  fixed: { label: "Fixed", tone: "bg-leaf-wash text-leaf-deep" },
  partly: { label: "Partly fixed", tone: "bg-teal-wash text-teal-deep" },
  open: { label: "Open", tone: "bg-amber-wash text-amber-deep" },
  accepted: { label: "Accepted risk", tone: "bg-mist text-ink-soft" },
};

const chip =
  "rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold whitespace-nowrap";

/**
 * The Cybersecurity part of DevOps: what we found and fixed, grouped by the
 * domain of security it belongs to, each with its subdomain, so a class of
 * bug fixed in one project is checked for in the next. On the General tab
 * every project's findings, each marked with its project.
 */
export function SecurityLog({
  findings,
  projects,
}: {
  findings: SecurityFinding[];
  /** Project id to label; given on the General tab, where findings mix. */
  projects?: Record<string, string>;
}) {
  if (findings.length === 0)
    return (
      <p className="card text-ink-faint p-5 text-[0.875rem]">
        No security audit recorded for this project yet. Run the audit skill,
        add its table to architecture.md, then sync it here.
      </p>
    );

  const n = (s: SecStatus) => findings.filter((f) => f.status === s).length;
  const criticalOpen = findings.filter(
    (f) => f.severity === "Critical" && f.status !== "fixed",
  ).length;
  const domains = SEC_DOMAINS.map((d) => ({
    ...d,
    items: findings.filter((f) => f.domain === d.id),
  })).filter((d) => d.items.length > 0);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <Stat
          label="Findings"
          value={String(findings.length)}
          hint={`${domains.length} domains`}
        />
        <Stat
          label="Fixed"
          value={String(n("fixed"))}
          hint={n("partly") ? `${n("partly")} partly` : undefined}
        />
        <Stat
          label="Still open"
          value={String(n("open"))}
          hint={n("accepted") ? `${n("accepted")} accepted` : undefined}
        />
        <Stat label="Critical not fixed" value={String(criticalOpen)} />
      </div>

      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Domains">
        {domains.map((d) => (
          <li key={d.id}>
            <a
              href={`#sec-${d.id}`}
              className="border-line text-ink-soft hover:border-brand hover:text-ink inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.8125rem] font-medium transition-colors"
            >
              {d.label}
              <span className="text-ink-faint text-[0.75rem]">
                {d.items.length}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-8">
        {domains.map((d) => (
          <section key={d.id} id={`sec-${d.id}`} className="scroll-mt-32">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-ink text-[1.0625rem] font-semibold">
                {d.label}
              </h3>
              <p className="text-ink-faint text-[0.75rem]">{d.ref}</p>
            </div>
            <p className="text-ink-soft mt-0.5 text-[0.8125rem]">{d.blurb}</p>
            <ul className="card divide-line mt-3 divide-y overflow-hidden">
              {d.items.map((f) => (
                <li
                  key={`${f.project}-${f.audit}-${f.id}`}
                  className="grid gap-x-4 gap-y-2 p-4 sm:grid-cols-[5.5rem_minmax(0,1fr)_auto]"
                >
                  <div className="flex items-center gap-2 sm:flex-col sm:items-start">
                    <span className="text-ink font-mono text-[0.8125rem] font-semibold">
                      {f.id}
                    </span>
                    <span className={cn(chip, SEVERITY[f.severity])}>
                      {f.severity}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-ink-faint text-[0.75rem] font-semibold">
                      {projects && `${projects[f.project] ?? f.project} · `}
                      {f.subdomain} · audit {f.audit}
                    </p>
                    <p className="text-ink mt-1 text-[0.875rem] leading-relaxed">
                      {f.finding}
                    </p>
                    <p className="text-ink-soft mt-1 text-[0.8125rem] leading-relaxed">
                      <span className="text-ink font-semibold">
                        {f.status === "fixed" || f.status === "partly"
                          ? "Fix: "
                          : "Next: "}
                      </span>
                      {f.fix}
                    </p>
                  </div>
                  <div>
                    <span className={cn(chip, STATUS[f.status].tone)}>
                      {STATUS[f.status].label}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
