import { PageHead } from "@/components/admin/Business";
import { PaletteTool } from "@/components/admin/PaletteTool";

/** Pick primary, secondary and tertiary, and see them on a sample site. */
export default function AdminWebColoursPage() {
  return (
    <>
      <PageHead
        title="Colours"
        lede="Three colours, each in a light, medium and dark shade. Change one and the sample site repaints."
      />
      <PaletteTool />
    </>
  );
}
