import { I18nManager } from 'react-native';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nextProvider } from 'react-i18next';
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { i18nInstance, locales, type Locale } from './index';

const storageKey = '@pet-grooming/locale';
const defaultLocale: Locale = 'en';

type LanguageContextValue = {
  locale: Locale;
  isRTL: boolean;
  ready: boolean;
  setLocale: (locale: Locale) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function normalizeLocale(value?: string | null): Locale | null {
  const language = value?.split('-')[0].toLowerCase();
  return locales.includes(language as Locale) ? language as Locale : null;
}

async function loadLocale(): Promise<Locale> {
  try {
    const stored = normalizeLocale(await AsyncStorage.getItem(storageKey));
    if (stored) return stored;
  } catch {
    // Device locale remains a valid fallback when storage is unavailable.
  }
  return normalizeLocale(getLocales()[0]?.languageCode) ?? defaultLocale;
}

export function LanguageProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    void loadLocale().then(async (nextLocale) => {
      if (!active) return;
      await i18nInstance.changeLanguage(nextLocale);
      I18nManager.allowRTL(nextLocale === 'ar');
      I18nManager.forceRTL(nextLocale === 'ar');
      setLocaleState(nextLocale);
      setReady(true);
    });
    return () => { active = false; };
  }, []);

  const setLocale = async (nextLocale: Locale) => {
    await i18nInstance.changeLanguage(nextLocale);
    I18nManager.allowRTL(nextLocale === 'ar');
    I18nManager.forceRTL(nextLocale === 'ar');
    setLocaleState(nextLocale);
    await AsyncStorage.setItem(storageKey, nextLocale);
  };

  const value = useMemo(() => ({ locale, isRTL: locale === 'ar', ready, setLocale }), [locale, ready]);

  return (
    <I18nextProvider i18n={i18nInstance}>
      <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
    </I18nextProvider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}