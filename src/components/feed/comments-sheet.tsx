import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatDistanceToNow } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { theme } from '@/src/theme';
import { useComments, useAddComment } from '@/src/hooks/use-feed';
import { useAuth } from '@/src/hooks/use-auth';
import { useProfile } from '@/src/hooks/use-profile';
import type { CommentWithProfile } from '@/src/supabase/types';

interface CommentsSheetProps {
  postId: string;
  onClose: () => void;
}

const REPLY_THRESHOLD = 50;

function SwipeableComment({
  comment,
  isReply,
  onReply,
}: {
  comment: CommentWithProfile;
  isReply?: boolean;
  onReply: (commentId: string, name: string) => void;
}) {
  const { t } = useTranslation();
  const translateX = useSharedValue(0);
  const triggered = useSharedValue(false);

  const fireReply = useCallback(() => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onReply(comment.id, comment.display_name ?? t('community.anonymous'));
  }, [comment.id, comment.display_name, onReply, t]);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX(-15)
        .failOffsetY([-10, 10])
        .onUpdate((e) => {
          // Only allow left swipe, clamp between -threshold-10 and 0
          translateX.value = Math.min(0, Math.max(e.translationX, -REPLY_THRESHOLD - 10));
          if (translateX.value <= -REPLY_THRESHOLD && !triggered.value) {
            triggered.value = true;
            runOnJS(fireReply)();
          }
        })
        .onEnd(() => {
          translateX.value = withTiming(0, { duration: 200 });
          triggered.value = false;
        }),
    [fireReply, translateX, triggered]
  );

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const iconStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      -translateX.value,
      [0, REPLY_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity: progress,
      transform: [{ scale: 0.5 + progress * 0.5 }],
    };
  });

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
  });

  return (
    <View style={{ paddingLeft: isReply ? 40 : 0, overflow: 'hidden' }}>
      {/* Reply icon — revealed on the right side behind the row */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            right: 12,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          },
          iconStyle,
        ]}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: theme.colors.primary + '15',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="arrow-undo" size={16} color={theme.colors.primary} />
        </View>
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            {
              paddingVertical: 10,
              backgroundColor: theme.colors.bg,
            },
            animStyle,
          ]}
        >
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View
              style={{
                width: isReply ? 28 : 32,
                height: isReply ? 28 : 32,
                borderRadius: isReply ? 14 : 16,
                backgroundColor: theme.colors.cream200,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: isReply ? 13 : 15 }}>
                {'\uD83D\uDE3A'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text
                  style={{
                    fontFamily: theme.font.bodySemiBold,
                    fontSize: 13,
                    color: theme.colors.text,
                  }}
                  numberOfLines={1}
                >
                  {comment.display_name ?? t('community.anonymous')}
                </Text>
                <Text
                  style={{
                    fontFamily: theme.font.body,
                    fontSize: 11,
                    color: theme.colors.textMuted,
                  }}
                >
                  {timeAgo}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: theme.font.body,
                  fontSize: 14,
                  color: theme.colors.text,
                  lineHeight: 20,
                  marginTop: 2,
                }}
              >
                {comment.text}
              </Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

function ReplyComment({ comment }: { comment: CommentWithProfile }) {
  const { t } = useTranslation();
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
  });

  return (
    <View style={{ paddingLeft: 40, paddingVertical: 10 }}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: theme.colors.cream200,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 13 }}>{'\uD83D\uDE3A'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text
              style={{
                fontFamily: theme.font.bodySemiBold,
                fontSize: 13,
                color: theme.colors.text,
              }}
              numberOfLines={1}
            >
              {comment.display_name ?? t('community.anonymous')}
            </Text>
            <Text
              style={{
                fontFamily: theme.font.body,
                fontSize: 11,
                color: theme.colors.textMuted,
              }}
            >
              {timeAgo}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: theme.font.body,
              fontSize: 14,
              color: theme.colors.text,
              lineHeight: 20,
              marginTop: 2,
            }}
          >
            {comment.text}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function CommentsSheet({ postId, onClose }: CommentsSheetProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { userId } = useAuth();
  const { data: profile } = useProfile();
  const { data: comments, isLoading } = useComments(postId);
  const addCommentMutation = useAddComment();
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [localComments, setLocalComments] = useState<CommentWithProfile[]>([]);
  const inputRef = useRef<TextInput>(null);
  const listRef = useRef<FlatList>(null);

  const handleReply = useCallback((commentId: string, name: string) => {
    setReplyTo({ id: commentId, name });
    inputRef.current?.focus();
  }, []);

  const handleSend = useCallback(() => {
    if (!text.trim() || !postId) return;
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const trimmed = text.trim();
    const parentId = replyTo?.id ?? null;

    // Add locally immediately
    const optimistic: CommentWithProfile = {
      id: `local-${Date.now()}`,
      post_id: postId,
      user_id: userId ?? '',
      parent_id: parentId,
      text: trimmed,
      created_at: new Date().toISOString(),
      display_name: profile?.display_name ?? null,
    };
    setLocalComments((prev) => [...prev, optimistic]);

    // Fire mutation (will bump count on feed card)
    addCommentMutation.mutate({ postId, text: trimmed, parentId });

    setText('');
    setReplyTo(null);

    // Scroll to bottom after a tick
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [text, postId, replyTo, userId, profile, addCommentMutation]);

  // Merge server + local comments, dedup by checking if server has caught up
  const allComments = useMemo(() => {
    const server = comments ?? [];
    const serverIds = new Set(server.map((c) => c.id));
    // Keep local comments that haven't appeared in server data yet
    // Match by text + user_id + parent_id as a heuristic
    const pending = localComments.filter((lc) => {
      if (serverIds.has(lc.id)) return false;
      // Check if server has a matching comment (same text, user, parent)
      return !server.some(
        (sc) =>
          sc.text === lc.text &&
          sc.user_id === lc.user_id &&
          sc.parent_id === lc.parent_id
      );
    });
    return [...server, ...pending];
  }, [comments, localComments]);

  // Organize: top-level + replies grouped under parents
  const topLevel = allComments.filter((c) => !c.parent_id);
  const repliesMap = useMemo(() => {
    const map = new Map<string, CommentWithProfile[]>();
    for (const c of allComments) {
      if (c.parent_id) {
        const arr = map.get(c.parent_id) ?? [];
        arr.push(c);
        map.set(c.parent_id, arr);
      }
    }
    return map;
  }, [allComments]);

  const renderComment = useCallback(
    ({ item }: { item: CommentWithProfile }) => {
      const replies = repliesMap.get(item.id) ?? [];
      return (
        <View>
          <SwipeableComment comment={item} onReply={handleReply} />
          {replies.map((reply) => (
            <ReplyComment key={reply.id} comment={reply} />
          ))}
        </View>
      );
    },
    [repliesMap, handleReply]
  );

  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, backgroundColor: theme.colors.bg }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingTop: insets.top + 8,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.borderSubtle,
          }}
        >
          <Text
            style={{
              fontFamily: theme.font.displayBold,
              fontSize: 18,
              color: theme.colors.text,
            }}
          >
            {t('community.comments')}
          </Text>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={t('common.close')}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: theme.colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 16, color: theme.colors.textMuted }}>
              {'\u2715'}
            </Text>
          </Pressable>
        </View>

        {/* Comments list */}
        {isLoading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={topLevel}
            keyExtractor={(item) => item.id}
            renderItem={renderComment}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 20,
              flexGrow: 1,
            }}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 60,
                }}
              >
                <Text style={{ fontSize: 32, marginBottom: 8 }}>
                  {'\uD83D\uDCAC'}
                </Text>
                <Text
                  style={{
                    fontFamily: theme.font.bodyMedium,
                    fontSize: 15,
                    color: theme.colors.textMuted,
                    textAlign: 'center',
                  }}
                >
                  {t('community.noComments')}
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Reply indicator */}
        {replyTo && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: theme.colors.surface,
              borderTopWidth: 1,
              borderTopColor: theme.colors.borderSubtle,
            }}
          >
            <Text
              style={{
                fontFamily: theme.font.body,
                fontSize: 13,
                color: theme.colors.textMuted,
              }}
            >
              {t('community.replyingTo', { name: replyTo.name })}
            </Text>
            <Pressable onPress={() => setReplyTo(null)} hitSlop={8}>
              <Text
                style={{
                  fontFamily: theme.font.bodyMedium,
                  fontSize: 13,
                  color: theme.colors.primary,
                }}
              >
                {t('common.cancel')}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Input */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingHorizontal: 16,
            paddingTop: 10,
            paddingBottom: insets.bottom + 10,
            borderTopWidth: replyTo ? 0 : 1,
            borderTopColor: theme.colors.borderSubtle,
            backgroundColor: theme.colors.bg,
          }}
        >
          <TextInput
            ref={inputRef}
            value={text}
            onChangeText={setText}
            placeholder={t('community.addComment')}
            placeholderTextColor={theme.colors.textMuted}
            maxLength={500}
            multiline
            style={{
              flex: 1,
              fontFamily: theme.font.body,
              fontSize: 15,
              color: theme.colors.text,
              backgroundColor: theme.colors.surfaceElevated,
              borderRadius: theme.radius.lg,
              borderWidth: 1,
              borderColor: theme.colors.borderSubtle,
              borderCurve: 'continuous',
              paddingHorizontal: 14,
              paddingVertical: 10,
              maxHeight: 100,
            }}
          />
          <Pressable
            onPress={handleSend}
            disabled={!text.trim() || addCommentMutation.isPending}
            accessibilityRole="button"
            accessibilityLabel={t('community.send')}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor:
                text.trim() ? theme.colors.primary : theme.colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: text.trim() ? theme.colors.onPrimary : theme.colors.textMuted,
              }}
            >
              {'\u2191'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
