"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useEscapeKey, useHasScrolled, useLockBodyScroll } from "@/hooks";
import { nav } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * `onDark` switches the chrome for pages built on the night ground, such as
 * /agentic-ai. Without it the header keeps its light scrolled background and
 * ink-coloured links, which on a dark page is both jarring on scroll and
 * unreadable at the top.
 */
export function Header({ onDark = false }: { onDark?: boolean }) {
  const [open, setOpen] = useState(false);
  const scrolled = useHasScrolled();

  const close = useCallback(() => setOpen(false), []);
  useLockBodyScroll(open);
  useEscapeKey(close);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        solid
          ? onDark
            ? "border-night-line bg-night/85 backdrop-blur-xl"
            : "border-line bg-canvas/85 backdrop-blur-xl"
          : "border-transparent",
      )}
    >
      <div className="shell flex h-[72px] items-center justify-between gap-6">
        <Logo priority markClassName="size-10" />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors",
                onDark
                  ? "text-white/65 hover:bg-white/10 hover:text-white"
                  : "text-ink-soft hover:bg-mist hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className={cn(
              "hidden rounded-full px-5 py-2.5 text-[0.9375rem] font-semibold transition-colors sm:inline-flex",
              onDark
                ? "text-night hover:bg-leaf bg-white"
                : "bg-ink hover:bg-brand-deep text-white",
            )}
          >
            Book a call
          </Link>

          <button
            type="button"
            onClick={() => setOpen((isOpen) => !isOpen)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className={cn(
              "grid size-10 place-items-center rounded-full border lg:hidden",
              onDark
                ? "border-night-line bg-night-soft text-white"
                : "border-line bg-surface text-ink",
            )}
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
        className={cn(
          "border-t lg:hidden",
          onDark ? "border-night-line bg-night" : "border-line bg-canvas",
        )}
      >
        <nav className="shell flex flex-col py-4" aria-label="Mobile">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className={cn(
                "border-b py-3.5 text-lg font-medium",
                onDark
                  ? "border-night-line text-white"
                  : "border-line-soft text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={close}
            className={cn(
              "mt-5 rounded-full px-5 py-3.5 text-center text-base font-semibold",
              onDark ? "text-night bg-white" : "bg-ink text-white",
            )}
          >
            Book a call
          </Link>
        </nav>
      </div>
    </header>
  );
}
