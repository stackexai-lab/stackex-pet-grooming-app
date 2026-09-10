export const sageColors = {
  background: '#F7F9F5',
  surface: '#FFFFFF',
  surfaceSecondary: '#EEF3EC',
  ink: '#20332B',
  textSecondary: '#52645B',
  textMuted: '#7D8B83',
  border: '#DCE6DE',
  primary: '#5F806F',
  primaryText: '#FFFFFF',
  success: '#4D8A68',
  warning: '#B57937',
  error: '#B85C58',
} as const;

export type ThemeColors = typeof sageColors;