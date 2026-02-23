import React, { useEffect, useRef, useState } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { Image, type ImageSource } from 'expo-image';
import type { SharedValue } from 'react-native-reanimated';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { Button } from '@/src/components/ui/button';
import { theme } from '@/src/theme';
import { useAppConfig } from '@/src/hooks/use-app-config';

const CHARACTERS: ImageSource[] = [
  require('@/assets/character/jumping.png'),
  require('@/assets/character/dumbell.png'),
  require('@/assets/character/treadmill.png'),
  require('@/assets/character/abs.png'),
];

const CYCLE_MS = 3200;

// --- Animated blob ---
function Blob({
  size,
  color,
  top,
  left,
  dxRange,
  dyRange,
  dxDur,
  dyDur,
  scaleDur,
  delay,
}: {
  size: number;
  color: string;
  top: number;
  left: number;
  dxRange: number;
  dyRange: number;
  dxDur: number;
  dyDur: number;
  scaleDur: number;
  delay: number;
}) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const sc = useSharedValue(1);

  useEffect(() => {
    const ease = Easing.inOut(Easing.ease);
    tx.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(dxRange, { duration: dxDur, easing: ease }),
          withTiming(-dxRange, { duration: dxDur, easing: ease })
        ),
        -1,
        true
      )
    );
    ty.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(dyRange, { duration: dyDur, easing: ease }),
          withTiming(-dyRange, { duration: dyDur, easing: ease })
        ),
        -1,
        true
      )
    );
    sc.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.25, { duration: scaleDur, easing: ease }),
          withTiming(0.85, { duration: scaleDur, easing: ease })
        ),
        -1,
        true
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { scale: sc.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          top,
          left,
        },
        style,
      ]}
    />
  );
}

// --- Full-screen animated background ---
function AnimatedBackground() {
  const { width, height } = useWindowDimensions();

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
      }}
    >
      {/* Large warm ginger — top left */}
      <Blob
        size={width * 0.75}
        color={theme.colors.ginger400 + '18'}
        top={-height * 0.08}
        left={-width * 0.2}
        dxRange={40}
        dyRange={30}
        dxDur={6000}
        dyDur={7000}
        scaleDur={8000}
        delay={0}
      />
      {/* Cream — center right */}
      <Blob
        size={width * 0.65}
        color={theme.colors.cream200 + '28'}
        top={height * 0.25}
        left={width * 0.45}
        dxRange={-35}
        dyRange={45}
        dxDur={7500}
        dyDur={5500}
        scaleDur={9000}
        delay={800}
      />
      {/* Warm cinnamon — bottom left */}
      <Blob
        size={width * 0.55}
        color={theme.colors.ginger500 + '10'}
        top={height * 0.55}
        left={-width * 0.1}
        dxRange={30}
        dyRange={-25}
        dxDur={8000}
        dyDur={6500}
        scaleDur={7000}
        delay={1200}
      />
      {/* Small ginger accent — top right */}
      <Blob
        size={width * 0.35}
        color={theme.colors.ginger500 + '12'}
        top={height * 0.05}
        left={width * 0.6}
        dxRange={-20}
        dyRange={20}
        dxDur={5000}
        dyDur={8500}
        scaleDur={6000}
        delay={400}
      />
      {/* Warm ginger haze — bottom right */}
      <Blob
        size={width * 0.5}
        color={theme.colors.ginger400 + '14'}
        top={height * 0.7}
        left={width * 0.4}
        dxRange={25}
        dyRange={-35}
        dxDur={9000}
        dyDur={6000}
        scaleDur={7500}
        delay={600}
      />
    </View>
  );
}

// --- Character crossfade layer ---
function CharacterLayer({
  source,
  opacity,
}: {
  source: ImageSource;
  opacity: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        { position: 'absolute', width: '100%', height: '100%' },
        style,
      ]}
    >
      <Image
        source={source}
        style={{ width: '100%', height: '100%' }}
        contentFit="contain"
      />
    </Animated.View>
  );
}

// --- Character carousel ---
function CharacterCarousel({
  activeIndex,
  onCycle,
}: {
  activeIndex: number;
  onCycle: () => void;
}) {
  const { width } = useWindowDimensions();

  const opacities = [
    useSharedValue(1),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
  ];

  const scale = useSharedValue(1);
  const prevIndexRef = useRef(0);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 2800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  useEffect(() => {
    const prev = prevIndexRef.current;
    if (prev === activeIndex) return;

    opacities[prev].value = withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.ease),
    });
    opacities[activeIndex].value = withDelay(
      200,
      withTiming(1, { duration: 600, easing: Easing.in(Easing.ease) })
    );

    prevIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const interval = setInterval(onCycle, CYCLE_MS);
    return () => clearInterval(interval);
  }, [onCycle]);

  const breathStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const imgSize = Math.min(width * 0.65, 280);

  return (
    <Animated.View style={[{ width: imgSize, height: imgSize }, breathStyle]}>
      {CHARACTERS.map((src, i) => (
        <CharacterLayer key={i} source={src} opacity={opacities[i]} />
      ))}
    </Animated.View>
  );
}

// --- Dot indicator ---
function Dots({ count, active }: { count: number; active: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i === active ? 20 : 6,
            height: 6,
            borderRadius: 3,
            backgroundColor:
              i === active ? theme.colors.primary : theme.colors.taupe300,
          }}
        />
      ))}
    </View>
  );
}

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useTranslation();
  const { data: appConfig } = useAppConfig();

  const handleCycle = React.useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % CHARACTERS.length);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.bg,
        ...({ experimental_backgroundImage: 'linear-gradient(165deg, #FBFAF7 0%, #F3EFE7 25%, #F2B36D22 50%, #E98A2A18 75%, #FBFAF7 100%)' } as any),
      }}
    >
      <AnimatedBackground />

      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 16,
          paddingHorizontal: theme.spacing.lg,
        }}
      >
        {/* Center — character + branding */}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <Animated.View entering={FadeInDown.duration(700)}>
            <CharacterCarousel activeIndex={activeIndex} onCycle={handleCycle} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(500)}>
            <Dots count={CHARACTERS.length} active={activeIndex} />
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(350).duration(600)}
            style={{ alignItems: 'center', gap: 6, marginTop: 8 }}
          >
            <Text
              style={{
                fontFamily: theme.font.display,
                fontSize: 34,
                color: theme.colors.text,
                textAlign: 'center',
              }}
            >
              MyFitnessPaw
            </Text>
            <Text
              style={{
                fontFamily: theme.font.body,
                fontSize: 16,
                color: theme.colors.textMuted,
                textAlign: 'center',
                lineHeight: 22,
              }}
            >
              {t('auth.trackCatFitness')}
            </Text>
          </Animated.View>
        </View>

        {/* Bottom — CTAs */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(500)}
          style={{ gap: 12 }}
        >
          <Button
            title={t('auth.logIn')}
            onPress={() => router.push('/(auth)/login')}
            disabled={appConfig?.loginEnabled === false}
          />
          <Button
            title={t('auth.createAccount')}
            onPress={() => router.push('/(auth)/register')}
            variant="secondary"
            disabled={appConfig?.signupEnabled === false}
          />
        </Animated.View>
      </View>
    </View>
  );
}
