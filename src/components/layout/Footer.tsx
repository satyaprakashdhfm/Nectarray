import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { company, footerNote, liveSocials, pillars } from "@/lib/content";

/**
 * One flat colour, on every route — the other half of the bookend the header
 * opens. It previously took the page colour, which put a near-white footer
 * under a near-white page and left the site with no bottom edge at all.
 */
const link = "text-[0.9375rem] text-white/60 transition-colors hover:text-leaf";

export function Footer() {
  return (
    <footer className="border-night-line bg-night border-t">
      <div className="shell py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr] lg:gap-14">
          <div>
            <Logo
              className="inline-flex"
              markClassName="size-11"
              wordClassName="text-[1.5rem]"
            />

            <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-white/55">
              {footerNote}
            </p>

            <ul className="mt-7 flex flex-wrap gap-2">
              {liveSocials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="border-night-line hover:border-leaf hover:text-leaf inline-flex rounded-full border bg-white/[0.03] px-3.5 py-2 text-[0.8125rem] font-medium text-white/70 transition-colors"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Practices">
            <h2 className="eyebrow mb-5 text-white/40">Practices</h2>
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

          <nav aria-label="Company">
            <h2 className="eyebrow mb-5 text-white/40">Company</h2>
            <ul className="space-y-3">
              {[
                { label: "How we work", href: "/engagements" },
                { label: "Contact", href: "/contact" },
                { label: "Student login", href: "/dashboard" },
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

        <div className="border-night-line mt-12 flex flex-col gap-3 border-t pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] text-white/40">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p className="text-[0.8125rem] text-white/40">{company.location}</p>
        </div>
      </div>
    </footer>
  );
}
