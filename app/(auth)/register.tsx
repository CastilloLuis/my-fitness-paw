import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { signUp } from '@/src/supabase/auth';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { theme } from '@/src/theme';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationSent, setConfirmationSent] = useState(false);

  const clearError = () => setError('');

  const handleRegister = async () => {
    if (!displayName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!password) {
      setError('Please enter a password');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await signUp(email.trim(), password, displayName.trim());
      if (result.confirmationRequired) {
        setConfirmationSent(true);
      } else {
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      setError(e.message || 'Registration failed. Please try again.');
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
          Check your email
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
          We sent a confirmation link to {email}. Tap it to activate your
          account, then come back and log in.
        </Text>
        <Button
          title="Back to Log In"
          onPress={() => router.replace('/(auth)/login')}
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
      accessibilityLabel={visible ? 'Hide password' : 'Show password'}
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
          justifyContent: 'center',
          paddingHorizontal: theme.spacing.lg,
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand hero */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Image
            source={require('@/assets/icons/paw.png')}
            style={{ width: 100, height: 100 }}
            contentFit="contain"
          />
          <Text
            style={{
              fontFamily: theme.font.display,
              fontSize: 26,
              color: theme.colors.text,
              marginTop: 14,
            }}
          >
            Join the Pack
          </Text>
          <Text
            style={{
              fontFamily: theme.font.body,
              fontSize: 15,
              color: theme.colors.textMuted,
              marginTop: 4,
            }}
          >
            Create your account to get started
          </Text>
        </View>

        {/* Form */}
        <View style={{ gap: 16 }}>
          <Input
            label="Name"
            value={displayName}
            onChangeText={(text) => { setDisplayName(text); clearError(); }}
            autoCapitalize="words"
            textContentType="name"
            returnKeyType="next"
          />
          <Input
            label="Email"
            value={email}
            onChangeText={(text) => { setEmail(text); clearError(); }}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            returnKeyType="next"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={(text) => { setPassword(text); clearError(); }}
            secureTextEntry={!showPassword}
            textContentType="newPassword"
            autoComplete="new-password"
            returnKeyType="next"
            rightElement={eyeIcon(showPassword, () => setShowPassword(!showPassword))}
          />
          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => { setConfirmPassword(text); clearError(); }}
            secureTextEntry={!showConfirm}
            textContentType="newPassword"
            returnKeyType="go"
            onSubmitEditing={handleRegister}
            rightElement={eyeIcon(showConfirm, () => setShowConfirm(!showConfirm))}
          />

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
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={{ marginTop: 8 }}
          />
        </View>

        {/* Secondary CTA */}
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go to login"
          style={{ marginTop: 24, alignItems: 'center', paddingVertical: 12 }}
        >
          <Text
            style={{
              fontFamily: theme.font.body,
              fontSize: 15,
              color: theme.colors.textMuted,
            }}
          >
            Already have an account?{' '}
            <Text
              style={{
                fontFamily: theme.font.bodySemiBold,
                color: theme.colors.primary,
              }}
            >
              Log in
            </Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
