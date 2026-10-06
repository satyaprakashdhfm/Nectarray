import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Crypto from 'expo-crypto';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { SITE_URL } from '@/lib/api';

/**
 * Signing in, for students and for the studio, the same two ways the website
 * has: two separate sign-ins that can both be live at once.
 *
 * Google opens in a Chrome custom tab on the website's own sign-in route.
 * The website checks everything it checks for a browser, and for an admin
 * sign-in it also checks the address against the admin list. It then sends
 * the tab back to nectarray://auth with a one-time code, which this file
 * trades for a session token together with the PKCE verifier it made before
 * the tab opened (see src/lib/auth/app-codes.ts on the website).
 *
 * Tokens are kept in the phone's encrypted store, never in plain storage.
 */

export type Realm = 'student' | 'admin';

export type Profile = {
  realm: Realm;
  email: string;
  firstName: string | null;
  lastName: string | null;
  admin: boolean;
  enrolment: { status: string; cohort: string | null } | null;
};

/** `profile` is null when the token is kept but the server could not be asked. */
export type Account = { token: string; profile: Profile | null };

export type SignInResult = { ok: true } | { ok: false; message: string | null };

type Auth = {
  ready: boolean;
  student: Account | null;
  admin: Account | null;
  signIn: (realm: Realm) => Promise<SignInResult>;
  signOut: (realm: Realm) => Promise<void>;
};

const AuthContext = createContext<Auth | null>(null);

const storeKey = (realm: Realm) => `na_${realm}_token`;

/** Expo Go cannot receive nectarray:// links, and the live site will not send exp:// ones. */
const inExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

const base64url = (base64: string) =>
  base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function pkcePair() {
  const bytes = Crypto.getRandomBytes(32);
  const verifier = base64url(btoa(String.fromCharCode(...bytes)));
  const challenge = base64url(
    await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, verifier, {
      encoding: Crypto.CryptoEncoding.BASE64,
    }),
  );
  return { verifier, challenge };
}

/** The account a stored token belongs to: null if it is dead, kept if offline. */
async function check(realm: Realm, token: string): Promise<Account | null> {
  try {
    const response = await fetch(`${SITE_URL}/api/app/me?realm=${realm}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 401 || response.status === 403) return null;
    if (!response.ok) return { token, profile: null };
    const { profile } = (await response.json()) as { profile: Profile };
    return { token, profile };
  } catch {
    return { token, profile: null };
  }
}

const REASONS: Record<string, string> = {
  denied: 'Sign-in was cancelled on the Google screen.',
  unverified: 'Google has not verified that email address.',
  state: 'That sign-in took too long or was opened twice. Please try again.',
  exchange: 'Google did not finish the sign-in. Please try again.',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [student, setStudent] = useState<Account | null>(null);
  const [admin, setAdmin] = useState<Account | null>(null);
  const set = useCallback(
    (realm: Realm, account: Account | null) => (realm === 'admin' ? setAdmin : setStudent)(account),
    [],
  );

  // Who was signed in last time, checked with the server once at launch.
  useEffect(() => {
    let live = true;
    (async () => {
      for (const realm of ['student', 'admin'] as const) {
        const token = await SecureStore.getItemAsync(storeKey(realm)).catch(() => null);
        if (!token) continue;
        const account = await check(realm, token);
        if (!account) await SecureStore.deleteItemAsync(storeKey(realm)).catch(() => {});
        if (live) set(realm, account);
      }
      if (live) setReady(true);
    })();
    return () => {
      live = false;
    };
  }, [set]);

  const signIn = useCallback(
    async (realm: Realm): Promise<SignInResult> => {
      if (inExpoGo && SITE_URL.startsWith('https://')) {
        return {
          ok: false,
          message:
            'Sign-in works in the installed NectArray app, not inside Expo Go. Install the test APK to try it.',
        };
      }

      const { verifier, challenge } = await pkcePair();
      const returnTo = Linking.createURL('auth');
      const start = new URL(`${SITE_URL}/api/auth/google/start`);
      start.searchParams.set('realm', realm);
      start.searchParams.set('app_return', returnTo);
      start.searchParams.set('app_challenge', challenge);

      const result = await WebBrowser.openAuthSessionAsync(start.toString(), returnTo);
      if (result.type !== 'success') return { ok: false, message: null };

      const params = Linking.parse(result.url).queryParams ?? {};
      const read = (name: string) => (typeof params[name] === 'string' ? params[name] : '');
      const error = read('error');
      if (error === 'not_admin') {
        return {
          ok: false,
          message: `${read('email') || 'That Google account'} is not on the admin list. Sign in with an admin account.`,
        };
      }
      if (error || !read('code')) {
        return { ok: false, message: REASONS[error] ?? 'Sign-in did not complete. Please try again.' };
      }

      try {
        const response = await fetch(`${SITE_URL}/api/app/auth/exchange`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: read('code'), verifier }),
        });
        const body = (await response.json()) as { token?: string; profile?: Profile; error?: string };
        if (!response.ok || !body.token || !body.profile) {
          return { ok: false, message: body.error ?? 'Sign-in did not complete. Please try again.' };
        }
        await SecureStore.setItemAsync(storeKey(realm), body.token);
        set(realm, { token: body.token, profile: body.profile });
        return { ok: true };
      } catch {
        return { ok: false, message: 'Could not reach the server. Check your connection.' };
      }
    },
    [set],
  );

  const signOut = useCallback(
    async (realm: Realm) => {
      const token = await SecureStore.getItemAsync(storeKey(realm)).catch(() => null);
      await SecureStore.deleteItemAsync(storeKey(realm)).catch(() => {});
      set(realm, null);
      if (token) {
        // Ends the session on the server too, so the token is dead everywhere.
        fetch(`${SITE_URL}/api/app/auth/signout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }
    },
    [set],
  );

  return (
    <AuthContext.Provider value={{ ready, student, admin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): Auth {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('useAuth needs <AuthProvider> above it.');
  return auth;
}
