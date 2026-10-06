import { SymbolView, type AndroidSymbol, type SFSymbol } from 'expo-symbols';

/**
 * The site names its icons with short keys ("bot", "cart") that its own Icon
 * component resolves to lucide. Here the same keys resolve to Material
 * Symbols on Android and SF Symbols on iPhone, so the content needs no
 * app-specific field.
 */
const ICONS: Record<string, { android: AndroidSymbol; ios: SFSymbol }> = {
  megaphone: { android: 'campaign', ios: 'megaphone' },
  code: { android: 'code', ios: 'chevron.left.forwardslash.chevron.right' },
  bot: { android: 'smart_toy', ios: 'cpu' },
  graduation: { android: 'school', ios: 'graduationcap' },
  cart: { android: 'shopping_cart', ios: 'cart' },
  check: { android: 'check_circle', ios: 'checkmark.circle' },
  database: { android: 'database', ios: 'cylinder.split.1x2' },
  gauge: { android: 'speed', ios: 'gauge' },
  globe: { android: 'language', ios: 'globe' },
  layers: { android: 'layers', ios: 'square.3.layers.3d' },
  layout: { android: 'dashboard', ios: 'rectangle.3.group' },
  message: { android: 'chat', ios: 'message' },
  notebook: { android: 'menu_book', ios: 'book' },
  phone: { android: 'call', ios: 'phone' },
  search: { android: 'search', ios: 'magnifyingglass' },
  shield: { android: 'shield', ios: 'shield' },
  smartphone: { android: 'smartphone', ios: 'iphone' },
  sparkles: { android: 'auto_awesome', ios: 'sparkles' },
  target: { android: 'target', ios: 'scope' },
  video: { android: 'videocam', ios: 'video' },
  workflow: { android: 'account_tree', ios: 'point.3.connected.trianglepath.dotted' },
  briefcase: { android: 'work', ios: 'briefcase' },
  // App chrome
  home: { android: 'home', ios: 'house' },
  services: { android: 'grid_view', ios: 'square.grid.2x2' },
  blog: { android: 'article', ios: 'doc.text' },
  mail: { android: 'mail', ios: 'envelope' },
  arrow: { android: 'arrow_forward', ios: 'arrow.right' },
  external: { android: 'north_east', ios: 'arrow.up.right' },
  expand: { android: 'expand_more', ios: 'chevron.down' },
  collapse: { android: 'expand_less', ios: 'chevron.up' },
  error: { android: 'error', ios: 'exclamationmark.circle' },
  person: { android: 'person', ios: 'person' },
  send: { android: 'send', ios: 'paperplane' },
};

export function Icon({ name, size = 22, color }: { name: string; size?: number; color: string }) {
  const icon = ICONS[name] ?? ICONS.sparkles;
  return (
    <SymbolView
      name={{ ios: icon.ios, android: icon.android, web: icon.android }}
      size={size}
      tintColor={color}
    />
  );
}
