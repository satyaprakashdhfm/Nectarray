import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Keyboard, Linking, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView, type WebViewNavigation } from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';
import Constants from 'expo-constants';

import { Button, Txt, usePalette } from '@/components/ui';
import { Space } from '@/constants/theme';
import { SITE_URL } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { setScheme, useScheme, type Scheme } from '@/lib/theme';

/**
 * The website's admin panel, inside the app.
 *
 * Google will not sign in inside a web view, so the panel is opened through
 * the website's /api/app/panel: the app's admin token buys a one-minute link
 * that gives this web view its own panel session (see that route). The panel
 * then asks for the emailed code, as it does on the website, once every five
 * hours. When that session runs out the panel's sign-in page is caught here
 * and a fresh link is fetched, back to the same page.
 *
 * The web view names itself NectArrayApp/<version>, which makes the panel
 * show a Close button where Sign out is. Light and dark are shared both ways:
 * the app's choice is put into the panel, and the panel's sun and moon set
 * the app's.
 */

/** The panel header's colour, and its page colour, per theme (globals.css). */
const NIGHT: Record<Scheme, string> = { light: '#0b1720', dark: '#0a0b0d' };
const MIST: Record<Scheme, string> = { light: '#f2f6f8', dark: '#101216' };

const THEME_KEY = 'nectarray-ui-theme';
const SITE_HOST = new URL(SITE_URL).host;

/** Puts the app's theme into the panel: stored, applied, and announced. */
const themeScript = (scheme: Scheme) =>
  `(function(){try{localStorage.setItem(${JSON.stringify(THEME_KEY)},${JSON.stringify(scheme)})}catch(e){}` +
  `var r=document.documentElement;if(r&&r.dataset.uiTheme){r.dataset.uiTheme=${JSON.stringify(scheme)};` +
  `window.dispatchEvent(new Event('nectarray-ui-theme'))}})();true;`;

type Link = { url: string } | { problem: string };

/** A one-minute link that opens the panel signed in (website: api/app/panel). */
async function panelLink(token: string, next?: string): Promise<Link> {
  try {
    const response = await fetch(`${SITE_URL}/api/app/panel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ next }),
    });
    const body = (await response.json().catch(() => ({}))) as { url?: string; error?: string };
    if (response.ok && body.url) return { url: body.url };
    return {
      problem:
        response.status === 401
          ? 'Your admin sign-in has ended. Sign in again on the Account screen.'
          : (body.error ?? 'The panel could not be opened. Please try again.'),
    };
  } catch {
    return { problem: 'Could not reach the website. Check your connection and try again.' };
  }
}

export default function PanelScreen() {
  const c = usePalette();
  const insets = useSafeAreaInsets();
  const { ready, admin } = useAuth();
  const { scheme } = useScheme();
  const web = useRef<WebView>(null);

  const [source, setSource] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [keyboard, setKeyboard] = useState(0);
  const [mount, setMount] = useState(0);

  const canGoBack = useRef(false);
  const fetching = useRef(false);
  // The page to come back to when the session has to be renewed.
  const lastPage = useRef<string | undefined>(undefined);
  const renewals = useRef<number[]>([]);

  const token = admin?.token;
  const panel = admin?.profile?.panel ?? null;

  /** Shows a fresh link to the panel, or why there is none. */
  const show = useCallback((link: Link) => {
    if ('url' in link) {
      setProblem(null);
      setLoading(true);
      setSource(link.url);
    } else setProblem(link.problem);
  }, []);

  const open = useCallback(
    (next?: string) => {
      if (!token || fetching.current) return;
      fetching.current = true;
      panelLink(token, next)
        .then(show)
        .finally(() => {
          fetching.current = false;
        });
    },
    [token, show],
  );

  useEffect(() => {
    if (!token) return;
    let live = true;
    panelLink(token).then((link) => live && show(link));
    return () => {
      live = false;
    };
  }, [token, show]);

  // The app's light or dark, into the open panel.
  useEffect(() => {
    web.current?.injectJavaScript(themeScript(scheme));
  }, [scheme]);

  // The keyboard covers the page: the web view shrinks above it instead.
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => setKeyboard(e.endCoordinates.height));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboard(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // Android's back button goes back in the panel first, then out of it.
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (!canGoBack.current) return false;
        web.current?.goBack();
        return true;
      });
      return () => sub.remove();
    }, []),
  );

  const isSignIn = (path: string) => (panel ? path === `${panel}/login` : /\/login\/?$/.test(path));
  const inPanel = (path: string) =>
    path.startsWith('/api/') || (panel ? path === panel || path.startsWith(`${panel}/`) : true);

  /** Panel pages stay here; anything else opens in the phone's browser or app. */
  function allow(request: ShouldStartLoadRequest): boolean {
    let url: URL;
    try {
      url = new URL(request.url);
    } catch {
      return true;
    }
    if (url.protocol === 'about:' || url.protocol === 'blob:' || url.protocol === 'data:') return true;
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      Linking.openURL(request.url).catch(() => {});
      return false;
    }
    if (url.host !== SITE_HOST) {
      if (request.isTopFrame === false) return true;
      Linking.openURL(request.url).catch(() => {});
      return false;
    }
    if (isSignIn(url.pathname)) {
      // The panel session ran out: a fresh one, back where we were. Sent
      // here again at once means the web view is not keeping its cookie.
      const now = Date.now();
      renewals.current = [...renewals.current.filter((t) => now - t < 30_000), now];
      if (renewals.current.length > 2)
        setProblem('The panel could not keep you signed in. Close it and open it again.');
      else open(lastPage.current);
      return false;
    }
    if (!inPanel(url.pathname)) {
      Linking.openURL(request.url).catch(() => {});
      return false;
    }
    return true;
  }

  function changed(nav: WebViewNavigation) {
    canGoBack.current = nav.canGoBack;
    try {
      const path = new URL(nav.url).pathname;
      if (panel && (path === panel || path.startsWith(`${panel}/`)) && !isSignIn(path))
        lastPage.current = path;
    } catch {
      // Not a web address; nothing to remember.
    }
  }

  function message(data: string) {
    let note: { type?: string; theme?: string };
    try {
      note = JSON.parse(data);
    } catch {
      return;
    }
    if (note.type === 'close') {
      if (router.canGoBack()) router.back();
      else router.replace('/');
    }
    if (note.type === 'theme' && (note.theme === 'light' || note.theme === 'dark')) setScheme(note.theme);
  }

  if (ready && !admin) {
    return (
      <Notice
        text="Sign in as admin on the Account screen to open the panel here."
        action={{ label: 'Go to Account', onPress: () => router.replace('/account') }}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: MIST[scheme] }}>
      <StatusBar style="light" />
      <View style={{ height: insets.top, backgroundColor: NIGHT[scheme] }} />
      {problem ? (
        <Notice
          text={problem}
          action={{
            label: 'Try again',
            onPress: () => {
              setProblem(null);
              open(lastPage.current);
            },
          }}
          inset={false}
        />
      ) : source ? (
        <WebView
          key={mount}
          ref={web}
          source={{ uri: source }}
          style={{ flex: 1, backgroundColor: MIST[scheme] }}
          applicationNameForUserAgent={`NectArrayApp/${Constants.expoConfig?.version ?? '1'}`}
          injectedJavaScriptBeforeContentLoaded={themeScript(scheme)}
          onShouldStartLoadWithRequest={allow}
          onNavigationStateChange={changed}
          onOpenWindow={(e) => {
            // A link meant for a new tab: a panel page opens here, the rest outside.
            const url = e.nativeEvent.targetUrl;
            if (allow({ url, isTopFrame: true } as ShouldStartLoadRequest))
              web.current?.injectJavaScript(`window.location.href=${JSON.stringify(url)};true;`);
          }}
          onMessage={(e) => message(e.nativeEvent.data)}
          onLoadEnd={() => setLoading(false)}
          onError={() => setProblem('The panel did not load. Check your connection and try again.')}
          onHttpError={(e) => {
            // A link reopened after its minute was up: fetch a fresh one.
            if (e.nativeEvent.statusCode === 401 && e.nativeEvent.url.includes('/api/app/panel'))
              open(lastPage.current);
          }}
          onRenderProcessGone={() => setMount((n) => n + 1)}
          onContentProcessDidTerminate={() => setMount((n) => n + 1)}
          setSupportMultipleWindows
          javaScriptCanOpenWindowsAutomatically={false}
          allowsBackForwardNavigationGestures
          domStorageEnabled
          sharedCookiesEnabled
          pullToRefreshEnabled={false}
          overScrollMode="never"
          textZoom={100}
        />
      ) : null}
      {loading && !problem ? (
        <View style={[StyleSheet.absoluteFill, styles.center, { top: insets.top, backgroundColor: MIST[scheme] }]}>
          <ActivityIndicator color={c.brandDeep} size="large" />
          <Txt variant="small" tone="soft" style={{ marginTop: Space.md }}>
            Opening the admin panel
          </Txt>
        </View>
      ) : null}
      <View style={{ height: keyboard || insets.bottom, backgroundColor: MIST[scheme] }} />
    </View>
  );
}

function Notice({
  text,
  action,
  inset = true,
}: {
  text: string;
  action: { label: string; onPress: () => void };
  inset?: boolean;
}) {
  const c = usePalette();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.center,
        { flex: 1, backgroundColor: c.canvas, padding: Space.lg, paddingTop: inset ? insets.top : 0 },
      ]}>
      <Txt tone="soft" style={{ textAlign: 'center', marginBottom: Space.lg }}>
        {text}
      </Txt>
      <Button label={action.label} onPress={action.onPress} />
      <View style={{ height: Space.md }} />
      <Button label="Close" kind="secondary" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});
