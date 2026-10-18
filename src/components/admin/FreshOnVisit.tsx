"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Keeps a page of live figures live. The router hands back a page seen in
 * the last half minute without asking the server (staleTimes in
 * next.config), so a fee changed on the students page could show its old
 * figure on the dashboard for a moment. Shown from that store, or brought
 * back to the front, the page fetches its figures again.
 */
export function FreshOnVisit({ renderedAt }: { renderedAt: number }) {
  const router = useRouter();
  useEffect(() => {
    if (Date.now() - renderedAt > 3000) router.refresh();
    const back = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    document.addEventListener("visibilitychange", back);
    return () => document.removeEventListener("visibilitychange", back);
  }, [renderedAt, router]);
  return null;
}
