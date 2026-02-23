import type { Cat, PlaySession } from '@/src/supabase/types';
import { theme } from '@/src/theme';
import { getActivityType } from '@/src/utils/activity-types';
import { format } from 'date-fns';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

interface SessionCardProps {
  session: PlaySession;
  cat?: Cat;
  onDelete?: () => void;
  index?: number;
}

export function SessionCard({ session, cat, onDelete, index = 0 }: SessionCardProps) {
  const { t } = useTranslation();
  const activity = getActivityType(session.activity_type);
  const time = format(new Date(session.played_at), 'h:mm a');

  return (
    <Animated.View
      entering={FadeInLeft.delay(index * 80).duration(400)}
      style={{
        backgroundColor: theme.colors.surfaceElevated,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderCurve: 'continuous',
        boxShadow: theme.shadow.sm.boxShadow,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: (activity?.color ?? theme.colors.primary) + '18',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 22 }}>{activity?.emoji ?? '\u{1F3AE}'}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: theme.font.bodySemiBold,
            fontSize: 15,
            color: theme.colors.text,
          }}
        >
          {activity ? t(activity.label) : session.activity_type}
        </Text>
        <Text
          style={{
            fontFamily: theme.font.body,
            fontSize: 12,
            color: theme.colors.textMuted,
            marginTop: 2,
          }}
        >
          {cat?.name ? `${cat.emoji} ${cat.name} - ` : ''}
          {session.duration_minutes} min - {time}
        </Text>
        {session.notes && (
          <Text
            style={{
              fontFamily: theme.font.body,
              fontSize: 12,
              color: theme.colors.textMuted,
              marginTop: 4,
              fontStyle: 'italic',
            }}
            numberOfLines={1}
            selectable
          >
            {session.notes}
          </Text>
        )}
      </View>

      {onDelete && (
        <Pressable
          onPress={onDelete}
          accessibilityRole="button"
          accessibilityLabel="Delete session"
          hitSlop={12}
          style={{
            padding: 4,
          }}
        >
          <Text style={{ fontSize: 16, color: theme.colors.danger }}>
            {'\u2715'}
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}
