import { useEffect, type PropsWithChildren } from 'react';
import { useFonts } from 'expo-font';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { Manrope_700Bold } from '@expo-google-fonts/manrope';

import { hydrateTheme } from './useTheme';

export function ThemeProvider({ children }: PropsWithChildren) {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    Manrope_700Bold,
  });

  useEffect(() => {
    void hydrateTheme();
  }, []);

  if (!fontsLoaded) return null;
  return children;
}