import { useMemo } from 'react';
import { I18nManager, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cardShadow } from '@/components/ServiceCard';
import { confirmationBookings } from '@/mocks/confirmation';
import { paymentMock } from '@/mocks/payment';
import { createStyles, useTheme, type Theme } from '@/theme';

export function SuccessScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => successStyles(theme), [theme]);
  const forward = I18nManager.isRTL ? 'arrow-back' : 'arrow-forward';
  const totalLabel = `${t('confirmation.money', { value: paymentMock.total.toFixed(2) })}`;

  return (
    <View style={[styles.screen, { paddingBottom: Math.max(insets.bottom, theme.spacing.md), paddingTop: insets.top + theme.spacing.lg }]}>
      <View style={styles.content}>
      
        <View style={styles.hero}>
          <View style={styles.badgeWrap}>
            <View style={styles.glowDotOne} />
            <View style={styles.glowDotTwo} />
            <View style={styles.glowDotThree} />
            <View style={styles.glowDotFour} />
            <View style={styles.badgeRing}>
              <View style={styles.badge}>
                <MaterialIcons color={theme.colors.primaryText} name="check" size={34} />
              </View>
            </View>
          </View>

          <View style={styles.completed}>
            <MaterialIcons color={theme.colors.onSecondaryContainer} name="verified" size={14} />
            <Text style={styles.completedLabel}>{t('success.paymentCompleted')}</Text>
          </View>

          <Text style={styles.headline}>{t('success.headline')}</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>BOOKING REFERENCE</Text>
            <View style={styles.paid}>
              <Text style={styles.paidLabel}>{t('success.paid')}</Text>
            </View>
          </View>

          <Text style={styles.orderMeta}>{t('success.order', { id: paymentMock.orderId })}</Text>

          <View style={styles.serviceSection}>
            <Text style={styles.serviceHeader}>SCHEDULED SERVICES</Text>

            {confirmationBookings.map((booking) => (
              <View key={booking.id} style={styles.serviceRow}>
                <View style={styles.petMeta}>
                  <View style={styles.petIconWrap}>
                    <MaterialIcons color={theme.colors.primary} name={booking.serviceIcon === 'spa' ? 'spa' : 'pets'} size={18} />
                  </View>
                  <View style={styles.serviceText}>
                    <Text style={styles.petName}>{booking.name}</Text>
                    <Text style={styles.serviceName}>{t(booking.serviceKey)}</Text>
                  </View>
                </View>
                <Text style={styles.price}>{t('confirmation.money', { value: booking.servicePrice.toFixed(2) })}</Text>
              </View>
            ))}
          </View>

          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <MaterialIcons color={theme.colors.textSecondary} name="event" size={18} />
              <Text style={styles.infoText}>Sat, Oct 20, 2024 · 2:30 PM (90 mins)</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons color={theme.colors.textSecondary} name="location-on" size={18} />
              <Text style={styles.infoText}>PawCare Studio • Downtown Sanctuary</Text>
            </View>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{totalLabel}</Text>
          </View>
        </View>

        <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, theme.spacing.sm) }]}>
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
    </View>
  );
}

function successStyles(theme: Theme) {
  return createStyles((t) => ({
    screen: {
      backgroundColor: '#F3F3F3',
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    content: {
      alignSelf: 'stretch',
      width: '100%',
    },
    actions: {
      gap: 6,
      marginTop: 8,
    },
    topBar: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      paddingVertical: 2,
    },
    brandWrap: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
    },
    brandIcon: {
      alignItems: 'center',
      backgroundColor: '#F8E4D2',
      borderRadius: 12,
      height: 26,
      justifyContent: 'center',
      width: 26,
    },
    brand: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 22,
      lineHeight: 26,
    },
    hero: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      paddingTop: 4,
    },
    badgeWrap: {
      alignItems: 'center',
      height: 140,
      justifyContent: 'center',
      marginBottom: 12,
      position: 'relative',
      width: 164,
    },
    glowDotOne: {
      backgroundColor: t.colors.secondaryContainer,
      borderRadius: 999,
      height: 10,
      position: 'absolute',
      right: 12,
      top: 14,
      width: 10,
    },
    glowDotTwo: {
      backgroundColor: t.colors.secondaryContainer,
      borderRadius: 999,
      bottom: 26,
      height: 10,
      left: 16,
      position: 'absolute',
      width: 10,
    },
    glowDotThree: {
      backgroundColor: t.colors.secondaryContainer,
      borderRadius: 999,
      bottom: 18,
      height: 8,
      position: 'absolute',
      right: 28,
      width: 8,
    },
    glowDotFour: {
      backgroundColor: t.colors.secondaryContainer,
      borderRadius: 999,
      height: 8,
      left: 28,
      position: 'absolute',
      top: 26,
      width: 8,
    },
    badgeRing: {
      alignItems: 'center',
      backgroundColor: t.colors.secondaryContainer,
      borderRadius: 999,
      height: 118,
      justifyContent: 'center',
      width: 118,
    },
    badge: {
      alignItems: 'center',
      backgroundColor: t.colors.secondary,
      borderRadius: 999,
      height: 88,
      justifyContent: 'center',
      width: 88,
      shadowColor: t.colors.secondary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.18,
      shadowRadius: 18,
    },
    completed: {
      alignItems: 'center',
      backgroundColor: t.colors.secondaryContainer,
      borderRadius: 999,
      flexDirection: 'row',
      gap: 6,
      marginBottom: 10,
      paddingHorizontal: 14,
      paddingVertical: 6,
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
      lineHeight: 44,
      textAlign: 'center',
    },
    summaryCard: {
      backgroundColor: '#F2F4F6',
      borderRadius: 18,
      marginTop: 20,
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 12,
      width: '100%',
    },
    summaryRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    summaryLabel: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 11,
      letterSpacing: 0.8,
      lineHeight: 14,
      textTransform: 'uppercase',
    },
    paid: {
      alignItems: 'center',
      backgroundColor: '#E7EFEA',
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    paidLabel: {
      color: '#3A6A5B',
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 10,
      letterSpacing: 0.7,
      lineHeight: 12,
      textTransform: 'uppercase',
    },
    orderMeta: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.bodyLarge,
      lineHeight: t.typography.lineHeights.body,
      marginTop: 10,
    },
    serviceSection: {
      backgroundColor: '#F8F8F8',
      borderRadius: 14,
      marginTop: 14,
      padding: 12,
    },
    serviceHeader: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 11,
      letterSpacing: 0.8,
      lineHeight: 14,
      marginBottom: 8,
      textTransform: 'uppercase',
    },
    serviceRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    petMeta: {
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1,
      minWidth: 0,
    },
    petIconWrap: {
      alignItems: 'center',
      backgroundColor: '#F8E4D2',
      borderRadius: 12,
      height: 28,
      justifyContent: 'center',
      marginRight: 10,
      width: 28,
    },
    serviceText: {
      flexShrink: 1,
      minWidth: 0,
    },
    petName: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
      textAlign: 'left',
    },
    serviceName: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: 12,
      lineHeight: 16,
      textAlign: 'left',
    },
    price: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 15,
      lineHeight: 20,
      marginLeft: 10,
    },
    infoList: {
      gap: 10,
      marginTop: 14,
      paddingTop: 4,
    },
    infoRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
    },
    infoText: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
    },
    totalRow: {
      alignItems: 'center',
      backgroundColor: '#EDF5F1',
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 14,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    totalLabel: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 14,
      lineHeight: 18,
    },
    totalValue: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 18,
      lineHeight: 22,
    },
    history: {
      alignItems: 'center',
      backgroundColor: t.colors.primaryContainer,
      borderRadius: 18,
      flexDirection: 'row',
      gap: 10,
      height: 60,
      justifyContent: 'center',
      marginTop: 8,
    },
    historyLabel: {
      color: t.colors.primaryText,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    home: {
      alignItems: 'center',
      paddingBottom: 8,
      paddingVertical: 8,
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
