import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
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
  FadeInDown,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { useCreateCat } from '@/src/hooks/use-cats';
import { theme } from '@/src/theme';
import { playMeow } from '@/src/utils/play-meow';
import { requestNotificationPermission } from '@/src/utils/notifications';

const STORAGE_KEY = '@myfitnesspaw:onboarding_done';

type Phase = 'intro' | 'create-cat' | 'finale';

type Step = {
  id: string;
  icon: any;
  title: string;
  message: string;
};

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

/** Phase: Create your first cat */
function CreateCatStep({
  onCreated,
  onSkip,
}: {
  onCreated: (name: string) => void;
  onSkip: () => void;
}) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const createCat = useCreateCat();

  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [nameError, setNameError] = useState('');

  const isFormValid = name.trim().length > 0 && age.trim().length > 0 && weight.trim().length > 0;

  const handleAdd = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError(t('onboarding.giveCatName'));
      return;
    }
    setNameError('');

    try {
      await createCat.mutateAsync({
        name: trimmedName,
        weight_kg: parseFloat(weight),
        age_years: parseInt(age, 10),
        emoji: '\u{1F431}',
      });
      playMeow();
      onCreated(trimmedName);
    } catch {
      Alert.alert(t('onboarding.oops'), t('onboarding.somethingWentWrong'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}
    >
      {/* Skip button */}
      <Animated.View
        entering={FadeIn.delay(300).duration(400)}
        style={{
          position: 'absolute',
          top: insets.top + 12,
          right: theme.spacing.lg,
          zIndex: 10,
        }}
      >
        <Pressable
          onPress={onSkip}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={t('common.skip')}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Text
            style={{
              fontFamily: theme.font.bodySemiBold,
              fontSize: 15,
              color: theme.colors.textMuted,
            }}
          >
            {t('common.skip')}
          </Text>
        </Pressable>
      </Animated.View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: theme.spacing.lg,
          paddingTop: insets.top + 60,
          paddingBottom: insets.bottom + 20,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(0).duration(500)}
          style={{ alignItems: 'center', marginBottom: 32 }}
        >
          <Image
            source={require('@/assets/icons/cat-face.png')}
            style={{ width: 120, height: 120 }}
            contentFit="contain"
          />
          <Text
            style={{
              fontFamily: theme.font.display,
              fontSize: 28,
              color: theme.colors.text,
              textAlign: 'center',
              marginTop: 16,
              lineHeight: 36,
            }}
          >
            {t('onboarding.addFirstCat')}
          </Text>
          <Text
            style={{
              fontFamily: theme.font.body,
              fontSize: 15,
              color: theme.colors.textMuted,
              textAlign: 'center',
              marginTop: 8,
              lineHeight: 22,
            }}
          >
            {t('onboarding.addFirstCatMessage')}
          </Text>
        </Animated.View>

        {/* Form */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(500)}
          style={{ gap: 14 }}
        >
          <Input
            label={t('onboarding.catName')}
            value={name}
            onChangeText={(v) => { setName(v); setNameError(''); }}
            autoCapitalize="words"
            autoFocus
            returnKeyType="next"
            error={nameError}
          />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Input
              label={t('onboarding.weight')}
              value={weight}
              onChangeText={(v) => setWeight(v.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))}
              keyboardType="decimal-pad"
              returnKeyType="next"
              containerStyle={{ flex: 1 }}
              maxLength={5}
            />
            <Input
              label={t('onboarding.age')}
              value={age}
              onChangeText={(v) => setAge(v.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              returnKeyType="done"
              containerStyle={{ flex: 1 }}
              maxLength={2}
            />
          </View>
        </Animated.View>

        {/* CTA */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(500)}
          style={{ marginTop: 28, gap: 16, alignItems: 'center' }}
        >
          <Button
            title={t('onboarding.addCat')}
            onPress={handleAdd}
            loading={createCat.isPending}
            disabled={!isFormValid}
            style={{ width: '100%' }}
          />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/** Phase: Finale */
function FinaleStep({
  catName,
  onFinish,
}: {
  catName: string | null;
  onFinish: () => void;
}) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 20,
      }}
    >
      <Animated.View
        entering={FadeInDown.delay(0).duration(600)}
        style={{ alignItems: 'center' }}
      >
        <Image
          source={require('@/assets/icons/two-paws.png')}
          style={{ width: 140, height: 140 }}
          contentFit="contain"
        />
        <Text
          style={{
            fontFamily: theme.font.display,
            fontSize: 32,
            color: theme.colors.text,
            textAlign: 'center',
            marginTop: 20,
            lineHeight: 40,
          }}
        >
          {t('onboarding.allSet')}
        </Text>
        <Text
          style={{
            fontFamily: theme.font.body,
            fontSize: 16,
            color: theme.colors.textMuted,
            textAlign: 'center',
            lineHeight: 24,
            marginTop: 10,
            paddingHorizontal: 20,
          }}
        >
          {catName
            ? t('onboarding.catJourneyStarts', { name: catName })
            : t('onboarding.addCatsAndTrack')}
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(400).duration(500)}
        style={{
          position: 'absolute',
          bottom: insets.bottom + 20,
          left: theme.spacing.lg,
          right: theme.spacing.lg,
        }}
      >
        <Button
          title={t('onboarding.getStarted')}
          onPress={onFinish}
          style={{ width: '100%' }}
        />
      </Animated.View>
    </View>
  );
}

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollX = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('intro');
  const [createdCatName, setCreatedCatName] = useState<string | null>(null);

  const steps: Step[] = useMemo(
    () => [
      {
        id: '1',
        icon: require('@/assets/icons/paw.png'),
        title: t('onboarding.welcomeTitle'),
        message: t('onboarding.welcomeMessage'),
      },
      {
        id: '2',
        icon: require('@/assets/icons/cat-face.png'),
        title: t('onboarding.trackTitle'),
        message: t('onboarding.trackMessage'),
      },
      {
        id: '3',
        icon: require('@/assets/icons/stats.png'),
        title: t('onboarding.insightsTitle'),
        message: t('onboarding.insightsMessage'),
      },
    ],
    [t]
  );

  const flatListRef = useRef<Animated.FlatList<Step>>(null);

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
      setPhase('create-cat');
    }
  }, [activeIndex, steps.length]);

  const handleCatCreated = useCallback((name: string) => {
    setCreatedCatName(name);
    setPhase('finale');
  }, []);

  const handleSkipCat = useCallback(() => {
    setPhase('finale');
  }, []);

  const handleFinish = useCallback(() => {
    playMeow();
    completeOnboarding();
  }, [completeOnboarding]);

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

  if (phase === 'create-cat') {
    return <CreateCatStep onCreated={handleCatCreated} onSkip={handleSkipCat} />;
  }

  if (phase === 'finale') {
    return <FinaleStep catName={createdCatName} onFinish={handleFinish} />;
  }

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
          onPress={() => setPhase('create-cat')}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={t('common.skip')}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Text
            style={{
              fontFamily: theme.font.bodySemiBold,
              fontSize: 15,
              color: theme.colors.textMuted,
            }}
          >
            {t('common.skip')}
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
          title={activeIndex === steps.length - 1 ? t('common.continue') : t('common.next')}
          onPress={handleNext}
          style={{ width: '100%' }}
        />
      </Animated.View>
    </View>
  );
}
