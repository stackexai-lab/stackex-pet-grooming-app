export type ThemeSelection = { variation: string; paletteId: string };
export type Theme = {
  variation: string;
  paletteId: string;
  colors: Record<'background' | 'surface' | 'surfaceSecondary' | 'ink' | 'textSecondary' | 'textMuted' | 'border' | 'primary' | 'primaryText' | 'success' | 'warning' | 'error', string>;
  typography: { bodyFont: string; displayFont: string; sizes: Record<string, string>; weights: Record<string, number> };
  radii: { card: string; button: string; input: string; pill: string };
};

const sage = {
  background: '#F7F9F5', surface: '#FFFFFF', surfaceSecondary: '#EEF3EC', ink: '#20332B',
  textSecondary: '#52645B', textMuted: '#7D8B83', border: '#DCE6DE', primary: '#5F806F',
  primaryText: '#FFFFFF', success: '#4D8A68', warning: '#B57937', error: '#B85C58',
};
const premium = {
  palettes: { sage },
  typography: {
    bodyFont: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
    displayFont: 'Manrope, "DM Sans", ui-sans-serif, system-ui, sans-serif',
    sizes: { caption: '0.75rem', body: '1rem', bodyLarge: '1.125rem', title: '1.5rem', display: '2rem' },
    weights: { regular: 400, medium: 500, bold: 700 },
  },
  radii: { card: '1rem', button: '0.75rem', input: '0.625rem', pill: '999px' },
};
export const variations = { premium } as const;
export const defaultThemeSelection: ThemeSelection = { variation: 'premium', paletteId: 'sage' };
export function resolveTheme(selection: ThemeSelection): Theme {
  const variation = variations[selection.variation as keyof typeof variations] ?? premium;
  const paletteId = selection.paletteId in variation.palettes ? selection.paletteId : 'sage';
  return { variation: 'premium', paletteId, colors: variation.palettes[paletteId as 'sage'] ?? sage, typography: variation.typography, radii: variation.radii };
}