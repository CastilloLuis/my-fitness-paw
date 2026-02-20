import React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { theme } from '@/src/theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  elevated?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Card({ children, onPress, style, elevated = false }: CardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const Wrapper = onPress ? AnimatedPressable : View;
  const wrapperProps = onPress
    ? {
        onPress,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        style: [
          {
            backgroundColor: elevated
              ? theme.colors.surfaceElevated
              : theme.colors.surface,
            borderRadius: theme.radius.lg,
            padding: theme.spacing.md,
            borderCurve: 'continuous' as const,
            boxShadow: elevated ? theme.shadow.md.boxShadow : theme.shadow.sm.boxShadow,
          },
          animatedStyle,
          style,
        ],
      }
    : {
        style: [
          {
            backgroundColor: elevated
              ? theme.colors.surfaceElevated
              : theme.colors.surface,
            borderRadius: theme.radius.lg,
            padding: theme.spacing.md,
            borderCurve: 'continuous' as const,
            boxShadow: elevated ? theme.shadow.md.boxShadow : theme.shadow.sm.boxShadow,
          },
          style,
        ],
      };

  return <Wrapper {...(wrapperProps as any)}>{children}</Wrapper>;
}
