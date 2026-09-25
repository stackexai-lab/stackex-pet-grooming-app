import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/i18n';
import type { Pet } from '@/mocks/home';

export function useHomeFormat() {
  const { t } = useTranslation();
  const { locale } = useLanguage();
  const code = locale === 'ar' ? 'ar-AE' : 'en-US';
  return {
    money: (value: number) => new Intl.NumberFormat(code, { style: 'currency', currency: 'USD' }).format(value),
    number: (value: number) => new Intl.NumberFormat(code, { maximumFractionDigits: 1 }).format(value),
    petName: (pet: Pet) => pet.nameKey ? t(pet.nameKey) : pet.name ?? '',
  };
}
