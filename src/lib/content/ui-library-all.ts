import "server-only";
import { UI_COMPONENTS, type UiComponent } from "@/lib/content/ui-library";
import { HYPERUI_COMPONENTS } from "@/lib/content/ui-library-hyperui";
import { MORE_COMPONENTS } from "@/lib/content/ui-library-more";
import { PAGE_COMPONENTS } from "@/lib/content/ui-library-page";
import { SECTION_COMPONENTS } from "@/lib/content/ui-library-sections";
import { SHOP_COMPONENTS } from "@/lib/content/ui-library-shop";

/**
 * Every component on the Elements tab: ours first in each category, then
 * the ones taken from HyperUI. Server-only so the whole library is never
 * shipped to the browser; the page sends just the category on screen.
 */
export const ALL_COMPONENTS: UiComponent[] = [
  ...MORE_COMPONENTS,
  ...UI_COMPONENTS,
  ...PAGE_COMPONENTS,
  ...SECTION_COMPONENTS,
  ...SHOP_COMPONENTS,
  ...HYPERUI_COMPONENTS,
];
