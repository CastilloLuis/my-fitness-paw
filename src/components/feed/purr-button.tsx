import React, { useCallback } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme } from '@/src/theme';

interface PurrButtonProps {
  purrCount: number;
  hasPurred: boolean;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PurrButton({ purrCount, hasPurred, onPress }: PurrButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    scale.value = withSequence(
      withTiming(1.15, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }, [onPress, scale]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={`Purr, ${purrCount}`}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: 4,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: theme.radius.full,
          backgroundColor: hasPurred
            ? theme.colors.ginger400 + '20'
            : 'transparent',
        },
        animatedStyle,
      ]}
    >
      <Text style={{ fontSize: 16 }}>🐾</Text>
      <Text
        style={{
          fontFamily: theme.font.bodySemiBold,
          fontSize: 13,
          color: hasPurred ? theme.colors.ginger600 : theme.colors.textMuted,
        }}
      >
        {purrCount}
      </Text>
    </AnimatedPressable>
  );
}
