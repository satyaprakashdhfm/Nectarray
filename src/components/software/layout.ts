/**
 * Layout constants for the /software page.
 *
 * The site's `shell` utility caps content at 80rem, which is right for pages
 * whose body is prose. This page is not prose: it is four dense catalogues,
 * and at 80rem on a wide monitor the chip grids wrapped into tall columns
 * while a third of the screen sat empty on either side. So this page opts
 * into a wider measure and a smaller gutter.
 *
 * Kept as shared constants rather than a new global utility because nothing
 * outside this page should inherit them — `shell` stays the site default.
 * The repo already uses this pattern for repeated class strings (see the
 * `field` constants in the admin pages).
 */

/**
 * Wider than `shell`, with a tighter gutter.
 *
 * 92rem rather than something larger: the header and footer are fixed at
 * `shell`'s 80rem on every route, and pushing the body much past this starts
 * to read as the navigation being inset rather than the content being wide.
 * This buys back most of the empty margin without that.
 */
export const wideShell = "mx-auto w-full max-w-[92rem] px-4 sm:px-6 lg:px-8";

/**
 * Section rhythm, roughly half the vertical air of the marketing sections.
 * Those breathe because they carry one idea each; these carry a catalogue,
 * and the gaps between them were reading as the page having ended.
 */
export const sectionPad = "py-14 sm:py-16 lg:py-20";

/** Gap between a section's heading block and its grid. */
export const headGap = "mt-9 lg:mt-11";
