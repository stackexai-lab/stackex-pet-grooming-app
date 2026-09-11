import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingHistoryCard } from '@/components/BookingHistoryCard';
import { BottomTabBar } from '@/components/BottomTabBar';
import { FlowHeader } from '@/components/FlowHeader';
import { bookingHistory } from '@/mocks/bookings';
import { createStyles, useTheme, type Theme } from '@/theme';

export function BookingHistoryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => historyStyles(theme), [theme]);
  const bookings = [...bookingHistory].sort((a, b) => b.startsAt.getTime() - a.startsAt.getTime());

  return (
    <View style={styles.screen}>
      <FlowHeader brandedLogo elevatedBack insetTop={insets.top} title={t('history.title')} />
      {bookings.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>{t('history.empty')}</Text>
          <Pressable
            onPress={() => router.push('/select-pet')}
            style={({ pressed }) => [styles.book, pressed && styles.pressed]}
          >
            <Text style={styles.bookLabel}>{t('home.bookGrooming')}</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {bookings.map((booking) => (
            <BookingHistoryCard booking={booking} key={booking.id} />
          ))}
        </ScrollView>
      )}
      <BottomTabBar active="bookings" insetBottom={insets.bottom} />
    </View>
  );
}

function historyStyles(theme: Theme) {
  return createStyles((t) => ({
    screen: {
      backgroundColor: t.colors.background,
      flex: 1,
    },
    list: {
      gap: t.spacing.md,
      paddingBottom: t.spacing.lg,
      paddingHorizontal: t.spacing.gutter,
      paddingTop: t.spacing.md,
    },
    empty: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: t.spacing.xl,
    },
    emptyTitle: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.body,
      lineHeight: t.typography.lineHeights.body,
      marginBottom: t.spacing.lg,
      textAlign: 'center',
    },
    book: {
      alignItems: 'center',
      backgroundColor: t.colors.primaryContainer,
      borderRadius: t.radii.button,
      height: t.spacing.control,
      justifyContent: 'center',
      minWidth: 200,
      paddingHorizontal: t.spacing.lg,
    },
    bookLabel: {
      color: t.colors.primaryText,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    pressed: {
      opacity: 0.92,
    },
  }), theme);
}
