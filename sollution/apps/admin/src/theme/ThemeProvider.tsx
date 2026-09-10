import { useEffect, type PropsWithChildren } from 'react';
import { applyTheme } from './applyTheme';
import { hydrateTheme, useTheme } from './useTheme';
export function ThemeProvider({ children }: PropsWithChildren) { const { theme } = useTheme(); useEffect(() => { applyTheme(theme); hydrateTheme(); }, [theme]); return children; }