import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/src/hooks/use-auth';
import { useProfile } from '@/src/hooks/use-profile';
import { updateProfile } from '@/src/supabase/queries/profiles';
import { signOut, deleteAccount } from '@/src/supabase/auth';
import { queryKeys } from '@/src/constants/query-keys';
import { sendTestNotification } from '@/src/utils/notifications';
import { useNotificationPermission } from '@/src/hooks/use-notification-permission';
import { useLanguageStore } from '@/src/stores/language-store';
import { theme } from '@/src/theme';

function SectionHeader({ title }: { title: string }) {
  return (
    <Text
      style={{
        fontFamily: theme.font.bodySemiBold,
        fontSize: 13,
        color: theme.colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 8,
        marginTop: 28,
        paddingHorizontal: 4,
      }}
    >
      {title}
    </Text>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  destructive,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
}) {
  const color = destructive ? theme.colors.danger : theme.colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={label}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 14,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Ionicons name={icon} size={20} color={destructive ? theme.colors.danger : theme.colors.textMuted} />
      <Text
        style={{
          flex: 1,
          fontFamily: theme.font.bodyMedium,
          fontSize: 16,
          color,
        }}
      >
        {label}
      </Text>
      {value != null && (
        <Text
          style={{
            fontFamily: theme.font.body,
            fontSize: 15,
            color: theme.colors.textMuted,
          }}
        >
          {value}
        </Text>
      )}
      {onPress && !destructive && (
        <Ionicons name="chevron-forward" size={18} color={theme.colors.taupe300} />
      )}
    </Pressable>
  );
}

function Divider() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: theme.colors.borderSubtle,
        marginLeft: 50,
      }}
    />
  );
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: theme.colors.surfaceElevated,
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
        boxShadow: theme.shadow.sm.boxShadow,
        overflow: 'hidden',
      }}
    >
      {children}
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { user, userId } = useAuth();
  const { data: profile } = useProfile();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const updateNameMutation = useMutation({
    mutationFn: (name: string) => updateProfile(userId!, { display_name: name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me });
      setEditingName(false);
    },
  });

  const handleEditName = () => {
    setNameValue(profile?.display_name ?? '');
    setEditingName(true);
  };

  const handleSaveName = () => {
    const trimmed = nameValue.trim();
    if (!trimmed) return;
    updateNameMutation.mutate(trimmed);
  };

  const handleLogOut = () => {
    Alert.alert(t('settings.logOut'), t('settings.logOutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('settings.logOut'),
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          try {
            await signOut();
            queryClient.clear();
          } catch {
            setLoggingOut(false);
            Alert.alert(t('common.error'), t('settings.failedLogOut'));
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('settings.deleteAccountConfirm'),
      t('settings.deleteAccountMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.continue'),
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              t('settings.areYouSure'),
              t('settings.cannotBeUndone'),
              [
                { text: t('common.cancel'), style: 'cancel' },
                {
                  text: t('settings.deleteMyAccount'),
                  style: 'destructive',
                  onPress: async () => {
                    setDeleting(true);
                    try {
                      await deleteAccount();
                      await AsyncStorage.removeItem('@myfitnesspaw:onboarding_done');
                      queryClient.clear();
                    } catch {
                      setDeleting(false);
                      Alert.alert(t('common.error'), t('settings.failedDelete'));
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleResetOnboarding = async () => {
    await AsyncStorage.removeItem('@myfitnesspaw:onboarding_done');
    Alert.alert(t('common.done'), t('settings.onboardingReset'));
  };

  const { enabled: notificationsEnabled } = useNotificationPermission();
  const isDev = process.env.EXPO_PUBLIC_IS_DEV === 'true';
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';
  const displayName = profile?.display_name || t('settings.setYourName');

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingHorizontal: theme.spacing.md,
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginBottom: 8,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={12}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: theme.colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
          </Pressable>
          <Text
            style={{
              fontFamily: theme.font.display,
              fontSize: 24,
              color: theme.colors.text,
            }}
          >
            {t('settings.title')}
          </Text>
        </View>

        {/* Profile card */}
        <SectionHeader title={t('settings.profile')} />
        <SettingsCard>
          {/* Avatar + name + email */}
          <View style={{ alignItems: 'center', paddingVertical: 20, gap: 10 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: theme.colors.surface,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: theme.colors.primaryLight,
              }}
            >
              <Text style={{ fontSize: 36 }}>{'\u{1F431}'}</Text>
            </View>

            {editingName ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, width: '100%' }}>
                <TextInput
                  value={nameValue}
                  onChangeText={setNameValue}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleSaveName}
                  maxLength={40}
                  style={{
                    flex: 1,
                    fontFamily: theme.font.bodyMedium,
                    fontSize: 17,
                    color: theme.colors.text,
                    borderBottomWidth: 2,
                    borderBottomColor: theme.colors.primary,
                    paddingVertical: 6,
                    textAlign: 'center',
                  }}
                />
                <Pressable
                  onPress={handleSaveName}
                  disabled={updateNameMutation.isPending}
                  accessibilityRole="button"
                  accessibilityLabel="Save name"
                  hitSlop={8}
                >
                  {updateNameMutation.isPending ? (
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                  ) : (
                    <Ionicons name="checkmark-circle" size={28} color={theme.colors.primary} />
                  )}
                </Pressable>
                <Pressable
                  onPress={() => setEditingName(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel editing"
                  hitSlop={8}
                >
                  <Ionicons name="close-circle" size={28} color={theme.colors.textMuted} />
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={handleEditName}
                accessibilityRole="button"
                accessibilityLabel="Edit display name"
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
              >
                <Text
                  style={{
                    fontFamily: theme.font.bodySemiBold,
                    fontSize: 18,
                    color: theme.colors.text,
                  }}
                >
                  {displayName}
                </Text>
                <Ionicons name="pencil" size={16} color={theme.colors.textMuted} />
              </Pressable>
            )}

            <Text
              style={{
                fontFamily: theme.font.body,
                fontSize: 14,
                color: theme.colors.textMuted,
              }}
            >
              {user?.email ?? ''}
            </Text>
          </View>
        </SettingsCard>

        {/* Notifications section */}
        <SectionHeader title={t('settings.notifications')} />
        <SettingsCard>
          {notificationsEnabled === false ? (
            <SettingsRow
              icon="notifications-off-outline"
              label={t('settings.enableNotifications')}
              onPress={() => Linking.openSettings()}
            />
          ) : (
            <SettingsRow
              icon="notifications-outline"
              label={t('settings.notifications')}
              value={t('settings.enabled')}
            />
          )}
        </SettingsCard>

        {/* Language section */}
        <SectionHeader title={t('settings.language')} />
        <SettingsCard>
          <SettingsRow
            icon="language-outline"
            label={t('settings.english')}
            onPress={() => setLanguage('en')}
            value={language === 'en' ? '✓' : undefined}
          />
          <Divider />
          <SettingsRow
            icon="language-outline"
            label={t('settings.spanish')}
            onPress={() => setLanguage('es')}
            value={language === 'es' ? '✓' : undefined}
          />
          <Divider />
          <SettingsRow
            icon="phone-portrait-outline"
            label={t('settings.deviceDefault')}
            onPress={() => setLanguage(null)}
            value={language === null ? '✓' : undefined}
          />
        </SettingsCard>

        {/* Account section */}
        <SectionHeader title={t('settings.account')} />
        <SettingsCard>
          <SettingsRow
            icon="log-out-outline"
            label={loggingOut ? t('settings.loggingOut') : t('settings.logOut')}
            onPress={loggingOut ? undefined : handleLogOut}
          />
          <Divider />
          <SettingsRow
            icon="trash-outline"
            label={deleting ? t('settings.deleting') : t('settings.deleteAccount')}
            onPress={deleting ? undefined : handleDeleteAccount}
            destructive
          />
        </SettingsCard>

        {/* About section */}
        <SectionHeader title={t('settings.about')} />
        <SettingsCard>
          <SettingsRow
            icon="information-circle-outline"
            label={t('settings.version')}
            value={appVersion}
          />
          <Divider />
          <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <Text
              style={{
                fontFamily: theme.font.body,
                fontSize: 13,
                color: theme.colors.textMuted,
                lineHeight: 19,
              }}
            >
              {t('settings.aboutDescription')}
            </Text>
          </View>
        </SettingsCard>

        {/* Dev tools — only visible when EXPO_PUBLIC_IS_DEV=true */}
        {isDev && (
          <>
            <SectionHeader title={t('settings.developer')} />
            <SettingsCard>
              <SettingsRow
                icon="refresh-outline"
                label={t('settings.resetOnboarding')}
                onPress={handleResetOnboarding}
              />
              <Divider />
              <SettingsRow
                icon="notifications-outline"
                label={t('settings.sendTestNotification')}
                onPress={() => sendTestNotification()}
              />
            </SettingsCard>
          </>
        )}
      </ScrollView>
    </View>
  );
}
