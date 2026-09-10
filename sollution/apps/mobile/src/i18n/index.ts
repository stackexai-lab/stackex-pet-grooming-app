import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ar from './locales/ar';
import en from './locales/en';

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const i18nInstance = i18n.createInstance();

void i18nInstance.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  lng: 'en',
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
});

export { LanguageProvider, useLanguage } from './LanguageContext';