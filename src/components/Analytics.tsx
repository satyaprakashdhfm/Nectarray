import Script from "next/script";
import {
  GA_MEASUREMENT_ID,
  GTM_CONTAINER_ID,
  analyticsEnabled,
} from "@/lib/analytics";

/**
 * Loads GA4 and the Google Tag Manager container.
 *
 * `afterInteractive` defers every script until the page is interactive, so
 * measurement never delays first paint — the reason to use next/script here
 * rather than dropping Google's raw snippets into the head as its install
 * screen suggests.
 *
 * GA4 is loaded here directly and must NOT also be configured as a tag inside
 * the GTM container; see the note in lib/analytics.ts.
 */
export function Analytics() {
  if (!analyticsEnabled) return null;

  return (
    <>
      {/* GA4 */}
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

      {/* Google Tag Manager */}
      <Script id="gtm-init" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');
        `}
      </Script>
    </>
  );
}

/**
 * The GTM fallback for visitors without JavaScript. Belongs immediately after
 * the opening <body> tag, which is why it is separate from <Analytics /> —
 * that renders at the end of the body.
 */
export function TagManagerNoScript() {
  if (!analyticsEnabled) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
