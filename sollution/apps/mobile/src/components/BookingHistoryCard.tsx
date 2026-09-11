import { useMemo } from 'react';
import { Image, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { cardShadow } from '@/components/ServiceCard';
import type { HistoryBooking } from '@/mocks/bookings';
import { createStyles, useTheme, type Theme } from '@/theme';
import { useLanguage } from '@/i18n';

type BookingHistoryCardProps = {
  booking: HistoryBooking;
};

export function BookingHistoryCard({ booking }: BookingHistoryCardProps) {
  const { t } = useTranslation();
  const { locale } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(() => historyCardStyles(theme), [theme]);
  const pending = booking.status === 'pending';
  const when = formatBookingWhen(booking.startsAt, locale, pending);
  const duration = t('selectService.duration', { minutes: booking.minutes });
  const price = t('home.price', { value: booking.price });

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.pet}>
          <Image source={booking.photo} style={styles.photo} resizeMode="cover" />
          <View style={styles.petCopy}>
            <Text numberOfLines={1} style={styles.name}>{booking.petName}</Text>
            <Text numberOfLines={1} style={styles.breed}>{t(booking.breedKey)}</Text>
          </View>
        </View>
        <View style={[styles.pill, pending ? styles.pillPending : styles.pillDone]}>
          <View style={[styles.dot, { backgroundColor: pending ? theme.colors.primary : theme.colors.secondary }]} />
          <Text style={[styles.pillLabel, pending ? styles.pillPendingLabel : styles.pillDoneLabel]}>
            {t(pending ? 'history.pending' : 'history.completed')}
          </Text>
        </View>
      </View>
      <View>
        <Text numberOfLines={1} style={styles.service}>{t(booking.serviceKey)}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.when}>{when}</Text>
          <Text style={styles.meta}>{t('history.meta', { duration, price })}</Text>
        </View>
      </View>
    </View>
  );
}

export function formatBookingWhen(date: Date, locale: string, weekday: boolean) {
  const day = new Intl.DateTimeFormat(locale, {
    ...(weekday ? { weekday: 'short' as const } : {}),
    month: 'short',
    day: 'numeric',
  }).format(date);
  const time = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
  return `${day} · ${time}`;
}

function historyCardStyles(theme: Theme) {
  return createStyles((t) => ({
    card: {
      backgroundColor: t.colors.surface,
      borderColor: t.colors.border,
      borderRadius: t.radii.card,
      borderWidth: 1,
      gap: t.spacing.sm,
      padding: t.spacing.md,
      ...cardShadow(t.colors.overlay),
    },
    top: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: t.spacing.md,
      justifyContent: 'space-between',
    },
    pet: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
      gap: t.spacing.md,
      minWidth: 0,
    },
    photo: {
      borderRadius: t.radii.input,
      height: t.spacing.thumb,
      width: t.spacing.thumb,
      ...cardShadow(t.colors.overlay),
    },
    petCopy: {
      flex: 1,
      minWidth: 0,
    },
    name: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.heading,
      lineHeight: t.typography.lineHeights.heading,
    },
    breed: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
      marginTop: 2,
    },
    pill: {
      alignItems: 'center',
      borderRadius: t.radii.pill,
      flexDirection: 'row',
      flexShrink: 0,
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    pillPending: {
      backgroundColor: t.colors.primaryFixed,
    },
    pillDone: {
      backgroundColor: t.colors.secondaryContainer,
    },
    pillLabel: {
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      lineHeight: t.typography.lineHeights.overline,
    },
    pillPendingLabel: {
      color: t.colors.onPrimaryFixedVariant,
    },
    pillDoneLabel: {
      color: t.colors.onSecondaryFixedVariant,
    },
    dot: {
      borderRadius: t.radii.pill,
      height: 8,
      width: 8,
    },
    service: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.heading,
      lineHeight: t.typography.lineHeights.heading,
    },
    metaRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    when: {
      color: t.colors.textSecondary,
      flex: 1,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
      paddingEnd: t.spacing.sm,
    },
    meta: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
    },
  }), theme);
}
