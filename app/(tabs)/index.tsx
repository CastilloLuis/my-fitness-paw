import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, ScrollView, Text, View, type GestureResponderEvent } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import { InsightCard } from '@/src/components/insights/insight-card';
import { SessionCard } from '@/src/components/sessions/session-card';
import { StoryRow } from '@/src/components/stories/story-row';
import { Avatar } from '@/src/components/ui/avatar';
import { ProgressRing } from '@/src/components/ui/progress-ring';
import { Skeleton } from '@/src/components/ui/skeleton';
import { queryKeys } from '@/src/constants/query-keys';
import { useAuth } from '@/src/hooks/use-auth';
import { useCats } from '@/src/hooks/use-cats';
import { useNotificationPermission } from '@/src/hooks/use-notification-permission';
import { useNotificationScheduler } from '@/src/hooks/use-notification-scheduler';
import { useProfile } from '@/src/hooks/use-profile';
import { useSessions, useTodaySessions } from '@/src/hooks/use-sessions';
import { useStreak } from '@/src/hooks/use-streak';
import { calculateDailyCalories } from '@/src/lib/cat-fitness';
import { generateInsights } from '@/src/lib/insights/generate-insights';
import { theme } from '@/src/theme';
import { requestNotificationPermission } from '@/src/utils/notifications';
import { useQueryClient } from '@tanstack/react-query';

const DAILY_GOAL = 30;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function CatActivityCard({
  cat,
  minutes,
  calories,
  sessions,
  colors,
  goal,
  goalLabel,
  sessionsLabel,
}: {
  cat: { id: string; name: string; emoji: string; image_base64: string | null };
  minutes: number;
  calories: number;
  sessions: number;
  colors: [string, string, string];
  goal: number;
  goalLabel: string;
  sessionsLabel: string;
}) {
  const scale = useSharedValue(1);
  const shimmerOpacity = useSharedValue(0);
  const shimmerScale = useSharedValue(0.3);
  const rippleX = useSharedValue(100);
  const rippleY = useSharedValue(150);
  const cardRef = useRef<View>(null);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmerOpacity.value,
    transform: [{ scale: shimmerScale.value }],
    top: rippleY.value - 100,
    left: rippleX.value - 100,
  }));

  const setRippleOrigin = (e: GestureResponderEvent) => {
    cardRef.current?.measure((_x, _y, _w, _h, pageX, pageY) => {
      rippleX.value = e.nativeEvent.pageX - pageX;
      rippleY.value = e.nativeEvent.pageY - pageY;
    });
  };

  const handlePressIn = (e: GestureResponderEvent) => {
    setRippleOrigin(e);
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
    shimmerScale.value = 0.3;
    shimmerOpacity.value = withTiming(0.35, { duration: 150 });
    shimmerScale.value = withTiming(1.8, { duration: 500 });
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 300 });
    shimmerOpacity.value = withTiming(0, { duration: 400 });
    shimmerScale.value = withTiming(0.3, { duration: 400 });
  };

  const handlePress = (e: GestureResponderEvent) => {
    setRippleOrigin(e);
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    shimmerScale.value = 0.3;
    shimmerOpacity.value = 0;
    shimmerScale.value = withTiming(2.5, { duration: 400 });
    shimmerOpacity.value = withSequence(
      withTiming(0.5, { duration: 100 }),
      withTiming(0, { duration: 350 })
    );
    router.push({ pathname: '/cat/[id]', params: { id: cat.id } });
  };

  return (
    <AnimatedPressable
      ref={cardRef}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[
        {
          width: 200,
          borderRadius: theme.radius.xl,
          borderCurve: 'continuous',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        },
        cardStyle,
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 16, gap: 14 }}
      >
        {/* Shimmer ripple from touch point */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: 'rgba(255,255,255,1)',
            },
            shimmerStyle,
          ]}
          pointerEvents="none"
        />

        {/* Cat identity */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Avatar
            emoji={cat.emoji}
            imageBase64={cat.image_base64}
            size={36}
            backgroundColor="rgba(255,255,255,0.25)"
          />
          <Text
            style={{
              fontFamily: theme.font.bodySemiBold,
              fontSize: 15,
              color: '#FFFFFF',
            }}
            numberOfLines={1}
          >
            {cat.name}
          </Text>
        </View>

        {/* Ring */}
        <View style={{ alignItems: 'center' }}>
          <ProgressRing
            progress={minutes / goal}
            size={90}
            strokeWidth={7}
            color="#FFFFFF"
            bgColor="rgba(255,255,255,0.2)"
            label={`${minutes}`}
            sublabel={goalLabel}
            labelColor="#FFFFFF"
            sublabelColor="rgba(255,255,255,0.7)"
          />
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: theme.font.displayBold,
                fontSize: 16,
                color: '#FFFFFF',
              }}
            >
              {calories > 0 ? calories : '--'}
            </Text>
            <Text
              style={{
                fontFamily: theme.font.body,
                fontSize: 10,
                color: 'rgba(255,255,255,0.65)',
              }}
            >
              kcal
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: theme.font.displayBold,
                fontSize: 16,
                color: '#FFFFFF',
              }}
            >
              {sessions}
            </Text>
            <Text
              style={{
                fontFamily: theme.font.body,
                fontSize: 10,
                color: 'rgba(255,255,255,0.65)',
              }}
            >
              {sessionsLabel}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
}

function getGreeting(t: (key: string) => string): string {
  const hour = new Date().getHours();
  if (hour < 12) return t('home.goodMorning');
  if (hour < 17) return t('home.goodAfternoon');
  return t('home.goodEvening');
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const { data: cats, isLoading: catsLoading } = useCats();
  const { data: todaySessions, isLoading: sessionsLoading } = useTodaySessions();
  const { data: allSessions } = useSessions();

  const totalMinutesToday = useMemo(
    () => todaySessions?.reduce((sum, s) => sum + s.duration_minutes, 0) ?? 0,
    [todaySessions]
  );

  const catSessionMinutes = useMemo(() => {
    if (!todaySessions || !cats) return {};
    const map: Record<string, number> = {};
    for (const s of todaySessions) {
      map[s.cat_id] = (map[s.cat_id] ?? 0) + s.duration_minutes;
    }
    return map;
  }, [todaySessions, cats]);

  const insights = useMemo(
    () => generateInsights(allSessions ?? [], cats ?? []),
    [allSessions, cats]
  );

  const catCalories = useMemo(() => {
    if (!todaySessions || !cats) return {};
    const sessionsByCat: Record<string, typeof todaySessions> = {};
    for (const s of todaySessions) {
      if (!sessionsByCat[s.cat_id]) sessionsByCat[s.cat_id] = [];
      sessionsByCat[s.cat_id].push(s);
    }
    const map: Record<string, number> = {};
    for (const cat of cats) {
      const sessions = sessionsByCat[cat.id];
      if (sessions && cat.weight_kg) {
        const daily = calculateDailyCalories(sessions, cat.weight_kg);
        map[cat.id] = Math.round(daily.total_estimated_kcal.max);
      }
    }
    return map;
  }, [todaySessions, cats]);

  const catSessionCounts = useMemo(() => {
    if (!todaySessions) return {};
    const map: Record<string, number> = {};
    for (const s of todaySessions) {
      map[s.cat_id] = (map[s.cat_id] ?? 0) + 1;
    }
    return map;
  }, [todaySessions]);

  // Refetch session data when screen regains focus (e.g. after manual log)
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.today(userId!) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cats.all });
    }, [queryClient, userId])
  );

  useNotificationScheduler();
  const { enabled: notificationsEnabled, recheck: recheckPermission } = useNotificationPermission();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const streak = useStreak(allSessions);
  const displayName = profile?.display_name || 'there';
  const isLoading = catsLoading || sessionsLoading;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingHorizontal: theme.spacing.md,
          paddingBottom: insets.bottom + 100,
          gap: theme.spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <Animated.View entering={FadeInDown.delay(0).duration(500)}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text
                  style={{
                    fontFamily: theme.font.display,
                    fontSize: 26,
                    color: theme.colors.text,
                  }}
                >
                  {getGreeting(t)}!
                </Text>
                <Image
                  source={require('@/assets/icons/two-paws.png')}
                  style={{ width: 35, height: 35 }}
                  contentFit="contain"
                />
              </View>
            </View>
            <Pressable
              onPress={() => router.push('/settings')}
              accessibilityRole="button"
              accessibilityLabel="Settings"
              hitSlop={12}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: theme.colors.surface,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 2,
              }}
            >
              <Ionicons name="settings-outline" size={22} color={theme.colors.textMuted} />
            </Pressable>
          </View>
        </Animated.View>

        {/* Stories */}
        <StoryRow />

        {/* Notification banner */}
        {notificationsEnabled === false && !bannerDismissed && (
          <Animated.View
            entering={FadeInDown.delay(50).duration(400)}
            exiting={FadeOut.duration(300)}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.colors.surfaceElevated,
                borderRadius: theme.radius.md,
                padding: 14,
                gap: 12,
                boxShadow: theme.shadow.sm.boxShadow,
              }}
            >
              <Ionicons
                name="notifications-off-outline"
                size={22}
                color={theme.colors.warning}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: theme.font.bodySemiBold,
                    fontSize: 14,
                    color: theme.colors.text,
                  }}
                >
                  {t('home.notificationsOff')}
                </Text>
                <Text
                  style={{
                    fontFamily: theme.font.body,
                    fontSize: 13,
                    color: theme.colors.textMuted,
                    marginTop: 2,
                  }}
                >
                  {t('home.enableNotificationsMessage')}
                </Text>
              </View>
              <View style={{ gap: 8, alignItems: 'center' }}>
                <Pressable
                  onPress={async () => {
                    const granted = await requestNotificationPermission();
                    if (granted) {
                      recheckPermission();
                    } else {
                      Linking.openSettings();
                    }
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Enable notifications"
                  hitSlop={8}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: theme.radius.full,
                    backgroundColor: theme.colors.primary,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: theme.font.bodySemiBold,
                      fontSize: 12,
                      color: theme.colors.onPrimary,
                    }}
                  >
                    {t('common.enable')}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setBannerDismissed(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Dismiss notification banner"
                  hitSlop={8}
                >
                  <Ionicons name="close" size={18} color={theme.colors.textMuted} />
                </Pressable>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Today's activity — per cat */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontFamily: theme.font.bodySemiBold,
                fontSize: 18,
                color: theme.colors.text,
              }}
            >
              {t('home.todaysActivity')}
            </Text>
            {streak > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: theme.colors.ginger400 + '20',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: theme.radius.full,
                }}
              >
                <Text style={{ fontSize: 13 }}>{'\u{1F525}'}</Text>
                <Text
                  style={{
                    fontFamily: theme.font.bodySemiBold,
                    fontSize: 12,
                    color: theme.colors.ginger700,
                  }}
                >
                  {t('home.dayStreak', { count: streak })}
                </Text>
              </View>
            )}
          </View>

          {isLoading ? (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Skeleton width={200} height={160} borderRadius={theme.radius.xl} />
              <Skeleton width={200} height={160} borderRadius={theme.radius.xl} />
            </View>
          ) : cats && cats.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -theme.spacing.md }}
              contentContainerStyle={{
                gap: 12,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: 4,
              }}
            >
              {cats.map((cat, i) => {
                const gradients: [string, string, string][] = [
                  ['#F8C47A', '#EE8A35', '#A94F18'],
                  ['#7ABFA5', '#2F7D57', '#1B5E3B'],
                  ['#A8B4C0', '#6F7A86', '#4A535E'],
                  ['#D4A074', '#8A5A3C', '#5A3A2E'],
                ];
                return (
                  <CatActivityCard
                    key={cat.id}
                    cat={cat}
                    minutes={catSessionMinutes[cat.id] ?? 0}
                    calories={catCalories[cat.id] ?? 0}
                    sessions={catSessionCounts[cat.id] ?? 0}
                    colors={gradients[i % gradients.length]}
                    goal={DAILY_GOAL}
                    goalLabel={t('home.ofGoal', { goal: DAILY_GOAL })}
                    sessionsLabel={t('home.sessions')}
                  />
                );
              })}
            </ScrollView>
          ) : null}
        </Animated.View>

        {/* Insight carousel */}
        {insights.length > 0 && (
          <Animated.View entering={FadeInDown.delay(150).duration(500)}>
            <Text
              style={{
                fontFamily: theme.font.bodySemiBold,
                fontSize: 18,
                color: theme.colors.text,
                marginBottom: 8,
              }}
            >
              {t('home.insights')}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -theme.spacing.md }}
              contentContainerStyle={{
                gap: 12,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: 6,
              }}
            >
              {insights.map((card) => (
                <InsightCard key={card.id} card={card} />
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Cat cards */}
        {/* <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontFamily: theme.font.bodySemiBold,
                fontSize: 18,
                color: theme.colors.text,
              }}
            >
              {t('home.myCats')}
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/cats')}
              accessibilityRole="button"
              accessibilityLabel="View all cats"
            >
              <Text
                style={{
                  fontFamily: theme.font.bodyMedium,
                  fontSize: 14,
                  color: theme.colors.primary,
                }}
              >
                {t('home.seeAll')}
              </Text>
            </Pressable>
          </View>

          {isLoading ? (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Skeleton width={140} height={140} borderRadius={theme.radius.lg} />
              <Skeleton width={140} height={140} borderRadius={theme.radius.lg} />
            </View>
          ) : cats && cats.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -theme.spacing.md }}
              contentContainerStyle={{
                gap: 12,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: 6,
              }}
            >
              {cats.map((cat) => (
                <CatCard
                  key={cat.id}
                  cat={cat}
                  todayMinutes={catSessionMinutes[cat.id] ?? 0}
                  dailyGoal={DAILY_GOAL}
                  todayCalories={catCalories[cat.id]}
                  onPress={() => router.push('/(tabs)/cats')}
                />
              ))}
            </ScrollView>
          ) : (
            <Card>
              <Text
                style={{
                  fontFamily: theme.font.body,
                  fontSize: 14,
                  color: theme.colors.textMuted,
                  textAlign: 'center',
                  paddingVertical: 16,
                }}
              >
                {t('home.noCatsEmpty')} {'\u{1F431}'}
              </Text>
              <Button
                title={t('home.addACat')}
                onPress={() => router.push('/(tabs)/cats')}
                variant="secondary"
              />
            </Card>
          )}
        </Animated.View> */}

        {/* Recent sessions */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontFamily: theme.font.bodySemiBold,
                fontSize: 18,
                color: theme.colors.text,
              }}
            >
              {t('home.todaysSessions')}
            </Text>
            <Pressable
              onPress={() => router.push('/session/manual')}
              accessibilityRole="button"
              accessibilityLabel="Log a session manually"
              hitSlop={8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: theme.radius.full,
                backgroundColor: theme.colors.primary,
              }}
            >
              <Ionicons name="add" size={16} color={theme.colors.onPrimary} />
              <Text
                style={{
                  fontFamily: theme.font.bodySemiBold,
                  fontSize: 13,
                  color: theme.colors.onPrimary,
                }}
              >
                {t('common.add')}
              </Text>
            </Pressable>
          </View>

          {isLoading ? (
            <View style={{ gap: 8 }}>
              <Skeleton width="100%" height={72} borderRadius={theme.radius.md} />
              <Skeleton width="100%" height={72} borderRadius={theme.radius.md} />
            </View>
          ) : todaySessions && todaySessions.length > 0 ? (
            <View style={{ gap: 8 }}>
              {todaySessions.slice(0, 5).map((session, i) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  cat={cats?.find((c) => c.id === session.cat_id)}
                  index={i}
                />
              ))}
            </View>
          ) : (
            <Pressable
              onPress={() => router.push('/session/live')}
              accessibilityRole="button"
              accessibilityLabel="Start a play session"
              style={({ pressed }) => ({
                alignItems: 'center',
                paddingVertical: theme.spacing.lg,
                gap: 10,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Image
                source={require('@/assets/icons/paw.png')}
                style={{ width: 64, height: 64 }}
                contentFit="contain"
              />
              <Text
                style={{
                  fontFamily: theme.font.bodySemiBold,
                  fontSize: 15,
                  color: theme.colors.primary,
                }}
              >
                {t('home.startASession')}
              </Text>
              <Text
                style={{
                  fontFamily: theme.font.body,
                  fontSize: 13,
                  color: theme.colors.textMuted,
                  textAlign: 'center',
                }}
              >
                {t('home.timeToPlay')}
              </Text>
            </Pressable>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
