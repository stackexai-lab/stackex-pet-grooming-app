import { sageColors, type ThemeColors } from './colors';
import { spacing } from './spacing';
import { typography } from './fonts';

export type ThemeSelection = {
  variation: string;
  paletteId: string;
};

export type Theme = {
  variation: string;
  paletteId: string;
  colors: ThemeColors;
  spacing: typeof spacing;
  typography: typeof typography;
  radii: {
    card: number;
    button: number;
    input: number;
    pill: number;
  };
};

const premium = {
  palettes: {
    sage: sageColors,
  },
  radii: {
    card: 16,
    button: 12,
    input: 10,
    pill: 999,
  },
};

export const variations = { premium } as const;

export const defaultThemeSelection: ThemeSelection = {
  variation: 'premium',
  paletteId: 'sage',
};

export function resolveTheme(selection: ThemeSelection): Theme {
  const variation = variations[selection.variation as keyof typeof variations] ?? premium;
  const paletteId = selection.paletteId in variation.palettes ? selection.paletteId : 'sage';
  const colors = variation.palettes[paletteId as keyof typeof variation.palettes] ?? sageColors;

  return {
    variation: variation === premium ? 'premium' : selection.variation,
    paletteId,
    colors,
    spacing,
    typography,
    radii: variation.radii,
  };
}