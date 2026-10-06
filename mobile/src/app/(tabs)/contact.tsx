import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Icon } from '@/components/icon';
import {
  Button,
  Card,
  Chip,
  ErrorPage,
  LoadingPage,
  Screen,
  Txt,
  usePalette,
} from '@/components/ui';
import { Fonts, Radius, Space } from '@/constants/theme';
import { sendEnquiry, useContent } from '@/lib/api';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * The website's enquiry form, posting to the same /api/contact, so an
 * enquiry from the app lands in the same inbox with the same subject line.
 */
export default function ContactScreen() {
  const content = useContent();
  const c = usePalette();
  const params = useLocalSearchParams<{ interest?: string }>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [interest, setInterest] = useState<string | null>(params.interest ?? null);
  // Arriving again from "Enrol now" or a practice picks the matching interest.
  const [arrivedWith, setArrivedWith] = useState(params.interest);
  if (params.interest !== arrivedWith) {
    setArrivedWith(params.interest);
    if (params.interest) setInterest(params.interest);
  }
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [failure, setFailure] = useState('');

  if (content.status === 'loading') return <LoadingPage />;
  if (content.status === 'error') return <ErrorPage {...content} />;
  const { contact, company: studio } = content.data;
  const chosen = interest ?? contact.interests[0];

  async function submit() {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Tell us your name.';
    if (!EMAIL.test(email.trim())) next.email = 'That email address does not look right.';
    if (!message.trim()) next.message = 'A line or two about what you need.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setState('sending');
    try {
      await sendEnquiry({
        name: name.trim(),
        email: email.trim(),
        company: company.trim(),
        interest: chosen,
        message: message.trim(),
      });
      setState('sent');
    } catch (error) {
      setFailure(error instanceof Error ? error.message : 'We could not send that just now.');
      setState('failed');
    }
  }

  return (
    <Screen>
      <Txt variant="display">{contact.title}</Txt>
      <Txt tone="soft" style={{ marginTop: Space.sm }}>
        {contact.lede}
      </Txt>

      {state === 'sent' ? (
        <Animated.View entering={FadeInDown.springify().damping(18)}>
          <Card tint="leaf" style={{ marginTop: Space.xl, gap: Space.sm }}>
            <Icon name="check" color={c.leafDeep} size={32} />
            <Txt variant="title">Thanks, {name.trim().split(' ')[0]}.</Txt>
            <Txt tone="soft">
              Your note is with us. You will hear back at {email.trim()} within one business day.
            </Txt>
            <View style={{ marginTop: Space.sm }}>
              <Button
                label="Send another"
                kind="secondary"
                onPress={() => {
                  setMessage('');
                  setState('idle');
                }}
              />
            </View>
          </Card>
        </Animated.View>
      ) : (
        <View style={{ marginTop: Space.xl, gap: Space.lg }}>
          <Field
            label="Name"
            value={name}
            onChangeText={setName}
            error={errors.name}
            autoComplete="name"
            textContentType="name"
          />
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            autoComplete="email"
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
          />
          <Field
            label="Company (optional)"
            value={company}
            onChangeText={setCompany}
            autoComplete="organization"
          />

          <View style={{ gap: Space.sm }}>
            <Txt variant="label">Interested in</Txt>
            <View style={styles.chips}>
              {contact.interests.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  selected={chosen === option}
                  onPress={() => setInterest(option)}
                />
              ))}
            </View>
          </View>

          <Field
            label="What are you building?"
            value={message}
            onChangeText={setMessage}
            error={errors.message}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            style={{ minHeight: 132 }}
          />

          {state === 'failed' ? <Txt tone="danger">{failure} Please try again.</Txt> : null}

          <Button
            label="Send enquiry"
            icon="send"
            busy={state === 'sending'}
            onPress={submit}
          />
        </View>
      )}

      <View style={{ marginTop: Space.xxl, gap: Space.sm }}>
        <Txt variant="heading">Or reach us directly</Txt>
        <Direct icon="mail" label={studio.email} onPress={() => Linking.openURL(`mailto:${studio.email}`)} />
        <Direct
          icon="phone"
          label={studio.phone}
          onPress={() => Linking.openURL(`tel:${studio.phone.replace(/\s/g, '')}`)}
        />
        {studio.socials.map((s) => (
          <Direct key={s.label} icon="external" label={s.label} onPress={() => Linking.openURL(s.href)} />
        ))}
        <Txt variant="small" tone="faint" style={{ marginTop: Space.sm }}>
          {studio.location}
        </Txt>
      </View>
    </Screen>
  );
}

/** A labelled input: label above, error below, never a placeholder for a label. */
function Field({
  label,
  error,
  style,
  ...input
}: TextInputProps & { label: string; error?: string }) {
  const c = usePalette();
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: Space.sm }}>
      <Txt variant="label">{label}</Txt>
      <TextInput
        {...input}
        accessibilityLabel={label}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={c.inkFaint}
        style={[
          styles.input,
          {
            color: c.ink,
            backgroundColor: c.surface,
            borderColor: error ? c.danger : focused ? c.brandDeep : c.line,
          },
          style,
        ]}
      />
      {error ? (
        <Txt variant="small" tone="danger">
          {error}
        </Txt>
      ) : null}
    </View>
  );
}

function Direct({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  const c = usePalette();
  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      style={({ pressed }) => [
        styles.direct,
        { backgroundColor: c.surface, borderColor: c.line, opacity: pressed ? 0.7 : 1 },
      ]}>
      <Icon name={icon} color={c.brandDeep} size={20} />
      <Txt style={{ flex: 1 }}>{label}</Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.sm },
  input: {
    borderWidth: 1.5,
    borderRadius: Radius.card - 4,
    paddingHorizontal: Space.md,
    paddingVertical: 12,
    fontFamily: Fonts.regular,
    fontSize: 16,
  },
  direct: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    padding: Space.md,
    borderRadius: Radius.card,
    borderWidth: 1,
  },
});
