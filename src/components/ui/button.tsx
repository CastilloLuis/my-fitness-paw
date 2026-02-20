import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme } from '@/src/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
  primary: {
    container: {
      backgroundColor: theme.colors.primary,
    },
    text: {
      color: theme.colors.onPrimary,
    },
  },
  secondary: {
    container: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
    },
    text: {
      color: theme.colors.text,
    },
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
    },
    text: {
      color: theme.colors.primary,
    },
  },
  danger: {
    container: {
      backgroundColor: theme.colors.danger,
    },
    text: {
      color: theme.colors.white,
    },
  },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const styles = variantStyles[variant];

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: theme.radius.md,
          gap: 8,
          opacity: disabled ? 0.5 : 1,
          borderCurve: 'continuous',
        },
        styles.container,
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={styles.text.color as string}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              {
                fontFamily: theme.font.bodySemiBold,
                fontSize: 16,
                textAlign: 'center',
              },
              styles.text,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}
