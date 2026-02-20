import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { theme } from '@/src/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RING_SIZE = 100;
const STROKE = 5;
const radius = (RING_SIZE - STROKE) / 2;
const circumference = 2 * Math.PI * radius;

const ease = Easing.out(Easing.cubic);

export function SuccessOverlay({ onComplete }: { onComplete: () => void }) {
  const ringProgress = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const containerScale = useSharedValue(0.8);
  const textOpacity = useSharedValue(0);
  const textY = useSharedValue(12);
  const bgOpacity = useSharedValue(0);

  useEffect(() => {
    bgOpacity.value = withTiming(1, { duration: 250 });
    containerScale.value = withTiming(1, { duration: 400, easing: ease });
    ringProgress.value = withDelay(
      150,
      withTiming(1, { duration: 500, easing: ease })
    );
    checkOpacity.value = withDelay(550, withTiming(1, { duration: 250 }));
    checkScale.value = withDelay(
      550,
      withTiming(1, { duration: 300, easing: ease })
    );
    textOpacity.value = withDelay(750, withTiming(1, { duration: 300 }));
    textY.value = withDelay(
      750,
      withTiming(0, { duration: 300, easing: ease })
    );

    const timer = setTimeout(onComplete, 1800);
    return () => clearTimeout(timer);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
  }));

  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - ringProgress.value),
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: theme.colors.bg,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        },
        overlayStyle,
      ]}
    >
      <Animated.View
        style={[{ alignItems: 'center', gap: 24 }, containerStyle]}
      >
        <View
          style={{
            width: RING_SIZE,
            height: RING_SIZE,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Svg
            width={RING_SIZE}
            height={RING_SIZE}
            style={{ position: 'absolute' }}
          >
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={radius}
              stroke={theme.colors.success + '25'}
              strokeWidth={STROKE}
              fill="none"
            />
            <AnimatedCircle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={radius}
              stroke={theme.colors.success}
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={circumference}
              animatedProps={ringProps}
              strokeLinecap="round"
              transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
            />
          </Svg>

          <Animated.View style={checkStyle}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: theme.colors.success,
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(47, 125, 87, 0.3)',
              }}
            >
              <Text style={{ fontSize: 24, color: '#fff' }}>{'\u2713'}</Text>
            </View>
          </Animated.View>
        </View>

        <Animated.View style={[{ alignItems: 'center', gap: 6 }, textStyle]}>
          <Text
            style={{
              fontFamily: theme.font.display,
              fontSize: 24,
              color: theme.colors.text,
            }}
          >
            Great session!
          </Text>
          <Text
            style={{
              fontFamily: theme.font.body,
              fontSize: 15,
              color: theme.colors.textMuted,
            }}
          >
            Nap time earned. {'\u{1F634}'}
          </Text>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}
