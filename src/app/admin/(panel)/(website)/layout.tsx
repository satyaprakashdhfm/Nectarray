import { SectionTabs } from "@/components/admin/SectionTabs";
import { adminPage } from "@/lib/auth/access";

/** Ads, Analytics and SEO for our own website, as tabs of one section. */
export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await adminPage();
  return (
    <>
      <SectionTabs section="website" />
      {children}
    </>
  );
}
