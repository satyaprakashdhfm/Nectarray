import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Icon } from '@/components/icon';
import {
  Bullet,
  Button,
  Card,
  Chip,
  ErrorPage,
  Faq,
  IconCard,
  LoadingPage,
  Rise,
  Screen,
  Section,
  Txt,
  usePalette,
} from '@/components/ui';
import { Radius, Space } from '@/constants/theme';
import { useContent, type Content } from '@/lib/api';
import { contactHref } from '@/lib/links';

type Module = Content['academy']['course']['curriculum'][number];

export default function AcademyScreen() {
  const content = useContent();
  const c = usePalette();

  if (content.status === 'loading') return <LoadingPage />;
  if (content.status === 'error') return <ErrorPage {...content} />;
  const { academy } = content.data;
  const { course } = academy;

  return (
    <Screen>
      <Rise>
        <Txt variant="display">{academy.title}</Txt>
        <Txt tone="soft" style={{ marginTop: Space.md }}>
          {academy.lede}
        </Txt>
      </Rise>

      <Rise index={1}>
        <Card tint="brand" style={{ marginTop: Space.xl }}>
          <View style={{ flexDirection: 'row' }}>
            <Chip label={course.tag} selected />
          </View>
          <Txt variant="title" style={{ marginTop: Space.md }}>
            {course.title}
          </Txt>
          <Txt variant="small" tone="soft" style={{ marginTop: Space.sm }}>
            {course.summary}
          </Txt>
          <View style={styles.facts}>
            {course.facts.map((f) => (
              <View key={f.label} style={[styles.fact, { backgroundColor: c.surface }]}>
                <Txt variant="small" tone="faint">
                  {f.label}
                </Txt>
                <Txt variant="label" style={{ marginTop: 2 }}>
                  {f.value}
                </Txt>
              </View>
            ))}
          </View>
          <View style={{ gap: Space.sm, marginTop: Space.lg }}>
            <Button
              label="Enrol now"
              icon="arrow"
              onPress={() => router.navigate(contactHref('academy'))}
            />
            <Button
              label="Student sign in"
              kind="secondary"
              icon="person"
              onPress={() => router.push('/account')}
            />
          </View>
        </Card>
      </Rise>

      <Section title={course.about.title}>
        {course.about.paragraphs.map((p) => (
          <Txt key={p} tone="soft">
            {p}
          </Txt>
        ))}
      </Section>

      <Section title="What you get">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={292}
          decelerationRate="fast"
          contentContainerStyle={{ gap: Space.md, paddingHorizontal: Space.md + 4 }}
          style={styles.bleed}>
          {course.offerings.map((o) => (
            <View key={o.title} style={{ width: 276 }}>
              <IconCard icon={o.icon} title={o.title} body={o.body} />
            </View>
          ))}
        </ScrollView>
      </Section>

      <Section title="Curriculum">
        {course.curriculum.map((m) => (
          <ModuleCard key={m.n} module={m} />
        ))}
      </Section>

      <Section title="By the end you can">
        <View style={{ gap: Space.sm }}>
          {course.outcomes.map((o) => (
            <Bullet key={o}>{o}</Bullet>
          ))}
        </View>
      </Section>

      <Section title="Who it is for">
        <View style={{ gap: Space.sm }}>
          {course.forWho.map((o) => (
            <Bullet key={o}>{o}</Bullet>
          ))}
        </View>
      </Section>

      <Section title="Questions about the course">
        {course.faqs.map((f) => (
          <Faq key={f.q} {...f} />
        ))}
      </Section>
    </Screen>
  );
}

/** A module that opens to its topics. */
function ModuleCard({ module: m }: { module: Module }) {
  const c = usePalette();
  const [open, setOpen] = useState(false);
  return (
    <Card>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((v) => !v)}>
        <View style={styles.moduleHead}>
          <View style={[styles.moduleNo, { backgroundColor: c.brandWash }]}>
            <Txt variant="label" tone="brand">
              {m.n}
            </Txt>
          </View>
          <View style={{ flex: 1 }}>
            <Txt variant="heading">{m.title}</Txt>
            <Txt variant="small" tone="faint">
              {m.days}, {m.topics.length} topics
            </Txt>
          </View>
          <Icon name={open ? 'collapse' : 'expand'} color={c.inkFaint} size={22} />
        </View>
        <Txt variant="small" tone="soft" style={{ marginTop: Space.md }}>
          {m.summary}
        </Txt>
      </Pressable>
      {open ? (
        <Animated.View entering={FadeIn.duration(200)} style={{ marginTop: Space.md, gap: Space.md }}>
          {m.topics.map((t) => (
            <View key={t.title} style={[styles.topic, { borderColor: c.line }]}>
              <Txt variant="label">{t.title}</Txt>
              <Txt variant="small" tone="soft" style={{ marginTop: 2 }}>
                {t.body}
              </Txt>
            </View>
          ))}
        </Animated.View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.sm, marginTop: Space.lg },
  fact: { flexBasis: '47%', flexGrow: 1, padding: Space.sm + 4, borderRadius: Radius.card - 4 },
  bleed: { marginHorizontal: -(Space.md + 4) },
  moduleHead: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  moduleNo: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topic: { borderLeftWidth: 2, paddingLeft: Space.md },
});
