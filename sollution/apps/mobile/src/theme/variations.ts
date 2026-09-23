import { brand } from './brand';
import { apricotPalette, palettes, parrotPalette, type PaletteDefinition, type PaletteId } from './palettes';

import type { ThemeColors } from './colors';
import { spacing } from './spacing';
import { darkTypography, typography, type ThemeTypography } from './fonts';

export type ThemeSelection = {
  variation: string;
  paletteId: string;
};

export type Theme = {
  variation: string;
  paletteId: PaletteId;
  colors: ThemeColors;
  visuals: {
    surfaceDim: string;
    surfaceContainerLowest: string;
    surfaceContainerLow: string;
    surfaceContainer: string;
    surfaceContainerHigh: string;
    surfaceContainerHighest: string;
    surfaceBright: string;
    textTertiary: string;
    borderSubtle: string;
  };
  spacing: typeof spacing;
  typography: ThemeTypography;
  radii: {
    card: number;
    button: number;
    input: number;
    pill: number;
    hero: number;
  };
};

type Variation = {
  defaultPaletteId: PaletteId;
  baseColors: PaletteDefinition;
  palettes: Record<string, PaletteDefinition>;
  visuals: Theme['visuals'];
  typography: ThemeTypography;
  radii: Theme['radii'];
};

const premium: Variation = {
  defaultPaletteId: 'sage' as PaletteId,
  baseColors: {} as PaletteDefinition,
  palettes,
  visuals: {
    surfaceDim: palettes.sage.background, surfaceContainerLowest: palettes.sage.surfaceSecondary,
    surfaceContainerLow: palettes.sage.surfaceSecondary, surfaceContainer: palettes.sage.surfaceContainer,
    surfaceContainerHigh: palettes.sage.surfaceHigh, surfaceContainerHighest: palettes.sage.surfaceVariant,
    surfaceBright: palettes.sage.surface, textTertiary: palettes.sage.textMuted,
    borderSubtle: palettes.sage.border,
  },
  typography,
  radii: {
    card: 24,
    button: 999,
    input: 16,
    pill: 999,
    hero: 32,
  },
};

const dark: Variation = {
  defaultPaletteId: 'apricot' as PaletteId,
  baseColors: {
    background: '#111317', surface: '#1a1c1f', surfaceSecondary: '#161920', ink: '#f1f3f7',
    textSecondary: '#9ba3b5', textMuted: '#4a5160', border: '#2c2f35',
    primaryBorder: 'rgba(255, 255, 255, 0.08)', primaryContainer: '#f4a261', primaryFixed: '#f4a261',
    primaryFixedSoft: 'rgba(244, 162, 97, 0.14)', onPrimaryFixed: '#1a1008', onPrimaryFixedVariant: '#1a1008',
    secondaryContainer: '#2c2f35', secondaryFixedSoft: 'rgba(251, 191, 36, 0.14)',
    onSecondaryContainer: '#f1f3f7', onSecondaryFixedVariant: '#f1f3f7', tertiaryFixed: '#fbbf24',
    onTertiaryFixed: '#1a1008', logoWash: '#1a1c1f', surfaceHigh: '#22252a', surfaceContainer: '#1a1c1f',
    surfaceVariant: '#2c2f35', badgeSoft: '#2c2f35', badgeSoftText: '#f1f3f7',
    highlightBorder: 'rgba(244, 162, 97, 0.55)', overlay: '#0c0e11', modalBackdrop: 'rgba(12, 14, 17, 0.72)',
    onOverlay: '#f1f3f7', successSurfaceSoft: 'rgba(78, 186, 135, 0.14)',
  },
  visuals: {
    surfaceDim: '#111317', surfaceContainerLowest: '#0c0e11', surfaceContainerLow: '#161920',
    surfaceContainer: '#1a1c1f', surfaceContainerHigh: '#22252a', surfaceContainerHighest: '#2c2f35',
    surfaceBright: '#37393d', textTertiary: '#656e82', borderSubtle: 'rgba(255,255,255,0.08)',
  },
  palettes: { apricot: apricotPalette, parrot: parrotPalette },
  typography: darkTypography,
  radii: { card: 16, button: 12, input: 12, pill: 999, hero: 16 },
};

export const variations = { premium, dark } as const;

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
    colors: { ...variation.baseColors, ...variation.palettes[paletteId] } as ThemeColors,
    visuals: variation.visuals,
    spacing,
    typography: variation.typography,
    radii: variation.radii,
  };
}
