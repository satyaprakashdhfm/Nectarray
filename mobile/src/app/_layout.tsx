import { SchibstedGrotesk_400Regular } from '@expo-google-fonts/schibsted-grotesk/400Regular';
import { SchibstedGrotesk_500Medium } from '@expo-google-fonts/schibsted-grotesk/500Medium';
import { SchibstedGrotesk_600SemiBold } from '@expo-google-fonts/schibsted-grotesk/600SemiBold';
import { SchibstedGrotesk_700Bold } from '@expo-google-fonts/schibsted-grotesk/700Bold';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';
import { AuthProvider } from '@/lib/auth';

SplashScreen.preventAutoHideAsync();

/**
 * The tabs, with the account screen able to open over any of them, and the
 * signed-in state shared by both.
 */
export default function RootLayout() {
  const dark = useColorScheme() === 'dark';
  const c = dark ? Colors.dark : Colors.light;
  const [fontsLoaded, fontError] = useFonts({
    SchibstedGrotesk_400Regular,
    SchibstedGrotesk_500Medium,
    SchibstedGrotesk_600SemiBold,
    SchibstedGrotesk_700Bold,
  });
  const ready = fontsLoaded || fontError != null;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  const base = dark ? DarkTheme : DefaultTheme;
  return (
    <ThemeProvider
      value={{
        ...base,
        colors: {
          ...base.colors,
          primary: c.brandDeep,
          background: c.canvas,
          card: c.surface,
          text: c.ink,
          border: c.line,
        },
      }}>
      <AuthProvider>
        <StatusBar style={dark ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: c.canvas },
            headerTintColor: c.ink,
            headerTitleStyle: { fontFamily: Fonts.semibold, color: c.ink },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: c.canvas },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="account" options={{ title: 'Account', presentation: 'modal' }} />
          <Stack.Screen name="auth" options={{ headerShown: false, animation: 'none' }} />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
