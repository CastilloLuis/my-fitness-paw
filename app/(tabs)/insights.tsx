import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { StatRow } from '@/src/components/insights/stat-row';
import { WeeklyBar } from '@/src/components/insights/weekly-bar';
import { Avatar } from '@/src/components/ui/avatar';
import { Card } from '@/src/components/ui/card';
import { EmptyState } from '@/src/components/ui/empty-state';
import { Skeleton } from '@/src/components/ui/skeleton';
import { useCats } from '@/src/hooks/use-cats';
import { useWeeklySessions } from '@/src/hooks/use-sessions';
import { theme } from '@/src/theme';
import { ACTIVITY_TYPES } from '@/src/utils/activity-types';

export default function InsightsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: cats } = useCats();
  const { data: sessions, isLoading } = useWeeklySessions();

  const stats = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return { totalSessions: 0, totalMinutes: 0, avgDuration: 0, favoriteActivity: null };
    }

    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce((s, sess) => s + sess.duration_minutes, 0);
    const avgDuration = Math.round(totalMinutes / totalSessions);

    // Favorite activity
    const activityCounts: Record<string, number> = {};
    for (const s of sessions) {
      activityCounts[s.activity_type] = (activityCounts[s.activity_type] ?? 0) + 1;
    }
    const favoriteId = Object.entries(activityCounts).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0];
    const favoriteActivity = ACTIVITY_TYPES.find((a) => a.id === favoriteId) ?? null;

    return { totalSessions, totalMinutes, avgDuration, favoriteActivity };
  }, [sessions]);

  // Per-cat breakdown
  const catBreakdown = useMemo(() => {
    if (!sessions || !cats) return [];
    const map: Record<string, { sessions: number; minutes: number }> = {};
    for (const s of sessions) {
      if (!map[s.cat_id]) map[s.cat_id] = { sessions: 0, minutes: 0 };
      map[s.cat_id].sessions++;
      map[s.cat_id].minutes += s.duration_minutes;
    }
    return cats
      .map((cat) => ({
        cat,
        sessions: map[cat.id]?.sessions ?? 0,
        minutes: map[cat.id]?.minutes ?? 0,
      }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [sessions, cats]);

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
        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <Text
            style={{
              fontFamily: theme.font.display,
              fontSize: 26,
              color: theme.colors.text,
            }}
          >
            {t('insights.title')}
          </Text>
        </Animated.View>

        {isLoading ? (
          <View style={{ gap: 16 }}>
            <Skeleton width="100%" height={200} borderRadius={theme.radius.lg} />
            <Skeleton width="100%" height={160} borderRadius={theme.radius.lg} />
          </View>
        ) : !sessions || sessions.length === 0 ? (
          <EmptyState
            emoji={'\u{1F4C8}'}
            title={t('insights.noDataYet')}
            message={t('insights.noDataMessage')}
          />
        ) : (
          <>
            {/* Weekly chart */}
            <Animated.View entering={FadeInDown.delay(100).duration(400)}>
              <Card elevated style={{ alignItems: 'center', paddingVertical: 20 }}>
                <Text
                  style={{
                    fontFamily: theme.font.bodySemiBold,
                    fontSize: 16,
                    color: theme.colors.text,
                    marginBottom: 16,
                  }}
                >
                  {t('insights.thisWeek')}
                </Text>
                <WeeklyBar sessions={sessions} />
              </Card>
            </Animated.View>

            {/* Stats */}
            <Animated.View entering={FadeInDown.delay(200).duration(400)}>
              <Card elevated>
                <Text
                  style={{
                    fontFamily: theme.font.bodySemiBold,
                    fontSize: 16,
                    color: theme.colors.text,
                    marginBottom: 8,
                  }}
                >
                  {t('insights.weeklyStats')}
                </Text>
                <StatRow
                  label={t('insights.totalSessions')}
                  value={stats.totalSessions}
                  icon={'\u{1F3AF}'}
                />
                <StatRow
                  label={t('insights.totalMinutes')}
                  value={`${stats.totalMinutes} min`}
                  icon={'\u{23F1}\uFE0F'}
                />
                <StatRow
                  label={t('insights.avgDuration')}
                  value={`${stats.avgDuration} min`}
                  icon={'\u{1F4C9}'}
                />
                {stats.favoriteActivity && (
                  <StatRow
                    label={t('insights.favoriteActivity')}
                    value={`${stats.favoriteActivity.emoji} ${t(stats.favoriteActivity.label)}`}
                    icon={'\u{2B50}'}
                  />
                )}
              </Card>
            </Animated.View>

            {/* Per-cat breakdown */}
            {catBreakdown.length > 0 && (
              <Animated.View entering={FadeInDown.delay(300).duration(400)}>
                <Text
                  style={{
                    fontFamily: theme.font.bodySemiBold,
                    fontSize: 16,
                    color: theme.colors.text,
                    marginBottom: 8,
                  }}
                >
                  {t('insights.perCat')}
                </Text>
                <View style={{ gap: 8 }}>
                  {catBreakdown.map(({ cat, sessions: count, minutes }) => (
                    <Card key={cat.id}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 12,
                        }}
                      >
                        <Avatar emoji={cat.emoji} size={40} />
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontFamily: theme.font.bodySemiBold,
                              fontSize: 15,
                              color: theme.colors.text,
                            }}
                          >
                            {cat.name}
                          </Text>
                          <Text
                            style={{
                              fontFamily: theme.font.body,
                              fontSize: 12,
                              color: theme.colors.textMuted,
                              fontVariant: ['tabular-nums'],
                            }}
                          >
                            {t('insights.sessionsMinutes', { count, minutes })}
                          </Text>
                        </View>
                      </View>
                    </Card>
                  ))}
                </View>
              </Animated.View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
