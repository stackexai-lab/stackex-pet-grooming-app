import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, I18nManager, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/AppHeader';
import { BottomTabBar } from '@/components/BottomTabBar';
import { ServiceCard, cardShadow } from '@/components/ServiceCard';
import { homeImages, homeMock } from '@/mocks/home';
import { createStyles, useTheme, type Theme } from '@/theme';
import { useLanguage } from '@/i18n';

export function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => homeStyles(theme), [theme]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [baseIndex, setBaseIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState(0);
  const heroes = homeImages.heroes;
  const heroIndexRef = useRef(0);
  const fade = useRef(new Animated.Value(0)).current;
  const zoom = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const tick = setInterval(() => {
      const next = (heroIndexRef.current + 1) % heroes.length;
      setIncomingIndex(next);
      setHeroIndex(next);
      fade.setValue(0);
      zoom.setValue(1.08);
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(zoom, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished) return;
        heroIndexRef.current = next;
        setBaseIndex(next);
        requestAnimationFrame(() => fade.setValue(0));
      });
    }, 2000);

    return () => clearInterval(tick);
  }, [fade, heroes.length, zoom]);

  const greetingKey = greetingTranslationKey();
  const dateLabel = formatHomeDate(homeMock.date, locale);
  const appointmentTime = formatAppointmentTime(homeMock.appointmentAt, locale);
  const chevron = I18nManager.isRTL ? 'chevron-left' : 'chevron-right';

  return (
    <View style={styles.screen}>
      <AppHeader insetTop={insets.top} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greetingRow}>
          <View style={styles.greetingCopy}>
            <View style={styles.greetingLine}>
              <Text style={styles.greeting}>{t(greetingKey, { name: homeMock.guestName })}</Text>
              <Text style={styles.paw}>🐾</Text>
            </View>
            <Text style={styles.subtitle}>
              {dateLabel}
              {' • '}
              {t('home.spaDayTag')}
            </Text>
          </View>
          <View style={styles.spa}>
            <MaterialIcons color={theme.colors.onSecondaryContainer} name="spa" size={20} />
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroMedia}>
            <Image source={heroes[baseIndex]} style={styles.heroImage} resizeMode="cover" />
            <Animated.Image
              source={heroes[incomingIndex]}
              style={[styles.heroImage, styles.heroIncoming, { opacity: fade, transform: [{ scale: zoom }] }]}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', theme.colors.overlay]}
              locations={[0.35, 1]}
              style={styles.heroScrim}
            />
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeLabel}>{t('home.certifiedStylists')}</Text>
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>{t('home.heroTitle')}</Text>
              <Text numberOfLines={1} style={styles.heroSubtitle}>{t('home.heroSubtitle')}</Text>
              <View style={styles.heroDots}>
                {heroes.map((_, index) => (
                  <View
                    key={index}
                    style={[styles.heroDot, index === heroIndex && styles.heroDotOn]}
                  />
                ))}
              </View>
            </View>
          </View>
          <View style={styles.heroActions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/select-pet')}
              style={({ pressed }) => [styles.book, pressed && styles.bookPressed]}
            >
              <MaterialIcons color={theme.colors.primaryText} name="event" size={20} />
              <Text style={styles.bookLabel}>{t('home.bookGrooming')}</Text>
            </Pressable>
            
             
            
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.popularServices')}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push({ pathname: '/select-service', params: { browse: '1' } })}
              style={styles.viewMenu}
            >
              <Text style={styles.viewMenuLabel}>{t('home.viewMenu')}</Text>
              <MaterialIcons color={theme.colors.primary} name={chevron} size={16} />
            </Pressable>
          </View>
          <View style={styles.serviceGrid}>
            {homeMock.services.map((service) => (
              <ServiceCard
                key={service.id}
                onPress={() => router.push({
                  pathname: '/service-details',
                  params: { serviceId: service.id, browse: '1' },
                })}
                service={service}
              />
            ))}
          </View>
        </View>

        <View style={styles.schedule}>
          <View style={styles.scheduleHeader}>
            <Text style={[styles.scheduleKicker, isRTL && styles.kickerRtl]}>{t('home.yourSchedule')}</Text>
            <View style={styles.confirmed}>
              <View style={styles.confirmedDot} />
              <Text style={styles.confirmedLabel}>{t('home.confirmed')}</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/booking-history')}
            style={({ pressed }) => [styles.appointment, pressed && styles.pressed]}
          >
            <View style={styles.appointmentPet}>
              <View style={styles.petAvatarWrap}>
                <Image source={homeImages.pet} style={styles.petAvatar} resizeMode="cover" />
                <View style={styles.petStatus} />
              </View>
              <View style={styles.appointmentCopy}>
                <View style={styles.petLine}>
                  <Text numberOfLines={1} style={styles.petName}>{homeMock.pet.name}</Text>
                  <Text style={styles.dot}>•</Text>
                  <Text numberOfLines={1} style={styles.petBreed}>{t(homeMock.pet.breedKey)}</Text>
                </View>
                <View style={styles.when}>
                  <MaterialIcons color={theme.colors.primary} name="schedule" size={15} />
                  <Text style={styles.whenLabel}>{t('home.appointmentTomorrow', { time: appointmentTime })}</Text>
                </View>
              </View>
            </View>
            <View style={styles.appointmentChevron}>
              <MaterialIcons color={theme.colors.textSecondary} name={chevron} size={18} />
            </View>
          </Pressable>
        </View>
      </ScrollView>
      <BottomTabBar active="home" insetBottom={insets.bottom} />
    </View>
  );
}

function greetingTranslationKey() {
  const hour = new Date().getHours();
  if (hour < 12) return 'home.greetingMorning';
  if (hour < 17) return 'home.greetingAfternoon';
  return 'home.greetingEvening';
}

function formatHomeDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function formatAppointmentTime(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function homeStyles(theme: Theme) {
  return createStyles((t) => ({
    screen: {
      backgroundColor: t.colors.background,
      flex: 1,
    },
    content: {
      gap: t.spacing.xl,
      paddingBottom: t.spacing.lg,
      paddingHorizontal: t.spacing.gutter,
      paddingTop: t.spacing.sm,
    },
    greetingRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    greetingCopy: {
      flex: 1,
      gap: t.spacing.xs,
      paddingEnd: t.spacing.sm,
    },
    greetingLine: {
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: t.spacing.xs,
    },
    greeting: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.display,
      fontSize: t.typography.sizes.headline,
      lineHeight: t.typography.lineHeights.headline,
    },
    paw: {
      fontSize: 20,
    },
    subtitle: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
    },
    spa: {
      alignItems: 'center',
      backgroundColor: t.colors.secondaryContainer,
      borderRadius: t.radii.pill,
      height: t.spacing.icon,
      justifyContent: 'center',
      width: t.spacing.icon,
      ...cardShadow(t.colors.overlay),
    },
    hero: {
      backgroundColor: t.colors.surface,
      borderRadius: t.radii.hero,
      overflow: 'hidden',
      ...cardShadow(t.colors.overlay),
    },
    heroMedia: {
      aspectRatio: 4 / 3,
      overflow: 'hidden',
      width: '100%',
    },
    heroImage: {
      height: '100%',
      width: '100%',
    },
    heroIncoming: {
      ...absoluteFill,
    },
    heroScrim: {
      ...absoluteFill,
    },
    badge: {
      alignItems: 'center',
      backgroundColor: t.colors.surface,
      borderRadius: t.radii.pill,
      flexDirection: 'row',
      gap: 6,
      left: t.spacing.md,
      paddingHorizontal: 12,
      paddingVertical: t.spacing.xs,
      position: 'absolute',
      top: t.spacing.md,
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
    heroCopy: {
      bottom: t.spacing.gutter,
      gap: t.spacing.sm,
      left: t.spacing.gutter,
      position: 'absolute',
      right: t.spacing.gutter,
    },
    heroTitle: {
      color: t.colors.surface,
      fontFamily: t.typography.fontFamilies.display,
      fontSize: t.typography.sizes.headline,
      lineHeight: t.typography.lineHeights.headline,
    },
    heroSubtitle: {
      color: t.colors.onOverlay,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
    },
    heroDots: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 6,
      marginTop: t.spacing.sm,
    },
    heroDot: {
      backgroundColor: t.colors.onOverlay,
      borderRadius: t.radii.pill,
      height: 6,
      opacity: 0.45,
      width: 6,
    },
    heroDotOn: {
      backgroundColor: t.colors.surface,
      opacity: 1,
      width: 16,
    },
    heroActions: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: t.spacing.md,
      padding: t.spacing.gutter,
    },
    book: {
      alignItems: 'center',
      backgroundColor: t.colors.primaryContainer,
      borderRadius: t.radii.button,
      flex: 1,
      flexDirection: 'row',
      gap: t.spacing.sm,
      height: t.spacing.control,
      justifyContent: 'center',
    },
    bookPressed: {
      backgroundColor: t.colors.primary,
      transform: [{ scale: 0.98 }],
    },
    bookLabel: {
      color: t.colors.primaryText,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    favorite: {
      alignItems: 'center',
      backgroundColor: t.colors.surfaceSecondary,
      borderRadius: t.radii.pill,
      height: t.spacing.control,
      justifyContent: 'center',
      width: t.spacing.control,
    },
    pressed: {
      opacity: 0.85,
    },
    section: {
      gap: t.spacing.md,
    },
    sectionHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    sectionTitle: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.heading,
      lineHeight: t.typography.lineHeights.heading,
    },
    viewMenu: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    viewMenuLabel: {
      color: t.colors.primary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
    },
    serviceGrid: {
      flexDirection: 'row',
      gap: t.spacing.md,
    },
    schedule: {
      gap: t.spacing.sm,
      paddingBottom: t.spacing.sm,
    },
    scheduleHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: t.spacing.xs,
    },
    scheduleKicker: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      letterSpacing: 0.8,
      lineHeight: t.typography.lineHeights.overline,
      textTransform: 'uppercase',
    },
    kickerRtl: {
      letterSpacing: 0,
      textTransform: 'none',
    },
    confirmed: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: t.spacing.xs,
    },
    confirmedDot: {
      backgroundColor: t.colors.secondary,
      borderRadius: t.radii.pill,
      height: 6,
      width: 6,
    },
    confirmedLabel: {
      color: t.colors.secondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      lineHeight: t.typography.lineHeights.overline,
    },
    appointment: {
      alignItems: 'center',
      backgroundColor: t.colors.surface,
      borderRadius: t.radii.card,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: t.spacing.md,
      ...cardShadow(t.colors.overlay),
    },
    appointmentPet: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
      gap: t.spacing.md,
      minWidth: 0,
    },
    petAvatarWrap: {
      height: t.spacing.avatar,
      width: t.spacing.avatar,
    },
    petAvatar: {
      borderRadius: t.radii.pill,
      height: t.spacing.avatar,
      width: t.spacing.avatar,
    },
    petStatus: {
      backgroundColor: t.colors.secondary,
      borderColor: t.colors.surface,
      borderRadius: t.radii.pill,
      borderWidth: 2,
      bottom: 0,
      height: 14,
      position: 'absolute',
      right: 0,
      width: 14,
    },
    appointmentCopy: {
      flex: 1,
      minWidth: 0,
    },
    petLine: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: t.spacing.xs,
    },
    petName: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    dot: {
      color: t.colors.textSecondary,
      fontSize: 12,
    },
    petBreed: {
      color: t.colors.textSecondary,
      flexShrink: 1,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
    },
    when: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: t.spacing.xs,
      marginTop: 2,
    },
    whenLabel: {
      color: t.colors.primary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
    },
    appointmentChevron: {
      alignItems: 'center',
      backgroundColor: t.colors.surfaceSecondary,
      borderRadius: t.radii.pill,
      height: 36,
      justifyContent: 'center',
      marginStart: t.spacing.sm,
      width: 36,
    },
  }), theme);
}

const absoluteFill = {
  bottom: 0,
  left: 0,
  position: 'absolute' as const,
  right: 0,
  top: 0,
};
