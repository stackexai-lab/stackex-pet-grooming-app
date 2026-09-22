import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingProgress } from '@/components/BookingProgress';
import { FlowHeader } from '@/components/FlowHeader';
import { cardShadow } from '@/components/ServiceCard';
import { useLanguage } from '@/i18n';
import { serviceAddons, serviceDetailCopy } from '@/mocks/serviceDetails';
import { groomingServices } from '@/mocks/services';
import { createStyles, useTheme, type Theme } from '@/theme';

export function ServiceDetailsScreen() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => detailsStyles(theme), [theme]);
  const params = useLocalSearchParams<{ serviceId?: string | string[]; browse?: string | string[] }>();
  const serviceId = Array.isArray(params.serviceId) ? params.serviceId[0] : params.serviceId;
  const browse = (Array.isArray(params.browse) ? params.browse[0] : params.browse) === '1';
  const service = groomingServices.find((item) => item.id === serviceId)
    ?? groomingServices.find((item) => item.id === 'fullGroom')
    ?? groomingServices[0];
  const copy = serviceDetailCopy(service, browse);
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [nextOpen, setNextOpen] = useState(false);
  const dim = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(1)).current;
  const closing = useRef(false);
  const nativeDriver = Platform.OS !== 'web';
  const addonTotal = serviceAddons
    .filter((addon) => addonIds.includes(addon.id))
    .reduce((sum, addon) => sum + addon.price, 0);
  const total = copy.price + addonTotal;
  const forward = isRTL ? 'arrow-back' : 'arrow-forward';
  const bookingParams = {
    serviceId: service.id,
    addons: addonIds.join(','),
  };

  useEffect(() => {
    if (!nextOpen) return;
    closing.current = false;
    Animated.parallel([
      Animated.timing(dim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: nativeDriver,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: nativeDriver,
      }),
    ]).start();
  }, [dim, nativeDriver, nextOpen, slide]);

  function toggleAddon(id: string) {
    setAddonIds((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
  }

  function openNextStep() {
    dim.setValue(0);
    slide.setValue(1);
    setNextOpen(true);
  }

  function closeNextStep(after?: () => void) {
    if (!nextOpen || closing.current) return;
    closing.current = true;
    Animated.parallel([
      Animated.timing(dim, {
        toValue: 0,
        duration: 160,
        easing: Easing.in(Easing.quad),
        useNativeDriver: nativeDriver,
      }),
      Animated.timing(slide, {
        toValue: 1,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: nativeDriver,
      }),
    ]).start(({ finished }) => {
      if (!finished) return;
      setNextOpen(false);
      closing.current = false;
      after?.();
    });
  }

  return (
    <View style={styles.screen}>
      <FlowHeader
        elevatedBack
        fitTitle
        insetTop={insets.top}
        title={t('serviceDetails.title')}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {browse ? null : (
          <BookingProgress aside={t('booking.nextSchedule')} current={2} total={4} />
        )}
        <View style={styles.hero}>
          <Image source={service.photo} style={styles.heroPhoto} resizeMode="cover" />
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeLabel}>{t(copy.badgeKey)}</Text>
          </View>
        </View>
        <View style={styles.heading}>
          <Text style={styles.name}>{t(copy.titleKey)}</Text>
          {browse ? (
            <Text style={styles.listedPrice}>{t('home.price', { value: copy.price })}</Text>
          ) : null}
        </View>
        <Text style={styles.blurb}>{t(copy.blurbKey)}</Text>
        <View style={styles.chips}>
          <View style={styles.chip}>
            <MaterialIcons color={theme.colors.secondary} name="schedule" size={16} />
            <Text style={styles.chipLabel}>{t('selectService.duration', { minutes: service.minutes })}</Text>
          </View>
          {browse ? null : (
            <View style={[styles.chip, styles.chipPrice]}>
              <MaterialIcons color={theme.colors.onSecondaryContainer} name="payments" size={16} />
              <Text style={styles.chipPriceLabel}>{t('serviceDetails.fromPrice', { value: copy.price })}</Text>
            </View>
          )}
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
                style={styles.addon}
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
      {browse ? (
        <View style={[styles.browseFooter, { paddingBottom: Math.max(insets.bottom, theme.spacing.md) }]}>
          <View style={styles.browsePriceRow}>
            <Text style={styles.totalKicker}>
              {t(addonTotal === 0 ? 'serviceDetails.startingAt' : 'serviceDetails.totalEst')}
            </Text>
            <Text style={styles.total}>{t('home.price', { value: total })}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/select-pet')}
            style={styles.browseBook}
          >
            <MaterialIcons color={theme.colors.primaryText} name="event" size={20} />
            <Text style={styles.selectLabel}>{t('home.bookGrooming')}</Text>
          </Pressable>
        </View>
      ) : nextOpen ? null : (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, theme.spacing.md) }]}>
          <View>
            <Text style={styles.totalKicker}>{t('serviceDetails.totalEst')}</Text>
            <Text style={styles.total}>{t('home.price', { value: total })}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={openNextStep}
            style={styles.select}
          >
            <Text style={styles.selectLabel}>{t('serviceDetails.selectService')}</Text>
            <MaterialIcons color={theme.colors.primaryText} name={forward} size={20} />
          </Pressable>
        </View>
      )}
      <Modal
        animationType="none"
        onRequestClose={() => closeNextStep()}
        presentationStyle="overFullScreen"
        statusBarTranslucent
        transparent
        visible={nextOpen}
      >
        <View pointerEvents="box-none" style={styles.modalRoot}>
          <Animated.View
            style={[
              styles.backdrop,
              { opacity: dim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.45] }) },
            ]}
          >
            <Pressable onPress={() => closeNextStep()} style={styles.backdropHit} />
          </Animated.View>
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.sheetDock,
              {
                paddingBottom: Math.max(insets.bottom, theme.spacing.md),
                transform: [{
                  translateY: slide.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 280],
                  }),
                }],
              },
            ]}
          >
            <View style={styles.sheet}>
              <View style={styles.handle} />
              <Pressable
                accessibilityRole="button"
                onPress={() => closeNextStep(() => router.push('/select-pet'))}
                style={({ pressed }) => [styles.sheetSecondary, pressed && styles.pressed]}
              >
                <MaterialIcons color={theme.colors.primary} name="add" size={20} />
                <Text style={styles.sheetSecondaryLabel}>{t('serviceDetails.addAnotherPet')}</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => closeNextStep(() => router.push({
                  pathname: '/schedule',
                  params: bookingParams,
                }))}
                style={({ pressed }) => [styles.sheetPrimary, pressed && styles.pressed]}
              >
                <Text style={styles.sheetPrimaryLabel}>{t('serviceDetails.continueToSchedule')}</Text>
                <MaterialIcons color={theme.colors.primaryText} name={forward} size={20} />
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
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
    heading: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: t.spacing.md,
      justifyContent: 'space-between',
      marginTop: t.spacing.sm,
    },
    name: {
      color: t.colors.ink,
      flex: 1,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.headline,
      lineHeight: t.typography.lineHeights.headline,
    },
    listedPrice: {
      color: t.colors.primary,
      fontFamily: t.typography.fontFamilies.display,
      fontSize: t.typography.sizes.headline,
      lineHeight: t.typography.lineHeights.headline,
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
    browseFooter: {
      backgroundColor: t.colors.surface,
      borderTopColor: t.colors.surfaceContainer,
      borderTopWidth: 1,
      gap: t.spacing.md,
      paddingHorizontal: t.spacing.gutter,
      paddingTop: t.spacing.md,
      ...cardShadow(t.colors.overlay),
    },
    browsePriceRow: {
      alignItems: 'baseline',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    browseBook: {
      alignItems: 'center',
      backgroundColor: t.colors.primary,
      borderRadius: t.radii.button,
      flexDirection: 'row',
      gap: t.spacing.sm,
      height: t.spacing.control,
      justifyContent: 'center',
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
      backgroundColor: t.colors.primary,
      borderRadius: t.radii.button,
      flex: 1,
      flexDirection: 'row',
      gap: t.spacing.sm,
      height: t.spacing.control,
      justifyContent: 'center',
    },
    selectLabel: {
      color: t.colors.primaryText,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    modalRoot: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: t.colors.overlay,
    },
    backdropHit: {
      flex: 1,
    },
    sheetDock: {
      bottom: 0,
      left: 0,
      paddingHorizontal: t.spacing.gutter,
      position: 'absolute',
      right: 0,
    },
    sheet: {
      alignSelf: 'center',
      backgroundColor: t.colors.surface,
      borderRadius: t.radii.hero,
      elevation: 16,
      gap: t.spacing.sm,
      paddingBottom: t.spacing.md,
      paddingHorizontal: t.spacing.md,
      paddingTop: t.spacing.sm,
      shadowColor: t.colors.overlay,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.22,
      shadowRadius: 24,
      width: '100%',
    },
    handle: {
      alignSelf: 'center',
      backgroundColor: t.colors.surfaceHigh,
      borderRadius: t.radii.pill,
      height: 4,
      marginBottom: t.spacing.xs,
      width: 40,
    },
    sheetPrimary: {
      alignItems: 'center',
      backgroundColor: t.colors.primary,
      borderRadius: t.radii.button,
      flexDirection: 'row',
      gap: t.spacing.sm,
      height: t.spacing.control,
      justifyContent: 'center',
    },
    sheetPrimaryLabel: {
      color: t.colors.primaryText,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    sheetSecondary: {
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderColor: t.colors.primaryBorder,
      borderRadius: t.radii.button,
      borderStyle: 'dashed',
      borderWidth: 1.5,
      flexDirection: 'row',
      gap: t.spacing.sm,
      height: 48,
      justifyContent: 'center',
    },
    sheetSecondaryLabel: {
      color: t.colors.primary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    pressed: {
      opacity: 0.94,
    },
  }), theme);
}
