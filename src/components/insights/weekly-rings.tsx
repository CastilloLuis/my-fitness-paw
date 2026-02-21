import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { startOfWeek, addDays } from 'date-fns';

import { Card } from '@/src/components/ui/card';
import { ProgressRing } from '@/src/components/ui/progress-ring';
import type { PlaySession } from '@/src/supabase/types';
import { theme } from '@/src/theme';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const RING_SIZE = 44;
const RING_STROKE = 5;

interface WeeklyRingsProps {
  sessions: PlaySession[];
  targetMinutes: number;
  streak: number;
}

export function WeeklyRings({ sessions, targetMinutes, streak }: WeeklyRingsProps) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const now = new Date();
  const todayDow = now.getDay();
  const todayIndex = todayDow === 0 ? 6 : todayDow - 1;

  // Aggregate minutes + session count per day
  const dailyData = DAY_LABELS.map((_, i) => {
    const day = addDays(weekStart, i);
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    const daySessions = sessions.filter((s) => {
      const d = new Date(s.played_at);
      return d >= dayStart && d <= dayEnd;
    });

    const minutes = daySessions.reduce((sum, s) => sum + s.duration_minutes, 0);
    return { minutes, count: daySessions.length };
  });

  const weekMinutes = dailyData.reduce((sum, d) => sum + d.minutes, 0);
  const weekSessions = dailyData.reduce((sum, d) => sum + d.count, 0);

  return (
    <Animated.View entering={FadeInDown.delay(150).duration(400)}>
      <Card elevated style={{ gap: 16 }}>
        {/* Ring row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {DAY_LABELS.map((label, i) => {
            const { minutes } = dailyData[i];
            const progress = targetMinutes > 0 ? Math.min(minutes / targetMinutes, 1) : 0;
            const isToday = i === todayIndex;
            const ringColor =
              progress >= 1
                ? theme.colors.success
                : progress > 0
                  ? theme.colors.primary
                  : theme.colors.taupe200;

            return (
              <View key={i} style={{ alignItems: 'center', gap: 4 }}>
                <Text
                  style={{
                    fontFamily: isToday ? theme.font.bodySemiBold : theme.font.body,
                    fontSize: 11,
                    color: isToday ? theme.colors.primary : theme.colors.textMuted,
                  }}
                >
                  {label}
                </Text>
                <ProgressRing
                  progress={progress}
                  size={RING_SIZE}
                  strokeWidth={RING_STROKE}
                  color={ringColor}
                  bgColor={theme.colors.taupe200 + '50'}
                />
                <Text
                  style={{
                    fontFamily: theme.font.body,
                    fontSize: 10,
                    color: isToday ? theme.colors.primary : theme.colors.textMuted,
                    fontVariant: ['tabular-nums'],
                  }}
                >
                  {minutes > 0 ? `${minutes}m` : '\u2014'}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Summary row */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            borderTopWidth: 1,
            borderTopColor: theme.colors.borderSubtle,
            paddingTop: 12,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: theme.font.bodySemiBold,
                fontSize: 18,
                color: theme.colors.text,
                fontVariant: ['tabular-nums'],
              }}
            >
              {weekMinutes}
            </Text>
            <Text style={{ fontFamily: theme.font.body, fontSize: 12, color: theme.colors.textMuted }}>
              min this week
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: theme.colors.borderSubtle }} />
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: theme.font.bodySemiBold,
                fontSize: 18,
                color: theme.colors.text,
                fontVariant: ['tabular-nums'],
              }}
            >
              {weekSessions}
            </Text>
            <Text style={{ fontFamily: theme.font.body, fontSize: 12, color: theme.colors.textMuted }}>
              sessions
            </Text>
          </View>
          {streak > 0 && (
            <>
              <View style={{ width: 1, backgroundColor: theme.colors.borderSubtle }} />
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    fontFamily: theme.font.bodySemiBold,
                    fontSize: 18,
                    color: theme.colors.text,
                    fontVariant: ['tabular-nums'],
                  }}
                >
                  {streak}
                </Text>
                <Text style={{ fontFamily: theme.font.body, fontSize: 12, color: theme.colors.textMuted }}>
                  day streak
                </Text>
              </View>
            </>
          )}
        </View>
      </Card>
    </Animated.View>
  );
}
