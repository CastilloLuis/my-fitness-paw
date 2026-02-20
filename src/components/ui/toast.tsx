import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/src/theme';

interface ToastProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({
  message,
  type = 'error',
  visible,
  onDismiss,
  duration = 3000,
}: ToastProps) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-100);

  const bgColor =
    type === 'error'
      ? theme.colors.danger
      : type === 'success'
        ? theme.colors.success
        : theme.colors.info;

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 300 });
      translateY.value = withDelay(
        duration,
        withTiming(-100, { duration: 300 }, () => {
          runOnJS(onDismiss)();
        })
      );
    } else {
      translateY.value = withTiming(-100, { duration: 300 });
    }
  }, [visible, translateY, duration, onDismiss]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: insets.top,
          left: theme.spacing.md,
          right: theme.spacing.md,
          backgroundColor: bgColor,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: 12,
          borderRadius: theme.radius.md,
          zIndex: 9999,
          borderCurve: 'continuous',
          boxShadow: theme.shadow.md.boxShadow,
        },
        animatedStyle,
      ]}
    >
      <Text
        style={{
          fontFamily: theme.font.bodyMedium,
          fontSize: 14,
          color: theme.colors.white,
          textAlign: 'center',
        }}
        selectable
      >
        {message}
      </Text>
    </Animated.View>
  );
}
