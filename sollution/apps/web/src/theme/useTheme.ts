import { useSyncExternalStore } from 'react';

import { applyTheme } from './applyTheme';
import { defaultThemeSelection } from './variations';
import { loadStoredTheme, saveTheme } from './themeStorage';
import { resolveTheme, type Theme, type ThemeSelection } from './variations';

type ThemeStore = { selection: ThemeSelection; theme: Theme };
let store: ThemeStore = { selection: defaultThemeSelection, theme: resolveTheme(defaultThemeSelection) };
const listeners = new Set<() => void>();
let hydrated = false;

function setSelection(selection: ThemeSelection) {
  const theme = resolveTheme(selection);
  store = { selection: { variation: theme.variation, paletteId: theme.paletteId }, theme };
  applyTheme(theme);
  saveTheme(store.selection);
  listeners.forEach((listener) => listener());
}

export function setTheme(selection: ThemeSelection) { setSelection(selection); }
export function setVariation(variation: string) { setSelection({ ...store.selection, variation }); }
export function setPaletteId(paletteId: string) { setSelection({ ...store.selection, paletteId }); }

export function hydrateTheme() {
  if (hydrated) return;
  hydrated = true;
  const stored = loadStoredTheme();
  if (stored) setSelection(stored);
}

export function useTheme() {
  const snapshot = useSyncExternalStore(
    (listener) => { listeners.add(listener); return () => listeners.delete(listener); },
    () => store,
    () => store,
  );
  return { ...snapshot, setTheme, setVariation, setPaletteId };
}