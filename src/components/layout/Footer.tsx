import { Logo } from "@/components/layout/Logo";
import { company, footerNote, nav, pillars } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-line bg-canvas border-t">
      <div className="shell py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          <div>
            <Logo
              className="inline-flex"
              markClassName="size-11"
              wordClassName="text-[1.5rem]"
            />

            <p className="text-ink-soft mt-5 max-w-sm text-[0.9375rem] leading-relaxed">
              {footerNote}
            </p>

            <ul className="mt-7 flex flex-wrap gap-2">
              {company.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="border-line bg-surface text-ink-soft hover:border-brand hover:text-brand-deep inline-flex rounded-full border px-3.5 py-2 text-[0.8125rem] font-medium transition-colors"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Practices">
            <h2 className="eyebrow mb-5">Practices</h2>
            <ul className="space-y-3">
              {pillars.map((pillar) => (
                <li key={pillar.id}>
                  <a
                    href={pillar.href}
                    className="text-ink-soft hover:text-brand-deep text-[0.9375rem] transition-colors"
                  >
                    {pillar.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Sections">
            <h2 className="eyebrow mb-5">Company</h2>
            <ul className="space-y-3">
              {[...nav, { label: "Contact", href: "#contact" }].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-ink-soft hover:text-brand-deep text-[0.9375rem] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-line mt-14 flex flex-col gap-3 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink-faint text-[0.8125rem]">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p className="text-ink-faint text-[0.8125rem]">{company.location}</p>
        </div>
      </div>
    </footer>
  );
}
