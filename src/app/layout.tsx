import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, Source_Serif_4 } from "next/font/google";
import { Analytics, TagManagerNoScript } from "@/components/Analytics";
import { company } from "@/lib/content";
import { siteDescription, siteUrl } from "@/lib/seo";
import "./globals.css";

/**
 * Stand-ins for the licensed brand faces. The CSS stacks in globals.css put
 * "Anthropic Sans" / "Anthropic Serif" ahead of these, so dropping the real
 * woff2 files into /public/fonts is the only step needed to switch over.
 */
const fallbackSans = Schibsted_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fallback-sans",
});

const fallbackSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-fallback-serif",
});

const title = `${company.name} — ${company.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s — ${company.name}` },
  description: siteDescription,
  keywords: [
    "software development company",
    "web application development",
    "AI agent development",
    "chatbot development",
    "digital marketing agency",
    "Meta ads",
    "Google ads",
    "Python SQL data science course",
  ],
  applicationName: company.name,
  authors: [{ name: company.name, url: siteUrl }],
  creator: company.name,
  publisher: company.name,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: company.name,
    locale: "en_IN",
    title,
    description: siteDescription,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${company.name} — ${company.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteDescription,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Paste the token from Search Console → Settings → Ownership verification →
  // HTML tag, then redeploy. Until then this key is simply omitted.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#fbfcfc",
  colorScheme: "light",
};

/**
 * Arms the scroll-reveal styles before first paint, but only where the
 * observer that drives them exists. If this never runs -- no scripting, an
 * old browser -- every .reveal simply renders visible instead of vanishing.
 */
const revealFlag = `if("IntersectionObserver" in window)document.documentElement.dataset.reveal="on"`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fallbackSans.variable} ${fallbackSerif.variable}`}
      /*
       * Two scripts deliberately write to this element before React arrives —
       * the reveal flag below and the theme flag in the signed-in area — so
       * the server HTML and the hydrating client HTML are *meant* to differ
       * here. Without this React logged a hydration mismatch on every page,
       * which is noise that hides the mismatches worth reading.
       */
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealFlag }} />
      </head>
      <body>
        <TagManagerNoScript />
        <a
          href="#main"
          className="focus:bg-ink sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
