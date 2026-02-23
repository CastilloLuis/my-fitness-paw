import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { format, startOfWeek, addDays } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { theme } from '@/src/theme';
import type { PlaySession } from '@/src/supabase/types';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface WeeklyBarProps {
  sessions: PlaySession[];
}

const DAY_KEYS = ['weekly.dayMon', 'weekly.dayTue', 'weekly.dayWed', 'weekly.dayThu', 'weekly.dayFri', 'weekly.daySat', 'weekly.daySun'];
const BAR_WIDTH = 32;
const CHART_HEIGHT = 140;

function AnimatedBar({
  x,
  targetHeight,
  index,
}: {
  x: number;
  targetHeight: number;
  index: number;
}) {
  const height = useSharedValue(0);

  useEffect(() => {
    height.value = withTiming(targetHeight, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, [targetHeight, height]);

  const animatedProps = useAnimatedProps(() => ({
    height: height.value,
    y: CHART_HEIGHT - height.value,
  }));

  return (
    <AnimatedRect
      x={x}
      rx={6}
      ry={6}
      width={BAR_WIDTH}
      fill={theme.colors.primary}
      animatedProps={animatedProps}
    />
  );
}

export function WeeklyBar({ sessions }: WeeklyBarProps) {
  const { t } = useTranslation();
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  // Aggregate minutes per day
  const dailyMinutes = DAY_KEYS.map((_, i) => {
    const day = addDays(weekStart, i);
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    return sessions
      .filter((s) => {
        const d = new Date(s.played_at);
        return d >= dayStart && d <= dayEnd;
      })
      .reduce((sum, s) => sum + s.duration_minutes, 0);
  });

  const maxMinutes = Math.max(...dailyMinutes, 1);
  const totalWidth = DAY_KEYS.length * (BAR_WIDTH + 12) - 12;
  const today = new Date().getDay();
  // Convert to Mon=0 index
  const todayIndex = today === 0 ? 6 : today - 1;

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={totalWidth} height={CHART_HEIGHT}>
        {dailyMinutes.map((mins, i) => {
          const barHeight = (mins / maxMinutes) * (CHART_HEIGHT - 20);
          const x = i * (BAR_WIDTH + 12);
          return (
            <React.Fragment key={i}>
              {/* Background bar */}
              <Rect
                x={x}
                y={0}
                width={BAR_WIDTH}
                height={CHART_HEIGHT}
                rx={6}
                ry={6}
                fill={theme.colors.taupe200 + '50'}
              />
              {/* Animated fill */}
              {mins > 0 && (
                <AnimatedBar x={x} targetHeight={barHeight} index={i} />
              )}
            </React.Fragment>
          );
        })}
      </Svg>

      {/* Day labels */}
      <View
        style={{
          flexDirection: 'row',
          width: totalWidth,
          marginTop: 8,
        }}
      >
        {DAY_KEYS.map((key, i) => (
          <View
            key={key}
            style={{
              width: BAR_WIDTH + 12,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily:
                  i === todayIndex ? theme.font.bodySemiBold : theme.font.body,
                fontSize: 11,
                color:
                  i === todayIndex
                    ? theme.colors.primary
                    : theme.colors.textMuted,
              }}
            >
              {t(key)}
            </Text>
            <Text
              style={{
                fontFamily: theme.font.body,
                fontSize: 10,
                color: theme.colors.textMuted,
                fontVariant: ['tabular-nums'],
              }}
            >
              {dailyMinutes[i]}m
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
