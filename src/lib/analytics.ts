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
