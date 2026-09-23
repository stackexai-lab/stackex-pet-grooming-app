import { brand } from './brand';
import { apricotPalette, palettes, type PaletteDefinition, type PaletteId, type PaletteColors } from './palettes';

export type ThemeSelection = {
  variation: string;
  paletteId: string;
};

export type Theme = {
  variation: string;
  paletteId: PaletteId;
  colors: PaletteColors;
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
  typography: {
    bodyFont: string;
    displayFont: string;
    sizes: Record<'caption' | 'body' | 'bodyLarge' | 'title' | 'display', string>;
    weights: Record<'regular' | 'medium' | 'bold', number>;
    headingWeight: number;
    buttonWeight: number;
  };
  radii: {
    card: string;
    button: string;
    input: string;
    pill: string;
  };
};

type Variation = {
  defaultPaletteId: PaletteId;
  baseColors: PaletteDefinition;
  palettes: Record<string, PaletteDefinition>;
  visuals: Theme['visuals'];
  typography: Theme['typography'];
  radii: Theme['radii'];
};

const premium: Variation = {
  defaultPaletteId: 'sage' as PaletteId,
  baseColors: {} as PaletteDefinition,
  palettes,
  visuals: {
    surfaceDim: palettes.sage.background, surfaceContainerLowest: palettes.sage.surfaceSecondary,
    surfaceContainerLow: palettes.sage.surfaceSecondary, surfaceContainer: palettes.sage.surfaceSecondary,
    surfaceContainerHigh: palettes.sage.surfaceSecondary, surfaceContainerHighest: palettes.sage.border,
    surfaceBright: palettes.sage.surface, textTertiary: palettes.sage.textMuted, borderSubtle: palettes.sage.border,
  },
  typography: {
    bodyFont: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
    displayFont: 'Manrope, "DM Sans", ui-sans-serif, system-ui, sans-serif',
    sizes: { caption: '0.75rem', body: '1rem', bodyLarge: '1.125rem', title: '1.5rem', display: '2rem' },
    weights: { regular: 400, medium: 500, bold: 700 }, headingWeight: 700, buttonWeight: 700,
  },
  radii: { card: '1rem', button: '0.75rem', input: '0.625rem', pill: '999px' },
};

const dark: Variation = {
  defaultPaletteId: 'apricot' as PaletteId,
  baseColors: {
    background: '#111317', surface: '#1a1c1f', surfaceSecondary: '#161920', ink: '#f1f3f7',
    textSecondary: '#9ba3b5', textMuted: '#4a5160', border: '#2c2f35',
  },
  visuals: {
    surfaceDim: '#111317', surfaceContainerLowest: '#0c0e11', surfaceContainerLow: '#161920',
    surfaceContainer: '#1a1c1f', surfaceContainerHigh: '#22252a', surfaceContainerHighest: '#2c2f35',
    surfaceBright: '#37393d', textTertiary: '#656e82', borderSubtle: 'rgba(255,255,255,0.08)',
  },
  palettes: { apricot: apricotPalette },
  typography: {
    bodyFont: 'Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif',
    displayFont: 'Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif',
    sizes: { caption: '0.75rem', body: '1rem', bodyLarge: '1.125rem', title: '1.5rem', display: '2rem' },
    weights: { regular: 400, medium: 500, bold: 700 }, headingWeight: 800, buttonWeight: 700,
  },
  radii: { card: '1rem', button: '0.75rem', input: '0.75rem', pill: '999px' },
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
    colors: { ...variation.baseColors, ...variation.palettes[paletteId] } as PaletteColors,
    visuals: variation.visuals,
    typography: variation.typography,
    radii: variation.radii,
  };
}
