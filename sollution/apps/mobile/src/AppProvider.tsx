import type { PropsWithChildren } from 'react';

import { LanguageProvider } from './i18n';
import { ThemeProvider } from './theme';

export function AppProvider({ children }: PropsWithChildren) {
  return (
    <LanguageProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </LanguageProvider>
  );
}