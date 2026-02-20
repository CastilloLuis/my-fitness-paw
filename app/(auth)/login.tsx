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

import { signIn } from '@/src/supabase/auth';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { theme } from '@/src/theme';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Image
            source={require('@/assets/icons/paw.png')}
            style={{ width: 120, height: 120 }}
            contentFit="contain"
          />
          <Text
            style={{
              fontFamily: theme.font.display,
              fontSize: 30,
              color: theme.colors.text,
              marginTop: 16,
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

        {/* Form */}
        <View style={{ gap: 16 }}>
          <Input
            label="Email"
            value={email}
            onChangeText={(text) => { setEmail(text); setError(''); }}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            returnKeyType="next"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={(text) => { setPassword(text); setError(''); }}
            secureTextEntry={!showPassword}
            textContentType="password"
            autoComplete="password"
            returnKeyType="go"
            onSubmitEditing={handleLogin}
            rightElement={
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={theme.colors.textMuted}
                />
              </Pressable>
            }
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
            title="Log In"
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: 8 }}
          />
        </View>

        {/* Secondary CTA */}
        <Pressable
          onPress={() => router.push('/(auth)/register')}
          accessibilityRole="button"
          accessibilityLabel="Create an account"
          style={{ marginTop: 24, alignItems: 'center', paddingVertical: 12 }}
        >
          <Text
            style={{
              fontFamily: theme.font.body,
              fontSize: 15,
              color: theme.colors.textMuted,
            }}
          >
            Don't have an account?{' '}
            <Text
              style={{
                fontFamily: theme.font.bodySemiBold,
                color: theme.colors.primary,
              }}
            >
              Create one
            </Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
