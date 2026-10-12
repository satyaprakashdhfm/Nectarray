import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { GeoChangeDetection } from "@/components/admin/animations/heroes/GeoChangeDetection";

export const metadata: Metadata = {
  title: { absolute: "Undetected | Satellite change detection" },
  description: "An animated hero for a satellite intelligence site.",
  robots: { index: false, follow: false },
};

/**
 * The satellite change-detection hero on a page of its own, full width, to
 * open from the Animations tab or send to a client. It takes the default
 * NectArray palette (paletteVars of DEFAULT_PALETTE, written out because
 * the palette module is for the browser).
 */
const PALETTE = {
  "--p": "#1fa5de",
  "--p-light": "#e0f2fa",
  "--p-dark": "#155b7a",
  "--p-on": "#111418",
  "--s": "#7ed957",
  "--s-light": "#edfae7",
  "--s-dark": "#457537",
  "--s-on": "#111418",
  "--t": "#f5a44a",
  "--t-light": "#fef2e6",
  "--t-dark": "#805a30",
  "--t-on": "#111418",
} as CSSProperties;

export default function UndetectedShowcase() {
  return (
    <main
      style={PALETTE}
      className="min-h-dvh bg-[#050607] [&>section]:min-h-dvh"
    >
      <GeoChangeDetection />
    </main>
  );
}
