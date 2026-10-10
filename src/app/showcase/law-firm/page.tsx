import type { Metadata } from "next";
import { Figtree, Outfit } from "next/font/google";
import { LawJourneySite } from "@/components/admin/animations/heroes/LawJourneySite";

/**
 * The law firm animation on a page of its own, full width with none of the
 * site's chrome, so it can be opened from the admin's Animations tab and
 * the link sent to the client. The Deeds & Co. faces and maroon are set
 * here; in the admin card the palette picker supplies the colour instead.
 */

const display = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});
const body = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: { absolute: "Deeds & Co. | Advanced Property Lawyers, Bengaluru" },
  description: "Website preview for Deeds & Co.",
  robots: { index: false, follow: false },
};

export default function LawFirmShowcase() {
  return (
    <div
      className={`${display.variable} ${body.variable} min-h-dvh bg-white`}
      style={{ "--p": "#7a0204", "--p-on": "#ffffff" } as React.CSSProperties}
    >
      <LawJourneySite />
    </div>
  );
}
