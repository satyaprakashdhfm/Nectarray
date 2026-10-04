import "server-only";
import { UI_COMPONENTS, type UiComponent } from "@/lib/content/ui-library";
import { HYPERUI_COMPONENTS } from "@/lib/content/ui-library-hyperui";
import { SECTION_COMPONENTS } from "@/lib/content/ui-library-sections";

/**
 * Every component on the Elements tab: ours first in each category, then
 * the ones taken from HyperUI. Server-only so the whole library is never
 * shipped to the browser; the page sends just the category on screen.
 */
export const ALL_COMPONENTS: UiComponent[] = [
  ...UI_COMPONENTS,
  ...SECTION_COMPONENTS,
  ...HYPERUI_COMPONENTS,
];
