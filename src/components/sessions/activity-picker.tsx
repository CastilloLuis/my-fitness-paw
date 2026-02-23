import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import type { ImageSource } from 'expo-image';
import { Image } from 'expo-image';
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
  icon,
  iconSize = 40,
  color,
  selected,
  onSelect,
}: {
  label: string;
  icon: ImageSource;
  iconSize?: number;
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
          alignItems: 'center',
          gap: 6,
          paddingVertical: 10,
          paddingHorizontal: 8,
          borderRadius: theme.radius.lg,
          backgroundColor: selected ? color + '18' : theme.colors.surface,
          borderWidth: selected ? 1.5 : 1,
          borderColor: selected ? color : theme.colors.borderSubtle,
          borderCurve: 'continuous',
          width: '31%',
        },
        animStyle,
      ]}
    >
      <Image source={icon} style={{ width: iconSize, height: iconSize }} contentFit="contain" />
      <Text
        style={{
          fontFamily: selected ? theme.font.bodySemiBold : theme.font.body,
          fontSize: 12,
          color: selected ? color : theme.colors.text,
          textAlign: 'center',
        }}
        numberOfLines={2}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

export function ActivityPicker({ selectedId, onSelect }: ActivityPickerProps) {
  const { t } = useTranslation();

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' }}>
      {ACTIVITY_TYPES.map((activity) => (
        <ActivityChip
          key={activity.id}
          label={t(activity.label)}
          icon={activity.icon}
          iconSize={activity.iconSize}
          color={activity.color}
          selected={activity.id === selectedId}
          onSelect={() => onSelect(activity.id)}
        />
      ))}
    </View>
  );
}
