import React, { useCallback } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  interpolateColor,
  Extrapolation,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme } from '@/src/theme';

interface DurationSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const TRACK_HEIGHT = 12;
const THUMB_SIZE = 36;
const TRACK_PADDING = 24;

export function DurationSlider({
  value,
  onChange,
  min = 1,
  max = 60,
}: DurationSliderProps) {
  const { width: screenWidth } = useWindowDimensions();
  const trackWidth = screenWidth - TRACK_PADDING * 2 - 32; // account for container padding

  const progress = useSharedValue((value - min) / (max - min));
  const thumbScale = useSharedValue(1);
  const isDragging = useSharedValue(false);
  const lastSnappedValue = useSharedValue(value);

  const fireHaptic = useCallback(() => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const updateValue = useCallback(
    (v: number) => {
      onChange(v);
    },
    [onChange]
  );

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
      thumbScale.value = withSpring(1.4, { damping: 12, stiffness: 200 });
    })
    .onUpdate((e) => {
      const newProgress = Math.max(0, Math.min(1, (e as any).absoluteX / trackWidth));
      progress.value = newProgress;

      const rawValue = Math.round(newProgress * (max - min) + min);
      const snapped = Math.max(min, Math.min(max, rawValue));

      if (snapped !== lastSnappedValue.value) {
        lastSnappedValue.value = snapped;
        runOnJS(fireHaptic)();
        runOnJS(updateValue)(snapped);
      }
    })
    .onEnd(() => {
      isDragging.value = false;
      thumbScale.value = withSpring(1, { damping: 12, stiffness: 200 });
      // Snap to exact value
      const snapped = Math.round(progress.value * (max - min) + min);
      progress.value = withSpring((snapped - min) / (max - min), {
        damping: 15,
        stiffness: 250,
      });
    });

  const tapGesture = Gesture.Tap().onEnd((e) => {
    const newProgress = Math.max(0, Math.min(1, e.x / trackWidth));
    const rawValue = Math.round(newProgress * (max - min) + min);
    const snapped = Math.max(min, Math.min(max, rawValue));
    progress.value = withSpring((snapped - min) / (max - min), {
      damping: 15,
      stiffness: 250,
    });
    lastSnappedValue.value = snapped;
    runOnJS(fireHaptic)();
    runOnJS(updateValue)(snapped);
  });

  const gesture = Gesture.Race(panGesture, tapGesture);

  // Animated fill
  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
    backgroundColor: interpolateColor(
      progress.value,
      [0, 0.5, 1],
      [theme.colors.ginger400, theme.colors.ginger500, theme.colors.ginger700]
    ),
  }));

  // Animated thumb
  const thumbStyle = useAnimatedStyle(() => ({
    left: progress.value * trackWidth - THUMB_SIZE / 2,
    transform: [{ scale: thumbScale.value }],
  }));

  // Glow behind thumb when dragging
  const glowStyle = useAnimatedStyle(() => ({
    left: progress.value * trackWidth - 24,
    opacity: isDragging.value ? withTiming(0.3, { duration: 200 }) : withTiming(0, { duration: 300 }),
    transform: [{ scale: isDragging.value ? withSpring(1) : withSpring(0.5) }],
  }));

  // Number display
  const numberStyle = useAnimatedStyle(() => {
    const scale = isDragging.value
      ? withSpring(1.15, { damping: 10, stiffness: 200 })
      : withSpring(1, { damping: 10, stiffness: 200 });
    return { transform: [{ scale }] };
  });

  // Tick marks
  const ticks = [1, 15, 30, 45, 60];

  return (
    <View style={{ gap: 20 }}>
      {/* Big number display */}
      <Animated.View style={[{ alignItems: 'center' }, numberStyle]}>
        <Text
          style={{
            fontFamily: theme.font.display,
            fontSize: 56,
            color: theme.colors.primary,
            fontVariant: ['tabular-nums'],
            lineHeight: 64,
          }}
        >
          {value}
        </Text>
        <Text
          style={{
            fontFamily: theme.font.bodyMedium,
            fontSize: 15,
            color: theme.colors.textMuted,
            marginTop: -2,
          }}
        >
          minutes
        </Text>
      </Animated.View>

      {/* Slider track */}
      <GestureDetector gesture={gesture}>
        <View
          style={{
            height: THUMB_SIZE + 20,
            justifyContent: 'center',
          }}
        >
          {/* Track background */}
          <View
            style={{
              height: TRACK_HEIGHT,
              backgroundColor: theme.colors.taupe200,
              borderRadius: TRACK_HEIGHT / 2,
              overflow: 'hidden',
            }}
          >
            {/* Animated fill */}
            <Animated.View
              style={[
                {
                  height: '100%',
                  borderRadius: TRACK_HEIGHT / 2,
                },
                fillStyle,
              ]}
            />
          </View>

          {/* Glow effect */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: theme.colors.ginger400,
              },
              glowStyle,
            ]}
          />

          {/* Thumb */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: THUMB_SIZE,
                height: THUMB_SIZE,
                borderRadius: THUMB_SIZE / 2,
                backgroundColor: theme.colors.surfaceElevated,
                borderWidth: 3,
                borderColor: theme.colors.primary,
                boxShadow: '0 2px 8px rgba(20, 19, 17, 0.15)',
              },
              thumbStyle,
            ]}
          />
        </View>
      </GestureDetector>

      {/* Tick labels */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 2,
          marginTop: -8,
        }}
      >
        {ticks.map((tick) => (
          <Text
            key={tick}
            style={{
              fontFamily: theme.font.body,
              fontSize: 11,
              color:
                value === tick ? theme.colors.primary : theme.colors.textMuted,
              fontVariant: ['tabular-nums'],
              fontWeight: value === tick ? '600' : '400',
            }}
          >
            {tick}m
          </Text>
        ))}
      </View>
    </View>
  );
}
