import { SectionTabs } from "@/components/admin/SectionTabs";

/** Projects, Stack, System design and General knowledge, as tabs of one section. */
export default function DevopsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SectionTabs section="devops" />
      {children}
    </>
  );
}
