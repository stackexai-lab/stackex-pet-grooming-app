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
    '--theme-text-caption': theme.typography.sizes.caption,
    '--theme-text-body': theme.typography.sizes.body,
    '--theme-text-body-large': theme.typography.sizes.bodyLarge,
    '--theme-text-title': theme.typography.sizes.title,
    '--theme-text-display': theme.typography.sizes.display,
    '--theme-text-card': theme.typography.sizes.card ?? theme.typography.sizes.bodyLarge,
    '--theme-text-label': theme.typography.sizes.label ?? theme.typography.sizes.caption,
    '--theme-text-button': theme.typography.sizes.button ?? theme.typography.sizes.body,
    '--theme-weight-extra-bold': String(theme.typography.weights.extraBold ?? theme.typography.weights.bold),
    '--theme-weight-regular': String(theme.typography.weights.regular),
    '--theme-weight-medium': String(theme.typography.weights.medium),
    '--theme-weight-bold': String(theme.typography.weights.bold),
    '--theme-weight-heading': String(theme.typography.headingWeight),
    '--theme-weight-button': String(theme.typography.buttonWeight),
    '--theme-radius-card': theme.radii.card,
    '--theme-radius-button': theme.radii.button,
    '--theme-radius-input': theme.radii.input,
    '--theme-radius-pill': theme.radii.pill,
  };
  Object.entries(variables).forEach(([name, value]) => root.style.setProperty(name, value));
  root.dataset.theme = `${theme.variation}-${theme.paletteId}`;
}
