export const fontFamilies = {
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
  display: 'Manrope_700Bold',
} as const;

export const typography = {
  fontFamilies,
  sizes: {
    overline: 11,
    caption: 13,
    label: 15,
    body: 16,
    heading: 17,
    bodyLarge: 18,
    headline: 22,
    title: 24,
    display: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    bold: '700' as const,
  },
  lineHeights: {
    overline: 14,
    caption: 18,
    label: 20,
    body: 24,
    heading: 24,
    headline: 30,
    title: 30,
    display: 38,
  },
} as const;
