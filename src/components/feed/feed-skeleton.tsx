import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@/src/components/ui/skeleton';
import { theme } from '@/src/theme';

function SkeletonCard() {
  return (
    <View
      style={{
        backgroundColor: theme.colors.surfaceElevated,
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
        boxShadow: theme.shadow.md.boxShadow,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 12,
        }}
      >
        <Skeleton width={36} height={36} borderRadius={18} />
        <View style={{ flex: 1, gap: 6 }}>
          <Skeleton width={120} height={14} />
          <Skeleton width={80} height={10} />
        </View>
      </View>

      {/* Hero banner */}
      <View style={{ marginHorizontal: 16 }}>
        <Skeleton
          width="100%"
          height={120}
          borderRadius={theme.radius.sm}
        />
      </View>

      {/* Activity info */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, gap: 6 }}>
        <Skeleton width={140} height={16} />
        <Skeleton width={80} height={13} />
      </View>

      {/* Divider + purr */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: theme.colors.borderSubtle,
          marginTop: 12,
          marginHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 14,
        }}
      >
        <Skeleton width={56} height={28} borderRadius={14} />
      </View>
    </View>
  );
}

export function FeedSkeleton() {
  return (
    <View style={{ gap: theme.spacing.md, padding: theme.spacing.md }}>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );
}
