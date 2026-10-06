import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, View } from 'react-native';

import { Markdown } from '@/components/markdown';
import { Button, ErrorPage, LoadingPage, Screen, Skeleton, Txt, usePalette } from '@/components/ui';
import { Radius, Space } from '@/constants/theme';
import { SITE_URL, postDate, siteUrl, useArticle, useContent } from '@/lib/api';

/** One article: the cover, the byline, and the body the site renders. */
export default function ArticleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const content = useContent();
  const article = useArticle(slug);
  const c = usePalette();

  if (content.status === 'loading') return <LoadingPage />;
  if (content.status === 'error') return <ErrorPage {...content} />;
  const post = content.data.blog.posts.find((p) => p.slug === slug);
  if (!post) return <ErrorPage message="That article is not on the blog any more." retry={() => {}} />;

  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <Screen edges={[]}>
        <View style={[styles.cover, { backgroundColor: c.surface, borderColor: c.line }]}>
          <Image
            source={siteUrl(post.cover)}
            accessibilityLabel={post.coverAlt}
            contentFit="cover"
            style={StyleSheet.absoluteFill}
          />
        </View>
        <Txt variant="small" tone="faint" style={{ marginTop: Space.lg }}>
          {content.data.blog.services[post.service]}, {postDate(post.date)}
          {article.status === 'ready' ? `, ${article.data.minutes} min read` : ''}
        </Txt>
        <Txt variant="display" style={{ marginTop: Space.sm, fontSize: 28, lineHeight: 34 }}>
          {post.title}
        </Txt>
        <Txt tone="soft" style={{ marginTop: Space.md }}>
          {post.description}
        </Txt>

        <View style={{ marginTop: Space.xl }}>
          {article.status === 'ready' ? (
            <Markdown source={article.data.markdown} />
          ) : article.status === 'error' ? (
            <View style={{ gap: Space.md }}>
              <Txt tone="danger">The article did not load. Check your connection.</Txt>
              <Button label="Try again" onPress={article.retry} />
            </View>
          ) : (
            <View style={{ gap: Space.md }}>
              <Skeleton height={18} />
              <Skeleton height={18} width="92%" />
              <Skeleton height={18} width="80%" />
              <Skeleton height={160} />
            </View>
          )}
        </View>

        <View style={{ marginTop: Space.xxl }}>
          <Button
            label="Open on the website"
            kind="secondary"
            icon="external"
            onPress={() => WebBrowser.openBrowserAsync(`${SITE_URL}/blog/${post.slug}`)}
          />
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  cover: {
    width: '100%',
    aspectRatio: 1200 / 630,
    borderRadius: Radius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
