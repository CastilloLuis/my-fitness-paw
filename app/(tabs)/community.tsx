import React from 'react';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { theme } from '@/src/theme';

const BG_GRADIENT =
  'linear-gradient(165deg, #FBFAF7 0%, #F3EFE7 25%, #F2B36D22 50%, #E98A2A18 75%, #FBFAF7 100%)';
const BADGE_GRADIENT =
  'linear-gradient(135deg, #F5A035 0%, #EE7E2E 40%, #D96825 100%)';
const GLOW_GRADIENT =
  'radial-gradient(circle, #F2B36D30 0%, #F2B36D00 70%)';

export default function CommunityScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        ...({ experimental_backgroundImage: BG_GRADIENT } as any),
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 120,
      }}
    >
      {/* Soft glow behind image */}
      <View
        style={{
          ...({ experimental_backgroundImage: GLOW_GRADIENT } as any),
          position: 'absolute',
          width: 320,
          height: 320,
          borderRadius: 160,
          top: '25%',
        }}
      />

      {/* Image */}
      <Animated.View entering={FadeInDown.delay(0).duration(500)}>
        <Image
          source={require('@/assets/icons/community-playing.png')}
          style={{ width: 280, height: 280, marginBottom: 8 }}
          contentFit="contain"
        />
      </Animated.View>

      {/* Coming Soon badge */}
      <Animated.View entering={FadeInDown.delay(150).duration(500)}>
        <View
          style={{
            ...({ experimental_backgroundImage: BADGE_GRADIENT } as any),
            paddingHorizontal: 20,
            paddingVertical: 8,
            borderRadius: theme.radius.full,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontFamily: theme.font.displayBold,
              fontSize: 14,
              color: theme.colors.ivory50,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}
          >
            {t('community.comingSoon')}
          </Text>
        </View>
      </Animated.View>

      {/* Title */}
      <Animated.View entering={FadeInDown.delay(250).duration(500)}>
        <Text
          style={{
            fontFamily: theme.font.display,
            fontSize: 26,
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: 12,
          }}
        >
          {t('community.title')}
        </Text>
      </Animated.View>

      {/* Description */}
      <Animated.View entering={FadeInDown.delay(350).duration(500)}>
        <Text
          style={{
            fontFamily: theme.font.body,
            fontSize: 15,
            color: theme.colors.textMuted,
            textAlign: 'center',
            lineHeight: 22,
            maxWidth: 300,
          }}
        >
          {t('community.description')}
        </Text>
      </Animated.View>
    </View>
  );
}
