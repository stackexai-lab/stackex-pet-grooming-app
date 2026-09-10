import AsyncStorage from '@react-native-async-storage/async-storage';

import { themeStorageKey } from './brand';
import type { ThemeSelection } from './variations';

export async function loadStoredTheme(): Promise<ThemeSelection | null> {
  try {
    const value = await AsyncStorage.getItem(themeStorageKey);
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

export async function saveTheme(selection: ThemeSelection) {
  try {
    await AsyncStorage.setItem(themeStorageKey, JSON.stringify(selection));
  } catch {
    // Persistence is optional; the in-memory theme remains active.
  }
}