import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ErrorPage, LoadingPage, Rise, Screen, Txt, usePalette } from '@/components/ui';
import { Radius, Space } from '@/constants/theme';
import { siteUrl, useContent } from '@/lib/api';
import { practiceHref } from '@/lib/links';

export default function ServicesScreen() {
  const content = useContent();
  const c = usePalette();

  if (content.status === 'loading') return <LoadingPage />;
  if (content.status === 'error') return <ErrorPage {...content} />;
  const { practices, company } = content.data;

  return (
    <Screen>
      <Txt variant="display">Services</Txt>
      <Txt tone="soft" style={{ marginTop: Space.sm }}>
        {company.tagline}.
      </Txt>

      <View style={{ marginTop: Space.xl, gap: Space.md }}>
        {practices.map((p, i) => (
          <Rise key={p.id} index={i}>
            <Pressable
              accessibilityRole="link"
              onPress={() => router.push(practiceHref(p.id))}
              style={({ pressed }) => [
                styles.row,
                { backgroundColor: c.surface, borderColor: c.line },
                { transform: [{ scale: pressed ? 0.98 : 1 }] },
              ]}>
              <Image
                source={siteUrl(p.image)}
                contentFit="cover"
                transition={200}
                style={styles.thumb}
              />
              <View style={{ flex: 1, gap: Space.xs }}>
                <View style={styles.head}>
                  <Icon name={p.icon} color={c.brandDeep} size={18} />
                  <Txt variant="heading" style={{ flex: 1, fontSize: 17 }}>
                    {p.title}
                  </Txt>
                </View>
                <Txt variant="small" tone="soft" numberOfLines={3}>
                  {p.summary}
                </Txt>
              </View>
            </Pressable>
          </Rise>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Space.md,
    padding: Space.sm + 2,
    borderRadius: Radius.card,
    borderWidth: 1,
    alignItems: 'center',
  },
  thumb: { width: 96, height: 112, borderRadius: Radius.card - 4 },
  head: { flexDirection: 'row', alignItems: 'center', gap: Space.sm },
});
