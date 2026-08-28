"use client";

import { useCallback, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useEscapeKey, useHasScrolled, useLockBodyScroll } from "@/hooks";
import { nav } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const scrolled = useHasScrolled();

  const close = useCallback(() => setOpen(false), []);
  useLockBodyScroll(open);
  useEscapeKey(close);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled || open
          ? "border-line bg-canvas/85 backdrop-blur-xl"
          : "border-transparent",
      )}
    >
      <div className="shell flex h-[72px] items-center justify-between gap-6">
        <Logo priority markClassName="size-10" />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-ink-soft hover:bg-mist hover:text-ink rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="bg-ink hover:bg-brand-deep hidden rounded-full px-5 py-2.5 text-[0.9375rem] font-semibold text-white transition-colors sm:inline-flex"
          >
            Book a call
          </a>

          <button
            type="button"
            onClick={() => setOpen((isOpen) => !isOpen)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="border-line bg-surface text-ink grid size-10 place-items-center rounded-full border lg:hidden"
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
        className="border-line bg-canvas border-t lg:hidden"
      >
        <nav className="shell flex flex-col py-4" aria-label="Mobile">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={close}
              className="border-line-soft text-ink border-b py-3.5 text-lg font-medium"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={close}
            className="bg-ink mt-5 rounded-full px-5 py-3.5 text-center text-base font-semibold text-white"
          >
            Book a call
          </a>
        </nav>
      </div>
    </header>
  );
}
