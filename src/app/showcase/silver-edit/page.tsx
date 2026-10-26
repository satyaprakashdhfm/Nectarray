import type { Metadata } from "next";
import { JewellerySite } from "@/components/admin/animations/heroes/JewellerySite";

export const metadata: Metadata = {
  title: { absolute: "Noir & Silver | Shop the look" },
  description: "A men's silver jewellery store with a scroll-driven lookbook.",
  robots: { index: false, follow: false },
};

/**
 * The jewellery site on a page of its own, full width, to open from the
 * Animations tab or send to a client. It draws in its own photo's colours,
 * so it needs no palette.
 */
export default function SilverEditShowcase() {
  return (
    <main className="min-h-dvh bg-[#16100c]">
      <JewellerySite />
    </main>
  );
}
