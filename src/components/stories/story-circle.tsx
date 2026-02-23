import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { theme } from '@/src/theme';

const OUTER_SIZE = 72;
const RING_WIDTH = 2.5;
const IMAGE_SIZE = OUTER_SIZE - RING_WIDTH * 2 - 4; // 4px gap

interface StoryCircleProps {
  imageUrl: string;
  title: string;
  seen: boolean;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StoryCircle({ imageUrl, title, seen, onPress }: StoryCircleProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
      onPress={onPress}
      style={[{ alignItems: 'center', width: OUTER_SIZE + 4 }, animatedStyle]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {/* Ring */}
      <View
        style={{
          width: OUTER_SIZE,
          height: OUTER_SIZE,
          borderRadius: OUTER_SIZE / 2,
          borderWidth: RING_WIDTH,
          borderColor: seen ? theme.colors.taupe300 : theme.colors.ginger500,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            borderRadius: IMAGE_SIZE / 2,
          }}
          contentFit="cover"
        />
      </View>
      {/* Title below */}
      <Text
        numberOfLines={1}
        style={{
          fontFamily: theme.font.body,
          fontSize: 11,
          color: theme.colors.textMuted,
          marginTop: 4,
          maxWidth: OUTER_SIZE + 4,
          textAlign: 'center',
        }}
      >
        {title.length > 8 ? title.slice(0, 8) + '...' : title}
      </Text>
    </AnimatedPressable>
  );
}
