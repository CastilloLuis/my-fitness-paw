import React, { useState, useRef } from 'react';
import {
  TextInput,
  Text,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { theme } from '@/src/theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
  rightElement?: React.ReactNode;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function Input({
  label,
  error,
  containerStyle,
  rightElement,
  onFocus,
  onBlur,
  value,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const shakeX = useSharedValue(0);

  const hasValue = !!value && value.length > 0;
  const isActive = focused || hasValue;

  const labelSize = useSharedValue(isActive ? 12 : 16);
  const labelTop = useSharedValue(isActive ? 8 : 18);

  const labelAnimStyle = useAnimatedStyle(() => ({
    fontSize: labelSize.value,
    top: labelTop.value,
  }));

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const handleFocus = (e: any) => {
    setFocused(true);
    labelSize.value = withTiming(12, { duration: 200 });
    labelTop.value = withTiming(8, { duration: 200 });
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setFocused(false);
    if (!hasValue) {
      labelSize.value = withTiming(16, { duration: 200 });
      labelTop.value = withTiming(18, { duration: 200 });
    }
    onBlur?.(e);
  };

  React.useEffect(() => {
    if (error) {
      shakeX.value = withSequence(
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(-4, { duration: 50 }),
        withTiming(4, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [error, shakeX]);

  return (
    <AnimatedView
      style={[
        {
          borderWidth: 1.5,
          borderColor: error
            ? theme.colors.danger
            : focused
              ? theme.colors.primary
              : theme.colors.borderSubtle,
          borderRadius: theme.radius.md,
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: 10,
          backgroundColor: theme.colors.surfaceElevated,
          borderCurve: 'continuous',
        },
        shakeStyle,
        containerStyle,
      ]}
    >
      <Animated.Text
        style={[
          {
            position: 'absolute',
            left: 16,
            color: error
              ? theme.colors.danger
              : focused
                ? theme.colors.primary
                : theme.colors.textMuted,
            fontFamily: theme.font.body,
          },
          labelAnimStyle,
        ]}
      >
        {label}
      </Animated.Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 24 }}>
        <TextInput
          ref={inputRef}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={theme.colors.textMuted}
          selectionColor={theme.colors.primary}
          style={{
            flex: 1,
            fontFamily: theme.font.body,
            fontSize: 16,
            color: theme.colors.text,
            padding: 0,
            paddingRight: rightElement ? 32 : 0,
          }}
          {...props}
        />
      </View>
      {rightElement && (
        <View
          style={{
            position: 'absolute',
            right: 16,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
          }}
        >
          {rightElement}
        </View>
      )}
      {error && (
        <Text
          style={{
            fontFamily: theme.font.body,
            fontSize: 12,
            color: theme.colors.danger,
            marginTop: 4,
          }}
        >
          {error}
        </Text>
      )}
    </AnimatedView>
  );
}
