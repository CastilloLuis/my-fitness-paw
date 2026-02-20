import React from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import { theme } from '@/src/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  style?: ViewStyle;
}

export function Header({ title, subtitle, right, style }: HeaderProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: theme.spacing.md,
        },
        style,
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: theme.font.display,
            fontSize: 28,
            color: theme.colors.text,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              fontFamily: theme.font.body,
              fontSize: 15,
              color: theme.colors.textMuted,
              marginTop: 2,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {right}
    </View>
  );
}
