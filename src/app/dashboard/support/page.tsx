import { LifeBuoy, Mail, Phone } from "lucide-react";
import { company } from "@/lib/content";

export default function SupportPage() {
  const rows = [
    { icon: Mail, label: company.email, href: `mailto:${company.email}` },
    {
      icon: Phone,
      label: company.phone,
      href: `tel:${company.phone.replace(/\s/g, "")}`,
    },
  ];

  return (
    <div className="shell py-8 lg:py-10">
      <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
        Support
      </h1>
      <p className="text-ink-soft mt-3 text-[0.9375rem]">
        Stuck on something, or something here is broken? Ask — there are five of
        you, so questions get answered.
      </p>

      <div className="card mt-8 p-7">
        <span className="bg-brand-wash text-brand-deep grid size-11 place-items-center rounded-xl">
          <LifeBuoy className="size-5" strokeWidth={1.9} aria-hidden />
        </span>
        <h2 className="text-ink mt-5 text-[1.0625rem] font-semibold">
          Reach us directly
        </h2>
        <ul className="mt-4 space-y-3">
          {rows.map((row) => (
            <li key={row.label}>
              <a
                href={row.href}
                className="text-ink-soft hover:text-brand-deep inline-flex items-center gap-3 text-[0.9375rem] transition-colors"
              >
                <row.icon
                  className="text-ink-faint size-4"
                  strokeWidth={1.9}
                  aria-hidden
                />
                {row.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
