import { themeStorageKey } from './brand';
import type { ThemeSelection } from './variations';
export function loadStoredTheme(): ThemeSelection | null {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(themeStorageKey) ?? 'null');
    if (!parsed || typeof parsed !== 'object') return null;
    const candidate = parsed as Partial<ThemeSelection>;
    return typeof candidate.variation === 'string' && typeof candidate.paletteId === 'string' ? candidate as ThemeSelection : null;
  } catch { return null; }
}
export function saveTheme(selection: ThemeSelection) {
  try { window.localStorage.setItem(themeStorageKey, JSON.stringify(selection)); } catch { /* Persistence is optional. */ }
}