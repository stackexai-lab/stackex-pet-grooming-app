import type { Theme } from './variations';

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const variables = {
    '--theme-background': theme.colors.background,
    '--theme-surface': theme.colors.surface,
    '--theme-surface-secondary': theme.colors.surfaceSecondary,
    '--theme-ink': theme.colors.ink,
    '--theme-text-secondary': theme.colors.textSecondary,
    '--theme-text-muted': theme.colors.textMuted,
    '--theme-border': theme.colors.border,
    '--theme-primary': theme.colors.primary,
    '--theme-primary-text': theme.colors.primaryText,
    '--theme-success': theme.colors.success,
    '--theme-warning': theme.colors.warning,
    '--theme-error': theme.colors.error,
    '--theme-font-body': theme.typography.bodyFont,
    '--theme-font-display': theme.typography.displayFont,
    '--theme-radius-card': theme.radii.card,
    '--theme-radius-button': theme.radii.button,
    '--theme-radius-input': theme.radii.input,
    '--theme-radius-pill': theme.radii.pill,
  };
  Object.entries(variables).forEach(([name, value]) => root.style.setProperty(name, value));
  root.dataset.theme = `${theme.variation}-${theme.paletteId}`;
}