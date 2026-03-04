import { FeedCard } from '@/src/components/feed/feed-card';
import { FeedSkeleton } from '@/src/components/feed/feed-skeleton';
import { CommentsSheet } from '@/src/components/feed/comments-sheet';
import { useFeed, useTogglePurr } from '@/src/hooks/use-feed';
import type { FeedPostWithDetails } from '@/src/supabase/types';
import { theme } from '@/src/theme';
import { Image } from 'expo-image';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BG_GRADIENT =
  'linear-gradient(165deg, #FBFAF7 0%, #F3EFE7 25%, #F2B36D22 50%, #E98A2A18 75%, #FBFAF7 100%)';
const GLOW_GRADIENT =
  'radial-gradient(circle, #F2B36D30 0%, #F2B36D00 70%)';

function FeedEmpty() {
  const { t } = useTranslation();

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
        paddingBottom: 40,
      }}
    >
      {/* Soft glow behind image */}
      <View
        style={{
          ...({ experimental_backgroundImage: GLOW_GRADIENT } as any),
          position: 'absolute',
          width: 280,
          height: 280,
          borderRadius: 140,
          top: 20,
        }}
      />

      <Animated.View entering={FadeInDown.delay(0).duration(500)}>
        <Image
          source={require('@/assets/icons/community-playing.png')}
          style={{ width: 200, height: 150, marginTop: 100 }}
          contentFit="contain"
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(500)}>
        <Text
          style={{
            fontFamily: theme.font.display,
            fontSize: 22,
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: 10,
          }}
        >
          {t('community.feedEmpty')}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(250).duration(500)}>
        <Text
          style={{
            fontFamily: theme.font.body,
            fontSize: 15,
            color: theme.colors.textMuted,
            textAlign: 'center',
            lineHeight: 22,
            maxWidth: 280,
          }}
        >
          {t('community.feedEmptyMessage')}
        </Text>
      </Animated.View>
    </View>
  );
}

export default function CommunityScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    data,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useFeed();

  if (__DEV__ && error) {
    console.error('[Feed]', error);
  }
  const { mutate: togglePurr } = useTogglePurr();

  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  const handlePurr = useCallback(
    (postId: string) => togglePurr(postId),
    [togglePurr]
  );

  const handleComment = useCallback((postId: string) => {
    setCommentsPostId(postId);
  }, []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: FeedPostWithDetails }) => (
      <FeedCard post={item} onPurr={handlePurr} onComment={handleComment} />
    ),
    [handlePurr, handleComment]
  );

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.bg,
          paddingTop: insets.top,
        }}
      >
        <View style={{ paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.sm }}>
          <Text
            style={{
              fontFamily: theme.font.display,
              fontSize: 28,
              color: theme.colors.text,
            }}
          >
            {t('community.title')}
          </Text>
        </View>
        <FeedSkeleton />
      </View>
    );
  }

  const isEmpty = posts.length === 0;

  return (
    <View
      style={{
        ...({ experimental_backgroundImage: isEmpty ? BG_GRADIENT : undefined } as any),
        flex: 1,
        backgroundColor: isEmpty ? undefined : theme.colors.bg,
        paddingTop: insets.top,
      }}
    >
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: theme.spacing.md,
          paddingBottom: insets.bottom + 120,
          gap: theme.spacing.md,
          ...(isEmpty && { flex: 1 }),
        }}
        ListHeaderComponent={
          <Text
            style={{
              fontFamily: theme.font.display,
              fontSize: 28,
              color: theme.colors.text,
              marginBottom: theme.spacing.xs,
            }}
          >
            {t('community.title')}
          </Text>
        }
        ListEmptyComponent={<FeedEmpty />}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator
              size="small"
              color={theme.colors.primary}
              style={{ paddingVertical: theme.spacing.md }}
            />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />

      {commentsPostId && (
        <CommentsSheet
          postId={commentsPostId}
          onClose={() => setCommentsPostId(null)}
        />
      )}
    </View>
  );
}
