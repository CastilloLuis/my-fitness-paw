import React from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { theme } from '@/src/theme';

interface AvatarProps {
  emoji: string;
  imageBase64?: string | null;
  size?: number;
  backgroundColor?: string;
  style?: ViewStyle;
}

export function Avatar({
  emoji,
  imageBase64,
  size = 48,
  backgroundColor = theme.colors.cream200,
  style,
}: AvatarProps) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
          borderCurve: 'continuous',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {imageBase64 ? (
        <Image
          source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
          style={{ width: size, height: size }}
          contentFit="cover"
        />
      ) : (
        <Text style={{ fontSize: size * 0.5 }}>{emoji}</Text>
      )}
    </View>
  );
}
