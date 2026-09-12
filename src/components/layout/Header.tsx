"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { EnrolButton } from "@/components/auth/EnrolButton";
import { Logo } from "@/components/layout/Logo";
import { useEscapeKey, useLockBodyScroll } from "@/hooks";
import { nav } from "@/lib/content";
import { cn } from "@/lib/utils";

/** How long the reader has to hold still before the bar comes back. */
const SHOW_AFTER_IDLE_MS = 1000;
/** Within this far of the top the bar is simply there. */
const SHOW_NEAR_TOP = 120;

/**
 * The site header: a frosted glass pill floating over the page.
 *
 * Two things change as the reader moves.
 *
 * How thick the glass is. Over the hero it is a light frost and the scene
 * shows through. Everywhere else it is near-solid white, so a headline or
 * a photograph scrolling under it never competes with the navigation.
 *
 * Whether it is there at all. Past the top it slides away while the reader
 * scrolls and returns once they have held still for a second: someone who
 * has stopped is reading or deciding, which is when navigation earns its
 * space. Near the top it always shows, it never hides with its menu open,
 * and focus inside it overrides the hide (see .glass-header in globals.css).
 */
export function Header({ clearAtTop = false }: { clearAtTop?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [clear, setClear] = useState(clearAtTop);
  const [hidden, setHidden] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  useLockBodyScroll(open);
  useEscapeKey(close);

  useEffect(() => {
    let idle: number | undefined;

    // Clear while the dark section is still behind the bar, frosted from the
    // moment the page below it slides underneath. The bar's height is
    // fluid, so "behind the bar" is measured rather than assumed.
    const overDark = () => {
      if (!clearAtTop) return false;
      const zone = document.querySelector("[data-header-clear]");
      const bar = document.querySelector(".glass-bar");
      if (!zone || !bar) return false;
      return (
        zone.getBoundingClientRect().bottom > bar.getBoundingClientRect().bottom
      );
    };

    const onScroll = () => {
      setClear(overDark());

      // Every scroll event restarts the clock, so the bar only returns a
      // full second after the last one — a pause, not a slow scroll.
      window.clearTimeout(idle);
      if (window.scrollY < SHOW_NEAR_TOP) {
        setHidden(false);
        return;
      }
      setHidden(true);
      idle = window.setTimeout(() => setHidden(false), SHOW_AFTER_IDLE_MS);
    };

    // A reload halfway down the page starts with the bar showing — only its
    // thickness is caught up, a frame in, rather than hiding it on arrival.
    const first = window.requestAnimationFrame(() => setClear(overDark()));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(first);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idle);
    };
  }, [clearAtTop]);

  const isCurrent = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      data-hidden={hidden && !open}
      className="glass-header fixed inset-x-0 top-[var(--bar-top)] z-50 px-3 text-[length:var(--bar-fs)] sm:px-5"
    >
      <div
        data-solid={!clear || open}
        className="glass-bar mx-auto flex h-[var(--bar-h)] max-w-[78rem] items-center justify-between gap-6 rounded-full pr-[0.6em] pl-[1.3em] min-[1800px]:max-w-[84rem]"
      >
        <Logo
          priority
          markClassName="size-[2.4em]"
          wordClassName="text-[1.4em]"
        />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-[1.05em] py-[0.5em] font-medium transition-colors duration-200",
                isCurrent(item.href)
                  ? "bg-night/8 text-night"
                  : "text-night/65 hover:bg-night/6 hover:text-night",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Students already enrolled need a door on every page, not only
              on /academy. Kept visually secondary to the sales CTA. */}
          <EnrolButton
            label="Log in"
            withArrow={false}
            className="text-night/65 hover:bg-night/6 hover:text-night hidden rounded-full px-[1.05em] py-[0.6em] font-medium transition-colors duration-200 sm:inline-flex"
          />

          {/* Straight to the enquiry form. The top of /contact opens on the
              same dark ground and the same contact details as the footer, so
              a CTA landing above the form reads as having gone nowhere. */}
          <Link
            href="/contact#enquiry"
            className="group bg-night hidden items-center gap-[0.65em] rounded-full py-[0.4em] pr-[0.4em] pl-[1.3em] font-semibold text-white transition-colors duration-200 hover:bg-[#16303f] sm:inline-flex"
          >
            Book a call
            <span className="text-night grid size-[2.15em] place-items-center rounded-full bg-white transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight
                className="size-[1.05em]"
                strokeWidth={2.25}
                aria-hidden
              />
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((isOpen) => !isOpen)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="border-night/12 bg-night/5 text-night hover:bg-night/10 grid size-10 place-items-center rounded-full border transition-colors duration-200 lg:hidden"
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
        data-solid
        className="glass-bar mx-auto mt-2 max-w-[78rem] rounded-3xl lg:hidden"
      >
        <nav className="flex flex-col px-5 py-3" aria-label="Mobile">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              className={cn(
                "border-night/8 border-b py-3.5 text-lg font-medium",
                isCurrent(item.href) ? "text-brand-solid" : "text-night",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact#enquiry"
            onClick={close}
            className="bg-night mt-5 rounded-full px-5 py-3.5 text-center text-base font-semibold text-white"
          >
            Book a call
          </Link>
          <EnrolButton
            label="Log in"
            withArrow={false}
            className="border-night/12 text-night/80 mt-3 mb-2 inline-flex justify-center rounded-full border px-5 py-3.5 text-center text-base font-medium"
          />
        </nav>
      </div>
    </header>
  );
}
