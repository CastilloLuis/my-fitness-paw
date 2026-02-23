import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { ACTIVITY_TYPES } from '@/src/utils/activity-types';
import { theme } from '@/src/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ActivityPickerProps {
  selectedId: string | null;
  onSelect: (activityId: string) => void;
}

function ActivityChip({
  label,
  emoji,
  color,
  selected,
  onSelect,
}: {
  label: string;
  emoji: string;
  color: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
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
        scale.value = withTiming(0.97, { duration: 80 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 120 });
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: theme.radius.full,
          backgroundColor: selected ? color + '18' : theme.colors.surface,
          borderWidth: selected ? 1.5 : 1,
          borderColor: selected ? color : theme.colors.borderSubtle,
          borderCurve: 'continuous',
        },
        animStyle,
      ]}
    >
      <Text style={{ fontSize: 16 }}>{emoji}</Text>
      <Text
        style={{
          fontFamily: selected ? theme.font.bodySemiBold : theme.font.body,
          fontSize: 13,
          color: selected ? color : theme.colors.text,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

export function ActivityPicker({ selectedId, onSelect }: ActivityPickerProps) {
  const { t } = useTranslation();

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {ACTIVITY_TYPES.map((activity) => (
        <ActivityChip
          key={activity.id}
          label={t(activity.label)}
          emoji={activity.emoji}
          color={activity.color}
          selected={activity.id === selectedId}
          onSelect={() => onSelect(activity.id)}
        />
      ))}
    </View>
  );
}
