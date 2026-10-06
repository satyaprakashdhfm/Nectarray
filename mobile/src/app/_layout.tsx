import { SchibstedGrotesk_400Regular } from '@expo-google-fonts/schibsted-grotesk/400Regular';
import { SchibstedGrotesk_500Medium } from '@expo-google-fonts/schibsted-grotesk/500Medium';
import { SchibstedGrotesk_600SemiBold } from '@expo-google-fonts/schibsted-grotesk/600SemiBold';
import { SchibstedGrotesk_700Bold } from '@expo-google-fonts/schibsted-grotesk/700Bold';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

/**
 * Five tabs, one per part of the website: the home page, the three client
 * practices, the academy, the blog and the contact form. Services and Blog
 * each hold a stack, so a practice or an article opens over its list.
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
      <StatusBar style={dark ? 'light' : 'dark'} />
      <NativeTabs
        backgroundColor={c.surface}
        indicatorColor={c.brandWash}
        iconColor={{ default: c.inkFaint, selected: c.brandDeep }}
        labelStyle={{ default: { color: c.inkFaint }, selected: { color: c.ink } }}>
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="house" md="home" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="services">
          <NativeTabs.Trigger.Label>Services</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="square.grid.2x2" md="grid_view" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="academy">
          <NativeTabs.Trigger.Label>Academy</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="graduationcap" md="school" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="blog">
          <NativeTabs.Trigger.Label>Blog</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="doc.text" md="article" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="contact">
          <NativeTabs.Trigger.Label>Contact</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="envelope" md="mail" />
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
}
