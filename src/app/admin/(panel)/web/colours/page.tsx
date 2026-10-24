import { PageHead } from "@/components/admin/Business";
import { PaletteGallery } from "@/components/admin/PaletteGallery";
import { getSavedPalettes } from "@/lib/web-domains";

export const dynamic = "force-dynamic";

/** Trending palettes from Coolors, grouped by style. */
export default async function AdminWebColoursPage() {
  const saved = await getSavedPalettes();
  return (
    <>
      <PageHead
        title="Colours"
        lede="Trending palettes from Coolors, grouped by style. Click a colour to copy it."
      />
      <PaletteGallery saved={saved} />
    </>
  );
}
