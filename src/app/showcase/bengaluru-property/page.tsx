import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { BengaluruPropertySite } from "@/components/admin/animations/heroes/BengaluruPropertySite";

export const metadata: Metadata = {
  title: { absolute: "Property verification in Bengaluru" },
  description: "A property-verification home page over real Bengaluru maps.",
  robots: { index: false, follow: false },
};

/**
 * The Bengaluru property template on a page of its own, full screen, to open
 * from the Animations tab or send to a client. Its orange is the website's
 * own, #e8641b, with white on it as the site has it; peach and charcoal
 * beside it (paletteVars of #e8641b, #f6c9a6 and #2b3440, written out
 * because the palette module is for the browser).
 */
const PALETTE = {
  "--p": "#e8641b",
  "--p-light": "#fce9df",
  "--p-dark": "#7a3a19",
  "--p-on": "#ffffff",
  "--s": "#f6c9a6",
  "--s-light": "#fef7f3",
  "--s-dark": "#816d5e",
  "--s-on": "#111418",
  "--t": "#2b3440",
  "--t-light": "#e1e3e4",
  "--t-dark": "#1b222b",
  "--t-on": "#ffffff",
} as CSSProperties;

export default function BengaluruPropertyShowcase() {
  return (
    <main style={PALETTE} className="min-h-dvh [&>section]:min-h-dvh">
      <BengaluruPropertySite />
    </main>
  );
}
