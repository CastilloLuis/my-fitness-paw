import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { theme } from '@/src/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  progress: number; // 0–1
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
  sublabel?: string;
  labelColor?: string;
  sublabelColor?: string;
}

export function ProgressRing({
  progress,
  size = 140,
  strokeWidth = 10,
  color = theme.colors.primary,
  bgColor = theme.colors.taupe200,
  label,
  sublabel,
  labelColor = theme.colors.text,
  sublabelColor = theme.colors.textMuted,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(Math.min(progress, 1), {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, animatedProgress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
        }}
      >
        {label && (
          <Text
            style={{
              fontFamily: theme.font.display,
              fontSize: 24,
              color: labelColor,
              fontVariant: ['tabular-nums'],
            }}
            selectable
          >
            {label}
          </Text>
        )}
        {sublabel && (
          <Text
            style={{
              fontFamily: theme.font.body,
              fontSize: 12,
              color: sublabelColor,
              marginTop: 2,
            }}
          >
            {sublabel}
          </Text>
        )}
      </View>
    </View>
  );
}
