import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { usePalette } from '@/components/ui';

/**
 * Where nectarray://auth lands.
 *
 * The sign-in itself reads that link from the browser tab (see lib/auth.tsx),
 * but the router sees it too and opens this route. There is nothing to show
 * here, so it steps straight back to the account screen it came from.
 */
export default function AuthReturn() {
  const c = usePalette();
  useEffect(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/account');
  }, []);
  return <View style={{ flex: 1, backgroundColor: c.canvas }} />;
}
