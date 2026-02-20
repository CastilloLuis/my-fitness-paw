import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '@/src/theme';

interface StatRowProps {
  label: string;
  value: string | number;
  icon?: string;
}

export function StatRow({ label, value, icon }: StatRowProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderSubtle,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {icon && <Text style={{ fontSize: 18 }}>{icon}</Text>}
        <Text
          style={{
            fontFamily: theme.font.body,
            fontSize: 15,
            color: theme.colors.textSecondary,
          }}
        >
          {label}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: theme.font.bodySemiBold,
          fontSize: 16,
          color: theme.colors.text,
          fontVariant: ['tabular-nums'],
        }}
        selectable
      >
        {value}
      </Text>
    </View>
  );
}
