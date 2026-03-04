import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeIn } from 'react-native-reanimated';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { theme } from '@/src/theme';
import { getActivityType } from '@/src/utils/activity-types';
import { PurrButton } from './purr-button';
import type { FeedPostWithDetails } from '@/src/supabase/types';

interface FeedCardProps {
  post: FeedPostWithDetails;
  onPurr: (postId: string) => void;
  onComment: (postId: string) => void;
}

export function FeedCard({ post, onPurr, onComment }: FeedCardProps) {
  const { t } = useTranslation();
  const activity = getActivityType(post.activity_type);
  const activityColor = activity?.color ?? theme.colors.primary;
  const timeAgo = formatDistanceToNow(new Date(post.played_at), {
    addSuffix: true,
  });

  const hasCatImage = !!post.cat_image_base64;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={{
        backgroundColor: theme.colors.surfaceElevated,
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
        boxShadow: theme.shadow.md.boxShadow,
        overflow: 'hidden',
      }}
    >
      {/* Header: cat emoji + owner + time */}
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
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: theme.colors.cream200,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 18 }}>{post.cat_emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: theme.font.bodySemiBold,
              fontSize: 14,
              color: theme.colors.text,
            }}
            numberOfLines={1}
          >
            {post.owner_name ?? t('community.anonymous')}
          </Text>
          <Text
            style={{
              fontFamily: theme.font.body,
              fontSize: 12,
              color: theme.colors.textMuted,
            }}
          >
            {t('community.with')} {post.cat_name} · {timeAgo}
          </Text>
        </View>
      </View>

      {/* Hero banner */}
      <View
        style={{
          height: 120,
          marginHorizontal: 16,
          borderRadius: theme.radius.sm,
          borderCurve: 'continuous',
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {hasCatImage ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${post.cat_image_base64}` }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: activityColor + '18',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={
                activity?.icon ??
                require('@/assets/icons/exercises/free-play.png')
              }
              style={{ width: 48, height: 48, opacity: 0.7 }}
              contentFit="contain"
            />
          </View>
        )}
      </View>

      {/* Activity info */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, gap: 2 }}>
        <Text
          style={{
            fontFamily: theme.font.bodySemiBold,
            fontSize: 16,
            color: theme.colors.text,
          }}
        >
          {activity ? t(activity.label) : post.activity_type}
        </Text>
        <Text
          style={{
            fontFamily: theme.font.body,
            fontSize: 13,
            color: theme.colors.textMuted,
          }}
        >
          {post.duration_minutes} {t('community.minSession')}
        </Text>
      </View>

      {/* Notes */}
      {post.notes ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Text
            style={{
              fontFamily: theme.font.body,
              fontSize: 13,
              color: theme.colors.textSecondary,
              fontStyle: 'italic',
              lineHeight: 19,
            }}
            numberOfLines={2}
          >
            "{post.notes}"
          </Text>
        </View>
      ) : null}

      {/* Divider + action row */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: theme.colors.borderSubtle,
          marginTop: 12,
          marginHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <PurrButton
          purrCount={post.purr_count}
          hasPurred={post.has_purred}
          onPress={() => onPurr(post.id)}
        />
        <Pressable
          onPress={() => onComment(post.id)}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={t('community.comments')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 10,
            paddingVertical: 6,
          }}
        >
          <Text style={{ fontSize: 15 }}>{'\uD83D\uDCAC'}</Text>
          <Text
            style={{
              fontFamily: theme.font.bodySemiBold,
              fontSize: 13,
              color: theme.colors.textMuted,
            }}
          >
            {post.comment_count}
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
