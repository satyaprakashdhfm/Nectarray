import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { usePalette } from '@/components/ui';

/**
 * Five tabs, one per part of the website: the home page, the client
 * practices, the academy, the blog and the contact form. Services and Blog
 * each hold a stack, so a practice or an article opens over its list.
 */
export default function TabsLayout() {
  const c = usePalette();
  return (
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
  );
}
