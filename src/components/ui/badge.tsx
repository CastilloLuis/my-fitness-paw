import React from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import { theme } from '@/src/theme';

interface BadgeProps {
  label: string;
  color?: string;
  textColor?: string;
  icon?: string;
  style?: ViewStyle;
}

export function Badge({
  label,
  color = theme.colors.primaryLight,
  textColor = theme.colors.text,
  icon,
  style,
}: BadgeProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: color,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: theme.radius.full,
          gap: 4,
          borderCurve: 'continuous',
        },
        style,
      ]}
    >
      {icon && <Text style={{ fontSize: 12 }}>{icon}</Text>}
      <Text
        style={{
          fontFamily: theme.font.bodySemiBold,
          fontSize: 12,
          color: textColor,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
