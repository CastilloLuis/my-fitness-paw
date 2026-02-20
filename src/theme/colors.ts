export const colors = {
  // Neutrals
  ivory50: '#FBFAF7',
  ivory100: '#F3EFE7',
  taupe200: '#E5D9C8',
  taupe300: '#CBBBA4',
  ink800: '#2C2A27',
  ink900: '#141311',

  // Gingers (primary brand)
  ginger400: '#F2B36D',
  ginger500: '#E98A2A',
  ginger600: '#CC6A1E',
  ginger700: '#A94F18',

  // Browns (accent)
  cinnamon600: '#8A5A3C',
  cocoa700: '#5A3A2E',

  // Dilute accents
  blue500: '#6F7A86',
  cream200: '#F1DFC6',

  // Semantic
  success: '#2F7D57',
  warning: '#E98A2A',
  danger: '#B33A2B',

  white: '#FFFFFF',
  muted: '#5B564F',
} as const;

export type ColorToken = keyof typeof colors;
