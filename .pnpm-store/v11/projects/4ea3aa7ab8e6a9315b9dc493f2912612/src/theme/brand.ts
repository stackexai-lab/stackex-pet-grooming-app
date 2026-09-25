import type { PaletteId } from './palettes';

export const brand = {
  name: 'Pet Grooming',
  variation: 'premium',
  paletteId: 'sage',
} as const satisfies { name: string; variation: string; paletteId: PaletteId };

export const themeStorageKey = 'pet-grooming-web-theme';