import * as Application from 'expo-application';
import { useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';

/**
 * Where installers are published: GitHub releases tagged app-v<version>, each
 * carrying NectArray.apk. The workflow in .github/workflows/mobile-app.yml
 * makes them.
 */
const RELEASES = 'https://api.github.com/repos/satyaprakashdhfm/Nectarray/releases?per_page=30';
const TAG = /^app-v(\d+(?:\.\d+)*)$/;

type Release = {
  tag_name: string;
  draft: boolean;
  prerelease: boolean;
  html_url: string;
  assets: { name: string; browser_download_url: string }[];
};

/** 1 when a is newer than b, -1 when older, 0 when the same. */
export function compareVersions(a: string, b: string) {
  const x = a.split('.').map(Number);
  const y = b.split('.').map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] ?? 0) - (y[i] ?? 0);
    if (d !== 0) return d > 0 ? 1 : -1;
  }
  return 0;
}

/**
 * Every change ships as a new installer (its version in app.json went up).
 * Android installs it over this one, keeping sign-ins.
 */
async function newInstaller() {
  const current = Application.nativeApplicationVersion;
  if (Platform.OS !== 'android' || !current) return;
  const res = await fetch(RELEASES, { headers: { Accept: 'application/vnd.github+json' } });
  if (!res.ok) return;
  const releases = (await res.json()) as Release[];
  const latest = releases
    .filter((r) => !r.draft && !r.prerelease && TAG.test(r.tag_name))
    .map((r) => ({ release: r, version: TAG.exec(r.tag_name)![1] }))
    .sort((a, b) => compareVersions(b.version, a.version))[0];
  if (!latest || compareVersions(latest.version, current) <= 0) return;
  const apk = latest.release.assets.find((a) => a.name.endsWith('.apk'));
  const url = apk?.browser_download_url ?? latest.release.html_url;
  Alert.alert(
    `NectArray ${latest.version} is out`,
    `You have ${current}. Download the new installer and open it to update; your sign-in stays.`,
    [
      { text: 'Later', style: 'cancel' },
      { text: 'Download', onPress: () => void Linking.openURL(url) },
    ],
  );
}

/** Looks for a newer version once per launch, outside development. */
export function useUpdateCheck() {
  useEffect(() => {
    if (__DEV__) return;
    newInstaller().catch(() => {});
  }, []);
}
