import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Chip, ErrorPage, LoadingPage, Rise, Screen, Txt, usePalette } from '@/components/ui';
import { Radius, Space } from '@/constants/theme';
import { postDate, siteUrl, useContent } from '@/lib/api';

export default function BlogScreen() {
  const content = useContent();
  const c = usePalette();
  const [service, setService] = useState<string | null>(null);

  if (content.status === 'loading') return <LoadingPage />;
  if (content.status === 'error') return <ErrorPage {...content} />;
  const { blog } = content.data;
  const posts = service ? blog.posts.filter((p) => p.service === service) : blog.posts;

  return (
    <Screen>
      <Txt variant="display">Blog</Txt>
      <Txt tone="soft" style={{ marginTop: Space.sm }}>
        What we have learned building software, agents and campaigns, and teaching it.
      </Txt>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.bleed}
        contentContainerStyle={styles.filters}>
        <Chip label="All" selected={service === null} onPress={() => setService(null)} />
        {Object.entries(blog.services).map(([id, label]) => (
          <Chip key={id} label={label} selected={service === id} onPress={() => setService(id)} />
        ))}
      </ScrollView>

      <View style={{ gap: Space.lg }}>
        {posts.map((post, i) => (
          <Rise key={post.slug} index={i}>
            <Pressable
              accessibilityRole="link"
              onPress={() =>
                router.push({ pathname: '/blog/[slug]', params: { slug: post.slug } })
              }
              style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.98 : 1 }] })}>
              <View style={[styles.cover, { backgroundColor: c.surface, borderColor: c.line }]}>
                <Image
                  source={siteUrl(post.cover)}
                  accessibilityLabel={post.coverAlt}
                  contentFit="cover"
                  transition={200}
                  style={StyleSheet.absoluteFill}
                />
              </View>
              <Txt variant="small" tone="faint" style={{ marginTop: Space.md }}>
                {blog.services[post.service]}, {postDate(post.date)}
              </Txt>
              <Txt variant="heading" style={{ marginTop: Space.xs }}>
                {post.title}
              </Txt>
              <Txt variant="small" tone="soft" numberOfLines={3} style={{ marginTop: Space.xs }}>
                {post.description}
              </Txt>
            </Pressable>
          </Rise>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bleed: { marginHorizontal: -(Space.md + 4), marginVertical: Space.lg, flexGrow: 0 },
  filters: { gap: Space.sm, paddingHorizontal: Space.md + 4 },
  cover: {
    width: '100%',
    aspectRatio: 1200 / 630,
    borderRadius: Radius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
