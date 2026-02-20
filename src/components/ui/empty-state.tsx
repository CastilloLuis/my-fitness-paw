import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '@/src/theme';
import { Button } from './button';

interface EmptyStateProps {
  emoji: string;
  title: string;
  message: string;
  actionTitle?: string;
  onAction?: () => void;
}

export function EmptyState({ emoji, title, message, actionTitle, onAction }: EmptyStateProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.xxl,
        gap: theme.spacing.sm,
      }}
    >
      <Text style={{ fontSize: 48 }}>{emoji}</Text>
      <Text
        style={{
          fontFamily: theme.font.display,
          fontSize: 20,
          color: theme.colors.text,
          textAlign: 'center',
          marginTop: theme.spacing.sm,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontFamily: theme.font.body,
          fontSize: 15,
          color: theme.colors.textMuted,
          textAlign: 'center',
          lineHeight: 22,
        }}
      >
        {message}
      </Text>
      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="primary"
          style={{ marginTop: theme.spacing.md }}
        />
      )}
    </View>
  );
}
