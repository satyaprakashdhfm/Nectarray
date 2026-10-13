"use client";

import { X } from "lucide-react";

type AppBridge = { ReactNativeWebView?: { postMessage: (m: string) => void } };

/**
 * In the Android app, where the panel opens inside the app: back to the
 * app. It stands where Sign out is on the website, because signing out of
 * the app's admin side is done on its Account screen, which ends this
 * panel session too.
 */
export function AppClose() {
  return (
    <button
      type="button"
      onClick={() =>
        (window as Window & AppBridge).ReactNativeWebView?.postMessage(
          JSON.stringify({ type: "close" }),
        )
      }
      aria-label="Close the panel"
      className="border-night-line inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-[0.875rem] font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
    >
      <X className="size-4 shrink-0" strokeWidth={1.9} aria-hidden />
      Close
    </button>
  );
}
