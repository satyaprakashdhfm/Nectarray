import { SectionTabs } from "@/components/admin/SectionTabs";

/** Ads, Analytics and SEO for our own website, as tabs of one section. */
export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SectionTabs section="website" />
      {children}
    </>
  );
}
