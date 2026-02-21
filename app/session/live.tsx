import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCats } from '@/src/hooks/use-cats';
import { useCreateSession } from '@/src/hooks/use-sessions';
import { usePlaySafety } from '@/src/hooks/use-play-safety';
import { useLiveSessionStore } from '@/src/stores/live-session-store';
import { CatPicker } from '@/src/components/cats/cat-picker';
import { Button } from '@/src/components/ui/button';
import { Skeleton } from '@/src/components/ui/skeleton';
import { SuccessOverlay } from '@/src/components/ui/success-overlay';
import { EmptyState } from '@/src/components/ui/empty-state';
import { ACTIVITY_TYPES } from '@/src/utils/activity-types';
import { theme } from '@/src/theme';
import { playMeow } from '@/src/utils/play-meow';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Phase = 'pick-cat' | 'recording' | 'classify' | 'success';

function formatTimer(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

// --- Drag Handle ---
function DragHandle() {
  return (
    <View style={{ alignItems: 'center', paddingTop: 6, paddingBottom: 2 }}>
      <View
        style={{
          width: 36,
          height: 4,
          borderRadius: 2,
          backgroundColor: theme.colors.taupe300,
        }}
      />
    </View>
  );
}

// --- Loading skeleton for pick-cat phase ---
function CatPickerSkeleton() {
  return (
    <View style={{ gap: 24 }}>
      <Skeleton width={160} height={22} borderRadius={6} />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Skeleton width={90} height={100} borderRadius={theme.radius.lg} />
        <Skeleton width={90} height={100} borderRadius={theme.radius.lg} />
        <Skeleton width={90} height={100} borderRadius={theme.radius.lg} />
      </View>
    </View>
  );
}

// --- Recording Dot ---
function RecordingDot() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        { flexDirection: 'row', alignItems: 'center', gap: 8 },
        dotStyle,
      ]}
    >
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: theme.colors.danger,
        }}
      />
      <Text
        style={{
          fontFamily: theme.font.bodySemiBold,
          fontSize: 14,
          color: theme.colors.danger,
        }}
      >
        Recording...
      </Text>
    </Animated.View>
  );
}

// --- Breathing Circle ---
function BreathingCircle() {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: theme.colors.ginger400 + '12',
          position: 'absolute',
        },
        style,
      ]}
    />
  );
}

// --- Safety Warning Banner ---
function SafetyBanner({ message, variant }: { message: string; variant: 'danger' | 'warning' }) {
  const color = variant === 'danger' ? theme.colors.danger : theme.colors.warning;
  return (
    <Animated.View entering={FadeInDown.duration(300)}>
      <View
        style={{
          backgroundColor: color + '15',
          borderLeftWidth: 3,
          borderLeftColor: color,
          borderRadius: theme.radius.sm,
          padding: 12,
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontFamily: theme.font.bodyMedium,
            fontSize: 13,
            color: theme.colors.ink800,
            lineHeight: 18,
          }}
        >
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

// --- Time Limit Reached Overlay ---
function TimeLimitReached({
  maxMinutes,
  restMinutes,
  restSuggestion,
  onDismiss,
}: {
  maxMinutes: number;
  restMinutes: number;
  restSuggestion: string | null;
  onDismiss: () => void;
}) {
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={{
        backgroundColor: theme.colors.danger + '12',
        borderWidth: 1.5,
        borderColor: theme.colors.danger + '40',
        borderRadius: theme.radius.lg,
        padding: 20,
        gap: 12,
        borderCurve: 'continuous',
      }}
    >
      <Text
        style={{
          fontFamily: theme.font.display,
          fontSize: 20,
          color: theme.colors.danger,
          textAlign: 'center',
        }}
      >
        {'\u26D4'} Time Limit Reached
      </Text>
      <Text
        style={{
          fontFamily: theme.font.bodyMedium,
          fontSize: 15,
          color: theme.colors.text,
          textAlign: 'center',
        }}
      >
        Session auto-paused at {maxMinutes} min to protect your cat.
      </Text>
      <Text
        style={{
          fontFamily: theme.font.body,
          fontSize: 13,
          color: theme.colors.textSecondary,
          textAlign: 'center',
          lineHeight: 18,
        }}
      >
        {restSuggestion ??
          `Rest for at least ${restMinutes} minutes before the next session. Watch for panting or heavy breathing \u2014 if present, extend the rest period.`}
      </Text>
      <View style={{ gap: 8, marginTop: 4 }}>
        <Button title="Stop & Save Session" onPress={onDismiss} />
      </View>
    </Animated.View>
  );
}

// --- Activity Chip (compact) ---
function ActivityChip({
  label,
  emoji,
  color,
  selected,
  onPress,
}: {
  label: string;
  emoji: string;
  color: string;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress();
      }}
      onPressIn={() => {
        scale.value = withTiming(0.97, { duration: 80 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 120 });
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: theme.radius.full,
          backgroundColor: selected ? color + '18' : theme.colors.surface,
          borderWidth: selected ? 1.5 : 1,
          borderColor: selected ? color : theme.colors.borderSubtle,
          borderCurve: 'continuous',
        },
        animStyle,
      ]}
    >
      <Text style={{ fontSize: 16 }}>{emoji}</Text>
      <Text
        style={{
          fontFamily: selected ? theme.font.bodySemiBold : theme.font.body,
          fontSize: 13,
          color: selected ? color : theme.colors.text,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

export default function LiveSessionScreen() {
  const insets = useSafeAreaInsets();
  const { data: cats, isLoading: catsLoading } = useCats();
  const createSession = useCreateSession();
  const liveStore = useLiveSessionStore();

  const [phase, setPhase] = useState<Phase>(() =>
    liveStore.isRecording ? 'recording' : 'pick-cat'
  );
  const [selectedCatId, setSelectedCatId] = useState<string | null>(
    liveStore.catId
  );

  const [displayMs, setDisplayMs] = useState(0);
  const [timeLimitReached, setTimeLimitReached] = useState(false);

  const [finalElapsedMs, setFinalElapsedMs] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Track if we already fired the auto-pause to avoid re-triggering
  const autoPausedRef = useRef(false);

  // Get selected cat and its safety constraints
  const selectedCat = cats?.find((c) => c.id === selectedCatId) ?? null;
  const playSafety = usePlaySafety(selectedCat);

  // Auto-select if only one cat
  useEffect(() => {
    if (cats && cats.length === 1 && !selectedCatId) {
      setSelectedCatId(cats[0].id);
    }
  }, [cats, selectedCatId]);

  // Timer tick + auto-pause at limit
  useEffect(() => {
    if (phase !== 'recording') return;

    const tick = setInterval(() => {
      const elapsed = liveStore.getElapsedMs();
      setDisplayMs(elapsed);

      // Auto-pause at safety limit
      if (
        playSafety?.hasLimits &&
        playSafety.maxContinuousMs > 0 &&
        elapsed >= playSafety.maxContinuousMs &&
        !liveStore.isPaused &&
        !autoPausedRef.current
      ) {
        autoPausedRef.current = true;
        liveStore.pause();
        setTimeLimitReached(true);
        if (process.env.EXPO_OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
      }
    }, 1000);

    setDisplayMs(liveStore.getElapsedMs());

    return () => clearInterval(tick);
  }, [phase, liveStore, playSafety]);

  // Reset auto-pause flag when starting a new session
  useEffect(() => {
    if (phase === 'recording') {
      autoPausedRef.current = false;
      setTimeLimitReached(false);
    }
  }, [phase]);

  const handleStart = useCallback(() => {
    if (!selectedCatId || !cats) return;
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    playMeow();
    const cat = cats.find((c) => c.id === selectedCatId);
    liveStore.startRecording(selectedCatId, cat?.emoji ?? '');
    setDisplayMs(0);
    setTimeLimitReached(false);
    autoPausedRef.current = false;
    setPhase('recording');
  }, [selectedCatId, cats, liveStore]);

  const handlePauseResume = useCallback(() => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (liveStore.isPaused) {
      liveStore.resume();
    } else {
      liveStore.pause();
    }
  }, [liveStore]);

  const handleStop = useCallback(() => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    const { elapsedMs } = liveStore.stopRecording();
    setFinalElapsedMs(elapsedMs);
    setSelectedActivity('free_roam');
    setTimeLimitReached(false);
    setPhase('classify');
  }, [liveStore]);

  const handleTimeLimitStop = useCallback(() => {
    // When dismissed from time limit overlay, go to classify
    handleStop();
  }, [handleStop]);

  const handleSave = useCallback(async () => {
    if (!selectedCatId || !selectedActivity) {
      setError('Please select an activity');
      return;
    }
    setError('');

    const durationMinutes = Math.max(1, Math.round(finalElapsedMs / 60000));

    try {
      await createSession.mutateAsync({
        cat_id: selectedCatId,
        activity_type: selectedActivity,
        duration_minutes: durationMinutes,
        notes: notes.trim() || null,
      });

      if (process.env.EXPO_OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      liveStore.clear();
      setPhase('success');
    } catch (e: any) {
      setError(e.message || 'Failed to save session');
    }
  }, [selectedCatId, selectedActivity, finalElapsedMs, notes, createSession, liveStore]);

  const handleSuccessComplete = useCallback(() => {
    router.back();
  }, []);

  const handleClose = useCallback(() => {
    liveStore.clear();
    router.back();
  }, [liveStore]);

  const hasCats = cats && cats.length > 0;
  const durationMinutes = Math.max(1, Math.round(finalElapsedMs / 60000));

  // Timer color: warn when approaching limit, danger when at limit
  const isApproachingLimit =
    playSafety?.hasLimits &&
    playSafety.maxContinuousMs > 0 &&
    displayMs >= playSafety.maxContinuousMs * 0.75;
  const isAtLimit =
    playSafety?.hasLimits &&
    playSafety.maxContinuousMs > 0 &&
    displayMs >= playSafety.maxContinuousMs;
  const timerColor = isAtLimit
    ? theme.colors.danger
    : isApproachingLimit
      ? theme.colors.warning
      : theme.colors.text;

  // Progress toward limit (0 to 1)
  const limitProgress =
    playSafety?.hasLimits && playSafety.maxContinuousMs > 0
      ? Math.min(displayMs / playSafety.maxContinuousMs, 1)
      : null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      {phase === 'success' && (
        <SuccessOverlay onComplete={handleSuccessComplete} />
      )}

      {/* Drag handle flush to sheet top */}
      <DragHandle />

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingHorizontal: theme.spacing.md,
          paddingBottom: insets.bottom + 40,
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontFamily: theme.font.display,
              fontSize: 24,
              color: theme.colors.text,
            }}
          >
            {phase === 'pick-cat'
              ? 'New Session'
              : phase === 'recording'
                ? 'Recording'
                : phase === 'classify'
                  ? 'Classify'
                  : ''}
          </Text>
          {phase !== 'success' && phase !== 'recording' && (
            <Pressable
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: theme.colors.surface,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{ fontSize: 18, color: theme.colors.textMuted }}
              >
                {'\u2715'}
              </Text>
            </Pressable>
          )}
        </Animated.View>

        {/* Phase 1: Pick Cat */}
        {phase === 'pick-cat' && (
          <Animated.View
            entering={FadeInDown.delay(80).duration(300)}
            style={{ gap: 24, flex: 1 }}
          >
            {catsLoading ? (
              <CatPickerSkeleton />
            ) : hasCats ? (
              <>
                <Text
                  style={{
                    fontFamily: theme.font.bodySemiBold,
                    fontSize: 18,
                    color: theme.colors.text,
                  }}
                >
                  Who's playing?
                </Text>

                <CatPicker
                  cats={cats}
                  selectedId={selectedCatId}
                  onSelect={setSelectedCatId}
                />

                {/* Safety warning on cat selection */}
                {playSafety?.timerWarning && (
                  <SafetyBanner
                    message={playSafety.timerWarning}
                    variant={playSafety.obesityStatus === 'obese' ? 'danger' : 'warning'}
                  />
                )}
              </>
            ) : (
              <EmptyState
                emoji={'\u{1F431}'}
                title="No cats yet"
                message="Add a cat first, then you can start a session!"
                actionTitle="Add a Cat"
                onAction={() => {
                  router.back();
                  setTimeout(() => router.push('/(tabs)/cats'), 100);
                }}
              />
            )}

            <View style={{ flex: 1 }} />

            {hasCats && (
              <Button
                title="Start Session"
                onPress={handleStart}
                disabled={!selectedCatId}
                style={{ opacity: selectedCatId ? 1 : 0.5 }}
              />
            )}
          </Animated.View>
        )}

        {/* Phase 2: Recording */}
        {phase === 'recording' && (
          <Animated.View
            entering={FadeIn.duration(300)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
              paddingVertical: 40,
            }}
          >
            {/* Safety warning during recording */}
            {playSafety?.timerWarning && !timeLimitReached && (
              <View style={{ width: '100%' }}>
                <SafetyBanner
                  message={playSafety.timerWarning}
                  variant={playSafety.obesityStatus === 'obese' ? 'danger' : 'warning'}
                />
              </View>
            )}

            {/* Time limit reached overlay */}
            {timeLimitReached && playSafety && (
              <View style={{ width: '100%' }}>
                <TimeLimitReached
                  maxMinutes={playSafety.safety.maxContinuousMinutes.max}
                  restMinutes={playSafety.safety.recommendedBreakMinutes}
                  restSuggestion={playSafety.safety.restSuggestion}
                  onDismiss={handleTimeLimitStop}
                />
              </View>
            )}

            {!timeLimitReached && (
              <>
                <RecordingDot />

                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 220,
                    height: 220,
                  }}
                >
                  <BreathingCircle />
                  <Text
                    style={{
                      fontFamily: theme.font.display,
                      fontSize: 72,
                      color: timerColor,
                      fontVariant: ['tabular-nums'],
                    }}
                  >
                    {formatTimer(displayMs)}
                  </Text>
                </View>

                {/* Time limit progress bar */}
                {limitProgress !== null && (
                  <View style={{ width: '80%', gap: 4 }}>
                    <View
                      style={{
                        height: 6,
                        backgroundColor: theme.colors.taupe200,
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}
                    >
                      <View
                        style={{
                          width: `${limitProgress * 100}%`,
                          height: '100%',
                          backgroundColor: isAtLimit
                            ? theme.colors.danger
                            : isApproachingLimit
                              ? theme.colors.warning
                              : theme.colors.primary,
                          borderRadius: 3,
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        fontFamily: theme.font.body,
                        fontSize: 11,
                        color: theme.colors.textMuted,
                        textAlign: 'center',
                      }}
                    >
                      {Math.ceil((playSafety!.maxContinuousMs - displayMs) / 60000) > 0
                        ? `${Math.ceil((playSafety!.maxContinuousMs - displayMs) / 60000)} min remaining`
                        : 'Limit reached'}
                    </Text>
                  </View>
                )}

                {selectedCatId && cats && (
                  <Text
                    style={{
                      fontFamily: theme.font.body,
                      fontSize: 15,
                      color: theme.colors.textMuted,
                    }}
                  >
                    {cats.find((c) => c.id === selectedCatId)?.emoji}{' '}
                    {cats.find((c) => c.id === selectedCatId)?.name}
                  </Text>
                )}

                <View
                  style={{ flexDirection: 'row', gap: 16, paddingHorizontal: 24 }}
                >
                  <Button
                    title={liveStore.isPaused ? 'Resume' : 'Pause'}
                    onPress={handlePauseResume}
                    variant="secondary"
                    style={{ flex: 1 }}
                  />
                  <Button
                    title="Stop"
                    onPress={handleStop}
                    style={{ flex: 1, backgroundColor: theme.colors.danger }}
                  />
                </View>
              </>
            )}
          </Animated.View>
        )}

        {/* Phase 3: Classify */}
        {phase === 'classify' && (
          <Animated.View
            entering={FadeInDown.delay(80).duration(300)}
            style={{ gap: 20 }}
          >
            <View
              style={{
                alignSelf: 'center',
                backgroundColor: theme.colors.ginger400 + '20',
                borderRadius: theme.radius.full,
                paddingHorizontal: 20,
                paddingVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Text style={{ fontSize: 18 }}>{'\u23F1\uFE0F'}</Text>
              <Text
                style={{
                  fontFamily: theme.font.bodySemiBold,
                  fontSize: 18,
                  color: theme.colors.primary,
                }}
              >
                {durationMinutes} min
              </Text>
            </View>

            {/* Rest suggestion after session for overweight/obese */}
            {playSafety?.safety.restSuggestion && (
              <SafetyBanner
                message={`Rest suggestion: ${playSafety.safety.restSuggestion}`}
                variant={playSafety.obesityStatus === 'obese' ? 'danger' : 'warning'}
              />
            )}

            <Text
              style={{
                fontFamily: theme.font.bodySemiBold,
                fontSize: 16,
                color: theme.colors.text,
              }}
            >
              What type of play?
            </Text>

            <View
              style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}
            >
              {ACTIVITY_TYPES.map((activity) => (
                <ActivityChip
                  key={activity.id}
                  label={activity.label}
                  emoji={activity.emoji}
                  color={activity.color}
                  selected={selectedActivity === activity.id}
                  onPress={() => setSelectedActivity(activity.id)}
                />
              ))}
            </View>

            <Text
              style={{
                fontFamily: theme.font.bodySemiBold,
                fontSize: 16,
                color: theme.colors.text,
              }}
            >
              Notes (optional)
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="How did it go?"
              placeholderTextColor={theme.colors.textMuted}
              multiline
              numberOfLines={3}
              style={{
                fontFamily: theme.font.body,
                fontSize: 15,
                color: theme.colors.text,
                backgroundColor: theme.colors.surfaceElevated,
                borderRadius: theme.radius.md,
                borderWidth: 1,
                borderColor: theme.colors.borderSubtle,
                padding: theme.spacing.md,
                minHeight: 80,
                textAlignVertical: 'top',
                borderCurve: 'continuous',
              }}
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
                >
                  {error}
                </Text>
              </View>
            )}

            <Button
              title="Save Session"
              onPress={handleSave}
              loading={createSession.isPending}
            />
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
