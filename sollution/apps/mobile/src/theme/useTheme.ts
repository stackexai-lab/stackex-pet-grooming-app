import { useSyncExternalStore } from 'react';

import { defaultThemeSelection, resolveTheme, type Theme, type ThemeSelection } from './variations';
import { loadStoredTheme, saveTheme } from './themeStorage';

type ThemeStore = {
  selection: ThemeSelection;
  theme: Theme;
};

let store: ThemeStore = {
  selection: defaultThemeSelection,
  theme: resolveTheme(defaultThemeSelection),
};
const listeners = new Set<() => void>();
let hydrated = false;

function emit() {
  listeners.forEach((listener) => listener());
}

function setSelection(selection: ThemeSelection) {
  const theme = resolveTheme(selection);
  store = {
    selection: { variation: theme.variation, paletteId: theme.paletteId },
    theme,
  };
  emit();
  void saveTheme(store.selection);
}

export function setTheme(selection: ThemeSelection) {
  setSelection(selection);
}

export function setVariation(variation: string) {
  setSelection({ variation, paletteId: store.selection.paletteId });
}

export function setPaletteId(paletteId: string) {
  setSelection({ ...store.selection, paletteId });
}

export async function hydrateTheme() {
  if (hydrated) return;
  hydrated = true;
  const stored = await loadStoredTheme();
  if (stored) setSelection(stored);
}

export function useTheme() {
  const snapshot = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => store,
    () => store,
  );

  return {
    ...snapshot,
    setTheme,
    setVariation,
    setPaletteId,
  };
}