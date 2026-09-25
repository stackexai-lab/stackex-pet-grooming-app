import { I18nextProvider } from 'react-i18next';
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { i18nInstance, locales, type Locale } from './index';

const storageKey = 'pet-grooming-web-locale';
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

function loadLocale(): Locale {
  try {
    const stored = normalizeLocale(window.localStorage.getItem(storageKey));
    if (stored) return stored;
  } catch {
    // Browser locale remains a valid fallback when storage is unavailable.
  }
  return normalizeLocale(navigator.language) ?? defaultLocale;
}

function applyDocumentLanguage(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
}

export function LanguageProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const handleLanguageChanged = (language: string) => {
      const nextLocale = normalizeLocale(language) ?? defaultLocale;
      setLocaleState(nextLocale);
      applyDocumentLanguage(nextLocale);
    };
    i18nInstance.on('languageChanged', handleLanguageChanged);

    const nextLocale = loadLocale();
    void i18nInstance.changeLanguage(nextLocale).then(() => {
      if (!active) return;
      applyDocumentLanguage(nextLocale);
      setLocaleState(nextLocale);
      setReady(true);
    });
    return () => {
      active = false;
      i18nInstance.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  const setLocale = async (nextLocale: Locale) => {
    window.localStorage.setItem(storageKey, nextLocale);
    await i18nInstance.changeLanguage(nextLocale);
    setLocaleState(nextLocale);
    applyDocumentLanguage(nextLocale);
  };

  const value = useMemo(() => ({ locale, isRTL: locale === 'ar', ready, setLocale }), [locale, ready]);

  if (!ready) return null;

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
