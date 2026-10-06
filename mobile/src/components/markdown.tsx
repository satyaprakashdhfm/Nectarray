import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { marked, type Token, type Tokens } from 'marked';
import { useMemo, useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Txt, usePalette } from '@/components/ui';
import { Fonts, Radius, Space } from '@/constants/theme';
import { SITE_URL, siteUrl } from '@/lib/api';

/**
 * An article's markdown as native views.
 *
 * The site renders the same files with remark; this walks marked's tokens
 * instead, which is all a phone needs: headings, paragraphs, lists, tables,
 * code, quotes and the article's own diagrams. Links to another article open
 * it in the app; everything else opens in the browser.
 */
export function Markdown({ source }: { source: string }) {
  const tokens = useMemo(() => marked.lexer(source), [source]);
  return <View style={{ gap: Space.md }}>{tokens.map((t, i) => <Block key={i} token={t} />)}</View>;
}

function openLink(href: string) {
  const blog = href.match(/^(?:https?:\/\/(?:www\.)?nectarray\.com)?\/blog\/([\w-]+)\/?$/);
  if (blog) {
    router.push({ pathname: '/blog/[slug]', params: { slug: blog[1] } });
    return;
  }
  void WebBrowser.openBrowserAsync(href.startsWith('/') ? `${SITE_URL}${href}` : href);
}

function Block({ token }: { token: Token }) {
  const c = usePalette();
  switch (token.type) {
    case 'heading': {
      const t = token as Tokens.Heading;
      return (
        <Txt variant={t.depth <= 2 ? 'title' : 'heading'} style={{ marginTop: Space.md }}>
          <Inline tokens={t.tokens} />
        </Txt>
      );
    }
    case 'paragraph': {
      const t = token as Tokens.Paragraph;
      const only = t.tokens.length === 1 ? t.tokens[0] : null;
      if (only?.type === 'image') {
        const img = only as Tokens.Image;
        return <Figure src={img.href} alt={img.text} caption={img.title ?? undefined} />;
      }
      return (
        <Txt tone="soft">
          <Inline tokens={t.tokens} />
        </Txt>
      );
    }
    case 'list': {
      const t = token as Tokens.List;
      return (
        <View style={{ gap: Space.sm }}>
          {t.items.map((item, i) => (
            <View key={i} style={styles.listItem}>
              <Txt tone="faint" style={styles.marker}>
                {t.ordered ? `${Number(t.start || 1) + i}.` : '•'}
              </Txt>
              <View style={{ flex: 1, gap: Space.xs }}>
                {item.tokens.map((child, j) =>
                  child.type === 'text' ? (
                    <Txt key={j} tone="soft">
                      <Inline tokens={(child as Tokens.Text).tokens ?? [child]} />
                    </Txt>
                  ) : (
                    <Block key={j} token={child} />
                  ),
                )}
              </View>
            </View>
          ))}
        </View>
      );
    }
    case 'code': {
      const t = token as Tokens.Code;
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.code, { backgroundColor: c.mist, borderColor: c.line }]}>
          <Text style={[styles.codeText, { color: c.ink }]}>{t.text}</Text>
        </ScrollView>
      );
    }
    case 'blockquote': {
      const t = token as Tokens.Blockquote;
      return (
        <View style={[styles.quote, { borderColor: c.brand }]}>
          {t.tokens.map((child, i) => (
            <Block key={i} token={child} />
          ))}
        </View>
      );
    }
    case 'table': {
      const t = token as Tokens.Table;
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[styles.table, { borderColor: c.line }]}>
            <View style={[styles.row, { backgroundColor: c.mist }]}>
              {t.header.map((cell, i) => (
                <View key={i} style={styles.cell}>
                  <Txt variant="label">
                    <Inline tokens={cell.tokens} />
                  </Txt>
                </View>
              ))}
            </View>
            {t.rows.map((row, r) => (
              <View key={r} style={[styles.row, { borderTopWidth: 1, borderColor: c.line }]}>
                {row.map((cell, i) => (
                  <View key={i} style={styles.cell}>
                    <Txt variant="small" tone="soft">
                      <Inline tokens={cell.tokens} />
                    </Txt>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      );
    }
    case 'hr':
      return <View style={{ height: 1, backgroundColor: c.line, marginVertical: Space.sm }} />;
    case 'text': {
      const t = token as Tokens.Text;
      return (
        <Txt tone="soft">
          <Inline tokens={t.tokens ?? [t]} />
        </Txt>
      );
    }
    default:
      // space, html comments and anything the articles do not use.
      return null;
  }
}

function Inline({ tokens }: { tokens: Token[] | undefined }): ReactNode {
  const c = usePalette();
  if (!tokens) return null;
  return tokens.map((token, i) => {
    switch (token.type) {
      case 'strong':
        return (
          <Text key={i} style={{ fontFamily: Fonts.semibold, color: c.ink }}>
            <Inline tokens={(token as Tokens.Strong).tokens} />
          </Text>
        );
      case 'em':
        return (
          <Text key={i} style={{ fontStyle: 'italic' }}>
            <Inline tokens={(token as Tokens.Em).tokens} />
          </Text>
        );
      case 'codespan':
        return (
          <Text key={i} style={[styles.codespan, { backgroundColor: c.mist, color: c.ink }]}>
            {decode((token as Tokens.Codespan).text)}
          </Text>
        );
      case 'link': {
        const t = token as Tokens.Link;
        return (
          <Text
            key={i}
            accessibilityRole="link"
            onPress={() => openLink(t.href)}
            style={{ color: c.brandDeep, textDecorationLine: 'underline' }}>
            <Inline tokens={t.tokens} />
          </Text>
        );
      }
      case 'br':
        return '\n';
      case 'del':
        return (
          <Text key={i} style={{ textDecorationLine: 'line-through' }}>
            <Inline tokens={(token as Tokens.Del).tokens} />
          </Text>
        );
      case 'image':
        return null;
      case 'text': {
        const t = token as Tokens.Text;
        return t.tokens ? <Inline key={i} tokens={t.tokens} /> : decode(t.text);
      }
      case 'escape':
        return (token as Tokens.Escape).text;
      default:
        return 'raw' in token ? decode(String(token.raw)) : null;
    }
  });
}

/** marked escapes quotes and ampersands for HTML; a Text view wants them plain. */
function decode(text: string) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/** An article picture at its own proportions, with the caption under it. */
function Figure({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  const c = usePalette();
  const [ratio, setRatio] = useState(16 / 9);
  return (
    <View style={{ gap: Space.sm, marginVertical: Space.sm }}>
      <View style={[styles.figure, { backgroundColor: c.surface, borderColor: c.line }]}>
        <Image
          source={siteUrl(src)}
          accessibilityLabel={alt}
          contentFit="contain"
          onLoad={(e) => e.source.width && setRatio(e.source.width / e.source.height)}
          style={{ width: '100%', aspectRatio: ratio }}
        />
      </View>
      {caption ? (
        <Txt variant="small" tone="faint">
          {caption}
        </Txt>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: { flexDirection: 'row', gap: Space.sm },
  marker: { minWidth: 18 },
  code: { borderRadius: Radius.card, borderWidth: 1, padding: Space.md },
  codeText: { fontFamily: 'monospace', fontSize: 13, lineHeight: 19 },
  codespan: { fontFamily: 'monospace', fontSize: 14 },
  quote: { borderLeftWidth: 3, paddingLeft: Space.md, gap: Space.sm },
  table: { borderWidth: 1, borderRadius: Radius.card, overflow: 'hidden' },
  row: { flexDirection: 'row' },
  cell: { width: 170, padding: Space.sm + 2 },
  figure: { borderRadius: Radius.card, borderWidth: 1, overflow: 'hidden', padding: Space.sm },
});
