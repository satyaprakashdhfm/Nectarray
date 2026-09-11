/**
 * Google Analytics 4.
 *
 * The measurement ID is not a secret — it ships in the page source of every
 * site that uses GA4 — so it lives here rather than in an environment
 * variable, which keeps deploys config-free. Swap the string to move the site
 * to a different property.
 */
export const GA_MEASUREMENT_ID = "G-E5N83KZDXQ";

/**
 * Google Tag Manager container.
 *
 * GTM is here to carry the tags that arrive later — Google Ads conversions,
 * the Meta Pixel, the LinkedIn Insight tag — so they can be added from the
 * GTM console without a deploy.
 *
 * ⚠ Do NOT add a GA4 configuration tag inside this container. GA4 is loaded
 * directly by <Analytics />, and a second copy firing through GTM would count
 * every page view and every event twice. The split is deliberate:
 *   GA4          → lives in code, version-controlled, already working
 *   Everything else → lives in GTM, changeable without a deploy
 */
export const GTM_CONTAINER_ID = "GTM-P6CR6X3N";

/**
 * Whether to load the GTM container at all.
 *
 * Off while the container is empty: as published on 2026-09-12 it held no
 * tags, so every visit downloaded and ran 115 KB of script that did
 * nothing. Publishing a tag in the GTM console is not enough on its own —
 * set this to true in the same breath, or the tag will never load.
 */
export const tagManagerEnabled = false;

/**
 * Analytics only loads in production builds, so local development and
 * preview work never pollutes the property's data. To check the tag locally,
 * run `npm run build && npm start` and watch GA4 → Reports → Realtime.
 */
export const analyticsEnabled =
  process.env.NODE_ENV === "production" && GA_MEASUREMENT_ID.length > 0;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Sends a GA4 event, and does nothing at all if the tag has not loaded —
 * an ad blocker, a dev build, or a visitor who declined tracking. Analytics
 * must never be able to break a user action, so this never throws.
 */
export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function")
    return;
  window.gtag("event", name, params ?? {});
}
