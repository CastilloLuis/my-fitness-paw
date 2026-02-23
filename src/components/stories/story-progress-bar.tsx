import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  type SharedValue,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

const STORY_DURATION = 10_000;

interface StoryProgressBarProps {
  total: number;
  currentIndex: number;
  paused: boolean;
  onComplete: () => void;
}

export function StoryProgressBar({
  total,
  currentIndex,
  paused,
  onComplete,
}: StoryProgressBarProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    // Reset progress when story changes
    progress.value = 0;

    if (!paused) {
      progress.value = withTiming(1, {
        duration: STORY_DURATION,
        easing: Easing.linear,
      });
    }
  }, [currentIndex]);

  useEffect(() => {
    if (paused) {
      // Freeze at current progress
      cancelAnimation(progress);
    } else {
      // Resume from current progress
      const remaining = (1 - progress.value) * STORY_DURATION;
      if (remaining > 0) {
        progress.value = withTiming(1, {
          duration: remaining,
          easing: Easing.linear,
        });
      }
    }
  }, [paused]);

  // Poll for completion
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      if (progress.value >= 0.999) {
        onComplete();
      }
    }, 200);
    return () => clearInterval(interval);
  }, [paused, currentIndex, onComplete]);

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 4,
        paddingHorizontal: 12,
        paddingTop: 8,
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 2.5,
            borderRadius: 1.25,
            backgroundColor: 'rgba(255,255,255,0.3)',
            overflow: 'hidden',
          }}
        >
          {i < currentIndex ? (
            <View
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255,255,255,1)',
                borderRadius: 1.25,
              }}
            />
          ) : i === currentIndex ? (
            <AnimatedSegment progress={progress} />
          ) : null}
        </View>
      ))}
    </View>
  );
}

function AnimatedSegment({
  progress,
}: {
  progress: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 1.25,
  }));

  return <Animated.View style={animatedStyle} />;
}
