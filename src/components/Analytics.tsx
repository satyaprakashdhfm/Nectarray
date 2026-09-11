import Script from "next/script";
import {
  GA_MEASUREMENT_ID,
  GTM_CONTAINER_ID,
  analyticsEnabled,
  tagManagerEnabled,
} from "@/lib/analytics";

/**
 * Loads GA4, and the Google Tag Manager container when it has tags to carry.
 *
 * GA4's library waits for `lazyOnload` — until the page has finished loading
 * and the browser is idle — because it is the heaviest thing the site ships:
 * about 340 KB across its two files, more than all of the site's own
 * JavaScript. At `afterInteractive` it downloaded and ran alongside the
 * page's own code, competing with it on exactly the slow phones where that
 * hurts most. The small inline queue below still runs early, so
 * `trackEvent` calls made before the library arrives are held in the
 * dataLayer and sent when it does, not dropped.
 *
 * GA4 is loaded here directly and must NOT also be configured as a tag inside
 * the GTM container; see the note in lib/analytics.ts.
 */
export function Analytics() {
  if (!analyticsEnabled) return null;

  return (
    <>
      {/* GA4 */}
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />

      {/* Google Tag Manager */}
      {tagManagerEnabled && (
        <Script id="gtm-init" strategy="lazyOnload">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');
          `}
        </Script>
      )}
    </>
  );
}

/**
 * The GTM fallback for visitors without JavaScript. Belongs immediately after
 * the opening <body> tag, which is why it is separate from <Analytics /> —
 * that renders at the end of the body.
 */
export function TagManagerNoScript() {
  if (!analyticsEnabled || !tagManagerEnabled) return null;

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
