import { useMemo } from 'react';
import { I18nManager, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingProgress } from '@/components/BookingProgress';
import { ConfirmationPetCard } from '@/components/ConfirmationPetCard';
import { FlowHeader } from '@/components/FlowHeader';
import { confirmationBookings, confirmationLogistics } from '@/mocks/confirmation';
import { formatSlotTime, scheduleSlots } from '@/mocks/schedule';
import { createStyles, useTheme, type Theme } from '@/theme';
import { useLanguage } from '@/i18n';

export function ConfirmationScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => confirmationStyles(theme), [theme]);
  const params = useLocalSearchParams<{ date?: string | string[]; slotId?: string | string[] }>();
  const dateValue = Number(Array.isArray(params.date) ? params.date[0] : params.date);
  const slotId = Array.isArray(params.slotId) ? params.slotId[0] : params.slotId;
  const arrival = Number.isFinite(dateValue) ? new Date(dateValue) : confirmationLogistics.arrivesAt;
  const slot = scheduleSlots.find((item) => item.id === slotId)
    ?? scheduleSlots.find((item) => item.id === '14:30')
    ?? scheduleSlots[9];
  const arrivalWithSlot = new Date(
    arrival.getFullYear(),
    arrival.getMonth(),
    arrival.getDate(),
    slot.hour,
    slot.minute,
  );
  const arrivalLabel = `${new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(arrivalWithSlot)} · ${new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(arrivalWithSlot)}`;
  const pets = confirmationBookings.map((booking) => booking.name).join(' & ');
  const total = t('confirmation.money', { value: confirmationLogistics.total.toFixed(2) });
  const forward = I18nManager.isRTL ? 'arrow-back' : 'arrow-forward';

  return (
    <View style={styles.screen}>
      <FlowHeader insetTop={insets.top} title={t('confirmation.title')} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, theme.spacing.xxl) }]}
        showsVerticalScrollIndicator={false}
      >
        <BookingProgress aside={t('booking.nextPayment')} current={4} total={4} />
        <View style={styles.intro}>
          <Text style={styles.headline}>
            {t('confirmation.headline')}
            {' '}
            🐾
          </Text>
          <Text style={styles.subtitle}>{t('confirmation.subtitle', { pets })}</Text>
        </View>
        <View style={styles.stack}>
          {confirmationBookings.map((booking) => (
            <ConfirmationPetCard booking={booking} key={booking.id} />
          ))}
        </View>
        <View style={styles.logistics}>
          <View style={styles.line}>
            <View style={[styles.lineIcon, styles.iconCool]}>
              <MaterialIcons color={theme.colors.onPrimaryFixed} name="calendar-today" size={20} />
            </View>
            <View style={styles.lineCopy}>
              <Text style={[styles.lineLabel, !isRTL && styles.uppercase]}>{t('confirmation.dateArrival')}</Text>
              <Text style={styles.lineTitle}>{arrivalLabel}</Text>
            </View>
          </View>
        </View>
       
        <Pressable
          onPress={() => router.push('/payment')}
          style={({ pressed }) => [styles.pay, pressed && styles.pressed]}
        >
          <MaterialIcons color={theme.colors.primaryText} name="lock" size={20} />
          <Text style={styles.payLabel}>{t('confirmation.proceedToPayment', { total })}</Text>
          <MaterialIcons color={theme.colors.primaryText} name={forward} size={20} />
        </Pressable>
       
      </ScrollView>
    </View>
  );
}

function confirmationStyles(theme: Theme) {
  return createStyles((t) => ({
    screen: {
      backgroundColor: t.colors.background,
      flex: 1,
    },
    content: {
      paddingHorizontal: t.spacing.gutter,
      paddingTop: t.spacing.sm,
    },
    intro: {
      marginBottom: t.spacing.lg,
      marginTop: t.spacing.sm,
    },
    headline: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.display,
      fontSize: t.typography.sizes.headline,
      lineHeight: t.typography.lineHeights.headline,
    },
    subtitle: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
      marginTop: t.spacing.xs,
    },
    stack: {
      gap: t.spacing.md,
    },
    logistics: {
      backgroundColor: t.colors.primaryFixedSoft,
      borderRadius: t.radii.card,
      marginTop: t.spacing.md,
      padding: t.spacing.gutter,
    },
    line: {
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderRadius: t.radii.input,
      flexDirection: 'row',
      gap: t.spacing.sm,
      padding: t.spacing.sm,
    },
    lineIcon: {
      alignItems: 'center',
      borderRadius: t.radii.pill,
      height: 36,
      justifyContent: 'center',
      width: 36,
    },
    iconCool: {
      backgroundColor: t.colors.primaryFixed,
    },
    lineCopy: {
      flex: 1,
      minWidth: 0,
    },
    lineLabel: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      letterSpacing: 0.6,
      lineHeight: t.typography.lineHeights.overline,
    },
    uppercase: {
      textTransform: 'uppercase',
    },
    lineTitle: {
      color: t.colors.ink,
      flexShrink: 1,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.bodyLarge,
      lineHeight: t.typography.lineHeights.body,
    },
    note: {
      backgroundColor: t.colors.surfaceSecondary,
      borderRadius: t.radii.card,
      flexDirection: 'row',
      gap: t.spacing.sm,
      marginTop: t.spacing.md,
      padding: t.spacing.sm,
    },
    noteIcon: {
      alignItems: 'center',
      backgroundColor: t.colors.surface,
      borderRadius: t.radii.pill,
      height: 28,
      justifyContent: 'center',
      marginTop: 2,
      width: 28,
    },
    noteCopy: {
      flex: 1,
      minWidth: 0,
    },
    noteTitle: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
    },
    noteBody: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
      marginTop: 2,
    },
    pay: {
      alignItems: 'center',
      backgroundColor: t.colors.primary,
      borderRadius: t.radii.button,
      flexDirection: 'row',
      gap: t.spacing.sm,
      height: 54,
      justifyContent: 'center',
      marginTop: t.spacing.xl,
    },
    payLabel: {
      color: t.colors.primaryText,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    footerNote: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      lineHeight: t.typography.lineHeights.overline,
      marginTop: t.spacing.sm,
      textAlign: 'center',
    },
    pressed: {
      opacity: 0.92,
    },
  }), theme);
}
