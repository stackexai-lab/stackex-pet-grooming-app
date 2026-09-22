import { brand } from './brand';
import { palettes, type PaletteId } from './palettes';

import type { ThemeColors } from './colors';
import { spacing } from './spacing';
import { typography } from './fonts';

export type ThemeSelection = {
  variation: string;
  paletteId: string;
};

export type Theme = {
  variation: string;
  paletteId: PaletteId;
  colors: ThemeColors;
  spacing: typeof spacing;
  typography: typeof typography;
  radii: {
    card: number;
    button: number;
    input: number;
    pill: number;
    hero: number;
  };
};

const premium = {
  defaultPaletteId: 'sage' as PaletteId,
  palettes,
  radii: {
    card: 24,
    button: 999,
    input: 16,
    pill: 999,
    hero: 32,
  },
};

export const variations = { premium } as const;

export const defaultThemeSelection: ThemeSelection = {
  variation: brand.variation,
  paletteId: brand.paletteId,
};

export function resolveTheme(selection: ThemeSelection): Theme {
  const variationId = Object.prototype.hasOwnProperty.call(variations, selection.variation)
    ? selection.variation as keyof typeof variations
    : brand.variation;
  const variation = variations[variationId];
  const paletteId = Object.prototype.hasOwnProperty.call(variation.palettes, selection.paletteId)
    ? selection.paletteId as PaletteId
    : variation.defaultPaletteId;

  return {
    variation: variationId,
    paletteId,
    colors: variation.palettes[paletteId],
    spacing,
    typography,
    radii: variation.radii,
  };
}
