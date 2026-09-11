"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { EnrolButton } from "@/components/auth/EnrolButton";
import { Logo } from "@/components/layout/Logo";
import { useEscapeKey, useLockBodyScroll } from "@/hooks";
import { nav } from "@/lib/content";

/**
 * The site header, in one of two dresses.
 *
 * `solid` is the default on every route: one flat night bar. It used to be
 * transparent at the top and fade on scroll, which against a near-white hero
 * read as no header at all.
 *
 * `glass` is for the home page only, where the hero is a full-bleed scene:
 * a frosted pill floating over it. It thickens once the scene has scrolled
 * away, because white type on light glass over a light page is grey on grey.
 *
 * Once the reader is past the top, the glass bar also gets out of the way:
 * it slides off while they scroll and comes back only after they have held
 * still for a second — someone who has stopped is reading or deciding, and
 * that is when the navigation is worth its space. Near the top it always
 * shows, and it never hides while its menu is open or focus is inside it.
 */
/** How still the reader has to be, and for how long, before the bar returns. */
const SHOW_AFTER_IDLE_MS = 1000;
/** Within this far of the top the bar is simply there. */
const SHOW_NEAR_TOP = 120;

export function Header({ variant = "solid" }: { variant?: "solid" | "glass" }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  useLockBodyScroll(open);
  useEscapeKey(close);

  const glass = variant === "glass";

  useEffect(() => {
    if (!glass) return;
    let idle: number | undefined;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > window.innerHeight - 140);

      // Every scroll event restarts the clock, so the bar only returns a
      // full second after the last one — a pause, not a slow scroll.
      window.clearTimeout(idle);
      if (y < SHOW_NEAR_TOP) {
        setHidden(false);
        return;
      }
      setHidden(true);
      idle = window.setTimeout(() => setHidden(false), SHOW_AFTER_IDLE_MS);
    };

    // A reload halfway down the page starts with the bar showing — only its
    // thickness is caught up, a frame in, rather than hiding it on arrival.
    const first = window.requestAnimationFrame(() =>
      setScrolled(window.scrollY > window.innerHeight - 140),
    );
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(first);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idle);
    };
  }, [glass]);

  const link = glass
    ? "rounded-full px-4 py-2 text-[0.9375rem] font-medium text-white/80 transition-colors hover:bg-white/12 hover:text-white"
    : "rounded-full px-4 py-2 text-[0.9375rem] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white";

  return (
    <header
      data-hidden={glass ? hidden && !open : undefined}
      className={
        glass
          ? "glass-header fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-5"
          : "border-night-line bg-night fixed inset-x-0 top-0 z-50 border-b"
      }
    >
      <div
        data-solid={glass ? scrolled || open : undefined}
        className={
          glass
            ? "glass-bar mx-auto flex h-16 max-w-[78rem] items-center justify-between gap-6 rounded-full pr-2.5 pl-5"
            : "shell flex h-[72px] items-center justify-between gap-6"
        }
      >
        <Logo priority markClassName={glass ? "size-9" : "size-10"} />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={link}>
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
            className={
              glass
                ? "hidden rounded-full px-4 py-2.5 text-[0.9375rem] font-medium text-white/80 transition-colors hover:bg-white/12 hover:text-white sm:inline-flex"
                : "hidden rounded-full px-4 py-2.5 text-[0.9375rem] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:inline-flex"
            }
          />

          {/* Straight to the enquiry form. The top of /contact opens on the
              same dark ground and the same contact details as the footer, so
              a CTA landing above the form reads as having gone nowhere. */}
          {glass ? (
            <Link
              href="/contact#enquiry"
              className="group text-night hidden items-center gap-2.5 rounded-full bg-white py-1.5 pr-1.5 pl-5 text-[0.9375rem] font-semibold transition-colors hover:bg-white/90 sm:inline-flex"
            >
              Book a call
              <span className="bg-night grid size-8 place-items-center rounded-full text-white transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight
                  className="size-4"
                  strokeWidth={2.25}
                  aria-hidden
                />
              </span>
            </Link>
          ) : (
            <Link
              href="/contact#enquiry"
              className="text-night hover:bg-leaf hidden rounded-full bg-white px-5 py-2.5 text-[0.9375rem] font-semibold transition-colors sm:inline-flex"
            >
              Book a call
            </Link>
          )}

          <button
            type="button"
            onClick={() => setOpen((isOpen) => !isOpen)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className={
              glass
                ? "grid size-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white lg:hidden"
                : "border-night-line bg-night-soft grid size-10 place-items-center rounded-full border text-white lg:hidden"
            }
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
        data-solid={glass ? true : undefined}
        className={
          glass
            ? "glass-bar mx-auto mt-2 max-w-[78rem] rounded-3xl lg:hidden"
            : "border-night-line bg-night border-t lg:hidden"
        }
      >
        <nav
          className={
            glass ? "flex flex-col px-5 py-3" : "shell flex flex-col py-4"
          }
          aria-label="Mobile"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className={
                glass
                  ? "border-b border-white/10 py-3.5 text-lg font-medium text-white"
                  : "border-night-line border-b py-3.5 text-lg font-medium text-white"
              }
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
            className={
              glass
                ? "mt-3 mb-2 inline-flex justify-center rounded-full border border-white/20 px-5 py-3.5 text-center text-base font-medium text-white/85"
                : "border-night-line mt-3 inline-flex justify-center rounded-full border px-5 py-3.5 text-center text-base font-medium text-white/80"
            }
          />
        </nav>
      </div>
    </header>
  );
}
