import { StyleSheet } from 'react-native';

import type { Theme } from './variations';

export function createStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (theme: Theme) => T,
  theme: Theme,
) {
  return StyleSheet.create(factory(theme));
}