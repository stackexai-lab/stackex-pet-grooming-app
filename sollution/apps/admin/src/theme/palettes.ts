export type PaletteColors = {
  background: string;
  surface: string;
  surfaceSecondary: string;
  ink: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryHover?: string;
  primaryText: string;
  success: string;
  warning: string;
  error: string;
};

export const paletteIds = ['sage', 'minimalist-mist'] as const;
export type PremiumPaletteId = (typeof paletteIds)[number];
export type PaletteId = PremiumPaletteId | 'apricot';
export type PaletteDefinition = Partial<PaletteColors>;

export const palettes: Record<PremiumPaletteId, PaletteColors> = {
  sage: {
    background: '#F7F9F5', surface: '#FFFFFF', surfaceSecondary: '#EEF3EC', ink: '#20332B',
    textSecondary: '#52645B', textMuted: '#7D8B83', border: '#DCE6DE', primary: '#5F806F',
    primaryText: '#FFFFFF', success: '#4D8A68', warning: '#B57937', error: '#B85C58',
  },
  'minimalist-mist': {
    background: '#F4F7F6', surface: '#FFFFFF', surfaceSecondary: '#F4F7F6', ink: '#111A22', textSecondary: '#111A22', textMuted: '#111A22', border: '#E2E8E5', primary: '#527965', primaryText: '#FFFFFF', success: '#2E7D63', warning: '#B77955', error: '#BA1A1A',
  },
};

export const apricotPalette: PaletteDefinition = {
  primary: '#f4a261',
  primaryHover: '#e79352',
  primaryText: '#1a1008',
  success: '#4eba87',
  warning: '#e0a96d',
  error: '#BA1A1A',
};

export function isPaletteId(value: string): value is PaletteId {
  return value === 'apricot' || Object.prototype.hasOwnProperty.call(palettes, value);
}
