import Link from "next/link";
import { EnrolButton } from "@/components/auth/EnrolButton";
import { academy, academyNav } from "@/lib/content";

/**
 * A sticky in-page nav for the course, sitting directly under the site
 * header. The page is long and a visitor arriving from an ad wants the
 * curriculum or the FAQ, not a scroll — this keeps both one click away, and
 * keeps the apply button on screen the whole way down.
 *
 * `top-[72px]` is the header height; the two together are what
 * `scroll-padding-top` in globals.css clears on an anchor jump.
 */
export function AcademyNav() {
  return (
    <div className="border-line bg-surface/90 sticky top-[72px] z-40 border-y backdrop-blur-xl">
      <div className="shell flex h-14 items-center justify-between gap-6">
        <nav aria-label="On this page">
          <ul className="flex items-center gap-1 overflow-x-auto">
            {academyNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-ink-soft hover:bg-mist hover:text-ink inline-flex rounded-full px-3.5 py-2 text-[0.875rem] font-medium whitespace-nowrap transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <EnrolButton
          label={academy.course.cta.label}
          withArrow={false}
          className="bg-ink hover:bg-brand-deep hidden shrink-0 rounded-full px-5 py-2 text-[0.875rem] font-semibold text-white transition-colors sm:inline-flex"
        />
      </div>
    </div>
  );
}
