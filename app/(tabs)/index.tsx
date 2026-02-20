import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import { CatCard } from '@/src/components/cats/cat-card';
import { InsightCard } from '@/src/components/insights/insight-card';
import { SessionCard } from '@/src/components/sessions/session-card';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { EmptyState } from '@/src/components/ui/empty-state';
import { ProgressRing } from '@/src/components/ui/progress-ring';
import { Skeleton } from '@/src/components/ui/skeleton';
import { useCats } from '@/src/hooks/use-cats';
import { useProfile } from '@/src/hooks/use-profile';
import { useSessions, useTodaySessions } from '@/src/hooks/use-sessions';
import { useStreak } from '@/src/hooks/use-streak';
import { generateInsights } from '@/src/lib/insights/generate-insights';
import { calculateDailyCalories } from '@/src/lib/cat-fitness';
import { theme } from '@/src/theme';

const DAILY_GOAL = 30;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
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

  const streak = useStreak(todaySessions);
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
              alignItems: 'flex-start',
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: theme.font.display,
                  fontSize: 26,
                  color: theme.colors.text,
                }}
              >
                {getGreeting()}! {'\u{1F43E}'}
              </Text>
              <Text
                style={{
                  fontFamily: theme.font.body,
                  fontSize: 15,
                  color: theme.colors.textMuted,
                  marginTop: 4,
                }}
              >
                {displayName}
              </Text>
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

        {/* Today's summary */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Card elevated>
            <View style={{ alignItems: 'center', gap: 10 }}>
              <Text
                style={{
                  fontFamily: theme.font.bodyMedium,
                  fontSize: 13,
                  color: theme.colors.textMuted,
                }}
              >
                Today's Activity
              </Text>
              {isLoading ? (
                <Skeleton width={110} height={110} borderRadius={55} />
              ) : (
                <ProgressRing
                  progress={totalMinutesToday / DAILY_GOAL}
                  size={110}
                  strokeWidth={9}
                  label={`${totalMinutesToday}`}
                  sublabel={`of ${DAILY_GOAL} min`}
                />
              )}
              {streak > 0 && (
                <Text
                  style={{
                    fontFamily: theme.font.bodySemiBold,
                    fontSize: 13,
                    color: theme.colors.ginger700,
                  }}
                >
                  {'\u{1F525}'} {streak} day streak!
                </Text>
              )}
            </View>
          </Card>
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
              Insights
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
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
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
              Your Cats
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
                See all
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
                No cats yet — add your first furry friend! {'\u{1F431}'}
              </Text>
              <Button
                title="Add a Cat"
                onPress={() => router.push('/(tabs)/cats')}
                variant="secondary"
              />
            </Card>
          )}
        </Animated.View>

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
              Today's Sessions
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
                Add
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
                Start a session
              </Text>
              <Text
                style={{
                  fontFamily: theme.font.body,
                  fontSize: 13,
                  color: theme.colors.textMuted,
                  textAlign: 'center',
                }}
              >
                Time to play! Tap the paw to begin.
              </Text>
            </Pressable>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
