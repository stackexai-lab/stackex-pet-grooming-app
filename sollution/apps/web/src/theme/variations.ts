import { brand } from './brand';
import { palettes, type PaletteId, type PaletteColors } from './palettes';

export type ThemeSelection = {
  variation: string;
  paletteId: string;
};

export type Theme = {
  variation: string;
  paletteId: PaletteId;
  colors: PaletteColors;
  typography: {
    bodyFont: string;
    displayFont: string;
    sizes: Record<'caption' | 'body' | 'bodyLarge' | 'title' | 'display', string>;
    weights: Record<'regular' | 'medium' | 'bold', number>;
  };
  radii: {
    card: string;
    button: string;
    input: string;
    pill: string;
  };
};

const premium = {
  defaultPaletteId: 'sage' as PaletteId,
  palettes,
  typography: {
    bodyFont: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
    displayFont: 'Manrope, "DM Sans", ui-sans-serif, system-ui, sans-serif',
    sizes: { caption: '0.75rem', body: '1rem', bodyLarge: '1.125rem', title: '1.5rem', display: '2rem' },
    weights: { regular: 400, medium: 500, bold: 700 },
  },
  radii: { card: '1rem', button: '0.75rem', input: '0.625rem', pill: '999px' },
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
    typography: variation.typography,
    radii: variation.radii,
  };
}
