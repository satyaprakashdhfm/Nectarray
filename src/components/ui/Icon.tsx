import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Briefcase,
  Check,
  Code2,
  Database,
  FileText,
  Gauge,
  Globe,
  GraduationCap,
  Image as ImageIcon,
  Layers,
  LayoutTemplate,
  Mail,
  Megaphone,
  MessageCircle,
  NotebookPen,
  Phone,
  Plug,
  Search,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Target,
  Video,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/**
 * Content files reference icons by string key so that lib/content.ts stays
 * plain data and can cross the server/client component boundary.
 */
const icons = {
  arrow: ArrowRight,
  arrowUp: ArrowUpRight,
  bot: Bot,
  briefcase: Briefcase,
  cart: ShoppingCart,
  chart: BarChart3,
  check: Check,
  code: Code2,
  database: Database,
  file: FileText,
  gauge: Gauge,
  globe: Globe,
  graduation: GraduationCap,
  image: ImageIcon,
  layers: Layers,
  layout: LayoutTemplate,
  mail: Mail,
  megaphone: Megaphone,
  message: MessageCircle,
  notebook: NotebookPen,
  phone: Phone,
  plug: Plug,
  search: Search,
  share: Share2,
  shield: ShieldCheck,
  smartphone: Smartphone,
  sparkles: Sparkles,
  target: Target,
  video: Video,
  workflow: Workflow,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

export function Icon({
  name,
  className,
  strokeWidth = 1.75,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Glyph = icons[name as IconName] ?? Sparkles;
  return <Glyph className={className} strokeWidth={strokeWidth} aria-hidden />;
}
