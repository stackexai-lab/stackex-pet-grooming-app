export const fontFamilies = {
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
  display: 'Manrope_700Bold',
} as const;

export const typography = {
  fontFamilies,
  sizes: {
    caption: 12,
    body: 16,
    bodyLarge: 18,
    title: 24,
    display: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    bold: '700' as const,
  },
  lineHeights: {
    body: 24,
    title: 30,
    display: 38,
  },
} as const;