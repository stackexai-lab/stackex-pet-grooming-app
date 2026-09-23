export type PaletteColors = {
  background: string;
  surface: string;
  surfaceSecondary: string;
  ink: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryLight: string;
  primaryHover?: string;
  primaryBorder: string;
  primaryContainer: string;
  primaryText: string;
  primaryFixed: string;
  primaryFixedSoft: string;
  onPrimaryFixed: string;
  onPrimaryFixedVariant: string;
  secondary: string;
  secondaryContainer: string;
  secondaryFixedSoft: string;
  onSecondaryContainer: string;
  onSecondaryFixedVariant: string;
  tertiaryFixed: string;
  onTertiaryFixed: string;
  logoWash: string;
  surfaceHigh: string;
  surfaceContainer: string;
  surfaceVariant: string;
  badgeSoft: string;
  badgeSoftText: string;
  highlightBorder: string;
  overlay: string;
  modalBackdrop: string;
  onOverlay: string;
  success: string;
  successSurfaceSoft: string;
  warning: string;
  error: string;
};

export const paletteIds = ['sage', 'minimalist-mist'] as const;
export type PremiumPaletteId = (typeof paletteIds)[number];
export type PaletteId = PremiumPaletteId | 'apricot' | 'parrot';
export type PaletteDefinition = Partial<PaletteColors>;

export const palettes: Record<PremiumPaletteId, PaletteColors> = {
  sage: {
    background: '#F8F9FF',
    surface: '#FFFFFF',
    surfaceSecondary: '#F0F4FD',
    ink: '#171C23',
    textSecondary: '#554339',
    textMuted: '#887367',
    border: '#DBC1B4',
    primary: '#994703',
    primaryLight: '#FFF8F0',
    primaryBorder: 'rgba(153, 71, 3, 0.3)',
    primaryContainer: '#D97736',
    primaryText: '#FFFFFF',
    primaryFixed: '#FFDBC9',
    primaryFixedSoft: 'rgba(255, 219, 201, 0.4)',
    onPrimaryFixed: '#321200',
    onPrimaryFixedVariant: '#753400',
    secondary: '#446557',
    secondaryContainer: '#C6EBD9',
    secondaryFixedSoft: '#C6EBD9',
    onSecondaryContainer: '#4A6B5D',
    onSecondaryFixedVariant: '#2D4D40',
    tertiaryFixed: '#FFDCC3',
    onTertiaryFixed: '#2F1500',
    logoWash: '#FAF3E8',
    surfaceHigh: '#E4E8F2',
    surfaceContainer: '#EAEEF8',
    surfaceVariant: '#DEE2EC',
    badgeSoft: '#EDF3FA',
    badgeSoftText: '#486581',
    highlightBorder: 'rgba(96, 165, 250, 0.55)',
    overlay: '#2C3138',
    modalBackdrop: 'rgba(15, 23, 42, 0.28)',
    onOverlay: '#EDF1FB',
    success: '#446557',
    successSurfaceSoft: '#EDF5F1',
    warning: '#B57937',
    error: '#BA1A1A',
  },
  'minimalist-mist': {
    background: '#F4F7F6', surface: '#FFFFFF', surfaceSecondary: '#F4F7F6', ink: '#111A22',
    textSecondary: '#111A22', textMuted: '#111A22', border: '#E2E8E5', primary: '#527965', primaryLight: '#FFFFFF',
    primaryBorder: 'rgba(30, 46, 61, 0.3)', primaryContainer: '#B5D0BE', primaryText: '#FFFFFF',
    primaryFixed: '#B5D0BE', primaryFixedSoft: 'rgba(181, 208, 190, 0.4)', onPrimaryFixed: '#111A22',
    onPrimaryFixedVariant: '#1E2E3D', secondary: '#DD590C', secondaryContainer: '#F4F7F6',
    secondaryFixedSoft: 'rgba(221, 89, 12, 0.14)',
    onSecondaryContainer: '#111A22', onSecondaryFixedVariant: '#1E2E3D', tertiaryFixed: '#E2B393',
    onTertiaryFixed: '#111A22', logoWash: '#F4F7F6', surfaceHigh: '#E2E8E5', surfaceContainer: '#F4F7F6',
    surfaceVariant: '#D8E6DE', badgeSoft: '#B5D0BE', badgeSoftText: '#111A22',
    highlightBorder: 'rgba(82, 121, 101, 0.55)', overlay: '#1E2E3D', modalBackdrop: 'rgba(17, 26, 34, 0.28)',
    onOverlay: '#FFFFFF', success: '#2E7D63', successSurfaceSoft: '#E6F1EB', warning: '#B77955', error: '#BA1A1A',
  },
};

export const apricotPalette: PaletteDefinition = {
  primary: '#f4a261',
  primaryLight: '#FFD0A8',
  primaryHover: '#e79352',
  primaryBorder: 'rgba(244, 162, 97, 0.3)',
  primaryContainer: '#f4a261',
  primaryText: '#1a1008',
  primaryFixed: '#f4a261',
  primaryFixedSoft: 'rgba(244, 162, 97, 0.14)',
  onPrimaryFixed: '#1a1008',
  onPrimaryFixedVariant: '#1a1008',
  secondary: '#fbbf24',
  secondaryFixedSoft: 'rgba(251, 191, 36, 0.14)',
  onSecondaryContainer: '#f1f3f7',
  onSecondaryFixedVariant: '#f1f3f7',
  tertiaryFixed: '#fbbf24',
  onTertiaryFixed: '#1a1008',
  highlightBorder: 'rgba(244, 162, 97, 0.55)',
  success: '#4eba87',
  warning: '#e0a96d',
  error: '#BA1A1A',
};

export const parrotPalette: PaletteDefinition = {
  primary: '#7ED957',
  primaryLight: '#D5F5C8',
  primaryHover: '#6FC747',
  primaryBorder: 'rgba(126, 217, 87, 0.3)',
  primaryContainer: '#28551B',
  primaryText: '#0B1209',
  primaryFixed: '#7ED957',
  primaryFixedSoft: 'rgba(126, 217, 87, 0.14)',
  onPrimaryFixed: '#0B1209',
  onPrimaryFixedVariant: '#0B1209',
  secondary: '#A3E635',
  secondaryFixedSoft: 'rgba(163, 230, 53, 0.14)',
  tertiaryFixed: '#A3E635',
  onTertiaryFixed: '#0B1209',
  highlightBorder: 'rgba(126, 217, 87, 0.55)',
  success: '#4EBA87',
  warning: '#E0A96D',
  error: '#BA1A1A',
};

export function isPaletteId(value: string): value is PaletteId {
  return value === 'apricot' || value === 'parrot' || Object.prototype.hasOwnProperty.call(palettes, value);
}
