import { Image } from 'expo-image';
import { Redirect, Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Bullet,
  Button,
  Card,
  Chip,
  ErrorPage,
  IconCard,
  LoadingPage,
  Rise,
  Screen,
  Section,
  Txt,
  usePalette,
} from '@/components/ui';
import { Radius, Space } from '@/constants/theme';
import { siteUrl, useContent, type Content, type Practice } from '@/lib/api';
import { contactHref } from '@/lib/links';

/** One practice: its picture, what it is, and the work inside it. */
export default function PracticeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const content = useContent();

  if (id === 'academy') return <Redirect href="/academy" />;
  if (content.status === 'loading') return <LoadingPage />;
  if (content.status === 'error') return <ErrorPage {...content} />;

  const practice = content.data.practices.find((p) => p.id === id);
  if (!practice) return <Redirect href="/services" />;

  const detail = DETAIL[practice.id as Exclude<Practice['id'], 'academy'>];
  return (
    <>
      <Stack.Screen options={{ title: practice.title }} />
      <Screen edges={[]}>
        <Image
          source={siteUrl(practice.image)}
          contentFit="cover"
          transition={200}
          style={styles.cover}
        />
        <Rise style={{ marginTop: Space.lg }}>
          <Txt variant="display">{content.data[detail.key].title}</Txt>
          <Txt tone="soft" style={{ marginTop: Space.md }}>
            {content.data[detail.key].lede}
          </Txt>
        </Rise>

        {detail.render(content.data)}

        <Card tint="brand" style={{ marginTop: Space.xxl, gap: Space.md }}>
          <Txt variant="title">Tell us what you need</Txt>
          <Txt tone="soft">You get a fixed figure in writing after one discovery call.</Txt>
          <Button
            label="Start a project"
            icon="arrow"
            onPress={() => router.navigate(contactHref(practice.id))}
          />
        </Card>
      </Screen>
    </>
  );
}

const DETAIL: Record<
  Exclude<Practice['id'], 'academy'>,
  { key: 'marketing' | 'software' | 'ai'; render: (data: Content) => React.ReactNode }
> = {
  marketing: {
    key: 'marketing',
    render: ({ marketing }) => (
      <Section title="Channels we run">
        {marketing.channels.map((ch, i) => (
          <Rise key={ch.title} index={i}>
            <IconCard icon={ch.icon} title={ch.title} body={ch.body}>
              <View style={styles.chips}>
                {ch.logos.map((logo) => (
                  <Chip key={logo} label={logo} />
                ))}
              </View>
            </IconCard>
          </Rise>
        ))}
      </Section>
    ),
  },
  software: {
    key: 'software',
    render: ({ software }) => (
      <>
        <Section title="What we build">
          {software.services.map((s, i) => (
            <Rise key={s.title} index={i}>
              <IconCard icon={s.icon} title={s.title} body={s.body}>
                <Domains domains={s.domains} />
              </IconCard>
            </Rise>
          ))}
        </Section>
        <Section title={software.app.title.join(' ')} lede={software.app.lede}>
          {software.app.ways.map((way) => (
            <Card key={way.name}>
              <Txt variant="heading">{way.name}</Txt>
              <Txt variant="label" tone="brand" style={{ marginTop: Space.xs }}>
                {way.tools}
              </Txt>
              <Txt variant="small" tone="soft" style={{ marginTop: Space.sm }}>
                {way.body}
              </Txt>
            </Card>
          ))}
          <View style={{ gap: Space.sm, marginTop: Space.sm }}>
            {software.app.included.map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </View>
        </Section>
      </>
    ),
  },
  ai: {
    key: 'ai',
    render: ({ ai }) => (
      <Section title="What our agents do">
        {ai.capabilities.map((cap, i) => (
          <Rise key={cap.title} index={i}>
            <IconCard icon={cap.icon} title={cap.title} body={cap.body} />
          </Rise>
        ))}
      </Section>
    ),
  },
};

/** The trades a build is made for: the first few, and the rest on a tap. */
function Domains({ domains }: { domains: string[] }) {
  const c = usePalette();
  const [all, setAll] = useState(false);
  const shown = all ? domains : domains.slice(0, 6);
  return (
    <View style={styles.chips}>
      {shown.map((d) => (
        <Chip key={d} label={d} />
      ))}
      {domains.length > 6 ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => setAll((v) => !v)}
          style={[styles.more, { borderColor: c.brandDeep }]}>
          <Txt variant="label" tone="brand">
            {all ? 'Show fewer' : `+${domains.length - 6} more`}
          </Txt>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cover: { width: '100%', aspectRatio: 16 / 9, borderRadius: Radius.card },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.xs + 2, marginTop: Space.md },
  more: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
});
