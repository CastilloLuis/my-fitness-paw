import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Avatar } from '@/src/components/ui/avatar';
import { theme } from '@/src/theme';
import type { Cat } from '@/src/supabase/types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CatCardProps {
  cat: Cat;
  todayMinutes?: number;
  dailyGoal?: number;
  todayCalories?: number;
  streak?: number;
  onPress?: () => void;
}

export function CatCard({
  cat,
  todayMinutes = 0,
  dailyGoal = 30,
  todayCalories,
  onPress,
}: CatCardProps) {
  const scale = useSharedValue(1);

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const progress = Math.min(todayMinutes / dailyGoal, 1);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
      accessibilityRole="button"
      accessibilityLabel={`${cat.name} - ${todayMinutes} minutes today`}
      style={[
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderRadius: theme.radius.lg,
          padding: 12,
          width: 140,
          borderCurve: 'continuous',
          boxShadow: theme.shadow.md.boxShadow,
        },
        cardAnimStyle,
      ]}
    >
      <View style={{ alignItems: 'center', gap: 6 }}>
        <Avatar emoji={cat.emoji} imageBase64={cat.image_base64} size={44} />
        <Text
          style={{
            fontFamily: theme.font.bodySemiBold,
            fontSize: 14,
            color: theme.colors.text,
          }}
          numberOfLines={1}
        >
          {cat.name}
        </Text>

        {/* Mini progress bar */}
        <View
          style={{
            width: '100%',
            height: 5,
            backgroundColor: theme.colors.taupe200,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: `${progress * 100}%`,
              height: '100%',
              backgroundColor: theme.colors.primary,
              borderRadius: 3,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Text
            style={{
              fontFamily: theme.font.body,
              fontSize: 11,
              color: theme.colors.textMuted,
              fontVariant: ['tabular-nums'],
            }}
          >
            {todayMinutes}/{dailyGoal} min
          </Text>
          {todayCalories != null && todayCalories > 0 && (
            <Text
              style={{
                fontFamily: theme.font.bodySemiBold,
                fontSize: 10,
                color: theme.colors.ginger700,
                fontVariant: ['tabular-nums'],
              }}
            >
              {todayCalories} cal
            </Text>
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
}
