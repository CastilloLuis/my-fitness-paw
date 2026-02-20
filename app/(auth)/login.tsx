import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { signIn } from '@/src/supabase/auth';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { theme } from '@/src/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch (e: any) {
      console.error('Login error:', e);
      setError(e.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            MyFitnessPaw
          </Text>
          <Text
            style={{
              fontFamily: theme.font.body,
              fontSize: 15,
              color: theme.colors.textMuted,
              marginTop: 4,
            }}
          >
            Track your cat's fitness journey
          </Text>
        </View>

        <View style={{ gap: 16 }}>
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
            textContentType="password"
            autoComplete="password"
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
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: 8 }}
          />

          <Button
            title="Create an account"
            onPress={() => router.push('/(auth)/register')}
            variant="ghost"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
