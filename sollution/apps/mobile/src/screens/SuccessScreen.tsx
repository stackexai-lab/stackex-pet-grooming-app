import { useMemo } from 'react';
import { I18nManager, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cardShadow } from '@/components/ServiceCard';
import { paymentMock } from '@/mocks/payment';
import { createStyles, useTheme, type Theme } from '@/theme';

export function SuccessScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => successStyles(theme), [theme]);
  const forward = I18nManager.isRTL ? 'arrow-back' : 'arrow-forward';

  return (
    <View style={[styles.screen, { paddingBottom: Math.max(insets.bottom, theme.spacing.lg), paddingTop: insets.top + theme.spacing.xl }]}>
      <View style={styles.hero}>
        <View style={styles.badgeWrap}>
          <View style={styles.glow} />
          <View style={[styles.sparkle, styles.sparkleTL]} />
          <View style={[styles.sparkle, styles.sparkleTR]} />
          <View style={[styles.sparkle, styles.sparkleBL]} />
          <View style={[styles.sparkle, styles.sparkleBR]} />
          <View style={styles.badge}>
            <MaterialIcons color={theme.colors.primaryText} name="check-circle" size={42} />
          </View>
        </View>
        <View style={styles.completed}>
          <MaterialIcons color={theme.colors.onSecondaryContainer} name="verified" size={14} />
          <Text style={styles.completedLabel}>{t('success.paymentCompleted')}</Text>
        </View>
        <Text style={styles.headline}>{t('success.headline')}</Text>
        <Text style={styles.receipt}>
          {t('success.receiptLead')}
          <Text style={styles.email}>{paymentMock.email}</Text>
          {t('success.receiptTail')}
        </Text>
        <View style={styles.order}>
          <Text style={styles.orderMeta}>{t('success.order', { id: paymentMock.orderId })}</Text>
          <View style={styles.dot} />
          <Text style={styles.orderMeta}>{t('success.cardEnding', { last4: paymentMock.cardLast4 })}</Text>
          <View style={styles.paid}>
            <Text style={styles.paidLabel}>{t('success.paid')}</Text>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable
          onPress={() => router.push('/booking-history')}
          style={({ pressed }) => [styles.history, pressed && styles.pressed]}
        >
          <Text style={styles.historyLabel}>{t('success.orderHistory')}</Text>
          <MaterialIcons color={theme.colors.primaryText} name={forward} size={18} />
        </Pressable>
        <Pressable
          onPress={() => router.replace('/')}
          style={({ pressed }) => [styles.home, pressed && styles.pressed]}
        >
          <Text style={styles.homeLabel}>{t('success.backHome')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function successStyles(theme: Theme) {
  return createStyles((t) => ({
    screen: {
      backgroundColor: t.colors.background,
      flex: 1,
      justifyContent: 'space-between',
      paddingHorizontal: t.spacing.gutter,
    },
    hero: {
      alignItems: 'center',
      paddingTop: t.spacing.sm,
    },
    badgeWrap: {
      alignItems: 'center',
      height: 112,
      justifyContent: 'center',
      marginBottom: t.spacing.md,
      width: 144,
    },
    glow: {
      backgroundColor: t.colors.secondaryContainer,
      borderRadius: t.radii.pill,
      height: 112,
      opacity: 0.55,
      position: 'absolute',
      width: 112,
    },
    sparkle: {
      backgroundColor: t.colors.primaryContainer,
      borderRadius: t.radii.pill,
      opacity: 0.45,
      position: 'absolute',
    },
    sparkleTL: { height: 6, start: 18, top: 22, width: 6 },
    sparkleTR: { end: 16, height: 8, top: 18, width: 8 },
    sparkleBL: { bottom: 28, height: 5, start: 12, width: 5 },
    sparkleBR: { bottom: 32, end: 14, height: 6, width: 6 },
    badge: {
      alignItems: 'center',
      backgroundColor: t.colors.secondary,
      borderRadius: t.radii.pill,
      elevation: 6,
      height: 80,
      justifyContent: 'center',
      shadowColor: t.colors.secondary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.28,
      shadowRadius: 12,
      width: 80,
    },
    completed: {
      alignItems: 'center',
      backgroundColor: t.colors.secondaryContainer,
      borderRadius: t.radii.pill,
      flexDirection: 'row',
      gap: 6,
      marginBottom: t.spacing.sm,
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    completedLabel: {
      color: t.colors.onSecondaryContainer,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      lineHeight: t.typography.lineHeights.overline,
    },
    headline: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.display,
      fontSize: t.typography.sizes.title,
      letterSpacing: -0.4,
      lineHeight: t.typography.lineHeights.display,
      textAlign: 'center',
    },
    receipt: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
      marginTop: t.spacing.sm,
      maxWidth: 320,
      textAlign: 'center',
    },
    email: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
    },
    order: {
      alignItems: 'center',
      backgroundColor: t.colors.surfaceContainer,
      borderRadius: t.radii.pill,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: t.spacing.sm,
      justifyContent: 'center',
      marginTop: t.spacing.lg,
      paddingHorizontal: t.spacing.md,
      paddingVertical: t.spacing.sm,
      ...cardShadow(t.colors.overlay),
    },
    orderMeta: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      lineHeight: t.typography.lineHeights.overline,
    },
    dot: {
      backgroundColor: t.colors.textMuted,
      borderRadius: t.radii.pill,
      height: 4,
      width: 4,
    },
    paid: {
      backgroundColor: t.colors.secondary,
      borderRadius: t.radii.pill,
      paddingHorizontal: t.spacing.sm,
      paddingVertical: 2,
    },
    paidLabel: {
      color: t.colors.primaryText,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      lineHeight: t.typography.lineHeights.overline,
    },
    actions: {
      gap: t.spacing.xs,
      paddingTop: t.spacing.xl,
    },
    history: {
      alignItems: 'center',
      backgroundColor: t.colors.primaryContainer,
      borderRadius: t.radii.button,
      flexDirection: 'row',
      gap: t.spacing.sm,
      height: 56,
      justifyContent: 'center',
    },
    historyLabel: {
      color: t.colors.primaryText,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    home: {
      alignItems: 'center',
      paddingVertical: 12,
    },
    homeLabel: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
    },
    pressed: {
      opacity: 0.9,
    },
  }), theme);
}
