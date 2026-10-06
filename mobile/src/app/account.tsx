import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Icon } from '@/components/icon';
import { Button, Card, Chip, Screen, Skeleton, Txt, usePalette } from '@/components/ui';
import { Radius, Space } from '@/constants/theme';
import { SITE_URL } from '@/lib/api';
import { useAuth, type Account, type Realm } from '@/lib/auth';

const ENROLMENT: Record<string, string> = {
  enrolled: 'Enrolled',
  completed: 'Completed',
  applied: 'Application received',
  accepted: 'Accepted, starting soon',
  withdrawn: 'Withdrawn',
};

/**
 * Both sign-ins on one screen: a student's and the studio's. They are
 * separate, exactly as on the website, so one phone can hold both.
 */
export default function AccountScreen() {
  const auth = useAuth();

  return (
    <Screen edges={[]}>
      <Txt tone="soft">
        Sign in with Google. Students see their programme; the admin side only lets in addresses on
        the studio&apos;s admin list.
      </Txt>
      {auth.ready ? (
        <View style={{ gap: Space.lg, marginTop: Space.xl }}>
          <RealmCard
            realm="student"
            title="Student"
            account={auth.student}
            open={{ label: 'Open my dashboard', path: '/dashboard' }}
          />
          <RealmCard
            realm="admin"
            title="Admin"
            account={auth.admin}
            open={{ label: 'Open the admin panel', path: '/admin' }}
          />
        </View>
      ) : (
        <View style={{ gap: Space.lg, marginTop: Space.xl }}>
          <Skeleton height={170} />
          <Skeleton height={170} />
        </View>
      )}
    </Screen>
  );
}

function RealmCard({
  realm,
  title,
  account,
  open,
}: {
  realm: Realm;
  title: string;
  account: Account | null;
  open: { label: string; path: string };
}) {
  const c = usePalette();
  const { signIn, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function start() {
    setMessage(null);
    setBusy(true);
    const result = await signIn(realm);
    setBusy(false);
    if (!result.ok) setMessage(result.message);
  }

  const profile = account?.profile;
  const name = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(' ') || profile.email
    : null;

  return (
    <Card tint={account ? 'brand' : undefined} style={{ gap: Space.md }}>
      <View style={styles.head}>
        <View style={[styles.badge, { backgroundColor: account ? c.surface : c.brandWash }]}>
          <Icon name={realm === 'admin' ? 'shield' : 'graduation'} color={c.brandDeep} size={22} />
        </View>
        <Txt variant="title" style={{ flex: 1 }}>
          {title}
        </Txt>
        {account ? <Chip label="Signed in" selected /> : null}
      </View>

      {account ? (
        <Animated.View entering={FadeIn.duration(200)} style={{ gap: Space.md }}>
          {profile ? (
            <View>
              <Txt variant="heading">{name}</Txt>
              <Txt variant="small" tone="soft">
                {profile.email}
              </Txt>
              {realm === 'student' ? (
                <Txt variant="small" tone="faint" style={{ marginTop: Space.sm }}>
                  {profile.enrolment
                    ? `${ENROLMENT[profile.enrolment.status] ?? profile.enrolment.status}${
                        profile.enrolment.cohort ? `, ${profile.enrolment.cohort}` : ''
                      }`
                    : 'Not enrolled in a programme yet.'}
                </Txt>
              ) : null}
            </View>
          ) : (
            <Txt variant="small" tone="soft">
              Signed in. Your details will show once the phone is back online.
            </Txt>
          )}
          <Button
            label={open.label}
            icon="external"
            onPress={() => WebBrowser.openBrowserAsync(`${SITE_URL}${open.path}`)}
          />
          <Button label="Sign out" kind="secondary" onPress={() => signOut(realm)} />
        </Animated.View>
      ) : (
        <>
          <Txt variant="small" tone="soft">
            {realm === 'admin'
              ? 'For the studio team. Only Google accounts on the admin list can sign in here.'
              : 'For academy students. Sign in with the Google account you enrolled with.'}
          </Txt>
          {message ? (
            <View style={[styles.message, { borderColor: c.danger }]}>
              <Icon name="error" color={c.danger} size={18} />
              <Txt variant="small" tone="danger" style={{ flex: 1 }}>
                {message}
              </Txt>
            </View>
          ) : null}
          <Button
            label={`Sign in as ${title.toLowerCase()}`}
            icon="person"
            busy={busy}
            onPress={start}
          />
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  badge: {
    width: 44,
    height: 44,
    borderRadius: Radius.card - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    flexDirection: 'row',
    gap: Space.sm,
    borderWidth: 1,
    borderRadius: Radius.card - 4,
    padding: Space.sm + 2,
    alignItems: 'flex-start',
  },
});
