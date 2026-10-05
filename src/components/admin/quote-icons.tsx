import {
  BellRing,
  ChartLine,
  FileText,
  Globe,
  Headset,
  LayoutDashboard,
  Megaphone,
  MousePointerClick,
  Package,
  Search,
  Share2,
  Smartphone,
  Sparkles,
  Truck,
  UserRound,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  website: Globe,
  admin: LayoutDashboard,
  "articles-admin": FileText,
  "articles-ai": Sparkles,
  "client-login": UserRound,
  "employee-login": Users,
  social: Share2,
  notifications: BellRing,
  analytics: ChartLine,
  delivery: Truck,
  app: Smartphone,
  seo: Search,
  "meta-ads": Megaphone,
  "google-ads": MousePointerClick,
  maintenance: Wrench,
  "support-person": Headset,
};

/** The icon for a standard row, by its ref. Rows of our own get a box. */
export function QuoteIcon({
  refId,
  className,
}: {
  refId: string | null | undefined;
  className?: string;
}) {
  const Icon = (refId && ICONS[refId]) || Package;
  return <Icon className={className} strokeWidth={1.9} aria-hidden />;
}
