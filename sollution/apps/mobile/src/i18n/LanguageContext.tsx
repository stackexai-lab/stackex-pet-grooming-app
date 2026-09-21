import { I18nManager, View } from 'react-native';
import { reloadAppAsync } from 'expo';
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
    const handleLanguageChanged = (language: string) => {
      setLocaleState(normalizeLocale(language) ?? defaultLocale);
    };
    i18nInstance.on('languageChanged', handleLanguageChanged);

    void loadLocale().then(async (nextLocale) => {
      if (!active) return;
      await i18nInstance.changeLanguage(nextLocale);
      if (!active) return;
      I18nManager.allowRTL(nextLocale === 'ar');
      I18nManager.forceRTL(nextLocale === 'ar');
      setLocaleState(nextLocale);
      setReady(true);
    });
    return () => {
      active = false;
      i18nInstance.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  const setLocale = async (nextLocale: Locale) => {
    const directionChanged = (locale === 'ar') !== (nextLocale === 'ar');
    await AsyncStorage.setItem(storageKey, nextLocale);
    await i18nInstance.changeLanguage(nextLocale);
    setLocaleState(nextLocale);
    I18nManager.allowRTL(nextLocale === 'ar');
    I18nManager.forceRTL(nextLocale === 'ar');

    if (directionChanged) {
      try {
        await reloadAppAsync();
      } catch {
        // Keep the selected language even when the native app cannot reload.
      }
    }
  };

  const value = useMemo(() => ({ locale, isRTL: locale === 'ar', ready, setLocale }), [locale, ready]);

  if (!ready) return null;

  return (
    <I18nextProvider i18n={i18nInstance}>
      <LanguageContext.Provider value={value}>
        <View style={{ direction: locale === 'ar' ? 'rtl' : 'ltr', flex: 1 }}>
          {children}
        </View>
      </LanguageContext.Provider>
    </I18nextProvider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
