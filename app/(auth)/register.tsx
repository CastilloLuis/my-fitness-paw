import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { openBrowserAsync } from 'expo-web-browser';
import { useTranslation } from 'react-i18next';

import { signUp } from '@/src/supabase/auth';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { theme } from '@/src/theme';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const clearError = () => setError('');

  const handleRegister = async () => {
    if (!displayName.trim()) {
      setError(t('auth.errorEnterName'));
      return;
    }
    if (!email.trim()) {
      setError(t('auth.errorEnterEmail'));
      return;
    }
    if (!password) {
      setError(t('auth.errorEnterPassword'));
      return;
    }
    if (password.length < 6) {
      setError(t('auth.errorPasswordLength'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('auth.errorPasswordMismatch'));
      return;
    }
    if (!acceptedTerms) {
      setError(t('auth.errorAcceptTerms'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await signUp(email.trim(), password, displayName.trim());
      if (result.confirmationRequired) {
        setConfirmationSent(true);
      } else {
        router.replace('/onboarding');
      }
    } catch (e: any) {
      setError(e.message || t('auth.errorRegistrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Confirmation sent screen
  if (confirmationSent) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.bg,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: theme.spacing.lg,
          gap: 16,
        }}
      >
        <Text style={{ fontSize: 56 }}>{'\u{2709}\uFE0F'}</Text>
        <Text
          style={{
            fontFamily: theme.font.display,
            fontSize: 24,
            color: theme.colors.text,
            textAlign: 'center',
          }}
        >
          {t('auth.checkYourEmail')}
        </Text>
        <Text
          style={{
            fontFamily: theme.font.body,
            fontSize: 15,
            color: theme.colors.textMuted,
            textAlign: 'center',
            lineHeight: 22,
          }}
        >
          {t('auth.confirmationSent', { email })}
        </Text>
        <Button
          title={t('auth.backToLogIn')}
          onPress={() => router.replace('/(auth)/welcome')}
          variant="secondary"
          style={{ marginTop: 8 }}
        />
      </View>
    );
  }

  const eyeIcon = (visible: boolean, toggle: () => void) => (
    <Pressable
      onPress={toggle}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={visible ? t('auth.hidePassword') : t('auth.showPassword')}
    >
      <Ionicons
        name={visible ? 'eye-off-outline' : 'eye-outline'}
        size={20}
        color={theme.colors.textMuted}
      />
    </Pressable>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: theme.spacing.lg,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back button */}
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          hitSlop={12}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
        </Pressable>

        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontFamily: theme.font.display,
              fontSize: 28,
              color: theme.colors.text,
            }}
          >
            {t('auth.joinThePack')}
          </Text>
          <Text
            style={{
              fontFamily: theme.font.body,
              fontSize: 15,
              color: theme.colors.textMuted,
              marginTop: 6,
            }}
          >
            {t('auth.createYourAccount')}
          </Text>
        </View>

        {/* Form */}
        <View style={{ gap: 16 }}>
          <Input
            label={t('auth.name')}
            value={displayName}
            onChangeText={(text) => { setDisplayName(text); clearError(); }}
            autoCapitalize="words"
            textContentType="name"
            returnKeyType="next"
          />
          <Input
            label={t('auth.email')}
            value={email}
            onChangeText={(text) => { setEmail(text); clearError(); }}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            returnKeyType="next"
          />
          <Input
            label={t('auth.password')}
            value={password}
            onChangeText={(text) => { setPassword(text); clearError(); }}
            secureTextEntry={!showPassword}
            textContentType="newPassword"
            autoComplete="new-password"
            returnKeyType="next"
            rightElement={eyeIcon(showPassword, () => setShowPassword(!showPassword))}
          />
          <Input
            label={t('auth.confirmPassword')}
            value={confirmPassword}
            onChangeText={(text) => { setConfirmPassword(text); clearError(); }}
            secureTextEntry={!showConfirm}
            textContentType="newPassword"
            returnKeyType="go"
            onSubmitEditing={handleRegister}
            rightElement={eyeIcon(showConfirm, () => setShowConfirm(!showConfirm))}
          />

          {/* Terms & Privacy */}
          <Pressable
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: acceptedTerms }}
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 10,
              paddingVertical: 4,
            }}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 6,
                borderWidth: 1.5,
                borderColor: acceptedTerms
                  ? theme.colors.primary
                  : theme.colors.border,
                backgroundColor: acceptedTerms
                  ? theme.colors.primary
                  : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                borderCurve: 'continuous',
              }}
            >
              {acceptedTerms && (
                <Ionicons name="checkmark" size={13} color={theme.colors.white} />
              )}
            </View>
            <Text
              style={{
                flex: 1,
                fontFamily: theme.font.body,
                fontSize: 13,
                color: theme.colors.textMuted,
                lineHeight: 20,
              }}
            >
              {t('auth.termsAgree')}
              <Text
                onPress={() => openBrowserAsync('https://google.com')}
                style={{
                  fontFamily: theme.font.bodySemiBold,
                  color: theme.colors.primary,
                }}
              >
                {t('auth.termsOfService')}
              </Text>
              {t('auth.and')}
              <Text
                onPress={() => openBrowserAsync('https://google.com')}
                style={{
                  fontFamily: theme.font.bodySemiBold,
                  color: theme.colors.primary,
                }}
              >
                {t('auth.privacyPolicy')}
              </Text>
            </Text>
          </Pressable>

          {/* Error banner */}
          {!!error && (
            <View
              style={{
                backgroundColor: theme.colors.danger + '12',
                borderRadius: theme.radius.md,
                padding: 12,
                borderWidth: 1,
                borderColor: theme.colors.danger + '25',
                borderCurve: 'continuous',
              }}
            >
              <Text
                style={{
                  fontFamily: theme.font.bodyMedium,
                  fontSize: 14,
                  color: theme.colors.danger,
                  textAlign: 'center',
                }}
              >
                {error}
              </Text>
            </View>
          )}

          {/* Primary CTA */}
          <Button
            title={t('auth.createAccount')}
            onPress={handleRegister}
            loading={loading}
            disabled={!displayName.trim() || !email.trim() || !password || !confirmPassword || !acceptedTerms}
            style={{ marginTop: 8 }}
          />
        </View>

        {/* Secondary CTA */}
        <Pressable
          onPress={() => {
            router.back();
            setTimeout(() => router.push('/(auth)/login'), 100);
          }}
          accessibilityRole="button"
          accessibilityLabel={t('auth.logIn')}
          style={{ marginTop: 24, alignItems: 'center', paddingVertical: 12 }}
        >
          <Text
            style={{
              fontFamily: theme.font.body,
              fontSize: 15,
              color: theme.colors.textMuted,
            }}
          >
            {t('auth.alreadyHaveAccount')}
            <Text
              style={{
                fontFamily: theme.font.bodySemiBold,
                color: theme.colors.primary,
              }}
            >
              {t('auth.logIn')}
            </Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
