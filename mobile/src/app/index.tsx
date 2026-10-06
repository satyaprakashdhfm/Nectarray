import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import {
  Bullet,
  Button,
  Card,
  Chip,
  ErrorPage,
  Faq,
  LoadingPage,
  Rise,
  Screen,
  Section,
  Txt,
  usePalette,
} from '@/components/ui';
import { Radius, Space } from '@/constants/theme';
import { siteUrl, useContent } from '@/lib/api';
import { practiceHref } from '@/lib/links';

export default function HomeScreen() {
  const content = useContent();
  const c = usePalette();

  if (content.status === 'loading') return <LoadingPage />;
  if (content.status === 'error') return <ErrorPage {...content} />;
  const { hero, practices, process, pricing, faqs, company } = content.data;

  return (
    <Screen>
      <View style={styles.brand}>
        <Image source={require('@/assets/images/logo-mark.png')} style={styles.mark} />
        <Txt variant="heading">{company.name}</Txt>
      </View>

      <Rise style={{ marginTop: Space.xl }}>
        <Txt variant="display">{hero.headline.join(' ')}</Txt>
        <Txt tone="soft" style={{ marginTop: Space.md }}>
          {hero.lede}
        </Txt>
        <View style={styles.ctas}>
          <Button label="Start a project" icon="arrow" onPress={() => router.navigate('/contact')} />
          <Button label="See what we do" kind="secondary" onPress={() => router.navigate('/services')} />
        </View>
      </Rise>

      <Rise index={1} style={[styles.stats, { borderColor: c.line }]}>
        {hero.stats.map((s) => (
          <View key={s.label} style={{ flex: 1 }}>
            <Txt variant="title" tone="brand">
              {s.value}
            </Txt>
            <Txt variant="small" tone="faint">
              {s.label}
            </Txt>
          </View>
        ))}
      </Rise>

      <Section title="Four practices, one team">
        {practices.map((p, i) => (
          <Rise key={p.id} index={i}>
            <Pressable
              accessibilityRole="link"
              onPress={() => router.navigate(practiceHref(p.id))}
              style={({ pressed }) => [
                styles.practice,
                { backgroundColor: c.surface, borderColor: c.line },
                { transform: [{ scale: pressed ? 0.98 : 1 }] },
              ]}>
              <Image
                source={siteUrl(p.image)}
                accessibilityLabel=""
                contentFit="cover"
                transition={200}
                style={styles.practiceImage}
              />
              <View style={{ padding: Space.md + 4, gap: Space.sm }}>
                <View style={styles.practiceHead}>
                  <Txt variant="heading" style={{ flex: 1 }}>
                    {p.title}
                  </Txt>
                  <Icon name="arrow" color={c.brandDeep} size={20} />
                </View>
                <Txt variant="small" tone="soft">
                  {p.summary}
                </Txt>
                <View style={styles.chips}>
                  {p.points.map((point) => (
                    <Chip key={point} label={point} />
                  ))}
                </View>
              </View>
            </Pressable>
          </Rise>
        ))}
      </Section>

      <Section title={process.title} lede={process.lede}>
        <View>
          {process.steps.map((step, i) => (
            <View key={step.n} style={styles.step}>
              <View style={styles.rail}>
                <View style={[styles.stepDot, { backgroundColor: c.brandWash }]}>
                  <Txt variant="label" tone="brand">
                    {step.n}
                  </Txt>
                </View>
                {i < process.steps.length - 1 ? (
                  <View style={[styles.stepLine, { backgroundColor: c.line }]} />
                ) : null}
              </View>
              <View style={{ flex: 1, paddingBottom: Space.lg }}>
                <Txt variant="heading">{step.title}</Txt>
                <Txt variant="small" tone="soft" style={{ marginTop: Space.xs }}>
                  {step.body}
                </Txt>
              </View>
            </View>
          ))}
        </View>
      </Section>

      <Section title={pricing.title} lede={pricing.lede}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={292}
          decelerationRate="fast"
          contentContainerStyle={{ gap: Space.md, paddingHorizontal: Space.md + 4 }}
          style={styles.bleed}>
          {pricing.plans.map((plan) => (
            <Card key={plan.name} tint={plan.featured ? 'brand' : undefined} style={styles.plan}>
              <Txt variant="title">{plan.name}</Txt>
              <Txt variant="small" tone="soft" style={{ marginTop: Space.sm }}>
                {plan.body}
              </Txt>
              <View style={{ gap: Space.sm, marginTop: Space.md }}>
                {plan.features.map((f) => (
                  <Bullet key={f}>{f}</Bullet>
                ))}
              </View>
            </Card>
          ))}
        </ScrollView>
        <Txt variant="small" tone="faint">
          {pricing.footnote}
        </Txt>
      </Section>

      <Section title="Questions people ask">
        {faqs.map((f) => (
          <Faq key={f.q} {...f} />
        ))}
      </Section>

      <Card tint="brand" style={{ marginTop: Space.xxl, gap: Space.md }}>
        <Txt variant="title">Have something in mind?</Txt>
        <Txt tone="soft">One call is usually enough to know what your project needs.</Txt>
        <Button label="Start a project" icon="arrow" onPress={() => router.navigate('/contact')} />
      </Card>

      <Txt variant="small" tone="faint" style={{ marginTop: Space.xl, textAlign: 'center' }}>
        {company.location}
      </Txt>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: Space.sm },
  mark: { width: 34, height: 30 },
  ctas: { marginTop: Space.lg, gap: Space.sm },
  stats: {
    flexDirection: 'row',
    gap: Space.md,
    marginTop: Space.xl,
    paddingTop: Space.lg,
    borderTopWidth: 1,
  },
  practice: { borderRadius: Radius.card, borderWidth: 1, overflow: 'hidden' },
  practiceImage: { width: '100%', aspectRatio: 16 / 9 },
  practiceHead: { flexDirection: 'row', alignItems: 'center', gap: Space.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.xs + 2, marginTop: Space.xs },
  step: { flexDirection: 'row', gap: Space.md },
  rail: { alignItems: 'center' },
  stepDot: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLine: { width: 2, flex: 1, marginVertical: Space.xs },
  bleed: { marginHorizontal: -(Space.md + 4) },
  plan: { width: 276 },
});
