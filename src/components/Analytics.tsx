import Script from "next/script";
import { GA_MEASUREMENT_ID, analyticsEnabled } from "@/lib/analytics";

/**
 * Loads the GA4 tag.
 *
 * `afterInteractive` defers both scripts until the page is interactive, so
 * analytics never delays first paint — the reason to use next/script here
 * rather than dropping Google's raw snippet into the head.
 */
export function Analytics() {
  if (!analyticsEnabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
