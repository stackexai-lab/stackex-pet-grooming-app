import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FlowHeader } from '@/components/FlowHeader';
import {
  defaultScheduleSelection,
  formatSlotTime,
  scheduleDays,
  scheduleSlots,
} from '@/mocks/schedule';
import { createStyles, useTheme, type Theme } from '@/theme';
import { useLanguage } from '@/i18n';

export function ScheduleScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale } = useLanguage();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => scheduleStyles(theme), [theme]);
  const [selectedDay, setSelectedDay] = useState(defaultScheduleSelection.day.getTime());
  const [selectedSlotId, setSelectedSlotId] = useState(defaultScheduleSelection.slotId);
  const [savedAddress, setSavedAddress] = useState<string | null>(null);
  const [draftAddress, setDraftAddress] = useState('');
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const address = savedAddress ?? t('profilePage.address');

  const openAddressEditor = () => {
    setDraftAddress(address);
    setAddressModalVisible(true);
  };

  const saveAddress = () => {
    setSavedAddress(draftAddress.trim() || address);
    setAddressModalVisible(false);
  };

  const selectedDate = scheduleDays.find((day) => day.getTime() === selectedDay) ?? defaultScheduleSelection.day;
  const selectedSlot = scheduleSlots.find((slot) => slot.id === selectedSlotId) ?? scheduleSlots[9];
  const forwardIcon = locale === 'ar' ? 'arrow-back' : 'arrow-forward';
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const calendarDays = getCalendarDays(visibleMonth);

  return (
    <KeyboardAvoidingView
  style={styles.screen}
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
>
      <FlowHeader brandedLogo elevatedBack fitTitle insetTop={insets.top} title={t('schedule.title')} />
      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + theme.spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>{t('schedule.chooseDate')}</Text>
        <View style={styles.calendarCard}>
          <View style={styles.monthRow}>
            <Pressable accessibilityLabel="Previous month" disabled={!hasAvailableMonth(visibleMonth, -1)} onPress={() => setVisibleMonth(addMonths(visibleMonth, -1))} style={styles.monthControl}>
              <MaterialIcons color={theme.colors.textMuted} name={locale === 'ar' ? 'chevron-right' : 'chevron-left'} size={22} />
            </Pressable>
            <Text style={styles.monthLabel}>{new Intl.DateTimeFormat(locale, { month: 'long' }).format(visibleMonth)}</Text>
            <Text style={styles.yearLabel}>{visibleMonth.getFullYear()}</Text>
            <Pressable accessibilityLabel="Next month" disabled={!hasAvailableMonth(visibleMonth, 1)} onPress={() => setVisibleMonth(addMonths(visibleMonth, 1))} style={styles.monthControl}>
              <MaterialIcons color={theme.colors.textMuted} name={locale === 'ar' ? 'chevron-left' : 'chevron-right'} size={22} />
            </Pressable>
          </View>
          <View style={styles.weekRow}>
            {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((day, index) => (
              <Text key={day} style={styles.weekday}>
                {locale === 'ar' ? new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(calendarDays[index]) : day}
              </Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {calendarDays.map((day) => {
              const selected = day.getTime() === selectedDay;
              const available = isAvailableDate(day);
              const inMonth = day.getMonth() === visibleMonth.getMonth();
              return (
                <Pressable key={day.toISOString()} disabled={!available} onPress={() => setSelectedDay(day.getTime())} style={({ pressed }) => [styles.calendarDay, selected && styles.calendarDaySelected, pressed && styles.pressed]}>
                  <Text style={[styles.calendarDayLabel, !inMonth && styles.calendarDayOutside, !available && styles.calendarDayDisabled, selected && styles.calendarDaySelectedLabel]}>{day.getDate()}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <Text style={styles.sectionLabel}>{t('schedule.chooseTime')}</Text>
        <View style={styles.timeCard}>
          <TimeScroller locale={locale} selectedSlotId={selectedSlot.id} onSelect={setSelectedSlotId} styles={styles} theme={theme} />
        </View>
        <Text style={styles.summary}>
          {t('schedule.selection', {
            date: formatSelectedDate(selectedDate, locale),
            time: formatSlotTime(selectedSlot, locale),
          })}
        </Text>
        <View style={styles.addressCard}>
          <View style={styles.addressCopy}>
            <Text style={styles.addressLabel}>{t('profilePage.groomingAddress')}</Text>
            <Text style={styles.addressValue}>{address}</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={openAddressEditor} style={styles.addressEdit}>
            <Text style={styles.addressEditLabel}>{t('profilePage.edit')}</Text>
          </Pressable>
        </View>
        <Pressable
          onPress={() => router.push({
            pathname: '/confirmation',
            params: {
              date: String(selectedDate.getTime()),
              slotId: selectedSlot.id,
            },
          })}
          style={({ pressed }) => [styles.continue, pressed && styles.continuePressed]}
        >
          <Text style={styles.continueLabel}>{t('schedule.continue')}</Text>
          <MaterialIcons color={theme.colors.primaryText} name={forwardIcon} size={20} />
        </Pressable>
      </ScrollView>
      <Modal animationType="slide" transparent visible={addressModalVisible} onRequestClose={() => setAddressModalVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setAddressModalVisible(false)}>
          <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
            <Text style={styles.modalTitle}>{t('profilePage.editAddress')}</Text>
            <TextInput
              autoFocus
              multiline
              onChangeText={setDraftAddress}
              placeholder={t('profilePage.addressPlaceholder')}
              placeholderTextColor={theme.colors.textMuted}
              style={styles.addressInput}
              value={draftAddress}
            />
            <View style={styles.modalActions}>
              <Pressable onPress={() => setAddressModalVisible(false)} style={styles.modalSecondary}>
                <Text style={styles.modalSecondaryLabel}>{t('cancel')}</Text>
              </Pressable>
              <Pressable onPress={saveAddress} style={styles.modalPrimary}>
                <Text style={styles.modalPrimaryLabel}>{t('save')}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

function formatSelectedDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

const TIME_ROW_HEIGHT = 32;

function TimeScroller({ locale, selectedSlotId, onSelect, styles, theme }: { locale: string; selectedSlotId: string; onSelect: (slotId: string) => void; styles: ReturnType<typeof scheduleStyles>; theme: Theme }) {
  const selectedIndex = Math.max(0, scheduleSlots.findIndex((slot) => slot.id === selectedSlotId));
  const selectFocusedSlot = (offsetY: number) => {
    const index = Math.round(offsetY / TIME_ROW_HEIGHT);
    const slot = scheduleSlots[index];
    if (slot && slot.id !== selectedSlotId) onSelect(slot.id);
  };

  return <ScrollView
    contentOffset={{ x: 0, y: selectedIndex * TIME_ROW_HEIGHT }}
    contentContainerStyle={styles.timeScrollerContent}
    decelerationRate="fast"
    nestedScrollEnabled
    onScroll={(event) => selectFocusedSlot(event.nativeEvent.contentOffset.y)}
    showsVerticalScrollIndicator={false}
    snapToInterval={TIME_ROW_HEIGHT}
    scrollEventThrottle={16}
  >
    {scheduleSlots.map((slot) => {
      const selected = slot.id === selectedSlotId;
      return <View key={slot.id} style={styles.timeScrollerRow}>
        <Text style={[styles.timeScrollerLabel, selected && { color: theme.colors.primary, fontFamily: theme.typography.fontFamilies.bodyBold, fontSize: theme.typography.sizes.bodyLarge }]}>
          {formatSlotTime(slot, locale)}
        </Text>
      </View>;
    })}
  </ScrollView>;
}

function getCalendarDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: firstDay.getDay() + daysInMonth }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index - firstDay.getDay() + 1));
  while (days.length < 42) days.push(new Date(month.getFullYear(), month.getMonth(), days.length - firstDay.getDay() + 1));
  return days;
}

function addMonths(month: Date, amount: number) {
  return new Date(month.getFullYear(), month.getMonth() + amount, 1);
}

function hasAvailableMonth(month: Date, amount: number) {
  const target = addMonths(month, amount);
  return scheduleDays.some((day) => day.getFullYear() === target.getFullYear() && day.getMonth() === target.getMonth());
}

function isAvailableDate(date: Date) {
  return scheduleDays.some((day) => day.getTime() === date.getTime());
}

function scheduleStyles(theme: Theme) {
  return createStyles((t) => ({
    screen: {
      backgroundColor: t.colors.background,
      flex: 1,
    },
    content: {
      paddingHorizontal: t.spacing.gutter,
      paddingTop: t.spacing.sm,
    },
    sectionLabel: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
      marginBottom: t.spacing.sm,
    },
    calendarCard: {
      backgroundColor: t.colors.surface,
      borderRadius: t.radii.card,
      marginBottom: t.spacing.lg,
      padding: t.spacing.md,
    },
    monthRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: t.spacing.md,
    },
    monthControl: {
      alignItems: 'center',
      height: 32,
      justifyContent: 'center',
      width: 32,
    },
    monthLabel: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
      marginStart: t.spacing.sm,
    },
    yearLabel: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
      marginEnd: t.spacing.sm,
      marginStart: t.spacing.xs,
    },
    weekRow: {
      flexDirection: 'row',
      marginBottom: t.spacing.xs,
    },
    weekday: {
      color: t.colors.textMuted,
      flex: 1,
      fontFamily: t.typography.fontFamilies.bodyBold,
      fontSize: 10,
      textAlign: 'center',
    },
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    calendarDay: {
      alignItems: 'center',
      height: 40,
      justifyContent: 'center',
      width: '14.2857%',
    },
    calendarDaySelected: {
      backgroundColor: t.colors.primaryContainer,
      borderRadius: t.radii.pill,
    },
    calendarDayLabel: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.caption,
      textAlign: 'center',
    },
    calendarDayOutside: {
      color: t.colors.surfaceHigh,
    },
    calendarDayDisabled: {
      color: t.colors.textMuted,
      opacity: 0.4,
    },
    calendarDaySelectedLabel: {
      color: t.colors.primaryLight,
      fontFamily: t.typography.fontFamilies.bodyBold,
    },
    timeCard: {
      alignItems: 'center',
      backgroundColor: t.colors.surface,
      borderRadius: t.radii.card,
      marginBottom: t.spacing.sm,
      height: 104,
    },
    timeScrollerContent: {
      paddingVertical: 36,
    },
    timeScrollerRow: {
      alignItems: 'center',
      height: 32,
      justifyContent: 'center',
      width: 160,
    },
    timeScrollerLabel: {
      color: t.colors.textMuted,
      fontFamily: t.typography.fontFamilies.display,
      fontSize: t.typography.sizes.body,
      lineHeight: 24,
    },
    summary: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
      marginBottom: t.spacing.sm,
      textAlign: 'center',
    },
    addressCard: {
      alignItems: 'center',
      backgroundColor: t.colors.surface,
      borderColor: t.colors.border,
      borderRadius: t.radii.input,
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: t.spacing.sm,
      paddingHorizontal: t.spacing.md,
      paddingVertical: 12,
    },
    addressCopy: {
      flex: 1,
      paddingEnd: t.spacing.sm,
    },
    addressLabel: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: 10,
      lineHeight: 14,
      textTransform: 'uppercase',
    },
    addressValue: {
  color: t.colors.ink,
  fontFamily: t.typography.fontFamilies.body,
  fontSize: 13,
  lineHeight: 18,
  marginTop: 3,
  minHeight: 36,
},
    addressEdit: {
      paddingHorizontal: 4,
      paddingVertical: 6,
    },
    modalBackdrop: {
      backgroundColor: t.colors.modalBackdrop,
      flex: 1,
      justifyContent: 'flex-end',
    },
    modalCard: {
      backgroundColor: t.colors.background,
      borderTopLeftRadius: t.radii.card,
      borderTopRightRadius: t.radii.card,
      paddingBottom: 28,
      paddingHorizontal: t.spacing.gutter,
      paddingTop: 22,
    },
    modalTitle: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 18,
      lineHeight: 24,
      marginBottom: 14,
    },
    addressInput: {
      backgroundColor: t.colors.surface,
      borderColor: t.colors.border,
      borderRadius: t.radii.input,
      borderWidth: 1,
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: 14,
      minHeight: 88,
      paddingHorizontal: 14,
      paddingVertical: 12,
      textAlignVertical: 'top',
    },
    modalActions: {
      flexDirection: 'row',
      gap: t.spacing.sm,
      marginTop: 16,
    },
    modalSecondary: {
      alignItems: 'center',
      backgroundColor: t.colors.surface,
      borderColor: t.colors.border,
      borderRadius: t.radii.button,
      borderWidth: 1,
      flex: 1,
      justifyContent: 'center',
      minHeight: 46,
    },
    modalSecondaryLabel: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 14,
    },
    modalPrimary: {
      alignItems: 'center',
      backgroundColor: t.colors.primary,
      borderRadius: t.radii.button,
      flex: 1,
      justifyContent: 'center',
      minHeight: 46,
    },
    modalPrimaryLabel: {
      color: t.colors.primaryText,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 14,
    },
    addressEditLabel: {
      color: t.colors.primary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 11,
      lineHeight: 16,
    },
    continue: {
      alignItems: 'center',
      backgroundColor: t.colors.primary,
      borderRadius: t.radii.button,
      elevation: 3,
      flexDirection: 'row',
      gap: t.spacing.sm,
      justifyContent: 'center',
      minHeight: 58,
      shadowColor: t.colors.overlay,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.16,
      shadowRadius: 8,
    },
    continuePressed: {
      opacity: 0.88,
      transform: [{ scale: 0.99 }],
    },
    continueLabel: {
      color: t.colors.primaryText,
      fontFamily: t.typography.fontFamilies.bodyBold,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    pressed: {
      opacity: 0.92,
    },
  }), theme);
}
