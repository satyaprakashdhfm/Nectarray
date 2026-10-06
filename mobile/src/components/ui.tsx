import { useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { Colors, Fonts, Radius, Space, type Palette } from '@/constants/theme';

export function usePalette(): Palette {
  return useColorScheme() === 'dark' ? Colors.dark : Colors.light;
}

type Variant = 'display' | 'title' | 'heading' | 'body' | 'small' | 'label';

const TYPE: Record<Variant, TextStyle> = {
  display: { fontFamily: Fonts.bold, fontSize: 32, lineHeight: 38, letterSpacing: -0.8 },
  title: { fontFamily: Fonts.bold, fontSize: 25, lineHeight: 31, letterSpacing: -0.5 },
  heading: { fontFamily: Fonts.semibold, fontSize: 18, lineHeight: 24, letterSpacing: -0.2 },
  body: { fontFamily: Fonts.regular, fontSize: 16, lineHeight: 24 },
  small: { fontFamily: Fonts.regular, fontSize: 14, lineHeight: 20 },
  label: { fontFamily: Fonts.medium, fontSize: 13, lineHeight: 18 },
};

/** Text in the site's face, with ink chosen by role rather than by hex. */
export function Txt({
  variant = 'body',
  tone = 'ink',
  style,
  ...rest
}: TextProps & { variant?: Variant; tone?: 'ink' | 'soft' | 'faint' | 'brand' | 'danger' }) {
  const c = usePalette();
  const color = {
    ink: c.ink,
    soft: c.inkSoft,
    faint: c.inkFaint,
    brand: c.brandDeep,
    danger: c.danger,
  }[tone];
  return <Text {...rest} style={[TYPE[variant], { color }, style]} />;
}

/** A scrolling page on the canvas colour, clear of the status bar. */
export function Screen({
  children,
  edges = ['top'],
}: {
  children: ReactNode;
  edges?: ('top' | 'bottom')[];
}) {
  const c = usePalette();
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: c.canvas }}>
      <ScrollView
        contentContainerStyle={styles.page}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

/** Rises into place as it mounts; the system's reduce-motion setting turns it off. */
export function Rise({
  children,
  index = 0,
  style,
}: {
  children: ReactNode;
  index?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 8) * 60)
        .springify()
        .damping(20)
        .stiffness(140)}
      style={style}>
      {children}
    </Animated.View>
  );
}

export function Section({ title, lede, children }: { title?: string; lede?: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      {title ? <Txt variant="title">{title}</Txt> : null}
      {lede ? (
        <Txt tone="soft" style={{ marginTop: title ? Space.sm : 0 }}>
          {lede}
        </Txt>
      ) : null}
      <View style={{ marginTop: title || lede ? Space.lg : 0, gap: Space.md }}>{children}</View>
    </View>
  );
}

export function Card({
  children,
  tint,
  style,
}: {
  children: ReactNode;
  tint?: 'brand' | 'leaf' | 'amber';
  style?: StyleProp<ViewStyle>;
}) {
  const c = usePalette();
  const background = tint
    ? { brand: c.brandWash, leaf: c.leafWash, amber: c.amberWash }[tint]
    : c.surface;
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: background, borderColor: tint ? 'transparent' : c.line },
        style,
      ]}>
      {children}
    </View>
  );
}

/** A card with the site's icon chip, a title and a paragraph. */
export function IconCard({
  icon,
  title,
  body,
  children,
}: {
  icon: string;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  const c = usePalette();
  return (
    <Card>
      <View style={[styles.iconChip, { backgroundColor: c.brandWash }]}>
        <Icon name={icon} color={c.brandDeep} size={22} />
      </View>
      <Txt variant="heading" style={{ marginTop: Space.md }}>
        {title}
      </Txt>
      <Txt tone="soft" variant="small" style={{ marginTop: Space.xs }}>
        {body}
      </Txt>
      {children}
    </Card>
  );
}

export function Button({
  label,
  onPress,
  kind = 'primary',
  icon,
  busy,
  disabled,
}: {
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'secondary';
  icon?: string;
  busy?: boolean;
  disabled?: boolean;
}) {
  const c = usePalette();
  const primary = kind === 'primary';
  const fg = primary ? c.onBrandSolid : c.ink;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || busy, busy }}
      disabled={disabled || busy}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        primary
          ? { backgroundColor: c.brandSolid }
          : { backgroundColor: c.surface, borderWidth: 1, borderColor: c.line },
        { opacity: disabled ? 0.5 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}>
      {busy ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          <Txt variant="label" numberOfLines={1} style={{ color: fg, fontSize: 15 }}>
            {label}
          </Txt>
          {icon ? <Icon name={icon} size={18} color={fg} /> : null}
        </>
      )}
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const c = usePalette();
  const body = (
    <Txt variant="label" style={{ color: selected ? c.onBrandSolid : c.inkSoft }}>
      {label}
    </Txt>
  );
  const style = [
    styles.chip,
    selected
      ? { backgroundColor: c.brandSolid, borderColor: c.brandSolid }
      : { backgroundColor: c.surface, borderColor: c.line },
  ];
  if (!onPress) return <View style={style}>{body}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [...style, { transform: [{ scale: pressed ? 0.96 : 1 }] }]}>
      {body}
    </Pressable>
  );
}

/** A question that opens to its answer. */
export function Faq({ q, a }: { q: string; a: string }) {
  const c = usePalette();
  const [open, setOpen] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      onPress={() => setOpen((v) => !v)}
      style={[styles.faq, { borderColor: c.line, backgroundColor: c.surface }]}>
      <View style={styles.faqHead}>
        <Txt variant="heading" style={{ flex: 1, fontSize: 16 }}>
          {q}
        </Txt>
        <Icon name={open ? 'collapse' : 'expand'} color={c.inkFaint} size={22} />
      </View>
      {open ? (
        <Animated.View entering={FadeIn.duration(180)}>
          <Txt tone="soft" variant="small" style={{ marginTop: Space.sm }}>
            {a}
          </Txt>
        </Animated.View>
      ) : null}
    </Pressable>
  );
}

/** A placeholder block in the shape of what is loading. */
export function Skeleton({ height, width = '100%' }: { height: number; width?: number | `${number}%` }) {
  const c = usePalette();
  return <View style={{ height, width, borderRadius: Radius.card, backgroundColor: c.mist }} />;
}

export function LoadingPage() {
  return (
    <Screen>
      <View style={{ gap: Space.md }}>
        <Skeleton height={20} width="40%" />
        <Skeleton height={76} />
        <Skeleton height={48} width="85%" />
        <Skeleton height={180} />
        <Skeleton height={180} />
      </View>
    </Screen>
  );
}

export function ErrorPage({ message, retry }: { message: string; retry: () => void }) {
  const c = usePalette();
  return (
    <Screen>
      <View style={styles.error}>
        <Icon name="error" color={c.danger} size={36} />
        <Txt variant="heading" style={{ textAlign: 'center' }}>
          Could not load this page
        </Txt>
        <Txt tone="soft" variant="small" style={{ textAlign: 'center' }}>
          Check your internet connection and try again. ({message})
        </Txt>
        <Button label="Try again" onPress={retry} />
      </View>
    </Screen>
  );
}

/** A tick-led line, for lists of outcomes and features. */
export function Bullet({ children }: { children: string }) {
  const c = usePalette();
  return (
    <View style={styles.bullet}>
      <Icon name="check" color={c.leafDeep} size={18} />
      <Txt tone="soft" variant="small" style={{ flex: 1 }}>
        {children}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: Space.md + 4, paddingTop: Space.md, paddingBottom: 120 },
  section: { marginTop: Space.xxl },
  card: { borderRadius: Radius.card, borderWidth: 1, padding: Space.md + 4 },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    minHeight: 50,
    paddingHorizontal: Space.lg,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.sm,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  faq: { borderWidth: 1, borderRadius: Radius.card, padding: Space.md },
  faqHead: { flexDirection: 'row', alignItems: 'center', gap: Space.sm },
  error: { alignItems: 'center', gap: Space.md, paddingTop: 120, paddingHorizontal: Space.lg },
  bullet: { flexDirection: 'row', gap: Space.sm, alignItems: 'flex-start' },
});
