import { Stack } from 'expo-router';

import { usePalette } from '@/components/ui';
import { Fonts } from '@/constants/theme';

/**
 * The stack inside a tab: its list has no bar (the page carries its own big
 * title), and what opens over it gets a plain bar with a back arrow.
 */
export function TabStack() {
  const c = usePalette();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: c.canvas },
        headerTintColor: c.ink,
        headerTitleStyle: { fontFamily: Fonts.semibold, color: c.ink },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: c.canvas },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
