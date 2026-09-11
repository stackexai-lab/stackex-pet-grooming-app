import { useMemo, useState } from 'react';
import { I18nManager, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingProgress } from '@/components/BookingProgress';
import { FlowHeader } from '@/components/FlowHeader';
import { ServicePackageCard } from '@/components/ServicePackageCard';
import { groomingServices } from '@/mocks/services';
import { createStyles, useTheme, type Theme } from '@/theme';

export function SelectServiceScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => selectServiceStyles(theme), [theme]);
  const params = useLocalSearchParams<{ browse?: string | string[] }>();
  const browse = isBrowseParam(params.browse);
  const [selectedId, setSelectedId] = useState(groomingServices[0].id);
  const selected = groomingServices.find((service) => service.id === selectedId) ?? groomingServices[0];
  const forward = I18nManager.isRTL ? 'arrow-back' : 'arrow-forward';

  function openDetails(serviceId: string) {
    router.push({
      pathname: '/service-details',
      params: browse ? { serviceId, browse: '1' } : { serviceId },
    });
  }

  return (
    <View style={styles.screen}>
      <FlowHeader insetTop={insets.top} title={t('selectService.title')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {browse ? null : (
          <BookingProgress
            aside={t('booking.nextSchedule')}
            current={2}
            total={4}
          />
        )}
        <View style={styles.intro}>
          <Text style={styles.headline}>{t('selectService.headline')}</Text>
          <Text style={styles.subtitle}>{t('selectService.subtitle')}</Text>
        </View>
        <View style={styles.list}>
          {groomingServices.map((service) => (
            <ServicePackageCard
              key={service.id}
              onPress={() => {
                setSelectedId(service.id);
                openDetails(service.id);
              }}
              selected={service.id === selectedId}
              service={service}
            />
          ))}
          <View style={styles.promise}>
            <View style={styles.promiseIcon}>
              <MaterialIcons color={theme.colors.primaryText} name="health-and-safety" size={20} />
            </View>
            <View style={styles.promiseCopy}>
              <Text style={styles.promiseTitle}>{t('selectService.promiseTitle')}</Text>
              <Text style={styles.promiseBody}>{t('selectService.promiseBody')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {browse ? null : (
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, theme.spacing.md) }]}>
        <View style={styles.summary}>
          <View style={styles.summaryName}>
            <Text style={styles.summaryLabel}>{t('selectService.selected')}</Text>
            <Text style={styles.summaryValue}>{t(selected.titleKey)}</Text>
          </View>
          <Text style={styles.summaryPrice}>{t('home.price', { value: selected.price })}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push({ pathname: '/service-details', params: { serviceId: selected.id } })}
          style={({ pressed }) => [styles.continue, pressed && styles.continuePressed]}
        >
          <Text style={styles.continueLabel}>{t('continue')}</Text>
          <MaterialIcons color={theme.colors.primaryText} name={forward} size={20} />
        </Pressable>
      </View>
      )}
    </View>
  );
}

function isBrowseParam(value?: string | string[]) {
  const flag = Array.isArray(value) ? value[0] : value;
  return flag === '1';
}

function selectServiceStyles(theme: Theme) {
  return createStyles((t) => ({
    screen: {
      backgroundColor: t.colors.background,
      flex: 1,
    },
    content: {
      paddingBottom: t.spacing.lg,
      paddingHorizontal: t.spacing.gutter,
      paddingTop: t.spacing.md,
    },
    intro: {
      marginBottom: t.spacing.xl,
      marginTop: t.spacing.md,
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
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
      marginTop: t.spacing.xs,
    },
    list: {
      gap: t.spacing.md,
    },
    promise: {
      alignItems: 'center',
      backgroundColor: t.colors.secondaryContainer,
      borderRadius: t.radii.card,
      flexDirection: 'row',
      gap: t.spacing.sm,
      padding: t.spacing.md,
    },
    promiseIcon: {
      alignItems: 'center',
      backgroundColor: t.colors.secondary,
      borderRadius: t.radii.pill,
      height: t.spacing.icon,
      justifyContent: 'center',
      width: t.spacing.icon,
    },
    promiseCopy: {
      flex: 1,
      minWidth: 0,
    },
    promiseTitle: {
      color: t.colors.onSecondaryContainer,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
    },
    promiseBody: {
      color: t.colors.onSecondaryContainer,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
      opacity: 0.9,
    },
    footer: {
      backgroundColor: t.colors.background,
      gap: t.spacing.sm,
      paddingHorizontal: t.spacing.gutter,
      paddingTop: t.spacing.md,
    },
    summary: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: t.spacing.xs,
    },
    summaryName: {
      alignItems: 'center',
      flexDirection: 'row',
      flexShrink: 1,
      gap: t.spacing.sm,
    },
    summaryLabel: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
    },
    summaryValue: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
    },
    summaryPrice: {
      color: t.colors.primary,
      fontFamily: t.typography.fontFamilies.display,
      fontSize: t.typography.sizes.heading,
      lineHeight: t.typography.lineHeights.heading,
    },
    continue: {
      alignItems: 'center',
      backgroundColor: t.colors.primary,
      borderRadius: t.radii.button,
      flexDirection: 'row',
      gap: t.spacing.sm,
      height: t.spacing.control,
      justifyContent: 'center',
    },
    continuePressed: {
      opacity: 0.95,
    },
    continueLabel: {
      color: t.colors.primaryText,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
  }), theme);
}
