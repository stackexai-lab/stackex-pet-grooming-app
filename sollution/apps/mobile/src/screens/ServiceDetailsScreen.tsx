import { useMemo, useState } from 'react';
import { I18nManager, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CenterHeader } from '@/components/CenterHeader';
import { cardShadow } from '@/components/ServiceCard';
import { serviceAddons, serviceDetailCopy } from '@/mocks/serviceDetails';
import { groomingServices } from '@/mocks/services';
import { createStyles, useTheme, type Theme } from '@/theme';

export function ServiceDetailsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => detailsStyles(theme), [theme]);
  const params = useLocalSearchParams<{ serviceId?: string | string[] }>();
  const serviceId = Array.isArray(params.serviceId) ? params.serviceId[0] : params.serviceId;
  const service = groomingServices.find((item) => item.id === serviceId)
    ?? groomingServices.find((item) => item.id === 'fullGroom')
    ?? groomingServices[0];
  const copy = serviceDetailCopy(service);
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const addonTotal = serviceAddons
    .filter((addon) => addonIds.includes(addon.id))
    .reduce((sum, addon) => sum + addon.price, 0);
  const total = copy.price + addonTotal;
  const forward = I18nManager.isRTL ? 'arrow-back' : 'arrow-forward';

  function toggleAddon(id: string) {
    setAddonIds((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
  }

  return (
    <View style={styles.screen}>
      <CenterHeader
        elevatedBack
        insetTop={insets.top}
        profile
        title={t('serviceDetails.title')}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={service.photo} style={styles.heroPhoto} resizeMode="cover" />
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeLabel}>{t(copy.badgeKey)}</Text>
          </View>
        </View>
        <Text style={styles.name}>{t(copy.titleKey)}</Text>
        <Text style={styles.blurb}>{t(copy.blurbKey)}</Text>
        <View style={styles.chips}>
          <View style={styles.chip}>
            <MaterialIcons color={theme.colors.secondary} name="schedule" size={16} />
            <Text style={styles.chipLabel}>{t('selectService.duration', { minutes: service.minutes })}</Text>
          </View>
          <View style={[styles.chip, styles.chipPrice]}>
            <MaterialIcons color={theme.colors.onSecondaryContainer} name="payments" size={16} />
            <Text style={styles.chipPriceLabel}>{t('serviceDetails.fromPrice', { value: copy.price })}</Text>
          </View>
          <View style={styles.chip}>
            <MaterialIcons color={theme.colors.primary} name="pets" size={16} />
            <Text style={styles.chipLabel}>{t('serviceDetails.allBreeds')}</Text>
          </View>
        </View>
        <View style={styles.addonsHeader}>
          <Text style={styles.addonsTitle}>{t('serviceDetails.addons')}</Text>
          <Text style={styles.addonsHint}>{t('serviceDetails.optional')}</Text>
        </View>
        <View style={styles.addons}>
          {serviceAddons.map((addon) => {
            const on = addonIds.includes(addon.id);
            return (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: on }}
                key={addon.id}
                onPress={() => toggleAddon(addon.id)}
                style={({ pressed }) => [
                  styles.addon,
                  on && styles.addonOn,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.addonLead}>
                  <View style={[styles.check, on && styles.checkOn]}>
                    <MaterialIcons
                      color={on ? theme.colors.primaryText : 'transparent'}
                      name="check"
                      size={16}
                    />
                  </View>
                  <View style={styles.addonCopy}>
                    <Text style={styles.addonTitle}>{t(addon.titleKey)}</Text>
                    <Text style={styles.addonHint}>{t(addon.hintKey)}</Text>
                  </View>
                </View>
                <Text style={styles.addonPrice}>{t('serviceDetails.addonPrice', { value: addon.price })}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, theme.spacing.md) }]}>
        <View>
          <Text style={styles.totalKicker}>{t('serviceDetails.totalEst')}</Text>
          <Text style={styles.total}>{t('home.price', { value: total })}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push({
            pathname: '/schedule',
            params: {
              serviceId: service.id,
              addons: addonIds.join(','),
            },
          })}
          style={({ pressed }) => [styles.select, pressed && styles.selectPressed]}
        >
          <Text style={styles.selectLabel}>{t('serviceDetails.selectService')}</Text>
          <MaterialIcons color={theme.colors.primaryText} name={forward} size={20} />
        </Pressable>
      </View>
    </View>
  );
}

function detailsStyles(theme: Theme) {
  return createStyles((t) => ({
    screen: {
      backgroundColor: t.colors.background,
      flex: 1,
    },
    content: {
      gap: t.spacing.sm,
      paddingBottom: t.spacing.lg,
      paddingHorizontal: t.spacing.gutter,
      paddingTop: t.spacing.md,
    },
    hero: {
      aspectRatio: 16 / 10,
      backgroundColor: t.colors.surfaceSecondary,
      borderRadius: t.radii.hero,
      overflow: 'hidden',
      width: '100%',
      ...cardShadow(t.colors.overlay),
    },
    heroPhoto: {
      height: '100%',
      width: '100%',
    },
    badge: {
      alignItems: 'center',
      backgroundColor: t.colors.surface,
      borderRadius: t.radii.pill,
      end: 12,
      flexDirection: 'row',
      gap: 6,
      paddingHorizontal: t.spacing.sm,
      paddingVertical: 4,
      position: 'absolute',
      top: 12,
    },
    badgeDot: {
      backgroundColor: t.colors.secondary,
      borderRadius: t.radii.pill,
      height: 8,
      width: 8,
    },
    badgeLabel: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      lineHeight: t.typography.lineHeights.overline,
    },
    name: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.headline,
      lineHeight: t.typography.lineHeights.headline,
      marginTop: t.spacing.sm,
    },
    blurb: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.label,
      lineHeight: 22,
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: t.spacing.sm,
      marginTop: t.spacing.xs,
    },
    chip: {
      alignItems: 'center',
      backgroundColor: t.colors.surfaceContainer,
      borderRadius: t.radii.pill,
      flexDirection: 'row',
      gap: 6,
      paddingHorizontal: t.spacing.sm,
      paddingVertical: 6,
    },
    chipPrice: {
      backgroundColor: t.colors.secondaryContainer,
    },
    chipLabel: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
    },
    chipPriceLabel: {
      color: t.colors.onSecondaryContainer,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
    },
    addonsHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: t.spacing.md,
    },
    addonsTitle: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.heading,
      lineHeight: t.typography.lineHeights.heading,
    },
    addonsHint: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      lineHeight: t.typography.lineHeights.overline,
    },
    addons: {
      gap: t.spacing.sm,
    },
    addon: {
      alignItems: 'center',
      backgroundColor: t.colors.surface,
      borderRadius: t.radii.input,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: t.spacing.md,
      ...cardShadow(t.colors.overlay),
    },
    addonOn: {
      backgroundColor: t.colors.primaryFixedSoft,
    },
    addonLead: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
      gap: t.spacing.md,
      minWidth: 0,
      paddingEnd: t.spacing.sm,
    },
    check: {
      alignItems: 'center',
      backgroundColor: t.colors.surfaceContainer,
      borderRadius: t.radii.pill,
      height: 24,
      justifyContent: 'center',
      width: 24,
    },
    checkOn: {
      backgroundColor: t.colors.primary,
    },
    addonCopy: {
      flex: 1,
      minWidth: 0,
    },
    addonTitle: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    addonHint: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
    },
    addonPrice: {
      color: t.colors.primary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    footer: {
      alignItems: 'center',
      backgroundColor: t.colors.background,
      flexDirection: 'row',
      gap: t.spacing.md,
      paddingHorizontal: t.spacing.gutter,
      paddingTop: t.spacing.sm,
    },
    totalKicker: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      letterSpacing: 0.8,
      lineHeight: t.typography.lineHeights.overline,
      textTransform: 'uppercase',
    },
    total: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.display,
      fontSize: t.typography.sizes.headline,
      lineHeight: t.typography.lineHeights.headline,
    },
    select: {
      alignItems: 'center',
      backgroundColor: t.colors.primaryContainer,
      borderRadius: t.radii.button,
      flex: 1,
      flexDirection: 'row',
      gap: t.spacing.sm,
      height: t.spacing.control,
      justifyContent: 'center',
      maxWidth: 240,
    },
    selectPressed: {
      backgroundColor: t.colors.primary,
    },
    selectLabel: {
      color: t.colors.primaryText,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    pressed: {
      opacity: 0.94,
    },
  }), theme);
}
