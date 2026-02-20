import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { theme } from '@/src/theme';
import type { InsightCard as InsightCardType } from '@/src/lib/insights/generate-insights';

export function InsightCard({ card }: { card: InsightCardType }) {
  return (
    <View
      style={{
        width: 200,
        backgroundColor: theme.colors.surfaceElevated,
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
        paddingVertical: 12,
        paddingHorizontal: 14,
        gap: 4,
        borderWidth: 1.5,
        borderTopColor: '#F5A035',
        borderRightColor: '#EE7E2E',
        borderBottomColor: '#D96825',
        borderLeftColor: '#F08A35',
        boxShadow: theme.shadow.md.boxShadow,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={{ fontSize: 22 }}>{card.emoji}</Text>
        <Text
          style={{
            fontFamily: theme.font.bodySemiBold,
            fontSize: 14,
            color: theme.colors.text,
            flex: 1,
          }}
          numberOfLines={1}
        >
          {card.headline}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: theme.font.body,
          fontSize: 12,
          color: theme.colors.textMuted,
          lineHeight: 17,
        }}
        numberOfLines={2}
      >
        {card.metric}
      </Text>
      {card.cta && (
        <Pressable
          onPress={() => router.push(card.cta!.route as any)}
          accessibilityRole="button"
          accessibilityLabel={card.cta.label}
        >
          <Text
            style={{
              fontFamily: theme.font.bodySemiBold,
              fontSize: 12,
              color: theme.colors.primary,
              marginTop: 2,
            }}
          >
            {card.cta.label} {'\u2192'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
