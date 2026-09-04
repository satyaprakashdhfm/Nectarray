/**
 * Shown the instant a tab is clicked, while the server renders the real page.
 *
 * It does two jobs. The obvious one is that pressing a tab now does something
 * immediately instead of leaving the old page on screen for a beat.
 *
 * The less obvious one matters more: without a loading boundary, Next
 * prefetches a *whole* dynamic page for every visible link — and the dashboard
 * has five tabs and up to fourteen lessons in view. Every page load was firing
 * a dozen full server renders, each with its own auth round trip and queries,
 * so the tab you actually pressed was queued behind the ones you did not. With
 * a boundary here, a prefetch stops at this skeleton and costs nothing.
 */
export default function DashboardLoading() {
  return (
    <div className="shell py-8 lg:py-10" aria-hidden>
      <div className="bg-mist h-9 w-64 animate-pulse rounded-lg" />
      <div className="bg-mist mt-8 h-32 animate-pulse rounded-2xl" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="bg-mist h-36 animate-pulse rounded-2xl" />
        <div className="bg-mist h-36 animate-pulse rounded-2xl" />
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}
