import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLiveSessionStore } from '@/src/stores/live-session-store';
import { theme } from '@/src/theme';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { ImageSource } from 'expo-image';

const TAB_ICONS: Record<string, ImageSource> = {
  index: require('@/assets/icons/castle.png'),
  cats: require('@/assets/icons/cat-face.png'),
  insights: require('@/assets/icons/stats.png'),
};

const TAB_LABELS: Record<string, string> = {
  index: 'Home',
  cats: 'Cats',
  insights: 'Insights',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function TabItem({
  routeName,
  isFocused,
  onPress,
}: {
  routeName: string;
  isFocused: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(isFocused ? 1.15 : 1);
  const iconTranslateY = useSharedValue(isFocused ? -2 : 0);

  useEffect(() => {
    iconScale.value = withTiming(isFocused ? 1.15 : 1, { duration: 250, easing: Easing.out(Easing.back(1.5)) });
    iconTranslateY.value = withTiming(isFocused ? -2 : 0, { duration: 250 });
  }, [isFocused]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { translateY: iconTranslateY.value },
    ],
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress();
      }}
      onPressIn={() => {
        scale.value = withTiming(0.9, { duration: 80 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 150 });
      }}
      accessibilityRole="tab"
      accessibilityLabel={TAB_LABELS[routeName] || routeName}
      accessibilityState={{ selected: isFocused }}
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 8,
          gap: 3,
        },
        animStyle,
      ]}
    >
      <Animated.View
        style={[
          {
            width: 48,
            height: 36,
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isFocused
              ? theme.colors.ginger400 + '25'
              : 'transparent',
          },
          iconAnimStyle,
        ]}
      >
        <Image
          source={TAB_ICONS[routeName]}
          style={{
            width: 44,
            height: 44,
            opacity: isFocused ? 1 : 0.7,
          }}
          contentFit="contain"
        />
      </Animated.View>
      <Text
        style={{
          fontFamily: isFocused ? theme.font.bodySemiBold : theme.font.body,
          fontSize: 10,
          color: isFocused ? theme.colors.primary : theme.colors.textMuted,
        }}
      >
        {TAB_LABELS[routeName] || routeName}
      </Text>
    </AnimatedPressable>
  );
}

// --- Play button (right side, rounded square) ---

function formatCompact(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function PlayButton() {
  const scale = useSharedValue(1);
  const shimmer = useSharedValue(0);
  const isRecording = useLiveSessionStore((s) => s.isRecording);
  const isPaused = useLiveSessionStore((s) => s.isPaused);
  const catEmoji = useLiveSessionStore((s) => s.catEmoji);
  const getElapsedMs = useLiveSessionStore((s) => s.getElapsedMs);
  const [displayMs, setDisplayMs] = useState(0);

  const dotOpacity = useSharedValue(1);

  // Tick the timer when recording
  useEffect(() => {
    if (!isRecording) return;
    const tick = setInterval(() => {
      setDisplayMs(getElapsedMs());
    }, 1000);
    setDisplayMs(getElapsedMs());
    return () => clearInterval(tick);
  }, [isRecording, getElapsedMs]);

  // Pulsing dot for live state
  useEffect(() => {
    if (isRecording && !isPaused) {
      dotOpacity.value = withRepeat(
        withSequence(
          withTiming(0.3, {
            duration: 800,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, {
            duration: 800,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        false
      );
    } else {
      dotOpacity.value = withTiming(1, { duration: 150 });
    }
  }, [isRecording, isPaused]);

  // Shimmer cross-fade between two gradient layers
  useEffect(() => {
    if (isRecording) return;
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [isRecording]);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value,
  }));

  const dotStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity.value,
  }));

  // Vivid orange gradient stops
  const GRAD_A = 'linear-gradient(135deg, #F5A035, #EE7E2E, #D96825)';
  const GRAD_B = 'linear-gradient(315deg, #F8B04A, #F08A35, #D55E1E)';

  return (
    <AnimatedPressable
      onPress={() => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        router.push('/session/live');
      }}
      onPressIn={() => {
        scale.value = withTiming(0.93, { duration: 80 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 150 });
      }}
      accessibilityRole="button"
      accessibilityLabel={isRecording ? 'Return to session' : 'Start session'}
      style={[
        {
          width: 78,
          height: '100%',
          borderRadius: theme.radius.lg,
          backgroundColor: isRecording
            ? theme.colors.ink900
            : '#EE7E2E',
          alignItems: 'center',
          justifyContent: 'center',
          borderCurve: 'continuous',
          borderWidth: isRecording ? 1 : 0,
          borderColor: isRecording
            ? theme.colors.danger + '80'
            : 'transparent',
          boxShadow: isRecording
            ? `0 0 12px ${theme.colors.danger}30`
            : '0 4px 14px rgba(210, 100, 30, 0.35)',
          gap: 2,
          overflow: 'hidden' as const,
        },
        pressStyle,
      ]}
    >
      {/* Gradient layer A (base) */}
      {!isRecording && (
        <View
          style={{
            ...({ experimental_backgroundImage: GRAD_A } as any),
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: theme.radius.lg,
          }}
        />
      )}
      {/* Gradient layer B (animated shimmer on top) */}
      {!isRecording && (
        <Animated.View
          style={[
            {
              ...({ experimental_backgroundImage: GRAD_B } as any),
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: theme.radius.lg,
            },
            shimmerStyle,
          ]}
        />
      )}
      {isRecording ? (
        <>
          <Animated.View
            style={[
              {
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.colors.danger,
              },
              dotStyle,
            ]}
          />
          <Text
            style={{
              fontFamily: theme.font.bodySemiBold,
              fontSize: 11,
              color: theme.colors.ivory50,
              fontVariant: ['tabular-nums'],
            }}
          >
            {formatCompact(displayMs)}
          </Text>
        </>
      ) : (
        <>
          <Image
            source={require('@/assets/icons/paw.png')}
            style={{ width: 44, height: 44 }}
            contentFit="contain"
          />
          <Text
            style={{
              fontFamily: theme.font.bodySemiBold,
              fontSize: 10,
              color: theme.colors.ivory50,
            }}
          >
            Record
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const visibleRoutes = state.routes.filter((r) => r.name !== 'log');

  return (
    <View
      style={{
        position: 'absolute',
        bottom: insets.bottom + 8,
        left: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 10,
        height: 82,
      }}
    >
      {/* Tab pill — left side */}
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.surfaceElevated,
          borderRadius: theme.radius.xl,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          borderCurve: 'continuous',
          boxShadow: theme.shadow.lg.boxShadow,
          borderWidth: 1,
          borderColor: theme.colors.borderSubtle,
        }}
      >
        {visibleRoutes.map((route) => {
          const realIndex = state.routes.indexOf(route);
          const isFocused = state.index === realIndex;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem
              key={route.key}
              routeName={route.name}
              isFocused={isFocused}
              onPress={onPress}
            />
          );
        })}
      </View>

      {/* Play button — right side, rounded square */}
      <PlayButton />
    </View>
  );
}
