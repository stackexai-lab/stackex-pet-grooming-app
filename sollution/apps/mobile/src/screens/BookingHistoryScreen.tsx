import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabBar } from '@/components/BottomTabBar';
import { HeaderBrand } from '@/components/HeaderBrand';
import { useLanguage } from '@/i18n';
import { bookingHistory } from '@/mocks/bookings';
import { createStyles, useTheme, type Theme } from '@/theme';

export function BookingHistoryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const styles = useMemo(() => historyStyles(theme), [theme]);
  const backIcon = isRTL ? 'arrow-forward' : 'arrow-back';
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedPet, setSelectedPet] = useState<'all' | 'Max' | 'Luna'>('all');
  const bookings = [...bookingHistory].sort((a, b) => b.startsAt.getTime() - a.startsAt.getTime());
  const filteredBookings = selectedPet === 'all'
    ? bookings
    : bookings.filter((booking) => booking.petName === selectedPet);
  const upcoming = filteredBookings.filter((booking) => booking.status === 'pending');
  const past = filteredBookings.filter((booking) => booking.status === 'completed');

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      <View style={styles.phoneShell}>
        <View style={styles.header}>
          <Pressable style={styles.iconButton} onPress={() => router.back()}>
            <MaterialIcons color={theme.colors.ink} name={backIcon} size={20} />
          </Pressable>
          <Text style={[styles.title, { textAlign: isRTL ? 'auto' : 'left' }]}>{t('history.title')}</Text>
          <HeaderBrand />
        </View>

        <View style={styles.segmented}>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'upcoming' }}
            onPress={() => setActiveTab('upcoming')}
            style={[styles.segment, activeTab === 'upcoming' && styles.segmentActive]}
          >
            <Text style={[styles.segmentLabel, activeTab === 'upcoming' && styles.segmentLabelActive]}>
              {t('history.upcoming')}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{upcoming.length}</Text>
            </View>
          </Pressable>

          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'past' }}
            onPress={() => setActiveTab('past')}
            style={[styles.segment, activeTab === 'past' && styles.segmentActive]}
          >
            <Text style={[styles.segmentLabel, activeTab === 'past' && styles.segmentLabelActive]}>
              {t('history.pastVisits')}
            </Text>
            <Text style={styles.segmentCount}>{past.length}</Text>
          </Pressable>
        </View>

        <View style={styles.petFilterRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: selectedPet === 'all' }}
            onPress={() => setSelectedPet('all')}
            style={[styles.petChip, selectedPet === 'all' && styles.petChipActive]}
          >
            <Text style={[styles.petChipLabel, selectedPet === 'all' && styles.petChipLabelActive]}>
              {t('history.allPets')}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: selectedPet === 'Max' }}
            onPress={() => setSelectedPet('Max')}
            style={[styles.petChip, selectedPet === 'Max' && styles.petChipActive]}
          >
            <Text style={[styles.petChipLabel, selectedPet === 'Max' && styles.petChipLabelActive]}>
              Max
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: selectedPet === 'Luna' }}
            onPress={() => setSelectedPet('Luna')}
            style={[styles.petChip, selectedPet === 'Luna' && styles.petChipActive]}
          >
            <Text style={[styles.petChipLabel, selectedPet === 'Luna' && styles.petChipLabelActive]}>
              Luna
            </Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {activeTab === 'upcoming' ? (
            <>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>
                  {t('history.upcomingVisit')}
                </Text>
              </View>

              {upcoming.map((booking) => (
                <View key={booking.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.petInfo}>
                      <Image
                        source={booking.photo}
                        style={styles.photo}
                        resizeMode="cover"
                      />
                      <View style={styles.petCopy}>
                        <Text style={styles.name}>{booking.petName}</Text>
                        <Text style={styles.breed}>{t(booking.breedKey)}</Text>
                      </View>
                    </View>

                    <View style={styles.pendingPill}>
                      <View style={styles.pillDot} />
                      <Text style={styles.pendingText}>
                        {t('history.pending')}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.serviceRow}>
                    <Text style={styles.service}>{t(booking.serviceKey)}</Text>
                    <Text style={styles.metaLabel}>
                      {t('confirmation.money', {
                        value: booking.price.toFixed(2),
                      })}
                    </Text>
                  </View>

                  <View style={styles.infoLine}>
                    <MaterialIcons
                      color={theme.colors.textSecondary}
                      name="event"
                      size={16}
                    />
                    <Text style={styles.infoText}>
                      {t('history.upcomingDate')}
                    </Text>
                  </View>

                  <View style={styles.infoLine}>
                    <MaterialIcons
                      color={theme.colors.textSecondary}
                      name="place"
                      size={16}
                    />
                    <Text style={styles.infoText}>
                      {t('history.upcomingStylist')}
                    </Text>
                  </View>
                </View>
              ))}

              {upcoming.length === 0 && (
                <Text style={styles.emptyText}>
                  {t('history.noUpcomingForPet')}
                </Text>
              )}
            </>
          ) : (
            <>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>
                  {t('history.pastVisits')}
                </Text>
              </View>

              {past.map((booking) => (
                <View key={booking.id} style={styles.pastCard}>
                  <View style={styles.cardTop}>
                    <View style={styles.petInfo}>
                      <Image
                        source={booking.photo}
                        style={styles.photo}
                        resizeMode="cover"
                      />
                      <View style={styles.petCopy}>
                        <Text style={styles.name}>{booking.petName}</Text>
                        <Text style={styles.breed}>{t(booking.breedKey)}</Text>
                      </View>
                    </View>

                    <View style={styles.completedPill}>
                      <View style={styles.pillDotDone} />
                      <Text style={styles.completedText}>
                        {t('history.completed')}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.serviceRow}>
                    <Text style={styles.service}>{t(booking.serviceKey)}</Text>
                    <Text style={styles.metaLabel}>
                      {t('confirmation.money', {
                        value: booking.price.toFixed(2),
                      })}
                    </Text>
                  </View>

                  <View style={styles.infoLine}>
                    <MaterialIcons
                      color={theme.colors.textSecondary}
                      name="event"
                      size={16}
                    />
                    <Text style={styles.infoText}>
                      {t('history.pastDate')}
                    </Text>
                  </View>

                  <View style={styles.infoLine}>
                    <MaterialIcons
                      color={theme.colors.textSecondary}
                      name="place"
                      size={16}
                    />
                    <Text style={styles.infoText}>
                      {t('history.pastStylist')}
                    </Text>
                  </View>
                </View>
              ))}

              {past.length === 0 && (
                <Text style={styles.emptyText}>
                  {t('history.noPastForPet')}
                </Text>
              )}
            </>
          )}
        </ScrollView>

        <BottomTabBar active="bookings" insetBottom={insets.bottom} />
      </View>
    </View>
  );
}

function historyStyles(theme: Theme) {
  return createStyles((t) => ({
    screen: {
      backgroundColor: t.colors.background,
      flex: 1,
    },
    phoneShell: {
      alignSelf: 'center',
      backgroundColor: t.colors.background,
      flex: 1,
      width: '100%',
      overflow: 'hidden',
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 18,
      paddingVertical: 12,
    },
    iconButton: {
      alignItems: 'center',
      backgroundColor: t.colors.surface,
      borderRadius: t.radii.pill,
      elevation: 2,
      height: 40,
      justifyContent: 'center',
      shadowColor: t.colors.overlay,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      width: 40,
    },
    title: {
      color: t.colors.ink,
      flex: 1,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 18,
      lineHeight: 24,
      marginHorizontal: 10,
    },
    profileButton: {
      alignItems: 'center',
      backgroundColor: t.colors.primary,
      borderRadius: t.radii.pill,
      height: 32,
      justifyContent: 'center',
      width: 32,
    },
    segmented: {
      backgroundColor: t.colors.surfaceContainer,
      borderRadius: 18,
      flexDirection: 'row',
      gap: 6,
      marginHorizontal: 16,
      padding: 6,
    },
    segment: {
      alignItems: 'center',
      borderRadius: 14,
      flex: 1,
      flexDirection: 'row',
      gap: 6,
      justifyContent: 'center',
      paddingVertical: 10,
    },
    segmentActive: {
      backgroundColor: t.colors.surface,
    },
    segmentLabel: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 15,
      lineHeight: 18,
    },
    segmentLabelActive: {
      color: t.colors.ink,
    },
    badge: {
      alignItems: 'center',
      backgroundColor: t.colors.primary,
      borderRadius: 999,
      height: 18,
      justifyContent: 'center',
      minWidth: 18,
      paddingHorizontal: 4,
    },
    badgeText: {
      color: t.colors.primaryText,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 10,
      lineHeight: 12,
    },
    segmentCount: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 12,
      lineHeight: 16,
    },
    petFilterRow: {
      flexDirection: 'row',
      gap: 8,
      marginHorizontal: 16,
      marginTop: 14,
    },
    petChip: {
      backgroundColor: t.colors.surfaceContainer,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    petChipActive: {
      backgroundColor: t.colors.primaryFixedSoft,
    },
    petChipLabel: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 13,
      lineHeight: 16,
    },
    petChipLabelActive: {
      color: t.colors.primary,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    emptyText: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: 14,
      lineHeight: 20,
      paddingVertical: 28,
      textAlign: 'center',
    },
    sectionRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      marginTop: 8,
    },
    sectionTitle: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 11,
      letterSpacing: 0.8,
      lineHeight: 14,
      textTransform: 'uppercase',
    },
    sectionMeta: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 11,
      lineHeight: 14,
    },
    card: {
      backgroundColor: t.colors.surface,
      borderRadius: 18,
      marginBottom: 14,
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: t.colors.border,
    },
    pastCard: {
      backgroundColor: t.colors.surface,
      borderRadius: 18,
      marginBottom: 14,
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: t.colors.border,
    },
    cardTop: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    petInfo: {
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1,
    },
    photo: {
      borderRadius: 16,
      height: 42,
      width: 42,
    },
    petCopy: {
      marginStart: 10,
    },
    name: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 18,
      lineHeight: 22,
    },
    breed: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: 12,
      lineHeight: 16,
      marginTop: 2,
    },
    pendingPill: {
      alignItems: 'center',
      backgroundColor: t.colors.primaryFixed,
      borderRadius: 999,
      flexDirection: 'row',
      gap: 6,
      paddingHorizontal: 8,
      paddingVertical: 5,
    },
    completedPill: {
      alignItems: 'center',
      backgroundColor: t.colors.secondaryContainer,
      borderRadius: 999,
      flexDirection: 'row',
      gap: 6,
      paddingHorizontal: 8,
      paddingVertical: 5,
    },
    pillDot: {
      backgroundColor: t.colors.primary,
      borderRadius: 999,
      height: 8,
      width: 8,
    },
    pillDotDone: {
      backgroundColor: t.colors.success,
      borderRadius: 999,
      height: 8,
      width: 8,
    },
    pendingText: {
      color: t.colors.onPrimaryFixedVariant,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 11,
      lineHeight: 14,
    },
    completedText: {
      color: t.colors.onSecondaryContainer,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 11,
      lineHeight: 14,
    },
    service: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 17,
      lineHeight: 22,
      marginTop: 12,
      flex: 1,
    },
    serviceRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    metaRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    metaLabel: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 18,
      lineHeight: 22,
      marginTop: 12,
    },
    infoLine: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 6,
      marginTop: 8,
    },
    infoText: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: 12,
      lineHeight: 16,
    },
    tabBar: {
      alignItems: 'center',
      backgroundColor: t.colors.surface,
      borderTopColor: t.colors.border,
      borderTopWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 14,
    },
    tabItem: {
      alignItems: 'center',
      flex: 1,
      gap: 4,
      justifyContent: 'center',
    },
    tabItemActive: {
      alignItems: 'center',
      flex: 1,
      gap: 4,
      justifyContent: 'center',
    },
    tabLabel: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 12,
      lineHeight: 16,
    },
    tabLabelActive: {
      color: t.colors.primary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 12,
      lineHeight: 16,
    },
  }), theme);
}
