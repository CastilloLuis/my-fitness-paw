import { colors } from './colors';

export const theme = {
  colors: {
    bg: colors.ivory50,
    surface: colors.ivory100,
    surfaceElevated: colors.white,
    text: colors.ink900,
    textSecondary: colors.ink800,
    textMuted: colors.muted,
    border: colors.taupe300,
    borderSubtle: colors.taupe200,
    primary: colors.ginger600,
    primaryLight: colors.ginger400,
    primaryHover: colors.ginger700,
    onPrimary: colors.ivory50,
    accent: colors.cinnamon600,
    accentDeep: colors.cocoa700,
    onAccent: colors.ivory50,
    info: colors.blue500,
    ...colors,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 28,
    full: 9999,
  },
  font: {
    display: 'PlayfairDisplay-Bold',
    body: 'DMSans-Regular',
    bodyMedium: 'DMSans-Medium',
    bodySemiBold: 'DMSans-SemiBold',
  },
  shadow: {
    sm: {
      boxShadow: '0 1px 4px rgba(20, 19, 17, 0.06)',
    },
    md: {
      boxShadow: '0 4px 12px rgba(20, 19, 17, 0.08)',
    },
    lg: {
      boxShadow: '0 8px 24px rgba(20, 19, 17, 0.10)',
    },
  },
} as const;

export { colors } from './colors';
export type Theme = typeof theme;
