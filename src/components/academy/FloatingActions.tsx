"use client";

import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { company } from "@/lib/content";

/**
 * The two buttons that follow you down the page: message us, and go back up.
 *
 * Both are afterthoughts by design — they sit in the corners, out of the
 * reading column, and neither appears until it has a reason to. The scroll
 * button in particular is useless at the top of a page, so it is not there.
 */
export function FloatingActions() {
  const [up, setUp] = useState(false);

  useEffect(() => {
    const onScroll = () => setUp(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsapp = `https://wa.me/${company.phone.replace(/[^0-9]/g, "")}`;

  return (
    <>
      <a
        href={whatsapp}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Message us on WhatsApp"
        className="fixed bottom-6 left-6 z-50 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] transition-transform hover:scale-105"
      >
        <MessageCircle
          className="size-7 fill-current"
          strokeWidth={0}
          aria-hidden
        />
      </a>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`bg-brand-deep fixed right-6 bottom-6 z-50 grid size-12 place-items-center rounded-xl text-white shadow-lg transition-all ${
          up ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <ArrowUp className="size-5" strokeWidth={2.4} aria-hidden />
      </button>
    </>
  );
}
