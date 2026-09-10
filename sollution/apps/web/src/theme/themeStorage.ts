import { themeStorageKey } from './brand';
import type { ThemeSelection } from './variations';

export function loadStoredTheme(): ThemeSelection | null {
  try {
    const value = window.localStorage.getItem(themeStorageKey);
    if (!value) return null;
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object') return null;
    const candidate = parsed as Partial<ThemeSelection>;
    if (typeof candidate.variation !== 'string' || typeof candidate.paletteId !== 'string') return null;
    return { variation: candidate.variation, paletteId: candidate.paletteId };
  } catch {
    return null;
  }
}

export function saveTheme(selection: ThemeSelection) {
  try {
    window.localStorage.setItem(themeStorageKey, JSON.stringify(selection));
  } catch {
    // Persistence is optional; the in-memory theme remains active.
  }
}