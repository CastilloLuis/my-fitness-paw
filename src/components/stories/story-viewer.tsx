import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '@/src/theme';
import { useStoriesStore } from '@/src/stores/stories-store';
import { StoryProgressBar } from './story-progress-bar';
import type { Story } from '@/src/supabase/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
}

export function StoryViewer({
  stories,
  initialIndex,
  visible,
  onClose,
}: StoryViewerProps) {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [paused, setPaused] = useState(false);
  const markViewed = useStoriesStore((s) => s.markViewed);

  // Reset index when opening
  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      setPaused(false);
      translateY.value = 0;
    }
  }, [visible, initialIndex]);

  // Mark story as viewed when it becomes current
  useEffect(() => {
    if (visible && stories[currentIndex]) {
      markViewed(stories[currentIndex].id);
    }
  }, [visible, currentIndex, stories, markViewed]);

  const story = stories[currentIndex];
  const storyText =
    i18n.language === 'es' ? story?.text_es : story?.text_en;

  const goNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
      setPaused(false);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setPaused(false);
    }
  }, [currentIndex]);

  const handleComplete = useCallback(() => {
    goNext();
  }, [goNext]);

  // Pan-to-dismiss shared values
  const translateY = useSharedValue(0);
  const DISMISS_THRESHOLD = 120;

  const panAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: 1 - Math.min(Math.abs(translateY.value) / (DISMISS_THRESHOLD * 3), 0.5),
  }));

  // Tap gesture — left half = prev, right half = next
  const tap = Gesture.Tap().onEnd((e) => {
    'worklet';
    if (e.x < SCREEN_WIDTH / 2) {
      runOnJS(goPrev)();
    } else {
      runOnJS(goNext)();
    }
  });

  // Long press — pause/resume
  const longPress = Gesture.LongPress()
    .minDuration(200)
    .onStart(() => {
      'worklet';
      runOnJS(setPaused)(true);
    })
    .onEnd(() => {
      'worklet';
      runOnJS(setPaused)(false);
    });

  // Pan down — drag to dismiss
  const pan = Gesture.Pan()
    .activeOffsetY(20)
    .failOffsetX([-20, 20])
    .onStart(() => {
      'worklet';
      runOnJS(setPaused)(true);
    })
    .onUpdate((e) => {
      'worklet';
      // Only allow dragging downward (clamp negative to 0)
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      'worklet';
      if (e.translationY > DISMISS_THRESHOLD || e.velocityY > 800) {
        runOnJS(onClose)();
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
        runOnJS(setPaused)(false);
      }
    });

  const composed = Gesture.Race(pan, longPress, tap);

  if (!story) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={composed}>
          <Animated.View style={[{ flex: 1, backgroundColor: '#000' }, panAnimatedStyle]}>
            {/* Background image */}
            <Image
              source={{ uri: story.image_url }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: SCREEN_WIDTH,
                height: SCREEN_HEIGHT,
              }}
              contentFit="cover"
            />

            {/* Dark overlay — top gradient area */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: insets.top + 80,
                backgroundColor: 'rgba(0,0,0,0.4)',
              }}
            />

            {/* Dark overlay — bottom gradient area */}
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 260,
                backgroundColor: 'rgba(0,0,0,0.55)',
              }}
            />

            {/* Progress bar */}
            <View style={{ paddingTop: insets.top }}>
              <StoryProgressBar
                total={stories.length}
                currentIndex={currentIndex}
                paused={paused}
                onComplete={handleComplete}
              />
            </View>

            {/* Close button */}
            <View
              style={{
                position: 'absolute',
                top: insets.top + 20,
                right: 16,
                zIndex: 10,
              }}
            >
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel={t('stories.close')}
                hitSlop={12}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="close" size={20} color="#fff" />
              </Pressable>
            </View>

            {/* Bottom content */}
            <View
              style={{
                position: 'absolute',
                bottom: insets.bottom + 24,
                left: 20,
                right: 20,
              }}
            >
              {/* Reference text */}
              <Animated.View entering={FadeIn.duration(300)}>
                <Text
                  style={{
                    fontFamily: theme.font.bodySemiBold,
                    fontSize: 18,
                    color: '#fff',
                    marginBottom: 8,
                    textShadowColor: 'rgba(0,0,0,0.6)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4,
                  }}
                >
                  {story.title}
                </Text>
                <Text
                  style={{
                    fontFamily: theme.font.body,
                    fontSize: 15,
                    color: 'rgba(255,255,255,0.92)',
                    lineHeight: 22,
                    textShadowColor: 'rgba(0,0,0,0.6)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4,
                  }}
                >
                  {storyText}
                </Text>
              </Animated.View>

              {/* Read more button */}
              <Pressable
                onPress={() => WebBrowser.openBrowserAsync(story.link)}
                accessibilityRole="link"
                accessibilityLabel={t('stories.readMore')}
                style={({ pressed }) => ({
                  marginTop: 16,
                  alignSelf: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: theme.radius.full,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Ionicons name="open-outline" size={16} color="#fff" />
                <Text
                  style={{
                    fontFamily: theme.font.bodySemiBold,
                    fontSize: 14,
                    color: '#fff',
                  }}
                >
                  {t('stories.readMore')}
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}
