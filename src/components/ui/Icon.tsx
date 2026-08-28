import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Briefcase,
  Check,
  Code2,
  Database,
  Gauge,
  Globe,
  GraduationCap,
  Layers,
  LayoutTemplate,
  Mail,
  Megaphone,
  MessageCircle,
  Phone,
  Plug,
  Search,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Target,
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
  gauge: Gauge,
  globe: Globe,
  graduation: GraduationCap,
  layers: Layers,
  layout: LayoutTemplate,
  mail: Mail,
  megaphone: Megaphone,
  message: MessageCircle,
  phone: Phone,
  plug: Plug,
  search: Search,
  share: Share2,
  shield: ShieldCheck,
  smartphone: Smartphone,
  sparkles: Sparkles,
  target: Target,
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
