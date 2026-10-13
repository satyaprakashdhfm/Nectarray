import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';

/**
 * Light or dark, chosen with the sun and moon buttons and remembered. Until
 * one is pressed the app follows the phone. The choice is set app-wide with
 * Appearance, so every useColorScheme() in the app (and the palette made
 * from it) follows without being told.
 */
export type Scheme = 'light' | 'dark';

const KEY = 'na_theme';

/** Puts the saved choice back at launch; true once it has been read. */
export function useSavedScheme(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    SecureStore.getItemAsync(KEY)
      .catch(() => null)
      .then((saved) => {
        if (saved === 'light' || saved === 'dark') Appearance.setColorScheme(saved);
        setReady(true);
      });
  }, []);
  return ready;
}

/** Shows the app in this scheme from now on. */
export function setScheme(scheme: Scheme) {
  Appearance.setColorScheme(scheme);
  SecureStore.setItemAsync(KEY, scheme).catch(() => {});
}

/** The scheme on screen now, and the switch to the other one. */
export function useScheme(): { scheme: Scheme; toggle: () => void } {
  const scheme: Scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return { scheme, toggle: () => setScheme(scheme === 'dark' ? 'light' : 'dark') };
}
