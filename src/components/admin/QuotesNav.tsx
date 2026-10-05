import Link from "next/link";
import { FileText, IndianRupee, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin/quotes", label: "Quotes", icon: FileText },
  { href: "/admin/quotes/prices", label: "Standard prices", icon: IndianRupee },
  { href: "/admin/quotes/costs", label: "Third-party costs", icon: Receipt },
];

/** Quotes and the standard price list, side by side. */
export function QuotesNav({ current }: { current: string }) {
  return (
    <nav aria-label="Quotations" className="mt-5">
      <ul className="bg-surface border-line inline-flex max-w-full overflow-x-auto rounded-lg border p-0.5">
        {TABS.map((tab) => {
          const active = tab.href === current;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-[0.8125rem] font-semibold whitespace-nowrap transition-colors",
                  active ? "bg-mist text-ink" : "text-ink-faint hover:text-ink",
                )}
              >
                <tab.icon className="size-4" strokeWidth={1.9} aria-hidden />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
