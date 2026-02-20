import React from 'react';
import { ScrollView, Pressable, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { theme } from '@/src/theme';
import type { Cat } from '@/src/supabase/types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CatPickerProps {
  cats: Cat[];
  selectedId: string | null;
  onSelect: (catId: string) => void;
}

function CatPickerItem({
  cat,
  selected,
  onSelect,
  fullWidth,
}: {
  cat: Cat;
  selected: boolean;
  onSelect: () => void;
  fullWidth?: boolean;
}) {
  const scale = useSharedValue(1);

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      borderColor: withTiming(
        selected ? theme.colors.primary : theme.colors.borderSubtle,
        { duration: 200 }
      ),
      backgroundColor: withTiming(
        selected ? theme.colors.ginger400 + '18' : theme.colors.surface,
        { duration: 200 }
      ),
      borderWidth: withTiming(selected ? 2 : 1, { duration: 200 }),
    };
  });

  const emojiContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        selected ? theme.colors.cream200 : theme.colors.taupe200,
        { duration: 200 }
      ),
    };
  });

  const nameStyle = useAnimatedStyle(() => ({
    color: withTiming(
      selected ? theme.colors.primary : theme.colors.text,
      { duration: 200 }
    ),
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: withTiming(selected ? 1 : 0, { duration: 200 }),
    transform: [
      { scale: withTiming(selected ? 1 : 0.5, { duration: 150 }) },
    ],
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onSelect();
      }}
      onPressIn={() => {
        scale.value = withTiming(0.97, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 150 });
      }}
      accessibilityRole="button"
      accessibilityLabel={`Select ${cat.name}`}
      accessibilityState={{ selected }}
      style={[
        {
          alignItems: 'center',
          paddingVertical: fullWidth ? 20 : 14,
          paddingHorizontal: fullWidth ? 24 : 16,
          borderRadius: theme.radius.lg,
          borderCurve: 'continuous',
          gap: fullWidth ? 14 : 8,
          ...(fullWidth
            ? { flexDirection: 'row' as const }
            : { minWidth: 90 }),
        },
        containerStyle,
      ]}
    >
      <View>
        <Animated.View
          style={[
            {
              width: fullWidth ? 56 : 52,
              height: fullWidth ? 56 : 52,
              borderRadius: fullWidth ? 28 : 26,
              alignItems: 'center',
              justifyContent: 'center',
            },
            emojiContainerStyle,
          ]}
        >
          {cat.image_base64 ? (
            <Image
              source={{ uri: `data:image/jpeg;base64,${cat.image_base64}` }}
              style={{
                width: fullWidth ? 56 : 52,
                height: fullWidth ? 56 : 52,
                borderRadius: fullWidth ? 28 : 26,
              }}
              contentFit="cover"
            />
          ) : (
            <Text style={{ fontSize: fullWidth ? 28 : 26 }}>{cat.emoji}</Text>
          )}
        </Animated.View>

        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: theme.colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: theme.colors.surfaceElevated,
            },
            checkStyle,
          ]}
        >
          <Text style={{ fontSize: 10, color: theme.colors.onPrimary }}>
            {'\u2713'}
          </Text>
        </Animated.View>
      </View>

      {fullWidth ? (
        <View style={{ flex: 1, gap: 2 }}>
          <Animated.Text
            style={[
              {
                fontFamily: selected ? theme.font.bodySemiBold : theme.font.body,
                fontSize: 16,
              },
              nameStyle,
            ]}
            numberOfLines={1}
          >
            {cat.name}
          </Animated.Text>
          {cat.breed && (
            <Text
              style={{
                fontFamily: theme.font.body,
                fontSize: 13,
                color: theme.colors.textMuted,
              }}
              numberOfLines={1}
            >
              {cat.breed}
            </Text>
          )}
        </View>
      ) : (
        <Animated.Text
          style={[
            {
              fontFamily: selected ? theme.font.bodySemiBold : theme.font.body,
              fontSize: 13,
            },
            nameStyle,
          ]}
          numberOfLines={1}
        >
          {cat.name}
        </Animated.Text>
      )}
    </AnimatedPressable>
  );
}

export function CatPicker({ cats, selectedId, onSelect }: CatPickerProps) {
  // Single cat: render full-width card
  if (cats.length === 1) {
    return (
      <CatPickerItem
        cat={cats[0]}
        selected={cats[0].id === selectedId}
        onSelect={() => onSelect(cats[0].id)}
        fullWidth
      />
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ flexGrow: 0 }}
      contentContainerStyle={{ gap: 10, paddingHorizontal: 4, paddingVertical: 4 }}
    >
      {cats.map((cat) => (
        <CatPickerItem
          key={cat.id}
          cat={cat}
          selected={cat.id === selectedId}
          onSelect={() => onSelect(cat.id)}
        />
      ))}
    </ScrollView>
  );
}
