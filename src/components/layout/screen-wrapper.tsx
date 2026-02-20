import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/src/theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
}

export function ScreenWrapper({ children, style, padded = true }: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: theme.colors.bg,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingHorizontal: padded ? theme.spacing.md : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
