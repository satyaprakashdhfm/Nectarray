import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { company, footerNote, liveSocials, nav, pillars } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * `onDark` matches the footer to pages built on the night ground, so a dark
 * page does not end in a bright cream slab.
 */
export function Footer({ onDark = false }: { onDark?: boolean }) {
  const link = cn(
    "text-[0.9375rem] transition-colors",
    onDark
      ? "text-white/60 hover:text-leaf"
      : "text-ink-soft hover:text-brand-deep",
  );
  const heading = cn("eyebrow mb-5", onDark && "text-white/40");
  const rule = onDark ? "border-night-line" : "border-line";

  return (
    <footer
      className={cn(
        "border-t",
        onDark ? "border-night-line bg-night" : "border-line bg-canvas",
      )}
    >
      <div className="shell py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          <div>
            <Logo
              className="inline-flex"
              markClassName="size-11"
              wordClassName="text-[1.5rem]"
            />

            <p
              className={cn(
                "mt-5 max-w-sm text-[0.9375rem] leading-relaxed",
                onDark ? "text-white/55" : "text-ink-soft",
              )}
            >
              {footerNote}
            </p>

            <ul className="mt-7 flex flex-wrap gap-2">
              {liveSocials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={cn(
                      "inline-flex rounded-full border px-3.5 py-2 text-[0.8125rem] font-medium transition-colors",
                      onDark
                        ? "border-night-line hover:border-leaf hover:text-leaf bg-white/[0.03] text-white/70"
                        : "border-line bg-surface text-ink-soft hover:border-brand hover:text-brand-deep",
                    )}
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Practices">
            <h2 className={heading}>Practices</h2>
            <ul className="space-y-3">
              {pillars.map((pillar) => (
                <li key={pillar.id}>
                  <Link href={pillar.href} className={link}>
                    {pillar.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Sections">
            <h2 className={heading}>Company</h2>
            <ul className="space-y-3">
              {[
                ...nav,
                { label: "Engagements", href: "/engagements" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div
          className={cn(
            "mt-14 flex flex-col gap-3 border-t pt-8 sm:flex-row sm:items-center sm:justify-between",
            rule,
          )}
        >
          <p
            className={cn(
              "text-[0.8125rem]",
              onDark ? "text-white/40" : "text-ink-faint",
            )}
          >
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p
            className={cn(
              "text-[0.8125rem]",
              onDark ? "text-white/40" : "text-ink-faint",
            )}
          >
            {company.location}
          </p>
        </div>
      </div>
    </footer>
  );
}
