import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { signUp } from '@/src/supabase/auth';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { theme } from '@/src/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await signUp(email.trim(), password, displayName.trim() || undefined);
      if (result.confirmationRequired) {
        setConfirmationSent(true);
      } else {
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      console.error('Registration error:', e);
      setError(e.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          We sent a confirmation link to {email}. Tap it to activate your account, then come back and sign in.
        </Text>
        <Button
          title="Back to Sign In"
          onPress={() => router.replace('/(auth)/login')}
          variant="secondary"
          style={{ marginTop: 8 }}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
        <View style={{ alignItems: 'center', marginBottom: 48 }}>
          <Text style={{ fontSize: 56 }}>{'\u{1F43E}'}</Text>
          <Text
            style={{
              fontFamily: theme.font.display,
              fontSize: 32,
              color: theme.colors.text,
              marginTop: 12,
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

        <View style={{ gap: 16 }}>
          <Input
            label="Display Name"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
            textContentType="name"
          />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="newPassword"
            autoComplete="new-password"
          />

          {!!error && (
            <View
              style={{
                backgroundColor: theme.colors.danger + '15',
                borderRadius: theme.radius.md,
                padding: 12,
                borderWidth: 1,
                borderColor: theme.colors.danger + '30',
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
                selectable
              >
                {error}
              </Text>
            </View>
          )}

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={{ marginTop: 8 }}
          />

          <Button
            title="Already have an account? Sign in"
            onPress={() => router.back()}
            variant="ghost"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
