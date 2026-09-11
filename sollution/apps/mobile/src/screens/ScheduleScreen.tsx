import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FlowHeader } from '@/components/FlowHeader';
import { cardShadow } from '@/components/ServiceCard';
import { homeMock } from '@/mocks/home';
import {
  defaultScheduleSelection,
  formatDayChip,
  formatDaySummary,
  formatSlotTime,
  scheduleDays,
  scheduleSlots,
  type TimeSlot,
} from '@/mocks/schedule';
import { groomingServices } from '@/mocks/services';
import { createStyles, useTheme, type Theme } from '@/theme';
import { useLanguage } from '@/i18n';

export function ScheduleScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale } = useLanguage();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => scheduleStyles(theme), [theme]);
  const params = useLocalSearchParams<{ serviceId?: string | string[] }>();
  const serviceId = Array.isArray(params.serviceId) ? params.serviceId[0] : params.serviceId;
  const service = groomingServices.find((item) => item.id === serviceId) ?? groomingServices[1];
  const [selectedDay, setSelectedDay] = useState(defaultScheduleSelection.day.getTime());
  const [selectedSlotId, setSelectedSlotId] = useState(defaultScheduleSelection.slotId);

  const selectedDate = scheduleDays.find((day) => day.getTime() === selectedDay) ?? defaultScheduleSelection.day;
  const selectedSlot = scheduleSlots.find((slot) => slot.id === selectedSlotId) ?? scheduleSlots[9];
  const duration = t('selectService.duration', { minutes: service.minutes });

  return (
    <View style={styles.screen}>
      <FlowHeader brandedLogo elevatedBack insetTop={insets.top} title={t('schedule.title')} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, theme.spacing.xl) }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.context}>
          {t('schedule.context', {
            pet: homeMock.pet.name,
            service: t(service.titleKey),
            duration,
          })}
        </Text>
        <View style={styles.dates}>
          {scheduleDays.map((day) => {
            const selected = day.getTime() === selectedDay;
            const chip = formatDayChip(day, locale);
            return (
              <Pressable
                key={day.toISOString()}
                onPress={() => setSelectedDay(day.getTime())}
                style={({ pressed }) => [
                  styles.dateChip,
                  selected && styles.dateChipOn,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.dateWeekday, selected && styles.dateOn]}>{chip.weekday}</Text>
                <Text style={[styles.dateDay, selected && styles.dateOn]}>{chip.day}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.slots}>
          {scheduleSlots.map((slot) => (
            <TimeChip
              key={slot.id}
              locale={locale}
              onPress={() => setSelectedSlotId(slot.id)}
              selected={slot.id === selectedSlotId}
              slot={slot}
            />
          ))}
        </View>
        <Text style={styles.summary}>
          {t('schedule.selection', {
            date: formatDaySummary(selectedDate, locale),
            time: formatSlotTime(selectedSlot, locale),
          })}
        </Text>
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
          <Text style={styles.continueLabel}>{t('continue')}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function TimeChip({
  locale,
  onPress,
  selected,
  slot,
}: {
  locale: string;
  onPress: () => void;
  selected: boolean;
  slot: TimeSlot;
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => scheduleStyles(theme), [theme]);
  const label = formatSlotTime(slot, locale);

  if (!slot.available) {
    return (
      <View style={[styles.timeChip, styles.timeChipDisabled]}>
        <Text style={styles.timeDisabled}>{label}</Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.timeChip,
        selected ? styles.timeChipOn : styles.timeChipOff,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.timeLabel, selected && styles.timeLabelOn]}>{label}</Text>
    </Pressable>
  );
}

function scheduleStyles(theme: Theme) {
  return createStyles((t) => ({
    screen: {
      backgroundColor: t.colors.background,
      flex: 1,
    },
    content: {
      paddingHorizontal: t.spacing.gutter,
      paddingTop: t.spacing.md,
    },
    context: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
      marginBottom: t.spacing.lg,
      textAlign: 'center',
    },
    dates: {
      flexDirection: 'row',
      gap: t.spacing.sm,
      marginBottom: t.spacing.xl,
    },
    dateChip: {
      alignItems: 'center',
      backgroundColor: t.colors.surface,
      borderRadius: t.radii.card,
      flex: 1,
      paddingVertical: 12,
      ...cardShadow(t.colors.overlay),
    },
    dateChipOn: {
      backgroundColor: t.colors.primaryContainer,
    },
    dateWeekday: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      lineHeight: t.typography.lineHeights.overline,
    },
    dateDay: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.display,
      fontSize: t.typography.sizes.heading,
      lineHeight: t.typography.lineHeights.heading,
      marginTop: t.spacing.xs,
    },
    dateOn: {
      color: t.colors.primaryText,
    },
    slots: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: t.spacing.xl,
    },
    timeChip: {
      alignItems: 'center',
      borderRadius: t.radii.pill,
      justifyContent: 'center',
      paddingVertical: 14,
      width: '47.5%',
    },
    timeChipOff: {
      backgroundColor: t.colors.surface,
      ...cardShadow(t.colors.overlay),
    },
    timeChipOn: {
      backgroundColor: t.colors.primaryContainer,
    },
    timeChipDisabled: {
      backgroundColor: t.colors.surfaceSecondary,
    },
    timeLabel: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyBold,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    timeLabelOn: {
      color: t.colors.primaryText,
    },
    timeDisabled: {
      color: t.colors.textMuted,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    summary: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
      marginBottom: t.spacing.md,
      textAlign: 'center',
    },
    continue: {
      alignItems: 'center',
      backgroundColor: t.colors.primaryContainer,
      borderRadius: t.radii.button,
      height: 56,
      justifyContent: 'center',
    },
    continuePressed: {
      backgroundColor: t.colors.primary,
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
