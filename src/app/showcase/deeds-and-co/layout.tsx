import type { Metadata } from "next";
import { Figtree, Michroma, Outfit } from "next/font/google";

/**
 * The Deeds & Co. templates, each a page of its own with none of this
 * site's chrome, to open from the admin's Animations tab or send to the
 * client. The firm's own faces (as on its live site) are loaded here; the
 * templates read them through --font-outfit, --font-figtree and
 * --font-michroma.
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
const wide = Michroma({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-michroma",
});

export const metadata: Metadata = {
  title: { absolute: "Deeds & Co. | Advanced Property Lawyers, Bengaluru" },
  description: "Website previews for Deeds & Co.",
  robots: { index: false, follow: false },
};

export default function DeedsShowcaseLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${display.variable} ${body.variable} ${wide.variable} min-h-dvh bg-white`}
    >
      {children}
    </div>
  );
}
