import React, { useCallback, useRef, useState } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  type SharedValue,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  interpolateColor,
  Extrapolation,
  FadeIn,
  FadeInUp,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button } from '@/src/components/ui/button';
import { theme } from '@/src/theme';
import { playMeow } from '@/src/utils/play-meow';
import { requestNotificationPermission } from '@/src/utils/notifications';

const STORAGE_KEY = '@myfitnesspaw:onboarding_done';

const steps = [
  {
    id: '1',
    icon: require('@/assets/icons/paw.png'),
    title: 'Welcome to\nMyFitnessPaw',
    message:
      'Your cat\u2019s fitness journey starts here.\nTrack play, monitor health, and keep them happy.',
  },
  {
    id: '2',
    icon: require('@/assets/icons/cat-face.png'),
    title: 'Track Every\nPlay Session',
    message:
      'Record live sessions or log them manually.\nSee daily progress and build streaks.',
  },
  {
    id: '3',
    icon: require('@/assets/icons/stats.png'),
    title: 'Discover\nInsights',
    message:
      'Get calorie estimates, activity trends, and\npersonalized tips for each of your cats.',
  },
] as const;

/** Scroll-driven page with parallax */
function OnboardingPage({
  index,
  scrollX,
  width,
  icon,
  title,
  message,
}: {
  index: number;
  scrollX: SharedValue<number>;
  width: number;
  icon: any;
  title: string;
  message: string;
}) {
  const inputRange = [
    (index - 1) * width,
    index * width,
    (index + 1) * width,
  ];

  const iconStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [60, 0, -60],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP
    );
    const rotate = interpolate(
      scrollX.value,
      inputRange,
      [-15, 0, 15],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        { translateY },
        { scale },
        { rotate: `${rotate}deg` },
      ],
      opacity,
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [40, 0, -40],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP
    );
    return { transform: [{ translateY }], opacity };
  });

  const messageStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [30, 0, -30],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP
    );
    return { transform: [{ translateY }], opacity };
  });

  return (
    <View
      style={{
        width,
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingBottom: 80,
      }}
    >
      {/* Icon */}
      <Animated.View style={iconStyle}>
        <Image
          source={icon}
          style={{ width: 240, height: 240 }}
          contentFit="contain"
        />
      </Animated.View>

      {/* Title */}
      <Animated.Text
        style={[
          {
            fontFamily: theme.font.display,
            fontSize: 32,
            color: theme.colors.text,
            textAlign: 'center',
            marginTop: 8,
            lineHeight: 40,
          },
          titleStyle,
        ]}
      >
        {title}
      </Animated.Text>

      {/* Message */}
      <Animated.Text
        style={[
          {
            fontFamily: theme.font.body,
            fontSize: 16,
            color: theme.colors.textMuted,
            textAlign: 'center',
            lineHeight: 24,
            marginTop: 8,
          },
          messageStyle,
        ]}
      >
        {message}
      </Animated.Text>
    </View>
  );
}

/** Animated dot indicator */
function Dot({
  index,
  scrollX,
  width,
}: {
  index: number;
  scrollX: SharedValue<number>;
  width: number;
}) {
  const inputRange = [
    (index - 1) * width,
    index * width,
    (index + 1) * width,
  ];

  const dotStyle = useAnimatedStyle(() => {
    const dotWidth = interpolate(
      scrollX.value,
      inputRange,
      [8, 28, 8],
      Extrapolation.CLAMP
    );
    const bgColor = interpolateColor(
      scrollX.value,
      inputRange,
      [theme.colors.taupe200, theme.colors.primary, theme.colors.taupe200]
    );
    return {
      width: dotWidth,
      backgroundColor: bgColor,
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: 8,
          borderRadius: 4,
        },
        dotStyle,
      ]}
    />
  );
}

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<Animated.FlatList<(typeof steps)[number]>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
    await requestNotificationPermission();
    router.replace('/(tabs)');
  }, []);

  const handleNext = useCallback(() => {
    if (activeIndex < steps.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    } else {
      playMeow();
      completeOnboarding();
    }
  }, [activeIndex, completeOnboarding]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      {/* Skip button */}
      <Animated.View
        entering={FadeIn.delay(600).duration(400)}
        style={{
          position: 'absolute',
          top: insets.top + 12,
          right: theme.spacing.lg,
          zIndex: 10,
        }}
      >
        <Pressable
          onPress={completeOnboarding}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Text
            style={{
              fontFamily: theme.font.bodySemiBold,
              fontSize: 15,
              color: theme.colors.textMuted,
            }}
          >
            Skip
          </Text>
        </Pressable>
      </Animated.View>

      {/* Scroll pages */}
      <Animated.FlatList
        ref={flatListRef}
        data={steps}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item, index }) => (
          <OnboardingPage
            index={index}
            scrollX={scrollX}
            width={width}
            icon={item.icon}
            title={item.title}
            message={item.message}
          />
        )}
      />

      {/* Bottom controls */}
      <Animated.View
        entering={FadeInUp.delay(400).duration(500)}
        style={{
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: insets.bottom + 20,
          gap: 28,
          alignItems: 'center',
        }}
      >
        {/* Dot indicators */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {steps.map((_, i) => (
            <Dot key={i} index={i} scrollX={scrollX} width={width} />
          ))}
        </View>

        {/* Action button */}
        <Button
          title={activeIndex === steps.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          style={{ width: '100%' }}
        />
      </Animated.View>
    </View>
  );
}
