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
 * from the Animations tab or send to a client. Its palette is a soft orange
 * with peach and charcoal (paletteVars of #d9733b, #f3c9a8 and #2b3440,
 * written out because the palette module is for the browser).
 */
const PALETTE = {
  "--p": "#d9733b",
  "--p-light": "#faebe4",
  "--p-dark": "#724229",
  "--p-on": "#111418",
  "--s": "#f3c9a8",
  "--s-light": "#fdf7f3",
  "--s-dark": "#7f6d5f",
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
