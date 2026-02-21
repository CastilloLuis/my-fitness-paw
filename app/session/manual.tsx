import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useCats } from '@/src/hooks/use-cats';
import { useCreateSession } from '@/src/hooks/use-sessions';
import { ACTIVITY_TYPES } from '@/src/utils/activity-types';
import { Avatar } from '@/src/components/ui/avatar';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Skeleton } from '@/src/components/ui/skeleton';
import { theme } from '@/src/theme';

export default function ManualLogScreen() {
  const insets = useSafeAreaInsets();
  const { data: cats, isLoading: catsLoading } = useCats();
  const createSession = useCreateSession();

  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!selectedCatId) {
      setError('Please select a cat');
      return;
    }
    if (!selectedActivity) {
      setError('Please select an activity');
      return;
    }
    const mins = parseInt(duration, 10);
    if (!mins || mins < 1) {
      setError('Please enter a valid duration');
      return;
    }
    if (mins > 180) {
      setError('Duration cannot exceed 3 hours');
      return;
    }

    setError('');
    try {
      await createSession.mutateAsync({
        cat_id: selectedCatId,
        activity_type: selectedActivity,
        duration_minutes: mins,
        notes: notes.trim() || null,
      });
      if (process.env.EXPO_OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save session');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <KeyboardAvoidingView
        behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + 8,
            paddingHorizontal: theme.spacing.md,
            paddingBottom: insets.bottom + 40,
            gap: theme.spacing.lg,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
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
              Log Session
            </Text>
          </View>

          {/* Pick a cat */}
          <View>
            <Text
              style={{
                fontFamily: theme.font.bodySemiBold,
                fontSize: 15,
                color: theme.colors.text,
                marginBottom: 10,
              }}
            >
              Which cat?
            </Text>
            {catsLoading ? (
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Skeleton width={80} height={80} borderRadius={theme.radius.lg} />
                <Skeleton width={80} height={80} borderRadius={theme.radius.lg} />
              </View>
            ) : cats && cats.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
              >
                {cats.map((cat) => {
                  const selected = selectedCatId === cat.id;
                  return (
                    <Pressable
                      key={cat.id}
                      onPress={() => {
                        setSelectedCatId(cat.id);
                        if (process.env.EXPO_OS === 'ios') {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={cat.name}
                      accessibilityState={{ selected }}
                      style={{
                        width: 80,
                        paddingVertical: 12,
                        borderRadius: theme.radius.lg,
                        alignItems: 'center',
                        gap: 6,
                        backgroundColor: selected
                          ? theme.colors.ginger400 + '20'
                          : theme.colors.surfaceElevated,
                        borderWidth: selected ? 1.5 : 1,
                        borderColor: selected
                          ? theme.colors.primary
                          : theme.colors.borderSubtle,
                        borderCurve: 'continuous',
                      }}
                    >
                      <Avatar emoji={cat.emoji} imageBase64={cat.image_base64} size={36} />
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: selected
                            ? theme.font.bodySemiBold
                            : theme.font.body,
                          fontSize: 12,
                          color: selected
                            ? theme.colors.primary
                            : theme.colors.textMuted,
                        }}
                      >
                        {cat.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : (
              <Text
                style={{
                  fontFamily: theme.font.body,
                  fontSize: 14,
                  color: theme.colors.textMuted,
                }}
              >
                No cats yet — add one from the Cats tab first.
              </Text>
            )}
          </View>

          {/* Activity type */}
          <View>
            <Text
              style={{
                fontFamily: theme.font.bodySemiBold,
                fontSize: 15,
                color: theme.colors.text,
                marginBottom: 10,
              }}
            >
              What did you play?
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {ACTIVITY_TYPES.map((activity) => {
                const selected = selectedActivity === activity.id;
                return (
                  <Pressable
                    key={activity.id}
                    onPress={() => {
                      setSelectedActivity(activity.id);
                      if (process.env.EXPO_OS === 'ios') {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={activity.label}
                    accessibilityState={{ selected }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      paddingVertical: 10,
                      paddingHorizontal: 14,
                      borderRadius: theme.radius.full,
                      backgroundColor: selected
                        ? activity.color + '20'
                        : theme.colors.surfaceElevated,
                      borderWidth: selected ? 1.5 : 1,
                      borderColor: selected
                        ? activity.color
                        : theme.colors.borderSubtle,
                      borderCurve: 'continuous',
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{activity.emoji}</Text>
                    <Text
                      style={{
                        fontFamily: selected
                          ? theme.font.bodySemiBold
                          : theme.font.body,
                        fontSize: 13,
                        color: selected ? activity.color : theme.colors.textMuted,
                      }}
                    >
                      {activity.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Duration */}
          <Input
            label="Duration (minutes)"
            value={duration}
            onChangeText={setDuration}
            keyboardType="number-pad"
            maxLength={3}
          />

          {/* Notes */}
          <Input
            label="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            containerStyle={{ minHeight: 80 }}
          />

          {/* Error */}
          {error ? (
            <Text
              style={{
                fontFamily: theme.font.body,
                fontSize: 13,
                color: theme.colors.danger,
                textAlign: 'center',
              }}
            >
              {error}
            </Text>
          ) : null}

          {/* Save */}
          <View style={{ gap: 8 }}>
            <Button
              title="Save Session"
              onPress={handleSave}
              loading={createSession.isPending}
            />
            <Button title="Cancel" onPress={() => router.back()} variant="ghost" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
