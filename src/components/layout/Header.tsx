"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { EnrolButton } from "@/components/auth/EnrolButton";
import { Logo } from "@/components/layout/Logo";
import { useEscapeKey, useLockBodyScroll } from "@/hooks";
import { nav } from "@/lib/content";

/**
 * One flat colour, on every route.
 *
 * This used to be transparent at the top and fade to a translucent page
 * colour on scroll, with a second light/dark fork for /agentic-ai. Against a
 * near-white hero that read as no header at all, and the fork meant the same
 * bar looked like two different components depending on the page. A solid
 * night bar bookends the page with the footer and is the same on every route,
 * so there is nothing to keep in sync.
 */
export function Header() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  useLockBodyScroll(open);
  useEscapeKey(close);

  return (
    <header className="border-night-line bg-night fixed inset-x-0 top-0 z-50 border-b">
      <div className="shell flex h-[72px] items-center justify-between gap-6">
        <Logo priority markClassName="size-10" />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-[0.9375rem] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Students already in a cohort need a door on every page, not only
              on /academy. Kept visually secondary to the sales CTA. */}
          <EnrolButton
            label="Log in"
            withArrow={false}
            fallbackHref="/academy#enrol"
            className="hidden rounded-full px-4 py-2.5 text-[0.9375rem] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:inline-flex"
          />

          {/* Straight to the enquiry form. The top of /contact opens on the
              same dark ground and the same contact details as the footer, so
              a CTA landing above the form reads as having gone nowhere. */}
          <Link
            href="/contact#enquiry"
            className="text-night hover:bg-leaf hidden rounded-full bg-white px-5 py-2.5 text-[0.9375rem] font-semibold transition-colors sm:inline-flex"
          >
            Book a call
          </Link>

          <button
            type="button"
            onClick={() => setOpen((isOpen) => !isOpen)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="border-night-line bg-night-soft grid size-10 place-items-center rounded-full border text-white lg:hidden"
          >
            {open ? (
              <X className="size-5" strokeWidth={2} aria-hidden />
            ) : (
              <Menu className="size-5" strokeWidth={2} aria-hidden />
            )}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-night-line bg-night border-t lg:hidden"
      >
        <nav className="shell flex flex-col py-4" aria-label="Mobile">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="border-night-line border-b py-3.5 text-lg font-medium text-white"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact#enquiry"
            onClick={close}
            className="text-night mt-5 rounded-full bg-white px-5 py-3.5 text-center text-base font-semibold"
          >
            Book a call
          </Link>
          <EnrolButton
            label="Log in"
            withArrow={false}
            fallbackHref="/academy#enrol"
            className="border-night-line mt-3 inline-flex justify-center rounded-full border px-5 py-3.5 text-center text-base font-medium text-white/80"
          />
        </nav>
      </div>
    </header>
  );
}
